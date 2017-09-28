import { VPerson } from './../../../shared/sdk/models/VPerson';
import { Partner } from './../../../shared/sdk/models/Partner';
import { VPaddress } from './../../../shared/sdk/models/VPaddress';
import { PEmp } from './../../../shared/sdk/models/PEmp';
import { PEmpApi } from './../../../shared/sdk/services/custom/PEmp';
import { Employment } from './../../../shared/sdk/models/Employment';
import { StatementApi } from './../../../shared/sdk/services/custom/Statement';
import { Statement } from './../../../shared/sdk/models/Statement';
import { PStat } from './../../../shared/sdk/models/PStat';
import { PStatApi } from './../../../shared/sdk/services/custom/PStat';
import { VPersonApi } from './../../../shared/sdk/services/custom/VPerson';
import { Location } from '@angular/common';
import { Education } from './../../../shared/sdk/models/Education';
import { Citizenship } from './../../../shared/sdk/models/Citizenship';
import { PAddress } from './../../../shared/sdk/models/PAddress';
import { BaseFormComponent } from '../baseForm.component';
import { BasicValidators } from '../../../shared/basicValidators';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { Response } from '@angular/http';
import { NgbDateStruct, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { DateFormatter } from '../../../shared/date.formatter';

import { LabelService } from '../../../services/label.service';
import { PersonApi, PCitiApi, PPhoneApi, PAddressApi, PEmailApi, CitizenshipApi, EducationApi, PEduApi, VPlocationApi, EmploymentApi }
  from '../../../shared/sdk/services/index';
import { Person, PPhone, PEmail, PCiti, PEdu } from '../../../shared/sdk/models/index';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';

var moment = require('../../../../assets/js/moment.min.js');

const now = new Date();


@Component({
  selector: 'person-form',
  templateUrl: './person-form.component.html',
  styleUrls: ['./person-form.component.css'],
  providers: [LabelService, PersonApi]
})
export class PersonFormComponent extends BaseFormComponent implements OnInit {

  private data;
  private phones: PPhone[];
  private emails: PEmail[];
  private citItems;
  private citSel = [];
  private eduItems;
  private eduSelIn = [];
  // private eduSelOut = [];
  private empItems;
  private empSelIn = [];
  // private empSelOut = [];
  private minDate: NgbDateStruct;
  private stmtItems;
  private choices;
  private conperson;

  isMan = false;
  isWoman = false;
  full = false;
  stmtError = true;
  isNew = false;
  myData = false;

  constructor(
    private _labelService: LabelService,
    private _location: Location,
    private _route: ActivatedRoute,
    private _router: Router,
    private _api: PersonApi,
    private _vpApi: VPersonApi,
    private _pCitApi: PCitiApi,
    private _pEduApi: PEduApi,
    private _pEmpApi: PEmpApi,
    private _empApi: EmploymentApi,
    private _eduApi: EducationApi,
    private _citApi: CitizenshipApi,
    private _phoneApi: PPhoneApi,
    private _emailApi: PEmailApi,
    private _pAdrApi: PAddressApi,
    private _stApi: PStatApi,
    private _stmtApi: StatementApi,
    private _vplocApi: VPlocationApi,
    private _fb: FormBuilder,
    private _formatter: NgbDateParserFormatter
  ) {
    super('person');
  }

  ngOnInit() {

    this.minDate = { year: 1910, month: 1, day: 1 };

    this.form = this._fb.group({
      id: [''],
      mpersonId: [''],
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      content: [],
      birthdate: [],
      cdate: [],
      mobileNumber: ['', Validators.required], // validator za številke
      email: ['', Validators.compose([BasicValidators.email])],
      addresses: this._fb.array([
        this.initAddress()
      ]),
      statements: this._fb.array([
        this.initStatement()
      ]),
      isteacher: false,
      isvolunteer: false,
      ismember: false,
      isemployee: false,
      isrenter: false,
      isuser: false,
      sex: ''
    });

    this.prepareLabels(this._labelService);
    this.getProvidedRouteParamsLocations(this._route, this._vplocApi);
  }

  initAddress() {
    return this._fb.group({
      commune_id: [],
      post_id: [],
      address: [],
      id: []
    });
  }

  addAddress() {
    const control = <FormArray>this.form.controls['addresses'];
    control.push(this.initAddress());
    this.form.markAsDirty();
  }

  // delete formcontrol from UI, delete relation from DB 
  removeAddress(i: number, event) {
    const control = <FormArray>this.form.controls['addresses'];
    control.removeAt(i);
    this._pAdrApi.deleteById(event.id)
      .subscribe(null, error => console.log(error));
  }

  initStatement() {
    return this._fb.group({
      statementId: [],
      locationId: [],
      name: [],
      relId: [],
      cdate: []
    });
  }

  addStatement(fcName: string) {
    const control = <FormArray>this.form.controls[fcName];
    control.push(this.initStatement());
    this.form.markAsDirty();
  }

  // delete formcontrol from UI, delete relation from DB
  removeStatement(i: number, fcName: string, event) {
    const control = <FormArray>this.form.controls[fcName];
    if (control.length === 1 && fcName === 'statements') {
      control.setErrors({ 'error': 'mustExistOne' });
      this.stmtError = true;
    } else {
      control.removeAt(i);
      this._stApi.deleteById(event.id)
        .subscribe(null, error => console.log(error));
    }
  }

  // update statement
  updateStatement(i: number, fcName: string, event) {
    if (event.id > 0)
      this._stApi.find({ where: { id: event.id } })
        .subscribe(res => {
          let s = <PStat>res[0];
          let dates = event.cdate.split('.');
          s.cdate = moment().set({ 'date': dates[0], 'month': dates[1] - 1, 'year': dates[2] });
          this._stApi.upsert(s).subscribe(res2 => console.log(res2), this.errMethod, () => this.setError('saved'));
        }, this.errMethod);
  }


  back() {
    if (!this.error)
      // this._location.back();
      this._router.navigate(['/genlist/person']);
  }

  // send model to service and save to db, return to list
  save(model) {
    let localModel;

    // clone

    localModel = Object.assign({}, model);

    // save
    if (!this.form.pristine && !this.stmtError) {

      // 1. save model - person
      if (this.form.controls['birthdate'].touched || this.form.value.birthdate)
        localModel.birthdate = (<DateFormatter>this._formatter).formatx(this.form.value.birthdate);

      if (this.isMan) localModel.sex = '1';
      else if (this.isWoman) localModel.sex = '0';

      if (this.isNew) {
        this._api.create(localModel)
          .subscribe(res => {
            let p = <Person>res;
            this.saveData(p, localModel);
          }, this.errMethod);
      } else {
        this._api.upsert(localModel)
          .subscribe(res => {
            let p = <Person>res;
            this.saveData(p, localModel);
          }, this.errMethod);
      }

    }

  }

  private saveData(p: Person, model) {

    // 2. save mobileNumber
    if (this.form.controls['mobileNumber'].touched) {
      this._phoneApi.upsert(
        new PPhone(
          { personId: p.id, numbertype: 1, number: (<any>model).mobileNumber }
        ))
        .subscribe(null, res => console.log(res));
    }

    // 3. save email
    if (this.form.controls['email'].touched)
      this._emailApi.upsert(
        new PEmail(
          { personId: p.id, emailtype: 1, email: (<any>model).email }
        ))
        .subscribe(null, res => console.log(res));

    // 4. save citizenship
    if (this.citSel[0])
      this._pCitApi.upsert(
        new PCiti(
          { personId: p.id, citizenshipId: this.citSel[0].id }
        ))
        .subscribe(null, res => console.log(res));

    // 5. save education
    if (this.eduSelIn[0])
      this._pEduApi.upsert(
        new PEdu(
          { personId: p.id, educationId: this.eduSelIn[0].id, edutype: 1, id: 0 }
        ))
        .subscribe(null, res => console.log(res));

    /*  if (this.eduSelOut[0])
        this._pEduApi.upsert(
          new PEdu(
            { personId: p.id, educationId: this.eduSelOut[0].id, edutype: 2, id: 0 }
          ))
          .subscribe(null, res => console.log(res));*/

    // 6 save employment
    if (this.empSelIn[0])
      this._pEmpApi.upsert(
        new PEmp(
          { personId: p.id, employmentId: this.empSelIn[0].id, emptype: 1, id: 0 }
        ))
        .subscribe(null, res => console.log(res));

    /*if (this.empSelOut[0])
      this._pEmpApi.upsert(
        new PEmp(
          { personId: p.id, employmentId: this.empSelOut[0].id, emptype: 2, id: 0 }
        ))
        .subscribe(null, res => console.log(res));*/

    // 7. save addresses
    this.saveAddresses((<any>model).addresses, p.id);    // ugly fix in both cases but it works

    // 8. save statements
    this.saveStatements((<any>model).statements, p.id);  // ugly fix in both cases but it works
    this.form.markAsPristine();
  }

  // saving person of type isteacher or isvolunteer
  private saveAddresses(addresses, id) {
    for (let a of addresses) {
      if (a.id === 0 && a.address)
        this._pAdrApi.upsert(
          new PAddress(
            { personId: id, postId: a.post_id, communeId: a.commune_id, address: a.address, id: 0 }
          )
        ).subscribe(null, res => console.log(res));
    }
  }
  // saving statements
  private saveStatements(statements, id) {
    if (statements) {
      for (let t of statements) {
        if (t.relId === 0 && t.statementId) {
          // first check if statement type already exist for this person and this year
          this._stApi.find({ where: { personId: id, statementId: t.statementId, year: now.getFullYear() } })
            .subscribe(res => {
              if (res.length === 0) {
                console.log(t);
                let cdates = null;
                if (t.cdate) {
                  let dates = t.cdate.split('.');
                  cdates = moment().set({ 'date': dates[0], 'month': dates[1] - 1, 'year': dates[2] });
                }
                this._stApi.upsert(
                  new PStat(
                    { personId: id, statementId: t.statementId, id: 0, locationId: t.locationId, cdate: cdates }
                  )
                ).subscribe(null, err => console.log(err), () => this.back());
              } else
                this.setError('oneStatement');
            },
            err => console.log(err)
            );
        }
      }
      this.back();
    } else
      this.back();
  }

  // citizenship select box
  public selected(value: any, type: string): void {
    if (type === 'cit')
      this.citSel = [{ id: value.id, text: value.text }];
    if (type === 'eduin')
      this.eduSelIn = [{ id: value.id, text: value.text }];
    /* if (type == "eduout")
       this.eduSelOut = [{ id: value.id, text: value.text }];*/
    if (type === 'empin')
      this.empSelIn = [{ id: value.id, text: value.text }];
    /*if (type == "empout")
      this.empSelOut = [{ id: value.id, text: value.text }];*/
    this.form.markAsDirty();
  }



  // call service to find model in db
  selectData(param) {

    // get citizenship values
    this._citApi.find({ order: 'name' }).subscribe(res => {
      this.citItems = [];
      for (let one of res) {
        this.citItems.push({ id: (<Citizenship>one).id, text: (<Citizenship>one).name });
      }
    });

    // get statement values, this is not ordinary get statement this stmtItems are different!!
    this._stmtApi.find({ order: 'name' }).subscribe(res => {
      this.stmtItems = [];
      for (let one of res) {
        this.stmtItems.push({ id: (<Statement>one).id, text: (<Statement>one).name, content: (<Statement>one).content });
      }
    });
    // get education values
    this._eduApi.find({ order: 'name' }).subscribe(res => {
      this.eduItems = [];
      for (let one of res) {
        this.eduItems.push({ id: (<Education>one).id, text: this.lineBreaker((<Education>one).name, 60, false) });
      }
    });

    // get employment values
    this._empApi.find({ order: 'name' }).subscribe(res => {
      this.empItems = [];
      for (let one of res) {
        this.empItems.push({ id: (<Employment>one).id, text: (<Employment>one).name });
      }
    });

    // get all person for connected person
    this.findMember('', 1);


    this.citSel = [];
    this.eduSelIn = [];
    // this.eduSelOut = [];

    // get user locations

    this.isNew = true;

    if (param.id) {

      this.isNew = false;
      // first get person statements
      this._api.getStats(param.id)
        .subscribe(res => {
          // get member number
          this._vpApi.find({ where: { id: param.id } })
            .subscribe(res => {
              let vperson = <VPerson>res[0];
              this.mnum = vperson.mnum;
            }, this.errMethod);

          for (let st of res) {
            if (this.getUserLocationsIds().indexOf(st.locationId) === -1 ) this.myData = false; else this.myData = true;
            if ((this.getUserLocationsIds().indexOf(st.locationId) > -1) || (this.isUserAdmin())) {
              this.prepareFullData(param);
              break;
            } else
             this.prepareLessData(param);
          }
        }, this.errMethod);
    } else
      this.full = true;
  }

  mnum;
  paginatorPageSize = 10;
  paginatorPCount = 0;

  findMember(value: string, page: number) {
    value = '%' + value + '%';

    this._api.find({
      where: { or: [{ firstname: { like: value } }, { lastname: { like: value } }] },
      order: ['lastname', 'firstname'], limit: this.paginatorPageSize, skip: this.paginatorPageSize * (page - 1)
    })
      .subscribe(res => {
        this.choices = res;
        this.fixListLength(this.paginatorPageSize, res);
        this._api.count({ or: [{ firstname: { like: value } }, { lastname: { like: value } }] }).subscribe(res => this.paginatorPCount = res.count);
      });
  }

  findParent(p: Person) {
    if (p.mpersonId)
      this._api.findById(p.mpersonId)
        .subscribe(res =>
          this.conperson = res, null);
  }

  toggleMember(p: Person) {
    this._api.findById(this.form.value.id)
      .subscribe(res => {
        let pers = <Person>res;
        if (pers.mpersonId === p.id) {
          pers.mpersonId = null;
          this.conperson = null;
        } else {
          pers.mpersonId = p.id;
          this.conperson = p;
        }
        this.form.patchValue({ mpersonId: pers.mpersonId });
        this._api.upsert(pers)
          .subscribe(null, this.errMethod);
      }, this.errMethod);
  }

  prepareFullData(param) {
    this.full = true;
    Observable.forkJoin(
      this._api.findById(param.id),
      this._api.getPhones(param.id), // filter numbertype=1
      this._api.getEmails(param.id),  // filter emailtype=1
      this._api.getCiti(param.id),
      this._api.getEdu(param.id),
      this._api.getAddss(param.id),
      this._api.getStats(param.id),
      this._api.getEmp(param.id)
    ).subscribe(
      res => {



        this.data = res[0];

        this.findParent(this.data);

        this.data.birthdate = this._formatter.parse(this.data.birthdate);
        this.phones = res[1];
        this.emails = res[2];

        this.data.mobileNumber = this.phones.length > 0 ? this.phones[0].number : '';
        this.data.email = this.emails.length > 0 && this.emails[0].email ? this.emails[0].email : '';
        this.citSel = res[3][0] ? this.fromId(this.citItems, res[3][0]['citizenshipId']) : ''; // res number 3 array 0
        // educations
        for (let e of res[4]) {
          if (e.edutype === 1)
            this.eduSelIn = e ? this.fromId(this.eduItems, e.educationId) : ''; // res number 4 array 0  
          /*     else if (e.edutype == 2)
                 this.eduSelOut = e ? this.fromId(this.eduItems, e.educationId) : '';//res number 4 array 0  */
        }
        // emplyments
        for (let e of res[7]) {
          if (e.emptype === 1)
            this.empSelIn = e ? this.fromId(this.empItems, e.employmentId) : ''; // res number 4 array 0  
          /*    else if (e.emptype == 2)
                this.empSelOut = e ? this.fromId(this.empItems, e.employmentId) : '';//res number 4 array 0  */
        }

        if (this.data.sex === 1) this.isMan = true;
        if (this.data.sex === 0) this.isWoman = true;

        this.prepareAddressesComponent(res[5]);
        this.prepareStatementComponent(res[6]);

        (<FormGroup>this.form)
          .setValue(this.data, { onlySelf: true });

      }, this.errMethod);
  }

  prepareLessData(param) {
    this.full = false;
    this.setLocked(true);

    Observable.forkJoin(
      this._api.findById(param.id),
      this._api.getPhones(param.id), // filter numbertype=1
      this._api.getEmails(param.id)  // filter emailtype=1
    ).subscribe(
      res => {

        this.data = this.clean(<Person>res[0]);

        this.findParent(this.data);

        this.data.birthdate = this._formatter.parse(this.data.birthdate);
        this.phones = res[1];
        this.emails = res[2];

        this.data.mobileNumber = '';
        this.data.email = '';

        this.data['addresses'] = [{ commune_id: null, post_id: null, address: null, id: null }];
        this.data['statements'] = [{ statementId: null, locationId: null, name: null, relId: null }];

        (<FormGroup>this.form)
          .patchValue(this.data, { onlySelf: true });

      }, this.errMethod);
  }

  private clean(p: Person): Person {
    let pers = new Person();
    pers.firstname = p.firstname;
    pers.lastname = p.lastname;
    pers.ismember = p.ismember;
    pers.id = p.id;
    pers.mpersonId = p.mpersonId;
    pers.birthdate = p.birthdate;
    pers.cdate = p.cdate;
    pers.isteacher = p.isteacher;
    pers.isemployee = p.isemployee;
    pers.isrenter = p.isrenter;
    pers.isvolunteer = p.isvolunteer;
    pers.isuser = p.isuser;
    pers.sex = null;
    pers.content = null;
    p = null;
    return pers;
  }

  // prepare address part of form
  private prepareAddressesComponent(ads: [VPaddress]) {

    this.data['addresses'] = [];
    let t = 0;

    for (let a of ads) {
      let add = a.address;
      if (a.communeId)
        add += ', ' + a.comname;
      if (a.postId)
        add += ', ' + a.zipcode + ' ' + a.postname;

      (<[{}]>this.data['addresses']).push({ address: add, id: a.id, post_id: a.postId, commune_id: a.communeId });
      if (t > 0) this.addAddress();
      t++;
    }

    if (t === 0) (<[{}]>this.data['addresses']).push({ id: '', address: '', post_id: '', commune_id: '' });
    this.form.updateValueAndValidity();
  }


  private prepareStatementComponent(aStat: [PStat]) {

    this.data['statements'] = [];
    let s = 0;
    let st;

    for (let p of aStat) {
      st = this.fromId(this.stmtItems, p.statementId);
      let dates = '';
      if (p.cdate)
        dates = moment(p.cdate).format('DD.MM.YYYY');
      (<[{}]>this.data['statements']).push({ statementId: p.statementId, name: st[0].text, relId: p.id, locationId: p.locationId, cdate: dates });
      if (s > 0) this.addStatement('statements');
      s++;

    }

    if (s > 0)
      this.stmtError = false;
    //  if (s == 0) (<[{}]>this.data['statements']).push({ statementId: '', name: '', relId: '', locationId: '' });
    this.form.updateValueAndValidity();
  }

  // delete model with service from db, return to list
  delete(model: Person) {

    this._api.deleteById(model.id)
      .subscribe(
      null,
      error => console.log(error),
      () => this.back()
      );

  }

  sex(v) {
    this.isMan = false;
    this.isWoman = false;
    if (v === 1) this.isMan = true;
    if (v === 0) this.isWoman = true;
    this.form.markAsDirty();
  }

  @ViewChild('dataContainer') dataContainer: ElementRef;
  preparePrint(value) {
    let partner;
    // prepare partner data
    this._vplocApi.find({ where: { personId: this.getUserAppId(), statementId: value.id } })
      .subscribe(res => {
        partner = res[0];
        let content = this.fromIdO(this.stmtItems, value.id).content;
        content = content.replace(/{{lastname}}/g, this.data.lastname);
        content = content.replace(/{{firstname}}/g, this.data.firstname);
        if (this.data.birthdate && this.data.birthdate.day)
          content = content.replace('{{birthdate}}', this.data.birthdate.day + '. ' + this.data.birthdate.month + '. ' + this.data.birthdate.year);
        content = content.replace('{{birthdate}}', this.data.birthdate.day + '. ' + this.data.birthdate.month + '. ' + this.data.birthdate.year);
        content = content.replace('{{partner}}', partner.partname);
        content = content.replace('{{content}}', partner.content);
        this.dataContainer.nativeElement.innerHTML = content;
        window.scrollTo(0, 0);
        window.print();
      }, this.errMethod);
  }

  private statementSelected() {
    this.stmtError = false;
    this.form.markAsDirty();
  }

}
