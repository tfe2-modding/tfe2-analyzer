var miscCityElements_MiscCityElements = $hxClasses["miscCityElements.MiscCityElements"] = function(city) {
	this.city = city;
	this.allMiscElements = [];
	this.miscElementsByXPos = new haxe_ds_IntMap();
};
miscCityElements_MiscCityElements.__name__ = "miscCityElements.MiscCityElements";
miscCityElements_MiscCityElements.prototype = {
	addElement: function(elem) {
		this.allMiscElements.push(elem);
		var _g = 0;
		var _g1 = Math.floor(elem.rect.width / 20);
		while(_g < _g1) {
			var xx = _g++;
			var xxx = Math.floor(elem.rect.x / 20) + xx;
			if(this.miscElementsByXPos.h[xxx] == null) {
				var this1 = this.miscElementsByXPos;
				var v = [];
				this1.h[xxx] = v;
			}
			this.miscElementsByXPos.h[xxx].push(elem);
		}
		elem.postCreate();
	}
	,update: function(timeMod) {
		var _g = 0;
		var _g1 = this.allMiscElements;
		while(_g < _g1.length) {
			var miscCityElement = _g1[_g];
			++_g;
			miscCityElement.update(timeMod);
		}
	}
	,onCityChange: function() {
		var _g = 0;
		var _g1 = this.allMiscElements;
		while(_g < _g1.length) {
			var miscCityElement = _g1[_g];
			++_g;
			miscCityElement.onCityChange();
		}
		var _g = 0;
		var _g1 = this.allMiscElements;
		while(_g < _g1.length) {
			var miscCityElement = _g1[_g];
			++_g;
			miscCityElement.onCityChangeStage2();
		}
	}
	,changeElementPos: function(elem,newPos) {
		var _g = 0;
		var _g1 = Math.floor(elem.rect.width / 20);
		while(_g < _g1) {
			var xx = _g++;
			var xxx = Math.floor(elem.rect.x / 20) + xx;
			if(this.miscElementsByXPos.h[xxx] != null) {
				HxOverrides.remove(this.miscElementsByXPos.h[xxx],elem);
			}
		}
		elem.rect.set(newPos);
		var _g = 0;
		var _g1 = Math.floor(elem.rect.width / 20);
		while(_g < _g1) {
			var xx = _g++;
			var xxx = Math.floor(elem.rect.x / 20) + xx;
			if(this.miscElementsByXPos.h[xxx] == null) {
				var this1 = this.miscElementsByXPos;
				var v = [];
				this1.h[xxx] = v;
			}
			this.miscElementsByXPos.h[xxx].push(elem);
		}
	}
	,destroyElement: function(elem) {
		var _g = 0;
		var _g1 = Math.floor(elem.rect.width / 20);
		while(_g < _g1) {
			var xx = _g++;
			var xxx = Math.floor(elem.rect.x / 20) + xx;
			HxOverrides.remove(this.miscElementsByXPos.h[xxx],elem);
		}
		HxOverrides.remove(this.allMiscElements,elem);
	}
	,handleMouse: function(mouse) {
		var this1 = this.miscElementsByXPos;
		var key = Math.floor(mouse.get_cityX() / 20);
		var miscElements = this1.h[key];
		if(miscElements == null) {
			return false;
		}
		var elem = Lambda.find(miscElements,function(elem) {
			if(mouse.get_cityY() >= elem.rect.y) {
				return mouse.get_cityY() < elem.rect.get_y2();
			} else {
				return false;
			}
		});
		if(elem != null) {
			switch(mouse.claimMouse(elem,null,false)._hx_index) {
			case 0:
				elem.onHover(true);
				break;
			case 1:
				elem.onClick();
				break;
			case 2:
				elem.onHover(false);
				break;
			}
			return true;
		}
		return false;
	}
	,isUnbuildable: function(point,canResizeBridge) {
		var elemsHere = this.miscElementsByXPos.h[Math.floor(point.x / 20)];
		if(elemsHere == null) {
			return false;
		}
		var _g = 0;
		while(_g < elemsHere.length) {
			var el = elemsHere[_g];
			++_g;
			if(point.y >= el.rect.y && point.y < el.rect.get_y2()) {
				if(!canResizeBridge) {
					return true;
				} else if(el.is(miscCityElements_Bridge)) {
					if(el.rect.width <= 20 || point.x != el.rect.x && point.x != el.rect.get_x2() - 20) {
						return true;
					}
				} else {
					return true;
				}
			}
		}
		return false;
	}
	,collidesSpecific: function(point,elem) {
		var elemsHere = this.miscElementsByXPos.h[Math.floor(point.x / 20)];
		if(elemsHere == null) {
			return false;
		}
		return common_ArrayExtensions.any(elemsHere,function(el) {
			if(point.y >= el.rect.y && point.y < el.rect.get_y2()) {
				return js_Boot.__instanceof(el,elem);
			} else {
				return false;
			}
		});
	}
	,findSpecific: function(point,elem) {
		var elemsHere = this.miscElementsByXPos.h[Math.floor(point.x / 20)];
		if(elemsHere == null) {
			return null;
		}
		return Lambda.find(elemsHere,function(el) {
			if(point.y >= el.rect.y && point.y < el.rect.get_y2()) {
				return js_Boot.__instanceof(el,elem);
			} else {
				return false;
			}
		});
	}
	,collidesAll: function(point) {
		var elemsHere = this.miscElementsByXPos.h[Math.floor(point.x / 20)];
		if(elemsHere == null) {
			return [];
		}
		var _g = [];
		var _g1 = 0;
		var _g2 = elemsHere;
		while(_g1 < _g2.length) {
			var v = _g2[_g1];
			++_g1;
			if(point.y >= v.rect.y && point.y < v.rect.get_y2()) {
				_g.push(v);
			}
		}
		var elems = _g;
		return elems;
	}
	,save: function(queue) {
		var value = this.allMiscElements.length;
		if(queue.size + 4 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setInt32(queue.size,value);
		queue.size += 4;
		var _g = 0;
		var _g1 = this.allMiscElements;
		while(_g < _g1.length) {
			var cityElem = _g1[_g];
			++_g;
			var c = js_Boot.getClass(cityElem);
			queue.addString(c.__name__);
			cityElem.save(queue);
		}
	}
	,load: function(queue) {
		if(queue.version >= 43) {
			var intToRead = queue.bytes.getInt32(queue.readStart);
			queue.readStart += 4;
			var num = intToRead;
			var _g = 0;
			var _g1 = num;
			while(_g < _g1) {
				var i = _g++;
				var className = queue.readString();
				var msc = Reflect.field($hxClasses[className],"instantiateFromSave").apply(this,[this.city,queue]);
				this.addElement(msc);
			}
		}
	}
	,__class__: miscCityElements_MiscCityElements
};
