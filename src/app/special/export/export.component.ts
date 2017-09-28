import { VFeventApi } from './../../shared/sdk/services/custom/VFevent';
import { LabelService } from './../../services/label.service';
import { VPersonApi } from './../../shared/sdk/services/custom/VPerson';
import { VStatFullExportApi } from './../../shared/sdk/services/custom/VStatFullExport';
import { Component, OnInit } from '@angular/core';
import { BaseFormComponent } from './../../ui/forms/baseForm.component';
import { VPlocationApi } from './../../shared/sdk/services/custom/VPlocation';
import * as XLSX from 'xlsx';
let FileSaver = require('file-saver');
let moment = require('../../../assets/js/moment.min.js');

@Component({
  selector: 'app-export',
  templateUrl: './export.component.html'
})
export class ExportComponent extends BaseFormComponent implements OnInit {

  data;

  keys = [];
  keysToggle;

  rowDataIndex = [];
  months = ['Januar', 'Februar', 'Marec', 'April', 'Maj', 'Junij', 'Julij', 'Avgust', 'September', 'Oktober', 'November', 'December'];

  // year
  yearItems = [{ text: '2016' }, { text: '2017' }, { text: '2018' }, { text: '2019' }, { text: '2020' }, { text: '2021' }];
  yearSel = [{ text: '2017' }];
  private year = (new Date()).getFullYear();

  // partner checkboxes
  selectedChoicesP = [];
  choicesP;


  constructor(
    private _apiPerson: VPersonApi,
    private _apiEvent: VFeventApi,
    private _apiPlanFE: VStatFullExportApi,
    private _vPloc: VPlocationApi,
    private _labelService: LabelService
  ) {
    super('stat');
  }

  ngOnInit() {

    this.prepareLabels(this._labelService);
    // prepare my partners
    this._vPloc.partners(this.getUserAppId())
      .subscribe(res2 => {
        this.choicesP = res2;
        for (let r of res2)
          this.selectedChoicesP.push(r['id']);
      }, this.errMethod);

    this.keys.push(['id', 'personName', 'birthdate', 'email', 'number', 'address', 'zipcode', 'name', 'sex', 'mnum']);
    this.keys.push(['#', 'Ime in priimek', 'Rojstni datum', 'e-mail', 'Telefonska številka', 'Naslov', 'Poštna številka', 'Pošta', 'Spol', 'Šifra']);

    this.keys.push(['id', 'starttime', 'endtime', 'name', 'rname', 'content', 'acontent', 'aname', 'preg', 'prega', 'prego']);
    this.keys.push(['#', 'Začetek', 'Konec', 'Naziv', 'Soba', 'Vsebina', 'Opis aktivnosti', 'Aktivnost', '# registriranih', '# potrjenih', '# odjavljenih']);

    this.keys.push(['id', 'partnerName', 'locationName', 'kindName', 'year', 'month', 'sumt', 'sump']);
    this.keys.push(['#', 'Partner', 'Lokacija', 'Vsebina', 'Leto', 'Mesec', '# ur', '# udeležencev']);
    this.keys.push([null, null, null, null, null, null, 0, 0]);

    this.keysToggle = [[], [], []];

    for (let i = 0; i < this.keys[0].length; i++) {
      this.keysToggle[0].push({ key: this.keys[0][i], selected: true, title: this.keys[1][i] });
    }
    // de-select id
    this.keysToggle[0][0].selected = false;

    for (let i = 0; i < this.keys[2].length; i++) {
      this.keysToggle[1].push({ key: this.keys[2][i], selected: true, title: this.keys[3][i] });
    }
    // de-select id
    this.keysToggle[1][0].selected = false;

    for (let i = 0; i < this.keys[4].length; i++) {
      this.keysToggle[2].push({ key: this.keys[4][i], selected: true, title: this.keys[5][i] });
    }
    // de-select id
    this.keysToggle[2][0].selected = false;

  }

  // Example code from https://github.com/SheetJS/js-xlsx/issues/526
  // Thank you: https://github.com/junaidinam

  saveExcel(param: any, filename: string, idx: number, split?: boolean) {
    const wb = new Workbook();

    let out = new Array;

    let rowData = new Array;

    this.rowDataIndex = [];

    if (!split) { // FIXME: split is intentionaly made for report number three, should be generalized

      // print header
      for (let i = 0; i < this.keysToggle[idx].length; i++) {
        if (this.keysToggle[idx][i].selected) {
          rowData.push(this.keysToggle[idx][i].title);
          this.rowDataIndex.push(i);
        }
      }
      out.push(rowData); // write header

      // print data
      param.forEach(function (row, index) {
        rowData = [];
        for (let i = 0; i < this.keysToggle[idx].length; i++) {
          if (this.keysToggle[idx][i].selected) {
            rowData.push(row[this.keysToggle[idx][i].key]);
          }
        }
        out.push(rowData);
      }, this);

      let sheetName = 'Podatki';
      wb.SheetNames.push(sheetName);
      wb.Sheets[sheetName] = this.sheet_from_array_of_arrays(out, idx);
    } else {
      for (let m = 1; m < 13; m++) {

        out = [];
        rowData = [];
        this.keys[6] = [null, null, null, null, null, null, 0, 0];
        // print header
        for (let i = 0; i < this.keysToggle[idx].length; i++) {
          if (this.keysToggle[idx][i].selected) {
            rowData.push(this.keysToggle[idx][i].title);
            if (m === 1) this.rowDataIndex.push(i);
          }
        }
        out.push(rowData); // write header

        // print data
        param.forEach(function (row, index) {
          if (row['month'] === m) {
            rowData = [];
            for (let i = 0; i < this.keysToggle[idx].length; i++) {
              if (this.keysToggle[idx][i].selected) {
                if (i === 6) {
                  rowData.push(row[this.keysToggle[idx][i].key] / 45);
                } else
                  rowData.push(row[this.keysToggle[idx][i].key]);
              }
            }
            out.push(rowData);
            this.keys[6][6] += row['sumt'] / 45;
            this.keys[6][7] = row['sumpm'];
          }
        }, this);

        rowData = [];
        for (let i = 0; i < this.keys[6].length; i++) {
          if (this.keysToggle[idx][i].selected) {
            rowData.push(this.keys[6][i]);
          }
        }
        out.push(rowData);

        let sheetName = this.months[m - 1];
        wb.SheetNames.push(sheetName);
        wb.Sheets[sheetName] = this.sheet_from_array_of_arrays(out, idx);
      }
    }
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' }); // bookSST: true,
    FileSaver.saveAs(new Blob([this.s2ab(wbout)], { type: 'application/octet-stream' }), filename + '.xlsx');
  }


