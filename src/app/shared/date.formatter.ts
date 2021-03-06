import { NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
let moment = require('../../assets/js/moment.min.js');

export class DateFormatter extends NgbDateParserFormatter {
    constructor() {
        super();
    }
    // this method is used just for reordering of date elements
    format(date: NgbDateStruct): string {
        if (date) {
            return date.day + '. ' + date.month + '. ' + date.year;
        } else return null;
    }

    formatx(date: NgbDateStruct): string {
        return date ?
            `${date.year}-${this.isNumber(date.month) ? this.padNumber(date.month) : ''}-${this.isNumber(date.day) ? this.padNumber(date.day) : ''}` :
            '';
    };

    // with use of Moment convert provided date and time {hour,minute} to local date time
    momentDTL(date: NgbDateStruct, time, local: boolean): string {
        if (date && time && local) {
            return moment(date.day + '-' + date.month + '-' + date.year + ' ' + time.hour + ':' + time.minute, 'DD-MM-YYYY HH:mm').local();
        } else if (date && time && !local) {
            return moment(date.day + '-' + date.month + '-' + date.year + ' ' + time.hour + ':' + time.minute, 'DD-MM-YYYY HH:mm').format('YYYY-MM-DD HH:mm');
        }
        return null;
    }

    // parses input string based on delimiter character
    // if 1999-1-1 then parse to yyyy-mm-dd 
    // if 1.1.1999 then parse to dd.mm.yyyy
    parse(value: string): NgbDateStruct {

        if (value) {
            if (value.indexOf('-') > -1) {
                const dateParts = value.trim().split('-');
                if (dateParts.length === 1 && this.isNumber(dateParts[0])) {
                    return { year: this.toInteger(dateParts[0]), month: null, day: null };
                } else if (dateParts.length === 2 && this.isNumber(dateParts[0]) && this.isNumber(dateParts[1])) {
                    return { year: this.toInteger(dateParts[0]), month: this.toInteger(dateParts[1]), day: null };
                } else if (dateParts.length === 3 && this.isNumber(dateParts[0]) && this.isNumber(dateParts[1]) && this.isNumber(dateParts[2])) {
                    return { year: this.toInteger(dateParts[0]), month: this.toInteger(dateParts[1]), day: this.toInteger(dateParts[2]) };
                }
            } else if (value.indexOf('.') > -1) {
                const dateParts = value.trim().split('.');
                if (dateParts.length === 1 && this.isNumber(dateParts[0])) {
                    return { day: this.toInteger(dateParts[0]), month: null, year: null };
                } else if (dateParts.length === 2 && this.isNumber(dateParts[0]) && this.isNumber(dateParts[1])) {
                    return { day: this.toInteger(dateParts[0]), month: this.toInteger(dateParts[1]), year: null };
                } else if (dateParts.length === 3 && this.isNumber(dateParts[0]) && this.isNumber(dateParts[1]) && this.isNumber(dateParts[2])) {
                    return { day: this.toInteger(dateParts[0]), month: this.toInteger(dateParts[1]), year: this.toInteger(dateParts[2]) };
                }
            }
        }
        return null;
    }

    toInteger(value: any): number {
        return parseInt(`${value}`, 10);
    }

    isNumber(value: any): boolean {
        return !isNaN(this.toInteger(value));
    }

    padNumber(value: number) {
        if (this.isNumber(value)) {
            return `0${value}`.slice(-2);
        } else {
            return '';
        }
    }
}
