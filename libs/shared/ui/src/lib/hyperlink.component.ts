import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { RouterLink } from '@angular/router';

@Component({
  selector: 'ng-journal-hyperlink',
  imports: [RouterLink],
  template: `<a
    [routerLink]="route()"
    class="no-underline hover:underline text-900 hover:text-primary-400"
  >
    <ng-content></ng-content>
    <i class="ml-1 fa-solid fa-link"></i>
  </a>`,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HyperlinkComponent {
  readonly route = input.required<unknown[]>();
}
