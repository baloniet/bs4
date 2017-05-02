import { BasicValidators } from './../../../shared/basicValidators';
import { Partner } from './../../../shared/sdk/models/Partner';
import { Location as LocationModel } from './../../../shared/sdk/models/Location';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { LabelService } from './../../../services/label.service';
import { Component, OnInit } from '@angular/core';
import { BaseFormComponent } from '../baseForm.component';
import { LocationApi } from './../../../shared/sdk/services/custom/Location';
import { PartnerApi } from './../../../shared/sdk/services/custom/Partner';

@Component({
  selector: 'app-location-form',
  templateUrl: './location-form.component.html'
})
export class LocationFormComponent extends BaseFormComponent implements OnInit {

  private data;
  private partnerItems;
  private partnerSel = [];

  constructor(
    private _labelService: LabelService,
    private _fb: FormBuilder,
    private _route: ActivatedRoute,
    private _api: LocationApi,
    private _location: Location,
    private _pApi: PartnerApi
  ) {
    super('location');
  }

  ngOnInit() {

    // prepare form controls
    this.form = this._fb.group({
      id: [''],
      name: ['', Validators.required],
      address: [''],
      partnerId: [],
      email: ['', Validators.compose([BasicValidators.email])]
    });

    this.prepareLabels(this._labelService);
    this.getProvidedRouteParams(this._route);

  }

  // send model to service and save to db, return to list
  save(model: LocationModel) {

    if (!this.form.pristine) {

      // 1. save model - partner
      if (this.partnerSel[0])
        model.partnerId = this.partnerSel[0].id;

      // 2. save model - location
      this._api.upsert(model)
        .subscribe(
        res => {
          this.form.markAsPristine();
        }, this.errMethod, () => this.back()
        );
    }

  }

  // call service to find model in db
  selectData(param) {

    // get partner values
    this._pApi.find({ order: 'name' }).subscribe(res => {
      this.partnerItems = [];
      for (let one of res)
        this.partnerItems.push({ id: (<Partner>one).id, text: (<Partner>one).name });
    });

    if (param.id)
      this._api.findById(param.id)
        .subscribe(res => {
          this.data = res;
          this.data.email = this.data.email ? this.data.email : '';
          let loc = <LocationModel>res;
          this.partnerSel = loc.partnerId ? this.fromId(this.partnerItems, loc.partnerId) : '';
          (<FormGroup>this.form)
            .setValue(this.data, { onlySelf: true });
        });
  }


  // delete model with service from db, return to list
  delete(model: LocationModel) {

    this._api.deleteById(model.id)
      .subscribe(
      null, this.errMethod, () => this.back()
      );

  }

  back() {
    this._location.back();
  }

  // method for select boxes
  public selected(value: any, type: string): void {

    if (type === 'partner')
      this.partnerSel = [{ id: value.id, text: value.text }];

    this.form.markAsDirty();
  }

}
