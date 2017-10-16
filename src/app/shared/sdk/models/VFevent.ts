/* tslint:disable */

declare var Object: any;
export interface VFeventInterface {
  id: number;
  starttime?: Date;
  endtime?: Date;
  year?: number;
  name?: string;
  isrented?: number;
  isacc?: number;
  isoff?: number;
  rname?: string;
  publish?: number;
  content?: string;
  acontent?: string;
  aname: string;
  preg?: number;
  prega?: number;
  prego?: number;
  tcnt?: number;
  people?: string;
  color?: string;
  activityId: number;
  roomId?: number;
  isother?: number;
  locationId?: number;
}

export class VFevent implements VFeventInterface {
  id: number;
  starttime: Date;
  endtime: Date;
  year: number;
  name: string;
  isrented: number;
  isacc: number;
  isoff: number;
  rname: string;
  publish: number;
  content: string;
  acontent: string;
  aname: string;
  preg: number;
  prega: number;
  prego: number;
  tcnt: number;
  people: string;
  color: string;
  activityId: number;
  roomId: number;
  isother: number;
  locationId: number;
  constructor(data?: VFeventInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `VFevent`.
   */
  public static getModelName() {
    return "VFevent";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of VFevent for dynamic purposes.
  **/
  public static factory(data: VFeventInterface): VFevent{
    return new VFevent(data);
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
      name: 'VFevent',
      plural: 'VFevents',
      properties: {
        id: {
          name: 'id',
          type: 'number'
        },
        starttime: {
          name: 'starttime',
          type: 'Date'
        },
        endtime: {
          name: 'endtime',
          type: 'Date'
        },
        year: {
          name: 'year',
          type: 'number'
        },
        name: {
          name: 'name',
          type: 'string'
        },
        isrented: {
          name: 'isrented',
          type: 'number'
        },
        isacc: {
          name: 'isacc',
          type: 'number'
        },
        isoff: {
          name: 'isoff',
          type: 'number'
        },
        rname: {
          name: 'rname',
          type: 'string'
        },
        publish: {
          name: 'publish',
          type: 'number'
        },
        content: {
          name: 'content',
          type: 'string'
        },
        acontent: {
          name: 'acontent',
          type: 'string'
        },
        aname: {
          name: 'aname',
          type: 'string'
        },
        preg: {
          name: 'preg',
          type: 'number'
        },
        prega: {
          name: 'prega',
          type: 'number'
        },
        prego: {
          name: 'prego',
          type: 'number'
        },
        tcnt: {
          name: 'tcnt',
          type: 'number'
        },
        people: {
          name: 'people',
          type: 'string'
        },
        color: {
          name: 'color',
          type: 'string'
        },
        activityId: {
          name: 'activityId',
          type: 'number'
        },
        roomId: {
          name: 'roomId',
          type: 'number'
        },
        isother: {
          name: 'isother',
          type: 'number'
        },
        locationId: {
          name: 'locationId',
          type: 'number'
        },
      },
      relations: {
      }
    }
  }
}
