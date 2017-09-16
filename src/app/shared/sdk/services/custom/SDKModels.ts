/* tslint:disable */
import { Injectable } from '@angular/core';
import { User } from '../../models/User';
import { Post } from '../../models/Post';
import { Commune } from '../../models/Commune';
import { Education } from '../../models/Education';
import { PPhone } from '../../models/PPhone';
import { PEmail } from '../../models/PEmail';
import { Citizenship } from '../../models/Citizenship';
import { PCiti } from '../../models/PCiti';
import { PStat } from '../../models/PStat';
import { Statement } from '../../models/Statement';
import { APerson } from '../../models/APerson';
import { Room } from '../../models/Room';
import { Errors } from '../../models/Errors';
import { Theme } from '../../models/Theme';
import { VActivity } from '../../models/VActivity';
import { Event } from '../../models/Event';
import { VStatPer } from '../../models/VStatPer';
import { EPerson } from '../../models/EPerson';
import { Person } from '../../models/Person';
import { VMeventA } from '../../models/VMeventA';
import { VMeventE } from '../../models/VMeventE';
import { VAperson } from '../../models/VAperson';
import { VAmember } from '../../models/VAmember';
import { PAddress } from '../../models/PAddress';
import { VPevent } from '../../models/VPevent';
import { VMember } from '../../models/VMember';
import { Template } from '../../models/Template';
import { ATemplate } from '../../models/ATemplate';
import { Activity } from '../../models/Activity';
import { VReport } from '../../models/VReport';
import { Settings } from '../../models/Settings';
import { Project } from '../../models/Project';
import { Partner } from '../../models/Partner';
import { Kind } from '../../models/Kind';
import { Location } from '../../models/Location';
import { Type } from '../../models/Type';
import { TKind } from '../../models/TKind';
import { VFevent } from '../../models/VFevent';
import { VMevent } from '../../models/VMevent';
import { VMein } from '../../models/VMein';
import { VLocation } from '../../models/VLocation';
import { VFeventM } from '../../models/VFeventM';
import { VEperson } from '../../models/VEperson';
import { VStatPerExt } from '../../models/VStatPerExt';
import { VStatRoomExt } from '../../models/VStatRoomExt';
import { VFeventT } from '../../models/VFeventT';
import { VStatTchExt } from '../../models/VStatTchExt';
import { LeUser } from '../../models/LeUser';
import { PLocation } from '../../models/PLocation';
import { VLeuser } from '../../models/VLeuser';
import { VTkind } from '../../models/VTkind';
import { VPlocation } from '../../models/VPlocation';
import { VRoom } from '../../models/VRoom';
import { VEvent } from '../../models/VEvent';
import { Employment } from '../../models/Employment';
import { PEmp } from '../../models/PEmp';
import { PEdu } from '../../models/PEdu';
import { VPaddress } from '../../models/VPaddress';
import { VStatMember } from '../../models/VStatMember';
import { VStatVisit } from '../../models/VStatVisit';
import { VPerson } from '../../models/VPerson';
import { VStatPlanMonth } from '../../models/VStatPlanMonth';
import { VStatPlan } from '../../models/VStatPlan';
import { Register } from '../../models/Register';
import { VStatFull } from '../../models/VStatFull';

@Injectable()
export class SDKModels {

  private models: { [name: string]: any } = {
    User: User,
    Post: Post,
    Commune: Commune,
    Education: Education,
    PPhone: PPhone,
    PEmail: PEmail,
    Citizenship: Citizenship,
    PCiti: PCiti,
    PStat: PStat,
    Statement: Statement,
    APerson: APerson,
    Room: Room,
    Errors: Errors,
    Theme: Theme,
    VActivity: VActivity,
    Event: Event,
    VStatPer: VStatPer,
    EPerson: EPerson,
    Person: Person,
    VMeventA: VMeventA,
    VMeventE: VMeventE,
    VAperson: VAperson,
    VAmember: VAmember,
    PAddress: PAddress,
    VPevent: VPevent,
    VMember: VMember,
    Template: Template,
    ATemplate: ATemplate,
    Activity: Activity,
    VReport: VReport,
    Settings: Settings,
    Project: Project,
    Partner: Partner,
    Kind: Kind,
    Location: Location,
    Type: Type,
    TKind: TKind,
    VFevent: VFevent,
    VMevent: VMevent,
    VMein: VMein,
    VLocation: VLocation,
    VFeventM: VFeventM,
    VEperson: VEperson,
    VStatPerExt: VStatPerExt,
    VStatRoomExt: VStatRoomExt,
    VFeventT: VFeventT,
    VStatTchExt: VStatTchExt,
    LeUser: LeUser,
    PLocation: PLocation,
    VLeuser: VLeuser,
    VTkind: VTkind,
    VPlocation: VPlocation,
    VRoom: VRoom,
    VEvent: VEvent,
    Employment: Employment,
    PEmp: PEmp,
    PEdu: PEdu,
    VPaddress: VPaddress,
    VStatMember: VStatMember,
    VStatVisit: VStatVisit,
    VPerson: VPerson,
    VStatPlanMonth: VStatPlanMonth,
    VStatPlan: VStatPlan,
    Register: Register,
    VStatFull: VStatFull,
    
  };

  public get(modelName: string): any {
    return this.models[modelName];
  }
}
