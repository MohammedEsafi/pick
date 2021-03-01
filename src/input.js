const readline = require('readline');


/**
 * handle cli input
 */
class Input {
	/**
	 * `Input` constructor
	 * 
	 * @param {object} options - options
	 * @param {Offer} offer - renderer to use for rendering responses
	 */
	constructor(options, offer) {
		// set default values
		this.stream = options.input;
		this.values = [];
		this.selectedValue = options.defaultValue;
		this.offer = offer;
		this.onSelect = () => {};
		this.onKeyPress = this.onKeyPress.bind(this);
	}

	/**
	 * set the available values
	 * 
	 * @param {array} values - all available values
	 */
	setValues(values) {
		this.values = values;

		if (this.offer)
		{
			this.offer.setValues(values);
		}
	}

	/**
	 * set onSelect function
	 * 
	 * @param {function} callback - The function to be called when items is selected
	 */
	setOnSelect(callback) {
		this.onSelect = callback;
	}

	/**
	 * open the stream and listen for input
	 */
	open() {
		// register keypress event
		readline.emitKeypressEvents(this.stream);

		// handle keypress
		this.stream.on('keypress', this.onKeyPress);

		// show title
		this.offer.showTitle();

		// initially render the response
		this.render();

		// hide pressed keys and start listening on input
		this.stream.setRawMode(true);
		this.stream.resume();
	}

	/**
	 * close the stream
	 * 
	 * @param {boolean} cancelled - true if no value was selected (optional)
	 */
	close(cancelled = false) {
		// send cursor at the end
		this.offer.putCursorAtEnd();
	
		// reset stream properties
		this.stream.setRawMode(false);
		this.stream.pause();

		// cleanup the output
		if (this.offer) {
			this.offer.cleanup();
		}

		// call the on select listener
		if (cancelled) {
			this.onSelect(null);
		} else {
			this.onSelect(this.selectedValue);
		}

		this.stream.removeListener('keypress', this.onKeyPress);
	}

	/**
	 * render the response
	 */
	render() {
		if (this.offer)
		{
			this.offer.render(this.selectedValue);
		}
	}

	/**
	 * handle key press event
	 * @param {object} key - object containing information about the pressed key
	 */
	onKeyPress(_, key) {
		if (key) {
			if (key.name === 'up' && this.selectedValue > 0) {
				this.selectedValue--;
				this.render();
			} else if (key.name === 'down' && this.selectedValue + 1 < this.values.length) {
				this.selectedValue++;
				this.render();
			} else if (key.name === 'return') {
				this.close();
			} else if (key.name === 'escape' || (key.name === 'c' && key.ctrl)) {
				this.close(true);
			}
		}
	}
}

module.exports = Input;