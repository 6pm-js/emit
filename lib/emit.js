
/** Symbols used to maintain hidden state in emitters. */
const	EVENTS		= Symbol('emit.events'),
		COUNT		= Symbol('emit.count');


/**
 * Empty class definition used as a container for events - this gleans the
 * benefit of having a shallow prototype chain, and benefits from v8's
 * partial class specialisation for properties, for common events.
 */
function EventSet() {}


/**
 * Wrapper for a single listener assigned to an emitter instance.
 */
class Listener {


	constructor(listener, context, once) {
		this.listener	= listener;
		this.context	= context;
		this.once		= once;
	}


}


/**
 * Fast path `Emit` functionality, used once an emitter has listeners.
 * Separating this functionality allows emitters with no listeners to use no
 * additional memory, above their basic instance - and lazily obtain state
 * only when required.  This is particularly beneficial in systems where many
 * events are emitted, but few consumed (a decidedly common pattern).
 */
class FastEmit {


	/**
	 * Emit a new event, with an arbitrary number of arguments.
	 */
	emit(event, a, b, c) {
		let handler	= this[ EVENTS ][ event ];
		if (handler === undefined) { return false; }

		let length	= arguments.length;

		if (handler.listener) {
			// Single listener path.

			// Handle `once` listener removal first, to allow short circuit
			// returns below.
			if (handler.once) {
				this.removeListener(event, handler.listener, undefined, true);
			}

			// Fast path for 1-3 param emission.
			switch(length) {
				case 1:
					return handler.listener.call(handler.context), true;
				case 2:
					return handler.listener.call(handler.context, a), true;
				case 3:
					return handler.listener.call(handler.context, a, b), true;
				case 4:
					return handler.listener.call(handler.context, a, b, c), true;
			}

			// Slow path for >3 param emission.
			let args = new Array(length - 1);
			for(let pos = 1; pos < length; pos++) {
				args[ pos - 1 ] = arguments[ pos ];
			}
			return handler.listener.apply(handler.context, args), true;

		}else{
			// Multiple listener path.

			// If more than 3 emission params, precalculate the arguments
			// array to pass to each listener.
			let args = null;
			if (length > 4) {
				args = new Array(length - 1);
				for(let index = 1; index < length; index++) {
					args[ index - 1 ] = arguments[ index ];
				}
			}

			// Loop through each registered listener.
			for(let index = 0; index < handler.length; index++) {
				let listener = handler[ index ];

				// Use `Function.call` for fast path, if possible.
				switch(length) {
					case 1:
						listener.listener.call(listener.context); break;
					case 2:
						listener.listener.call(listener.context, a); break;
					case 3:
						listener.listener.call(listener.context, a, b); break;
					case 4:
						listener.listener.call(listener.context, a, b, c); break;
					default:
						// Slow path `Function.apply` for >3 params.
						listener.listener.apply(listener.context, args);
				}

				// Remove `once` only listeners after emission.
				if (listener.once) {
					this.removeListener(event, listener.listener, listener.context, true);
				}
			}

			return true;
		}
	}


	/**
	 * Remove the event listener specified.
	 *
	 * @param {String | Symbol} event	The name of the event to remove from.
	 * @param {Function} listener		The listener function to remove.
	 * @param {any} context				[optional] The context associated.
	 * @param {Boolean} once			Remove a `once` declared listener.
	 *
	 * @return {any} Returns emitter object for method chaining.
	 */
	removeListener(event, listener, context, once) {
		let handler	= this[ EVENTS ][ event ];
		if (handler === undefined) { return this; }

		if (handler.listener) {
			// Single listener path - check if it matches, and remove if possible.
			if (handler.listener === listener
					&& (context === undefined || handler.context === context)
					&& (once === undefined || handler.once)) {

				if (--this[ COUNT ] === 0) {
					// Fast path if this is the only event type in use.
					this[ EVENTS ] = new EventSet();
				}else{
					// Slow path if multiple events are registered.
					delete this[ EVENTS ][ event ];
				}
			}
			return this;

		}else{
			// Multiple listener path.
			let length		= handler.length,
				remainder	= [];

			// Loop through listeners
			for(let index = 0; index < length; index++) {
				let instance = handler[ index ];

				// Check each for a match, and don't include them in the
				// remainder function.
				if (instance.listener === listener
						&& (context === undefined || instance.context === context)
						&& (once === undefined || instance.once)) {
					// Only remove one instance, to match Node docs.
					listener = null;
				}else{
					remainder.push(instance);
				}
			}

			if (remainder.length === 1) {
				// One listener remains, special case it.
				return this[ EVENTS ][ event ] = remainder[ 0 ], this;
			}else{
				// Set the listener array to the remainder.
				return this[ EVENTS ][ event ] = remainder, this;
			}
		}
	}


