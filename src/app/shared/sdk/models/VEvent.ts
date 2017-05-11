/* tslint:disable */

declare var Object: any;
export interface VEventInterface {
  id: number;
  name?: string;
  content?: string;
  roomId?: number;
  cdate?: Date;
  starttime?: Date;
  endtime?: Date;
  isday?: number;
  activityId: number;
  meventId?: number;
  color?: string;
  themename?: string;
  roomname?: string;
  cnt?: number;
  odate?: Date;
  adate?: Date;
  isacc?: number;
  isoff?: number;
  locationId?: number;
  isrented?: number;
}

export class VEvent implements VEventInterface {
  id: number;
  name: string;
  content: string;
  roomId: number;
  cdate: Date;
  starttime: Date;
  endtime: Date;
  isday: number;
  activityId: number;
  meventId: number;
  color: string;
  themename: string;
  roomname: string;
  cnt: number;
  odate: Date;
  adate: Date;
  isacc: number;
  isoff: number;
  locationId: number;
  isrented: number;
  constructor(data?: VEventInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `VEvent`.
   */
  public static getModelName() {
    return "VEvent";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of VEvent for dynamic purposes.
  **/
  public static factory(data: VEventInterface): VEvent{
    return new VEvent(data);
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
      name: 'VEvent',
      plural: 'VEvents',
      properties: {
        id: {
          name: 'id',
          type: 'number'
        },
        name: {
          name: 'name',
          type: 'string'
        },
        content: {
          name: 'content',
          type: 'string'
        },
        roomId: {
          name: 'roomId',
          type: 'number'
        },
        cdate: {
          name: 'cdate',
          type: 'Date'
        },
        starttime: {
          name: 'starttime',
          type: 'Date'
        },
        endtime: {
          name: 'endtime',
          type: 'Date'
        },
        isday: {
          name: 'isday',
          type: 'number'
        },
        activityId: {
          name: 'activityId',
          type: 'number'
        },
        meventId: {
          name: 'meventId',
          type: 'number'
        },
        color: {
          name: 'color',
          type: 'string'
        },
        themename: {
          name: 'themename',
          type: 'string'
        },
        roomname: {
          name: 'roomname',
          type: 'string'
        },
        cnt: {
          name: 'cnt',
          type: 'number'
        },
        odate: {
          name: 'odate',
          type: 'Date'
        },
        adate: {
          name: 'adate',
          type: 'Date'
        },
        isacc: {
          name: 'isacc',
          type: 'number'
        },
        isoff: {
          name: 'isoff',
          type: 'number'
        },
        locationId: {
          name: 'locationId',
          type: 'number'
        },
        isrented: {
          name: 'isrented',
          type: 'number'
        },
      },
      relations: {
      }
    }
  }
}
