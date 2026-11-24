import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';

import { CustomerFacadeService } from '@ng-journal/customer/data-access';
import { CardComponent, HeaderComponent } from '@ng-journal/shared/ui';
import { primeNgModules } from '@ng-journal/shared/utils';
import { switchMap } from 'rxjs';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';

@Component({
  selector: 'ng-journal-details',
  imports: [HeaderComponent, CardComponent, ...primeNgModules],
  template: ` <ng-journal-header title="Customer Details" />

@if (customer(); as customer) {
  <ng-journal-card additionalClasses="grid">
    <div class="col-2 font-bold">First name:</div>
    <div class="col-4">
      {{ customer.firstName }}
    </div>
    <div class="col-2 font-bold">Email:</div>
    <div class="col-4">
      {{ customer.email }}
    </div>
    <div class="col-2 font-bold">Last name:</div>
    <div class="col-4">
      {{ customer.lastName }}
    </div>
    <div class="col-2 font-bold">Phone:</div>
    <div class="col-4">
      {{ customer.phone }}
    </div>
    <div class="col-12 pb-0">
      <ng-journal-header title="Address" type="subtitle" />
    </div>
    <div class="col-2 font-bold">Street:</div>
    <div class="col-4">
      {{ customer.address.street }}
    </div>
    <div class="col-2 font-bold">City:</div>
    <div class="col-4">
      {{ customer.address.city }}
    </div>
    <div class="col-2 font-bold">State:</div>
    <div class="col-4">
      {{ customer.address.state }}
    </div>
    <div class="col-2 font-bold">Zip:</div>
    <div class="col-4">
      {{ customer.address.zip }}
    </div>
  </ng-journal-card>
}`,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailsComponent {
  readonly #customerFacade = inject(CustomerFacadeService);
  readonly customer = this.#customerFacade.selectedCustomer;
  readonly id = input.required<string>();
  readonly #loadOnIdChange = toObservable(this.id)
    .pipe(
      switchMap((id) => this.#customerFacade.loadCustomer(id)),
      takeUntilDestroyed()
    )
    .subscribe();
}
