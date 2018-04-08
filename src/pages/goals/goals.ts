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

  completedGoals: any[] = []

  missedGoals: any[] = []


  goalsCompletedPagination = { from: 0, to: 10, total: 0 }
  goalsMissedGoalsPagination = { from: 0, to: 10, total: 0 }

  // @ViewChild('myTabs') tabRef: Tabs;

  constructor(public db: DbProvider, public navCtrl: NavController, public navParams: NavParams) {

  }

  ionViewDidLoad() {
    this.getGoals();
  }


  getGoals() {
    return this.db.goals().then((goals: any[]) => {

      let sortFun = (a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      };

      var completedGoals = goals.filter(goal => goal.done);

      this.goalsCompletedPagination.total = completedGoals.length;

      this.completedGoals = completedGoals.sort(sortFun).slice(this.goalsCompletedPagination.from, this.goalsCompletedPagination.to);

      var missedGoals = goals.filter(goal => {
        return moment(goal.date).isBefore(moment(), 'day') && !goal.done && (!goal.percent || goal.percent < 100)
      });

      this.missedGoals = missedGoals.sort(sortFun).slice(this.goalsMissedGoalsPagination.from, this.goalsMissedGoalsPagination.to);

      this.goalsMissedGoalsPagination.total = completedGoals.length;



    });
  }


  loadMissedGoals(infiniteScroll) {


    if (this.goalsMissedGoalsPagination.total < this.goalsMissedGoalsPagination.to + 10) {

      this.goalsMissedGoalsPagination.to = this.goalsMissedGoalsPagination.to + 10

    } else if (this.goalsMissedGoalsPagination.total != this.goalsMissedGoalsPagination.to) {

      this.goalsMissedGoalsPagination.to = this.goalsMissedGoalsPagination.total;
    } else {
      return;
    }
    setTimeout(() => {
      this.getGoals().then(() => infiniteScroll.complete());
    }, 600);

  }

  loadMoreCompletedGoals(infiniteScroll) {
    if (this.goalsCompletedPagination.total < this.goalsCompletedPagination.to + 10) {

      this.goalsCompletedPagination.to = this.goalsCompletedPagination.to + 10

    } else if (this.goalsCompletedPagination.total != this.goalsCompletedPagination.to) {

      this.goalsCompletedPagination.to = this.goalsCompletedPagination.total;
    }
    else {
      return;
    }

    setTimeout(() => {
      this.getGoals().then(() => setTimeout(() => infiniteScroll.complete(), 500));
    }, 600);
  }


}
