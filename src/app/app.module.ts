import { AuthGuard } from './services/auth-guard.service';
import { AuthService } from './services/auth.service';
import { ScheduleModule } from './ui/schedule/schedule.module';
import { ScheduleProxy } from './ui/schedule/schedule.proxy';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NgbModule, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { ChartsModule } from 'ng2-charts/ng2-charts';

import { AppRoutingModule } from './app-routing/app-routing.module';
import { SDKBrowserModule } from './shared/sdk/index';
import { AUTH_PROVIDERS } from 'angular2-jwt';

import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ProcbarComponent } from './procbar/procbar.component';
import { PostFormComponent } from './ui/forms/post-form/post-form.component';
import { LabelService } from './services/label.service';
import { GenListComponent } from './ui/gen-list/gen-list.component';
import { ValuesPipe, KeysPipe } from './shared/values.pipe';
import { DateFormatter } from './shared/date.formatter';
import { FormTitleComponent } from './ui/forms/shared/frmTitle.component';
import { FormButtonComponent } from './ui/forms/shared/frmBtn.component';
import { CommuneFormComponent } from './ui/forms/commune-form/commune-form.component';
import { EducationFormComponent } from './ui/forms/education-form/education-form.component';
import { StatementFormComponent } from './ui/forms/statement-form/statement-form.component';
import { CitizenshipFormComponent } from './ui/forms/citizenship-form/citizenship-form.component';
import { PersonFormComponent } from './ui/forms/person-form/person-form.component';
import { AddressComponent } from './ui/forms/address/address.component';
import { SelectModule } from './ui/ng2-select/select.module';
import { ActivityFormComponent } from './ui/forms/activity-form/activity-form.component';
import { PersonComponent } from './ui/forms/person/person.component';
import { ThemeFormComponent } from './ui/forms/theme-form/theme-form.component';
import { ErrorTrackerComponent } from './ui/error-tracker/error-tracker.component';
import { BottombarComponent } from './bottombar/bottombar.component';
import { EventFormComponent } from './ui/forms/event-form/event-form.component';
import { RoomFormComponent } from './ui/forms/room-form/room-form.component';
import { ErrorFormComponent } from './ui/forms/error-form/error-form.component';
import { ColorPickerModule, ColorPickerService } from 'angular2-color-picker/lib';
import { RoomScheduleComponent } from './ui/room-schedule/room-schedule.component';
import { PersonScheduleComponent } from './ui/person-schedule/person-schedule.component';
import { CheckinFormComponent } from './ui/forms/checkin-form/checkin-form.component';
import { EventViewComponent } from './ui/views/event-view/event-view.component';
import { MemberScheduleComponent } from './ui/member-schedule/member-schedule.component';
import { PrintComponent } from './print/print.component';
import { PlanComponent } from './ui/plan/plan.component';
import { TemplateFormComponent } from './ui/forms/template-form/template-form.component';
import { TemplateComponent } from './ui/forms/template/template.component';
import { ReportComponent } from './report/report.component';
import { SettingFormComponent } from './ui/forms/setting-form/setting-form.component';
import { ProjectFormComponent } from './ui/forms/project-form/project-form.component';
import { StatementComponent } from './ui/forms/statement/statement.component';
import { PartnerFormComponent } from './ui/forms/partner-form/partner-form.component';
import { KindFormComponent } from './ui/forms/kind-form/kind-form.component';
import { LocationFormComponent } from './ui/forms/location-form/location-form.component';
import { TypeFormComponent } from './ui/forms/type-form/type-form.component';
import { ProgramComponent } from './special/program/program.component';
import { CheckoutFormComponent } from './ui/forms/checkout-form/checkout-form.component';
import { StatComponent } from './stat/stat.component';
import { MemberStatComponent } from './ui/member-stat/member-stat.component';
import { RoomStatComponent } from './ui/room-stat/room-stat.component';
import { TeachStatComponent } from './ui/teach-stat/teach-stat.component';
import { UserFormComponent } from './ui/forms/user-form/user-form.component';
import { ActStatComponent } from './act-stat/act-stat.component';
import { EmploymentFormComponent } from './ui/forms/employment-form/employment-form.component';
import { LoginComponent } from './login/login.component';
import { GridComponent } from './special/grid/grid.component';
import { ExportComponent } from './special/export/export.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    ProcbarComponent,
    PostFormComponent,
    GenListComponent,
    ValuesPipe, KeysPipe,
    FormTitleComponent, FormButtonComponent, CommuneFormComponent, EducationFormComponent, StatementFormComponent,
    CitizenshipFormComponent, PersonFormComponent, AddressComponent, ActivityFormComponent, PersonComponent,
    ThemeFormComponent, ErrorTrackerComponent, BottombarComponent, ScheduleProxy,
    EventFormComponent, RoomFormComponent, ErrorFormComponent, RoomScheduleComponent, PersonScheduleComponent,
    CheckinFormComponent, EventViewComponent, MemberScheduleComponent, PrintComponent, PlanComponent, TemplateFormComponent,
    TemplateComponent, ReportComponent, SettingFormComponent, ProjectFormComponent, StatementComponent, PartnerFormComponent,
    KindFormComponent, LocationFormComponent, TypeFormComponent, ProgramComponent, CheckoutFormComponent, StatComponent,
    MemberStatComponent, RoomStatComponent, TeachStatComponent, UserFormComponent, ActStatComponent, EmploymentFormComponent,
    LoginComponent, GridComponent, ExportComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule, FormsModule,
    HttpModule,
    NgbModule.forRoot(),
    SDKBrowserModule.forRoot(),
    AppRoutingModule,
    SelectModule,
    ScheduleModule,
    ColorPickerModule,
    ChartsModule
  ],
  providers: [LabelService, {
    provide: NgbDateParserFormatter,
    useFactory: () => { return new DateFormatter(); }
  },
    ColorPickerService, AUTH_PROVIDERS, AuthService, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
