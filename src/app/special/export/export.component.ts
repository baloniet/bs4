import { VFeventApi } from './../../shared/sdk/services/custom/VFevent';
import { LabelService } from './../../services/label.service';
import { VPersonApi } from './../../shared/sdk/services/custom/VPerson';
import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
let FileSaver = require('file-saver');
let moment = require('../../../assets/js/moment.min.js');

@Component({
  selector: 'app-export',
  templateUrl: './export.component.html'
})
export class ExportComponent implements OnInit {

  data;

  keys = [];
  keysToggle;

  rowDataIndex = [];

  constructor(
    private _apiPerson: VPersonApi,
    private _apiEvent: VFeventApi,
    private _labelService: LabelService
  ) { }

  ngOnInit() {

    this.keys.push(['id', 'personName', 'birthdate', 'email', 'number', 'address', 'zipcode', 'name', 'sex', 'mnum']);
    this.keys.push(['#', 'Ime in priimek', 'Rojstni datum', 'e-mail', 'Telefonska številka', 'Naslov', 'Poštna številka', 'Pošta', 'Spol', 'Šifra']);

    this.keys.push(['id', 'starttime', 'endtime', 'name', 'rname', 'content', 'acontent', 'aname', 'preg', 'prega', 'prego']);
    this.keys.push(['#', 'Začetek', 'Konec', 'Naziv', 'Soba', 'Vsebina', 'Opis aktivnosti', 'Aktivnost', '# registriranih', '# potrjenih', '# odjavljenih']);

    this.keysToggle = [[], []];

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
  }

  // Example code from https://github.com/SheetJS/js-xlsx/issues/526
  // Thank you: https://github.com/junaidinam

  saveExcel(param: any, filename: string, idx: number) {
    const wb = new Workbook();

    const out = new Array;

    let rowData = new Array;

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

    const sheetName = 'Podatki';
    wb.SheetNames.push(sheetName);
    wb.Sheets[sheetName] = this.sheet_from_array_of_arrays(out, idx);

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

  sheet_from_array_of_arrays(data: any, idx: number, opts?: any): any {
    const sheet: any = {};

    let wscols = [];

    idx = idx * 2;

    for (let i = 0; i < data[0].length; i++) {
      wscols.push({ wch: 20 });
    }

    const startCell = { c: 10000000, r: 10000000 };
    const endCell = { c: 0, r: 0 };

    const range = { s: startCell, e: endCell };
    for (let row = 0; row !== data.length; ++row) {
      for (let col = 0; col !== data[row].length; ++col) {
        // prepare actual range
        if (range.s.r > row) { range.s.r = row; }
        if (range.s.c > col) { range.s.c = col; }
        if (range.e.r < row) { range.e.r = row; }
        if (range.e.c < col) { range.e.c = col; }

        const cell: any = {};
        cell.v = data[row][col];
        const cell_ref = XLSX.utils.encode_cell({ c: col, r: row });
        // console.log(cell_ref);
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


        // console.log(cell);
        sheet[cell_ref] = cell;
        // console.log(ws);
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
      this._apiPerson.find({ where: { ismember: true, firstname: 'Marko' }, order: 'lastName, firstName' })
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
    }



  };

  toggle(idx, i) {
    this.keysToggle[idx][i].selected = !this.keysToggle[idx][i].selected;
  }

}

export class Workbook {
  SheetNames: any = [];
  Sheets: any = {};
  Props: any = {};
}