	/**
	 * Add a new event listener with an optional context.
	 *
	 * @param {String | Symbol} event	The event to listen for.
	 * @param {Function} listener		The listener to call on event emission.
	 * @param {any} context				[optional] Context to execute listener on.
	 *
	 * @return {any} Returns emitter object for method chaining.
	 */
	addListener(event, listener, context) {
		let handler	= this[ EVENTS ][ event ];

		if (context === undefined) { context = this; }

		if (!handler) {
			// No event, create special cased single listener.
			this[ EVENTS ][ event ] = new Listener(listener, context, false);
			this[ COUNT ]++;
		}else if (handler.length) {
			// Existing event handler array, add listener.
			handler.push(new Listener(listener, context, false));
		}else{
			// Single special cased listener, turn into listener array.
			this[ EVENTS ][ event ] = [ handler, new Listener(listener, context, false) ];
		}

		return this;
	}


	/**
	 * Add a new event listener with an optional context, to be executed only
	 * once, on next emission of the specified event.
	 *
	 * @param {String | Symbol} event	The event to listen for.
	 * @param {Function} listener		The listener to call on event emission.
	 * @param {any} context				[optional] Context to execute listener on.
	 *
	 * @return {any} Returns emitter object for method chaining.
	 */
	once(event, listener, context) {
		let handler	= this[ EVENTS ][ event ];

		if (!handler) {
			// No event, create special cased single listener.
			this[ EVENTS ][ event ] = new Listener(listener, context || this, true);
			this[ COUNT ]++;
		}else if (handler.length) {
			// Existing event handler array, add listener.
			handler.push(new Listener(listener, context || this, true));
		}else{
			// Single special cased listener, turn into listener array.
			this[ EVENTS ][ event ] = [ handler, new Listener(listener, context || this, true) ];
		}

		return this;
	}


}


/**
 * Switch target emitter from zero memory footprint to fast track.
 */
function init(target) {
	if (!target.hasOwnProperty(EVENTS)) {
		target[ EVENTS ] = new EventSet();
		target[ COUNT ] = 0;

		let proto = FastEmit.prototype;

		target.emit				= proto.emit;
		target.addListener		= proto.addListener;
		target.removeListener	= proto.removeListener;
		target.on				= proto.addListener;
		target.off				= proto.removeListener;
		target.once				= proto.once;
	}

	return target[ EVENTS ];
}


/**
 * Standard lazy event emitter interface.  Defers to fast path interface above
 * once any listeners are registered - allowing zero initialisation emitters,
 * and simple prototype assignment for prototypical inheritence.
 *
 * Declared methods fall into three categories:
 *
 * - Fast path, short circuit - where nothing is to be done before listeners.
 * - Slow path, uncommon - where method is rarely used in performance critical code.
 * - Transition path - registering of listeners, that triggers FastPath assignment.
 */
export class Emit {


	/**
	 * Emit an event.
	 *
	 * @see https://nodejs.org/api/events.html#events_emitter_emit_eventname_args
	 */
	emit() {
		return false;
	}


	/**
	 * Remove an event listener.
	 *
	 * @param {String | Symbol} event	The event to remove from.
	 * @param {Function} listener		The listener to remove.
	 * @param {any} context				[optional] The context assocaited.
	 *
	 * @see https://nodejs.org/api/events.html#events_emitter_removelistener_eventname_listener
	 */
	removeListener() {
		return this;
	}


	/**
	 * Remove an event listener.  Short cut for `removeListener`.
	 *
	 * @param {String | Symbol} event	The event to remove from.
	 * @param {Function} listener		The listener to remove.
	 * @param {any} context				[optional] The context assocaited.
	 *
	 * @see https://nodejs.org/api/events.html#events_emitter_removelistener_eventname_listener
	 */
	off() {
		return this;
	}


	/**
	 * Get all events with listeners on this emitter.
	 *
	 * @see https://nodejs.org/api/events.html#events_emitter_eventnames
	 */
	eventNames() {
		let events = this[ EVENTS ];
		if (!events) { return []; }

		return Object.keys(events).concat(Object.getOwnPropertySymbols(events));
	}


	/**
	 * Get the maximum listeners before warning.  In `6pm/emit`, this value is
	 * always `Infinity`.
	 *
	 * @see https://nodejs.org/api/events.html#events_emitter_getmaxlisteners
	 */
	getMaxListeners() {
		return Infinity;
	}


	/**
	 * Set the maximum listeners before warning.  In `6pm/emit`, this method is
	 * ignored, as max listeners is pretty much useless.
	 *
	 * @see https://nodejs.org/api/events.html#events_emitter_setmaxlisteners_n
	 */
	setMaxListeners(max) {}


	/**
	 * Remove all listeners, or all listeners associated with an event.
	 *
	 * @see https://nodejs.org/api/events.html#events_emitter_removealllisteners_eventname
	 */
	removeAllListeners(event) {
		if (!event) {
			if (this[ EVENTS ]) {
				this[ EVENTS ] = new EventSet();
			}
		}else{
			let events = this[ EVENTS ];
			if (!events) { return this; }

			let handler = events[ event ];
			if (!handler) { return this; }

			if (--this[ COUNT ] == 0) {
				this[ EVENTS ] = new EventSet();
			}else{
				delete events[ event ];
			}
		}
		return this;
	}


