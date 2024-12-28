var Building = $hxClasses["Building"] = function(game,stage,bgStage,city,world,position,worldPosition,id) {
	this.isMedical = false;
	this.isEntertainment = false;
	this.doorX = 13;
	Permanent.call(this,game,id,city,world,position,worldPosition);
	this.isBuilding = true;
	this.upgrades = [];
	this.buildingMode = null;
	this.adjecentBuildingEffects = [];
	this.stage = stage;
	this.bgStage = bgStage;
	this.drawer = Type.createInstance(this.get_drawerType(),[this,stage,bgStage,Reflect.field(js_Boot.getClass(this),"spriteName")]);
	this.info = city.progress.resources.buildingInfo.h[this.className];
	this.isRooftopBuilding = this.info.specialInfo.indexOf("rooftop") != -1;
	this.cannotBuildOnTop = this.isRooftopBuilding || this.info.specialInfo.indexOf("disableInsertReplaceOrBuildOnTop") != -1;
	city.simulation.jobAssigner.buildingsHaveWork = true;
	city.simulation.houseAssigner.shouldUpdateHouses = true;
	city.simulation.schoolAssigner.schoolsShouldBeUpdated = true;
	if(!Game.isLoading && this.get_possibleBuildingModes().length > 0) {
		this.buildingMode = Type.createInstance(this.get_possibleBuildingModes()[0],[stage,city.cityMidStage,bgStage,this]);
	}
};
Building.__name__ = "Building";
Building.__super__ = Permanent;
Building.prototype = $extend(Permanent.prototype,{
	get_name: function() {
		return this.info.name;
	}
	,get_possibleUpgrades: function() {
		return [];
	}
	,get_possibleBuildingModes: function() {
		return [];
	}
	,get_possibleCityUpgrades: function() {
		return [];
	}
	,get_possiblePolicies: function() {
		return [];
	}
	,get_walkThroughCanViewSelfInThisBuilding: function() {
		return true;
	}
	,get_drawerType: function() {
		return buildings_buildingDrawers_NormalBuildingDrawer;
	}
	,onBuild: function() {
	}
	,destroy: function() {
		if((this.isRooftopBuilding || this.city.buildingMode == BuildingMode.DestroyLeavingHole) && this.worldPosition.y != this.world.permanents[this.worldPosition.x].length - 1) {
			Permanent.destroyingDisableMoveDown = true;
		}
		Permanent.prototype.destroy.call(this);
		Permanent.destroyingDisableMoveDown = false;
		this.drawer.destroy();
		Lambda.iter(this.upgrades,function(u) {
			u.destroy();
		});
		if(this.buildingMode != null) {
			this.buildingMode.destroy();
		}
		if(this.city.windowRelatedOnBuildOrDestroy != null) {
			this.city.windowRelatedOnBuildOrDestroy();
		}
	}
	,tryDestroy: function(warnIfNot) {
		if(warnIfNot == null) {
			warnIfNot = true;
		}
		var failedStructuralCheck = false;
		var advancedBuildingAllowed = this.city.upgrades.vars.advancedBuildingAllowed;
		if(this.world != null && this.world.isProtectedKey) {
			if(warnIfNot) {
				this.city.gui.showSimpleWindow(common_Localize.lo("secret_society_forbidden"),null,true,true);
			}
			return false;
		}
		if(!this.isRooftopBuilding) {
			var stackTopBuild = this;
			while(stackTopBuild.topBuilding != null && !stackTopBuild.topBuilding.isRooftopBuilding) stackTopBuild = stackTopBuild.topBuilding;
			if(this.city.buildingMode == BuildingMode.DestroyLeavingHole) {
				failedStructuralCheck = !Builder.canRemoveLeavingHoleFromStructuralPerspective(advancedBuildingAllowed,this,this.city);
			} else {
				failedStructuralCheck = !Builder.canRemoveFromLRPerspective(advancedBuildingAllowed,stackTopBuild,this.city);
			}
			if(this.topBuilding != null && (this.topBuilding.isRooftopBuilding && this.bottomBuilding == null && this.worldPosition.y != 0 && !this.city.miscCityElements.collidesSpecific(new common_Point(this.position.x,this.position.y + 20),miscCityElements_FloatingPlatform))) {
				failedStructuralCheck = true;
			}
		}
		if(failedStructuralCheck) {
			if(warnIfNot) {
				if(this.city.buildingMode == BuildingMode.DestroyLeavingHole) {
					this.city.gui.showSimpleWindow(common_Localize.lo("invalid_structure_2"),null,true,true);
				} else {
					this.city.gui.showSimpleWindow(common_Localize.lo("invalid_structure"),null,true,true);
				}
			}
			return false;
		}
		this.giveRecycleReward();
		this.destroy();
		return true;
	}
	,giveRecycleReward: function(fullCost) {
		if(fullCost == null) {
			fullCost = true;
		}
		if(this.info != null) {
			var mats = fullCost ? Materials.fromBuildingInfo(this.info) : new Materials();
			var _g = 0;
			var _g1 = this.upgrades;
			while(_g < _g1.length) {
				var ug = _g1[_g];
				++_g;
				var ugInfo = Resources.buildingUpgradesInfo.h[ug.className];
				if(ugInfo.className != "PickaxeTech" || this.city.simulation.bonuses.chosenEarlyGameUpgrades.indexOf("standardization") == -1) {
					mats.add(Materials.fromBuildingUpgradesInfo(ugInfo));
				}
			}
			mats.knowledge = 0;
			mats.multiply(this.city.upgrades.vars.recyclingAmount);
			this.city.materials.add(mats);
		}
	}
	,createWindowAddBottomButtons: function() {
		var _gthis = this;
		if(!this.city.progress.story.disableDestroy) {
			var destroyButton = null;
			var isConfirmButton = false;
			destroyButton = this.city.gui.windowAddBottomButtons([{ text : common_Localize.lo("destroy"), action : function() {
				if(isConfirmButton) {
					_gthis.city.gui.closeWindow();
					_gthis.tryDestroy(true);
				} else {
					destroyButton.setText(common_Localize.lo("really_destroy"));
					isConfirmButton = true;
				}
			}, onHover : function() {
				if(!isConfirmButton) {
					_gthis.city.gui.tooltip.setText(destroyButton,_gthis.game.isMobile ? common_Localize.lo("destroy_this_building") : common_Localize.lo("destroy_this_building") + "\n" + common_Localize.lo("destroy_tip"));
				}
			}}])[0];
		} else {
			this.city.gui.windowAddBottomButtons();
		}
	}
	,positionSprites: function() {
		Permanent.prototype.positionSprites.call(this);
		this.drawer.positionSprites();
		Lambda.iter(this.upgrades,function(u) {
			u.reposition();
		});
		if(this.buildingMode != null) {
			this.buildingMode.reposition();
		}
	}
	,changeMainTexture: function(textureName) {
		this.drawer.changeMainTexture(textureName);
	}
	,save: function(queue,shouldSaveDefinition) {
		if(shouldSaveDefinition == null) {
			shouldSaveDefinition = true;
		}
		Permanent.prototype.save.call(this,queue,shouldSaveDefinition);
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
			var u = _g1[_g];
			++_g;
			queue.addString(u.className);
			u.save(queue);
		}
		var value = this.buildingMode != null ? 1 : 0;
		if(queue.size + 4 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setInt32(queue.size,value);
		queue.size += 4;
		if(this.buildingMode != null) {
			queue.addString(this.buildingMode.className);
			this.buildingMode.save(queue);
		}
	}
	,load: function(queue,definition) {
		Permanent.prototype.load.call(this,queue,definition);
		var intToRead = queue.bytes.getInt32(queue.readStart);
		queue.readStart += 4;
		var upgradeLen = intToRead;
		var _g = 0;
		var _g1 = upgradeLen;
		while(_g < _g1) {
			var i = _g++;
			var name = queue.readString();
			var upgradeClass = $hxClasses[name];
			if(upgradeClass == null) {
				throw haxe_Exception.thrown("Fatally failed loading");
			}
			var upgrade = Type.createInstance(upgradeClass,[this.stage,this.city.cityMidStage,this.bgStage,this]);
			upgrade.load(queue);
			this.upgrades.push(upgrade);
		}
		var intToRead = queue.bytes.getInt32(queue.readStart);
		queue.readStart += 4;
		if(intToRead == 1) {
			var name = queue.readString();
			this.buildingMode = Type.createInstance($hxClasses[name],[this.stage,this.city.cityMidStage,this.bgStage,this]);
			this.buildingMode.load(queue);
		} else {
			this.buildingMode = null;
		}
	}
	,createMainWindowPart: function() {
		Permanent.prototype.createMainWindowPart.call(this);
		gui_CreateBuildingUpgrades.createMainWindowPart(this,this.city);
	}
	,getTotalAdjacentBuildingEffects: function(effectType) {
		var total = 0.0;
		var _g = 0;
		var _g1 = this.adjecentBuildingEffects;
		while(_g < _g1.length) {
			var ae = _g1[_g];
			++_g;
			if(ae.name == effectType) {
				total += ae.intensity;
			}
		}
		return total;
	}
	,getEffectsOfAdjecentBuildings: function(effectType) {
		var total = 0.0;
		if(this.leftBuilding != null) {
			var total1 = 0.0;
			var _g = 0;
			var _g1 = this.leftBuilding.adjecentBuildingEffects;
			while(_g < _g1.length) {
				var ae = _g1[_g];
				++_g;
				if(ae.name == effectType) {
					total1 += ae.intensity;
				}
			}
			total += total1;
		}
		if(this.rightBuilding != null) {
			var total1 = 0.0;
			var _g = 0;
			var _g1 = this.rightBuilding.adjecentBuildingEffects;
			while(_g < _g1.length) {
				var ae = _g1[_g];
				++_g;
				if(ae.name == effectType) {
					total1 += ae.intensity;
				}
			}
			total += total1;
		}
		if(this.topBuilding != null) {
			var total1 = 0.0;
			var _g = 0;
			var _g1 = this.topBuilding.adjecentBuildingEffects;
			while(_g < _g1.length) {
				var ae = _g1[_g];
				++_g;
				if(ae.name == effectType) {
					total1 += ae.intensity;
				}
			}
			total += total1;
		}
		if(this.bottomBuilding != null) {
			var total1 = 0.0;
			var _g = 0;
			var _g1 = this.bottomBuilding.adjecentBuildingEffects;
			while(_g < _g1.length) {
				var ae = _g1[_g];
				++_g;
				if(ae.name == effectType) {
					total1 += ae.intensity;
				}
			}
			total += total1;
		}
		return total;
	}
	,getEffectsOfAdjecentBuildingsLR: function(effectType) {
		var total = 0.0;
		if(this.leftBuilding != null) {
			var total1 = 0.0;
			var _g = 0;
			var _g1 = this.leftBuilding.adjecentBuildingEffects;
			while(_g < _g1.length) {
				var ae = _g1[_g];
				++_g;
				if(ae.name == effectType) {
					total1 += ae.intensity;
				}
			}
			total += total1;
		}
		if(this.rightBuilding != null) {
			var total1 = 0.0;
			var _g = 0;
			var _g1 = this.rightBuilding.adjecentBuildingEffects;
			while(_g < _g1.length) {
				var ae = _g1[_g];
				++_g;
				if(ae.name == effectType) {
					total1 += ae.intensity;
				}
			}
			total += total1;
		}
		return total;
	}
	,onClick: function() {
		var hasSpecial = this.city.specialAction != null && this.city.specialAction.get_hasPermanentAction();
		if(hasSpecial) {
			this.city.specialAction.performPermanentAction(this);
			return;
		}
		if(this.game.keyboard.down[46] || this.city.buildingMode == BuildingMode.Destroy || this.city.buildingMode == BuildingMode.DestroyLeavingHole) {
			if(!this.city.progress.story.disableDestroy) {
				if(this.city.gui.windowRelatedTo == this) {
					this.city.gui.closeWindow();
				}
				if(this.tryDestroy(true)) {
					this.city.game.audio.playSound(this.city.game.audio.buttonFailSound);
				}
			} else {
				this.city.gui.showSimpleWindow(common_Localize.lo("no_destroy_allowed"),null,true);
			}
		} else if(this.game.keyboard.down[16]) {
			if(this.info.specialInfo.indexOf("disableCopy") == -1) {
				this.createOrRemoveBuilderForThis();
			}
		} else {
			this.showWindow();
			this.city.game.audio.playSound(this.city.game.audio.buildingClickSound);
		}
	}
	,createOrRemoveBuilderForThis: function() {
		this.city.createOrRemoveBuilder(js_Boot.getClass(this),true);
	}
	,onHover: function(isActive) {
		Permanent.prototype.onHover.call(this,isActive);
		if((this.game.keyboard.down[46] || this.city.buildingMode == BuildingMode.Destroy || this.city.buildingMode == BuildingMode.DestroyLeavingHole) && this.city.specialAction == null) {
			var destroySprite = new PIXI.Sprite(Resources.getTexture("spr_destroying"));
			destroySprite.position.set(this.position.x,this.position.y);
			this.city.furtherForegroundTempStage.addChild(destroySprite);
			destroySprite.alpha = isActive ? 1 : !this.game.isMobile ? 0.5 : 0;
		}
	}
	,hasHolesBelowInBuildingStack: function() {
		var _g = 0;
		var _g1 = this.worldPosition.y;
		while(_g < _g1) {
			var yy = _g++;
			var thisPerm = this.world.permanents[this.worldPosition.x][yy];
			if(thisPerm == null || !thisPerm.isBuilding) {
				return true;
			}
		}
		return false;
	}
	,getGlobalGoal: function() {
		return null;
	}
	,couldStandHere: function() {
		if(this.get_drawerType() == buildings_buildingDrawers_AllDirMergingBuildingDrawer) {
			if(this.bottomBuilding != null) {
				return !this.bottomBuilding.is(js_Boot.getClass(this));
			} else {
				return true;
			}
		} else {
			return true;
		}
	}
	,__class__: Building
});
