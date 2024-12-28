var worldResources_AlienRuins = $hxClasses["worldResources.AlienRuins"] = function(game,id,city,world,position,worldPosition,stage,spriteName) {
	this.standingPlaces = [];
	this.bonusWoodGiven = 0;
	this.bonusStoneGiven = 0;
	this.spriteName = "";
	this.bonusesAwarded = 0;
	this.explored = 0;
	this.spriteName = spriteName == null ? random_Random.fromArray(["spr_alienruins","spr_alienruins_2"]) : spriteName;
	WorldResource.call(this,game,id,city,world,position,worldPosition,stage,Resources.getTexture(this.spriteName));
	this.standingPlaces = [2,3,8,9,10,15,16];
	this.bonusesAwarded = 0;
	this.myAwardedBonuses = [];
};
worldResources_AlienRuins.__name__ = "worldResources.AlienRuins";
worldResources_AlienRuins.__super__ = WorldResource;
worldResources_AlienRuins.prototype = $extend(WorldResource.prototype,{
	get_name: function() {
		return common_Localize.lo("alien_ruins");
	}
	,get_climbX: function() {
		if(this.spriteName == "spr_alienruins") {
			return 9;
		} else {
			return 15;
		}
	}
	,get_climbY: function() {
		if(this.spriteName == "spr_alienruins") {
			return 17;
		} else {
			return 16;
		}
	}
	,getBonuses: function(bonusNumber) {
		var _gthis = this;
		var createBonus = function(name,description,onGet) {
			return { name : name, description : description, onGet : onGet};
		};
		var createMatBonus = function(name,description,mat) {
			return { name : name, description : description, onGet : function() {
				_gthis.city.materials.add(mat);
				mat.addToProduction(_gthis.city.simulation.stats);
			}};
		};
		switch(bonusNumber) {
		case 0:
			return [createMatBonus(common_Localize.lo("alien_ruins_find_1a"),this.city.progress.ruleset == progress_Ruleset.HippieCity ? common_Localize.lo("alien_ruins_description_1a_h") : common_Localize.lo("alien_ruins_description_1a"),this.city.progress.ruleset == progress_Ruleset.HippieCity ? new Materials(0,0,0,0,20) : new Materials(20)),createMatBonus(common_Localize.lo("alien_ruins_find_1b"),common_Localize.lo("alien_ruins_description_1b"),new Materials(0,25)),createMatBonus(common_Localize.lo("alien_ruins_find_1c"),common_Localize.lo("alien_ruins_description_1c"),new Materials(0,22)),createMatBonus(common_Localize.lo("alien_ruins_find_1d"),common_Localize.lo("alien_ruins_description_1d"),new Materials(0,0,12,5))];
		case 1:
			return [createMatBonus(common_Localize.lo("alien_ruins_find_2a"),common_Localize.lo("alien_ruins_description_2a"),new Materials(40)),createMatBonus(common_Localize.lo("alien_ruins_find_2b"),common_Localize.lo("alien_ruins_description_2b"),new Materials(0,35)),createMatBonus(common_Localize.lo("alien_ruins_find_2c"),common_Localize.lo("alien_ruins_description_2c"),new Materials(0,0,0,20)),createMatBonus(common_Localize.lo("alien_ruins_find_2d"),common_Localize.lo("alien_ruins_description_2d"),new Materials(0,0,42,0))];
		case 2:
			return [createMatBonus(common_Localize.lo("alien_ruins_find_3a"),common_Localize.lo("alien_ruins_description_3a"),new Materials(10,0,0,5)),createMatBonus(common_Localize.lo("alien_ruins_find_3b"),common_Localize.lo("alien_ruins_description_3b"),new Materials(17)),createMatBonus(common_Localize.lo("alien_ruins_find_3c"),common_Localize.lo("alien_ruins_description_3c"),new Materials(0,15)),createMatBonus(common_Localize.lo("alien_ruins_find_3d"),common_Localize.lo("alien_ruins_description_3d"),new Materials(0,0,22))];
		case 3:
			return [createBonus(common_Localize.lo("alien_ruins_find_4a"),common_Localize.lo("alien_ruins_description_4a"),function() {
				_gthis.city.simulation.bonuses.extraFoodFromFarms += 5;
			}),createBonus(common_Localize.lo("alien_ruins_find_4b"),common_Localize.lo("alien_ruins_description_4b"),function() {
				_gthis.city.progress.unlocks.unlock(buildings_AlienHouse);
				_gthis.city.progress.unlocks.unlock(cityUpgrades_SlimyLiving);
			}),createBonus(common_Localize.lo("alien_ruins_find_4c"),common_Localize.lo("alien_ruins_description_4c"),function() {
				_gthis.city.simulation.bonuses.machinePartsFactorySpeed *= 1.1;
			}),createBonus(common_Localize.lo("alien_ruins_find_4d"),common_Localize.lo("alien_ruins_description_4d"),function() {
				_gthis.city.simulation.bonuses.labSpeed *= 1.05;
			})];
		default:
			return [];
		}
	}
	,addWindowInfoLines: function() {
		var _gthis = this;
		WorldResource.prototype.addWindowInfoLines.call(this);
		var gui = this.city.gui;
		var $window = gui.windowInner;
		gui.windowAddInfoText(null,function() {
			return common_Localize.lo("n_pct_explored",[_gthis.explored | 0]);
		});
		$window.addChild(new gui_TextElement($window,gui.innerWindowStage,common_Localize.lo("findings"),null,"Arial15",{ left : 0, right : 0, top : 3, bottom : 0}));
		if(this.myAwardedBonuses.length == 0) {
			if(this.bonusStoneGiven == 0 && this.bonusWoodGiven == 0) {
				gui.windowAddInfoText(common_Localize.lo("exploration_nothing_found"));
			}
		} else {
			var _g = 0;
			var _g1 = this.myAwardedBonuses;
			while(_g < _g1.length) {
				var bonus = _g1[_g];
				++_g;
				gui.windowAddInfoText("" + bonus.name + ": " + bonus.description);
			}
		}
		if(this.bonusStoneGiven > 0 || this.bonusWoodGiven > 0) {
			gui.windowAddInfoText(null,function() {
				return common_Localize.lo("careful_ruins_stone_wood",[_gthis.bonusStoneGiven,_gthis.bonusWoodGiven]);
			});
		}
	}
	,createMoveWindow: function() {
		var _gthis = this;
		this.city.createWorldResourceBuilderMove(this);
		this.city.gui.showSimpleWindow(common_Localize.lo("move_ruins_howto"),null,true);
		this.city.gui.setWindowPositioning(gui_WindowPosition.Top);
		this.selectedSprite = Resources.makeSprite("spr_selectedbuilding");
		this.selectedSprite.position.set(this.position.x - 1,this.position.y - 1);
		this.city.farForegroundStage.addChild(this.selectedSprite);
		this.city.gui.windowOnDestroy = function() {
			var tmp;
			if(_gthis.city.builder != null) {
				var _g = _gthis.city.builder.builderType;
				if(_g._hx_index == 3) {
					var _g1 = _g.worldResource;
					tmp = true;
				} else {
					tmp = false;
				}
			} else {
				tmp = false;
			}
			if(tmp) {
				_gthis.city.builder.cancel();
			}
			if(_gthis.selectedSprite != null) {
				_gthis.selectedSprite.destroy();
				_gthis.selectedSprite = null;
			}
		};
		this.city.gui.windowOnLateUpdate = function() {
			var tmp;
			if(_gthis.city.builder != null) {
				var _g = _gthis.city.builder.builderType;
				if(_g._hx_index == 3) {
					var _g1 = _g.worldResource;
					tmp = false;
				} else {
					tmp = true;
				}
			} else {
				tmp = true;
			}
			if(tmp) {
				_gthis.city.gui.closeWindow();
			}
		};
		this.city.gui.addWindowToStack($bind(this,this.createMoveWindow));
	}
	,createWindowAddBottomButtons: function() {
		var _gthis = this;
		if(this.explored >= 100) {
			this.city.gui.windowAddBottomButtons([{ text : common_Localize.lo("move"), action : function() {
				_gthis.createMoveWindow();
			}}]);
		} else {
			this.city.gui.windowAddBottomButtons();
		}
	}
	,awardAnyBonuses: function() {
		if(this.bonusesAwarded < ((this.explored | 0) / 25 | 0) && this.explored >= 25 * (this.bonusesAwarded + 1)) {
			var newBonus;
			var possibleBonuses = this.getBonuses(this.bonusesAwarded);
			var _g = [];
			var _g1 = 0;
			var _g2 = possibleBonuses;
			while(_g1 < _g2.length) {
				var v = _g2[_g1];
				++_g1;
				if(worldResources_AlienRuins.alreadyFoundBonuses.indexOf(v.name) == -1) {
					_g.push(v);
				}
			}
			possibleBonuses = Lambda.array(_g);
			if(possibleBonuses.length > 0) {
				newBonus = random_Random.fromArray(possibleBonuses);
				var alienHousingBonus = Lambda.find(possibleBonuses,function(pb) {
					return pb.name == common_Localize.lo("alien_ruins_find_4b");
				});
				if(Lambda.count(this.city.permanents,function(pm) {
					return pm.is(worldResources_AlienRuins);
				}) < 4 && alienHousingBonus != null) {
					newBonus = alienHousingBonus;
				}
				newBonus.onGet();
				this.myAwardedBonuses.push(newBonus);
				worldResources_AlienRuins.alreadyFoundBonuses.push(newBonus.name);
				if(this.city.gui.windowRelatedTo == this) {
					this.reloadWindow();
				} else {
					this.createBonusWindow(newBonus);
				}
			}
			this.bonusesAwarded += 1;
		}
	}
	,createBonusWindow: function(newBonus) {
		if(this.city.gui.notificationPanel == null || this.city.gui.currentNotificationRelatedTo == worldResources_AlienRuins) {
			this.city.gui.removeNotifyPanel();
			this.city.gui.notifyInPanel(common_Localize.lo("alien_ruins_exploration_update"),newBonus.description,worldResources_AlienRuins);
			this.city.gui.setNotificationPanelTimeout(1200);
		}
	}
	,save: function(queue,shouldSaveDefinition) {
		if(shouldSaveDefinition == null) {
			shouldSaveDefinition = false;
		}
		WorldResource.prototype.save.call(this,queue);
		this.saveBasics(queue);
		var value = this.myAwardedBonuses.length;
		if(queue.size + 4 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setInt32(queue.size,value);
		queue.size += 4;
		var _g = 0;
		var _g1 = this.myAwardedBonuses;
		while(_g < _g1.length) {
			var awardedBonus = _g1[_g];
			++_g;
			queue.addString(awardedBonus.name);
			queue.addString(awardedBonus.description);
		}
	}
	,load: function(queue,definition) {
		WorldResource.prototype.load.call(this,queue);
		this.loadBasics(queue);
		var intToRead = queue.bytes.getInt32(queue.readStart);
		queue.readStart += 4;
		var len = intToRead;
		var _g = 0;
		var _g1 = len;
		while(_g < _g1) {
			var i = _g++;
			var bonus = { name : queue.readString(), description : queue.readString()};
			this.myAwardedBonuses.push(bonus);
			worldResources_AlienRuins.alreadyFoundBonuses.push(bonus.name);
		}
	}
	,postLoad: function() {
		this.sprite.texture = Resources.getTexture(this.spriteName);
	}
	,saveBasics: function(queue,shouldSaveDefinition) {
		if(shouldSaveDefinition == null) {
			shouldSaveDefinition = true;
		}
		if(shouldSaveDefinition) {
			queue.addString(worldResources_AlienRuins.saveDefinition);
		}
		var value = this.explored;
		if(queue.size + 8 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 8) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setDouble(queue.size,value);
		queue.size += 8;
		var value = this.bonusesAwarded;
		if(queue.size + 4 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setInt32(queue.size,value);
		queue.size += 4;
		queue.addString(this.spriteName);
		var value = this.bonusStoneGiven;
		if(queue.size + 8 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 8) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setDouble(queue.size,value);
		queue.size += 8;
		var value = this.bonusWoodGiven;
		if(queue.size + 8 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 8) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setDouble(queue.size,value);
		queue.size += 8;
	}
	,loadBasics: function(queue,definition) {
		if(definition == null) {
			definition = queue.readString();
		}
		var loadMap = gamesave_GameSaveHelper.makeLoadMap(definition,queue);
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"explored")) {
			this.explored = loadMap.h["explored"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"bonusesAwarded")) {
			this.bonusesAwarded = loadMap.h["bonusesAwarded"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"spriteName")) {
			this.spriteName = loadMap.h["spriteName"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"bonusStoneGiven")) {
			this.bonusStoneGiven = loadMap.h["bonusStoneGiven"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"bonusWoodGiven")) {
			this.bonusWoodGiven = loadMap.h["bonusWoodGiven"];
		}
		this.postLoad();
	}
	,__class__: worldResources_AlienRuins
});
