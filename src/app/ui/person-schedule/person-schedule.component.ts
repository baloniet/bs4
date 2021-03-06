import { VPlocationApi } from './../../shared/sdk/services/custom/VPlocation';
import { LoopBackFilter } from './../../shared/sdk/models/BaseModels';
import { Router, ActivatedRoute } from '@angular/router';
import { LabelService } from './../../services/label.service';
import { Person } from './../../shared/sdk/models/Person';
import { PersonApi } from './../../shared/sdk/services/custom/Person';
import { ScheduleService } from './../../services/schedule.service';
import { Component, OnInit } from '@angular/core';
import { BaseFormComponent } from '../forms/baseForm.component';

@Component({
  selector: 'app-person-schedule',
  templateUrl: './person-schedule.component.html',
  providers: [ScheduleService, LabelService]
})
export class PersonScheduleComponent extends BaseFormComponent implements OnInit {

  header: any;

  events: any;

  defaultView;

  // person checkboxes
  selectedChoices = [];
  choices;

  // location checkboxes
  selectedChoicesl = [];
  choicesl;

  init;
  start;
  end;

  paginatorPCount = 0;
  paginatorInitPage = 1;
  paginatorPageSize = 20;

  constructor(
    private _labelService: LabelService,
    private _eventService: ScheduleService,
    private _route: ActivatedRoute,
    private _personApi: PersonApi,
    private _locApi: VPlocationApi,
    private _router: Router
  ) {
    super('person', 'teacher schedule');
  }

  ngOnInit() {
    this.init = true;

    this.prepareLabels(this._labelService);

    this.defaultView = ['listMonth'];

    this.header = {
      left: 'prev, next, today myCustomButton',
      center: 'title',
      right: 'agendaWeek,listMonth,listWeek,listDay'
    };

    this.getProvidedRouteParamsLocations(this._route, this._locApi);
    this.findPeople('', 1);

  }

  findPeople(value, page) {
    value = '%' + value + '%';
    let lbf: LoopBackFilter = {};
    lbf.where = {
      and: [
        { or: [{ firstname: { like: value } }, { lastname: { like: value } }] },
        { or: [{ "isteacher": 1 }, { "isvolunteer": 1 }] }]
    };

    this._personApi.find({
      where: lbf.where,
      limit: this.paginatorPageSize, skip: this.paginatorPageSize * (page - 1),
      order: "lastname"
    })
      .subscribe(res => {
        this.choices = res;

        this.fixListLength(this.paginatorPageSize, this.choices);
        this._personApi.count(lbf.where)
          .subscribe(res2 => this.paginatorPCount = res2.count);
      }
      , err => console.log(err));
  }

  viewRender(e: any) {

    this.start = e.view.start.format();
    this.end = e.view.end.format();

    if (this.init)
      this._locApi.find({ where: { personId: this.getUserAppId() }, order: "name" })
        .subscribe(
        res => {
          this.choicesl = res;
          for (let r of res)
            this.selectedChoicesl.push(r['id']);
          this.events = this._eventService.getEventsOfPeople(this.selectedChoices, e.view.start.format(), e.view.end.format(), this.showCanceled, this.selectedChoicesl);
          this.init = false;
        }, err => console.log(err));
    else
      this.events = this._eventService.getEventsOfPeople(this.selectedChoices, e.view.start.format(), e.view.end.format(), this.showCanceled, this.selectedChoicesl);
  }

  show(id) {
    //this.events = this._eventService.getEventsOfRooms([id],this.start, this.end);
  }

  toggle(id) {
    var index = this.selectedChoices.indexOf(id);
    if (index === -1) this.selectedChoices.push(id);
    else this.selectedChoices.splice(index, 1);
    this.events = this._eventService.getEventsOfPeople(this.selectedChoices, this.start, this.end, this.showCanceled, this.selectedChoicesl);
  }

  togglel(id) {
    var index = this.selectedChoicesl.indexOf(id);
    if (index === -1) this.selectedChoicesl.push(id);
    else this.selectedChoicesl.splice(index, 1);
    this.events = this._eventService.getEventsOfPeople(this.selectedChoices, this.start, this.end, this.showCanceled, this.selectedChoicesl);
  }

  showCanceled = false;
  toggleCanceled() {
    this.showCanceled = !this.showCanceled;
    this.events = this._eventService.getEventsOfPeople(this.selectedChoices, this.start, this.end, this.showCanceled, this.selectedChoicesl);
  }

  exists(id) {
    return this.selectedChoices.indexOf(id) > -1;
  }

  existsl(id) {
    return this.selectedChoicesl.indexOf(id) > -1;
  }

  // open event view on click
  handleEventClick(e: any) {

    this._router.navigate(['/view/event', { 'type': 'event', 'id': e.calEvent.id }]);

  }

}
