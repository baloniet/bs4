/* tslint:disable */

declare var Object: any;
export interface VPersonExportInterface {
  id: number;
  firstname: string;
  lastname: string;
  personName?: string;
  birthdate?: Date;
  isteacher?: number;
  isvolunteer?: number;
  ismember?: number;
  isemployee?: number;
  isrenter?: number;
  email?: string;
  number?: string;
  address?: string;
  zipcode?: number;
  name?: string;
  sex?: number;
  isuser?: number;
  mpersonId?: number;
  locationId?: number;
  year?: number;
  cdate?: Date;
  originalcdate?: Date;
  num?: string;
}

export class VPersonExport implements VPersonExportInterface {
  id: number;
  firstname: string;
  lastname: string;
  personName: string;
  birthdate: Date;
  isteacher: number;
  isvolunteer: number;
  ismember: number;
  isemployee: number;
  isrenter: number;
  email: string;
  number: string;
  address: string;
  zipcode: number;
  name: string;
  sex: number;
  isuser: number;
  mpersonId: number;
  locationId: number;
  year: number;
  cdate: Date;
  originalcdate: Date;
  num: string;
  constructor(data?: VPersonExportInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `VPersonExport`.
   */
  public static getModelName() {
    return "VPersonExport";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of VPersonExport for dynamic purposes.
  **/
  public static factory(data: VPersonExportInterface): VPersonExport{
    return new VPersonExport(data);
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
      name: 'VPersonExport',
      plural: 'VPersonExports',
      properties: {
        id: {
          name: 'id',
          type: 'number'
        },
        firstname: {
          name: 'firstname',
          type: 'string'
        },
        lastname: {
          name: 'lastname',
          type: 'string'
        },
        personName: {
          name: 'personName',
          type: 'string'
        },
        birthdate: {
          name: 'birthdate',
          type: 'Date'
        },
        isteacher: {
          name: 'isteacher',
          type: 'number'
        },
        isvolunteer: {
          name: 'isvolunteer',
          type: 'number'
        },
        ismember: {
          name: 'ismember',
          type: 'number'
        },
        isemployee: {
          name: 'isemployee',
          type: 'number'
        },
        isrenter: {
          name: 'isrenter',
          type: 'number'
        },
        email: {
          name: 'email',
          type: 'string'
        },
        number: {
          name: 'number',
          type: 'string'
        },
        address: {
          name: 'address',
          type: 'string'
        },
        zipcode: {
          name: 'zipcode',
          type: 'number'
        },
        name: {
          name: 'name',
          type: 'string'
        },
        sex: {
          name: 'sex',
          type: 'number'
        },
        isuser: {
          name: 'isuser',
          type: 'number'
        },
        mpersonId: {
          name: 'mpersonId',
          type: 'number'
        },
        locationId: {
          name: 'locationId',
          type: 'number'
        },
        year: {
          name: 'year',
          type: 'number'
        },
        cdate: {
          name: 'cdate',
          type: 'Date'
        },
        originalcdate: {
          name: 'originalcdate',
          type: 'Date'
        },
        num: {
          name: 'num',
          type: 'string'
        },
      },
      relations: {
      }
    }
  }
}
