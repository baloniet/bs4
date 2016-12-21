import { Location } from '@angular/common';
import { VEvent } from './../../shared/sdk/models/VEvent';
import { VEventApi } from './../../shared/sdk/services/custom/VEvent';
import { DomSanitizer } from '@angular/platform-browser';
import { RoomApi } from './../../shared/sdk/services/custom/Room';
import { Component, OnInit, Input } from '@angular/core';
var moment = require('../../../assets/js/moment.min.js');

@Component({
  selector: 'app-plan',
  templateUrl: './plan.component.html',
  styleUrls: ['./plan.component.css']
})
export class PlanComponent implements OnInit {

  @Input() type;

  rooms;
  dates = [];
  events = [];
  selectedChoices = [];
  erd = [];
  today = moment().format('DD.MM.YYYY');

  constructor(
    private _roomApi: RoomApi,
    private _eventApi: VEventApi,
    private _location: Location,
    private _sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    let start;
    let end;
    let date;

    // this extremely ugly, but moment somehow does not change locale, it is connected with fullcalendar TODO fix this!
    moment.updateLocale('en', {weekdays : ["Nedelja", "Ponedeljek", "Torek", "Sreda", "Četrtek", "Petek", "Sobota"]});

    if (this.type == 'standalone') {
      date = moment().startOf('day');
      start = date.clone().format();
      this.dates.push({ date: date.clone().format('DD.MM.YYYY'), day: date.format('dddd'), d: parseInt(date.format('DD')) });
      date.add(1, 'd');
    } else {
      date = moment().startOf('week');
      start = date.clone().format();
      for (let i = 0; i < 7; i++)
        this.dates.push({ date: date.add(1, 'd').clone().format('DD.MM.YYYY'), day: date.format('dddd'), d: parseInt(date.format('DD')) });
    }

    end = date.clone().format();

    this._roomApi.find({ where: { onchart: 1 } })
      .subscribe(res => {
        this.rooms = res;
        for (let r of this.rooms)
          this.selectedChoices.push(r.id);

        // get all events
        this._eventApi.find({ where: { roomId: { inq: this.selectedChoices }, starttime: { gt: new Date(start) }, endtime: { lt: new Date(end) } } })
          .subscribe(res => {
            let off = '';
            for (let event of res) {
              let e = <VEvent>event;
              let st = moment(e.starttime);
              let et = moment(e.endtime);
              if (e.meventId == null) off = '*'; else off = '';
              this.events.push({ id: e.id, title: e.name + off, start: st.format('HH:mm'), end: et.format('HH:mm'), color: e.color, allDay: e.isday, d: moment(st).date(), roomId: e.roomId });
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

}