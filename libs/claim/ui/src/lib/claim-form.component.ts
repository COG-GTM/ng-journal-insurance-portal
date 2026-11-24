import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { primeNgModules } from '@ng-journal/shared/utils';
import { ReactiveFormsModule } from '@angular/forms';
import { ClaimForm } from '@ng-journal/claim/utils';
import {
  ContractOption,
  DamageTypeOption,
  damageTypes,
} from '@ng-journal/claim/models';

@Component({
  selector: 'ng-journal-claim-form',
  imports: [ReactiveFormsModule, ...primeNgModules],
  template: `<form [formGroup]="form" class="grid">
    <div class="col-6 flex flex-column gap-2">
      <label htmlFor="claimNumber">Claim Number</label>
      <input
        pInputText
        type="text"
        id="claimNumber"
        formControlName="claimNumber"
      />
      @if (!!form.controls.claimNumber.errors?.['required'] &&
      form.controls.claimNumber.dirty) {
      <span class="text-red-700"> Input is required. </span>
      }
    </div>
    <div class="col-6 flex flex-column gap-2">
      <label htmlFor="date">Date</label>
      <p-datepicker id="date" formControlName="date" [fluid]="true" />
      @if (!!form.controls.date.errors?.['required'] &&
      form.controls.date.dirty) {
      <span class="text-red-700"> Input is required. </span>
      }
    </div>
    <div class="col-6 flex flex-column gap-2">
      <label htmlFor="damageType">Damage Type</label>
      <p-select
        name="damageType"
        [options]="damageTypeOptions"
        formControlName="damageType"
        placeholder="Select damage type"
        [style]="{ width: '100%' }"
      />
      @if (!!form.controls.damageType.errors?.['required'] &&
      form.controls.damageType.dirty) {
      <span class="text-red-700"> Input is required. </span>
      }
    </div>
    <div class="col-6 flex flex-column gap-2">
      <label htmlFor="contract">Policynumber</label>
      <p-select
        name="contract"
        [options]="contracts"
        optionLabel="policyNumber"
        formControlName="contract"
        placeholder="Select contract"
        [style]="{ width: '100%' }"
      />
      @if (!!form.controls.contract.errors?.['required'] &&
      form.controls.contract.dirty) {
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
      @if (!!form.controls.description.errors?.['required'] &&
      form.controls.description.dirty) {
      <span class="text-red-700"> Input is required. </span>
      }
    </div>
  </form>`,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClaimFormComponent {
  @Input({ required: true }) form!: ClaimForm;
  @Input({ required: true }) contracts!: ContractOption[];
  readonly damageTypeOptions = damageTypes.map(
    (type) =>
      ({
        label: type,
        id: type,
      } as DamageTypeOption)
  );
}
