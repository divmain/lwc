import vm from 'vm';
import fs from 'fs';
import path from 'path';

import lwcRollupPlugin from '@lwc/rollup-plugin';
import ssrRollupPlugin from '../rollup-plugin';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import commonJsPlugin from '@rollup/plugin-commonjs';
import typescriptPlugin from 'rollup-plugin-typescript';
import { rollup } from 'rollup';


async function generateHtmlWithEngineServer(scenario: string) {
  const bundle = await rollup({
    input: `./entry-engine-server.ts`,
    plugins: [
      typescriptPlugin(),
      nodeResolve(),
      lwcRollupPlugin({
        modules: [
          { dir: path.join(__dirname, 'fixtures', scenario, 'modules') },
        ],
      }),
      replace({
        preventAssignment: true,
        delimiters: ['', ''],
        values: {
          'from "lwc"': `from "@lwc/engine-server"`,
          "from 'lwc'": `from "@lwc/engine-server"`,
        },
      }),
    ],
  });

  const { output } = await bundle.generate({
    format: 'cjs',
    exports: 'named',
  });
  const { code } = output[0];
  const context = {
    process: {
      env: {
        NODE_ENV: process.env.NODE_ENV || 'production'
      }
    },
    renderedMarkup: '',
  };
  vm.createContext(context);
  vm.runInContext(code, context);
  return context.renderedMarkup;
}

async function generateExperimentalHtml(scenario: string) {
  const pathToShim = path.resolve(__dirname, '../runtime/engine-shim');

  const bundle = await rollup({
    input: `./entry-ssr-compiler.ts`,
    plugins: [
      typescriptPlugin(),
      nodeResolve(),
      commonJsPlugin({
        include: /dist\/.*\.js/,
      }),
      ssrRollupPlugin({
        modules: [
          { dir: path.join(__dirname, 'fixtures', scenario, 'modules') },
        ],
      }),
      replace({
        preventAssignment: true,
        delimiters: ['', ''],
        values: {
          'from "lwc"': `from "${pathToShim}"`,
          "from 'lwc'": `from "${pathToShim}"`,
        },
      }),
    ],
  });

  const { output } = await bundle.generate({
    format: 'cjs',
    exports: 'named',
  });
  const { code } = output[0];
  const context = {
    console: {
      log: console.log,
    },
    process: {
      env: {
        NODE_ENV: process.env.NODE_ENV || 'production'
      }
    },
    renderedMarkup: '',
  };
  vm.createContext(context);
  vm.runInContext(code, context);
  return context.renderedMarkup;
}

describe('ssr-compiler fixtures', () => {
  const scenarios = fs.readdirSync(path.join(__dirname, 'fixtures'));
  for (const scenario of scenarios) {
    describe(scenario, () => {
      it('SSR output matches between engine-server and SSR compiler', async () => {
        const engineServerHtml = await generateHtmlWithEngineServer(scenario);
        const experimentalHtml = await generateExperimentalHtml(scenario);

        expect(engineServerHtml).toEqual(experimentalHtml);
      });
    });
  }
});
