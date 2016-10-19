# 6pm/emit

[![Version npm](https://img.shields.io/npm/v/@6pm/emit.svg)](https://www.npmjs.com/package/@6pm/emit) [![Build Status](https://img.shields.io/travis/6pm-js/emit/master.svg)](https://travis-ci.org/6pm-js/emit) [![Coverage Status](https://img.shields.io/coveralls/6pm-js/emit/master.svg)](https://coveralls.io/github/6pm-js/emit?branch=master)

A zero dependency event emitter with lazy initialisation, zero memory and cpu
initial state, and full support for `Symbol` event types!




## Installation

Add `@6pm/emit` to your project via npm.

```sh
$ npm install @6pm/emit --save
```




## Testing

First grab a local clone of the github repo.

```sh
$ git clone https://github.com/6pm-js/emit.git
$ cd emit
```

The run the test suite:
```sh
$ npm test
```

Or use istanbul to produce a coverage report.

```sh
$ npm run cover
```




## A note on ES2015

`@6pm/emit` is written using ES2015 features, and as such is directly compatible
only with Node versions >= 4.0.0, or recent evergreen browsers.

In theory, [Babel](https://babeljs.io/) or
[Traceur](https://github.com/google/traceur-compile) could be used to
transpile for compatibility with considerably older JavaScript engines - if
required.

The `@6pm/emit` module is also exposed via a ES2015 module, though the
NPM package includes a UMD wrapped build in [dist/emit.js](./dist/emit.js),
suitable for inclusion in evergreen browsers, or directly accessing via
`require` in Node.

When using the UMD wrapped build directly in a web browser, the `Emit` class is
exposed via the global `sixpm.emit.Emit`.




## Usage

Mostly compatible with the core [NodeJS](https://nodejs.org/)
[EventEmitter](https://nodejs.org/api/events.html#events_class_eventemitter),
except:
- addition of explicit context extensions, as defined by
[eventemitter3](https://github.com/primus/eventemitter3)
- removal of the 'uncaught `error` event throws' behaviour -
	this is very counterintuitive - throw or emit, pick one, or *explicitly* do both.
- removal of the expensive and pointless `newListener` and `removeListener` events.
- Total ignorance of the max listeners setting and its very arbitrary warning.

To turn a class into an event emitter, there are two primary approaches:
- by extension
- by prototypical enhancement




### By extension

Extending the `Emit` class provides event emitter capabilities to the sub class.

```js
import { Emit } from '@6pm/emit';

class SomeNewEmitter extends Emit {}

let instance	= new SomeNewEmitter(),
	EVENT		= Symbol('my.event');


instance.on(EVENT, () => { /* Do some work. */ });

instance.emit(EVENT, 1, 2, 3);
```




### By prototypical enhancement

The static `Emit.assign()` method assigns event emitter capabilities to the
target object, which can be a static object, or a class prototype.

Because `6pm/emit` is initially stateless, no constructor overloading is
required - `assign`ing Just Works™.

```js
import { Emit as EventEmitter } from '@6pm/emit';

class SomeNewEmitter {

	constructor() {
		// Note: no Emit based custom construction required.
	}
}

EventEmitter.assign(SomeNewEmitter.prototype);

let instance = new SomeNewEmitter(),

instance.on('some-event', () => { /* Do some work. */ });

instance.emit('some-event', result, false);
```




### Context enhancement

The following methods support a `context` being passed as an optional third
argument, as a shortcut to avoid the overhead of `bind`ing a function to a
context - an idea brazenly stolen from [eventemitter3](https://github.com/primus/eventemitter3).

- `on`
- `once`
- `off`
- `addListener`
- `removeListener`

So, the following:

```js
someEmitter.on('event', callback, context);
```

is equivalent to, but considerably faster than:

```js
someEmitter.on('event', callback.bind(context));
```




## Design

`@6pm/emit` is designed to address a very common design pattern in JavaScript.

Namely, that event emission, and consumption are notably disjoint - libraries
typically emit many events, in order to expose complete lifecycles of managed
information, but applications rarely consume them all - instead cherry picking a
necessary few as required.



### Zero initial state

This module assumes no initial event state for any given event emitter, instead
augmenting emitters only when listeners are registered for the first time,
with a 'fast path' that can make safe assumptions about hidden emitter state.

This means that there is no cpu overhead, or space requirements for event
emitters, unless an application actually *listens* to them.

The trade off is that the augmented 'Fast path' methods require additional
space once listeners are registered - but for applications where many objects
expose event emitter interfaces, but few are used, this has a significant impact
on resource usage, and initialisation performance.




### Encapsulated internals

All emitter state is hidden via ES2015 `Symbol`s, to prevent clashes, and
provide a degree of encapsulation in the design - though obviously not a perfect
approach to preventing information leakage
([getOwnPropertySymbols](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertySymbols) allows peering behind the veil)
- this is generally safer than using named properties.




### Symbol support

`Symbol`s as event types are supported, and explicitly tested for, throughout
the module - as a matter of personal preference the effective separation /
namespacing and readability of `Symbol`s as events seems like a great approach.

Event production:

```js
import { Emit } from '@6pm/emit';

const START = Symbol('someclass.start.event');

export class SomeClass {

	start() {
		this.emit(START);
	}

}

SomeClass.START = START;
```

Event consumption:

```js
import { SomeClass } from 'someclass.js';

let instance = SomeClass();

// No potential for event name collision, elegant reference to source of event.
instance.on(SomeClass.START, () => { /* ... */ });
```




### Performance

The primary purpose of this module is to provide a (mostly) Node compatible
API, to enforce zero initial state for unsubscribed emitters, to ensure strong
`Symbol` support (due to mixed experiences in alternative libraries), and to use
a clean ES2015 code style.

Performance optimisation is a secondary concern, though by folding in the
lessons learned by the sterling work of the [eventemitter3](https://github.com/primus/eventemitter3)
team, and then continuing to cut any excesses found, this implementation has
become exceptionally efficient - microbenchmarks are a fairly poor measure of
real world performance - but if desired, it is fairly trivial to add `@6pm/emit`
to eventemitter3's benchmark suite to asses raw overheads - and
[the results](https://gist.github.com/6pm-js/781bc511d98454603f192ff16235e071)
(to be consumed with a suitable serving of salt) show `@6pm/emit` as having no
particular weaknesses, and achieving the highest performance in around half of
the tests.

> TODO: Add performance testing and resource monitoring tooling to allow
> comprehensive testing of this *in the wild*.




## Contributing

All comments, criticisms, PRs, and Issues welcome!




## License

Release under the [MIT license](LICENSE)
