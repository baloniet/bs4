/* tslint:disable */

declare var Object: any;
export interface LocationInterface {
  id: number;
  name: string;
  partnerId: number;
  address?: string;
  email?: string;
}

export class Location implements LocationInterface {
  id: number;
  name: string;
  partnerId: number;
  address: string;
  email: string;
  constructor(data?: LocationInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Location`.
   */
  public static getModelName() {
    return "Location";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Location for dynamic purposes.
  **/
  public static factory(data: LocationInterface): Location{
    return new Location(data);
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
      name: 'Location',
      plural: 'Locations',
      properties: {
        id: {
          name: 'id',
          type: 'number'
        },
        name: {
          name: 'name',
          type: 'string'
        },
        partnerId: {
          name: 'partnerId',
          type: 'number'
        },
        address: {
          name: 'address',
          type: 'string'
        },
        email: {
          name: 'email',
          type: 'string'
        },
      },
      relations: {
      }
    }
  }
}
