import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { primeNgModules } from '@ng-journal/shared/utils';

@Component({
  selector: 'ng-journal-header',
  imports: [CommonModule, ...primeNgModules],
  template: ` @switch (type()) { @case ('title') {
    <h1
      class="text-2xl flex flex-row justify-content-between align-items-center"
    >
      <ng-container *ngTemplateOutlet="titleInnerContent"></ng-container>
    </h1>
    <hr />
    } @case ('subtitle') {
    <h2
      class="text-lg flex flex-row justify-content-between align-items-center"
    >
      <ng-container *ngTemplateOutlet="titleInnerContent"></ng-container>
    </h2>
    } }

    <ng-template #titleInnerContent>
      <span>{{ title() }}</span>
      @if (showEditButton()) {
      <p-button
        type="button"
        styleClass="bg-primary-500 border-none"
        (click)="this.editButtonClicked.emit()"
      >
        <i class="mr-2 fa-solid fa-pencil"></i>
        <span>Edit</span>
      </p-button>
      }
    </ng-template>`,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  readonly title = input.required<string>();
  readonly showEditButton = input(false);
  readonly type = input<'title' | 'subtitle'>('title');
  readonly editButtonClicked = output<void>();
}
