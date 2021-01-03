const Input = require('./input');
const Offer = require('./offer');
const { withCallback, withPromise } = require('./open');


/**
 * Default options
 */
const defaultOptions = {
	input: process.stdin,
	output: process.stdout,
	title: '',
	values: [],
	defaultValue: 0,
	selected: '➙',
	unselected: ' ',
	// allowMultiple: false, # upcoming option for multi select
	indentation: 0,
	cleanup: false,
	renderer: (item) => item,
};


/**
 * map incoming values
 *
 * @param {object} options - pick options
 * @param {function} renderer - value renderer
 */
function getValues(values, renderer) {
	return values.map(renderer);
}

/**
 * create an interactive CLI select menu
 *
 * @param {object} options - options for pick
 * @param {function} callback - if specified, a callback will be used, otherwise a promise gets returned (optional)
 */
function pick(options, callback) {
	// merge options with default options
	options = {
		...defaultOptions,
		...options
	};

	// create renderer and input instances
	const offer = new Offer(options);
	const input = new Input(options, offer);

	// handle array values
	input.setValues(getValues(options.values, options.renderer));

	// open the input with callback methods
	if (typeof callback === 'function') {
		return withCallback(input, callback);
	} else {
		return withPromise(input);
	}
};

module.exports = pick;