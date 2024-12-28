var cityUpgrades_CityUpgrades = $hxClasses["cityUpgrades.CityUpgrades"] = function(city) {
	this.city = city;
	this.upgrades = [];
	this.vars = new cityUpgrades_UpgradeVars();
};
cityUpgrades_CityUpgrades.__name__ = "cityUpgrades.CityUpgrades";
cityUpgrades_CityUpgrades.prototype = {
	addUpgrade: function(upgrade) {
		this.upgrades.push(upgrade);
		upgrade.addToCity(this.city);
	}
	,hasUpgrade: function(upgrade) {
		return common_ArrayExtensions.any(this.upgrades,function(u) {
			return js_Boot.__instanceof(u,upgrade);
		});
	}
	,saveForCitySwitch: function() {
		var upgradesSaved = [];
		var _g = 0;
		var _g1 = this.upgrades;
		while(_g < _g1.length) {
			var upgrade = _g1[_g];
			++_g;
			var c = js_Boot.getClass(upgrade);
			upgradesSaved.push(c.__name__);
		}
		return upgradesSaved;
	}
	,loadFromCitySwitch: function(upgradesSaved) {
		var _g = 0;
		while(_g < upgradesSaved.length) {
			var upgrade = upgradesSaved[_g];
			++_g;
			var tpe = [$hxClasses[upgrade]];
			if(!common_ArrayExtensions.any(this.upgrades,(function(tpe) {
				return function(u) {
					return js_Boot.getClass(u) == tpe[0];
				};
			})(tpe))) {
				var upg = Type.createInstance(tpe[0],[]);
				this.addUpgrade(upg);
			}
		}
	}
	,save: function(queue) {
		var value = this.upgrades.length;
		if(queue.size + 4 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setInt32(queue.size,value);
		queue.size += 4;
		var _g = 0;
		var _g1 = this.upgrades;
		while(_g < _g1.length) {
			var upgrade = _g1[_g];
			++_g;
			var c = js_Boot.getClass(upgrade);
			queue.addString(c.__name__);
			upgrade.save(queue);
		}
	}
	,load: function(queue) {
		var intToRead = queue.bytes.getInt32(queue.readStart);
		queue.readStart += 4;
		var len = intToRead;
		var _g = 0;
		var _g1 = len;
		while(_g < _g1) {
			var i = _g++;
			var name = queue.readString();
			var cl = $hxClasses[name];
			if(cl == null) {
				console.log("FloatingSpaceCities/cityUpgrades/CityUpgrades.hx:65:","Skip city upgrade that couldn't be found");
				var def = queue.readString();
				if(def != "") {
					throw haxe_Exception.thrown("Fatally failed loading");
				}
				continue;
			}
			var upg = Type.createInstance(cl,[]);
			upg.load(queue);
			this.addUpgrade(upg);
			if(queue.version <= 11) {
				if(((upg) instanceof cityUpgrades_SlimyLiving)) {
					var _g2 = 0;
					var _g3 = this.city.permanents;
					while(_g2 < _g3.length) {
						var pm = _g3[_g2];
						++_g2;
						if(pm.is(buildings_AlienHouse)) {
							var buildingToUpgrade = pm;
							if(!common_ArrayExtensions.any(buildingToUpgrade.upgrades,function(bu) {
								return ((bu) instanceof buildingUpgrades_LivingComputer);
							})) {
								buildingToUpgrade.upgrades.push(Type.createInstance(buildingUpgrades_LivingComputer,[buildingToUpgrade.stage,this.city.cityMidStage,buildingToUpgrade.bgStage,buildingToUpgrade]));
							}
						}
					}
				}
			}
		}
	}
	,getCurrentCost: function(info) {
		var mats = Materials.fromCityUpgradesInfo(info);
		if(StringTools.startsWith(info.className,"BuildingRecycling") && this.city.simulation.bonuses.chosenEarlyGameUpgrades.indexOf("recyclingDrive") != -1) {
			mats.knowledge = Math.floor(mats.knowledge * 0.75);
		}
		return mats;
	}
	,__class__: cityUpgrades_CityUpgrades
};
