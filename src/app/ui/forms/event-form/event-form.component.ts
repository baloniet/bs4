import { SelectItem } from './../../ng2-select/select/select-item';
import { VEvent } from './../../../shared/sdk/models/VEvent';
import { LocationApi } from './../../../shared/sdk/services/custom/Location';
import { Room } from './../../../shared/sdk/models/Room';
import { DateFormatter } from './../../../shared/date.formatter';
import { Event } from './../../../shared/sdk/models/Event';
import { APerson } from './../../../shared/sdk/models/APerson';
import { Person } from './../../../shared/sdk/models/Person';
import { Observable } from 'rxjs/Observable';
import { Activity } from './../../../shared/sdk/models/Activity';
import { ActivityApi } from './../../../shared/sdk/services/custom/Activity';
import { EventApi } from './../../../shared/sdk/services/custom/Event';
import { RoomApi } from './../../../shared/sdk/services/custom/Room';
import { BaseFormComponent } from '../baseForm.component';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDateStruct, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { Location } from '@angular/common';
import { VEventApi } from './../../../shared/sdk/services/custom/VEvent';
import { LabelService } from '../../../services/label.service';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

let moment = require('../../../../assets/js/moment.min.js');

@Component({
    selector: 'app-event-form',
    templateUrl: './event-form.component.html',
    styleUrls: ['./event-form.component.css'],
    providers: [LabelService]
})
export class EventFormComponent extends BaseFormComponent implements OnInit, AfterViewInit {

    private updatedForm: boolean;
    private data;
    private evtId;
    private roomItems;
    private roomSel = [];

    rTypeItems = [{ id: 'd', text: 'dnevno' }, { id: 'w', text: 'tedensko' }, { id: 'M', text: 'mesečno' }, { id: '2w', text: 'na 14 dni' }];
    private rTypeSel = [{ id: 'd', text: 'dnevno' }];

    private rForm: FormGroup;

    private eventss;
    minuteStep = 15;


    private deleteRule: string = 'nodefaultforsure';

    private act = {};
    private teachers = [{}];
    private volunteers = [{}];
    location;

    paginatorPageSize = 10;
    paginatorECount = 0;

    month;
    off = 0;
    dates;
    datesidx;
    selectEventTab = false;

    @ViewChild('t') ngbTabSet;

    constructor(
        private _labelService: LabelService,
        private _route: ActivatedRoute,
        private _router: Router,
        private _api: EventApi,
        private _actApi: ActivityApi,
        private _roomApi: RoomApi,
        private _fb: FormBuilder,
        private _formatter: NgbDateParserFormatter,
        private _location: Location,
        private _locApi: LocationApi,
        private _eapi: VEventApi
    ) {
        super('event');
    }

    ngAfterViewInit() {
        if (this.selectEventTab) {
            this.ngbTabSet.select('event');
            this.selectEventTab = false;
        }
    }

    ngOnInit() {

        // this is extremely ugly, but moment somehow does not change locale, it is connected with fullcalendar TODO fix this!
        moment.updateLocale('en', {
            weekdays: ['Nedelja', 'Ponedeljek', 'Torek', 'Sreda', 'Četrtek', 'Petek', 'Sobota'],
            months: ['Januar', 'Februar', 'Marec', 'April', 'Maj', 'Junij', 'Julij', 'Avgust', 'September', 'Oktober', 'November', 'December']
        });

        this.form = this._fb.group({
            id: [''],
            name: ['', Validators.required],
            content: [''],
            comment: [''],
            max: [''],
            roomId: [],
            startdate: ['', Validators.required],
            isday: [],
            starttime: [{ hour: 12, minute: '00' }],
            endtime: [{ hour: 12, minute: '30' }],
            cdate: [],
            activityId: [],
            locationId: [],
            meventId: [],
            isacc: false,
            isoff: false,
            odate: [],
            adate: []
        });

        this.rForm = this._fb.group({
            skipWeekend: true,
            deleteAllNotFirst: true,
            enddate: [''],
            rCnt: ''
        });

        this.prepareLabels(this._labelService);
        this.getProvidedRouteParams(this._route);

        this.form.valueChanges
            .subscribe(data => this.isRoomFree());

    }

    back() {
        // this._location.back();
        this._router.navigate(['genlist/event', { type: 'event', id: this.act['id'] }]);
    }

