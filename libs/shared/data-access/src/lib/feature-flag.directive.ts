import {
  ChangeDetectorRef,
  Directive,
  effect,
  inject,
  OnChanges,
  TemplateRef,
  ViewContainerRef,
  input,
} from '@angular/core';
import { FeatureFlag } from '@ng-journal/shared/utils-feature-flags';
import { FeatureFlagsFacadeService } from './facades/feature-flags-facade.service';

@Directive({
  selector: '[ngJournalFeatureFlag]',
  standalone: true,
})
export class FeatureFlagDirective implements OnChanges {
  readonly #templateRef = inject(TemplateRef<unknown>);
  readonly #viewContainerRef = inject(ViewContainerRef);
  readonly #featureFlagsFacade = inject(FeatureFlagsFacadeService);
  readonly #changeDetectorRef = inject(ChangeDetectorRef);

  readonly featureFlag = input.required<FeatureFlag | null>({
    alias: 'ngJournalFeatureFlag',
  });

  readonly ngJournalFeatureFlagElse = input<TemplateRef<unknown> | null>(null);

  constructor() {
    effect(() => {
      if (this.featureFlag()) {
        this.#onChanges();
      }
    });
  }

  ngOnChanges() {
    this.#onChanges();
  }

  #onChanges() {
    this.#viewContainerRef.clear();
    const ngJournalFeatureFlagElse = this.ngJournalFeatureFlagElse();
    if (this.#featureFlagEnabled()) {
      this.#viewContainerRef.createEmbeddedView(this.#templateRef);
    } else if (ngJournalFeatureFlagElse) {
      this.#viewContainerRef.createEmbeddedView(ngJournalFeatureFlagElse);
    }
    this.#changeDetectorRef.markForCheck();
  }

  #featureFlagEnabled() {
    const featureFlag = this.featureFlag();
    if (!featureFlag) {
      return true;
    }

    return this.#featureFlagsFacade.featureFlagEnabled(featureFlag);
  }
}
