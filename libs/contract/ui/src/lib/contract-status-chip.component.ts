import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { primeNgModules } from '@ng-journal/shared/utils';

export enum ContractStatusChipStyle {
  Active = 'active',
  Inactive = 'inactive',
  Pending = 'pending',
}

@Component({
  selector: 'ng-journal-contract-status-chip',
  imports: [...primeNgModules],
  template: `<span [class]="style"><p-chip [label]="label"></p-chip></span>`,
  styles: [
    `
      ::ng-deep .active .p-chip {
        background-color: green;
        color: white;
      }
      ::ng-deep .inactive .p-chip {
        background-color: red;
        color: white;
      }
      ::ng-deep .pending .p-chip {
        background-color: orange;
        color: white;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContractStatusChipComponent {
  @Input({ required: true }) label!: string;
  @Input({ required: true }) style!: ContractStatusChipStyle;
}