    // send model to service and save to db, return to list
    save(model) {

        model.activityId = this.act['id'];
        model.locationId = this.location.id;

        if (this.roomSel[0])
            model.roomId = this.roomSel[0].id;


        model.starttime = (<DateFormatter>this._formatter).momentDTL(model.startdate, model.starttime, true);
        model.endtime = (<DateFormatter>this._formatter).momentDTL(model.startdate, model.endtime, true);

        if (!this.form.pristine) {
            this._api.upsert(model)
                .subscribe(
                res => this.form.markAsPristine(),
                this.errMethod,
                () => this.back()
                );
        }

    }

    // call service to find model in db
    selectData(param) {
        this.updatedForm = false;
        this.data = {};

        this.teachers = [{}];
        this.volunteers = [{}];

        // if update find Event
        if (param.action === 'u' || param.action === 'b') {

            this._api.findById(param.id)
                .subscribe(res => {
                    this.data = res;
                    this.prepareDates(this.data);

                    (<FormGroup>this.form).setValue(this.data, { onlySelf: true });
                    this.prepareActivityData4Form((<Event>res).activityId, (<Event>res));
                });
            this._api.find({ where: { meventId: param.id } })
                .subscribe(res => this.eventss = res, this.errMethod);
            this.evtId = param.id;
            this.setMonth();
        }

        // we have val instead of id on purpose
        if (param.type === 'activity' && param.id) {
            this.prepareActivityData4Form(param.id);
        }

    }

    prepareRooms(locationId, evt?) {
        // get rooms based on location
        this._roomApi.find({ where: { locationId: locationId }, order: 'name' }).subscribe(res => {
            this.roomItems = [];
            for (let one of res)
                this.roomItems.push({ id: (<Room>one).id, text: (<Room>one).name });
            if (evt)
                this.roomSel = evt.roomId ? this.fromId(this.roomItems, evt.roomId) : '';
        });

    }

    // custom methods for this class

    private prepareActivityData4Form(actId, evt?) {
        this.selectEventTab = true;
        if (this.ngbTabSet && this.ngbTabSet.activeId) {
            this.ngbTabSet.select('event');
        }
        // get selected activity 
        Observable.forkJoin(
            this._actApi.findById(actId),
            this._actApi.getPeople(actId),
            this._actApi.getAPers(actId))
            .subscribe(res => {
                let act = <Activity>res[0];
                this.prepareActivityData(act, res[1], res[2]);
                if (act.locationId) {
                    this.prepareRooms(act.locationId, evt);
                    this._locApi.findById(act.locationId)
                        .subscribe(
                        res2 => this.location = res2,
                        this.errMethod
                        );
                }
            },
            this.errMethod);
    }

    // prepare activity data and if generate=event prepare event data
    private prepareActivityData(a: Activity, people: [Person], aPers: [APerson]) {
        this.act = { 'name': a.name, 'opis': a.content, 'id': a.id, 'locationId': a.locationId, 'max': a.max, 'comment': a.comment };
        this.preparePersonComponent(people, aPers);

        // if generate is provided then read data from Activity
        if ((this.getParam('generate') === 'event') || (this.getParam('type') === 'activity' && this.getParam('id'))) {
            this.form.patchValue({ name: a.name, content: a.content, locationId: a.locationId, max: a.max, comment: a.comment }, { onlySelf: true });
        }
    }

    private preparePersonComponent(people: [Person], aPers) {

        for (let p of aPers) {
            if (p.isteacher === 1) {
                let person: Person = people.filter(person => person.id === p.personId)[0];
                if (person) {
                    this.teachers.push({ id: person.id, name: person.firstname + ' ' + person.lastname, relId: p.id });
                }
            } else if (p.isvolunteer === 1) {
                let person: Person = people.filter(person => person.id === p.personId)[0];
                if (person) {
                    this.volunteers.push({ id: person.id, name: person.firstname + ' ' + person.lastname, relId: p.id });
                }
            }
        }
    }

    private prepareDates(data) {
        if (data.starttime && data.endtime) {
            this.data.startdate = this._formatter.parse(data.starttime);
            this.data.starttime = { hour: moment(data.starttime).hour(), minute: moment(data.starttime).minute() };
            this.data.endtime = { hour: moment(data.endtime).hour(), minute: moment(data.endtime).minute() };
        } else
            this.data.startdate = null;
    }

    // method for select boxes
    public selected(value: any, type: string): void {

        if (type === 'room') {
            this.roomSel = [{ id: value.id, text: value.text }];
            this.form.value.roomId = value.id;
            this.form.markAsDirty();
            this.isRoomFree();
        }

        if (type === 'rType')
            this.rTypeSel = [{ id: value.id, text: value.text }];
    }

