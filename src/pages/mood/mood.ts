import { TodayPage } from './../today/today';
import { DbProvider } from './../../providers/db/db';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';

/**
 * Generated class for the MoodPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-mood',
  templateUrl: 'mood.html',
})
export class MoodPage {

  moods: any[] = [
    {
      iconSelected: './assets/icon/angry.png',
      iconNotSelected: './assets/icon/angryEmpty.png',
      name: 'Angry',
      id: "angry"
    },
    {
      iconSelected: './assets/icon/sad.png',
      iconNotSelected: './assets/icon/sadEmpty.png',
      name: 'Sad',
      id: "sad"
      
    },
    {
      iconSelected: './assets/icon/inLove.png',
      iconNotSelected: './assets/icon/inLoveEmpty.png',
      name: 'In Love',
      id: "inLove"
    },
    {
      iconSelected: './assets/icon/embarrassed.png',
      iconNotSelected: './assets/icon/embarrassedEmpty.png',
      name: 'Embarrassed',
      id: "embarrassed"
    },
    {
      iconSelected: './assets/icon/happy.png',
      iconNotSelected: './assets/icon/happyEmpty.png',      
      name: 'Happy',
      id: "happy"
    }
  ]

  constructor(private db: DbProvider, public santaizer: DomSanitizer, public navCtrl: NavController, public navParams: NavParams) {
      
  }

  ionViewDidLoad() {
    
    console.log('ionViewDidLoad MoodPage');
  }

  sanatizeUrl(mood){
    if(mood.selected) return mood.iconSelected;
    return mood.iconNotSelected
    // if(mood.selected){
    //     return this.santaizer.bypassSecurityTrustResourceUrl(mood.iconSelected)
    // }else {
    //   return this.santaizer.bypassSecurityTrustResourceUrl(mood.iconNotSelected)
      
    // }
  }

  selectMood(mood) {
    this.moods.map(x=>x.selected=false);
    mood.selected = true;
  }

  thereIsASelectedMood() {
    return this.moods.filter(mood=> mood.selected).length > 0
  }

  next() {
    
    this.db.addMood({id: this.moods.filter(mood=> mood.selected)[0].id }).then(()=> {
      this.navCtrl.setRoot(TodayPage)
    });

  }

}
