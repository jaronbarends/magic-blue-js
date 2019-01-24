const WebBluetooth = (function() {

	'use strict';

	class WebBluetooth {
		constructor() {
			this.device = null;
			this.gattServer = null;
			this.service = null;
			this._characteristics = new Map();
		}

		
		/**
		* connect with a peripheral device
		* @param {number} serviceUuid - The uuid of the device's service we want to target
		* @returns {boolean}
		*/
		async connect(serviceUuid=null) {
			let options = {
				acceptAllDevices: true
			}
			if (serviceUuid) {
				options = {
					filters: [{
						services: [serviceUuid]
					}]
				}
			}

			try {
				this.device = await navigator.bluetooth.requestDevice(options);
				this.gattServer = await this.device.gatt.connect();
				this.service = await this.gattServer.getPrimaryService(serviceUuid);
				console.log('connect: done...');
				return true;
			} catch(error) {
				console.log(`Something went wrong while connecting:`, error);
				return false;
			}
		}


		/**
		* disconnect the device
		* @returns {undefined}
		*/
		disconnect() {
			if (this.isConnected()) {
				this.device.gatt.disconnect();
			}
		};


		/**
		* check if device is connected
		* @returns {undefined}
		*/
		isConnected() {
			return this.device && this.device.gatt.connected;
		};


		/**
		* get a characteristic from the device
		* @returns {undefined}
		*/
		async _getCharacteristic(characteristicUuid) {
			if (!this.isConnected()) {
				throw new Error('Device not connected');
			}

			// check if we've already got this characteristic
			let characteristic = this._characteristics.get(characteristicUuid);
			if (typeof characteristic === 'undefined') {
				// this characteristic hasn't been requested yet
				characteristic = await this.service.getCharacteristic(characteristicUuid);
				// cache for later use
				this._characteristics.set(characteristicUuid, characteristic);
			}
			return characteristic;
		};


		/**
		* write a value to a characteristic
		* @returns {undefined}
		*/
		async writeValue(characteristicUuid, value) {
			const characteristic = await this._getCharacteristic(characteristicUuid);
			return characteristic.writeValue(value);
		};


	}

	return WebBluetooth;

})();