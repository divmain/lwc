const templateKey = Symbol('__template_internal');

type LightningElementConstructor = typeof LightningElement;

export class LightningElement {
  [templateKey]?: Template;
  bar = 'bar';
  foo() {}
}

export type YieldedFromTemplate = string;
export type HtmlGenerator = IterableIterator<YieldedFromTemplate>;
export type Template = (tagName: string) => HtmlGenerator;

interface RegisterComponentProps {
  tmpl: Template;
}

export function registerComponent (
  ComponentClass: LightningElementConstructor,
  props: RegisterComponentProps,
) {
  ComponentClass.prototype[templateKey] = props.tmpl;
  // TODO
  return ComponentClass;
}

export function getTemplateForComponent (component: LightningElement) {
  return component[templateKey];
}
