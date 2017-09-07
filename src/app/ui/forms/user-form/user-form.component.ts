import { LocationApi } from './../../../shared/sdk/services/custom/Location';
import { PLocation } from './../../../shared/sdk/models/PLocation';
import { PLocationApi } from './../../../shared/sdk/services/custom/PLocation';
import { PersonApi } from './../../../shared/sdk/services/custom/Person';
import { LeUserApi } from './../../../shared/sdk/services/custom/LeUser';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { LabelService } from './../../../services/label.service';
import { Observable } from 'rxjs/Observable';
import { LeUser } from './../../../shared/sdk/models/LeUser';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { BaseFormComponent } from '../baseForm.component';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html'
})
export class UserFormComponent extends BaseFormComponent implements OnInit {

  private data;
  private userItems;
  private userSel = [];
  user: LeUser;
  private options = [];
  private opts = [];

  paginatorPageSize = 10;
  paginatorLCount = 0;
  paginatorInitPage = 1;

  constructor(
    private _labelService: LabelService,
    private _location: Location,
    private _route: ActivatedRoute,
    private _api: LeUserApi,
    private _personApi: PersonApi,
    private _pLocApi: PLocationApi,
    private _locApi: LocationApi,
    private _fb: FormBuilder
  ) {
    super('user');
  }

  ngOnInit() {

    this.form = this._fb.group({
      id: [''],
      mpersonId: [''],
      firstname: [''],
      lastname: [''],
      cdate: [],
      ldate: [],
      email: [''],
      isteacher: false,
      isvolunteer: false,
      ismember: false,
      isemployee: false,
      isrenter: false,
      isuser: false,
      isadmin: false,
      active: false,
      birthdate: [],
      sex: [],
      content: []
    });

    this.prepareLabels(this._labelService);
    this.getProvidedRouteParams(this._route);
  }

  back() {
    this._location.back();
  }

  // send model to service and save to db, return to list
  save(model) {

    if (!this.form.pristine) {

      let id;
      if (this.userSel[0] && this.userSel[0].id) {
        id = this.userSel[0].id;
      } else {
        id = this.user.auth0Id;
      }
      // 1. save model - leuser
      if (id)
        this._api.find({ where: { auth0Id: id } })
          .subscribe(
          res => {
            let p = <LeUser>res[0];
            p.personId = this.data.id;
            p.active = this.form.value.active ? this.form.value.active : p.active;
            p.isadmin = this.form.value.isadmin ? this.form.value.isadmin : p.isadmin;
            this._api.upsert(p)
              .subscribe(null, err => console.log(err));
          },
          error => console.log(error),
          () => this.back()
          );
    }

  }

  // call service to find model in db
  selectData(param) {

    if (param.id) {

      Observable.forkJoin(
        this._personApi.findById(param.id),
        this._api.find({ where: { personId: null } }),
        this._api.find({ where: { personId: param.id } }),
        this._pLocApi.find({ where: { personId: param.id } }),
        this._locApi.find()
      ).subscribe(
        res => {

          this.data = res[0];

          // user
          this.userItems = [];
          for (let one of res[1]) {
            this.userItems.push({ id: (<LeUser>one).auth0Id, text: (<LeUser>one).name });
          }

          // load user data
          this.user = <LeUser>res[2][0];
          if (this.user) {
            this.data.isadmin = this.user.isadmin;
            this.data.active = this.user.active;
            this.data.ldate = this.user.ldate;
            this.data.email = this.user.email;
          } else {
            this.data.ldate = null;
            this.data.email = null;
            this.data.isadmin = null;
            this.data.active = null;
          }

          this.prepareOptions(res[4], res[3]);

          (<FormGroup>this.form)
            .setValue(this.data, { onlySelf: true });

        }, error => {
          console.log(error, 0);
        }
        );
    }
  }

  prepareOptions(locations, plocs) {
    let c = [];
    for (let k of locations) {
      for (let tk of plocs) {
        if (tk.locationId === k.id) {
          this.opts.push({ id: tk.id, personId: tk.personId, locationId: tk.locationId, name: k.name });
          c.push(k.id);
        }
      }
    }
    for (let k of locations)
      if (c.indexOf(k.id) === -1)
        this.opts.push({ id: null, personId: null, locationId: k.id, name: k.name });
    this.paginatorLCount = this.opts.length;
    this.findLocation(1);
  }

  // delete model with service from db, return to list
  delete(model: LeUser) {

    this._api.deleteById(model.personId)
      .subscribe(
      null,
      error => console.log(error),
      () => this.back()
      );

  }

  // method for select boxes
  public selected(value: any, type: string): void {
    if (type === 'user') {
      this.userSel = [{ id: value.id, text: value.text }];
    }
    this.form.markAsDirty();
  }

  findLocation(page: number) {
    let start = this.paginatorPageSize * (page - 1);
    this.options = [];
    this.options = this.opts.slice(start, (start + this.paginatorPageSize));
    this.fixListLength(this.paginatorPageSize, this.options);
  }

  addLocation(o) {
    o.personId = this.data.id;
    this._pLocApi.upsert({ id: 0, personId: this.data.id, locationId: o.locationId })
      .subscribe(res => o.id = (<PLocation>res).id, err => console.log(err));
  }

  removeLocation(o) {
    o.personId = this.data.id;
    this._pLocApi.deleteById(o.id)
      .subscribe(null, err => console.log(err), () => { o.id = null; });
  }

}
