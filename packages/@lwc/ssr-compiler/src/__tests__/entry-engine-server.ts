import App from 'x/app';
import { renderComponent } from '@lwc/engine-server';
globalThis.renderedMarkup = renderComponent('x-app', App, {});
