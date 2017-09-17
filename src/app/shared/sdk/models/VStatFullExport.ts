/* tslint:disable */

declare var Object: any;
export interface VStatFullExportInterface {
  year: number;
  month?: number;
  kindName: string;
  locationName: string;
  partnerName: string;
  kindId: number;
  themeId: number;
  locationId?: number;
  partnerId: number;
  projectId?: number;
  id: number;
  sump?: number;
  sumpm?: number;
  sumt?: number;
}

export class VStatFullExport implements VStatFullExportInterface {
  year: number;
  month: number;
  kindName: string;
  locationName: string;
  partnerName: string;
  kindId: number;
  themeId: number;
  locationId: number;
  partnerId: number;
  projectId: number;
  id: number;
  sump: number;
  sumpm: number;
  sumt: number;
  constructor(data?: VStatFullExportInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `VStatFullExport`.
   */
  public static getModelName() {
    return "VStatFullExport";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of VStatFullExport for dynamic purposes.
  **/
  public static factory(data: VStatFullExportInterface): VStatFullExport{
    return new VStatFullExport(data);
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
      name: 'VStatFullExport',
      plural: 'VStatFullExports',
      properties: {
        year: {
          name: 'year',
          type: 'number'
        },
        month: {
          name: 'month',
          type: 'number'
        },
        kindName: {
          name: 'kindName',
          type: 'string'
        },
        locationName: {
          name: 'locationName',
          type: 'string'
        },
        partnerName: {
          name: 'partnerName',
          type: 'string'
        },
        kindId: {
          name: 'kindId',
          type: 'number'
        },
        themeId: {
          name: 'themeId',
          type: 'number'
        },
        locationId: {
          name: 'locationId',
          type: 'number'
        },
        partnerId: {
          name: 'partnerId',
          type: 'number'
        },
        projectId: {
          name: 'projectId',
          type: 'number'
        },
        id: {
          name: 'id',
          type: 'number'
        },
        sump: {
          name: 'sump',
          type: 'number'
        },
        sumpm: {
          name: 'sumpm',
          type: 'number'
        },
        sumt: {
          name: 'sumt',
          type: 'number'
        },
      },
      relations: {
      }
    }
  }
}
