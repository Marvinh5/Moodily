import { DbProvider } from './../providers/db/db';
import { MoodPage } from './../pages/mood/mood';
import { CalendarPage } from './../pages/calendar/calendar';
import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { TodayPage } from '../pages/today/today';
import { GoalsPage } from '../pages/goals/goals';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  @ViewChild('Myfab')
  Myfab:any;

  rootPage;

  lastMood = {
    id: 'happy'
  }

  pages: Array<{title: string, component: any, icon: string}>;

  constructor(private events: Events, public db: DbProvider, public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen) {

    this.db.getTodayMoods().then(moods=> {
      

      let lastMood = moods.sort((a, b)=> new Date(b.date).getTime() -  new Date(b.date).getTime())[0]
      

      if(moods && moods.length > 0){
        this.lastMood = moods.sort((a, b)=> new Date(b.date).getTime() -  new Date(b.date).getTime())[0]
        this.rootPage = TodayPage
      }else{
        this.rootPage = MoodPage
      }

      return Promise.resolve();

    }).then(()=> {
      this.initializeApp();
    });

    

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Today', component: TodayPage, icon: 'moodly-world'},
      { title: 'Calendar', component: CalendarPage,  icon: 'calendar' },
      { title: 'Goals', component: GoalsPage, icon: 'moodly-goal'}
    ];

    this.events.subscribe('newMood', (mood)=> this.lastMood = mood);

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  goToChangeMood() {
    this.Myfab.close();
    this.nav.push(MoodPage)
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