	/**
	 * Return the number of listeners registered for the event given.
	 *
	 * @see https://nodejs.org/api/events.html#events_emitter_listenercount_eventname
	 */
	listenerCount(event) {
		let events = this[ EVENTS ];
		if (!events) { return 0; }

		let handler = events[ event ];
		if (!handler) { return 0; }

		if (handler.listener) { return 1; }

		return handler.length

	}


	/**
	 * Return an array of all listeners registered to the event given.
	 *
	 * @see https://nodejs.org/api/events.html#events_emitter_listeners_eventname
	 */
	listeners(event) {
		let events = this[ EVENTS ];
		if (!events) { return []; }

		let handler = events[ event ];
		if (!handler) { return []; }

		if (handler.listener) {
			return [ handler.listener ];
		}

		return handler.map(instance => instance.listener);
	}


	/**
	 * Add a new event listener, with an optional context.
	 *
	 * @param {String | Symbol} event	The event to listen for.
	 * @param {Function} listener		The listener to call.
	 * @param {any} context				[optional] The context to call on.

	 * @see https://nodejs.org/api/events.html#events_emitter_addlistener_eventname_listener
	 */
	addListener(event, listener, context) {
		return this.on(event, listener, context);
	}


	/**
	 * Add a new event listener, with an optional context.
	 *
	 * @param {String | Symbol} event	The event to listen for.
	 * @param {Function} listener		The listener to call.
	 * @param {any} context				[optional] The context to call on.

	 * @see https://nodejs.org/api/events.html#events_emitter_on_eventname_listener
	 */
	on(event, listener, context) {
		init(this);
		return this.on(event, listener, context);
	}


	/**
	 * Add a new event listener, with an optional context, to be executed at
	 * most once.
	 *
	 * @param {String | Symbol} event	The event to listen for.
	 * @param {Function} listener		The listener to call.
	 * @param {any} context				[optional] The context to call on.

	 * @see https://nodejs.org/api/events.html#events_emitter_once_eventname_listener
	 */
	once(event, listener, context) {
		init(this);
		return this.once(event, listener, context);
	}


	/**
	 * Prepend a new event listener with an optional context.
	 *
	 * @param {String | Symbol} event	The event to listen for.
	 * @param {Function} listener		The listener to call on event emission.
	 * @param {any} context				[optional] Context to execute listener on.
	 *
	 * @return {any} Returns emitter object for method chaining.
	 * @see https://nodejs.org/api/events.html#events_emitter_prependlistener_eventname_listener
	 */
	prependListener(event, listener, context) {
		let events	= init(this),
			handler	= this[ EVENTS ][ event ];

		if (context === undefined) { context = this; }

		if (!handler) {
			// No event, create special cased single listener.
			this[ EVENTS ][ event ] = new Listener(listener, context, false);
			this[ COUNT ]++;
		}else if (handler.length) {
			// Existing event handler array, add listener.
			handler.unshift(new Listener(listener, context, false));
		}else{
			// Single special cased listener, turn into listener array.
			this[ EVENTS ][ event ] = [ new Listener(listener, context, false), handler ];
		}

		return this;
	}


	/**
	 * Prepend a new event listener with an optional context, to be executed only
	 * once, on next emission of the specified event.
	 *
	 * @param {String | Symbol} event	The event to listen for.
	 * @param {Function} listener		The listener to call on event emission.
	 * @param {any} context				[optional] Context to execute listener on.
	 *
	 * @return {any} Returns emitter object for method chaining.
	 * @see https://nodejs.org/api/events.html#events_emitter_prependoncelistener_eventname_listener
	 */
	prependOnceListener(event, listener, context) {
		let events	= init(this),
			handler	= this[ EVENTS ][ event ];

		if (!handler) {
			// No event, create special cased single listener.
			this[ EVENTS ][ event ] = new Listener(listener, context || this, true);
			this[ COUNT ]++;
		}else if (handler.length) {
			// Existing event handler array, add listener.
			handler.unshift(new Listener(listener, context || this, true));
		}else{
			// Single special cased listener, turn into listener array.
			this[ EVENTS ][ event ] = [ new Listener(listener, context || this, true), handler ];
		}

		return this;
	}


	/**
	 * Assign event emitter functionality to the target object, or class
	 * prototype.  Since `6pm/emit` based emitters begin their lifecycle
	 * stateless, there is nothing further required, no chained constructor
	 * call, or base class extension / super call.
	 *
	 * @param {any} target	The target to turn into an event emitter.
	 *
	 * @return {any} The target supplied, now as a fully operational emitter.
	 */
	static assign(target) {
		let proto = this.prototype;

		// Class methods are non-enumerable :-(

		target.emit					= proto.emit;
		target.addListener			= proto.addListener;
		target.removeListener		= proto.removeListener;
		target.on					= proto.on;
		target.off					= proto.off;
		target.once					= proto.once;

		target.eventNames			= proto.eventNames;
		target.listeners			= proto.listeners;
		target.listenerCount		= proto.listenerCount;
		target.getMaxListeners		= proto.getMaxListeners;
		target.setMaxListeners		= proto.setMaxListeners;
		target.removeAllListeners	= proto.removeAllListeners;
		target.prependListener		= proto.prependListener;
		target.prependOnceListener	= proto.prependOnceListener;

		return target;
	}


}
