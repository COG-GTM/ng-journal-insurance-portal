import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
  signal,
  input,
} from '@angular/core';

import { primeNgModules } from '@ng-journal/shared/utils';

export const buttonType = ['button', 'submit', 'reset'];
export const buttonStyle = [
  'primary',
  'success',
  'secondary',
  'info',
  'warning',
  'help',
  'danger',
];

export type ButtonType = (typeof buttonType)[number];
export type ButtonStyle = (typeof buttonStyle)[number];

@Component({
  selector: 'ng-journal-button',
  imports: [...primeNgModules],
  template: `
    <p-button
      [label]="label()"
      [type]="type()"
      [loading]="loading()"
      [disabled]="disabled()"
      [style]="{ width: width() }"
      [styleClass]="'p-button-' + style()"
      (onClick)="clickEvent.emit()"
    />
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  readonly label = input.required<string>();
  readonly style = input<ButtonStyle>('primary');
  readonly type = input<ButtonType>('button');
  readonly width = input<string>();
  readonly disabled = input(false);
  @Output() clickEvent = new EventEmitter<void>();
  loading = signal(false);
}
