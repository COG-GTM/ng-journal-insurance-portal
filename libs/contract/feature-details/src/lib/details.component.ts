import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  ErrorHandler,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContractFacadeService } from '@ng-journal/contract/data-access';
import {
  CardComponent,
  HeaderComponent,
  HyperlinkComponent,
} from '@ng-journal/shared/ui';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ContractStatusChipComponent,
  ContractStatusChipStylePipe,
} from '@ng-journal/contract/ui';
import { switchMap, catchError, EMPTY } from 'rxjs';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { FeatureFlagDirective } from '@ng-journal/shared/data-access';

@Component({
  selector: 'ng-journal-details',
  imports: [
    CommonModule,
    HeaderComponent,
    CardComponent,
    HyperlinkComponent,
    ContractStatusChipComponent,
    ContractStatusChipStylePipe,
    FeatureFlagDirective,
  ],
  template: `
    <ng-container
      *ngJournalFeatureFlag="'contract-edit'; else editContractDisabled"
      >
      <ng-journal-header
        title="Contract Details"
        [showEditButton]="true"
        (editButtonClicked)="this.onEditButtonClicked()"
        />
    </ng-container>
    <ng-template #editContractDisabled>
      <ng-journal-header title="Contract Details" />
    </ng-template>
    
    @if (contract(); as contract) {
      <ng-journal-card additionalClasses="grid">
        <div class="col-2 font-bold">Status:</div>
        <div class="col-4">
          <ng-journal-contract-status-chip
            [label]="contract.status"
            [style]="contract.status | contractStatusChipStyle"
            />
        </div>
        <div class="col-2 font-bold">Policynumber:</div>
        <div class="col-4">{{ contract.policyNumber }}</div>
        <div class="col-2 font-bold">Insurance Start:</div>
        <div class="col-4">{{ contract.insuranceStartOn | date }}</div>
        <div class="col-2 font-bold">Customer:</div>
        <div class="col-4">
          <ng-journal-hyperlink
            *ngJournalFeatureFlag="
              'customer-details';
              else customerDetailsDisabled
            "
            [route]="['/customer', contract.customer?.id, 'details']"
            >
            {{ contract.customer?.label }}
          </ng-journal-hyperlink>
          <ng-template #customerDetailsDisabled>
            {{ contract.customer?.label }}
          </ng-template>
        </div>
        <div class="col-2 font-bold">Phone:</div>
        <div class="col-4">{{ contract.customer?.phone }}</div>
        <div class="col-2 font-bold">Email:</div>
        <div class="col-4">{{ contract.customer?.email }}</div>
      </ng-journal-card>
    }
    `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailsComponent {
  readonly #contractFacade = inject(ContractFacadeService);
  readonly #router = inject(Router);
  readonly #route = inject(ActivatedRoute);
  readonly contract = this.#contractFacade.selectedContract;
  readonly #errorHandler = inject(ErrorHandler);
  readonly id = input.required<string>();
  readonly #loadOnIdChange = toObservable(this.id)
    .pipe(
      switchMap((id) =>
        this.#contractFacade.loadContract(id).pipe(
          catchError((error) => {
            this.#errorHandler.handleError(error);
            return EMPTY;
          })
        )
      ),
      takeUntilDestroyed()
    )
    .subscribe();


  onEditButtonClicked(): void {
    this.#router.navigate([this.id(), 'edit'], {
      relativeTo: this.#route.parent,
    });
  }
}
