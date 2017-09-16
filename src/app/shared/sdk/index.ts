/**
* @module SDKModule
* @author Jonathan Casarrubias <t:@johncasarrubias> <gh:jonathan-casarrubias>
* @license MIT 2016 Jonathan Casarrubias
* @version 2.1.0
* @description
* The SDKModule is a generated Software Development Kit automatically built by
* the LoopBack SDK Builder open source module.
*
* The SDKModule provides Angular 2 >= RC.5 support, which means that NgModules
* can import this Software Development Kit as follows:
*
*
* APP Route Module Context
* ============================================================================
* import { NgModule }       from '@angular/core';
* import { BrowserModule }  from '@angular/platform-browser';
* // App Root 
* import { AppComponent }   from './app.component';
* // Feature Modules
* import { SDKModule }      from './shared/sdk/sdk.module';
* // Import Routing
* import { routing }        from './app.routing';
* @NgModule({
*  imports: [
*    BrowserModule,
*    routing,
*    SDKModule.forRoot()
*  ],
*  declarations: [ AppComponent ],
*  bootstrap:    [ AppComponent ]
* })
* export class AppModule { }
*
**/
import { JSONSearchParams } from './services/core/search.params';
import { ErrorHandler } from './services/core/error.service';
import { LoopBackAuth } from './services/core/auth.service';
import { LoggerService } from './services/custom/logger.service';
import { SDKModels } from './services/custom/SDKModels';
import { InternalStorage } from './storage/internal.storage';
import { HttpModule } from '@angular/http';
import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { CookieBrowser } from './storage/cookie.browser';
import { UserApi } from './services/custom/User';
import { PostApi } from './services/custom/Post';
import { CommuneApi } from './services/custom/Commune';
import { EducationApi } from './services/custom/Education';
import { PPhoneApi } from './services/custom/PPhone';
import { PEmailApi } from './services/custom/PEmail';
import { CitizenshipApi } from './services/custom/Citizenship';
import { PCitiApi } from './services/custom/PCiti';
import { PStatApi } from './services/custom/PStat';
import { StatementApi } from './services/custom/Statement';
import { APersonApi } from './services/custom/APerson';
import { RoomApi } from './services/custom/Room';
import { ErrorsApi } from './services/custom/Errors';
import { ThemeApi } from './services/custom/Theme';
import { VActivityApi } from './services/custom/VActivity';
import { EventApi } from './services/custom/Event';
import { VStatPerApi } from './services/custom/VStatPer';
import { EPersonApi } from './services/custom/EPerson';
import { PersonApi } from './services/custom/Person';
import { VMeventAApi } from './services/custom/VMeventA';
import { VMeventEApi } from './services/custom/VMeventE';
import { VApersonApi } from './services/custom/VAperson';
import { VAmemberApi } from './services/custom/VAmember';
import { PAddressApi } from './services/custom/PAddress';
import { VPeventApi } from './services/custom/VPevent';
import { VMemberApi } from './services/custom/VMember';
import { TemplateApi } from './services/custom/Template';
import { ATemplateApi } from './services/custom/ATemplate';
import { ActivityApi } from './services/custom/Activity';
import { VReportApi } from './services/custom/VReport';
import { SettingsApi } from './services/custom/Settings';
import { ProjectApi } from './services/custom/Project';
import { PartnerApi } from './services/custom/Partner';
import { KindApi } from './services/custom/Kind';
import { LocationApi } from './services/custom/Location';
import { TypeApi } from './services/custom/Type';
import { TKindApi } from './services/custom/TKind';
import { VFeventApi } from './services/custom/VFevent';
import { VMeventApi } from './services/custom/VMevent';
import { VMeinApi } from './services/custom/VMein';
import { VLocationApi } from './services/custom/VLocation';
import { VFeventMApi } from './services/custom/VFeventM';
import { VEpersonApi } from './services/custom/VEperson';
import { VStatPerExtApi } from './services/custom/VStatPerExt';
import { VStatRoomExtApi } from './services/custom/VStatRoomExt';
import { VFeventTApi } from './services/custom/VFeventT';
import { VStatTchExtApi } from './services/custom/VStatTchExt';
import { LeUserApi } from './services/custom/LeUser';
import { PLocationApi } from './services/custom/PLocation';
import { VLeuserApi } from './services/custom/VLeuser';
import { VTkindApi } from './services/custom/VTkind';
import { VPlocationApi } from './services/custom/VPlocation';
import { VRoomApi } from './services/custom/VRoom';
import { VEventApi } from './services/custom/VEvent';
import { EmploymentApi } from './services/custom/Employment';
import { PEmpApi } from './services/custom/PEmp';
import { PEduApi } from './services/custom/PEdu';
import { VPaddressApi } from './services/custom/VPaddress';
import { VStatMemberApi } from './services/custom/VStatMember';
import { VStatVisitApi } from './services/custom/VStatVisit';
import { VPersonApi } from './services/custom/VPerson';
import { VStatPlanMonthApi } from './services/custom/VStatPlanMonth';
import { VStatPlanApi } from './services/custom/VStatPlan';
import { RegisterApi } from './services/custom/Register';
import { VStatFullApi } from './services/custom/VStatFull';
import { VStatFullExportApi } from './services/custom/VStatFullExport';
/**
* @module SDKBrowserModule
* @description
* This module should be imported when building a Web Application in the following scenarios:
*
*  1.- Regular web application
*  2.- Angular universal application (Browser Portion)
*  3.- Progressive applications (Angular Mobile, Ionic, WebViews, etc)
**/
@NgModule({
  imports:      [ CommonModule, HttpModule ],
  declarations: [ ],
  exports:      [ ],
  providers:    [
    ErrorHandler
  ]
})
export class SDKBrowserModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule  : SDKBrowserModule,
      providers : [
        LoopBackAuth,
        LoggerService,
        JSONSearchParams,
        SDKModels,
        UserApi,
        PostApi,
        CommuneApi,
        EducationApi,
        PPhoneApi,
        PEmailApi,
        CitizenshipApi,
        PCitiApi,
        PStatApi,
        StatementApi,
        APersonApi,
        RoomApi,
        ErrorsApi,
        ThemeApi,
        VActivityApi,
        EventApi,
        VStatPerApi,
        EPersonApi,
        PersonApi,
        VMeventAApi,
        VMeventEApi,
        VApersonApi,
        VAmemberApi,
        PAddressApi,
        VPeventApi,
        VMemberApi,
        TemplateApi,
        ATemplateApi,
        ActivityApi,
        VReportApi,
        SettingsApi,
        ProjectApi,
        PartnerApi,
        KindApi,
        LocationApi,
        TypeApi,
        TKindApi,
        VFeventApi,
        VMeventApi,
        VMeinApi,
        VLocationApi,
        VFeventMApi,
        VEpersonApi,
        VStatPerExtApi,
        VStatRoomExtApi,
        VFeventTApi,
        VStatTchExtApi,
        LeUserApi,
        PLocationApi,
        VLeuserApi,
        VTkindApi,
        VPlocationApi,
        VRoomApi,
        VEventApi,
        EmploymentApi,
        PEmpApi,
        PEduApi,
        VPaddressApi,
        VStatMemberApi,
        VStatVisitApi,
        VPersonApi,
        VStatPlanMonthApi,
        VStatPlanApi,
        RegisterApi,
        VStatFullApi,
        VStatFullExportApi,
        { provide: InternalStorage, useClass: CookieBrowser }
      ]
    };
  }
}
/**
* Have Fun!!!
* - Jon
**/
export * from './models/index';
export * from './services/index';
export * from './lb.config';

