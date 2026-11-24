import {
  EnvironmentProviders,
  inject,
  makeEnvironmentProviders,
  provideAppInitializer,
} from '@angular/core';
import { FeatureFlagsFacadeService } from './facades/feature-flags-facade.service';

function initializeFeatureFlags() {
  const featureFlagsFacade = inject(FeatureFlagsFacadeService);
  return featureFlagsFacade.loadFeatureFlags();
}

export function provideFeatureFlags(): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideAppInitializer(() => initializeFeatureFlags()),
  ]);
}
