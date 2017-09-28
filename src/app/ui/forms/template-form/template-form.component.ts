import { Template } from './../../../shared/sdk/models/Template';
import { Location } from '@angular/common';
import { LabelService } from './../../../services/label.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { TemplateApi } from './../../../shared/sdk/services/custom/Template';
import { PartnerApi } from './../../../shared/sdk/services/custom/Partner';
import { VPlocationApi } from './../../../shared/sdk/services/custom/VPlocation';


import { BaseFormComponent } from '../baseForm.component';

@Component({
  selector: 'app-template-form',
  templateUrl: './template-form.component.html'
})
export class TemplateFormComponent extends BaseFormComponent implements OnInit {

  private data;
  private partnerItems;
  private partnerSel = [];


  constructor(
    private _fb: FormBuilder,
    private _labelService: LabelService,
    private _location: Location,
    private _route: ActivatedRoute,
    private _vPloc: VPlocationApi,
    private _partApi: PartnerApi,
    private _api: TemplateApi
  ) {
    super('template');
  }

  ngOnInit() {
    this.setLocked(true);
    // prepare form controls
    this.form = this._fb.group({
      id: [''],
      partnerId: [''],
      name: ['', Validators.required],
      active: true
    });

    this.prepareLabels(this._labelService);
    this.getProvidedRouteParams(this._route);
  }

  private preparePartnerValues(act?) {
    // get partner values, we get other values after partner selection
    this._vPloc.partners(this.getUserAppId())
      .subscribe(res => {
        this.partnerItems = [];
        for (let one of res)
          this.partnerItems.push({ id: one.id, text: one.name });
        if (act)
          this.partnerSel = act.partnerId ? this.fromId(this.partnerItems, act.partnerId) : this.selectFirst(this.partnerItems);

        // lock form if partner not my
        if (this.fromId(this.partnerItems, this.data.partnerId).length > 0 || !this.getParam('id'))
          this.setLocked(false); else this.setLocked(true);
      });
  }

  // send model to service and save to db, return to list
  save(model: Template) {

    if (!this.form.pristine) {

      // 1. save model - template partner
      if (this.partnerSel[0])
        model.partnerId = this.partnerSel[0].id;

      // 2. save model - template
      this._api.upsert(model)
        .subscribe(
        res => {
          this.form.markAsPristine();
        },
        this.errMethod,
        () => this.back()
        );
    }

  }

  // call service to find model in db
  selectData(param) {

    if (param.id) {
      this._api.findById(param.id)
        .subscribe(res => {
          this.data = res;
          this.preparePartnerValues(this.data);
          (<FormGroup>this.form)
            .setValue(this.data, { onlySelf: true });
        });
    } else {
      this.data = {};
      this.preparePartnerValues();
    }
  }


  // delete model with service from db, return to list
  delete(model: Template) {

    this._api.deleteById(model.id)
      .subscribe(
      null,
      this.errMethod,
      () => this.back()
      );

  }

  back() {
    this._location.back();
  }

  // method for select boxes
  public selected(value: any, type: string): void {

    if (type === 'partner') {
      this.partnerSel = [{ id: value.id, text: value.text }];
    }

    this.form.markAsDirty();
  }
}
