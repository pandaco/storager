(function(A) {
	if (A.hasOwnProperty('Storager')) {
		throw '`Storager` property already exists in this object `' + A + '`';
	}

	/**
	 * Storager constructor
	 *
	 * @param object config [optionnal]
	 *     object config.storage  localStorage | sessionStorage [default=localStorage]
	 *     string config.prefix                                 [default='']
	 *     int    config.lifetime seconds                       [default=0]
	 * @returns {A.Storager}
	 */
	A.Storager = function(config) {
		this.storage = localStorage;
		this.prefix  = '';
		this.lifetime  = 0;

		if (typeof config === 'object') {
			if (config.hasOwnProperty('storage')) {
				this.storage = config.storage;
			}
			if (config.hasOwnProperty('prefix')) {
				this.prefix = config.prefix;
			}
			if (config.hasOwnProperty('lifetime')) {
				this.lifetime = config.lifetime;
			}
		}
	};

	/**
	 *
	 * @param key
	 * @returns string
	 */
	A.Storager.prototype.get = function(key) {
		return this.getObject(key).value;
	};

	/**
	 *
	 * @param key
	 * @returns string
	 */
	A.Storager.prototype.getObject = function(key) {
		return JSON.parse(this.storage.getItem(this.prefix + key));
	};

	/**
	 *
	 * @param key
	 * @param value
	 */
	A.Storager.prototype.set = function(key, value) {
		var data = {
			timestamp: (new Date()).getTime(),
			value:     value,
			prefix:    this.prefix
		};
		this.storage.setItem(this.prefix + key, JSON.stringify(data));
	};

	/**
	 *
	 * @param index
	 * @returns
	 */
	A.Storager.prototype.getItemAt = function(index) {
		return this.getObjectAt(index).value;
	};

	/**
	 *
	 * @param index
	 * @returns {___anonymous1770_1771}
	 */
	A.Storager.prototype.getObjectAt = function(index) {
		var object;
		try {
			object = JSON.parse(this.storage.getItem(this.storage.key(index)));
		} catch (exception) {
			object = {};
		}
		return object;
	};

	/**
	 *
	 * @returns {Number}
	 */
	A.Storager.prototype.size = function() {
		var size= 0;
		for (var i = 0, globalLength = this.storage.length; i < globalLength; ++i) {
			if (this.getObjectAt(i).prefix === this.prefix) {
				++size;
			}
		}
		return size;
	};

	/**
	 *
	 * @returns {Number}
	 */
	A.Storager.prototype.clearlifetimed = function() {
		var currentTimestamp = (new Date()).getTime();
		var count            = 0;

		for (var i = this.storage.length - 1; i >=0; --i) {
			var object = this.getObjectAt(i);
			if (object.hasOwnProperty('prefix') && object.prefix === this.prefix
				&& this.lifetime > 0
				&& object.hasOwnProperty('timestamp') && currentTimestamp - object.timestamp > this.lifetime
			) {
				this.storage.removeItem(this.storage.key(i));
				++count;
			}
		}

		return count;
	};

	/**
	 *
	 * @returns {Number}
	 */
	A.Storager.prototype.clear = function() {
		var count = 0;

		for (var i = this.storage.length - 1; i >= 0; --i) {
			var object = this.getObjectAt(i);
			if (object.hasOwnProperty('prefix') && object.prefix === this.prefix) {
				this.storage.removeItem(this.storage.key(i));
				++count;
			}
		}

		return count;
	};
})(window);