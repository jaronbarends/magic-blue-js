;(() => {

	'use strict';

	// (optional) tell jshint about globals (they should remain commented out)
	/* globals someGlobalVar */ //Tell jshint someGlobalVar exists as global var

	let bulbDevice;
	let bulbChar;

	/**
	* connect to the bulb
	* @returns {undefined}
	*/
	const connect = function() {
		navigator.bluetooth.requestDevice({
			filters: [{
				services: [0xffe5]
			}]
		})
		.then((device) => {
			bulbDevice = device;
			return bulbDevice.gatt.connect();
		})
		.then((server) => {
			console.log('server');
			return server.getPrimaryService(0xffe5);
		})
		.then((service) => {
			console.log('service');
			return service.getCharacteristic(0xffe9);
		})
		.then((characteristic) => {
			bulbChar = characteristic;
			
			document.getElementById(`btn--connect`).setAttribute('disabled', 'disabled');
			document.getElementById(`btn--disconnect`).removeAttribute('disabled');
			// const data = new Uint8Array([0xbb, 0x25, 0x05, 0x44]);
			// const data = new Uint8Array([0x56, 0x00, 0x00, 0x00, 0xbb, 0x0f, 0xaa]);// white
			// const data = new Uint8Array([0x56, 0xcc, 0x00, 0xaa, 0x00, 0xf0, 0xaa]);// rgb
			// return characteristic.writeValue(data);
			// return bulbChar.writeValue(data);
		})
		.catch((error) => {
			console.log(`error!:`, error);
		})
	};


	/**
	* disconnect the bulb
	* @returns {undefined}
	*/
	const disconnect = function() {
		if (bulbDevice.gatt.connected) {
			bulbDevice.gatt.disconnect();
			document.getElementById(`btn--disconnect`).setAttribute('disabled', 'disabled');
			document.getElementById(`btn--connect`).removeAttribute('disabled');
		}
	};
	

	/**
	* init the connect btn
	* @returns {undefined}
	*/
	const initButtons = function() {
		document.getElementById('btn--connect').addEventListener('click', (e) => {
			e.preventDefault();
			connect();
		})
		document.getElementById('btn--disconnect').addEventListener('click', (e) => {
			e.preventDefault();
			disconnect();
		})
	};

	/**
	* get hex value of input by id
	* @returns {undefined}
	*/
	const getValueById = function(id) {
		return parseInt(document.getElementById(id).value);
		// return '0x' + document.getElementById(id).value.toString(16);
	};
	


	/**
	* change rgb value
	* @returns {undefined}
	*/
	const setRGB = function(e) {
		let r = getValueById(`rgb-r`);
		let g = getValueById(`rgb-g`);
		let b = getValueById(`rgb-b`);

		const data = new Uint8Array([0x56, r, g, b, 0xbb, 0xf0, 0xaa]);
		bulbChar.writeValue(data);
	};


	/**
	* set white level
	* @returns {undefined}
	*/
	const setWhite = function(e) {
		const w = getValueById('white');
		const data = new Uint8Array([0x56, 0x00, 0x00, 0x00, w, 0x0f, 0xaa]);
		bulbChar.writeValue(data);
	};


	/**
	* set fancy mode
	* @returns {undefined}
	*/
	const setFancyMode = function(e) {
		const md = getValueById('mode');
		const speed = getValueById('mode-speed');
		const data = new Uint8Array([0xbb, md, speed, 0x44]);
		// const data = new Uint8Array([0xbb, md, 0x05, 0x44]);
		console.log(data);
		bulbChar.writeValue(data);
	};
	
	

	/**
	* init rgb sliders
	* @returns {undefined}
	*/
	const initControls = function() {
		const rgbSliders = Array.from(document.querySelectorAll('[data-rgb-slider]'));
		rgbSliders.forEach((slider) => {
			slider.addEventListener('change', setRGB);
		});

		const whiteSlider = document.getElementById(`white`);
		whiteSlider.addEventListener('change', setWhite);

		const modeSelect = document.getElementById(`mode`);
		const modes = ['all color fade', 'red fade', 'green fade', 'blue fade', 'yellow fade', 'cyan blue fade', 'magenta fade', 'white fade', 'red-green fade', 'red-blue fade', 'blue-green fade', 'color flash', 'red flash', 'green flash', 'blue flash', 'yellow flash', 'cyan flash', 'magenta flash', 'white flash', 'color switch'];
		// values for mode: between 0x25 and 0x38
		modes.forEach((mode, i) => {
			const optElm = document.createElement('option');
			const md = i + 0x25;
			optElm.value = md;
			optElm.textContent = mode;
			modeSelect.appendChild(optElm);
		});
		modeSelect.addEventListener('change', setFancyMode);

		const speedSlider = document.getElementById(`mode-speed`);
		speedSlider.addEventListener('change', setFancyMode);

		const allSliders = Array.from(document.querySelectorAll(`input[type="range"]`));
		allSliders.forEach((slider) => {
			const output = document.getElementById(`${slider.id}-output`);
			slider.addEventListener('input', (e) => {
				let val = e.target.value;
				if (slider.id === 'mode-speed') {
					val = 200 * parseFloat(val) / 1000;
				}
				output.textContent = val;
			});
		})
	};
	
	
	


	/**
	* initialize all
	* @param {string} varname Description
	* @returns {undefined}
	*/
	const init = function() {
		initButtons();
		initControls();
	};

	// kick of the script when all dom content has loaded
	document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', init) : init();
})();
