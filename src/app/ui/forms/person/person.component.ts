import { Person } from './../../../shared/sdk/models/Person';
import { PersonApi } from './../../../shared/sdk/services/custom/Person';
import { FormGroup, ControlValueAccessor, NG_VALUE_ACCESSOR, FormControl } from '@angular/forms';
import { Component, OnInit, Input, Output, EventEmitter, forwardRef } from '@angular/core';

const noop = () => {
};

@Component({
  selector: 'person',
  templateUrl: './person.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: PersonComponent,
      multi: true
    }
  ]
})
export class PersonComponent implements ControlValueAccessor, OnInit {

  @Input('group') personForm: FormGroup;
  @Input('labels') formLabels;
  @Input('teacher') isTeacher;
  @Input('volunteer') isVolunteer;
  @Input('renter') isRenter;
  @Input('fcType') fcType;

  private _id;
  private onTouchedCallback: () => void = noop;
  private onChangeCallback: (_: any) => void = noop;

  @Output() selected = new EventEmitter();

  @Output() removed = new EventEmitter();

  private personItems;
  private personSel = [];

  constructor(private _api: PersonApi) {
    this.condition = { isteacher: null, isvolunteer: null, isrenter: null };
  }

  ngOnInit() {
    this.selectData();
  }

  private condition: { isteacher: number, isvolunteer: number, isrenter: number };

  selectData() {
    let condition;
    if (this.isTeacher) condition = { "isteacher": "1" };
    if (this.isVolunteer) condition = { "isvolunteer": "1" };
    if (this.isRenter) condition = { "isrenter": "1" };

    // get person values
    this._api.find({ order: "lastname", where: condition }).subscribe(res => {
      this.personItems = [];

      for (let one of res) {
        this.personItems.push({ id: (<Person>one).id, text: (<Person>one).firstname + ' ' + (<Person>one).lastname });

      }
    });
  }

  isNew = false;
  public refreshValue(value: any, type: string): void {
    this.personForm.setValue({ id: value.id, name: value.text, relId: 0 });
    this.isNew = true;
  }

  public selectedPerson(event, type: string): void {
    this.selected.emit(event);
  }

  //From ControlValueAccessor interface
  writeValue(value: any) {
    if (value !== this._id) {
      this._id = value;
    }
  }

  //From ControlValueAccessor interface
  registerOnChange(fn: any) {
    this.onChangeCallback = fn;
  }

  //From ControlValueAccessor interface
  registerOnTouched(fn: any) {
    this.onTouchedCallback = fn;
  }

  //get accessor
  get value(): any {
    return this._id;
  };

  //set accessor including call the onchange callback
  set value(v: any) {
    if (v !== this._id) {
      this._id = v;
      this.onChangeCallback(v);
    }
  }

  //Set touched on blur
  onBlur() {
    this.onTouchedCallback();
  }

  removePerson(id) {
    this.removed.emit({ 'id': id });
  }
}
