import { VPerson } from './../../shared/sdk/models/VPerson';
import { VPersonApi } from './../../shared/sdk/services/custom/VPerson';
import { VPlocationApi } from './../../shared/sdk/services/custom/VPlocation';
import { Router, ActivatedRoute } from '@angular/router';
import { LabelService } from './../../services/label.service';
import { ScheduleService } from './../../services/schedule.service';
import { Component, OnInit } from '@angular/core';
import { BaseFormComponent } from '../forms/baseForm.component';

@Component({
  selector: 'app-member-schedule',
  templateUrl: './member-schedule.component.html',
  providers: [ScheduleService, LabelService]
})
export class MemberScheduleComponent extends BaseFormComponent implements OnInit {

  header: any;

  events: any;

  defaultView;

  choices;

  paginatorPCount = 0;
  paginatorInitPage = 1;
  paginatorPageSize = 20;


  // rooms chekboxes
  selectedChoices = [];

  // location checkboxes
  selectedChoicesl = [];
  choicesl;

  init;
  start;
  end;

  constructor(
    private _labelService: LabelService,
    private _eventService: ScheduleService,
    private _route: ActivatedRoute,
    private _personApi: VPersonApi,
    private _locApi: VPlocationApi,
    private _router: Router
  ) {
    super('person', 'member schedule');
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

  }

  selectData() {
    this.findMember('', 1);
  }


  private findMember(value, page) {

    value = '%' + value + '%';

    this._personApi.find({ where: { isMember: 1, or: [{ firstname: { like: value } }, { lastname: { like: value } }, { personName: { like: value } }] }, limit: this.paginatorPageSize, skip: this.paginatorPageSize * (page - 1), order: "lastname" })
      .subscribe(res => {
        this.choices = res;
        for (let p of res)
          p['locked'] = this.setLock(<VPerson>p);
        this.fixListLength(this.paginatorPageSize, this.choices);
        this._personApi.count({ or: [{ firstname: { like: value } }, { lastname: { like: value } }, { personName: { like: value } }] })
          .subscribe(res2 => this.paginatorPCount = res2.count);
      }
      , err => console.log(err));

  }

  setLock(p: VPerson): boolean {
    if (p.locationsids) {
      let values = p.locationsids.split(',');
      for (let v of values)
        if (this.getUserLocationsIds().indexOf(parseInt(v)) > -1)
          return false;
      return true;
    }
    else return true;
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
          this.events = this._eventService.getEventsOfMembers(this.selectedChoices, e.view.start.format(), e.view.end.format(), this.showCanceled, this.selectedChoicesl);
          this.init = false;
        }, err => console.log(err));
    else
      this.events = this._eventService.getEventsOfMembers(this.selectedChoices, e.view.start.format(), e.view.end.format(), this.showCanceled, this.selectedChoicesl);
  }

  show(id) {
    //this.events = this._eventService.getEventsOfRooms([id],this.start, this.end);
  }

  toggle(id) {
    var index = this.selectedChoices.indexOf(id);
    if (index === -1) this.selectedChoices.push(id);
    else this.selectedChoices.splice(index, 1);
    this.events = this._eventService.getEventsOfMembers(this.selectedChoices, this.start, this.end, this.showCanceled, this.selectedChoicesl);
  }

  togglel(id) {
    var index = this.selectedChoicesl.indexOf(id);
    if (index === -1) this.selectedChoicesl.push(id);
    else this.selectedChoicesl.splice(index, 1);
    this.events = this._eventService.getEventsOfMembers(this.selectedChoices, this.start, this.end, this.showCanceled, this.selectedChoicesl);
  }

  showCanceled = false;
  toggleCanceled() {
    this.showCanceled = !this.showCanceled;
    this.events = this._eventService.getEventsOfMembers(this.selectedChoices, this.start, this.end, this.showCanceled, this.selectedChoicesl);
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

