import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  ErrorHandler,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComplaintFacadeService } from '@ng-journal/complaint/data-access';
import { switchMap, catchError, EMPTY } from 'rxjs';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import {
  CardComponent,
  HeaderComponent,
  HyperlinkComponent,
} from '@ng-journal/shared/ui';
import { primeNgModules } from '@ng-journal/shared/utils';
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
  template: `<ng-journal-header title="Complaint Details" />
    @if (complaint(); as complaint) {
      <ng-journal-card additionalClasses="grid">
        <div class="col-2 font-bold">Customer:</div>
        <div class="col-4">
          <ng-journal-hyperlink
            *ngJournalFeatureFlag="
              'customer-details';
              else customerDetailsDisabled
            "
            [route]="['/customer', complaint.customer?.id, 'details']"
            >
            {{ complaint.customer?.label }}
          </ng-journal-hyperlink>
          <ng-template #customerDetailsDisabled>
            {{ complaint.customer?.label }}
          </ng-template>
        </div>
        <div class="col-2 font-bold">Type:</div>
        <div class="col-4">
          {{ complaint.type }}
        </div>
        <div class="col-2 font-bold">Date:</div>
        <div class="col-4">
          {{ complaint.date | date }}
        </div>
        <div class="col-2 font-bold">Description:</div>
        <div class="col-4">
          {{ complaint.description }}
        </div>
      </ng-journal-card>
    }`,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailsComponent {
  readonly #complaintFacade = inject(ComplaintFacadeService);
  readonly complaint = this.#complaintFacade.selectedComplaint;
  readonly #errorHandler = inject(ErrorHandler);
  readonly id = input.required<string>();
  readonly #loadOnIdChange = toObservable(this.id)
    .pipe(
      switchMap((id) =>
        this.#complaintFacade.loadComplaint(id).pipe(
          catchError((error) => {
            this.#errorHandler.handleError(error);
            return EMPTY;
          })
        )
      ),
      takeUntilDestroyed()
    )
    .subscribe();
}
