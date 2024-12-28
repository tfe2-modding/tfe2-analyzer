var simulation_festival_FestivalManager = $hxClasses["simulation.festival.FestivalManager"] = function(city,simulation) {
	this.festivalCoolDown = 0;
	this.city = city;
	this.simulation = simulation;
	this.festivals = [];
	var _g = [];
	_g.push(false);
	_g.push(false);
	_g.push(false);
	_g.push(false);
	_g.push(false);
	_g.push(false);
	_g.push(false);
	this.wasFestivalOnDay = _g;
};
simulation_festival_FestivalManager.__name__ = "simulation.festival.FestivalManager";
simulation_festival_FestivalManager.prototype = {
	addFestival: function(festival) {
		this.festivals.push(festival);
	}
	,hasNoPlannedFestival: function() {
		return this.festivals.length == 0;
	}
	,plannedFestival: function() {
		var _g = 0;
		var _g1 = this.festivals;
		while(_g < _g1.length) {
			var festival = _g1[_g];
			++_g;
			if(!festival.started) {
				return festival;
			}
		}
		return null;
	}
	,hasFestival: function() {
		return common_ArrayExtensions.any(this.festivals,function(f) {
			return f.isNow();
		});
	}
	,updateFestivalCitizens: function(timeMod) {
		var _g = 0;
		var _g1 = this.festivals;
		while(_g < _g1.length) {
			var f = _g1[_g];
			++_g;
			var _g2 = 0;
			var _g3 = this.simulation.citizens;
			while(_g2 < _g3.length) {
				var citizen = _g3[_g2];
				++_g2;
				f.updateFestivalCitizen(citizen,timeMod);
			}
		}
	}
	,currentFestival: function() {
		var _g = 0;
		var _g1 = this.festivals;
		while(_g < _g1.length) {
			var festival = _g1[_g];
			++_g;
			if(festival.isNow()) {
				return festival;
			}
		}
		return null;
	}
	,update: function(timeMod) {
		var curr = this.currentFestival();
		if(curr != null) {
			curr.update(timeMod);
			this.wasFestivalOnDay[0] = true;
		}
		if(this.festivalCoolDown > -1) {
			this.festivalCoolDown -= timeMod * this.city.simulation.time.minutesPerTick;
		}
	}
	,endFestival: function(fest) {
		HxOverrides.remove(this.festivals,fest);
	}
	,save: function(queue) {
		var value = this.festivals.length;
		if(queue.size + 4 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setInt32(queue.size,value);
		queue.size += 4;
		var _g = 0;
		var _g1 = this.festivals;
		while(_g < _g1.length) {
			var festival = _g1[_g];
			++_g;
			var c = js_Boot.getClass(festival);
			queue.addString(c.__name__);
			var value = festival.centerBuilding.id;
			if(queue.size + 4 > queue.bytes.length) {
				var oldBytes = queue.bytes;
				queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
				queue.bytes.blit(0,oldBytes,0,queue.size);
			}
			queue.bytes.setInt32(queue.size,value);
			queue.size += 4;
			festival.save(queue);
		}
		var value = this.wasFestivalOnDay.length;
		if(queue.size + 4 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setInt32(queue.size,value);
		queue.size += 4;
		var _g = 0;
		var _g1 = this.wasFestivalOnDay.length;
		while(_g < _g1) {
			var i = _g++;
			var value = this.wasFestivalOnDay[i];
			if(queue.size + 1 > queue.bytes.length) {
				var oldBytes = queue.bytes;
				queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 1) * 2));
				queue.bytes.blit(0,oldBytes,0,queue.size);
			}
			queue.bytes.b[queue.size] = value ? 1 : 0;
			queue.size += 1;
		}
		var value = this.festivalCoolDown;
		if(queue.size + 8 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 8) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setDouble(queue.size,value);
		queue.size += 8;
	}
	,load: function(queue) {
		var intToRead = queue.bytes.getInt32(queue.readStart);
		queue.readStart += 4;
		var len = intToRead;
		var _g = 0;
		var _g1 = len;
		while(_g < _g1) {
			var i = _g++;
			var className = queue.readString();
			var intToRead = queue.bytes.getInt32(queue.readStart);
			queue.readStart += 4;
			var centerBuilding = intToRead;
			var fes = Type.createInstance($hxClasses[className],[this.city,this.simulation,this,this.city.findPermanentByID(centerBuilding)]);
			fes.load(queue);
			this.festivals.push(fes);
		}
		if(queue.version >= 28) {
			var intToRead = queue.bytes.getInt32(queue.readStart);
			queue.readStart += 4;
			var fesLen = intToRead;
			var _g = 0;
			var _g1 = fesLen;
			while(_g < _g1) {
				var i = _g++;
				var byteToRead = queue.bytes.b[queue.readStart];
				queue.readStart += 1;
				this.wasFestivalOnDay[i] = byteToRead > 0;
			}
		}
		if(queue.version >= 30) {
			var floatToRead = queue.bytes.getDouble(queue.readStart);
			queue.readStart += 8;
			this.festivalCoolDown = floatToRead;
		}
	}
	,afterLoad: function() {
		var _g = 0;
		var _g1 = this.festivals;
		while(_g < _g1.length) {
			var fes = _g1[_g];
			++_g;
			if(fes.started) {
				fes.doStartRepeatables();
			}
		}
	}
	,__class__: simulation_festival_FestivalManager
};
