import { VPerson } from './../../shared/sdk/models/VPerson';
import { EmploymentApi } from './../../shared/sdk/services/custom/Employment';
import { VLeuserApi } from './../../shared/sdk/services/custom/VLeuser';
import { VRoomApi } from './../../shared/sdk/services/custom/VRoom';
import { ProjectApi } from './../../shared/sdk/services/custom/Project';
import { environment } from './../../../environments/environment';
import { LoopBackFilter } from './../../shared/sdk/models/BaseModels';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { BaseFormComponent } from '../forms/baseForm.component';

import { LabelService } from '../../services/label.service';

// poskus uporabe loopback sdk 
import { LoopBackConfig } from '../../shared/sdk/index';
//import { Post, AccessToken } from '../../shared/sdk/models/index';
import {
	PostApi, CommuneApi, EducationApi, StatementApi,
	CitizenshipApi, VPersonApi, VActivityApi, ThemeApi, ErrorsApi, TemplateApi, SettingsApi,
	TypeApi, PartnerApi, VLocationApi, KindApi, VPlocationApi
} from '../../shared/sdk/services/index';
import { EventApi } from '../../shared/sdk/services/custom/Event';
import { Http } from '@angular/http';
import { API_VERSION } from '../../shared/base.url';

@Component({
	selector: 'genlist',
	templateUrl: './gen-list.component.html',
	providers: [LabelService]
})

export class GenListComponent extends BaseFormComponent implements OnInit {

	private id;

	private data = [];

	private tableLabels;

	private labels;

	page = 0;

	_id: string;

