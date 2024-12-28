var gamesave_ResizingBytesQueue = $hxClasses["gamesave.ResizingBytesQueue"] = function(startWithBytes) {
	this.version = 0;
	this.bytes = startWithBytes != null ? startWithBytes : new haxe_io_Bytes(new ArrayBuffer(10));
	this.size = 0;
	this.readStart = 0;
	this.stringLocations = new haxe_ds_StringMap();
};
gamesave_ResizingBytesQueue.__name__ = "gamesave.ResizingBytesQueue";
gamesave_ResizingBytesQueue.fromBase64 = function(str) {
	var newQueue = new gamesave_ResizingBytesQueue();
	newQueue.bytes = haxe_crypto_Base64.decode(str);
	newQueue.size = newQueue.bytes.length;
	return newQueue;
};
gamesave_ResizingBytesQueue.fromData = function(data) {
	var newQueue = new gamesave_ResizingBytesQueue();
	newQueue.bytes = haxe_io_Bytes.ofData(data.buffer);
	newQueue.size = newQueue.bytes.length;
	return newQueue;
};
gamesave_ResizingBytesQueue.prototype = {
	addFloat: function(value) {
		if(this.size + 8 > this.bytes.length) {
			var oldBytes = this.bytes;
			this.bytes = new haxe_io_Bytes(new ArrayBuffer((this.size + 8) * 2));
			this.bytes.blit(0,oldBytes,0,this.size);
		}
		this.bytes.setDouble(this.size,value);
		this.size += 8;
	}
	,addInt: function(value) {
		if(this.size + 4 > this.bytes.length) {
			var oldBytes = this.bytes;
			this.bytes = new haxe_io_Bytes(new ArrayBuffer((this.size + 4) * 2));
			this.bytes.blit(0,oldBytes,0,this.size);
		}
		this.bytes.setInt32(this.size,value);
		this.size += 4;
	}
	,addByte: function(value) {
		if(this.size + 1 > this.bytes.length) {
			var oldBytes = this.bytes;
			this.bytes = new haxe_io_Bytes(new ArrayBuffer((this.size + 1) * 2));
			this.bytes.blit(0,oldBytes,0,this.size);
		}
		this.bytes.b[this.size] = value;
		this.size += 1;
	}
	,addBool: function(value) {
		if(this.size + 1 > this.bytes.length) {
			var oldBytes = this.bytes;
			this.bytes = new haxe_io_Bytes(new ArrayBuffer((this.size + 1) * 2));
			this.bytes.blit(0,oldBytes,0,this.size);
		}
		this.bytes.b[this.size] = value ? 1 : 0;
		this.size += 1;
	}
	,addString: function(str) {
		var stringLoc = this.stringLocations.h[str];
		if(stringLoc != null) {
			if(this.size + 1 > this.bytes.length) {
				var oldBytes = this.bytes;
				this.bytes = new haxe_io_Bytes(new ArrayBuffer((this.size + 1) * 2));
				this.bytes.blit(0,oldBytes,0,this.size);
			}
			this.bytes.b[this.size] = 1;
			this.size += 1;
			if(this.size + 4 > this.bytes.length) {
				var oldBytes = this.bytes;
				this.bytes = new haxe_io_Bytes(new ArrayBuffer((this.size + 4) * 2));
				this.bytes.blit(0,oldBytes,0,this.size);
			}
			this.bytes.setInt32(this.size,stringLoc);
			this.size += 4;
			return;
		}
		if(this.size + 1 > this.bytes.length) {
			var oldBytes = this.bytes;
			this.bytes = new haxe_io_Bytes(new ArrayBuffer((this.size + 1) * 2));
			this.bytes.blit(0,oldBytes,0,this.size);
		}
		this.bytes.b[this.size] = 0;
		this.size += 1;
		var addSizeAt = this.size;
		var strSize = str.length;
		var strSizeActual = 0;
		if(this.size + 4 > this.bytes.length) {
			var oldBytes = this.bytes;
			this.bytes = new haxe_io_Bytes(new ArrayBuffer((this.size + 4) * 2));
			this.bytes.blit(0,oldBytes,0,this.size);
		}
		this.bytes.setInt32(this.size,0);
		this.size += 4;
		var i = 0;
		var ebts = 0;
		while(i < str.length) {
			var c = str.charCodeAt(i++);
			if(55296 <= c && c <= 56319) {
				c = c - 55232 << 10 | str.charCodeAt(i++) & 1023;
				++ebts;
			}
			if(c <= 127) {
				if(this.size + 1 > this.bytes.length) {
					var oldBytes = this.bytes;
					this.bytes = new haxe_io_Bytes(new ArrayBuffer((this.size + 1) * 2));
					this.bytes.blit(0,oldBytes,0,this.size);
				}
				this.bytes.b[this.size] = c;
				this.size += 1;
				++strSizeActual;
			} else if(c <= 2047) {
				if(this.size + 1 > this.bytes.length) {
					var oldBytes1 = this.bytes;
					this.bytes = new haxe_io_Bytes(new ArrayBuffer((this.size + 1) * 2));
					this.bytes.blit(0,oldBytes1,0,this.size);
				}
				this.bytes.b[this.size] = 192 | c >> 6;
				this.size += 1;
				if(this.size + 1 > this.bytes.length) {
					var oldBytes2 = this.bytes;
					this.bytes = new haxe_io_Bytes(new ArrayBuffer((this.size + 1) * 2));
					this.bytes.blit(0,oldBytes2,0,this.size);
				}
				this.bytes.b[this.size] = 128 | c & 63;
				this.size += 1;
				++strSize;
				strSizeActual += 2;
			} else if(c <= 65535) {
				if(this.size + 1 > this.bytes.length) {
					var oldBytes3 = this.bytes;
					this.bytes = new haxe_io_Bytes(new ArrayBuffer((this.size + 1) * 2));
					this.bytes.blit(0,oldBytes3,0,this.size);
				}
				this.bytes.b[this.size] = 224 | c >> 12;
				this.size += 1;
				if(this.size + 1 > this.bytes.length) {
					var oldBytes4 = this.bytes;
					this.bytes = new haxe_io_Bytes(new ArrayBuffer((this.size + 1) * 2));
					this.bytes.blit(0,oldBytes4,0,this.size);
				}
				this.bytes.b[this.size] = 128 | c >> 6 & 63;
				this.size += 1;
				if(this.size + 1 > this.bytes.length) {
					var oldBytes5 = this.bytes;
					this.bytes = new haxe_io_Bytes(new ArrayBuffer((this.size + 1) * 2));
					this.bytes.blit(0,oldBytes5,0,this.size);
				}
				this.bytes.b[this.size] = 128 | c & 63;
				this.size += 1;
				strSize += 2;
				strSizeActual += 3;
			} else {
				if(this.size + 1 > this.bytes.length) {
					var oldBytes6 = this.bytes;
					this.bytes = new haxe_io_Bytes(new ArrayBuffer((this.size + 1) * 2));
					this.bytes.blit(0,oldBytes6,0,this.size);
				}
				this.bytes.b[this.size] = 240 | c >> 18;
				this.size += 1;
				if(this.size + 1 > this.bytes.length) {
					var oldBytes7 = this.bytes;
					this.bytes = new haxe_io_Bytes(new ArrayBuffer((this.size + 1) * 2));
					this.bytes.blit(0,oldBytes7,0,this.size);
				}
				this.bytes.b[this.size] = 128 | c >> 12 & 63;
				this.size += 1;
				if(this.size + 1 > this.bytes.length) {
					var oldBytes8 = this.bytes;
					this.bytes = new haxe_io_Bytes(new ArrayBuffer((this.size + 1) * 2));
					this.bytes.blit(0,oldBytes8,0,this.size);
				}
				this.bytes.b[this.size] = 128 | c >> 6 & 63;
				this.size += 1;
				if(this.size + 1 > this.bytes.length) {
					var oldBytes9 = this.bytes;
					this.bytes = new haxe_io_Bytes(new ArrayBuffer((this.size + 1) * 2));
					this.bytes.blit(0,oldBytes9,0,this.size);
				}
				this.bytes.b[this.size] = 128 | c & 63;
				this.size += 1;
				strSize += 3;
				strSizeActual += 4;
			}
		}
		this.stringLocations.h[str] = addSizeAt;
		this.bytes.setInt32(addSizeAt,strSizeActual);
	}
	,addRectangle: function(rect) {
		var value = rect.x;
		if(this.size + 4 > this.bytes.length) {
			var oldBytes = this.bytes;
			this.bytes = new haxe_io_Bytes(new ArrayBuffer((this.size + 4) * 2));
			this.bytes.blit(0,oldBytes,0,this.size);
		}
		this.bytes.setInt32(this.size,value);
		this.size += 4;
		var value = rect.y;
		if(this.size + 4 > this.bytes.length) {
			var oldBytes = this.bytes;
			this.bytes = new haxe_io_Bytes(new ArrayBuffer((this.size + 4) * 2));
			this.bytes.blit(0,oldBytes,0,this.size);
		}
		this.bytes.setInt32(this.size,value);
		this.size += 4;
		var value = rect.width;
		if(this.size + 4 > this.bytes.length) {
			var oldBytes = this.bytes;
			this.bytes = new haxe_io_Bytes(new ArrayBuffer((this.size + 4) * 2));
			this.bytes.blit(0,oldBytes,0,this.size);
		}
		this.bytes.setInt32(this.size,value);
		this.size += 4;
		var value = rect.height;
		if(this.size + 4 > this.bytes.length) {
			var oldBytes = this.bytes;
			this.bytes = new haxe_io_Bytes(new ArrayBuffer((this.size + 4) * 2));
			this.bytes.blit(0,oldBytes,0,this.size);
		}
		this.bytes.setInt32(this.size,value);
		this.size += 4;
	}
	,readRectangle: function() {
		var intToRead = this.bytes.getInt32(this.readStart);
		this.readStart += 4;
		var intToRead1 = this.bytes.getInt32(this.readStart);
		this.readStart += 4;
		var intToRead2 = this.bytes.getInt32(this.readStart);
		this.readStart += 4;
		var intToRead3 = this.bytes.getInt32(this.readStart);
		this.readStart += 4;
		return new common_Rectangle(intToRead,intToRead1,intToRead2,intToRead3);
	}
	,addFPoint: function(point) {
		var value = point.x;
		if(this.size + 8 > this.bytes.length) {
			var oldBytes = this.bytes;
			this.bytes = new haxe_io_Bytes(new ArrayBuffer((this.size + 8) * 2));
			this.bytes.blit(0,oldBytes,0,this.size);
		}
		this.bytes.setDouble(this.size,value);
		this.size += 8;
		var value = point.y;
		if(this.size + 8 > this.bytes.length) {
			var oldBytes = this.bytes;
			this.bytes = new haxe_io_Bytes(new ArrayBuffer((this.size + 8) * 2));
			this.bytes.blit(0,oldBytes,0,this.size);
		}
		this.bytes.setDouble(this.size,value);
		this.size += 8;
	}
	,addJSON: function(object) {
		this.addString(JSON.stringify(object));
	}
	,readJSON: function() {
		return JSON.parse(this.readString());
	}
	,readPoint: function() {
		var intToRead = this.bytes.getInt32(this.readStart);
		this.readStart += 4;
		var intToRead1 = this.bytes.getInt32(this.readStart);
		this.readStart += 4;
		return new common_Point(intToRead,intToRead1);
	}
	,readFPoint: function() {
		var floatToRead = this.bytes.getDouble(this.readStart);
		this.readStart += 8;
		var floatToRead1 = this.bytes.getDouble(this.readStart);
		this.readStart += 8;
		return new common_FPoint(floatToRead,floatToRead1);
	}
	,readString: function() {
		var byteToRead = this.bytes.b[this.readStart];
		this.readStart += 1;
		var whereToRead = byteToRead;
		if(whereToRead == 1) {
			var intToRead = this.bytes.getInt32(this.readStart);
			this.readStart += 4;
			var readPos = intToRead;
			var stringLength = this.bytes.getInt32(readPos);
			return this.bytes.getString(readPos + 4,stringLength);
		} else {
			var intToRead = this.bytes.getInt32(this.readStart);
			this.readStart += 4;
			var len = intToRead;
			var str = this.bytes.getString(this.readStart,len);
			this.readStart += len;
			return str;
		}
	}
	,readInt: function() {
		var intToRead = this.bytes.getInt32(this.readStart);
		this.readStart += 4;
		return intToRead;
	}
	,peekInt: function() {
		return this.bytes.getInt32(this.readStart);
	}
	,readByte: function() {
		var byteToRead = this.bytes.b[this.readStart];
		this.readStart += 1;
		return byteToRead;
	}
	,readBool: function() {
		var byteToRead = this.bytes.b[this.readStart];
		this.readStart += 1;
		return byteToRead > 0;
	}
	,readFloat: function() {
		var floatToRead = this.bytes.getDouble(this.readStart);
		this.readStart += 8;
		return floatToRead;
	}
	,toBase64: function() {
		var filledBytes = new haxe_io_Bytes(new ArrayBuffer(this.size));
		filledBytes.blit(0,this.bytes,0,this.size);
		return haxe_crypto_Base64.encode(filledBytes);
	}
	,getData: function() {
		var filledBytes = new haxe_io_Bytes(new ArrayBuffer(this.size));
		filledBytes.blit(0,this.bytes,0,this.size);
		return filledBytes.b;
	}
	,__class__: gamesave_ResizingBytesQueue
};
