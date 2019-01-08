// tslint:disable:no-magic-numbers object-literal-sort-keys

import { execSync } from 'child_process';
import { unlinkSync, writeFileSync } from 'fs';
import { ASTModel, JSONModel } from 'lml';
import { sync as mkdirpSync } from 'mkdirp';

/** run via CLI */
function feed(name: string, value: string, args = ''): string {
  const dir = '.test-tmp';
  const ext = name.lastIndexOf('.');
  const file = `${dir}/${name.substr(0, ext)}.${Date.now()}-${Math.random() * 1000000}${name.substr(ext)}`;
  mkdirpSync(dir);
  writeFileSync(file, value);
  const response = execSync(`node_modules/.bin/ts-node cli.ts ${args} ${file}`).toString();
  unlinkSync(file);
  return response;
}

const exampleAST: ASTModel[] = [
  {type: 'directive', data: '!DOCTYPE html'},
  {type: 'tag', name: 'html', children: [
    {type: 'tag', name: 'head', children: [
      {type: 'tag', name: 'title', children: [
        {type: 'text', data: 'hello'}
      ]}
    ]},
    {type: 'tag', name: 'body', children: [
      {type: 'text', data: 'world'}
    ]}
  ]}
];

const exampleHTML = `<!DOCTYPE html>
<html>
  <head>
    <title>hello</title>
  </head>
  <body>world</body>
</html>
`;

const exampleJSON: JSONModel[] = [
  {type: 'directive', data: '!DOCTYPE html'},
  {type: 'element', name: 'html', children: [
    {type: 'element', name: 'head', children: [
      {type: 'element', name: 'title', children: [
        {type: 'text', data: 'hello'}
      ]}
    ]},
    {type: 'element', name: 'body', children: [
      {type: 'text', data: 'world'}
    ]}
  ]}
];

const exampleLML = `!DOCTYPE html
html
  head
    title ; hello
  body ; world
`;

describe('cli', () => {
  describe('Help', () => {
    it('loads on -h', () => {
      const response = execSync(`node_modules/.bin/ts-node cli.ts -h`).toString();
      expect(response.indexOf('Usage:')).toBeGreaterThan(-1);
      expect(response.indexOf('Options:')).toBeGreaterThan(-1);
    });

    it('loads on --help', () => {
      const response = execSync(`node_modules/.bin/ts-node cli.ts --help`).toString();
      expect(response.indexOf('Usage:')).toBeGreaterThan(-1);
      expect(response.indexOf('Options:')).toBeGreaterThan(-1);
    });
  });

  it('missing source comes back with error code', () => {
    expect(() => execSync(`node_modules/.bin/ts-node cli.ts`).toString()).toThrow();
  });

  describe('translation', () => {
    describe('from LML - defaults to HTML output', () => {
      it('works as default', () => {
        expect(feed('x.lml', exampleLML)).toBe(exampleHTML);
      });
    });

    describe('from JSON - defaults to LML output', () => {
      it('works', () => {
        expect(feed('x.json', JSON.stringify(exampleJSON))).toBe(exampleLML);
      });
    });

    describe('from AST - defaults to LML output', () => {
      it('works and conversion defaults to LML', () => {
        expect(feed('x.ast', JSON.stringify(exampleAST))).toBe(exampleLML);
      });
    });

    describe('from HTML - defaults to LML output', () => {
      it('works', () => {
        expect(feed('x.html', exampleHTML)).toBe(exampleLML);
      });
    });
  });

  describe('arguments', () => {
    describe('--minify', () => {
      it('works on JSON output, adds enter to the end (to keep console sane)', () => {
        const result = feed('x.lml', exampleLML, '--to=json --minify');
        expect(result.replace(/  |\n/g, '').length).toBe(JSON.stringify(exampleJSON).length);
      });

      xit('works on AST output, adds enter to the end (to keep console sane)', () => {
        // TODO add AST info
        const result = feed('x.lml', exampleLML, '--to=ast --minify').trim();
        expect(result.replace(/  |\n/g, '').length).toBe(JSON.stringify(exampleAST).length);
      });

      it('works on HTML output, adds enter to the end (to keep console sane)', () => {
        expect(feed('x.lml', exampleLML, '--minify')).toBe(exampleHTML.replace(/  |\n/g, '') + '\n');
      });

      it('throws on LML output', () => {
        expect(() => feed('x.html', exampleHTML, '--minify')).toThrow();
      });
    });
  });
});
