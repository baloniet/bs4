/**
* @module SDKModule
* @author Jonathan Casarrubias <t:@johncasarrubias> <gh:jonathan-casarrubias>
* @license MTI 2016 Jonathan Casarrubias
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
import { HttpModule } from '@angular/http';
import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';
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
import { PEduApi } from './services/custom/PEdu';
import { ActivityApi } from './services/custom/Activity';
import { APersonApi } from './services/custom/APerson';
import { RoomApi } from './services/custom/Room';
import { ErrorsApi } from './services/custom/Errors';
import { ThemeApi } from './services/custom/Theme';
import { VActivityApi } from './services/custom/VActivity';
import { EventApi } from './services/custom/Event';
import { VMemberApi } from './services/custom/VMember';
import { VEventApi } from './services/custom/VEvent';
import { VStatPerApi } from './services/custom/VStatPer';
import { EPersonApi } from './services/custom/EPerson';
import { PersonApi } from './services/custom/Person';
import { VMeventAApi } from './services/custom/VMeventA';
import { VMeventEApi } from './services/custom/VMeventE';
import { VApersonApi } from './services/custom/VAperson';
import { VAmemberApi } from './services/custom/VAmember';
import { PAddressApi } from './services/custom/PAddress';
import { VPeventApi } from './services/custom/VPevent';
import { VMeventApi } from './services/custom/VMevent';

@NgModule({
  imports:      [ CommonModule, HttpModule ],
  declarations: [ ],
  exports:      [ ],
  providers:    [ ]
})

export class SDKModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SDKModule,
      providers: [
        LoopBackAuth,
        ErrorHandler,
        LoggerService,
        JSONSearchParams,
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
        PEduApi,
        ActivityApi,
        APersonApi,
        RoomApi,
        ErrorsApi,
        ThemeApi,
        VActivityApi,
        EventApi,
        VMemberApi,
        VEventApi,
        VStatPerApi,
        EPersonApi,
        PersonApi,
        VMeventAApi,
        VMeventEApi,
        VApersonApi,
        VAmemberApi,
        PAddressApi,
        VPeventApi,
        VMeventApi
      ]
    };
  }
}

export * from './models/index';
export * from './services/index';
export * from './lb.config';
