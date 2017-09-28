import { VPlocationApi } from './../../../shared/sdk/services/custom/VPlocation';
import { TKind } from './../../../shared/sdk/models/TKind';
import { TKindApi } from './../../../shared/sdk/services/custom/TKind';
import { KindApi } from './../../../shared/sdk/services/custom/Kind';
import { Location } from '@angular/common';
import { ColorPickerService } from 'angular2-color-picker/lib';
import { Theme } from './../../../shared/sdk/models/Theme';
import { ThemeApi } from './../../../shared/sdk/services/custom/Theme';

import { BaseFormComponent } from '../baseForm.component';
import { Observable } from 'rxjs/Rx';
import { ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { LabelService } from './../../../services/label.service';
import { Component, OnInit, forwardRef } from '@angular/core';

@Component({
  selector: 'theme-form',
  templateUrl: './theme-form.component.html',
  providers: [LabelService, ThemeApi]
})
export class ThemeFormComponent extends BaseFormComponent implements OnInit {

  private data;

  presetColors = [
    '#ff4000', '#ff8000', '#ffbf00', '#ffff00', '#bfff00', '#80ff00', '#40ff00', '#00ff00', '#00ff40', '#00ff80',
    '#00ffbf', '#00ffff', '#00bfff', '#0080ff', '#0040ff', '#0000ff', '#4000ff', '#8000ff', '#bf00ff', '#ff00ff',
    '#ff00bf', '#ff0080', '#ff0040', '#ff0000'
  ];

  // private kinds;
  private options = [];
  private opts = [];
  private partnerItems;
  private partnerSel = [];

  private yearItems = [
    { id: 2017, text: '2017' }, { id: 2018, text: '2018' }, { id: 2019, text: '2019' }, { id: 2020, text: '2020' }, { id: 2021, text: '2021' }];
  private yearSel = [{ id: 2017, text: '2017' }];

  constructor(
    private cpService: ColorPickerService,
    private _labelService: LabelService,
    private _fb: FormBuilder,
    private _route: ActivatedRoute,
    private _api: ThemeApi,
    private _kApi: KindApi,
    private _tKApi: TKindApi,
    private _plocApi: VPlocationApi,
    private _location: Location
  ) {
    super('theme');
  }

  ngOnInit() {

    // prepare form controls
    this.form = this._fb.group({
      id: [''],
      name: ['', Validators.required],
      color: '#FFF'
    });

    this.prepareLabels(this._labelService);
    this.getProvidedRouteParams(this._route);

  }

  // send model to service and save to db, return to list
  save(model: Theme) {

    if (!this.form.pristine) {

      // 1. save model - theme
      this._api.upsert(model)
        .subscribe(
        res => {
          this.form.markAsPristine();
        },
        error => console.log(error),
        () => this.back()
        );
    }

  }

  // call service to find model in db
  selectData(param) {

    // find all kinds
    // this.findKind(1);

    if (param.id)
      // get user partners
      this._plocApi.partners(this.getUserAppId())
        .subscribe(res => {
          this.partnerItems = [];
          for (let one of res)
            this.partnerItems.push({ id: one.id, text: one.name });
          this.partnerSel = this.selectFirst(this.partnerItems);
          this.prepareData(param.id);
        },
        err => console.log(err));
  }


  // prepare data for provided theme id
  prepareData(id) {
    this.options = [];
    this.opts = [];

    // get all kind, theme kind and this theme data
    Observable.forkJoin(
      this._api.findById(id),
      this._kApi.find(),
      this._tKApi.find({ where: { themeId: id, partnerId: this.partnerSel[0].id, year: this.yearSel[0].id } })
    ).subscribe(res => {

      this.data = res[0];
      this.prepareOptions(res[1], res[2]);

      (<FormGroup>this.form)
        .setValue(this.data, { onlySelf: true });
    });
  }

  prepareOptions(kinds, tks) {
    let c = [];
    for (let k of kinds) {
      for (let tk of tks) {
        if (tk.kindId == k.id) {
          this.opts.push({ id: tk.id, themeId: tk.themeId, kindId: tk.kindId, name: k.name, plan: tk.plan });
          c.push(k.id);
        }
      }
    }
    for (let k of kinds)
      if (c.indexOf(k.id) == -1)
        this.opts.push({ id: null, themeId: null, kindId: k.id, name: k.name });
    this.paginatorKCount = this.opts.length;
    this.findKind(1);
  }

  // delete model with service from db, return to list
  delete(model: Theme) {

    this._api.deleteById(model.id)
      .subscribe(
      null,
      error => console.log(error),
      () => this.back()
      );

  }

  back() {
    this._location.back();
  }

  // custom methods
  colorPicked(event) {
    this.form.value.color = event;
    this.form.markAsTouched();
  }

  paginatorPageSize = 10;
  paginatorKCount = 0;
  paginatorInitPage = 1;

  findKind(page: number) {
    let start = this.paginatorPageSize * (page - 1);
    this.options = [];
    this.options = this.opts.slice(start, (start + this.paginatorPageSize));
    this.fixListLength(this.paginatorPageSize, this.options);
  }

  addKind(o) {
    o.themeId = this.data.id;
    if (!o.plan)
      o.plan = 0;
    this._tKApi.upsert({ id: 0, themeId: this.data.id, kindId: o.kindId, plan: o.plan, partnerId: this.partnerSel[0].id, year: this.yearSel[0].id })
      .subscribe(res => o.id = (<TKind>res).id, err => console.log(err));
  }

  removeKind(o) {
    o.themeId = this.data.id;
    this._tKApi.deleteById(o.id)
      .subscribe(null, err => console.log(err), () => { o.id = null });
  }

  updateKind(o) {
    o.themeId = this.data.id;
    o.partnerId = this.partnerSel[0].id;
    o.year = this.yearSel[0].id;
    if (!o.plan)
      o.plan = 0;
    this._tKApi.upsert(o)
      .subscribe(res => o.id = (<TKind>res).id, err => console.log(err));
  }

  // method for select boxes
  public selected(value: any, type: string): void {

    if (type == 'partner') {
      this.partnerSel = [{ id: value.id, text: value.text }];
      this.prepareData(this.data.id);
    } else if (type == 'year') {
      this.yearSel = [{ id: value.id, text: value.text }];
      this.prepareData(this.data.id);
    }
  }
}