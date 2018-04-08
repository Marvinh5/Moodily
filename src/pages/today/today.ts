import { DbProvider } from './../../providers/db/db';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Events } from 'ionic-angular';
import { IGoal } from '../../models/goals';

/**
 * Generated class for the TodayPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-today',
  templateUrl: 'today.html',
})
export class TodayPage {

  pendingGoals: any[] = [];

  comment:string;

  type: string = "goals"

  commentsFilter = { from: 0 , to: 50};

  comments: any[] = [];

  commentId:any 

  constructor(private events: Events, public db: DbProvider, public alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {

    this.db.getTodayGoals().then(goals => {
      this.pendingGoals = goals.sort((a, b)=> new Date(b.date).getTime() - new Date(a.date).getTime() );
    });

    this.getComments();

    this.events.subscribe('comments', ()=> {
      this.getComments();
    });
    
    this.events.subscribe('goals', (goals: IGoal[]) => {
      
      this.db.getTodayGoals().then(goals=> {
        this.pendingGoals = goals.sort((a, b)=> new Date(b.date).getTime() - new Date(a.date).getTime() );
      });

    });

  }


  undoGoal(goalId) {
    this.db.undoGoal(goalId)
  }




  getComments(){ 
    
    this.db.getCommentsFromToday().then(comments=> {
      this.comments = comments
    });

  }


  deleteGoal(goal) {
    
    let alert = this.alertCtrl.create({
      message: 'are you sure you want to delete this goal?',
      buttons: [
        {
          text: 'Cancel'
        },
        {
          text: 'Accept',
          handler: ()=> {
              this.db.removeGoals([goal.id])
          }
        }
      ]
    });

    alert.present()

  }



  deleteComment(comment) {

    let alert = this.alertCtrl.create({
      message: 'are you sure you want to delete this comment?',
      buttons: [
        {
          text: 'Cancel'
        },
        {
          text: 'Accept',
          handler: ()=> {
            this.db.removeComments([comment.id])
          }
        }
      ]
    });

    alert.present()
  }


  editComment(comment){
    this.alertCtrl.create({
      message: 'Edit comment',
      inputs: [
        {
          type: 'text-area',
          name: 'comment',
          value: comment.content
        }
      ],
      buttons:[
        {
          text: 'Cancel'
        },
        {
          text: 'Accept',
          handler: (data)=> {
            if(data.comment && data.comment != ""){
              console.log(comment.id, data.comment);
              this.db.editComment(comment.id, data.comment);
            }
          }
        }
      ]
    }).present();
  }


  async removeSelectedGoals() {
    let goals: string[] = this.pendingGoals.filter(goal=> goal.selected).map(goal=> goal.id);

    if(goals.length > 0) {
      await this.db.removeGoals(goals);    
    }

    let comments: string[] = this.comments.filter(comment => comment.selected).map(comment=> comment.id);

    if(comments.length > 0 ){
      await this.db.removeComments(comments); 
    }

  }

  getSelectedGoals() {
    return this.pendingGoals.filter(goal => goal.selected);
  }

  complete(goal) {
    this.db.modifyGoal(Object.assign(goal, {percent: 100, done: true}));
  }

  isAnyCommentSelected() {
    return this.comments.filter(comment=>  comment.selected).length > 0
  }

  setPercent(goal) {
    this.alertCtrl.create({
      title: 'Percent',
      message: 'Change the goal percent',
      inputs: [
        {
          name:  'percent',
          placeholder: 'Percent',
          type: 'number'
        }
      ],
      buttons: [
        {
          text: 'Cancel'
        },
        {
          text: 'Save',
          handler: (data) => {
            if(!data.percent) return;

            this.db.modifyGoal(Object.assign(goal, {percent: data.percent}))
          }
        }
      ]
    }).present();
  }

  async addComments() {

    await this.db.addComment(this.comment)

    this.comment = "";

  }

  openAddGoalModal() {

    this.alertCtrl.create({
      title: 'NEW GOAL',
      message: 'Enter the goal info',
      inputs: [
        {
          name: 'title',
          placeholder: 'Title'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {

          }
        },
        {
          text: 'Save',
          handler: data => {
            if (!data.title) return;

            this.db.addGoal({
              title: data.title
            });

          }
        }
      ]
    }).present();

  }

}
