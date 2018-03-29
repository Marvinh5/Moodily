import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MoodPage } from './mood';

@NgModule({
  declarations: [
    MoodPage,
  ],
  imports: [
    IonicPageModule.forChild(MoodPage),
  ],
})
export class MoodPageModule {}
