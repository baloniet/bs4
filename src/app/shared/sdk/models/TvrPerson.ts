/* tslint:disable */

declare var Object: any;
export interface TvrPersonInterface {
  id: number;
  cdate?: Date;
  eventId: number;
  personId: number;
  isteacher?: number;
  isvolunteer?: number;
  isrenter?: number;
  odate?: Date;
  adate?: Date;
  note?: string;
}

export class TvrPerson implements TvrPersonInterface {
  id: number;
  cdate: Date;
  eventId: number;
  personId: number;
  isteacher: number;
  isvolunteer: number;
  isrenter: number;
  odate: Date;
  adate: Date;
  note: string;
  constructor(data?: TvrPersonInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `TvrPerson`.
   */
  public static getModelName() {
    return "TvrPerson";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of TvrPerson for dynamic purposes.
  **/
  public static factory(data: TvrPersonInterface): TvrPerson{
    return new TvrPerson(data);
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
      name: 'TvrPerson',
      plural: 'TvrPeople',
      properties: {
        id: {
          name: 'id',
          type: 'number'
        },
        cdate: {
          name: 'cdate',
          type: 'Date'
        },
        eventId: {
          name: 'eventId',
          type: 'number'
        },
        personId: {
          name: 'personId',
          type: 'number'
        },
        isteacher: {
          name: 'isteacher',
          type: 'number'
        },
        isvolunteer: {
          name: 'isvolunteer',
          type: 'number'
        },
        isrenter: {
          name: 'isrenter',
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
        note: {
          name: 'note',
          type: 'string'
        },
      },
      relations: {
      }
    }
  }
}
