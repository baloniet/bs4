/* tslint:disable */

declare var Object: any;
export interface VPstatInterface {
  personId: number;
  statementId: number;
  cdate?: Date;
  locationId?: number;
  year?: number;
  num?: number;
  originalcdate?: Date;
  sname: string;
  ismember?: number;
  lname: string;
  pname: string;
  id: number;
}

export class VPstat implements VPstatInterface {
  personId: number;
  statementId: number;
  cdate: Date;
  locationId: number;
  year: number;
  num: number;
  originalcdate: Date;
  sname: string;
  ismember: number;
  lname: string;
  pname: string;
  id: number;
  constructor(data?: VPstatInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `VPstat`.
   */
  public static getModelName() {
    return "VPstat";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of VPstat for dynamic purposes.
  **/
  public static factory(data: VPstatInterface): VPstat{
    return new VPstat(data);
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
      name: 'VPstat',
      plural: 'VPstats',
      properties: {
        personId: {
          name: 'personId',
          type: 'number'
        },
        statementId: {
          name: 'statementId',
          type: 'number'
        },
        cdate: {
          name: 'cdate',
          type: 'Date'
        },
        locationId: {
          name: 'locationId',
          type: 'number'
        },
        year: {
          name: 'year',
          type: 'number'
        },
        num: {
          name: 'num',
          type: 'number'
        },
        originalcdate: {
          name: 'originalcdate',
          type: 'Date'
        },
        sname: {
          name: 'sname',
          type: 'string'
        },
        ismember: {
          name: 'ismember',
          type: 'number'
        },
        lname: {
          name: 'lname',
          type: 'string'
        },
        pname: {
          name: 'pname',
          type: 'string'
        },
        id: {
          name: 'id',
          type: 'number'
        },
      },
      relations: {
      }
    }
  }
}
