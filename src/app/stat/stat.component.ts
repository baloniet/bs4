import { VStatPlanApi } from './../shared/sdk/services/custom/VStatPlan';
import { VStatPlanMonthApi } from './../shared/sdk/services/custom/VStatPlanMonth';
import { ThemeApi } from './../shared/sdk/services/custom/Theme';
import { Observable } from 'rxjs/Observable';
import { Location } from '@angular/common';
import { ProjectApi } from './../shared/sdk/services/custom/Project';
import { VPlocationApi } from './../shared/sdk/services/custom/VPlocation';
import { StatementApi } from './../shared/sdk/services/custom/Statement';
import { VStatMemberApi } from './../shared/sdk/services/custom/VStatMember';
import { VStatVisitApi } from './../shared/sdk/services/custom/VStatVisit';
import { VStatFullApi } from './../shared/sdk/services/custom/VStatFull';
import { PartnerApi } from './../shared/sdk/services/custom/Partner';
import { Router, ActivatedRoute } from '@angular/router';
import { LabelService } from './../services/label.service';
import { Component, OnInit } from '@angular/core';
import { BaseFormComponent } from '../ui/forms/baseForm.component';
let moment = require('../../assets/js/moment.min.js');

@Component({
  selector: 'app-stat',
  templateUrl: './stat.component.html',
  styleUrls: ['./stat.component.css']
})
export class StatComponent extends BaseFormComponent implements OnInit {

  paginatorPageSize = 15;
  paginatorInitPage = 1;
  paginatorCount = 0;

  // partner checkboxes
  selectedChoicesP = [];
  choicesP;

  // location checkboxes
  selectedChoicesL = [];
  choicesL;

  // theme checkboxes
  selectedChoicesT = [];
  choicesT;

  // stat member data
  sumMembers = 0;
  sumVisits = 0;
  planSum;
  timeSum;


  // plan data
  plan = [];
  plangrid;
  plangridv;
  currentDate = new Date();
  currMonth = moment(this.currentDate).month();


  // year
  yearItems = [{ text: '2016' }, { text: '2017' }, { text: '2018' }, { text: '2019' }, { text: '2020' }, { text: '2021' }];
  private yearSel = [{ text: '2017' }];
  private year = 2017;
  private statements = [];

