import { DbProvider } from './../../providers/db/db';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the CalendarPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-calendar',
  templateUrl: 'calendar.html',
})
export class CalendarPage {

  dates: {
    happy?: number, date?: Date, sad?: number, stressed?: number, angry?: number, inLove?: number, embarrassed?: number
  }[] = [];

  by: 'month' | 'day' | 'week' = 'day'

  constructor(public db: DbProvider, public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.getGoals();
  }

  getGoals() {
    this.db.getGoalsBy(this.by).then((dates:any) => {
      this.dates = dates.sort((a, b) => {
        return  b.date.getTime() - a.date.getTime() 
      });
    })
  }

}
