import { VPlocationApi } from './../../shared/sdk/services/custom/VPlocation';
import { ActivatedRoute } from '@angular/router';
import { BaseFormComponent } from '../forms/baseForm.component';
import { VRoomApi } from './../../shared/sdk/services/custom/VRoom';
import { Location } from '@angular/common';
import { VEvent } from './../../shared/sdk/models/VEvent';
import { VEventApi } from './../../shared/sdk/services/custom/VEvent';
import { DomSanitizer } from '@angular/platform-browser';
import { Component, OnInit, Input } from '@angular/core';
let moment = require('../../../assets/js/moment.min.js');

@Component({
  selector: 'app-plan',
  templateUrl: './plan.component.html',
  styleUrls: ['./plan.component.css']
})
export class PlanComponent extends BaseFormComponent implements OnInit {

  @Input() type;

  rooms;
  dates = [];
  events = [];
  selectedChoices = [];
  today = moment().format('D. M. Y');
  off = 0;

  constructor(
    private _roomApi: VRoomApi,
    private _eventApi: VEventApi,
    private _location: Location,
    private _route: ActivatedRoute,
    private _locApi: VPlocationApi,
    private _sanitizer: DomSanitizer
  ) {
    super('room', 'plan');
  }

  ngOnInit() {

    // this extremely ugly, but moment somehow does not change locale, it is connected with fullcalendar TODO fix this!
    moment.updateLocale('en', { weekdays: ['Nedelja', 'Ponedeljek', 'Torek', 'Sreda', 'Četrtek', 'Petek', 'Sobota'] });

    this.getProvidedRouteParamsLocations(this._route, this._locApi);

  }

  selectData() {
    let start;
    let end;
    let date;
    this.dates = [];
    this.events = [];

    if (this.type === 'widget') {
      date = moment().startOf('day');
      start = date.clone().format();
      this.dates.push({ date: date.clone().format('D. M. Y'), day: date.format('dddd'), d: parseInt(date.format('DD')) });
      date.add(1, 'd');
    } else {
      date = moment().startOf('week').add(this.off, 'w');
      start = date.clone().format();
      for (let i = 0; i < 7; i++)
        this.dates.push({ date: date.add(1, 'd').clone().format('D. M. Y'), day: date.format('dddd'), d: parseInt(date.format('DD')) });
    }

    end = date.clone().format();

    this._roomApi.find({ where: { onchart: 1, locationId: { inq: this.getUserLocationsIds() } }, order: 'name' })
      .subscribe(res => {
        this.rooms = res;

        for (let r of this.rooms)
          this.selectedChoices.push(r.id);

        // get all events
        this._eventApi.find({
          where: {
            roomId: { inq: this.selectedChoices }, isoff: 0, starttime: { gt: new Date(start) }, endtime: { lt: new Date(end) }
          },
          order: 'starttime'
        })
          .subscribe(res2 => {
            let off = '';
            for (let event of res2) {
              let e = <VEvent>event;
              let st = moment(e.starttime);
              let et = moment(e.endtime);
              if (e.meventId == null) off = '*'; else off = '';
              this.events.push(
                {
                  id: e.id, title: e.name + off,
                  start: st.format('H.mm'),
                  end: et.format('H.mm'),
                  color: e.color, allDay: e.isday, d: moment(st).date(), roomId: e.roomId
                }
              );
            }
          });

      });
  }

  back() {
    this._location.back();
  }

  print() {
    window.print();
  }

  next() {
    this.off++;
    this.selectData();
  }

  previous() {
    this.off--;
    this.selectData();
  }

}
