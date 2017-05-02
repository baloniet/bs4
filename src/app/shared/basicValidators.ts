import { FormControl } from '@angular/forms';

export class BasicValidators {
    static email(control: FormControl) {
        // email regexp

        let regEx = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
        if (control && control.value && control.value !== '' && (control.value.length <= 5 || !regEx.test(control.value))) {
            return { 'email': true };
        }
        /*
                var regEx = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;       
                var valid = regEx.test(control.value);
                return valid ? null : { email: true };*/
    }

}
