/* tslint:disable */

declare var Object: any;
export interface VStatFullExportInterface {
  year: number;
  month?: number;
  kindName: string;
  locationName: string;
  partnerName: string;
  id: number;
  sumt?: number;
  sump?: number;
}

export class VStatFullExport implements VStatFullExportInterface {
  year: number;
  month: number;
  kindName: string;
  locationName: string;
  partnerName: string;
  id: number;
  sumt: number;
  sump: number;
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
        id: {
          name: 'id',
          type: 'number'
        },
        sumt: {
          name: 'sumt',
          type: 'number'
        },
        sump: {
          name: 'sump',
          type: 'number'
        },
      },
      relations: {
      }
    }
  }
}
