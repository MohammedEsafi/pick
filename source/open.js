/**
 * open the input with callback function
 *
 * @param {Input} input - input object
 * @param {function} callback - callback function
 */
const withCallback = (input, callback) => {
	input.open();
	input.setOnSelect((ids) => callback(ids));
};

/**
 * open the input with a promise
 *
 * @param {Input} input - input object
 */
const withPromise = (input) => {
	return new Promise((resolve, reject) => {
		input.open();
		input.setOnSelect((ids) => {
			if (ids !== null)
				resolve(ids);
			else
				reject();
		});
	});
}

module.exports = {
	withCallback,
	withPromise
};