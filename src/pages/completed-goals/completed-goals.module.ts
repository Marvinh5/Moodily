import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CompletedGoalsPage } from './completed-goals';

@NgModule({
  declarations: [
    CompletedGoalsPage,
  ],
  imports: [
    IonicPageModule.forChild(CompletedGoalsPage),
  ],
})
export class CompletedGoalsPageModule {}
