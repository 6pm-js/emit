
import { Emit as EventEmitter } from '../lib/emit.js';

import 'should';


describe('6pm/emit', () => {


	it('should construct', () => {
		let emitter = new EventEmitter();
	});


	describe('with no listeners', () => {


		it('should report zero listeners', () => {
			let emitter = new EventEmitter();
			emitter.listenerCount('some-event').should.equal(0);
			emitter.listeners('some-event').should.eql([]);
		});


		it('should emit to no-one', () => {
			let emitter = new EventEmitter();
			emitter.emit('some-event').should.be.false;
			emitter.emit('another-event', 1, 2).should.be.false;
			emitter.emit('last-event', 1, 2, 3, 4, 5).should.be.false;
		});


		it('should report no events', () => {
			let emitter = new EventEmitter();
			emitter.eventNames().should.eql([]);
		});


		it('should silently remove nothing', () => {
			let emitter = new EventEmitter();
			emitter.removeListener('event').should.eql(emitter);
			emitter.removeAllListeners('event').should.eql(emitter);
			emitter.removeAllListeners().should.eql(emitter);
		});


		it('should ignore max listener settings', () => {
			let emitter = new EventEmitter();
			emitter.setMaxListeners(1337);
			emitter.getMaxListeners().should.equal(Infinity);
		});


	});


	describe('with listener added, then removed', () => {


		function nullListener() {}


		it('should report zero listeners', () => {
			let emitter = new EventEmitter();

			emitter.on('test', nullListener);
			emitter.off('test', nullListener);

			emitter.listenerCount('test').should.equal(0);
			emitter.listeners('test').should.eql([]);
		});


		it('should emit to no-one', () => {
			let emitter = new EventEmitter();

			emitter.on('test', nullListener);
			emitter.off('test', nullListener);

			emitter.emit('test').should.be.false;
			emitter.emit('test', 1, 2).should.be.false;
			emitter.emit('test', 1, 2, 3, 4, 5).should.be.false;
		});


		it('should report no events', () => {
			let emitter = new EventEmitter();

			emitter.on('test', nullListener);
			emitter.off('test', nullListener);

			emitter.eventNames().should.eql([]);
		});


		it('should silently remove nothing', () => {
			let emitter = new EventEmitter();

			emitter.on('test', nullListener);
			emitter.off('test', nullListener);

			emitter.removeListener('test').should.eql(emitter);
			emitter.removeAllListeners('test').should.eql(emitter);
			emitter.removeAllListeners().should.eql(emitter);
		});


		it('should ignore max listener settings', () => {
			let emitter = new EventEmitter();

			emitter.on('test', nullListener);
			emitter.off('test', nullListener);

			emitter.setMaxListeners(1337);
			emitter.getMaxListeners().should.equal(Infinity);
		});


	});


	describe('on', () => {


		it('should register an event listener', () => {
			let emitter = new EventEmitter(),
				called	= 0;

			function listener() {
				called++;
			}

			emitter.on('test', listener).should.equal(emitter);
			emitter.emit('test').should.equal(true);
			called.should.equal(1);
		});


		it('should work with Symbols', () => {
			let emitter = new EventEmitter(),
				called	= 0,
				event	= Symbol('event');

			function listener() {
				called++;
			}

			emitter.on(event, listener).should.equal(emitter);
			emitter.emit(event).should.equal(true);
			called.should.equal(1);
		});


		it('should register two event listeners', () => {
			let emitter = new EventEmitter(),
				called	= 0;

			function listener() {
				called++;
			}

			emitter.on('test', listener).should.equal(emitter);
			emitter.on('test', listener).should.equal(emitter);

			emitter.emit('test').should.equal(true);
			called.should.equal(2);
		});


		it('should register multiple event listeners', () => {
			let emitter = new EventEmitter(),
				called	= 0;

			function listener() {
				called++;
			}

			emitter.on('test', listener).should.equal(emitter);
			emitter.on('test', listener).should.equal(emitter);
			emitter.on('test', listener).should.equal(emitter);
			emitter.on('test', listener).should.equal(emitter);

			emitter.emit('test').should.equal(true);
			called.should.equal(4);
		});


		it('should register multiple different event listeners', () => {
			let emitter = new EventEmitter(),
				called	= 0;

			emitter.on('test', () => called += 1000).should.equal(emitter);
			emitter.on('test', () => called +=  100).should.equal(emitter);
			emitter.on('test', () => called +=   10).should.equal(emitter);
			emitter.on('test', () => called +=    1).should.equal(emitter);

			emitter.emit('test').should.equal(true);
			called.should.equal(1111);
		});


		it('should pass through a context', () => {
			let emitter 	= new EventEmitter(),
				context 	= {},
				received	= null;

			function listener() {
				received = this;
			}

			emitter.on('test', listener, context).should.equal(emitter);

			emitter.emit('test').should.equal(true);
			received.should.equal(context);
		});


	});


	describe('addListener', () => {


		it('should register an event listener', () => {
			let emitter = new EventEmitter(),
				called	= 0;

			function listener() {
				called++;
			}

			emitter.addListener('test', listener).should.equal(emitter);
			emitter.emit('test').should.equal(true);
			called.should.equal(1);
		});


		it('should work with Symbols', () => {
			let emitter = new EventEmitter(),
				called	= 0,
				event	= Symbol('event');

			function listener() {
				called++;
			}

			emitter.addListener(event, listener).should.equal(emitter);
			emitter.emit(event).should.equal(true);
			called.should.equal(1);
		});


		it('should register two event listeners', () => {
			let emitter = new EventEmitter(),
				called	= 0;

			function listener() {
				called++;
			}

			emitter.addListener('test', listener).should.equal(emitter);
			emitter.addListener('test', listener).should.equal(emitter);

			emitter.emit('test').should.equal(true);
			called.should.equal(2);
		});


		it('should register multiple event listeners', () => {
			let emitter = new EventEmitter(),
				called	= 0;

			function listener() {
				called++;
			}

			emitter.addListener('test', listener).should.equal(emitter);
			emitter.addListener('test', listener).should.equal(emitter);
			emitter.addListener('test', listener).should.equal(emitter);
			emitter.addListener('test', listener).should.equal(emitter);

			emitter.emit('test').should.equal(true);
			called.should.equal(4);
		});


		it('should register multiple different event listeners', () => {
			let emitter = new EventEmitter(),
				called	= 0;

			emitter.addListener('test', () => called += 1000).should.equal(emitter);
			emitter.addListener('test', () => called +=  100).should.equal(emitter);
			emitter.addListener('test', () => called +=   10).should.equal(emitter);
			emitter.addListener('test', () => called +=    1).should.equal(emitter);

			emitter.emit('test').should.equal(true);
			called.should.equal(1111);
		});


		it('should pass through a context', () => {
			let emitter 	= new EventEmitter(),
				context 	= {},
				received	= null;

			function listener() {
				received = this;
			}

			emitter.addListener('test', listener, context).should.equal(emitter);

			emitter.emit('test').should.equal(true);
			received.should.equal(context);
		});


	});


	describe('once', () => {


		it('should register an event listener', () => {
			let emitter = new EventEmitter(),
				called	= 0;

			function listener() {
				called++;
			}

			emitter.once('test', listener).should.equal(emitter);
			emitter.emit('test').should.equal(true);
			called.should.equal(1);

			emitter.emit('test').should.equal(false);
			called.should.equal(1);
		});


		it('should work with Symbols', () => {
			let emitter = new EventEmitter(),
				called	= 0,
				event	= Symbol('event');

			function listener() {
				called++;
			}

			emitter.once(event, listener).should.equal(emitter);
			emitter.emit(event).should.equal(true);
			called.should.equal(1);
		});


		it('should register two event listeners', () => {
			let emitter = new EventEmitter(),
				called	= 0;

			function listener() {
				called++;
			}

			emitter.once('test', listener).should.equal(emitter);
			emitter.once('test', listener).should.equal(emitter);

			emitter.emit('test').should.equal(true);
			called.should.equal(2);

			emitter.emit('test').should.equal(false);
			called.should.equal(2);
		});


		it('should register multiple event listeners', () => {
			let emitter = new EventEmitter(),
				called	= 0;

			function listener() {
				called++;
			}

			emitter.once('test', listener).should.equal(emitter);
			emitter.once('test', listener).should.equal(emitter);
			emitter.once('test', listener).should.equal(emitter);
			emitter.once('test', listener).should.equal(emitter);

			emitter.emit('test').should.equal(true);
			called.should.equal(4);

			emitter.emit('test').should.equal(false);
			called.should.equal(4);
		});


		it('should register multiple different event listeners', () => {
			let emitter = new EventEmitter(),
				called	= 0;

			emitter.once('test', () => called += 1000).should.equal(emitter);
			emitter.once('test', () => called +=  100).should.equal(emitter);
			emitter.once('test', () => called +=   10).should.equal(emitter);
			emitter.once('test', () => called +=    1).should.equal(emitter);

			emitter.emit('test').should.equal(true);
			called.should.equal(1111);

			emitter.emit('test').should.equal(false);
			called.should.equal(1111);
		});


		it('should pass through a context', () => {
			let emitter 	= new EventEmitter(),
				context 	= {},
				called		= 0,
				received	= null;

			function listener() {
				received = this;
				called++;
			}

			emitter.once('test', listener, context).should.equal(emitter);

			emitter.emit('test').should.equal(true);
			received.should.equal(context);
			called.should.equal(1);

			emitter.emit('test').should.equal(false);
			called.should.equal(1);
		});


	});


	describe('off', () => {


		it('should do nothing, if no listeners attached', () => {
			let emitter = new EventEmitter();

			emitter.off('test', () => {}).should.equal(emitter);
		});


		it('should not remove unmatched listeners', () => {
			let emitter = new EventEmitter(),
				event	= Symbol('event');

			function listener() {}

			emitter.on('test', listener);
			emitter.listeners('test').should.eql([ listener ]);

			emitter.removeListener(event, listener);
			emitter.listeners('test').should.eql([ listener ]);

			emitter.off('test', () => {}).should.equal(emitter);
			emitter.listeners('test').should.eql([ listener ]);

			emitter.off('not-test', listener).should.equal(emitter);
			emitter.listeners('test').should.eql([ listener ]);

			emitter.off('test', listener, {}).should.equal(emitter);
			emitter.listeners('test').should.eql([ listener ]);

			emitter.off('test', listener, undefined, true).should.equal(emitter);
			emitter.listeners('test').should.eql([ listener ]);
		});


		it('should remove an attached listener', () => {
			let emitter = new EventEmitter(),
				called	= 0;

			function listener() {
				called++;
			}

			emitter.on('test', listener);
			emitter.listeners('test').should.eql([ listener ]);

			emitter.off('test', listener).should.equal(emitter);
			emitter.listeners('test').should.eql([]);

			emitter.emit('test');
			called.should.equal(0);
		});


		it('should work with symbols', () => {
			let emitter = new EventEmitter(),
				called	= 0,
				event	= Symbol('event');

			function listener() {
				called++;
			}

			emitter.on(event, listener);
			emitter.listeners(event).should.eql([ listener ]);

			emitter.off(event, listener).should.equal(emitter);
			emitter.listeners(event).should.eql([]);

			emitter.emit(event);
			called.should.equal(0);
		});


		it('should remove an attached listener with correct context', () => {
			let emitter		= new EventEmitter(),
				context1	= { value: 1 },
				context2	= { value: 2 },
				context3	= { value: 4 },
				called		= 0;

			function listener() {
				called += this.value;
			}

			emitter.on('test', listener, context1);
			emitter.on('test', listener, context2);
			emitter.on('test', listener, context3);
			emitter.listeners('test').should.eql([ listener, listener, listener ]);

			emitter.off('test', listener, context2).should.equal(emitter);
			emitter.listeners('test').should.eql([ listener, listener ]);

			emitter.emit('test');
			called.should.equal(5);
		});


		it('should remove a once listener', () => {
			let emitter = new EventEmitter(),
				called	= 0;

			function listener() {
				called++;
			}

			emitter.once('test', listener);
			emitter.listeners('test').should.eql([ listener ]);

			emitter.off('test', listener).should.equal(emitter);
			emitter.listeners('test').should.eql([]);

			emitter.emit('test');
			called.should.equal(0);
		});


		it('should remove a once listener with correct context', () => {
			let emitter		= new EventEmitter(),
				context1	= { value: 1 },
				context2	= { value: 2 },
				context3	= { value: 4 },
				called		= 0;

			function listener() {
				called += this.value;
			}

			emitter.once('test', listener, context1);
			emitter.once('test', listener, context2);
			emitter.once('test', listener, context3);
			emitter.listeners('test').should.eql([ listener, listener, listener ]);

			emitter.off('test', listener, context2).should.equal(emitter);
			emitter.listeners('test').should.eql([ listener, listener ]);

			emitter.emit('test');
			called.should.equal(5);
			emitter.listeners('test').should.eql([]);
		});


		it('should remove only one attached listener', () => {
			let emitter = new EventEmitter(),
				called	= 0;

			function listener() {
				called++;
			}

			emitter.on('test', listener);
			emitter.on('test', listener);
			emitter.on('test', listener);
			emitter.listeners('test').should.eql([ listener, listener, listener ]);

			emitter.off('test', listener).should.equal(emitter);
			emitter.listeners('test').should.eql([ listener, listener ]);

			emitter.emit('test');
			called.should.equal(2);
		});


		it('should remove listeners only from matching event', () => {
			let emitter = new EventEmitter(),
				called	= 0;

			function listener() {
				called++;
			}

			emitter.on('test1', listener);
			emitter.on('test2', listener);
			emitter.listeners('test1').should.eql([ listener ]);
			emitter.listeners('test2').should.eql([ listener ]);

			emitter.off('test1', listener).should.equal(emitter);
			emitter.listeners('test1').should.eql([]);
			emitter.listeners('test2').should.eql([ listener ]);

			emitter.emit('test1');
			called.should.equal(0);

			emitter.emit('test2');
			called.should.equal(1);
		});


	});


	describe('removeListener', () => {


		it('should do nothing, if no listeners attached', () => {
			let emitter = new EventEmitter();

			emitter.removeListener('test', () => {}).should.equal(emitter);
		});


		it('should not remove unmatched listeners', () => {
			let emitter = new EventEmitter(),
				symbol	= Symbol('event');

			function listener() {}

			emitter.on('test', listener);
			emitter.listeners('test').should.eql([ listener ]);

			emitter.removeListener(symbol, listener);
			emitter.listeners('test').should.eql([ listener ]);

			emitter.removeListener('test', () => {}).should.equal(emitter);
			emitter.listeners('test').should.eql([ listener ]);

			emitter.removeListener('not-test', listener).should.equal(emitter);
			emitter.listeners('test').should.eql([ listener ]);

			emitter.removeListener('test', listener, {}).should.equal(emitter);
			emitter.listeners('test').should.eql([ listener ]);

			emitter.removeListener('test', listener, undefined, true).should.equal(emitter);
			emitter.listeners('test').should.eql([ listener ]);
		});


		it('should remove an attached listener', () => {
			let emitter = new EventEmitter(),
				called	= 0;

			function listener() {
				called++;
			}

			emitter.on('test', listener);
			emitter.listeners('test').should.eql([ listener ]);

			emitter.removeListener('test', listener).should.equal(emitter);
			emitter.listeners('test').should.eql([]);

			emitter.emit('test');
			called.should.equal(0);
		});


		it('should work with symbols', () => {
			let emitter = new EventEmitter(),
				called	= 0,
				event	= Symbol('event');

			function listener() {
				called++;
			}

			emitter.on(event, listener);
			emitter.listeners(event).should.eql([ listener ]);

			emitter.removeListener(event, listener).should.equal(emitter);
			emitter.listeners(event).should.eql([]);

			emitter.emit(event);
			called.should.equal(0);
		});


		it('should remove an attached listener with correct context', () => {
			let emitter		= new EventEmitter(),
				context1	= { value: 1 },
				context2	= { value: 2 },
				context3	= { value: 4 },
				called		= 0;

			function listener() {
				called += this.value;
			}

			emitter.on('test', listener, context1);
			emitter.on('test', listener, context2);
			emitter.on('test', listener, context3);
			emitter.listeners('test').should.eql([ listener, listener, listener ]);

			emitter.removeListener('test', listener, context2).should.equal(emitter);
			emitter.listeners('test').should.eql([ listener, listener ]);

			emitter.emit('test');
			called.should.equal(5);
		});


		it('should remove a once listener', () => {
			let emitter = new EventEmitter(),
				called	= 0;

			function listener() {
				called++;
			}

			emitter.once('test', listener);
			emitter.listeners('test').should.eql([ listener ]);

			emitter.removeListener('test', listener).should.equal(emitter);
			emitter.listeners('test').should.eql([]);

			emitter.emit('test');
			called.should.equal(0);
		});


		it('should remove a once listener with correct context', () => {
			let emitter		= new EventEmitter(),
				context1	= { value: 1 },
				context2	= { value: 2 },
				context3	= { value: 4 },
				called		= 0;

			function listener() {
				called += this.value;
			}

			emitter.once('test', listener, context1);
			emitter.once('test', listener, context2);
			emitter.once('test', listener, context3);
			emitter.listeners('test').should.eql([ listener, listener, listener ]);

			emitter.removeListener('test', listener, context2).should.equal(emitter);
			emitter.listeners('test').should.eql([ listener, listener ]);

			emitter.emit('test');
			called.should.equal(5);
			emitter.listeners('test').should.eql([]);
		});


		it('should remove only one attached listener', () => {
			let emitter = new EventEmitter(),
				called	= 0;

			function listener() {
				called++;
			}

			emitter.on('test', listener);
			emitter.on('test', listener);
			emitter.on('test', listener);
			emitter.listeners('test').should.eql([ listener, listener, listener ]);

			emitter.removeListener('test', listener).should.equal(emitter);
			emitter.listeners('test').should.eql([ listener, listener ]);

			emitter.emit('test');
			called.should.equal(2);
		});


		it('should remove listeners only from matching event', () => {
			let emitter = new EventEmitter(),
				called	= 0;

			function listener() {
				called++;
			}

			emitter.on('test1', listener);
			emitter.on('test2', listener);
			emitter.listeners('test1').should.eql([ listener ]);
			emitter.listeners('test2').should.eql([ listener ]);

			emitter.removeListener('test1', listener).should.equal(emitter);
			emitter.listeners('test1').should.eql([]);
			emitter.listeners('test2').should.eql([ listener ]);

			emitter.emit('test1');
			called.should.equal(0);

			emitter.emit('test2');
			called.should.equal(1);
		});


	});


	describe('removeAllListeners', () => {


		it('should do nothing, if no listeners attached', () => {
			let emitter = new EventEmitter();

			emitter.removeAllListeners().should.equal(emitter);
			emitter.removeAllListeners('test').should.equal(emitter);
		});


		it('should remove a listener associated with an event', () => {
			let emitter = new EventEmitter(),
				called	= 0;

			emitter.on('test', () => { called++; });
			emitter.listenerCount('test').should.equal(1);

			emitter.removeAllListeners('test').should.equal(emitter);
			emitter.listenerCount('test').should.equal(0);

			emitter.emit('test');
			called.should.equal(0);
		});


		it('should remove two listeners associated with an event', () => {
			let emitter = new EventEmitter(),
				called	= 0;

			emitter.on('test', () => { called++; });
			emitter.on('test', () => { called++; });
			emitter.listenerCount('test').should.equal(2);

			emitter.removeAllListeners('test').should.equal(emitter);
			emitter.listenerCount('test').should.equal(0);

			emitter.emit('test');
			called.should.equal(0);
		});


		it('should remove multiple listeners associated with an event', () => {
			let emitter = new EventEmitter(),
				called	= 0;

			emitter.on('test', () => { called++; });
			emitter.on('test', () => { called++; });
			emitter.on('test', () => { called++; });
			emitter.listenerCount('test').should.equal(3);

			emitter.removeAllListeners('test').should.equal(emitter);
			emitter.listenerCount('test').should.equal(0);

			emitter.emit('test');
			called.should.equal(0);
		});


		it('should remove symbol based events', () => {
			let emitter = new EventEmitter(),
				event	= Symbol('event'),
				called	= 0;

			emitter.on(event, () => { called++; });
			emitter.on(event, () => { called++; });
			emitter.listenerCount(event).should.equal(2);

			emitter.removeAllListeners(event).should.equal(emitter);
			emitter.listenerCount(event).should.equal(0);

			emitter.emit(event);
			called.should.equal(0);
		});


		it('should only remove the named event listeners', () => {
			let emitter = new EventEmitter(),
				called	= 0;

			emitter.on('test', () => { called++; });
			emitter.on('test', () => { called++; });
			emitter.on('test2', () => { called++; });
			emitter.listenerCount('test').should.equal(2);
			emitter.listenerCount('test2').should.equal(1);

			emitter.removeAllListeners('test').should.equal(emitter);
			emitter.listenerCount('test').should.equal(0);
			emitter.listenerCount('test2').should.equal(1);

			emitter.emit('test');
			called.should.equal(0);

			emitter.emit('test2');
			called.should.equal(1);
		});


		it('should remove all events if no argument supplied', () => {
			let emitter = new EventEmitter(),
				called	= 0;

			emitter.on('test', () => { called++; });
			emitter.on('test', () => { called++; });
			emitter.on('test2', () => { called++; });
			emitter.listenerCount('test').should.equal(2);
			emitter.listenerCount('test2').should.equal(1);

			emitter.removeAllListeners().should.equal(emitter);
			emitter.listenerCount('test').should.equal(0);
			emitter.listenerCount('test2').should.equal(0);

			emitter.emit('test');
			called.should.equal(0);

			emitter.emit('test2');
			called.should.equal(0);
		});


	});


	describe('prependListener', () => {


		it('should register an event listener', () => {
			let emitter = new EventEmitter(),
				called	= 0;

			function listener() {
				called++;
			}

			emitter.prependListener('test', listener).should.equal(emitter);
			emitter.emit('test').should.equal(true);
			called.should.equal(1);
		});


		it('should work with Symbols', () => {
			let emitter = new EventEmitter(),
				called	= 0,
				event	= Symbol('event');

			function listener() {
				called++;
			}

			emitter.prependListener(event, listener).should.equal(emitter);
			emitter.emit(event).should.equal(true);
			called.should.equal(1);
		});


		it('should register two event listeners', () => {
			let emitter = new EventEmitter(),
				called	= 0;

			function listener1() {
				called.should.equal(1);
				called++;
			}

			function listener2() {
				called.should.equal(0);
				called++;
			}

			emitter.prependListener('test', listener1).should.equal(emitter);
			emitter.prependListener('test', listener2).should.equal(emitter);

			emitter.emit('test').should.equal(true);
			called.should.equal(2);
		});


		it('should register multiple event listeners', () => {
			let emitter = new EventEmitter(),
				called	= 0;

			function listener1() { called.should.equal(3); called++; }
			function listener2() { called.should.equal(2); called++; }
			function listener3() { called.should.equal(1); called++; }
			function listener4() { called.should.equal(0); called++; }

			emitter.prependListener('test', listener1).should.equal(emitter);
			emitter.prependListener('test', listener2).should.equal(emitter);
			emitter.prependListener('test', listener3).should.equal(emitter);
			emitter.prependListener('test', listener4).should.equal(emitter);

			emitter.emit('test').should.equal(true);
			called.should.equal(4);
		});


		it('should register multiple different event listeners', () => {
			let emitter = new EventEmitter(),
				called	= 0;

			emitter.prependListener('test', () => { called.should.equal(111); called += 1000; }).should.equal(emitter);
			emitter.prependListener('test', () => { called.should.equal( 11); called +=  100; }).should.equal(emitter);
			emitter.prependListener('test', () => { called.should.equal(  1); called +=   10; }).should.equal(emitter);
			emitter.prependListener('test', () => { called.should.equal(  0); called +=    1; }).should.equal(emitter);

			emitter.emit('test').should.equal(true);
			called.should.equal(1111);
		});


		it('should pass through a context', () => {
			let emitter 	= new EventEmitter(),
				context 	= {},
				received	= null;

			function listener() {
				received = this;
			}

			emitter.prependListener('test', listener, context).should.equal(emitter);

			emitter.emit('test').should.equal(true);
			received.should.equal(context);
		});


	});


	describe('prependOnceListener', () => {


		it('should register an event listener', () => {
			let emitter = new EventEmitter(),
				called	= 0;

			function listener() {
				called++;
			}

			emitter.prependOnceListener('test', listener).should.equal(emitter);
			emitter.emit('test').should.equal(true);
			called.should.equal(1);

			emitter.listenerCount('test').should.equal(0);
			emitter.listeners('test').should.eql([]);
			emitter.emit('test').should.equal(false);
			called.should.equal(1);
		});


		it('should work with Symbols', () => {
			let emitter = new EventEmitter(),
				called	= 0,
				event	= Symbol('event');

			function listener() {
				called++;
			}

			emitter.prependOnceListener(event, listener).should.equal(emitter);
			emitter.emit(event).should.equal(true);
			called.should.equal(1);

			emitter.listenerCount(event).should.equal(0);
			emitter.listeners(event).should.eql([]);
			emitter.emit(event).should.equal(false);
			called.should.equal(1);
		});


		it('should register two event listeners', () => {
			let emitter = new EventEmitter(),
				called	= 0;

			function listener1() {
				called.should.equal(1);
				called++;
			}

			function listener2() {
				called.should.equal(0);
				called++;
			}

			emitter.prependOnceListener('test', listener1).should.equal(emitter);
			emitter.prependOnceListener('test', listener2).should.equal(emitter);

			emitter.emit('test').should.equal(true);
			called.should.equal(2);

			emitter.listenerCount('test').should.equal(0);
			emitter.listeners('test').should.eql([]);
			emitter.emit('test').should.equal(false);
			called.should.equal(2);
		});


		it('should register multiple event listeners', () => {
			let emitter = new EventEmitter(),
				called	= 0;

			function listener1() { called.should.equal(3); called++; }
			function listener2() { called.should.equal(2); called++; }
			function listener3() { called.should.equal(1); called++; }
			function listener4() { called.should.equal(0); called++; }

			emitter.prependOnceListener('test', listener1).should.equal(emitter);
			emitter.prependOnceListener('test', listener2).should.equal(emitter);
			emitter.prependOnceListener('test', listener3).should.equal(emitter);
			emitter.prependOnceListener('test', listener4).should.equal(emitter);

			emitter.emit('test').should.equal(true);
			called.should.equal(4);

			emitter.listenerCount('test').should.equal(0);
			emitter.listeners('test').should.eql([]);
			emitter.emit('test').should.equal(false);
			called.should.equal(4);
		});


		it('should register multiple different event listeners', () => {
			let emitter = new EventEmitter(),
				called	= 0;

			emitter.prependOnceListener('test', () => { called.should.equal(111); called += 1000; }).should.equal(emitter);
			emitter.prependOnceListener('test', () => { called.should.equal( 11); called +=  100; }).should.equal(emitter);
			emitter.prependOnceListener('test', () => { called.should.equal(  1); called +=   10; }).should.equal(emitter);
			emitter.prependOnceListener('test', () => { called.should.equal(  0); called +=    1; }).should.equal(emitter);

			emitter.emit('test').should.equal(true);
			called.should.equal(1111);

			emitter.listenerCount('test').should.equal(0);
			emitter.listeners('test').should.eql([]);
			emitter.emit('test').should.equal(false);
			called.should.equal(1111);
		});


		it('should pass through a context', () => {
			let emitter 	= new EventEmitter(),
				context 	= {},
				received	= null;

			function listener() {
				received = this;
			}

			emitter.prependOnceListener('test', listener, context).should.equal(emitter);

			emitter.emit('test').should.equal(true);
			received.should.equal(context);

			emitter.listenerCount('test').should.equal(0);
			emitter.listeners('test').should.eql([]);
			emitter.emit('test').should.equal(false);
		});


	});


	describe('emit', () => {


		it('should return false if no handlers are registered', () => {
			let emitter = new EventEmitter();

			emitter.emit('test').should.equal(false);
		});


		it('should emit to a single handler', () => {
			let emitter = new EventEmitter(),
				called	= 0;

			function listener() {
				called++;
			}

			emitter.on('test', listener);
			emitter.emit('test').should.equal(true);
			called.should.equal(1);
		});


		it('should pass through any arguments received to a single listener', () => {
			let emitter = new EventEmitter(),
				unique	= {},
				args	= [];

			function listener() {
				args.push(Array.prototype.slice.call(arguments));
			}

			emitter.on('test', listener);

			emitter.emit('test').should.equal(true);
			emitter.emit('test', 1).should.equal(true);
			emitter.emit('test', 1, 7.5).should.equal(true);
			emitter.emit('test', 1, 7.5, false).should.equal(true);
			emitter.emit('test', 1, 7.5, false, unique).should.equal(true);

			args.should.eql([
				[],
				[ 1 ],
				[ 1, 7.5 ],
				[ 1, 7.5, false ],
				[ 1, 7.5, false, unique ]
			]);
		});


		it('should pass through any arguments received to two listeners', () => {
			let emitter = new EventEmitter(),
				unique	= {},
				args1	= [],
				args2	= [];

			function listener1() {
				args1.push(Array.prototype.slice.call(arguments));
			}

			function listener2() {
				args2.push(Array.prototype.slice.call(arguments));
			}

			emitter.on('test', listener1);
			emitter.on('test', listener2);

			emitter.emit('test').should.equal(true);
			emitter.emit('test', 1).should.equal(true);
			emitter.emit('test', 1, 7.5).should.equal(true);
			emitter.emit('test', 1, 7.5, false).should.equal(true);
			emitter.emit('test', 1, 7.5, false, unique).should.equal(true);

			args1.should.eql([
				[],
				[ 1 ],
				[ 1, 7.5 ],
				[ 1, 7.5, false ],
				[ 1, 7.5, false, unique ]
			]);

			args2.should.eql([
				[],
				[ 1 ],
				[ 1, 7.5 ],
				[ 1, 7.5, false ],
				[ 1, 7.5, false, unique ]
			]);
		});


		it('should pass through any arguments received to multiple listeners', () => {
			let emitter = new EventEmitter(),
				unique	= {},
				args1	= [],
				args2	= [],
				args3	= [];

			function listener1() {
				args1.push(Array.prototype.slice.call(arguments));
			}

			function listener2() {
				args2.push(Array.prototype.slice.call(arguments));
			}

			function listener3() {
				args3.push(Array.prototype.slice.call(arguments));
			}

			emitter.on('test', listener1);
			emitter.on('test', listener2);
			emitter.on('test', listener3);

			emitter.emit('test').should.equal(true);
			emitter.emit('test', 1).should.equal(true);
			emitter.emit('test', 1, 7.5).should.equal(true);
			emitter.emit('test', 1, 7.5, false).should.equal(true);
			emitter.emit('test', 1, 7.5, false, unique).should.equal(true);

			args1.should.eql([
				[],
				[ 1 ],
				[ 1, 7.5 ],
				[ 1, 7.5, false ],
				[ 1, 7.5, false, unique ]
			]);

			args2.should.eql([
				[],
				[ 1 ],
				[ 1, 7.5 ],
				[ 1, 7.5, false ],
				[ 1, 7.5, false, unique ]
			]);

			args3.should.eql([
				[],
				[ 1 ],
				[ 1, 7.5 ],
				[ 1, 7.5, false ],
				[ 1, 7.5, false, unique ]
			]);
		});


	});


	describe('listenerCount', () => {


		it('should return zero if no listeners attached', () => {
			let emitter = new EventEmitter();

			emitter.listenerCount('event').should.equal(0);
		});


		it('should return one if a single listener attached', () => {
			let emitter = new EventEmitter();

			emitter.on('event', () => {});
			emitter.listenerCount('event').should.equal(1);
		});


		it('should return two if two listeners attached', () => {
			let emitter = new EventEmitter();

			emitter.on('event', () => {});
			emitter.on('event', () => {});
			emitter.listenerCount('event').should.equal(2);
		});


		it('should return three if three listeners attached', () => {
			let emitter = new EventEmitter();

			emitter.on('event', () => {});
			emitter.on('event', () => {});
			emitter.on('event', () => {});
			emitter.listenerCount('event').should.equal(3);
		});


		it('should work with Symbols', () => {
			let emitter = new EventEmitter(),
				event	= Symbol('event');

			emitter.on(event, () => {});
			emitter.on(event, () => {});
			emitter.listenerCount(event).should.equal(2);
		});


	});


	describe('listeners', () => {


		it('should return an empty array if no listeners attached', () => {
			let emitter = new EventEmitter();

			emitter.listeners('event').should.eql([]);
		});


		it('should return a single listener attached', () => {
			let emitter = new EventEmitter();

			function listener() {}

			emitter.on('event', listener);
			emitter.listeners('event').should.eql([ listener ]);
		});


		it('should return two listeners attached', () => {
			let emitter = new EventEmitter();

			function listener() {}

			emitter.on('event', listener);
			emitter.on('event', listener);
			emitter.listeners('event').should.eql([ listener, listener ]);
		});


		it('should return three listeners attached', () => {
			let emitter = new EventEmitter();

			function listener() {}

			emitter.on('event', listener);
			emitter.on('event', listener);
			emitter.on('event', listener);
			emitter.listeners('event').should.eql([ listener, listener, listener ]);
		});


		it('should return distinct listeners in correct addition order', () => {
			let emitter = new EventEmitter();

			function listener1() {}
			function listener2() {}
			function listener3() {}

			emitter.on('event', listener2);
			emitter.on('event', listener3);
			emitter.on('event', listener1);
			emitter.listeners('event').should.eql([ listener2, listener3, listener1 ]);
		});


		it('should work with Symbols', () => {
			let emitter = new EventEmitter(),
				event	= Symbol('event');

			function listener() {}

			emitter.on(event, listener);
			emitter.on(event, listener);
			emitter.listeners(event).should.eql([ listener, listener ]);
		});


	});


	describe('eventNames', () => {


		it('should return an empty array if no listeners attached', () => {
			let emitter = new EventEmitter();

			emitter.eventNames().should.eql([]);
		});


		it('should return a single registered event name', () => {
			let emitter = new EventEmitter();

			emitter.on('test', () => {});
			emitter.eventNames().should.eql([ 'test' ]);
		});


		it('should return multiple registered event names', () => {
			let emitter = new EventEmitter();

			emitter.on('test1', () => {});
			emitter.on('test2', () => {});
			emitter.on('test3', () => {});

			emitter.eventNames().should.eql([ 'test1', 'test2', 'test3' ]);
		});


		it('should work with Symbols', () => {
			let emitter = new EventEmitter(),
				event	= Symbol('event');

			emitter.on('test1', () => {});
			emitter.on(event, () => {});
			emitter.on('test3', () => {});

			// Note, order undefined in spec - but implicit in implementation.
			emitter.eventNames().should.eql([ 'test1', 'test3', event ]);
		});


	});


	describe('prototypical assignment', () => {


		it('should assign event emitter semantics to an arbitrary prototype', () => {
			class SomeClass {}

			EventEmitter.assign(SomeClass.prototype);

			let instance	= new SomeClass(),
				called		= 0;

			instance.on('test', () => { called++; }).should.equal(instance);
			instance.emit('test').should.be.true;

			called.should.equal(1);
		});


	});


});
