import { DEFAULTS } from '@photo-sphere-viewer/core';
import * as events from './events';
import { ResolutionPlugin } from './ResolutionPlugin';

DEFAULTS.lang[ResolutionPlugin.id] = 'Quality';

export { ResolutionPlugin };
export * from './model';
export { events };
