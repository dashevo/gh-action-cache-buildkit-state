// -*- coding: utf-8, tab-width: 2 -*-

import assert from 'assert';

import shq from '.';

function t(o, w) { assert.strictEqual(t.f(o), w); }

function specialCharsTests() {
  t(`Hello World`, `'Hello World'`);

  t(`setsid "$0" & setsid "$0" &`,
    `'setsid "$0" & setsid "$0" &'`);
  t(`New\nLine`, `'New\nLine'`);

  t(`The "double" quotes`, `'The "double" quotes'`);
  t(`The 'single' quotes`, `'The '\\''single'\\'' quotes'`);
  t(`The ''double single'' quotes`,
    `'The '"''"'double single'"''"' quotes'`);
  t(`''''`, `"''''"`);
}


t.f = shq;
t(``, `''`);
t(`Hello`, `Hello`);
specialCharsTests();


t.f = shq.always;
t(``, `''`);
t(`Hello`, `'Hello'`);
specialCharsTests();


t.f = shq.cfg({ gratuitous: 'foo', empty: 'bar' });
t(``, `bar`);
t(`Hello`, `fooHellofoo`);
specialCharsTests();












console.debug('+OK usage tests passed.');
