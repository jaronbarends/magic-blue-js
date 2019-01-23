
const SERVICE_UUID = 0xffe5;
const CONTROL_CHARACTERISTIC_UUID = 0xffe9;

export class MagicBlue {
	constructor() {}

	/**
	* connect with the bulb
	* @returns {boolean}
	*/
	async connect() {
		try {
			this.device = await navigator.bluetooth.requestDevice({
				filters: [{
					services: [SERVICE_UUID]
				}]
			});
			const server = await this.device.gatt.connect();
			const service = await server.getPrimaryService(SERVICE_UUID);
			this.ctrlCharacteristic = await service.getCharacteristic(CONTROL_CHARACTERISTIC_UUID);
			return true;
		} catch(error) {
			console.log(`Something went wrong while connecting:`, error);
			return false;
		}
	}


	/**
	* disconnect the bulb
	* @returns {undefined}
	*/
	disconnect() {
		if (this.device.gatt.connected) {
			this.device.gatt.disconnect();
			this.ctrlCharacteristic = null;
		}
	};


	/**
	* write a value to the control characteristic
	* @param {Uint8Array} value - value to write
	* @returns {Promise}
	*/
	async writeValue(value) {
		return this.ctrlCharacteristic.writeValue(value);
	};


	/**
	* switch the bulb on
	* @returns {Promise}
	*/
	switchOn() {
		return this.writeValue(new Uint8Array([0xcc, 0x23, 0x33]));
	};


	/**
	* switch the bulb off
	* @returns {Promise}
	*/
	switchOff() {
		return this.writeValue(new Uint8Array([0xcc, 0x24, 0x33]));
	};


	/**
	* set an rgb value
	* @param {number} r - Red value 0-255
	* @param {number} g - Green value 0-255
	* @param {number} b - Blue value 0-255
	* @returns {Promise}
	*/
	setRGB(r, g, b) {
		const value = new Uint8Array([0x56, r, g, b, 0xbb, 0xf0, 0xaa]);
		return this.writeValue(value);
	};


	/**
	* set white level
	* @param {number} level - Brightness 0-255
	* @returns {Promise}
	*/
	setWhite(level) {
		const value = new Uint8Array([0x56, 0x00, 0x00, 0x00, level, 0x0f, 0xaa]);
		return this.writeValue(value);
	};


	/**
	* set preset mode
	* @param {number} modeId - number between 0x25 and 0x38 (37-56)
	* @param {number} speed - speed in seconds
	* @returns {Promise}
	*/
	setMode(modeId, speed) {
		const speedUnits = 1000 * speed / 200;// one speed unit is around 200 msec
		const value = new Uint8Array([0xbb, modeId, speedUnits, 0x44]);
		this.writeValue(value);
	};
	
}
