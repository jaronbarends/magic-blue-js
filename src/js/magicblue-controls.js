import {MagicBlue} from './magicblue.js';

let bulb;
let isConnected = false;



/**
* init the connect btn
* @returns {undefined}
*/
const initButtons = function() {
	document.getElementById('btn--connect').addEventListener('click', async (e) => {
		e.preventDefault();
		isConnected = await bulb.connect();
		setConnectionStatus();
	})
	document.getElementById('btn--disconnect').addEventListener('click', (e) => {
		e.preventDefault();
		bulb.disconnect();
		isConnected = false;
		setConnectionStatus();
	})
};

/**
* get hex value of input by id
* @returns {undefined}
*/
const getValueById = function(id) {
	return parseFloat(document.getElementById(id).value);
};


/**
* set current connection status
* @returns {undefined}
*/
const setConnectionStatus = function() {
	if (isConnected) {
		document.getElementById(`btn--connect`).setAttribute('disabled', 'disabled');
		document.getElementById(`btn--disconnect`).removeAttribute('disabled');
		document.querySelector('form').classList.remove('is-disabled');
	} else {
		document.getElementById(`btn--connect`).removeAttribute('disabled');
		document.getElementById(`btn--disconnect`).setAttribute('disabled', 'disabled');
		document.querySelector('form').classList.add('is-disabled');
	}
};



/**
* change rgb value
* @returns {undefined}
*/
const setRGB = function(e) {
	let r = getValueById(`rgb-r`);
	let g = getValueById(`rgb-g`);
	let b = getValueById(`rgb-b`);
	bulb.setRGB(r, g, b);
};


/**
* set white level
* @returns {undefined}
*/
const setWhite = function(e) {
	const level = parseFloat(getValueById('white'));
	bulb.setWhite(level);
};


/**
* set fancy mode
* @returns {undefined}
*/
const setFancyMode = function(e) {
	const modeId = getValueById('mode');
	const speed = getValueById('mode-speed');
	bulb.setMode(modeId, speed);
};



/**
* init rgb sliders
* @returns {undefined}
*/
const initControls = function() {
	const onOff = document.getElementById(`on-off`);
	onOff.addEventListener('change', (e) => {
		const checked = e.target.checked;
		if (checked) {
			bulb.switchOn();
		} else {
			bulb.switchOff();
		}
	});
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
			output.textContent = e.target.value;
		});
	})
};




/**
* initialize all
* @param {string} varname Description
* @returns {undefined}
*/
const init = function() {
	bulb = new MagicBlue();
	initButtons();
	initControls();
};

// kick of the script when all dom content has loaded
document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', init) : init();
