import { VMevent } from './../../shared/sdk/models/VMevent';
import { EPerson } from './../../shared/sdk/models/EPerson';
import { EPersonApi } from './../../shared/sdk/services/custom/EPerson';
import { Location } from '@angular/common';
import { VActivityApi } from './../../shared/sdk/services/custom/VActivity';
import { VMeventApi } from './../../shared/sdk/services/custom/VMevent';
import { VAmember } from './../../shared/sdk/models/VAmember';
import { VAmemberApi } from './../../shared/sdk/services/custom/VAmember';
import { ActivatedRoute } from '@angular/router';
import { LabelService } from './../../services/label.service';
import { EventApi } from './../../shared/sdk/services/custom/Event';
import { BaseFormComponent } from '../../ui/forms/baseForm.component';
import { Component, OnInit } from '@angular/core';

let moment = require('./../../../assets/js/moment.min.js');

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css']
})
export class GridComponent extends BaseFormComponent implements OnInit {

  private actId;
  events;
  private eids;
  members = [];
  private membersids;
  act;
  showPlus;
  month;
  off = 0;
  private start;
  private end;

  constructor(
    private _location: Location,
    private _labelService: LabelService,
    private _route: ActivatedRoute,
    private _eventApi: EventApi,
    private _memberApi: VAmemberApi,
    private _eApi: VMeventApi,
    private _actApi: VActivityApi,
    private _epersApi: EPersonApi
  ) {
    super('event-view', 'grid');
  }

  ngOnInit() {
    // this is extremely ugly, but moment somehow does not change locale, it is connected with fullcalendar TODO fix this!
    moment.updateLocale('en', {
      weekdays: ['Nedelja', 'Ponedeljek', 'Torek', 'Sreda', 'Četrtek', 'Petek', 'Sobota'],
      months: ['Januar', 'Februar', 'Marec', 'April', 'Maj', 'Junij', 'Julij', 'Avgust', 'September', 'Oktober', 'November', 'December']
    });
    this.prepareLabels(this._labelService);
    this.getProvidedRouteParams(this._route);
  }

  selectData(param) {
    if (param) {
      this.actId = param.id;
      this.prepareEvents();
    }
  }

  private prepareEvents() {
    this.showPlus = false;
    this.events = [];
    for (let m of this.members) {
      m.events = [];
    }

    let date;
    date = moment().startOf('month');
    this.start = date.clone().add(this.off, 'month').format();
    this.end = date.add(this.off + 1, 'month').format();
    this.month = moment(this.start).format('MMMM YYYY');

    this._actApi.find({ where: { id: this.actId } })
      .subscribe(res => this.act = res[0], err => this.errMethod);

    this._eventApi.find({
      order: 'starttime',
      where: { 'activityId': this.actId, starttime: { gt: new Date(this.start) }, endtime: { lt: new Date(this.end) } }
    })
      .subscribe(res => {
        this.events = res;
        this.eids = res.map(r => r['id']);
        this.prepareMembers();
      }, this.errMethod);

  }

  prepareMembers() {
    this.showPlus = false;
    this._memberApi.find({ order: ['lastname', 'firstname'], where: { 'id': this.actId } })
      .subscribe(res => {
        this.members = [];
        this.membersids = res.map(r => r['personId']);

        for (let m of res)

          this.members.push({
            personId: (<VAmember>m).personId,
            lastname: (<VAmember>m).lastname,
            firstname: (<VAmember>m).firstname,
            mnum: (<VAmember>m).mnum,
            events: this.eids.slice()
          });
        this._eApi.find({
          order: 'personId',
          where: { activityId: this.actId, personId: { inq: this.membersids }, starttime: { gt: new Date(this.start) }, endtime: { lt: new Date(this.end) } }
        })
          .subscribe(res2 => {
            for (let e of res2) {
              let el = <VMevent>e;
              let member = this.members[this.membersids.indexOf(el.personId)];
              let evts = member.events;
              let index = evts.indexOf(el.id);
              if (index > -1) {
                evts[index] = { ack: e['padate'], off: e['podate'], test: 1, personId: el.personId, eventId: el.id, epersonId: el.epersonId };
              };
              this.showPlus = true;
            }
          }, this.errMethod);
      }, this.errMethod);
  }

  // toggle acknowledge and offcheck for person and specified event
  toggle(d, type: string, m) {

    let eventId = m.events.indexOf(d);
    if (type === 'off') {
      if (d.off) {
        d.off = null;
      } else d.off = moment().format();
    } else if (type === 'ack') {
      if (d.ack) {
        d.ack = null;
      } else d.ack = moment().format();
    } 

    let ep = new EPerson;
    ep.personId = d.personId;
    ep.eventId = d.eventId;
    ep.adate = d.ack;
    ep.odate = d.off;
    ep.id = d.epersonId;

    if (type === 'remove') {
      this._epersApi.deleteById(d.epersonId)
        .subscribe(res => {
          m.events[eventId] = d.eventId;
        }, this.errMethod);
    } else {
      if (type === 'add') {
        ep.adate = moment().format();
        ep.personId = m.personId;
        ep.eventId = d;
        ep.id = 0;
      }
      this._epersApi.upsert(ep)
        .subscribe(res => {
          if (type === 'add'){
            m.events[eventId] = {
               test: 1, ack: (<EPerson>res).adate, off: null, epersonId: (<EPerson>res).id, personId: (<EPerson>res).personId, eventId: (<EPerson>res).eventId
              };
          }
        }, this.errMethod);
    }

  }

  next() {
    this.off++;
    this.prepareEvents();
  }

  previous() {
    this.off--;
    this.prepareEvents();
  }

  print() {
    window.print();
  }

  back() {
    this._location.back();
  }
}