  public barChartOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true,
    title: {
      display: true,
      text: 'Letni pregled'
    },
    scales: {
      yAxes: [{
        ticks: {
          min: 0
        }
      }]
    }
  };

  public lineChartOptions: any = {
    scaleShowVerticalLines: true,
    responsive: true,
    title: {
      display: true,
      text: 'Mesečni pregled'
    },
    scales: {
      yAxes: [{
        ticks: {
          min: 0
        }
      }]
    }
  };

  // bar
  public barChartLabels: string[] = [];
  public barChartType: string = 'bar';
  public barChartLegend: boolean = true;

  public barChartData: any[] = [
    { data: [], label: 'Včlanitve' },
    { data: [], label: 'Obiski' }
  ];

  public pieChartType: string = 'pie';

  // lines
  public lineChartLabels: Array<any> =
  ['Januar', 'Februar', 'Marec', 'April', 'Maj', 'Junij', 'Julij', 'Avgust', 'September', 'Oktober', 'November', 'December', 'Neznano'];
  public lineChartType: string = 'line';

  public lineChartData: any[] = [
    { data: [], label: 'Včlanitve' },
    { data: [], label: 'Obiski' }
  ];

  // Doughnut
  public doughnutChartLabels: string[] = ['Vsi dogodki', 'Potrjeni', 'Preklicani'];
  public doughnutChartData: number[] = [550, 450, 100];
  public doughnutChartType: string = 'doughnut';

  // Pie
  public pieChartLabels: string[] = ['Plan', 'Realizacija'];
  public pieChartData: number[] = [];


  constructor(
    private _labelService: LabelService,
    private _router: Router,
    private _route: ActivatedRoute,
    private _partApi: PartnerApi,
    private _vPloc: VPlocationApi,
    private _projectApi: ProjectApi,
    private _memStatApi: VStatMemberApi,
    private _visitStatApi: VStatVisitApi,
    private _planApi: VStatPlanApi,
    private _planMApi: VStatPlanMonthApi,
    private _planVF: VStatFullApi,
    private _stmtApi: StatementApi,
    private _themeApi: ThemeApi,
    private _location: Location
  ) {
    super('stat');
  }

  ngOnInit() {

    this.prepareLabels(this._labelService);
    this.getProvidedRouteParamsLocations(this._route, this._vPloc);
  }

  selectData() {
    this.selectedChoicesP = [];
    this.selectedChoicesL = [];
    this.statements = [];
    // get statement for selected year
    this._stmtApi.find({ where: { year: this.year, ismember: true } })
      .subscribe(res => {

        for (let r of res)
          this.statements.push(r['id']);

        // prepare my partners
        this._vPloc.partners(this.getUserAppId())
          .subscribe(res2 => {
            this.choicesP = res2;
            for (let r of res2)
              this.selectedChoicesP.push(r['id']);
            this.prepareLocations();
          }, this.errMethod);

      }, this.errMethod);

    this._themeApi.find({ order: 'name' })
      .subscribe(res => {
        this.choicesT = res;
        for (let r of res)
          this.selectedChoicesT.push(r['id']);
      }, this.errMethod);
  }

  prepareLocations() {
    this.barChartLabels = [];
    this.selectedChoicesL = [];
    // prepare my locations
    this._vPloc.find({ where: { partnerId: { inq: this.selectedChoicesP }, personId: this.getUserAppId() }, order: 'name' })
      .subscribe(res => {
        this.choicesL = res;
        let i = 0;
        for (let r of res) {
          this.selectedChoicesL.push({ id: r['id'], sel: true, index: i });
          i++;
          this.barChartLabels.push(r['name']);
          this.barChartData[0].data.push(0);
          this.barChartData[1].data.push(0);
        }
        this.prepareData();
      }, this.errMethod);
  }

  exists(id, type) {
    if (type === 'partners') {
      return this.selectedChoicesP.indexOf(id) > -1;
    } else if (type === 'themes') {
      return this.selectedChoicesT.indexOf(id) > -1;
    } else if (type === 'locations') {
      if (this.selectedChoicesL) {
        let obj = this.fromIdO(this.selectedChoicesL, id);
        if (obj && obj.sel)
          return obj.sel;
      } else
        return false;
    }
  }

  toggle(obj, type) {
    let id = obj.id;
    if (type === 'partners') {
      let index = this.selectedChoicesP.indexOf(id);
      if (index === -1) {
        this.selectedChoicesP.push(id);
      } else this.selectedChoicesP.splice(index, 1);
      this.prepareLocations();
    } if (type === 'themes') {
      let index = this.selectedChoicesT.indexOf(id);
      if (index === -1) {
        this.selectedChoicesT.push(id);
      } else this.selectedChoicesT.splice(index, 1);
      this.preparePlan(1);
    } else if (type === 'locations') {
      let o = this.fromIdO(this.selectedChoicesL, obj.id);
      o.sel = !o.sel;
      this.prepareData();
    }
  }

  // method for select boxes
  public selected(value: any, type: string): void {

    if (type === 'year') {
      this.yearSel = [{ text: value.text }];
      this.year = parseInt(value.text);
      this.selectData();
    }
  }

  // events
  public chartClicked(e: any): void {

  }

  public chartHovered(e: any): void {

  }


  // limit: this.paginatorPageSize, skip: this.paginatorPageSize * (page - 1) 

  prepareData() {

    this.sumMembers = 0;
    this.sumVisits = 0;

    // get selected locations
    let locs = [];
    for (let l of this.selectedChoicesL)
      if (l.sel)
        locs.push(l.id);
    this.barChartData[0].data = new Array(locs.length).fill(0);
    this.barChartData[1].data = new Array(locs.length).fill(0);
    this.lineChartData[0].data = new Array(13).fill(0);
    this.lineChartData[1].data = new Array(13).fill(0);


    Observable.forkJoin(

      this._visitStatApi.find({ where: { locationId: { inq: locs }, statementId: { inq: this.statements } } }),
      this._memStatApi.find({ where: { locationId: { inq: locs }, statementId: { inq: this.statements } } }))

      .subscribe(res => {

        // prepare visit data
        for (let r of res[0]) {
          this.sumVisits += r['cnt'];

          let locId = r['locationId'];
          let index = locs.indexOf(locId);
          this.barChartData[1].data[index] += r['cnt'];

          let month = parseInt(r['month']);
          if (month) {
            this.lineChartData[1].data[month - 1] += r['cnt'];
          } else
            this.lineChartData[1].data[12] += r['cnt'];

        }

        // prepare registration data
        for (let r of res[1]) {
          this.sumMembers += r['cnt'];

          let locId = r['locationId'];
          let index = locs.indexOf(locId);
          this.barChartData[0].data[index] += r['cnt'];

          let month = parseInt(r['month']);
          if (month) {
            this.lineChartData[0].data[month - 1] += r['cnt'];
          } else
            this.lineChartData[0].data[12] += r['cnt'];

        }

        // prepare plan data
        this.preparePlan(1);

        this.prepareBar();

      }, this.errMethod);

  }

  public preparePlan(page) {

    this.planSum = 0;
    this.timeSum = 0;

    // first call, just for sums
    this._planApi.find({
      where: { partnerId: { inq: this.selectedChoicesP }, themeId: { inq: this.selectedChoicesT }, year: this.year }
    })
      .subscribe(res => {
        for (let r of res) {
          if (r['plan'])
            this.planSum += parseInt(r['plan']);
          if (r['sumtime'])
            this.timeSum += parseInt(r['sumtime']);
        }
        this.timeSum = Math.round(this.timeSum / 45);
        this.pieChartData = [this.planSum, this.timeSum];
      }, this.errMethod);

    // second call for data
    this._planApi.find({
      where: { partnerId: { inq: this.selectedChoicesP }, themeId: { inq: this.selectedChoicesT }, year: this.year },
      order: ['themename', 'kindname'],
      limit: this.paginatorPageSize, skip: this.paginatorPageSize * (page - 1)
    })
      .subscribe(res => {
        this.plan = [];

        let tkids = new Array(this.paginatorPageSize).fill(0);

        this.plangrid = [];
        this.plangridv = [];
        for (let i = 0; i < this.paginatorPageSize; i++) {
          this.plangrid[i] = new Array(12).fill(0);
          this.plangridv[i] = new Array(12).fill(0);
        }

        let i = 0;
        for (let r of res) {
          r['partnerName'] = this.fromIdO(this.choicesP, r['partnerId']);
          this.plan.push(r);
          tkids[i] = r['id'];
          i++;
        }

        /*this._planMApi.find({ where: { id: { inq: tkids } } })
          .subscribe(res2 => {

            for (let r of res2) {
              let index = tkids.indexOf(parseInt(r['id']));
              this.plangrid[index][parseInt(r['month']) - 1] = r['sumtime'];
            }
          }, this.errMethod);*/

        this._planVF.find({ where: { id: { inq: tkids } } })
          .subscribe(res2 => {

            for (let r of res2) {
              let index = tkids.indexOf(parseInt(r['id']));
              this.plangrid[index][parseInt(r['month']) - 1] = r['sumtime'];
              this.plangridv[index][parseInt(r['month']) - 1] = r['sumperson'];
            }
          }, this.errMethod);

        this.fixListLength(this.paginatorPageSize, this.plan);
        this._planApi.count({ partnerId: { inq: this.selectedChoicesP }, themeId: { inq: this.selectedChoicesT }, year: this.year }).
          subscribe(res2 => this.paginatorCount = res2.count);
      }, this.errMethod);


  }

  public prepareBar(): void {
    // prepare bar chart labels
    this.barChartLabels = [];
    for (let c of this.choicesL) {
      if (this.exists(c.id, 'locations')) {
        this.barChartLabels.push(c.name);
      }
    }

    /**
     * (My guess), for Angular to recognize the change in the dataset
     * it has to change the dataset variable directly,
     * so one way around it, is to clone the data, change it and then
     * assign it;
     */
    let clone = JSON.parse(JSON.stringify(this.barChartData));
    this.barChartData = clone;

    let clone2 = JSON.parse(JSON.stringify(this.lineChartData));
    this.lineChartData = clone2;
  }

  public randomizeType(): void {
    this.pieChartType = this.pieChartType === 'doughnut' ? 'pie' : 'doughnut';
  }

  print() {
    window.print();
  }

  reset(type, state) {
    if (type === 'partners') {
      this.selectedChoicesP = [];
      if (state) {
        for (let c of this.choicesP) {
          this.selectedChoicesP.push(c['id']);
        }
      }
    } else if (type === 'themes') {
      this.selectedChoicesT = [];
      if (state) {
        for (let c of this.choicesT) {
          this.selectedChoicesT.push(c['id']);
        }
      }
      this.preparePlan(1);
    }
  }
}
