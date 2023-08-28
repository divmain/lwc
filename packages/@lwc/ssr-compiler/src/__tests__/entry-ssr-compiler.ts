import App from 'x/app';
import evaluateSsrComponent from '../runtime/eval';
globalThis.renderedMarkup = evaluateSsrComponent('x-app', App, {});
