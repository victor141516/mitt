/* eslint-disable @typescript-eslint/ban-ts-comment, @typescript-eslint/no-unused-vars */

import atch from '..';

interface SomeEventData {
	name: string;
}

const emitter = atch<{
	foo: string;
	someEvent: SomeEventData;
	bar?: number;
}>();

const barHandler = (x?: number) => {};
const fooHandler = (x: string) => {};
const wildcardHandler = (
	_type: 'foo' | 'bar' | 'someEvent',
	_event: string | SomeEventData | number | undefined
) => {};

/*
 * Check that 'on' args are inferred correctly
 */
{
	// @ts-expect-error
	emitter.on('foo', barHandler);
	emitter.on('foo', fooHandler);

	emitter.on('bar', barHandler);
	// @ts-expect-error
	emitter.on('bar', fooHandler);

	emitter.on('*', wildcardHandler);
	// fooHandler is ok, because ('foo' | 'bar' | 'someEvent') extends string
	emitter.on('*', fooHandler);
	// @ts-expect-error
	emitter.on('*', barHandler);
}

/*
 * Check that 'once' args are inferred correctly
 */
{
	// @ts-expect-error
	emitter.once('foo', barHandler);
	emitter.once('foo', fooHandler);

	emitter.once('bar', barHandler);
	// @ts-expect-error
	emitter.once('bar', fooHandler);

	emitter.once('*', wildcardHandler);
	// fooHandler is ok, because ('foo' | 'bar' | 'someEvent') extends string
	emitter.once('*', fooHandler);
	// @ts-expect-error
	emitter.once('*', barHandler);

	emitter.once('foo', fooHandler)();
}

/*
 * Check that 'waitFor' args are inferred correctly
 */
{
	const _ = emitter.waitFor('foo').then;
}

/*
 * Check that 'off' args are inferred correctly
 */
{
	// @ts-expect-error
	emitter.off('foo', barHandler);
	emitter.off('foo', fooHandler);

	emitter.off('bar', barHandler);
	// @ts-expect-error
	emitter.off('bar', fooHandler);

	emitter.off('*', wildcardHandler);
	// fooHandler is ok, because ('foo' | 'bar' | 'someEvent') extends string
	emitter.off('*', fooHandler);
	// @ts-expect-error
	emitter.off('*', barHandler);
}

/*
 * Check that 'emit' args are inferred correctly
 */
{
	// @ts-expect-error
	emitter.emit('someEvent', 'NOT VALID');
	emitter.emit('someEvent', { name: 'jack' });

	// @ts-expect-error
	emitter.emit('foo');
	// @ts-expect-error
	emitter.emit('foo', 1);
	emitter.emit('foo', 'string');

	emitter.emit('bar');
	emitter.emit('bar', 1);
	// @ts-expect-error
	emitter.emit('bar', 'string');
}
