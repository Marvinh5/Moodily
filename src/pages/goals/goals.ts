import { MissedGoalsPage } from './../missed-goals/missed-goals';
import { CompletedGoalsPage } from './../completed-goals/completed-goals';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Tabs } from 'ionic-angular';
import { DbProvider } from '../../providers/db/db';
import moment from 'moment'

/**
 * Generated class for the GoalsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-goals',
  templateUrl: 'goals.html',
})
export class GoalsPage {

  tab1Root: CompletedGoalsPage;
  tab2Root: MissedGoalsPage;
  
  goalStatus: any = "completed"

  completedGoals: any[] =  [{title: 'kill the opresors', date: new Date()}]

  missedGoals: any[] = []

  // @ViewChild('myTabs') tabRef: Tabs;

  constructor(public db: DbProvider, public navCtrl: NavController, public navParams: NavParams) {
    
  }

  ionViewDidLoad() {
    this.db.goals().then((goals: any[])=> {
        
        this.completedGoals = goals.filter(goal=> goal.done || goal.percent > 100);
        
        this.missedGoals = goals.filter(goal => {
            return moment(goal.date).isBefore(moment(), 'day')
        });

    });
  }

}
