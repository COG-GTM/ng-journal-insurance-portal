import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { ComplaintForm } from '@ng-journal/complaint/utils';
import { primeNgModules } from '@ng-journal/shared/utils';
import { ReactiveFormsModule } from '@angular/forms';
import { ComplaintTypeDto, Customer } from '@ng-journal/complaint/models';

@Component({
  selector: 'ng-journal-complaint-form',
  imports: [ReactiveFormsModule, ...primeNgModules],
  template: ` <form [formGroup]="form()" class="grid">
    <div class="col-4 flex flex-column gap-2">
      <label htmlFor="type">Type</label>
      <p-select
        name="type"
        [options]="typeOptions"
        formControlName="type"
        placeholder="Select type"
        [style]="{ width: '100%' }"
      />
      @if (!!form().controls.type.errors?.['required'] &&
      form().controls.type.dirty) {
      <span class="text-red-700"> Input is required. </span>
      }
    </div>
    <div class="col-4 flex flex-column gap-2">
      <label htmlFor="customer">Customer</label>
      <p-select
        name="customer"
        [options]="customers()"
        formControlName="customer"
        placeholder="Select customer"
        [style]="{ width: '100%' }"
      />
      @if (!!form().controls.customer.errors?.['required'] &&
      form().controls.customer.dirty) {
      <span class="text-red-700"> Input is required. </span>
      }
    </div>
    <div class="col-4 flex flex-column gap-2">
      <label htmlFor="date">Date</label>
      <p-datepicker id="date" formControlName="date" [fluid]="true" />
      @if (!!form().controls.date.errors?.['required'] &&
      form().controls.date.dirty) {
      <span class="text-red-700"> Input is required. </span>
      }
    </div>
    <div class="col-12 flex flex-column gap-2">
      <label htmlFor="description">Description</label>
      <textarea
        pInputTextarea
        [autoResize]="true"
        rows="5"
        id="description"
        formControlName="description"
      ></textarea>
      @if (!!form().controls.description.errors?.['required'] &&
      form().controls.description.dirty) {
      <span class="text-red-700"> Input is required. </span>
      }
    </div>
  </form>`,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComplaintFormComponent {
  readonly form = input.required<ComplaintForm>();
  readonly customers = input.required<Customer[]>();
  readonly typeOptions = Object.values(ComplaintTypeDto);
}
