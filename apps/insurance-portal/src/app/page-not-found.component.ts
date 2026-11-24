import { ChangeDetectionStrategy, Component } from '@angular/core';


@Component({
  selector: 'ng-journal-page-not-found',
  imports: [],
  template: `<h1>Page Not Found</h1>
    <p>Sorry, but the page you were trying to view does not exist.</p>`,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageNotFoundComponent {}
