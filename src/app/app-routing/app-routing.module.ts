import { GridComponent } from './../special/grid/grid.component';
import { LoginComponent } from './../login/login.component';
import { EmploymentFormComponent } from './../ui/forms/employment-form/employment-form.component';
import { ActStatComponent } from './../act-stat/act-stat.component';
import { UserFormComponent } from './../ui/forms/user-form/user-form.component';
import { TeachStatComponent } from './../ui/teach-stat/teach-stat.component';
import { RoomStatComponent } from './../ui/room-stat/room-stat.component';
import { MemberStatComponent } from './../ui/member-stat/member-stat.component';
import { StatComponent } from './../stat/stat.component';
import { CheckoutFormComponent } from './../ui/forms/checkout-form/checkout-form.component';
import { ProgramComponent } from './../special/program/program.component';
import { LocationFormComponent } from './../ui/forms/location-form/location-form.component';
import { PartnerFormComponent } from './../ui/forms/partner-form/partner-form.component';
import { KindFormComponent } from './../ui/forms/kind-form/kind-form.component';
import { TypeFormComponent } from './../ui/forms/type-form/type-form.component';
import { ProjectFormComponent } from './../ui/forms/project-form/project-form.component';
import { SettingFormComponent } from './../ui/forms/setting-form/setting-form.component';
import { ReportComponent } from './../report/report.component';
import { TemplateFormComponent } from './../ui/forms/template-form/template-form.component';
import { PlanComponent } from './../ui/plan/plan.component';
import { PrintComponent } from './../print/print.component';
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
      { path: '', component: LoginComponent },
      { path: 'home', component: ProcbarComponent, canActivate: [AuthGuard] },
      { path: 'form/post/:id/:action', component: PostFormComponent, canActivate: [AuthGuard] },
      { path: 'form/post', component: PostFormComponent, canActivate: [AuthGuard] },
      { path: 'form/commune/:id/:action', component: CommuneFormComponent, canActivate: [AuthGuard] },
      { path: 'form/commune', component: CommuneFormComponent, canActivate: [AuthGuard] },
      { path: 'form/education/:id/:action', component: EducationFormComponent, canActivate: [AuthGuard] },
      { path: 'form/education', component: EducationFormComponent, canActivate: [AuthGuard] },
      { path: 'form/employment/:id/:action', component: EmploymentFormComponent, canActivate: [AuthGuard] },
      { path: 'form/employment', component: EmploymentFormComponent, canActivate: [AuthGuard] },
      { path: 'form/statement/:id/:action', component: StatementFormComponent, canActivate: [AuthGuard] },
      { path: 'form/statement', component: StatementFormComponent, canActivate: [AuthGuard] },
      { path: 'form/theme/:id/:action', component: ThemeFormComponent, canActivate: [AuthGuard] },
      { path: 'form/theme', component: ThemeFormComponent, canActivate: [AuthGuard] },
      { path: 'form/type/:id/:action', component: TypeFormComponent, canActivate: [AuthGuard] },
      { path: 'form/type', component: TypeFormComponent, canActivate: [AuthGuard] },
      { path: 'form/kind/:id/:action', component: KindFormComponent, canActivate: [AuthGuard] },
      { path: 'form/kind', component: KindFormComponent, canActivate: [AuthGuard] },
      { path: 'form/partner/:id/:action', component: PartnerFormComponent, canActivate: [AuthGuard] },
      { path: 'form/partner', component: PartnerFormComponent, canActivate: [AuthGuard] },
      { path: 'form/location/:id/:action', component: LocationFormComponent, canActivate: [AuthGuard] },
      { path: 'form/location', component: LocationFormComponent, canActivate: [AuthGuard] },
      { path: 'form/template/:id/:action', component: TemplateFormComponent, canActivate: [AuthGuard] },
      { path: 'form/template', component: TemplateFormComponent, canActivate: [AuthGuard] },
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
      { path: 'form/user/:id/:action', component: UserFormComponent, canActivate: [AuthGuard] },
      { path: 'form/user', component: UserFormComponent, canActivate: [AuthGuard] },
      { path: 'form/project/:id/:action', component: ProjectFormComponent, canActivate: [AuthGuard] },
      { path: 'form/project', component: ProjectFormComponent, canActivate: [AuthGuard] },
      { path: 'form/error/:id/:action', component: ErrorFormComponent, canActivate: [AuthGuard] },
      { path: 'form/error', component: ErrorFormComponent },
      { path: 'form/setting/:id/:action', component: SettingFormComponent, canActivate: [AuthGuard] },
      { path: 'form/setting', component: SettingFormComponent },
      { path: 'schedule/:view', component: ScheduleProxy, canActivate: [AuthGuard] },
      { path: 'room-schedule', component: RoomScheduleComponent, canActivate: [AuthGuard] },
      { path: 'room-schedule/:id', component: RoomScheduleComponent, canActivate: [AuthGuard] },
      { path: 'person-schedule', component: PersonScheduleComponent, canActivate: [AuthGuard] },
      { path: 'member-schedule', component: MemberScheduleComponent, canActivate: [AuthGuard] },
      { path: 'member-stat', component: MemberStatComponent, canActivate: [AuthGuard] },
      { path: 'room-stat', component: RoomStatComponent, canActivate: [AuthGuard] },
      { path: 'teach-stat', component: TeachStatComponent, canActivate: [AuthGuard] },
      { path: 'act-stat', component: ActStatComponent, canActivate: [AuthGuard] },
      { path: 'form/checkin', component: CheckinFormComponent, canActivate: [AuthGuard] },
      { path: 'form/checkout', component: CheckoutFormComponent, canActivate: [AuthGuard] },
      { path: 'view/event', component: EventViewComponent, canActivate: [AuthGuard] },
      { path: 'print', component: PrintComponent, canActivate: [AuthGuard] },
      { path: 'plan', component: PlanComponent, canActivate: [AuthGuard] },
      { path: 'program', component: ProgramComponent, canActivate: [AuthGuard] },
      { path: 'grid', component: GridComponent, canActivate: [AuthGuard] },
      { path: 'stat', component: StatComponent, canActivate: [AuthGuard] },
      { path: 'report', component: ReportComponent, canActivate: [AuthGuard] },
      { path: 'veport', component: ReportComponent, canActivate: [AuthGuard] }
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
