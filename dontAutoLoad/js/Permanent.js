var Permanent = $hxClasses["Permanent"] = function(game,id,city,world,position,worldPosition) {
	this.destroyed = false;
	this.highlightSprite = null;
	this.bonusEntertainmentCapacity = 0;
	this.bonusAttractiveness = 0;
	this.game = game;
	this.id = id;
	this.city = city;
	this.world = world;
	this.position = position;
	this.worldPosition = worldPosition;
	world.city.permanentsByID.h[id] = this;
	world.city.permanents.push(this);
	var c = js_Boot.getClass(this);
	var t = c.__name__;
	if(Object.prototype.hasOwnProperty.call(city.permanentNumberCached.h,t)) {
		var tmp = t;
		var v = city.permanentNumberCached.h[tmp] + 1;
		city.permanentNumberCached.h[tmp] = v;
	} else {
		city.permanentNumberCached.h[t] = 1;
	}
	this.isBuilding = false;
	this.ancestors = [];
	var currClass = js_Boot.getClass(this);
	while(currClass != Permanent) {
		this.ancestors.push(currClass);
		currClass = currClass.__super__;
	}
	var c = js_Boot.getClass(this);
	this.className = c.__name__;
	this.classID = PermanentMetaHelper.getClassID(this.className);
	if(js_Boot.__implements(this,buildings_IHousing) && this.ancestors.indexOf(buildings_House) == -1) {
		this.ancestors.push(buildings_House);
	}
	if(this.is(buildings_Work)) {
		world.city.workBuildings.push(this);
	}
};
Permanent.__name__ = "Permanent";
Permanent.__interfaces__ = [ICreatableCityElement];
Permanent.prototype = {
	get_name: function() {
		return "";
	}
	,get_typeID: function() {
		return 0;
	}
	,get_attractiveness: function() {
		return this.get_baseAttractiveness() + this.bonusAttractiveness;
	}
	,get_baseAttractiveness: function() {
		return 50;
	}
	,get_entertainmentCapacity: function() {
		return this.get_baseEntertainmentCapacity() + this.bonusEntertainmentCapacity;
	}
	,get_baseEntertainmentCapacity: function() {
		return 0;
	}
	,get_remainingCapacity: function() {
		return 0;
	}
	,get_connectedBuildingsType: function() {
		return this.className;
	}
	,destroyForReplacement: function() {
		Permanent.destroyingForReplacement = true;
		this.destroy();
		Permanent.destroyingForReplacement = false;
	}
	,destroy: function() {
		this.destroyed = true;
		var thisPermanentStack = this.world.permanents[this.worldPosition.x];
		var disableMoveDown = false;
		if(Permanent.destroyingDisableMoveDown || Permanent.destroyingForReplacement) {
			thisPermanentStack[this.worldPosition.y] = null;
			disableMoveDown = true;
		} else if(this.is(WorldResource) && thisPermanentStack.length > 1) {
			thisPermanentStack[0] = null;
			disableMoveDown = true;
		} else {
			HxOverrides.remove(thisPermanentStack,this);
		}
		HxOverrides.remove(this.city.permanents,this);
		this.city.permanentsByID.remove(this.id);
		var c = js_Boot.getClass(this);
		var t = c.__name__;
		if(Object.prototype.hasOwnProperty.call(this.city.permanentNumberCached.h,t)) {
			var tmp = t;
			var v = this.city.permanentNumberCached.h[tmp] - 1;
			this.city.permanentNumberCached.h[tmp] = v;
		}
		if(this.is(buildings_Work)) {
			HxOverrides.remove(this.world.city.workBuildings,this);
		}
		var _g = 0;
		var _g1 = this.city.simulation.citizens;
		while(_g < _g1.length) {
			var citizen = _g1[_g];
			++_g;
			if(citizen.inPermanent == this) {
				if(this.worldPosition.y == 0) {
					if(citizen.inPermanent != null && citizen.inPermanent.isBuilding) {
						var building = citizen.inPermanent != null && citizen.inPermanent.isBuilding ? citizen.inPermanent : null;
						citizen.relativeX = building.worldPosition.x * 20 + building.doorX;
					} else {
						citizen.relativeX += citizen.inPermanent.worldPosition.x * 20;
					}
					if(citizen.inPermanent != null) {
						citizen.inPermanent.onCitizenLeave(citizen,null);
					}
					citizen.inBuildingSince = citizen.city.simulation.time.timeSinceStart;
					citizen.set_drawOnStage(citizen.foregroundStage);
					citizen.inPermanent = null;
					citizen.relativeY = 0;
					Citizen.shouldUpdateDraw = true;
				} else {
					if((citizen.inPermanent != null && citizen.inPermanent.isBuilding ? citizen.inPermanent : null).bottomBuilding != null) {
						citizen.inPermanent = (citizen.inPermanent != null && citizen.inPermanent.isBuilding ? citizen.inPermanent : null).bottomBuilding;
						citizen.onWorld = citizen.inPermanent.world;
						this.onCitizenLeave(citizen,(citizen.inPermanent != null && citizen.inPermanent.isBuilding ? citizen.inPermanent : null).bottomBuilding);
						citizen.inBuildingSince = citizen.city.simulation.time.timeSinceStart;
					} else if((citizen.inPermanent != null && citizen.inPermanent.isBuilding ? citizen.inPermanent : null).leftBuilding != null) {
						citizen.inPermanent = (citizen.inPermanent != null && citizen.inPermanent.isBuilding ? citizen.inPermanent : null).leftBuilding;
						citizen.onWorld = citizen.inPermanent.world;
						this.onCitizenLeave(citizen,(citizen.inPermanent != null && citizen.inPermanent.isBuilding ? citizen.inPermanent : null).leftBuilding);
						citizen.inBuildingSince = citizen.city.simulation.time.timeSinceStart;
					} else if((citizen.inPermanent != null && citizen.inPermanent.isBuilding ? citizen.inPermanent : null).rightBuilding != null) {
						citizen.inPermanent = (citizen.inPermanent != null && citizen.inPermanent.isBuilding ? citizen.inPermanent : null).rightBuilding;
						citizen.onWorld = citizen.inPermanent.world;
						this.onCitizenLeave(citizen,(citizen.inPermanent != null && citizen.inPermanent.isBuilding ? citizen.inPermanent : null).rightBuilding);
						citizen.inBuildingSince = citizen.city.simulation.time.timeSinceStart;
					} else if((citizen.inPermanent != null && citizen.inPermanent.isBuilding ? citizen.inPermanent : null).topBuilding != null) {
						citizen.inPermanent = (citizen.inPermanent != null && citizen.inPermanent.isBuilding ? citizen.inPermanent : null).topBuilding;
						citizen.onWorld = citizen.inPermanent.world;
						this.onCitizenLeave(citizen,(citizen.inPermanent != null && citizen.inPermanent.isBuilding ? citizen.inPermanent : null).topBuilding);
						citizen.inBuildingSince = citizen.city.simulation.time.timeSinceStart;
					} else if(citizen.onWorld.rect.height > 0) {
						if(citizen.inPermanent != null && citizen.inPermanent.isBuilding) {
							var building1 = citizen.inPermanent != null && citizen.inPermanent.isBuilding ? citizen.inPermanent : null;
							citizen.relativeX = building1.worldPosition.x * 20 + building1.doorX;
						} else {
							citizen.relativeX += citizen.inPermanent.worldPosition.x * 20;
						}
						if(citizen.inPermanent != null) {
							citizen.inPermanent.onCitizenLeave(citizen,null);
						}
						citizen.inBuildingSince = citizen.city.simulation.time.timeSinceStart;
						citizen.set_drawOnStage(citizen.foregroundStage);
						citizen.inPermanent = null;
						citizen.relativeY = 0;
						Citizen.shouldUpdateDraw = true;
					} else {
						var cityPos = [citizen.getCityPosition()];
						var permanentBelow = Lambda.find(this.city.permanents,(function(cityPos) {
							return function(pm) {
								if(cityPos[0].x >= pm.position.x && cityPos[0].x < pm.position.x + 20) {
									return pm.position.y > cityPos[0].y;
								} else {
									return false;
								}
							};
						})(cityPos));
						if(permanentBelow != null) {
							citizen.inPermanent = permanentBelow;
							citizen.onWorld = citizen.inPermanent.world;
							this.onCitizenLeave(citizen,permanentBelow);
							citizen.inBuildingSince = citizen.city.simulation.time.timeSinceStart;
						} else {
							var worldNear = common_ArrayExtensions.whereMax(this.city.worlds,(function() {
								return function(w) {
									return w.rect.height > 0;
								};
							})(),(function(cityPos) {
								return function(w) {
									return -Math.abs(w.rect.get_center().x - cityPos[0].x) - Math.abs(w.rect.get_center().y - cityPos[0].y);
								};
							})(cityPos));
							if(citizen.inPermanent != null && citizen.inPermanent.isBuilding) {
								var building2 = citizen.inPermanent != null && citizen.inPermanent.isBuilding ? citizen.inPermanent : null;
								citizen.relativeX = building2.worldPosition.x * 20 + building2.doorX;
							} else {
								citizen.relativeX += citizen.inPermanent.worldPosition.x * 20;
							}
							if(citizen.inPermanent != null) {
								citizen.inPermanent.onCitizenLeave(citizen,null);
							}
							citizen.inBuildingSince = citizen.city.simulation.time.timeSinceStart;
							citizen.set_drawOnStage(citizen.foregroundStage);
							citizen.inPermanent = null;
							citizen.relativeY = 0;
							Citizen.shouldUpdateDraw = true;
							citizen.onWorld = worldNear;
							citizen.setRelativeX(0);
						}
					}
					citizen.setRelativeY(0);
				}
				if(citizen.recyclePathArray) {
					pooling_Int32ArrayPool.returnToPool(citizen.path);
					citizen.recyclePathArray = false;
				}
				citizen.path = null;
				citizen.nextPathPos = -1;
				citizen.pathEnd = -1;
				citizen.currentPathAction = -2;
				if(!citizen.canViewSelfInBuilding) {
					citizen.delayCanViewSelfInBuilding = true;
				}
				citizen.canViewSelfInBuilding = true;
				citizen.verticalPathProgress = 0;
				citizen.pathEndFunction = null;
				citizen.requestingPathGoal = null;
				citizen.pathOnlyRelatedTo = null;
				citizen.pathWalkSpeed = 1;
				citizen.pathCanBeReconsidered = true;
				if(citizen.sprite.alpha > 0 && citizen.sprite.alpha < 1) {
					citizen.sprite.alpha = 1;
				}
			}
		}
		if(!disableMoveDown) {
			var _g = this.worldPosition.y;
			var _g1 = thisPermanentStack.length;
			while(_g < _g1) {
				var yy = _g++;
				var thisPermanent = thisPermanentStack[yy];
				if(thisPermanent == null) {
					thisPermanentStack.splice(yy,0,null);
					break;
				}
				thisPermanent.worldPosition.y -= 1;
				thisPermanent.position.y = this.world.rect.y - (thisPermanent.worldPosition.y + 1) * 20;
				if(thisPermanent.isBuilding && thisPermanent.isRooftopBuilding && yy + 1 < thisPermanentStack.length) {
					thisPermanentStack.splice(yy + 1,0,null);
					break;
				}
			}
			var yy = thisPermanentStack.length - 1;
			var nullsOnStackTopAmount = 0;
			while(yy >= 0) {
				if(thisPermanentStack[yy] == null) {
					++nullsOnStackTopAmount;
				} else {
					break;
				}
				--yy;
			}
			if(nullsOnStackTopAmount > 0) {
				thisPermanentStack.splice(thisPermanentStack.length - nullsOnStackTopAmount,nullsOnStackTopAmount);
			}
		}
		if(!Permanent.destroyingForReplacement) {
			this.city.connections.updateCityConnections();
		}
		if(!disableMoveDown) {
			var _g = this.worldPosition.y;
			var _g1 = thisPermanentStack.length;
			while(_g < _g1) {
				var yy = _g++;
				if(thisPermanentStack[yy] != null) {
					thisPermanentStack[yy].positionSprites();
				}
			}
		}
		if(!Permanent.destroyingForReplacement) {
			this.city.simulation.updatePathfinder(true,this);
		}
		if(this.city.gui.windowRelatedTo == this) {
			this.city.gui.closeWindow();
		}
		var _g = 0;
		var _g1 = this.city.simulation.citizens;
		while(_g < _g1.length) {
			var citizen = _g1[_g];
			++_g;
			citizen.actuallyUpdateDraw();
		}
	}
	,postCreate: function() {
	}
	,onCityChange: function() {
	}
	,onCityChangePost: function() {
	}
	,invalidatePathfindingRelatedInfo: function() {
	}
	,update: function(timeMod) {
	}
	,onClick: function() {
		var hasSpecial = this.city.specialAction != null && this.city.specialAction.get_hasPermanentAction();
		if(hasSpecial) {
			this.city.specialAction.performPermanentAction(this);
			return;
		}
		this.showWindow();
		this.city.game.audio.playSound(this.city.game.audio.buildingClickSound);
	}
	,onHover: function(isActive) {
	}
	,showWindow: function() {
		gui_UpgradeWindowParts.hasMultiUpgradeModeOn = false;
		this.createWindow();
	}
	,reloadWindow: function() {
		this.city.gui.reloadWindow($bind(this,this.createWindow));
	}
	,createWindow: function() {
		var _gthis = this;
		this.city.gui.createWindow(this);
		this.city.gui.setWindowReload($bind(this,this.createWindow));
		this.city.gui.windowAddTitleText(this.get_name());
		this.createMainWindowPart();
		this.createWindowAddBottomButtons();
		this.selectedSprite = Resources.makeSprite("spr_selectedbuilding");
		this.selectedSprite.position.set(this.position.x - 1,this.position.y - 1);
		this.city.farForegroundStage.addChild(this.selectedSprite);
		var oldOnDestroy = this.city.gui.windowOnDestroy;
		this.city.gui.windowOnDestroy = function() {
			if(oldOnDestroy != null) {
				oldOnDestroy();
			}
			if(_gthis.selectedSprite != null) {
				_gthis.selectedSprite.destroy();
				_gthis.selectedSprite = null;
			}
		};
		this.city.gui.clearWindowStack();
		this.city.gui.addWindowToStack(function() {
			if(!_gthis.destroyed) {
				_gthis.createWindow();
			}
		});
	}
	,addWindowInfoLines: function() {
	}
	,createMainWindowPart: function() {
		this.addWindowInfoLines();
	}
	,createWindowAddBottomButtons: function() {
		this.city.gui.windowAddBottomButtons();
	}
	,positionSprites: function() {
		if(this.selectedSprite != null) {
			this.selectedSprite.position.set(this.position.x - 1,this.position.y - 1);
		}
		if(this.highlightSprite != null) {
			this.highlightSprite.position.set(this.position.x - 1,this.position.y - 1);
		}
	}
	,is: function(permanentClass) {
		var _g = 0;
		var _g1 = this.ancestors;
		while(_g < _g1.length) {
			var anc = _g1[_g];
			++_g;
			if(permanentClass == anc) {
				return true;
			}
		}
		return false;
	}
	,onCitizenLeave: function(citizen,newPermanent) {
	}
	,save: function(queue,shouldSaveDefinition) {
		if(shouldSaveDefinition == null) {
			shouldSaveDefinition = true;
		}
		if(shouldSaveDefinition) {
			queue.addString(Permanent.saveDefinition);
		}
	}
	,load: function(queue,definition) {
		if(definition == null) {
			definition = queue.readString();
		}
		var loadMap = gamesave_GameSaveHelper.makeLoadMap(definition,queue);
	}
	,__class__: Permanent
};
