/* tslint:disable */

declare var Object: any;
export interface RegisterInterface {
  id: number;
  name: string;
  lastname: string;
  eventId: number;
  cdate?: Date;
  sent?: number;
  email?: string;
  phone?: string;
}

export class Register implements RegisterInterface {
  id: number;
  name: string;
  lastname: string;
  eventId: number;
  cdate: Date;
  sent: number;
  email: string;
  phone: string;
  constructor(data?: RegisterInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Register`.
   */
  public static getModelName() {
    return "Register";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Register for dynamic purposes.
  **/
  public static factory(data: RegisterInterface): Register{
    return new Register(data);
  }  
  /**
  * @method getModelDefinition
  * @author Julien Ledun
  * @license MIT
  * This method returns an object that represents some of the model
  * definitions.
  **/
  public static getModelDefinition() {
    return {
      name: 'Register',
      plural: 'Registers',
      properties: {
        id: {
          name: 'id',
          type: 'number'
        },
        name: {
          name: 'name',
          type: 'string'
        },
        lastname: {
          name: 'lastname',
          type: 'string'
        },
        eventId: {
          name: 'eventId',
          type: 'number'
        },
        cdate: {
          name: 'cdate',
          type: 'Date'
        },
        sent: {
          name: 'sent',
          type: 'number'
        },
        email: {
          name: 'email',
          type: 'string'
        },
        phone: {
          name: 'phone',
          type: 'string'
        },
      },
      relations: {
      }
    }
  }
}
