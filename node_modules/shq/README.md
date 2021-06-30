
<!--#echo json="package.json" key="name" underline="=" -->
shq
===
<!--/#echo -->

<!--#echo json="package.json" key="description" -->
Quote a string for safe use as a shell argument. Strips null characters.
<!--/#echo -->


API
---

This module ESM-exports one function that holds some methods:

### shq(x)

* Stringify `x`,
* remove all U+0000 null characters, because all too often, some C program
  in the pipeline will screw it up even if properly quoted,
* and in case it contains special characters, quote it.



### shq.cfg(opt)

Return a customized quoting function.
`opt` is an optional options object that supports these keys:

* `empty`: How to represent the empty string. Default: A pair of single quotes.
* `gratuitous`: What string to put on both sides of a non-empty input that
  doesn't need to be quoted.



### shq.always

A quoting function that adds `gratuitous` single quotes (cf. `.cfg`).







Usage
-----

see [test.usage.mjs](test.usage.mjs).


<!--#toc stop="scan" -->



Known issues
------------

* Needs more/better tests and docs.




&nbsp;


License
-------
<!--#echo json="package.json" key=".license" -->
ISC
<!--/#echo -->
