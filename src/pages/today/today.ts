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

  constructor(private events: Events, public db: DbProvider, public alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {

    

    this.db.getTodayGoals().then(goals => {
      this.pendingGoals = goals;
    });
    
    this.events.subscribe('goals', (goals: IGoal[]) => {
      this.pendingGoals = goals.filter(goal=>  !goal.done);
    });

  }



  async removeSelectedGoals() {
    let goals: string[] = this.pendingGoals.filter(goal=> goal.selected).map(goal=> goal.id);
    console.log('goals to remove', JSON.stringify(goals));
    await this.db.removeGoals(goals);
  }

  getSelectedGoals() {
    return this.pendingGoals.filter(goal => goal.selected);
  }

  complete(goal) {
    this.db.modifyGoal(Object.assign(goal, {percent: 100, done: true}));
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
    
    let goals: any[] = this.pendingGoals.filter(goal=> goal.selected).map(goal=> goal.id);
    
    await Promise.all(goals.map(async goalId=> {
     await this.db.addComment(goalId, this.comment)
    }));

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
