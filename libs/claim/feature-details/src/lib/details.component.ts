import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClaimFacadeService } from '@ng-journal/claim/data-access';
import {
  CardComponent,
  HeaderComponent,
  HyperlinkComponent,
} from '@ng-journal/shared/ui';
import { primeNgModules } from '@ng-journal/shared/utils';
import { switchMap } from 'rxjs';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { FeatureFlagDirective } from '@ng-journal/shared/data-access';

@Component({
  selector: 'ng-journal-details',
  imports: [
    CommonModule,
    HeaderComponent,
    CardComponent,
    HyperlinkComponent,
    ...primeNgModules,
    FeatureFlagDirective,
  ],
  template: ` <ng-journal-header title="Claim Details" />
    @if (claim(); as claim) {
      <ng-journal-card additionalClasses="grid">
        <div class="col-2 font-bold">Claim Number:</div>
        <div class="col-4">
          {{ claim.claimNumber }}
        </div>
        <div class="col-2 font-bold">Date:</div>
        <div class="col-4">
          {{ claim.date | date }}
        </div>
        <div class="col-2 font-bold">Damage Type:</div>
        <div class="col-4">
          {{ claim.damageType }}
        </div>
        <div class="col-6"></div>
        <div class="col-2 font-bold">Policynumber:</div>
        <div class="col-4">
          {{ claim.contract.policyNumber }}
        </div>
        <div class="col-2 font-bold">Customer:</div>
        <div class="col-4">
          @if (claim.contract.customer) {
            <ng-journal-hyperlink
              *ngJournalFeatureFlag="
                'customer-details';
                else customerDetailsDisabled
              "
              [route]="['/customer', claim.contract.customer.id, 'details']"
              >
              {{ claim.contract.customer.name }}
            </ng-journal-hyperlink>
            <ng-template #customerDetailsDisabled>
              {{ claim.contract.customer.name }}
            </ng-template>
          } @else {
            -
          }
        </div>
      </ng-journal-card>
    }`,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailsComponent {
  readonly #claimFacade = inject(ClaimFacadeService);
  readonly claim = this.#claimFacade.selectedClaim;
  readonly id = input.required<string>();
  readonly #loadOnIdChange = toObservable(this.id)
    .pipe(
      switchMap((id) => this.#claimFacade.loadClaim(id)),
      takeUntilDestroyed()
    )
    .subscribe();
}
