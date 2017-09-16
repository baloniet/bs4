/* tslint:disable */

declare var Object: any;
export interface VStatFullInterface {
  projectId?: number;
  partnerId: number;
  locationId?: number;
  themeId: number;
  kindId: number;
  year: number;
  month?: number;
  sumtime?: string;
  sumperson: number;
  id: number;
}

export class VStatFull implements VStatFullInterface {
  projectId: number;
  partnerId: number;
  locationId: number;
  themeId: number;
  kindId: number;
  year: number;
  month: number;
  sumtime: string;
  sumperson: number;
  id: number;
  constructor(data?: VStatFullInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `VStatFull`.
   */
  public static getModelName() {
    return "VStatFull";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of VStatFull for dynamic purposes.
  **/
  public static factory(data: VStatFullInterface): VStatFull{
    return new VStatFull(data);
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
      name: 'VStatFull',
      plural: 'VStatFulls',
      properties: {
        projectId: {
          name: 'projectId',
          type: 'number'
        },
        partnerId: {
          name: 'partnerId',
          type: 'number'
        },
        locationId: {
          name: 'locationId',
          type: 'number'
        },
        themeId: {
          name: 'themeId',
          type: 'number'
        },
        kindId: {
          name: 'kindId',
          type: 'number'
        },
        year: {
          name: 'year',
          type: 'number'
        },
        month: {
          name: 'month',
          type: 'number'
        },
        sumtime: {
          name: 'sumtime',
          type: 'string'
        },
        sumperson: {
          name: 'sumperson',
          type: 'number'
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
