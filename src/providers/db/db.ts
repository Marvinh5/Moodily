import {
  IGoal
} from './../../models/goals';
import {
  Injectable, group
} from '@angular/core';
import {
  Storage
} from '@ionic/storage'
import * as _ from 'lodash'
import {
  Events
} from 'ionic-angular';
import * as uuid from 'uuid'
import moment from 'moment'
/*
  Generated class for the DbProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DbProvider {

  constructor(private events: Events, private storage: Storage) { }

  async addGoal(goal: IGoal) {

    goal.id = uuid();
    goal.date = new Date();

    var goals = await this.storage.get('goals');

    if (!goals) goals = [];

    goals.push(goal);

    console.log('goals o add', JSON.stringify(goal), JSON.stringify(goals))

    await this.storage.set('goals', goals);

    this.events.publish('goals', goals);

  }

  async modifyGoal(goal) {
    let goals: any[] = await this.storage.get('goals');

    console.log()

    let modifiedGoals = goals.map(x => {

      console.log(x.id, goal.id);

      if (x.id == goal.id) {
        console.log('modifying', x, goal, Object.assign(x, goal))
        x = Object.assign(x, goal);
      }

      return x;

    });

    console.log('modifiedGoals', JSON.stringify(modifiedGoals))

    await this.storage.set('goals', modifiedGoals);

    this.events.publish('goals', modifiedGoals);
  }

  async goals() {
    return await this.storage.get('goals');
  }

  async addComment(comment) {

    let comments = await this.storage.get('comments');

    if (!comments) comments = [];

    comments.push({
      id: uuid(),
      content: comment
    })

    await this.storage.set('comments', comments);

    this.events.publish('comments');
  }

  // async getComments(goalId) {

  //   let comments: any[] = await this.storage.get('comments');

  //   return comments.filter(comment => comment.goalId = goalId);

  // }


  async getGoalsBy(dateGroup) {

    let goals = await this.storage.get('goals');

    console.log('goals=>' , JSON.stringify(goals));

    let groupByFunction = (goal) => {

      let d:moment.Moment = moment(goal.date);
      let key: any

      if (dateGroup == 'month') key = d.format('M');
      // if (dateGroup == 'month') key = d.month();
      
      if (dateGroup == 'day') key = d.dayOfYear();
      if (dateGroup == 'week') key = d.isoWeek();

      return d.year() + '-' + key
    }

    let goalsGroupedBy = _.groupBy(goals, groupByFunction);

    let goalsCount = Object.keys(goalsGroupedBy).map(key => {
      return {
        completedGoals: goalsGroupedBy[key].filter(goal => {
          return goal.done
        }).length,
        missedGoals: goalsGroupedBy[key].filter(goal => {
          return (!goal.done) && moment(goal.date).isBefore(moment(), 'day')
        }).length,
        key
      }
    });

    let moods = await this.storage.get('moods');

    let moodsGroupedBy = _.groupBy(moods, groupByFunction);

    let moodCount = Object.keys(moodsGroupedBy).map(key => {
      return {
        key, ...moodsGroupedBy[key].reduce((prev, current, index) => {

          if (current.id == "happy") prev.happy += 1;
          if (current.id == "sad") prev.sad += 1;
          if (current.id == "embarrassed") prev.embarrassed += 1;
          if (current.id == "angry") prev.angry += 1;
          if (current.id == "nervous") prev.nervous += 1;
          if (current.id == "inLove") prev.inLove += 1;



          return prev;

        }, { happy: 0, sad: 0, embarrassed: 0, angry: 0, nervous: 0, inLove: 0 })
      }
    });

    let goalsPlusMoods = _.groupBy(goalsCount.concat(moodCount), x => x.key); 

    let result = Object.keys(goalsPlusMoods).map(key=> {
      
      let val = goalsPlusMoods[key];

      let date, dateString;

      if(dateGroup == 'month') date = moment(key, 'YYYY-M').toDate();
      if(dateGroup == 'day') date = moment(key, 'YYYY-DDD').toDate();
      if(dateGroup == 'week') {
        // console.log(key)
        date = moment(key, 'YYYY-W').toDate();
        let start:moment.Moment = moment(date).startOf('isoWeek');
        let end:moment.Moment = moment(date).endOf('isoWeek');

        dateString = `${start.format('MMM')} ${start.format('Do')} to ${start.format('MMM')}  ${end.format('Do')}, ${end.year()}`
      }
      
      return {date, dateString, ...val.reduce((prev, current, index)=> {
          return Object.assign(prev, current);
      }, {})}
      
    });

    return result;

  }

  async getTodayMoods() {
    
    var moods: any[] = await this.storage.get('moods') || [];
    

    return moods.filter(mood=> moment(mood.date).isSameOrAfter(moment(), 'day'))
  
  }

  async getTodayGoals() {

    try {

      var goals: IGoal[] = await this.storage.get('goals');

      if (!goals) return [];

      let resultGoals = goals.filter(goal => {
        return moment(goal.date).isSameOrAfter(moment(), 'day') 
        // && (!goal.done || goal.percent < 100)
      });

      console.log('resultgoals', resultGoals);

      return resultGoals;
    } catch (err) {
      console.error('erro on goals', JSON.stringify(err))
    }
  }

  async undoGoal(goalId){
    
      let goals = await this.storage.get('goals');

      if(!goals) return [];

      goals = goals.map(goal=> {
        if(goal.id == goalId){
            goal.done = false;
        }
        return goal;
      });

      await this.storage.set('goals', goals);

      this.events.publish('goals', goals);

      return true;

  }

  async removeGoals(goalIds: string[]) {

    var goals: IGoal[] = await this.storage.get('goals');

    goals = goals.filter(goal => {
      return goalIds.filter(id => id == goal.id).length == 0
    });

    await this.storage.set('goals', goals);

    this.events.publish('goals', goals);

  }

  async removeGoal(goalId) {

    var goals: IGoal[] = await this.storage.get('goals');

    goals = goals.filter(goal => goal.id != goalId);

    console.log('filtered goals =>', goals);

    await this.storage.set('goals', goals);

    this.events.publish('goals', goals);

  }

  async getGoal(goalId: string) {

    var goals = await this.storage.get('goals');

    if (!goals) return null;

    goals = JSON.parse(goals);

    return _.find(goals, {
      id: goalId
    })
  }


  async addMood(mood) {

    let moods: any[] = await this.storage.get('moods') || [];

    let newMood = Object.assign(mood, { date: new Date() })

    moods.push(newMood);

    this.events.publish('newMood', newMood)

    await this.storage.set('moods', moods);

  }

  async getComments(from, to) {

    let comments: any[] = await this.storage.get('comments') || [];

    comments = comments.sort((a, b) => {

      let aDate = new Date(a.date).getTime();
      let bDate = new Date(b.date).getTime();

      return aDate - bDate;

    });

    return comments.slice(from || 0, to || 10)

  }

  async removeComments(commentsIds: string[]) {

    let comments: any[] = await this.storage.get('comments') || [];

    comments = comments.filter(comment => commentsIds.indexOf(comment.id) == -1);

    await this.storage.set('comments', comments);

    this.events.publish('comments');

    return comments;

  }

  async editComment(id, content) {

    let comments: any[] = await this.storage.get('comments') || [];
    
    comments = comments.map(comment=> {
      if(comment.id == id){
        comment.content = content
      }
      return comment;
    });

    await this.storage.set('comments', comments);

    this.events.publish('comments');

    return comments;

  }

  async getCommentsFromToday() {

    // await this.storage.set('comments', []); 

    let comments: any[] = await this.storage.get('comments') || [];

    return comments.filter(comment => {
      return moment(comment.date).isSameOrAfter(new Date(), 'day')
    });

  }

}
