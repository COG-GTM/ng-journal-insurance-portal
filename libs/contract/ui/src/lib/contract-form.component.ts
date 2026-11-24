import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { primeNgModules } from '@ng-journal/shared/utils';
import {
  ContractStatusChipComponent,
  ContractStatusChipStyle,
} from './contract-status-chip.component';
import { ContractStatusDto, CustomerOption } from '@ng-journal/contract/models';
import { ContractForm } from '@ng-journal/contract/utils';

@Component({
  selector: 'ng-journal-contract-form',
  imports: [
    ReactiveFormsModule,
    ContractStatusChipComponent,
    ...primeNgModules,
  ],
  template: ` <form [formGroup]="form" class="grid">
    <div class="col-6 flex flex-column gap-2">
      @if (isEditMode) {
      <label htmlFor="status">Status</label>
      <p-select
        name="status"
        [options]="statusOptions"
        formControlName="status"
        placeholder="Select status"
        [style]="{ width: '100%' }"
      />
      @if (!!form.controls.status.errors?.['required'] &&
      form.controls.status.dirty) {
      <span class="text-red-700"> Input is required. </span>
      } } @else {
      <label htmlFor="status">Status</label>
      <ng-journal-contract-status-chip
        label="Pending"
        [style]="pendingStatus"
      />
      }
    </div>

    <div class="col-6 flex flex-column gap-2">
      <label htmlFor="customer">Customer</label>
      <p-select
        name="customer"
        [options]="customers"
        formControlName="customer"
        placeholder="Select customer"
        [style]="{ width: '100%' }"
      />
      @if (!!form.controls.customer.errors?.['required'] &&
      form.controls.customer.dirty) {
      <span class="text-red-700"> Input is required. </span>
      }
    </div>

    <div class="col-6 flex flex-column gap-2">
      <label htmlFor="policyNumber">Policynumber</label>
      <input
        pInputText
        type="text"
        id="policyNumber"
        formControlName="policyNumber"
      />
      @if (!!form.controls.policyNumber.errors?.['required'] &&
      form.controls.policyNumber.dirty) {
      <span class="text-red-700"> Input is required. </span>
      }
    </div>

    <div class="col-6 flex flex-column gap-2">
      <label htmlFor="insuranceStartOn">Insurance Start On</label>
      <p-datepicker
        id="insuranceStartOn"
        formControlName="insuranceStartOn"
        [fluid]="true"
      />
      @if (!!form.controls.insuranceStartOn.errors?.['required'] &&
      form.controls.insuranceStartOn.dirty) {
      <span class="text-red-700"> Input is required. </span>
      }
    </div>
  </form>`,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContractFormComponent {
  @Input({ required: true }) form!: ContractForm;
  @Input({ required: true }) customers!: CustomerOption[];
  #isEditMode!: boolean;
  @Input({ required: true }) set isEditMode(value: boolean) {
    this.#isEditMode = value;
    if (!value) {
      this.form.controls.status.disable();
      this.form.controls.status.setValue({
        id: ContractStatusDto.Pending,
        label: ContractStatusDto.Pending,
      });
    }
  }
  get isEditMode() {
    return this.#isEditMode;
  }
  readonly statusOptions = Object.values(ContractStatusDto).map((status) => ({
    id: status,
    label: status,
  }));
  readonly pendingStatus = ContractStatusChipStyle.Pending;
}