    isRoomFree() {
        let model = this.form.value;
        let stime: string;
        stime = (<DateFormatter>this._formatter).momentDTL(model.startdate, model.starttime, false);
        let etime = (<DateFormatter>this._formatter).momentDTL(model.startdate, model.endtime, false);
        let eventId = this.data.id ? this.data.id : 0;

        if (this.form.value.roomId)
            this._roomApi.isRoomFree(this.form.value.roomId, stime, etime, eventId)
                .subscribe(
                res => {
                    let msg = res[0];
                    if (msg.free === 0 && this.updatedForm)
                        this.setError('roomNotFree');
                    this.updatedForm = true;
                },
                this.errMethod
                );

    }

    setDeleteRule(value) {
        this.deleteRule = value;
    }

    // delete model with service from db, return to list
    delete(model: Event) {
        this.deleteRule = 'deleteAll';
        this.deleteEvent();
        this.back();
    }

    private deleteEvent() {
        let id;
        if (this.form.value.meventId == null) {
            id = this.form.value.id;
        } else
            id = this.form.value.meventId;
        switch (this.deleteRule) {
            case 'deleteAllNotFirst':
                this.deleteAllNotFirst(id);
                break;
            case 'deleteAll':
                this._api.find({ where: { or: [{ meventId: id }, { id: id }] }, order: 'id DESC' })
                    .subscribe(res => {
                        for (let r of res)
                            this._api.deleteById((<Event>r).id)
                                .subscribe(null, this.errMethod);
                    }, this.errMethod, () => this.back());
                break;
            case 'deleteNextNotMe': // yes yes this condition four lines down is far beyond common sense
                this._api.find({
                    where: {
                        meventId: id,
                        starttime: { gt: (<DateFormatter>this._formatter).momentDTL(this.data.startdate, this.data.starttime, true) }
                    }
                })
                    .subscribe(res => {
                        for (let r of res)
                            this._api.deleteById((<Event>r).id)
                                .subscribe(null, this.errMethod);
                    }, this.errMethod, () => this.back());

                break;
            case 'deleteMe':
                this.deleteOne(this.form.value.id, true);
                break;
            default:
                break;
        }

    }

    private deleteOne(id, back: boolean) {
        this._api.deleteById(id)
            .subscribe(null, this.errMethod, () => {
                if (back) this.back();
            });
    }

    // method for repetitions
    repeatEvent() {

        // get form parameters
        let cnt = this.rForm.value.rCnt;
        let enddate = this.rForm.value.enddate;
        if (enddate) {
            enddate.month--;
            enddate.hour = '23';
            enddate.minute = '59';
        }

        if (!cnt && enddate)
            cnt = 366; // maximum number of events in a year

        // we need clone not original this.data, check out how moment works
        let rModel = Object.assign({}, this.data);

        // prepare model starttime and endtime
        rModel.starttime = (<DateFormatter>this._formatter).momentDTL(rModel.startdate, rModel.starttime, true);
        rModel.endtime = (<DateFormatter>this._formatter).momentDTL(rModel.startdate, rModel.endtime, true);

        // delete existing old repetitions if checked on form
        if (this.rForm.value.deleteAllNotFirst) {
            this.deleteAllNotFirst(this.data.id);
        }

        // loop
        for (let i = 0; i < cnt; i++) {

            // prepare new model starttime and endtime
            if (this.rTypeSel[0].id === '2w') {
                rModel.starttime = rModel.starttime.add(2, 'w');
                rModel.endtime = rModel.endtime.add(2, 'w');
            } else {
                rModel.starttime = rModel.starttime.add(1, this.rTypeSel[0].id);
                rModel.endtime = rModel.endtime.add(1, this.rTypeSel[0].id);
            }
            // skip weekend if checked on form
            if (this.rForm.value.skipWeekend) {
                if (rModel.starttime.isoWeekday() < 6) {
                    this.saveRepModel(rModel, this.data.id, enddate);
                } else i--;
            } else
                this.saveRepModel(rModel, this.data.id, enddate);
        }
    }

    findEvent(page: number) {
        this._api.find({
            where: { meventId: this.getParam('id') }, limit: this.paginatorPageSize, skip: this.paginatorPageSize * (page - 1),
            order: ['starttime', name]
        })
            .subscribe(res => {
                this.eventss = res;
                this.fixListLength(this.paginatorPageSize, this.eventss);

                this._api.count({ meventId: this.getParam('id') })
                    .subscribe(res2 => this.paginatorECount = res2.count);
            });
    }

