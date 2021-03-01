const { eraseLines, cursorHide } = require('ansi-escapes');


/**
 * handle CLI responses displaying
 */
class Offer {
	/**
	 * `Offer` constructor
	 */
	constructor(options)
	{
		// set default values
		this.options = options;
		this.stream = options.output;
		this.status = true; // for initial render is true
		this.values = [];
	}

	/**
	 * set the available values
	 * 
	 * @param {array} values - all available values
	 */
	setValues(values) {
		this.values = values;
	}

	/**
	 * cleanup the console at the end
	 */
	cleanup() {
		if (this.options.cleanup) {
			this.eraseLines(this.values.length);
		}
	}

	/**
	 * clear the console.
	 */
	eraseLines(length) {
		this.stream.write(eraseLines(length));
	}

	/**
	 * show title
	 */
	showTitle() {
		if (this.options.title)
		{
			this.stream.write(`${this.options.title}\n`);
		}
	}

	/**
	 * place cursor at the end
	 */
	putCursorAtEnd() {
		this.stream.write('\n');
	}

	/**
	 * render the values
	 * 
	 * @param {number} selectedValue - selected value
	 */
	render(selectedValue) {
		if (!this.status) {
			// remove previous lines and values
			this.eraseLines(this.values.length);
		} else {
			// hide the cursor initially
			this.status = false;
			this.stream.write(cursorHide);
		}

		this.values.forEach((renderedValue, index) => {
			const indentation = ' '.repeat(this.options.indentation);
			const symbol = selectedValue === index ? this.options.selected : this.options.unselected;
			const endLine = index !== this.values.length - 1 ? '\n' : '';

			this.stream.write(indentation);
			this.stream.write(`${symbol} `);
			this.stream.write(renderedValue);
			this.stream.write(endLine);
		});
	};
}

module.exports = Offer;