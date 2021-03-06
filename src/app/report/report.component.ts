import { VPlocationApi } from './../shared/sdk/services/custom/VPlocation';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { VReport } from './../shared/sdk/models/VReport';
import { VReportApi } from './../shared/sdk/services/custom/VReport';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { LabelService } from './../services/label.service';
import { Component, OnInit } from '@angular/core';
import { BaseFormComponent } from '../ui/forms/baseForm.component';
import { TemplateApi } from '../shared/sdk/services/index';
import { Template } from '../shared/sdk/models/index';
import { SettingsApi } from '../shared/sdk/services/index';
import { Settings } from '../shared/sdk/models/index';


let moment = require('../../assets/js/moment.min.js');
let FileSaver = require('file-saver');

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent extends BaseFormComponent implements OnInit {

  private templateItems;
  private templateSel = [];
  private selTplId;
  private repLines;
  editable = true;
  private path;
  private linkProgram;
  private linkFlyer;
  private timeRule = 'thisWeek';
  dateStart;
  dateEnd;
  model: NgbDateStruct;
  partners: number[];

  constructor(
    private _labelService: LabelService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _location: Location,
    private _tempApi: TemplateApi,
    private _setApi: SettingsApi,
    private _vplocApi: VPlocationApi,
    private _repApi: VReportApi
  ) {
    super('report');
  }

  ngOnInit() {
    // this extremely ugly, but moment somehow does not change locale, it is connected with fullcalendar TODO fix this!
    moment.updateLocale('en', { weekdays: ['Nedelja', 'Ponedeljek', 'Torek', 'Sreda', 'Četrtek', 'Petek', 'Sobota'] });

    this.prepareLabels(this._labelService);
    this.getProvidedRouteParamsLocations(this._route, this._vplocApi);

    this.path = window.location.origin;

  }

  back() {
    this._location.back();
  }

  selectData(param) {

    this.prepareDates();

    this._vplocApi.partners(this.getUserAppId())
      .subscribe(res => {
        this.partners = [];
        for (let one of res)
          this.partners.push(one.id);


        this._tempApi.find({ where: { active: true, partnerId: { inq: this.partners } } })
          .subscribe(res2 => {
            this.templateItems = [];

            for (let one of res2)
              this.templateItems.push({ id: (<Template>one).id, text: (<Template>one).name });
          }, this.errMethod);
      }, this.errMethod);

    this._setApi.find({ where: { or: [{ name: 'flyer' }, { name: 'program' }] } })
      .subscribe(res => {
        for (let s of res) {
          let one = <Settings>s;
          if (one.name === 'flyer') {
            this.linkFlyer = one.value;
          } else if (one.name === 'program')
            this.linkProgram = one.value;
        }
      });
  }

  selected(event) {

    this.templateSel = event;
    this.selTplId = event.id;
    this.repLines = [];

    this._repApi.find({
      where: { templateId: event.id, starttime: { gt: new Date(this.dateStart) }, endtime: { lt: new Date(this.dateEnd) } },
      order: 'starttime'
    })
      .subscribe(res => {
        for (let r of res) {
          let e = <VReport>r;
          let st = moment(e.starttime);
          let et = moment(e.endtime);
          this.repLines.push({ e: e, st: st.format('D. M. Y, H.mm'), et: et.format('H.mm'),  day: st.format('dddd') });
        };
      });
  }

  prepareDates() {
    let start;
    let end;

    switch (this.timeRule) {
      case 'thisWeek':
        start = moment().startOf('isoWeek');
        end = start.clone().add(7, 'd');
        break;
      case 'nextWeek':
        start = moment().startOf('isoWeek').add(7, 'd');
        end = start.clone().add(7, 'd');
        break;
      case 'thisMonth':
        start = moment().startOf('month');
        end = start.clone().add(1, 'M');
        break;
      case 'nextMonth':
        start = moment().startOf('month').add(1, 'M');
        end = start.clone().add(1, 'M');
        break;
      default:
        start = moment().startOf('isoWeek');
        end = start.clone().add(7, 'd');
        break;
    }

    this.dateStart = start.format();
    this.dateEnd = end.format();
  }

  saveFilet(value) {

    let out = '<html>' +
      '<head><meta charset="utf-8">' +
      '<title>Megeneracijski center Kranj</title></head><body>';

    let re = /_ngcontent-|<!--template bindings=\{([^}]+)\}-->/g;
    let str;
    str = value.innerHTML.replace(re, '');
    out += str + '</body></html>';
    // out += value.innerHTML + 'ooooo</body></html>';

    let data = new Blob([out], { type: 'text/plain;charset=utf-8' });
    // let file = new File([out], 'obvestilo.doc', { type: 'data:text/html;charset=utf-8' });
    FileSaver.saveAs(data, 'obvestilo.doc');
  }

  navigate() {
    if (this._location.path() === '/veport') {
      this._router.navigate(['/report']);
    } else {
      this._router.navigate(['/veport']);
    }
  }

  setTimeRule(value) {
    this.timeRule = value;
    this.prepareDates();
  }

  setSDate(value) {
    if (value) {
      this.dateStart = moment([value.year, value.month - 1, value.day]).format();
      if (value.day > 27) {
        let next = moment([value.year, value.month - 1, value.day]).add(1, 'M').clone();
        this.model = { year: next.year(), month: next.month() + 1, day: 1 };
        this.dateEnd = moment([this.model.year, this.model.month - 1, 1]).format();
      }
    }
  }

  setEDate(value) {
    if (value) {
      this.dateEnd = moment([value.year, value.month - 1, value.day]).format();
    }
  }
}