    private saveRepModel(rModel: Event, id: number, enddate) {
        rModel.meventId = id;
        rModel.id = 0;
        let save = false;

        if (enddate) {
            if (moment(rModel.endtime).valueOf() < moment(enddate).valueOf()) {
                save = true;
            } else
                save = false;
        } else
            save = true;
        if (save)
            this._api.upsert(rModel)
                .subscribe(
                null, // res => this.form.markAsPristine(),
                this.errMethod
                );
    }

    // delete all events in series, date condition is there because of async
    // new events can be create before all are deleted
    private deleteAllNotFirst(id) {
        this._api.find({ where: { meventId: id, cdate: { lt: new Date() } } })
            .subscribe(res => {
                for (let r of res)
                    this._api.deleteById((<Event>r).id)
                        .subscribe(null, this.errMethod);
            }, this.errMethod, () => this.back());
    }

    // add off time based on predefined clicked values
    setOffTime(m: number) {
        let time = moment(this.form.get('starttime').value).add(m, 'm');
        this.data.endtime = { hour: time.hour(), minute: time.minute() };
        this.form.patchValue({ endtime: this.data.endtime });
        this.form.markAsDirty();
    }

    next() {
        this.off++;
        this.setMonth();
    }

    previous() {
        this.off--;
        this.setMonth();
    }

    setMonth() {
        let start;
        let end;
        let date;

        date = moment().startOf('month');

        start = moment(date).clone().add(this.off, 'month').format();
        end = moment(start, 'YYYY-MM').daysInMonth();

        this.month = moment(start).format('MMMM YYYY');

        this.dates = [];
        this.datesidx = [];

        this.dates.push(
            {
                test: 0,
                date: moment(start).format('DD.MM.YYYY'),
                day: moment(start).format('dddd'),
                d: parseInt(moment(start).format('DD')),
                wday: moment(start).day(), full: moment(start)
            });

        this.datesidx.push(parseInt(moment(start).format('DD')));

        for (let i = 1; i < end; i++) {
            let d = moment(start).add(i, 'd').clone();
            this.dates.push({ test: 0, date: d.format('DD.MM.YYYY'), day: d.format('dddd'), d: parseInt(d.format('DD')), wday: d.day(), full: d });
            this.datesidx.push(parseInt(d.format('DD')));
        }


        let condition = {
            where: {
                and: [
                    { or: [{ meventId: this.evtId }, { id: this.evtId }] },
                    { starttime: { gt: new Date(start) } },
                    { endtime: { lt: new Date(moment(start).add(1, 'M').format()) } }
                ]
            }
        };

        // get all events
        this._api.find(condition)
            .subscribe(res => {

                for (let event of res) {

                    let off;
                    let e = <VEvent>event;
                    let st = moment(e.starttime).local().format('DD');

                    let rec = this.dates[this.datesidx.indexOf(parseInt(st))];
                    if (rec) {
                        if (e.meventId == null) off = '*'; else off = '';
                        rec.test = 1;
                        rec.meventId = e.meventId;
                        rec.starttime = e.starttime;
                        rec.endtime = e.endtime;
                        rec.id = e.id;
                        rec.name = e.name + off;
                        rec.isoff = e.isoff;
                        /*rec.color = '';
                        if (e.isacc == 1) rec.color = e.color; else rec.color = '#FBFBFB';
                        if (e.isoff == 1) rec.color = '#FF0000';
                        console.log(rec);*/
                    }
                }
            });
    }

    // prepare one copy of event
    toggle(d, type: string) {
        if (type === 'add') {

            // we need clone not original this.data, check out how moment works
            let rModel = Object.assign({}, this.data);
            let nDate: NgbDateStruct;
            nDate = ({ year: d.full.year(), month: d.full.month() + 1, day: d.full.date() });

            // prepare model starttime and endtime
            rModel.starttime = (<DateFormatter>this._formatter).momentDTL(nDate, rModel.starttime, true);
            rModel.endtime = (<DateFormatter>this._formatter).momentDTL(nDate, rModel.endtime, true);

            this.saveRepModel(rModel, this.data.id, null);

            d.test = 1;
            d.meventId = this.data.id;
            d.starttime = moment(rModel.starttime).format();
            d.endtime = moment(rModel.endtime).format();
            d.name = rModel.name;
            d.isoff = rModel.isoff;
            // d.color = rModel.color;

        } else if (type === 'remove') {
            this.deleteOne(d.id, false);
            this._api.deleteById(d.id)
                .subscribe(res => {
                    d.test = 0;
                    d.meventId = null;
                }, this.errMethod);
        }
    }

}
