import { getTemplateForComponent, HtmlGenerator, Template } from './engine-shim.js';

function collect (htmlGenerator: HtmlGenerator) {
  let memo = '';
  for (const el of htmlGenerator) {
    memo += el;
  }
  return memo;
}

export default function evaluateRootSsrComponent (
  tagName: string,
  ComponentClass: any,
  props: Object,
) {
  const instance = new ComponentClass(props);
  const template = getTemplateForComponent(instance)!;
  const htmlGenerator = template(tagName);

  const output = collect(htmlGenerator);

  console.log({
    render: !!instance.render,
    template: template.toString(),
    output,
  });

  return output;
}
