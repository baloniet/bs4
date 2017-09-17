import { Observable } from 'rxjs/Observable';
import { VPlocation } from './../../shared/sdk/models/VPlocation';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { LabelService } from './../../services/label.service';
import { FormGroup } from '@angular/forms';
import { VPlocationApi } from './../../shared/sdk/services/custom/VPlocation';

/**
 * abstract BaseFormComponent
 */
export abstract class BaseFormComponent {

    // form object name
    private _name: string;

    private title: string;

    private formLabels;
    private formTitles;
    private param;

    error;

    private _isDelete;
    private _isLocked;

    form: FormGroup;
    private userProfile;
    private userAppData;
    private userLocations: [VPlocation] = [null];
    private userLocationsIds = [];
    private userPartners: [VPlocation] = [null];
    private userPartnersIds = [];

    // error method is used in subscribe calls
    errMethod = err => {
        if (err.code && err.code === 'ER_DUP_ENTRY') {
            this.setError('duplicate');
        } else if (err.message.indexOf('nvalid date') > -1) {
            this.setError('wrongDate');
        } else if (err.code && err.code === 'ER_ROW_IS_REFERENCED_2') {
            this.setError('existingRecord');
        } else
            console.log(err);
    };

    constructor(name, postfix?: string) {

        this._name = name;
        this.formLabels = {};

        // set errorTracker location
        if (postfix) {
            sessionStorage.setItem('guiErrorTracker', this._name + ' ' + postfix);
        } else
            sessionStorage.setItem('guiErrorTracker', this._name + ' form');

        // user data
        this.userProfile = JSON.parse(localStorage.getItem('profile'));

        // user app data
        this.userAppData = JSON.parse(localStorage.getItem('app_le_user'));
    }

    // prepare error message for gui error messaging
    setError(type: string, msg?: string) {
        this.error = msg ? this.getFTitle(type) + ': ' + msg : this.getFTitle(type);
        setTimeout(() => this.error = null, 5000);
    }

    getName(): string {
        return this._name;
    }

    setName(name: string) {
        this._name = name;
    }

    // get route param value
    getParam(key: string): string {
        return this.param[key];
    }

    // get user profile data value
    getUserProfileData(key: string): string {
        return this.userProfile[key];
    }

    // get user profile data value
    getUserProfileDataInt(key: string): number {
        return parseInt(this.userProfile[key]);
    }

    // get user app data value
    getUserAppData(key: string): string {
        return this.userAppData[key];
    }

    // get user app data value
    getUserAppDataInt(key: string): number {
        if (this.userAppData) {
            return parseInt(this.userAppData[key]);
        } else return null;
    }

    getUserAppId(): number {
        if (this.userAppData && this.userAppData['personId']) {
            return parseInt(this.userAppData['personId']);
        } else return -1;
    }

    isUserAdmin(): boolean {
        if (this.userAppData && this.userAppData['isadmin']) {
            if (parseInt(this.userAppData['isadmin']) === 1) {
                return true;
            } else return false;
        } else return false;
    }

    getUserLocations(): [VPlocation] {
        return this.userLocations;
    }

    getUserLocationsIds(): any[] {
        return this.userLocationsIds;
    }

    getUserPartners(): [VPlocation] {
        return this.userPartners;
    }

    getUserPartnersIds(): any[] {
        return this.userPartnersIds;
    }


    setTitle(value) {
        this.title = value;
    }

    getFTitle(key: string): string {
        return this.formTitles[key];
    }

    setDelete(value: boolean) {
        this._isDelete = value;
    }

    isDelete(): boolean {
        return this._isDelete;
    }

    // Don't show save or delete button
    setLocked(value: boolean) {
        this._isLocked = value;
    }

    isLocked(): boolean {
        return this._isLocked;
    }

    getFCValue(control: string): any {
        return this.form.controls[control].value;
    }

    setFCValue(control: string, value: any) {
        this.form.controls[control].setValue(value);
    }

    private prepareStrings(value) {
        this.formTitles = value.titles;
        this.formLabels = value.properties;
    }

    prepareLabels(service: LabelService) {
        service.getLabels('sl', this.getName())
            .subscribe(
            res => this.prepareStrings(res),
            err => {
                console.log('LabelService error: ' + err);
            });
    }

    // noRouteParams means don't provide route params
    getProvidedRouteParamsLocations(route: ActivatedRoute, _api: VPlocationApi) {
        if (this.userAppData && this.getUserAppId()) {
            Observable.forkJoin(
                _api.locations(this.getUserAppId()),
                _api.partners(this.getUserAppId())
            ).subscribe(res => {
                this.userLocations = res[0];
                this.userLocationsIds = [];
                for (let l of res[0]) {
                    this.userLocationsIds.push(l.id);
                };
                this.userPartners = res[1];
                this.userPartnersIds = [];
                for (let l of res[1]) {
                    this.userPartnersIds.push(l.id);
                }
                this.getProvidedRouteParams(route);
            }, err => console.log(err));
        } else
            this.getProvidedRouteParams(route);

    }

    getProvidedRouteParams(route: ActivatedRoute) {
        route.params
            .subscribe(
            res => {
                this.param = res;
                if (this.param.action === 'b') {
                    this.setDelete(true);
                    this.form.disable();
                }
                this.selectData(this.param);
            });
    }

    // form value browser
    fromId(objects: any, value: number): any {
        if (objects)
            for (let o of objects) {
                if (o.id === value)
                    return [{ id: o.id, text: o.text }];
            }
        return [];
    }

    // form value browser
    fromIdO(objects: any, value: number): any {
        if (objects)
            for (let o of objects) {
                if (o.id === value)
                    return o;
            }
        return null;
    }

    // add empty values to to short list
    fixListLength(size, list) {
        for (let i = (size - list.length); i > 0; i--)
            <[any]>list.push('');
    }

    // select first element from array for select items
    selectFirst(items): any {
        if (items.length > 0)
            return [items[0]];
    }

    /**
     * String manipulation method. Converts string to multiple lines, based on provided
     * width parameter. This is html string, it uses <br>.
     */
    lineBreaker(s: string, width, showDots): string {
        if (s.length < width) {
            return s;
        } else {
            let index = 0;
            let rets = '';
            while (index < s.length) {
                if (s.charAt(index + width) === ' ') {
                    rets = rets + s.substr(index, width) + '<br>';
                    index = index + width;
                } else {
                    let i = index + width;
                    while (s.charAt(i) !== ' ' && i > index) {
                        i--;
                    }
                    rets = rets + s.substr(index, (i - index)) + '<br>';
                    index = i;
                }
                if (index > s.length - width) {
                    rets = rets + s.substr(index);
                    index = s.length;
                }
            }
            if (showDots) {
                return  rets.substr(0, rets.indexOf('<br>')) + '...';
            } else return rets;
        }
    }



    protected selectData(param) { };

    // methods for datepicker
    isWeekend(date: NgbDateStruct) {
        const d = new Date(date.year, date.month - 1, date.day);
        return d.getDay() === 0 || d.getDay() === 6;
    }

    isDisabled(date: NgbDateStruct, current: { month: number }) {
        return date.month !== current.month;
    }

    public refreshValue(value: any, type: string): void {
    }

}