  s2ab(s) {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i !== s.length; ++i) {
      // tslint:disable-next-line:no-bitwise
      view[i] = s.charCodeAt(i) & 0xFF;
    }
    return buf;
  }

  sheet_from_array_of_arrays(data: any, idx: number): any {
    const sheet: any = {};

    let wscols = [];

    idx = idx * 2;

    for (let i = 0; i < data[0].length; i++) {
      wscols.push({ wch: 20 });
    }

    const startCell = { c: 10000000, r: 10000000 };
    const endCell = { c: 0, r: 0 };

    const range = { s: startCell, e: endCell };
    let sheetRow = -1;

    for (let row = 0; row !== data.length; ++row) {
      sheetRow++;

      for (let col = 0; col !== data[row].length; ++col) {
        // prepare actual range
        if (range.s.r > row) { range.s.r = row; }
        if (range.s.c > col) { range.s.c = col; }
        if (range.e.r < row) { range.e.r = row; }
        if (range.e.c < col) { range.e.c = col; }

        const cell: any = {};
        let cell_ref;
        cell.v = data[row][col];

        cell_ref = XLSX.utils.encode_cell({ c: col, r: sheetRow });

        if (cell.v == null) {
          continue;
        }
        if (typeof cell.v === 'number') {
          if (this.keys[idx][this.rowDataIndex[col]].indexOf('sex') > -1 && row > 0) {
            cell.t = 's';
            if (cell.v === 0) cell.v = 'Ž'; else cell.v = 'M';
          } else
            cell.t = 'n';
        } else if (typeof cell.v === 'boolean') {
          cell.t = 'b';
        } else {
          if (this.keys[idx][this.rowDataIndex[col]].indexOf('date') > -1 && row > 0) {
            cell.t = 's';
            cell.v = moment(cell.v).format('D. M. Y');
          } else if (this.keys[idx][this.rowDataIndex[col]].indexOf('time') > -1 && row > 0) {
            cell.t = 's';
            cell.v = moment(cell.v).format('D.M.Y HH.mm');
          } else
            cell.t = 's';
        }

        sheet[cell_ref] = cell;
      }
    }
    if (range.s.c < 10000000) {
      sheet['!ref'] = XLSX.utils.encode_range(startCell, endCell);
    }
    sheet['!cols'] = wscols;
    return sheet;
  }

  clicked(idx) {

    if (idx === 0) {
      this._apiPerson.find({ where: { ismember: true }, order: 'lastName, firstName' })
        .subscribe(res => {
          this.data = res;
          this.saveExcel(this.data, 'uporabniki', 0);
        });
    } else if (idx === 1) {
      this._apiEvent.find({ where: { isAcc: true }, order: 'starttime' })
        .subscribe(res => {
          this.data = res;
          this.saveExcel(this.data, 'dogodki', 1);
        });
    } else if (idx === 2) {
      this._apiPlanFE.find({ where: { partnerId: { inq: this.selectedChoicesP }, year: this.year }, order: 'year,month,kindName' })
        .subscribe(res => {
          this.data = res;
          this.saveExcel(this.data, 'obiski', 2, true);
        });
    }



  };

  toggleKeys(idx, i) {
    this.keysToggle[idx][i].selected = !this.keysToggle[idx][i].selected;
  }

  // method for select boxes
  public selected(value: any, type: string): void {

    if (type === 'year') {
      this.yearSel = [{ text: value.text }];
      this.year = parseInt(value.text);
    }
  }

  exists(id, type) {
    if (type === 'partners') {
      return this.selectedChoicesP.indexOf(id) > -1;
    }
  }

  toggle(obj, type) {
    let id = obj.id;
    if (type === 'partners') {
      let index = this.selectedChoicesP.indexOf(id);
      if (index === -1) {
        this.selectedChoicesP.push(id);
      } else this.selectedChoicesP.splice(index, 1);
    }
  }

  reset(type, state) {
    if (type === 'partners') {
      this.selectedChoicesP = [];
      if (state) {
        for (let c of this.choicesP) {
          this.selectedChoicesP.push(c['id']);
        }
      }
    }
  }


}

export class Workbook {
  SheetNames: any = [];
  Sheets: any = {};
  Props: any = {};
}
