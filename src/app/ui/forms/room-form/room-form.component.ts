import { VPlocation } from './../../../shared/sdk/models/VPlocation';
import { VPlocationApi } from './../../../shared/sdk/services/custom/VPlocation';
import { Location } from '@angular/common';
import { BaseFormComponent } from '../baseForm.component';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { LabelService } from '../../../services/label.service';
import { RoomApi } from '../../../shared/sdk/services/index';
import { Room } from '../../../shared/sdk/models/index';

import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'room-form',
  templateUrl: './room-form.component.html'
})
export class RoomFormComponent extends BaseFormComponent implements OnInit {

  private data;
  private locationItems;
  private locationSel = [];

  constructor(
    private _labelService: LabelService,
    private _location: Location,
    private _locApi: VPlocationApi,
    private _route: ActivatedRoute,
    private _api: RoomApi,
    private _fb: FormBuilder
  ) {
    super('room');
  }

  ngOnInit() {

    this.form = this._fb.group({
      id: [''],
      locationId: [''],
      name: [''],
      onchart: ''
    });

    this.prepareLabels(this._labelService);
    this.getProvidedRouteParams(this._route);

  }

  back() {
    this._location.back();
  }

  // send model to service and save to db, return to list
  save(model: Room) {

    if (!this.form.pristine) {
      model.locationId = this.locationSel[0].id;
      this._api.upsert(model)
        .subscribe(
        res => this.form.markAsPristine(),
        error => console.log(error),
        () => this.back()
        );
    }

  }

  // call service to find model in db
  selectData(param) {

    if (param.id)
      this._api.findById(param.id)
        .subscribe(res => {
          this.data = res;
          this.prepareLocations(this.data.locationId);
          (<FormGroup>this.form)
            .setValue(this.data, { onlySelf: true });
        });
    else
      this.prepareLocations();
  }

  private prepareLocations(id?) {
    this.locationSel = [];

    //load locations
    this._locApi.find({ where: { personId: this.getUserAppId()}, order: "partName, name" })
      .subscribe(res => {

        this.locationItems = [];
        for (let one of res)
          this.locationItems.push({ id: (<VPlocation>one).id, text: (<VPlocation>one).name + ' - ' + (<VPlocation>one).partname });
        if (id)
          this.locationSel = id ? this.fromId(this.locationItems, id) : '';
      });

  }


  // delete model with service from db, return to list
  delete(model: Room) {

    this._api.deleteById(model.id)
      .subscribe(
      null,
      error => console.log(error),
      () => this.back()
      );

  }

  //method for select boxes
  public selected(value: any, type: string): void {

    if (type == "location")
      this.locationSel = [{ id: value.id, text: value.text }];
    this.form.markAsDirty();
  }

}