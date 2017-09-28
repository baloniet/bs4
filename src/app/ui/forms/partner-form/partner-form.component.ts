import { Partner } from './../../../shared/sdk/models/Partner';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { LabelService } from './../../../services/label.service';
import { Component, OnInit } from '@angular/core';
import { BaseFormComponent } from '../baseForm.component';
import { PartnerApi } from '../../../shared/sdk/services/index';

@Component({
  selector: 'app-partner-form',
  templateUrl: './partner-form.component.html'
})
export class PartnerFormComponent extends BaseFormComponent implements OnInit {

  private data;

  constructor(
    private _labelService: LabelService,
    private _location: Location,
    private _route: ActivatedRoute,
    private _api: PartnerApi,
    private _fb: FormBuilder
  ) {
    super('partner');
  }

  ngOnInit() {

    this.form = this._fb.group({
      id: [''],
      name: [''],
      short: '',
      shortname: '',
      content: '',
      ismain: '',
      ispublic: ''
    });

    this.prepareLabels(this._labelService);
    this.getProvidedRouteParams(this._route);

  }

  back() {
    this._location.back();
  }

  // send model to service and save to db, return to list
  save(model: Partner) {

    if (!this.form.pristine) {
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
          (<FormGroup>this.form)
            .setValue(this.data, { onlySelf: true });
        });
  }

  // delete model with service from db, return to list
  delete(model: Partner) {

    this._api.deleteById(model.id)
      .subscribe(
      null,
      error => console.log(error),
      () => this.back()
      );

  }

}