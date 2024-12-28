var buildings_CustomHouse = $hxClasses["buildings.CustomHouse"] = function(game,stage,bgStage,city,world,position,worldPosition,id) {
	this.timesUsedTo = 0;
	this.timesUsed = 0;
	this.isConnectedRight = false;
	this.isConnectedLeft = false;
	this.hasOneWindowOnFloor2 = false;
	this.hasOneWindowOnFloor1 = false;
	this.windowSprite2 = null;
	this._baseEntertainmentCap = 0;
	this._secondaryEntertainmentTypes = [];
	this._entertainmentType = 6;
	this.givesEducation = false;
	this._hasPrivateTeleporter = false;
	this.teleportX = 3;
	this.properties = new buildings_CustomHouseProperties();
	buildings_House.call(this,game,stage,bgStage,city,world,position,worldPosition,id);
	this.interiorSprite1 = new PIXI.Sprite();
	this.interiorSprite1.position.set(position.x,position.y + 3);
	this.interiorSprite2 = new PIXI.Sprite();
	this.interiorSprite2.position.set(position.x,position.y + 12);
	bgStage.addChild(this.interiorSprite1);
	bgStage.addChild(this.interiorSprite2);
	this.windowSprite = Resources.makeSprite(buildings_CustomHouse.spriteName,new common_Rectangle(66,0,20,20));
	this.windowSprite.position.set(position.x,position.y);
	stage.cacheableChildren.push(this.windowSprite);
	stage.isInvalid = true;
	this.isConnectedLeft = false;
	this.isConnectedRight = false;
	this.info = Reflect.copy(this.info);
	this.isMedical = false;
	this.isEntertainment = false;
};
buildings_CustomHouse.__name__ = "buildings.CustomHouse";
buildings_CustomHouse.__interfaces__ = [buildings_IEntertainmentBuilding,buildings_IMedicalBuilding];
buildings_CustomHouse.__super__ = buildings_House;
buildings_CustomHouse.prototype = $extend(buildings_House.prototype,{
	get_possibleUpgrades: function() {
		return [];
	}
	,get_customDrawer: function() {
		return this.drawer;
	}
	,get_drawerType: function() {
		if(this.properties.mergeWithSimilar) {
			return buildings_buildingDrawers_AutoMergingBuildingDrawerCustomHouse;
		} else {
			return buildings_buildingDrawers_NormalBuildingDrawer;
		}
	}
	,get_medicalQuality: function() {
		return 100;
	}
	,get_medicalCapacity: function() {
		if(this.isMedical) {
			return this.residents.length;
		} else {
			return 0;
		}
	}
	,get_medicalTypeLimit: function() {
		return 1;
	}
	,get_medicalTypeID: function() {
		return 0;
	}
	,get_hasPrivateTeleporter: function() {
		return this._hasPrivateTeleporter;
	}
	,get_baseEntertainmentCapacity: function() {
		return this._baseEntertainmentCap;
	}
	,get_isOpen: function() {
		return false;
	}
	,get_entertainmentType: function() {
		return this._entertainmentType;
	}
	,get_secondaryEntertainmentTypes: function() {
		return this._secondaryEntertainmentTypes;
	}
	,get_minimumNormalTimeToSpend: function() {
		return 1;
	}
	,get_maximumNormalTimeToSpend: function() {
		return 2;
	}
	,get_minimumEntertainmentGroupSatisfy: function() {
		return 1;
	}
	,get_maximumEntertainmentGroupSatisfy: function() {
		return 1.5;
	}
	,get_entertainmentQuality: function() {
		return 100;
	}
	,get_isOpenForExistingVisitors: function() {
		return false;
	}
	,finishEntertainment: function(citizen,timeMod) {
		return true;
	}
	,save: function(queue,shouldSaveDefinition) {
		if(shouldSaveDefinition == null) {
			shouldSaveDefinition = true;
		}
		buildings_House.prototype.save.call(this,queue,shouldSaveDefinition);
		this.saveBasics(queue);
		this.properties.save(queue);
	}
	,load: function(queue,definition) {
		buildings_House.prototype.load.call(this,queue,definition);
		this.loadBasics(queue,definition);
		if(queue.version >= 62) {
			this.properties.load(queue);
		}
		this.postLoad();
	}
	,postCreate: function() {
		buildings_House.prototype.postCreate.call(this);
		this.setProperties();
	}
	,setProperties: function() {
		this.bonusAttractiveness = this.properties.customAttractiveness - 20;
		this.extraCapacity = this.properties.customCapacity - 1;
		while(this.residents.length > this.get_residentCapacity()) {
			this.residents[this.residents.length - 1].evictFromHome();
			this.city.simulation.houseAssigner.shouldUpdateHouses = true;
		}
		this.drawer.destroy();
		this.drawer = Type.createInstance(this.get_drawerType(),[this,this.stage,this.bgStage,Reflect.field(js_Boot.getClass(this),"spriteName")]);
		this.get_customDrawer().changeMainTexture("spr_customhouse_" + this.properties.mainType);
		var mt = this.properties.mainType;
		this.hasOneWindowOnFloor1 = mt == "2" || mt == "4" || mt == "5" || mt == "6" || mt == "7";
		this.hasOneWindowOnFloor2 = mt == "1" || mt == "2" || mt == "5" || mt == "6" || mt == "7";
		this.get_customDrawer().setTint(this.properties.mainColor,this.properties.windowColor);
		this.windowSprite.tint = this.properties.windowColor;
		this.updateWindowRects();
		var interiorSprites = Resources.getTexturesByWidth("spr_customhouse_interiors",20);
		this.interiorSprite1.texture = interiorSprites[this.properties.interiorOption1];
		this.interiorSprite2.texture = interiorSprites[this.properties.interiorOption2];
		if(this.properties.interiorOption1Mirror) {
			this.interiorSprite1.anchor.x = 1;
			this.interiorSprite1.scale.x = -1;
		} else {
			this.interiorSprite1.anchor.x = 0;
			this.interiorSprite1.scale.x = 1;
		}
		if(this.properties.interiorOption2Mirror) {
			this.interiorSprite2.anchor.x = 1;
			this.interiorSprite2.scale.x = -1;
		} else {
			this.interiorSprite2.anchor.x = 0;
			this.interiorSprite2.scale.x = 1;
		}
		this.yearsToLiveLongerPerYearIfLivingHere = 0;
		this._hasPrivateTeleporter = false;
		this.givesEducation = false;
		this.isMedical = false;
		this.isEntertainment = false;
		this.info.teleporterOperatingCost = 0;
		this._secondaryEntertainmentTypes = null;
		var _g = 0;
		var _g1 = this.properties.bonuses;
		while(_g < _g1.length) {
			var bonus = _g1[_g];
			++_g;
			switch(bonus) {
			case 0:
				this.yearsToLiveLongerPerYearIfLivingHere = 0.05;
				break;
			case 1:
				this.givesEducation = true;
				break;
			case 2:
				this.isMedical = true;
				break;
			case 3:
				this._hasPrivateTeleporter = true;
				this.info.teleporterOperatingCost = 2;
				break;
			case 4:
				if(this.isEntertainment) {
					if(this._secondaryEntertainmentTypes == null) {
						this._secondaryEntertainmentTypes = [1];
					} else {
						this._secondaryEntertainmentTypes.push(1);
					}
				} else {
					this.isEntertainment = true;
					this._entertainmentType = 1;
				}
				break;
			case 5:
				if(this.isEntertainment) {
					if(this._secondaryEntertainmentTypes == null) {
						this._secondaryEntertainmentTypes = [3];
					} else {
						this._secondaryEntertainmentTypes.push(3);
					}
				} else {
					this.isEntertainment = true;
					this._entertainmentType = 3;
				}
				break;
			case 6:
				if(this.isEntertainment) {
					if(this._secondaryEntertainmentTypes == null) {
						this._secondaryEntertainmentTypes = [4];
					} else {
						this._secondaryEntertainmentTypes.push(4);
					}
				} else {
					this.isEntertainment = true;
					this._entertainmentType = 4;
				}
				break;
			default:
			}
		}
		if(this.isEntertainment) {
			this._baseEntertainmentCap = this.get_residentCapacity() * 5;
		} else {
			this._baseEntertainmentCap = 0;
		}
	}
	,updateWindowRects: function() {
		if(!this.properties.mergeWithSimilar) {
			var windowRect = new common_Rectangle(66,0,20,20);
			if(this.worldPosition.y == 0) {
				windowRect.x += 22;
			}
			this.windowSprite.texture = Resources.getTexture("spr_customhouse_" + this.properties.mainType,windowRect);
			if(this.windowSprite2 != null) {
				var _this = this.stage;
				var child = this.windowSprite2;
				HxOverrides.remove(_this.cacheableChildren,child);
				_this.isInvalid = true;
				child.destroy({ children : true, texture : false});
				this.windowSprite2 = null;
			}
		} else {
			this.isConnectedLeft = this.isConnectedBuilding(this.leftBuilding);
			this.isConnectedRight = this.isConnectedBuilding(this.rightBuilding);
			if(this.isConnectedLeft && this.isConnectedRight) {
				var windowRect = new common_Rectangle(176,0,20,20);
				if(this.worldPosition.y == 0) {
					windowRect.x += 22;
				}
				this.windowSprite.texture = Resources.getTexture("spr_customhouse_" + this.properties.mainType,windowRect);
				if(this.windowSprite2 != null) {
					var _this = this.stage;
					var child = this.windowSprite2;
					HxOverrides.remove(_this.cacheableChildren,child);
					_this.isInvalid = true;
					child.destroy({ children : true, texture : false});
					this.windowSprite2 = null;
				}
			} else if(!this.isConnectedLeft && !this.isConnectedRight) {
				var windowRect = new common_Rectangle(66,0,20,20);
				if(this.worldPosition.y == 0) {
					windowRect.x += 22;
				}
				this.windowSprite.texture = Resources.getTexture("spr_customhouse_" + this.properties.mainType,windowRect);
				if(this.windowSprite2 != null) {
					var _this = this.stage;
					var child = this.windowSprite2;
					HxOverrides.remove(_this.cacheableChildren,child);
					_this.isInvalid = true;
					child.destroy({ children : true, texture : false});
					this.windowSprite2 = null;
				}
			} else {
				if(this.windowSprite2 == null) {
					this.windowSprite2 = new PIXI.Sprite();
					this.windowSprite2.position.set(this.position.x + 10,this.position.y);
					this.windowSprite2.tint = this.properties.windowColor;
					var _this = this.stage;
					_this.cacheableChildren.push(this.windowSprite2);
					_this.isInvalid = true;
				}
				var windowRect1 = new common_Rectangle(22 * (3 + (this.isConnectedLeft ? 5 : 0)),0,10,20);
				if(this.worldPosition.y == 0) {
					windowRect1.x += 22;
				}
				var windowRect2 = new common_Rectangle(22 * (3 + (this.isConnectedRight ? 5 : 0)) + 10,0,10,20);
				if(this.worldPosition.y == 0) {
					windowRect2.x += 22;
				}
				this.windowSprite.texture = Resources.getTexture("spr_customhouse_" + this.properties.mainType,windowRect1);
				this.windowSprite2.texture = Resources.getTexture("spr_customhouse_" + this.properties.mainType,windowRect2);
			}
		}
	}
	,isConnectedBuilding: function(otherBuilding) {
		if(otherBuilding == null) {
			return false;
		}
		if(!otherBuilding.is(buildings_CustomHouse)) {
			return false;
		}
		var customHouse = otherBuilding;
		if(customHouse.properties.mainColor == this.properties.mainColor && customHouse.properties.windowColor == this.properties.windowColor) {
			return customHouse.properties.mergeWithSimilar;
		} else {
			return false;
		}
	}
	,positionSprites: function() {
		buildings_House.prototype.positionSprites.call(this);
		this.windowSprite.position.set(this.position.x,this.position.y);
		if(this.windowSprite2 != null) {
			this.windowSprite2.position.set(this.position.x + 10,this.position.y);
		}
		this.stage.isInvalid = true;
		this.interiorSprite1.position.set(this.position.x,this.position.y + 3);
		this.interiorSprite2.position.set(this.position.x,this.position.y + 12);
	}
	,postLoad: function() {
	}
	,walkAround: function(citizen,stepsInBuilding) {
		if(this.givesEducation && !citizen.hasBuildingInited) {
			citizen.educationLevel = Math.max(Math.min(citizen.educationLevel + 0.01,1.25),citizen.educationLevel);
			citizen.hasBuildingInited = true;
		}
		var r = random_Random.getInt(4);
		if(r == 0 && stepsInBuilding > 120) {
			citizen.changeFloorAndWaitRandom(30,60);
		} else if((r == 1 || r == 2) && (citizen.relativeY < 5 ? this.hasOneWindowOnFloor1 : this.hasOneWindowOnFloor2)) {
			citizen.moveAndWait(random_Random.getInt(this.isConnectedLeft ? 0 : 3,this.isConnectedRight ? 19 : 16),random_Random.getInt(30,60),null,false,false);
		} else if(r == 1) {
			citizen.moveAndWait(random_Random.getInt(this.isConnectedLeft ? 0 : 3,7),random_Random.getInt(30,60),null,false,false);
		} else if(r == 2) {
			citizen.moveAndWait(random_Random.getInt(12,this.isConnectedRight ? 19 : 16),random_Random.getInt(30,60),null,false,false);
		} else {
			var pool = pooling_Int32ArrayPool.pool;
			var arr = pool[2].length > 0 ? pool[2].splice(pool[2].length - 1,1)[0] : new Int32Array(2);
			arr[0] = 8;
			arr[1] = random_Random.getInt(90,120);
			citizen.setPath(arr,0,2,true);
			citizen.pathEndFunction = null;
			citizen.pathOnlyRelatedTo = citizen.inPermanent;
		}
	}
	,createWindowAddBottomButtons: function() {
		buildings_House.prototype.createWindowAddBottomButtons.call(this);
	}
	,destroy: function() {
		buildings_House.prototype.destroy.call(this);
		if(this.windowSprite != null) {
			var _this = this.stage;
			var child = this.windowSprite;
			HxOverrides.remove(_this.cacheableChildren,child);
			_this.isInvalid = true;
			child.destroy({ children : true, texture : false});
		}
		if(this.windowSprite2 != null) {
			var _this = this.stage;
			var child = this.windowSprite2;
			HxOverrides.remove(_this.cacheableChildren,child);
			_this.isInvalid = true;
			child.destroy({ children : true, texture : false});
		}
		if(this.interiorSprite1 != null) {
			this.interiorSprite1.destroy();
		}
		if(this.interiorSprite2 != null) {
			this.interiorSprite2.destroy();
		}
	}
	,createOrRemoveBuilderForThis: function() {
		this.city.createOrRemoveBuilder(js_Boot.getClass(this),true,null,null,null,this.properties);
	}
	,createTeleportParticle: function(rayTexture) {
		if(rayTexture == null) {
			rayTexture = "unused";
		}
		this.city.particles.addParticle(Resources.getTexturesByWidth("spr_smallteleporter_ray",3),new common_Point(this.position.x + 3,this.position.y + 12));
	}
	,addWindowInfoLines: function() {
		var _gthis = this;
		buildings_House.prototype.addWindowInfoLines.call(this);
		var bonusText = "";
		var _g = 0;
		var _g1 = this.properties.bonuses;
		while(_g < _g1.length) {
			var bonus = _g1[_g];
			++_g;
			if(bonusText != "") {
				bonusText += ", ";
			}
			switch(bonus) {
			case 0:
				bonusText += common_Localize.lo("bonus_residents_longer");
				break;
			case 1:
				bonusText += common_Localize.lo("bonus_residents_edu");
				break;
			case 2:
				bonusText += common_Localize.lo("bonus_residents_healthcare");
				break;
			case 3:
				bonusText += common_Localize.lo("bonus_private_teleporter");
				break;
			case 4:
				bonusText += common_Localize.lo("bonus_nature_happiness");
				break;
			case 5:
				bonusText += common_Localize.lo("bonus_art_happiness");
				break;
			case 6:
				bonusText += common_Localize.lo("bonus_gaming_happiness");
				break;
			}
		}
		if(this.properties.bonuses.length > 1) {
			this.city.gui.windowAddInfoText(common_Localize.lo("bonuses") + ": " + bonusText);
		} else if(this.properties.bonuses.length == 1) {
			this.city.gui.windowAddInfoText(common_Localize.lo("bonus") + ": " + bonusText);
		}
		gui_windowParts_FullSizeTextButton.create(this.city.gui,function() {
			var oldOnDestroy = _gthis.city.gui.windowOnDestroy;
			_gthis.city.gui.windowOnDestroy = null;
			gui_CustomHouseWindow.createWindow(_gthis.city,_gthis.city.gui,_gthis,_gthis.properties.copy());
			_gthis.city.gui.windowOnDestroy = function() {
				if(oldOnDestroy != null) {
					oldOnDestroy();
				}
			};
			_gthis.city.gui.windowRelatedTo = _gthis;
		},this.city.gui.windowInner,function() {
			return common_Localize.lo("renovate");
		},this.city.gui.innerWindowStage,true);
		this.city.gui.windowInner.addChild(new gui_GUISpacing(this.city.gui.windowInner,new common_Point(2,4)));
		gui_windowParts_FullSizeTextButton.create(this.city.gui,function() {
			_gthis.createOrRemoveBuilderForThis();
			_gthis.city.gui.closeWindow();
		},this.city.gui.windowInner,function() {
			return common_Localize.lo("duplicate_building");
		},this.city.gui.innerWindowStage,true);
		this.city.gui.windowInner.addChild(new gui_GUISpacing(this.city.gui.windowInner,new common_Point(2,4)));
		if(this._hasPrivateTeleporter) {
			this.city.gui.windowAddInfoText(null,function() {
				return common_Localize.lo("teleported_from",[_gthis.timesUsed]);
			});
			this.city.gui.windowAddInfoText(null,function() {
				return common_Localize.lo("teleported_to",[_gthis.timesUsedTo]);
			});
			buildings_Teleporter.createUpkeepInfo(this.city,this.city.gui);
		}
	}
	,giveRecycleReward: function(fullCost) {
		if(fullCost == null) {
			fullCost = true;
		}
		if(this.properties != null) {
			var mats = this.properties.getCost(this.city);
			mats.knowledge = 0;
			mats.multiply(this.city.upgrades.vars.recyclingAmount);
			this.city.materials.add(mats);
		}
	}
	,beEntertained: function(citizen,timeMod) {
		var modifyWithHappiness = false;
		var slowMove = true;
		if(slowMove == null) {
			slowMove = false;
		}
		if(modifyWithHappiness == null) {
			modifyWithHappiness = false;
		}
		citizen.moveAndWait(random_Random.getInt(3,16),random_Random.getInt(200,240),null,modifyWithHappiness,slowMove);
	}
	,saveBasics: function(queue,shouldSaveDefinition) {
		if(shouldSaveDefinition == null) {
			shouldSaveDefinition = true;
		}
		if(shouldSaveDefinition) {
			queue.addString(buildings_CustomHouse.saveDefinition);
		}
		var value = this.timesUsed;
		if(queue.size + 4 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setInt32(queue.size,value);
		queue.size += 4;
		var value = this.timesUsedTo;
		if(queue.size + 4 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setInt32(queue.size,value);
		queue.size += 4;
	}
	,loadBasics: function(queue,definition) {
		if(definition == null) {
			definition = queue.readString();
		}
		var loadMap = gamesave_GameSaveHelper.makeLoadMap(definition,queue);
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"timesUsed")) {
			this.timesUsed = loadMap.h["timesUsed"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"timesUsedTo")) {
			this.timesUsedTo = loadMap.h["timesUsedTo"];
		}
		this.postLoad();
	}
	,__class__: buildings_CustomHouse
});
