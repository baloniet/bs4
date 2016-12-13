import { AuthGuard } from './../services/auth-guard.service';
import { MemberScheduleComponent } from './../ui/member-schedule/member-schedule.component';
import { EventViewComponent } from './../ui/views/event-view/event-view.component';
import { CheckinFormComponent } from './../ui/forms/checkin-form/checkin-form.component';
import { PersonScheduleComponent } from './../ui/person-schedule/person-schedule.component';
import { RoomScheduleComponent } from './../ui/room-schedule/room-schedule.component';
import { ErrorFormComponent } from './../ui/forms/error-form/error-form.component';
import { RoomFormComponent } from './../ui/forms/room-form/room-form.component';
import { EventFormComponent } from './../ui/forms/event-form/event-form.component';
import { ScheduleProxy } from './../ui/schedule/schedule.proxy';
import { ThemeFormComponent } from './../ui/forms/theme-form/theme-form.component';
import { ProcbarComponent } from '../procbar/procbar.component';
import { CitizenshipFormComponent } from '../ui/forms/citizenship-form/citizenship-form.component';
import { CommuneFormComponent } from '../ui/forms/commune-form/commune-form.component';
import { EducationFormComponent } from '../ui/forms/education-form/education-form.component';
import { PersonFormComponent } from '../ui/forms/person-form/person-form.component';
import { PostFormComponent } from '../ui/forms/post-form/post-form.component';
import { StatementFormComponent } from '../ui/forms/statement-form/statement-form.component';
import { ActivityFormComponent } from '../ui/forms/activity-form/activity-form.component';
import { GenListComponent } from '../ui/gen-list/gen-list.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';


@NgModule({
  imports: [
    RouterModule.forRoot([
      { path: 'genlist/:id', component: GenListComponent, canActivate: [AuthGuard] },
      { path: '', component: ProcbarComponent },
      { path: 'home', component: ProcbarComponent },
      { path: 'form/post/:id/:action', component: PostFormComponent, canActivate: [AuthGuard] },
      { path: 'form/post', component: PostFormComponent, canActivate: [AuthGuard] },
      { path: 'form/commune/:id/:action', component: CommuneFormComponent, canActivate: [AuthGuard] },
      { path: 'form/commune', component: CommuneFormComponent, canActivate: [AuthGuard] },
      { path: 'form/education/:id/:action', component: EducationFormComponent, canActivate: [AuthGuard] },
      { path: 'form/education', component: EducationFormComponent, canActivate: [AuthGuard] },
      { path: 'form/statement/:id/:action', component: StatementFormComponent, canActivate: [AuthGuard] },
      { path: 'form/statement', component: StatementFormComponent, canActivate: [AuthGuard] },
      { path: 'form/theme/:id/:action', component: ThemeFormComponent, canActivate: [AuthGuard] },
      { path: 'form/theme', component: ThemeFormComponent, canActivate: [AuthGuard] },
      { path: 'form/citizenship/:id/:action', component: CitizenshipFormComponent, canActivate: [AuthGuard] },
      { path: 'form/citizenship', component: CitizenshipFormComponent, canActivate: [AuthGuard] },
      { path: 'form/person/:id/:action', component: PersonFormComponent, canActivate: [AuthGuard] },
      { path: 'form/person', component: PersonFormComponent, canActivate: [AuthGuard] },
      { path: 'form/activity/:id/:action', component: ActivityFormComponent, canActivate: [AuthGuard] },
      { path: 'form/activity', component: ActivityFormComponent, canActivate: [AuthGuard] },
      { path: 'form/event/:id/:action', component: EventFormComponent, canActivate: [AuthGuard] },
      { path: 'form/event', component: EventFormComponent, canActivate: [AuthGuard] },
      { path: 'form/room/:id/:action', component: RoomFormComponent, canActivate: [AuthGuard] },
      { path: 'form/room', component: RoomFormComponent, canActivate: [AuthGuard] },
      { path: 'form/error/:id/:action', component: ErrorFormComponent, canActivate: [AuthGuard] },
      { path: 'form/error', component: ErrorFormComponent },
      { path: 'schedule/:view', component: ScheduleProxy, canActivate: [AuthGuard] },
      { path: 'room-schedule', component: RoomScheduleComponent, canActivate: [AuthGuard] },
      { path: 'person-schedule', component: PersonScheduleComponent, canActivate: [AuthGuard] },
      { path: 'member-schedule', component: MemberScheduleComponent, canActivate: [AuthGuard] },
      { path: 'form/checkin', component: CheckinFormComponent, canActivate: [AuthGuard] },
      { path: 'view/event', component: EventViewComponent, canActivate: [AuthGuard] }
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
