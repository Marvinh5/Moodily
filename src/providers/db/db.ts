import {
  IGoal
} from './../../models/goals';
import {
  Injectable
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

  constructor(private events: Events, private storage: Storage) {}

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
        x =  Object.assign(x, goal);
      }

      return x;
	
	});

	console.log('modifiedGoals', JSON.stringify(modifiedGoals))

	await this.storage.set('goals', modifiedGoals);
	
	this.events.publish('goals', modifiedGoals);
  }

  async goals() {
	 return await  this.storage.get('goals');
  }
 
  async addComment(goalId, comment) {

    let comments = await this.storage.get('comments');

    if (!comments) comments = [];

    comments.push({
      goalId,
      content: comment
    })

    await this.storage.set('comments', comments);
  }

  async getComments(goalId) {

    let comments: any[] = await this.storage.get('comments');

    return comments.filter(comment => comment.goalId = goalId);

  }

  async getTodayGoals() {

    try {

      var goals: IGoal[] = await this.storage.get('goals');

      if (!goals) return [];

      let resultGoals = goals.filter(goal => {
        return moment(goal.date).isSameOrAfter(moment(), 'day') && 
      });

      console.log('resultgoals', resultGoals);

      return resultGoals;
    } catch (err) {
      console.error('erro on goals', JSON.stringify(err))
    }
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

}
