var buildings_TheMachine = $hxClasses["buildings.TheMachine"] = function(game,stage,bgStage,city,world,position,worldPosition,id) {
	this.hasUpgrade = false;
	this.totalMaterialReward = null;
	this.thisDayMaterialReward = null;
	this.lastDayReward = -1;
	this.animProgress = 0;
	this.featherAllianceHouse = null;
	this.secretSocietyFriendsHouse = null;
	this.secretSocietyHouse = null;
	Building.call(this,game,stage,bgStage,city,world,position,worldPosition,id);
	this.bgTextures = Resources.getTexturesByWidth("spr_secretsocietymachine_anim",20);
	this.backSprite = new PIXI.Sprite(this.bgTextures[0]);
	this.backSprite.position.set(position.x,position.y);
	bgStage.addChild(this.backSprite);
	this.totalMaterialReward = new Materials();
};
buildings_TheMachine.__name__ = "buildings.TheMachine";
buildings_TheMachine.__super__ = Building;
buildings_TheMachine.prototype = $extend(Building.prototype,{
	get_possibleUpgrades: function() {
		return [buildingUpgrades_TheMachineUpgrade];
	}
	,postLoad: function() {
		var tmp;
		if(this.totalMaterialReward.graphene == null != null) {
			var f = this.totalMaterialReward.graphene;
			tmp = isNaN(f);
		} else {
			tmp = true;
		}
		if(tmp) {
			this.totalMaterialReward.graphene = 0;
		}
		var tmp;
		if(this.totalMaterialReward.rocketFuel != null) {
			var f = this.totalMaterialReward.rocketFuel;
			tmp = isNaN(f);
		} else {
			tmp = true;
		}
		if(tmp) {
			this.totalMaterialReward.rocketFuel = 0;
		}
	}
	,onBuild: function() {
		Building.prototype.onBuild.call(this);
		common_Achievements.achieve("BUILD_MACHINE");
		this.city.gui.triggerPremiumUpsellExperienceIfDesired("build_machine");
		this.city.gui.triggerPremiumUpsellExperienceIfDesiredForMobile("build_machine");
	}
	,update: function(timeMod) {
		var buildingsByType = this.city.getAmountOfPermanentsPerType();
		if((this.secretSocietyHouse == null || this.secretSocietyHouse.destroyed) && buildingsByType.h["buildings.SecretSocietyHouse"] >= 1) {
			this.secretSocietyHouse = Lambda.find(this.city.permanents,function(pm) {
				return pm.is(buildings_SecretSocietyHouse);
			});
		}
		if(this.secretSocietyHouse != null) {
			var _g = 0;
			var _g1 = this.secretSocietyHouse.workers;
			while(_g < _g1.length) {
				var cit = _g1[_g];
				++_g;
				cit.dieAgeModifier = cit.get_age() - 75 + 3 + (this.hasUpgrade ? 20 : 0);
			}
		}
		if((this.secretSocietyFriendsHouse == null || this.secretSocietyFriendsHouse.destroyed) && buildingsByType.h["buildings.HouseOfTheKeyFriends"] >= 1) {
			this.secretSocietyFriendsHouse = Lambda.find(this.city.permanents,function(pm) {
				return pm.is(buildings_HouseOfTheKeyFriends);
			});
		}
		if(this.secretSocietyFriendsHouse != null) {
			var _g = 0;
			var _g1 = this.secretSocietyFriendsHouse.residents;
			while(_g < _g1.length) {
				var cit = _g1[_g];
				++_g;
				cit.dieAgeModifier = cit.get_age() - 75 + 3 + (this.hasUpgrade ? 20 : 0);
			}
		}
		if((this.featherAllianceHouse == null || this.featherAllianceHouse.destroyed) && buildingsByType.h["buildings.FeatherAlliance"] >= 1) {
			this.featherAllianceHouse = Lambda.find(this.city.permanents,function(pm) {
				return pm.is(buildings_FeatherAlliance);
			});
		}
		if(this.featherAllianceHouse != null) {
			var _g = 0;
			var _g1 = this.featherAllianceHouse.residents;
			while(_g < _g1.length) {
				var cit = _g1[_g];
				++_g;
				cit.dieAgeModifier = Math.max(50,cit.dieAgeModifier);
			}
		}
		var mainAnimSpeed = 4;
		var maxWaitTime = 180;
		var beginAnimTime = 480;
		var animLength = this.bgTextures.length * mainAnimSpeed * 2 + beginAnimTime + maxWaitTime;
		this.animProgress = (this.animProgress + timeMod) % animLength;
		if(this.animProgress < beginAnimTime) {
			this.backSprite.texture = this.bgTextures[(Math.floor(this.animProgress) / 4 | 0) % 2];
		} else if(this.animProgress - beginAnimTime - maxWaitTime > this.bgTextures.length * mainAnimSpeed) {
			var val = this.bgTextures.length - 1 - (Math.floor(this.animProgress - this.bgTextures.length * mainAnimSpeed - beginAnimTime - maxWaitTime) / mainAnimSpeed | 0);
			var maxVal = this.bgTextures.length - 1;
			this.backSprite.texture = this.bgTextures[val < 0 ? 0 : val > maxVal ? maxVal : val];
		} else if(this.animProgress - beginAnimTime > this.bgTextures.length * mainAnimSpeed) {
			this.backSprite.texture = this.bgTextures[this.bgTextures.length - 1];
		} else {
			var val = Math.floor(this.animProgress - beginAnimTime) / mainAnimSpeed | 0;
			var maxVal = this.bgTextures.length - 1;
			this.backSprite.texture = this.bgTextures[val < 0 ? 0 : val > maxVal ? maxVal : val];
		}
		if(this.lastDayReward != 1 + ((this.city.simulation.time.timeSinceStart | 0) / 1440 | 0)) {
			this.setReward();
		}
	}
	,setReward: function() {
		var tmp;
		switch(random_Random.getInt(10)) {
		case 0:
			tmp = new Materials(random_Random.getInt(150,301));
			break;
		case 1:
			tmp = new Materials(0,random_Random.getInt(100,501));
			break;
		case 2:
			tmp = new Materials(0,0,random_Random.getInt(200,2001));
			break;
		case 3:
			tmp = new Materials(random_Random.getInt(100,301),random_Random.getInt(50,301),random_Random.getInt(25,201));
			break;
		case 4:
			tmp = new Materials(random_Random.getInt(100,201),random_Random.getInt(150,251));
			break;
		case 5:
			tmp = new Materials(0,0,0,random_Random.getInt(20,31));
			break;
		case 6:
			tmp = new Materials(0,0,0,0,0,random_Random.getInt(40,81));
			break;
		case 7:
			tmp = new Materials(0,0,0,0,0,0,random_Random.getInt(5,11));
			break;
		case 8:
			tmp = new Materials(0,0,0,random_Random.getInt(15,31),0,random_Random.getInt(20,51));
			break;
		default:
			switch(random_Random.getInt(5)) {
			case 0:
				tmp = new Materials(random_Random.getInt(500,1501),0,random_Random.getInt(1000,2001));
				break;
			case 1:
				tmp = new Materials(0,0,0,0,random_Random.getInt(500,1501));
				break;
			case 2:
				tmp = new Materials(0,random_Random.getInt(1000,2001),0,random_Random.getInt(50,101),0);
				break;
			case 3:
				tmp = new Materials(0,0,0,0,0,random_Random.getInt(200,301));
				break;
			default:
				switch(random_Random.getInt(5)) {
				case 0:
					tmp = new Materials(1000,0,1000,20,0,40,16);
					break;
				case 1:
					tmp = new Materials(0,0,0,0,0,0,100);
					break;
				case 2:
					tmp = new Materials(0,0,0,0,0,1000);
					break;
				case 3:
					tmp = new Materials(0,10000);
					break;
				default:
					tmp = new Materials(1000,1000,1000,500);
				}
			}
		}
		this.thisDayMaterialReward = tmp;
		if(this.hasUpgrade) {
			this.thisDayMaterialReward.multiply(1.5);
			var rnd = random_Random.getInt(100);
			if(rnd == 0) {
				this.thisDayMaterialReward.graphene = 50;
			} else if(rnd == 1) {
				this.thisDayMaterialReward.rocketFuel = 500;
			} else if(rnd < 5) {
				this.thisDayMaterialReward.graphene = random_Random.getInt(5,16);
			} else if(rnd < 10) {
				this.thisDayMaterialReward.rocketFuel = random_Random.getInt(100,301);
			} else if(rnd < 20) {
				this.thisDayMaterialReward.graphene = random_Random.getInt(1,4);
			} else if(rnd < 30) {
				this.thisDayMaterialReward.rocketFuel = random_Random.getInt(10,50);
			}
		}
		if(this.city.upgrades.vars.hasConnectedMachines) {
			var cityCount = common_ArrayExtensions.sum(this.city.progress.allCitiesInfo.subCityMachine,function(ma) {
				if(ma) {
					return 1;
				} else {
					return 0;
				}
			}) - 1;
			if(cityCount > 0) {
				this.thisDayMaterialReward.multiply(1 + 0.5 * cityCount);
			}
		}
		this.thisDayMaterialReward.multiply(this.city.simulation.boostManager.currentGlobalBoostAmount);
		this.thisDayMaterialReward.multiply(this.city.simulation.bonuses.theMachineBoost);
		this.thisDayMaterialReward.roundAll();
		this.lastDayReward = 1 + ((this.city.simulation.time.timeSinceStart | 0) / 1440 | 0);
		this.thisDayMaterialReward.addToProduction(this.city.simulation.stats);
		this.city.materials.add(this.thisDayMaterialReward);
		this.totalMaterialReward.add(this.thisDayMaterialReward);
	}
	,addWindowInfoLines: function() {
		var _gthis = this;
		if(this.thisDayMaterialReward == null) {
			this.setReward();
		}
		Building.prototype.addWindowInfoLines.call(this);
		var lastUpdated = this.lastDayReward;
		var lastTotalReward = this.lastDayReward;
		this.city.gui.windowAddInfoText(common_Localize.lo("today_production"));
		var rewardContainer = new gui_MaterialsDisplay(this.thisDayMaterialReward,300);
		var rewardHolder = null;
		rewardHolder = new gui_ContainerHolder(this.city.gui.windowInner,this.city.gui.innerWindowStage,rewardContainer,null,function() {
			if(_gthis.lastDayReward != lastUpdated) {
				rewardContainer.setMaterials(_gthis.thisDayMaterialReward);
				lastUpdated = _gthis.lastDayReward;
				rewardHolder.updateSize();
			}
		});
		this.city.gui.windowInner.addChild(rewardHolder);
		this.city.gui.windowInner.addChild(new gui_GUISpacing(this.city.gui.windowInner,new common_Point(2,6)));
		this.city.gui.windowAddInfoText(common_Localize.lo("total_production"));
		var rewardContainer2 = new gui_MaterialsDisplay(this.totalMaterialReward,300);
		var rewardHolder2 = null;
		rewardHolder2 = new gui_ContainerHolder(this.city.gui.windowInner,this.city.gui.innerWindowStage,rewardContainer2,null,function() {
			if(_gthis.lastDayReward != lastTotalReward) {
				rewardContainer2.setMaterials(_gthis.totalMaterialReward);
				lastTotalReward = _gthis.lastDayReward;
				rewardHolder2.updateSize();
			}
		});
		this.city.gui.windowInner.addChild(rewardHolder2);
		this.city.gui.windowInner.addChild(new gui_GUISpacing(this.city.gui.windowInner,new common_Point(2,6)));
		this.city.gui.windowAddInfoText(null,function() {
			if(((_gthis.city.simulation.time.timeSinceStart | 0) / 60 | 0) % 24 == 23) {
				return common_Localize.lo("next_production_in_1");
			} else {
				return common_Localize.lo("next_production_in_n",[24 - ((_gthis.city.simulation.time.timeSinceStart | 0) / 60 | 0) % 24]);
			}
		});
	}
	,positionSprites: function() {
		Building.prototype.positionSprites.call(this);
		if(this.backSprite != null) {
			this.backSprite.position.set(this.position.x,this.position.y);
		}
	}
	,destroy: function() {
		Building.prototype.destroy.call(this);
		if(this.backSprite != null) {
			this.backSprite.destroy();
		}
	}
	,save: function(queue,shouldSaveDefinition) {
		if(shouldSaveDefinition == null) {
			shouldSaveDefinition = true;
		}
		Building.prototype.save.call(this,queue);
		if(shouldSaveDefinition) {
			queue.addString(buildings_TheMachine.saveDefinition);
		}
		var value = this.animProgress;
		if(queue.size + 8 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 8) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setDouble(queue.size,value);
		queue.size += 8;
		var value = this.lastDayReward;
		if(queue.size + 4 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setInt32(queue.size,value);
		queue.size += 4;
		queue.addString(haxe_Serializer.run(this.thisDayMaterialReward));
		queue.addString(haxe_Serializer.run(this.totalMaterialReward));
	}
	,load: function(queue,definition) {
		Building.prototype.load.call(this,queue);
		if(queue.version < 8) {
			return;
		}
		if(definition == null) {
			definition = queue.readString();
		}
		var loadMap = gamesave_GameSaveHelper.makeLoadMap(definition,queue);
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"animProgress")) {
			this.animProgress = loadMap.h["animProgress"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"lastDayReward")) {
			this.lastDayReward = loadMap.h["lastDayReward"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"thisDayMaterialReward")) {
			this.thisDayMaterialReward = loadMap.h["thisDayMaterialReward"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"totalMaterialReward")) {
			this.totalMaterialReward = loadMap.h["totalMaterialReward"];
		}
		this.postLoad();
	}
	,__class__: buildings_TheMachine
});
