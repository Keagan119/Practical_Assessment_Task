import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TaskTrackerListComponent } from './task-tracker-list/task-tracker-list.component';

const routes: Routes = [
  {
    path: '',
    component: TaskTrackerListComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
