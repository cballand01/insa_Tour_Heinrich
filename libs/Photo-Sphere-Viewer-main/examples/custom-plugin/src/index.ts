import { registerButton } from '@photo-sphere-viewer/core';
import { CustomButton } from './CustomButton';

registerButton(CustomButton);

export * from './model';
export * from './events';
export * from './CustomPlugin';

/** @internal */
import './style.scss';
