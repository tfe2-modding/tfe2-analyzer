var Perf = $hxClasses["Perf"] = $hx_exports["Perf"] = function(pos,offset) {
	if(offset == null) {
		offset = 0;
	}
	if(pos == null) {
		pos = "TR";
	}
	this._perfObj = window.performance;
	if(Reflect.field(this._perfObj,"memory") != null) {
		this._memoryObj = Reflect.field(this._perfObj,"memory");
	}
	this._memCheck = this._perfObj != null && this._memoryObj != null && this._memoryObj.totalJSHeapSize > 0;
	this._pos = pos;
	this._offset = offset;
	this.currentFps = 60;
	this.currentMs = 0;
	this.currentMem = "0";
	this.lowFps = 60;
	this.avgFps = 60;
	this._measureCount = 0;
	this._totalFps = 0;
	this._time = 0;
	this._ticks = 0;
	this._fpsMin = 60;
	this._fpsMax = 60;
	this._startTime = this._perfObj != null && this._perfObj.now != null ? this._perfObj.now() : new Date().getTime();
	this._prevTime = -Perf.MEASUREMENT_INTERVAL;
	this._createFpsDom();
	this._createMsDom();
	if(this._memCheck) {
		this._createMemoryDom();
	}
	if(window.requestAnimationFrame != null) {
		this.RAF = ($_=window,$bind($_,$_.requestAnimationFrame));
	} else if(window.mozRequestAnimationFrame != null) {
		this.RAF = window.mozRequestAnimationFrame;
	} else if(window.webkitRequestAnimationFrame != null) {
		this.RAF = window.webkitRequestAnimationFrame;
	} else if(window.msRequestAnimationFrame != null) {
		this.RAF = window.msRequestAnimationFrame;
	}
	if(window.cancelAnimationFrame != null) {
		this.CAF = ($_=window,$bind($_,$_.cancelAnimationFrame));
	} else if(window.mozCancelAnimationFrame != null) {
		this.CAF = window.mozCancelAnimationFrame;
	} else if(window.webkitCancelAnimationFrame != null) {
		this.CAF = window.webkitCancelAnimationFrame;
	} else if(window.msCancelAnimationFrame != null) {
		this.CAF = window.msCancelAnimationFrame;
	}
	if(this.RAF != null) {
		var o = window;
		this._raf = this.RAF.apply(o,[$bind(this,this._tick)]);
	}
};
Perf.__name__ = "Perf";
Perf.prototype = {
	_init: function() {
		this.currentFps = 60;
		this.currentMs = 0;
		this.currentMem = "0";
		this.lowFps = 60;
		this.avgFps = 60;
		this._measureCount = 0;
		this._totalFps = 0;
		this._time = 0;
		this._ticks = 0;
		this._fpsMin = 60;
		this._fpsMax = 60;
		this._startTime = this._perfObj != null && this._perfObj.now != null ? this._perfObj.now() : new Date().getTime();
		this._prevTime = -Perf.MEASUREMENT_INTERVAL;
	}
	,_now: function() {
		if(this._perfObj != null && this._perfObj.now != null) {
			return this._perfObj.now();
		} else {
			return new Date().getTime();
		}
	}
	,_tick: function(val) {
		var time = this._perfObj != null && this._perfObj.now != null ? this._perfObj.now() : new Date().getTime();
		this._ticks++;
		if(this._raf != null && time > this._prevTime + Perf.MEASUREMENT_INTERVAL) {
			this.currentMs = Math.round(time - this._startTime);
			this.ms.innerHTML = "MS: " + this.currentMs;
			this.currentFps = Math.round(this._ticks * 1000 / (time - this._prevTime));
			if(this.currentFps > 0 && val > Perf.DELAY_TIME) {
				this._measureCount++;
				this._totalFps += this.currentFps;
				this.lowFps = this._fpsMin = Math.min(this._fpsMin,this.currentFps);
				this._fpsMax = Math.max(this._fpsMax,this.currentFps);
				this.avgFps = Math.round(this._totalFps / this._measureCount);
			}
			this.fps.innerHTML = "FPS: " + this.currentFps + " (" + this._fpsMin + "-" + this._fpsMax + ")";
			if(this.currentFps >= 30) {
				this.fps.style.backgroundColor = Perf.FPS_BG_CLR;
			} else if(this.currentFps >= 15) {
				this.fps.style.backgroundColor = Perf.FPS_WARN_BG_CLR;
			} else {
				this.fps.style.backgroundColor = Perf.FPS_PROB_BG_CLR;
			}
			this._prevTime = time;
			this._ticks = 0;
			if(this._memCheck) {
				this.currentMem = this._getFormattedSize(this._memoryObj.usedJSHeapSize,2);
				this.memory.innerHTML = "MEM: " + this.currentMem;
			}
		}
		this._startTime = time;
		if(this._raf != null) {
			var o = window;
			this._raf = this.RAF.apply(o,[$bind(this,this._tick)]);
		}
	}
	,_createDiv: function(id,top) {
		if(top == null) {
			top = 0;
		}
		var div = window.document.createElement("div");
		div.id = id;
		div.className = id;
		div.style.position = "absolute";
		switch(this._pos) {
		case "BL":
			div.style.left = this._offset + "px";
			div.style.bottom = (this._memCheck ? 48 : 32) - top + "px";
			break;
		case "BR":
			div.style.right = this._offset + "px";
			div.style.bottom = (this._memCheck ? 48 : 32) - top + "px";
			break;
		case "TL":
			div.style.left = this._offset + "px";
			div.style.top = top + "px";
			break;
		case "TR":
			div.style.right = this._offset + "px";
			div.style.top = top + "px";
			break;
		}
		div.style.width = "80px";
		div.style.height = "12px";
		div.style.lineHeight = "12px";
		div.style.padding = "2px";
		div.style.fontFamily = Perf.FONT_FAMILY;
		div.style.fontSize = "9px";
		div.style.fontWeight = "bold";
		div.style.textAlign = "center";
		window.document.body.appendChild(div);
		return div;
	}
	,_createFpsDom: function() {
		this.fps = this._createDiv("fps");
		this.fps.style.backgroundColor = Perf.FPS_BG_CLR;
		this.fps.style.zIndex = "995";
		this.fps.style.color = Perf.FPS_TXT_CLR;
		this.fps.innerHTML = "FPS: 0";
	}
	,_createMsDom: function() {
		this.ms = this._createDiv("ms",16);
		this.ms.style.backgroundColor = Perf.MS_BG_CLR;
		this.ms.style.zIndex = "996";
		this.ms.style.color = Perf.MS_TXT_CLR;
		this.ms.innerHTML = "MS: 0";
	}
	,_createMemoryDom: function() {
		this.memory = this._createDiv("memory",32);
		this.memory.style.backgroundColor = Perf.MEM_BG_CLR;
		this.memory.style.color = Perf.MEM_TXT_CLR;
		this.memory.style.zIndex = "997";
		this.memory.innerHTML = "MEM: 0";
	}
	,_getFormattedSize: function(bytes,frac) {
		if(frac == null) {
			frac = 0;
		}
		var sizes = ["Bytes","KB","MB","GB","TB"];
		if(bytes == 0) {
			return "0";
		}
		var precision = Math.pow(10,frac);
		var i = Math.floor(Math.log(bytes) / Math.log(1024));
		return Math.round(bytes * precision / Math.pow(1024,i)) / precision + " " + sizes[i];
	}
	,addInfo: function(val) {
		this.info = this._createDiv("info",this._memCheck ? 48 : 32);
		this.info.style.backgroundColor = Perf.INFO_BG_CLR;
		this.info.style.color = Perf.INFO_TXT_CLR;
		this.info.style.zIndex = "998";
		this.info.innerHTML = val;
	}
	,clearInfo: function() {
		if(this.info != null) {
			window.document.body.removeChild(this.info);
			this.info = null;
		}
	}
	,destroy: function() {
		var o = window;
		this.CAF.apply(o,[this._raf]);
		this._raf = null;
		this._perfObj = null;
		this._memoryObj = null;
		if(this.fps != null) {
			window.document.body.removeChild(this.fps);
			this.fps = null;
		}
		if(this.ms != null) {
			window.document.body.removeChild(this.ms);
			this.ms = null;
		}
		if(this.memory != null) {
			window.document.body.removeChild(this.memory);
			this.memory = null;
		}
		this.clearInfo();
		this.currentFps = 60;
		this.currentMs = 0;
		this.currentMem = "0";
		this.lowFps = 60;
		this.avgFps = 60;
		this._measureCount = 0;
		this._totalFps = 0;
		this._time = 0;
		this._ticks = 0;
		this._fpsMin = 60;
		this._fpsMax = 60;
		this._startTime = this._perfObj != null && this._perfObj.now != null ? this._perfObj.now() : new Date().getTime();
		this._prevTime = -Perf.MEASUREMENT_INTERVAL;
	}
	,_cancelRAF: function() {
		var o = window;
		this.CAF.apply(o,[this._raf]);
		this._raf = null;
	}
	,__class__: Perf
};
