import { format } from 'prettier';
import { parse, Node as TemplateNode, ChildNode as TemplateChildNode } from '@lwc/template-compiler';

function idToFnName (id: string) {
  // TODO
  return 'template';
}

function generateChild (node: TemplateChildNode) {
  // TODO
  // - detect usage of custom elements
  // - translate that into import xFoo from "x/foo"
  // - import evalSsrComponent from 'absolute/path/to/eval'
  // - where the custom element is used, yield* evalSsrComponent(customElTagName, xFoo, attrs)
  // - how the hell is this supposed to work with slots? the elements passed into slots
  //   are an abstract representation, and don't correspond directly to output. So the slotted
  //   content needs to be serialized in such a way that it'll be meaningful to the template
  //   that contains the slots and can be rendered to markup there

  if (node.type === 'Element') {
    // TODO
    //   node.attributes
    //   node.properties
    //   node.directives
    return `
      yield '<${node.name}>';
      ${generateChildren(node.children)}
      yield '</${node.name}>';
    `;
  } else if (node.type === 'Text') {
    return `yield ${JSON.stringify(node.raw)};`;
  } else if (node.type === 'Component') {
    return `yield 'FIXME';`;
  } else {
    throw new Error(`Not implemented: ${node.type}`);
  }
}

function generateChildren (nodes: TemplateChildNode[]): string {
  return nodes
    .map((child: TemplateChildNode) => generateChild(child, ))
    .join('\n');
}

export default function compileTemplate (src: string, id: string) {
  const fnName = idToFnName(id);
  const parsed = parse(src);
  console.log(JSON.stringify(parsed, null, 2));

  const code = `
  export default function* ${fnName} (tagName, instance) {
    yield \`<\${tagName}>\`;
    yield \`<template shadowroot="open">\`;
    ${generateChildren(parsed.root!.children)}
    yield \`</template>\`;
    yield \`</\${tagName}>\`;
  }
  `;

  return format(code, { parser: 'babel' });
}
