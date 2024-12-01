import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function futureDateValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const selectedDate = new Date(control.value); // Get the value as a Date object
    const currentDate = new Date(); // Get the current date

    if (selectedDate > currentDate) {
      return { futureDate: true };
    }

    return null;
  };
}
