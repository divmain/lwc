import * as babel from '@babel/core';
import babelClassPropertiesPlugin from '@babel/plugin-proposal-class-properties';
import babelObjectRestSpreadPlugin from '@babel/plugin-proposal-object-rest-spread';
import lwcClassTransformPlugin from '@lwc/babel-plugin-component';

export default function compileScript (code: string, filename: string) {

  const result = babel.transformSync(code, {
    filename,
    babelrc: false,
    configFile: false,
    compact: false,
    plugins: [
      [
        lwcClassTransformPlugin,
        {
          isExplicitImport: false,
          dynamicImports: false,
        },
      ],
      [babelClassPropertiesPlugin, { loose: true }],

      // This plugin should be removed in a future version. The object-rest-spread is
      // already a stage 4 feature. The LWC compile should leave this syntax untouched.
      babelObjectRestSpreadPlugin,
    ],
  })!;

  return {
    code: result.code!,
  };
}