	paginatorInitPage = 1;
	paginatorPageSize = 15;
	paginatorCount = 0;

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _labelService: LabelService,
		private _postApi: PostApi,
		private _communeApi: CommuneApi,
		private _educationApi: EducationApi,
		private _empApi: EmploymentApi,
		private _statementApi: StatementApi,
		private _citizenshipApi: CitizenshipApi,
		private _personApi: VPersonApi,
		private _themeApi: ThemeApi,
		private _typeApi: TypeApi,
		private _locationApi: VLocationApi,
		private _partnerApi: PartnerApi,
		private _kindApi: KindApi,
		private _actVApi: VActivityApi,
		private _errApi: ErrorsApi,
		private _roomApi: VRoomApi,
		private _setApi: SettingsApi,
		private _eventApi: EventApi,
		private _templateApi: TemplateApi,
		private _projApi: ProjectApi,
		private _userApi: VLeuserApi,
		private _vplocApi: VPlocationApi
	) {
		super('genlist');
		LoopBackConfig.setBaseURL(environment.BASE_API_URL);
		LoopBackConfig.setApiVersion(API_VERSION);
	}

	ngOnInit() {

		this.getProvidedRouteParamsLocations(this._route, this._vplocApi);

	}

	selectData(param) {

		this.data = [];

		this.id = param;
		this._id = this.id.type ? this.id.type : this.id.id;

		this._labelService.getLabels('sl', this._id)
			.subscribe(res => {
				this.prepareGStrings(res);
				this.selectGData(this._id, this.paginatorInitPage, '')
			},
			err => {
				console.log("LabelService error: " + err);
			})

	}

	selectGData(id: string, page: number, value: string) {

		this.page = page;

		// set errorTracker location
		sessionStorage.setItem('guiErrorTracker', id + ' genlist');

		let lbf: LoopBackFilter = this.prepareSearchCondition(this.labels.searchFields, value);

		if (id == "post")
			this._postApi.find({ where: lbf.where, order: "name", limit: this.paginatorPageSize, skip: this.paginatorPageSize * (page - 1) })
				.subscribe(res => {
					this.data = res;
					this.fixListLength(this.paginatorPageSize, res);
					this._postApi.count(lbf.where).subscribe(res => this.paginatorCount = res.count);
				});

		if (id == "commune")
			this._communeApi.find({ where: lbf.where, order: "name", limit: this.paginatorPageSize, skip: this.paginatorPageSize * (page - 1) })
				.subscribe(res => {
					this.data = res;
					this.fixListLength(this.paginatorPageSize, res);
					this._communeApi.count(lbf.where).subscribe(res => this.paginatorCount = res.count);
				});

		if (id == "education")
			this._educationApi.find({ where: lbf.where, order: "name", limit: this.paginatorPageSize, skip: this.paginatorPageSize * (page - 1) })
				.subscribe(res => {
					this.data = res;
					this.fixListLength(this.paginatorPageSize, res);
					this._educationApi.count(lbf.where).subscribe(res => this.paginatorCount = res.count);
				});

		if (id == "employment")
			this._empApi.find({ where: lbf.where, order: "name", limit: this.paginatorPageSize, skip: this.paginatorPageSize * (page - 1) })
				.subscribe(res => {
					this.data = res;
					this.fixListLength(this.paginatorPageSize, res);
					this._empApi.count(lbf.where).subscribe(res => this.paginatorCount = res.count);
				});

		if (id == "statement")
			this._statementApi.find({ where: lbf.where, order: "name", limit: this.paginatorPageSize, skip: this.paginatorPageSize * (page - 1) })
				.subscribe(res => {
					this.data = res;
					this.fixListLength(this.paginatorPageSize, res);
					this._statementApi.count(lbf.where).subscribe(res => this.paginatorCount = res.count);
				});

		if (id == "citizenship")
			this._citizenshipApi.find({ where: lbf.where, order: "name", limit: this.paginatorPageSize, skip: this.paginatorPageSize * (page - 1) })
				.subscribe(res => {
					this.data = res;
					this.fixListLength(this.paginatorPageSize, res);
					this._citizenshipApi.count(lbf.where).subscribe(res => this.paginatorCount = res.count);
				});

		if (id == "person")
			this._personApi.find({ where: lbf.where, order: ["lastname", "firstname"], limit: this.paginatorPageSize, skip: this.paginatorPageSize * (page - 1) })
				.subscribe(res => {
					this.data = res;
					for (let p of res)
						p['locked'] = this.setLock(<VPerson>p);
					this.fixListLength(this.paginatorPageSize, res);
					this._personApi.count(lbf.where).subscribe(res => this.paginatorCount = res.count);
				});

		if (id == "user")
			this._userApi.find({ where: lbf.where, order: ["lastname", "firstname"], limit: this.paginatorPageSize, skip: this.paginatorPageSize * (page - 1) })
				.subscribe(res => {
					this.data = res;
					this.fixListLength(this.paginatorPageSize, res);
					this._userApi.count({ and: [{ isuser: 1 }, lbf.where] }).subscribe(res => this.paginatorCount = res.count);
				});

		if (id == "theme")
			this._themeApi.find({ where: lbf.where, order: ["name"], limit: this.paginatorPageSize, skip: this.paginatorPageSize * (page - 1) })
				.subscribe(res => {
					this.data = res;
					this.fixListLength(this.paginatorPageSize, res);
					this._themeApi.count(lbf.where).subscribe(res => this.paginatorCount = res.count);
				});

		if (id == "type")
			this._typeApi.find({
				where: { and: [lbf.where, { partnerId: { inq: this.getUserPartnersIds() } }] },
				order: ["partnerId", "name"], limit: this.paginatorPageSize, skip: this.paginatorPageSize * (page - 1)
			})
				.subscribe(res => {
					this.data = res;
					this.fixListLength(this.paginatorPageSize, res);
					this._typeApi.count({ and: [{ partnerId: { inq: this.getUserPartnersIds() } }, lbf.where] })
						.subscribe(res => this.paginatorCount = res.count);
				});

		if (id == "kind")
			this._kindApi.find({ where: lbf.where, order: ["name"], limit: this.paginatorPageSize, skip: this.paginatorPageSize * (page - 1) })
				.subscribe(res => {
					this.data = res;
					this.fixListLength(this.paginatorPageSize, res);
					this._kindApi.count(lbf.where).subscribe(res => this.paginatorCount = res.count);
				});

		if (id == "location")
			this._locationApi.find({ where: lbf.where, order: ["name"], limit: this.paginatorPageSize, skip: this.paginatorPageSize * (page - 1) })
				.subscribe(res => {
					this.data = res;
					this.fixListLength(this.paginatorPageSize, res);
					this._locationApi.count(lbf.where).subscribe(res => this.paginatorCount = res.count);
				});

		if (id == "template")
			this._templateApi.find({ where: lbf.where, order: ["active desc", "name"], limit: this.paginatorPageSize, skip: this.paginatorPageSize * (page - 1) })
				.subscribe(res => {
					this.data = res;
					this.fixListLength(this.paginatorPageSize, res);
					this._templateApi.count(lbf.where).subscribe(res => this.paginatorCount = res.count);
				});

		if (id == "partner")
			this._partnerApi.find({ where: lbf.where, order: ["name"], limit: this.paginatorPageSize, skip: this.paginatorPageSize * (page - 1) })
				.subscribe(res => {
					this.data = res;
					this.fixListLength(this.paginatorPageSize, res);
					this._partnerApi.count(lbf.where).subscribe(res => this.paginatorCount = res.count);
				});

		if (id == "activity")
			this._actVApi.find({
				where: { and: [lbf.where, { or: [ {locationId: { inq: this.getUserLocationsIds() }},{locationId: null} ]}] },
				order: ["name"], limit: this.paginatorPageSize, skip: this.paginatorPageSize * (page - 1)
			})
				.subscribe(res => {
					this.data = res;
					this.fixListLength(this.paginatorPageSize, res);
					this._actVApi.count({ and: [lbf.where, { locationId: { inq: this.getUserLocationsIds() } }] }).subscribe(res => this.paginatorCount = res.count);
				});

		if (id == "error")
			this._errApi.find({ where: lbf.where, order: ["cDate desc"], limit: this.paginatorPageSize, skip: this.paginatorPageSize * (page - 1) })
				.subscribe(res => {
					this.data = res;
					this.fixListLength(this.paginatorPageSize, res);
					this._errApi.count(lbf.where).subscribe(res => this.paginatorCount = res.count);
				});

		if (id == "room")
			this._roomApi.find({ where: lbf.where, order: ["name"], limit: this.paginatorPageSize, skip: this.paginatorPageSize * (page - 1) })
				.subscribe(res => {
					this.data = res;
					this.fixListLength(this.paginatorPageSize, res);
					this._roomApi.count(lbf.where).subscribe(res => this.paginatorCount = res.count);
				});

		if (id == "setting")
			this._setApi.find({ where: lbf.where, order: ["name"], limit: this.paginatorPageSize, skip: this.paginatorPageSize * (page - 1) })
				.subscribe(res => {
					this.data = res;
					this.fixListLength(this.paginatorPageSize, res);
					this._setApi.count(lbf.where).subscribe(res => this.paginatorCount = res.count);
				});

		if (id == "project")
			this._projApi.find({ where: lbf.where, order: ["name"], limit: this.paginatorPageSize, skip: this.paginatorPageSize * (page - 1) })
				.subscribe(res => {
					this.data = res;
					this.fixListLength(this.paginatorPageSize, res);
					this._projApi.count(lbf.where).subscribe(res => this.paginatorCount = res.count);
				});

		if (id == "event")
			if (this.id.id)
				this._eventApi.find({ order: ["starttime", "name"], where: { "activityId": this.id.id }, limit: this.paginatorPageSize, skip: this.paginatorPageSize * (page - 1) })
					.subscribe(res => {
						this.data = res;
						this.fixListLength(this.paginatorPageSize, res);
						this._eventApi.count({ "activityId": this.id.id }).subscribe(res => this.paginatorCount = res.count);
					});

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

	navigate(link) {
		this._router.navigate([link]);
	}

	prepareGStrings(labels) {
		this.labels = labels;
	}

	pageChange(value, page) {
		this.selectGData(this._id, page, value);
	}

	// add empty values to to short list
	fixListLength(size, list) {
		for (let i = (size - list.length); i > 0; i--)
			<[any]>list.push('');
	}

	// prepare search conditon based on provided value and settings from json
	prepareSearchCondition(fields: [string], value: string): LoopBackFilter {
		let lbf: LoopBackFilter = {};
		let orArray = [];
		let valueSQL = '%' + value + '%';

		if (value) {
			for (let i = 0; i < fields.length; i++) {
				orArray.push({ [fields[i]]: { like: valueSQL } });
			}
			if (orArray.length > 1)
				lbf.where = { or: orArray };
			else
				lbf.where = orArray[0];
		} else {
			lbf.where = {};
		}
		return lbf;
	}

	getPartnerName(val) {
		return (this.fromIdO(this.getUserPartners(), val)).name;
	}

	getLocationName(val) {
		return (this.fromIdO(this.getUserLocations(), val)).name;
	}

}