import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MissedGoalsPage } from './missed-goals';

@NgModule({
  declarations: [
    MissedGoalsPage,
  ],
  imports: [
    IonicPageModule.forChild(MissedGoalsPage),
  ],
})
export class MissedGoalsPageModule {}
