var buildings_TrainStation = $hxClasses["buildings.TrainStation"] = function(game,stage,bgStage,city,world,position,worldPosition,id) {
	this.wasLeftBefore = false;
	this.numberOfTrainsInSystemPrev = -1;
	this.trainSprite = 0;
	this.timesUsedTo = 0;
	this.timesUsed = 0;
	this.decorationSpriteBottom = null;
	this.decorationSpriteTop = null;
	this.currentWaitBetweenTrainsRight = 0;
	this.currentWaitBetweenTrainsLeft = 0;
	this.minimumWaitBetweenTrains = 0;
	this.decorationOptionBottom = 0;
	this.decorationOptionTop = 0;
	this.requestedStopRight = false;
	this.requestedStopLeft = false;
	this.rightgoingTrains = null;
	this.railTextures = null;
	this.platformSwitchSprite2 = null;
	this.platformSwitchSprite = null;
	this.railSprite = null;
	this.platformSwitchLastSet = 3;
	this.platformSwitchCurrent = 0;
	this.rightTrainStationViaBridge = null;
	this.leftTrainStationViaBridge = null;
	this.rightTrainStation = null;
	this.leftTrainStation = null;
	Building.call(this,game,stage,city.cityBgStageBelow,city,world,position,worldPosition,id);
	this.railTextures = Resources.getTexturesByWidth("spr_rail",20);
	this.railSprite = new PIXI.Sprite();
	this.railSprite.position.x = position.x;
	this.railSprite.position.y = position.y + 9;
	city.cityBgStageBelow.addChild(this.railSprite);
	city.simulation.trains.push(new simulation_Train(city.trainStage,city.simulation,this));
	this.decorationOptions = Resources.getTexturesByWidth("spr_trainstation_decoration",18);
	this.trainTextures = Resources.getTexturesByWidth("spr_train",12);
	this.decorationSpriteTop = null;
	this.decorationSpriteBottom = null;
};
buildings_TrainStation.__name__ = "buildings.TrainStation";
buildings_TrainStation.__super__ = Building;
buildings_TrainStation.prototype = $extend(Building.prototype,{
	get_drawerType: function() {
		return buildings_buildingDrawers_AutoMergingBuildingDrawer;
	}
	,get_typeID: function() {
		return 6;
	}
	,getConnectedTrainStations: function() {
		var stations = [];
		var station = this;
		while(station.leftTrainStation != null) station = station.leftTrainStation;
		while(station.rightTrainStation != null) {
			stations.push(station);
			station = station.rightTrainStation;
		}
		stations.push(station);
		return stations;
	}
	,update: function(timeMod) {
		Building.prototype.update.call(this,timeMod);
		this.platformSwitchLastSet -= Math.min(timeMod,1);
		if(this.platformSwitchCurrent > 0 && this.platformSwitchLastSet <= 0) {
			this.setPlatformSwitch(Math.max(0,this.platformSwitchCurrent - 3 * timeMod));
			this.platformSwitchLastSet = 0;
		}
		if(this.leftTrainStation == null && this.rightTrainStation != null) {
			if(this.platformSwitchSprite == null) {
				this.platformSwitchSprite = new PIXI.Sprite(Resources.getTexture("spr_movingplatform"));
				this.platformSwitchSprite2 = new PIXI.Sprite(Resources.getTexture("spr_movingplatform_bottom"));
				this.city.cityBgStageBelow.addChild(this.platformSwitchSprite);
				this.city.cityBgStageBelow.addChild(this.platformSwitchSprite2);
			}
			this.platformSwitchSprite.position.set(this.position.x + 1,this.position.y + this.platformSwitchCurrent + 9);
			this.platformSwitchSprite2.position.set(this.position.x + 1,this.position.y + this.platformSwitchCurrent + 10 + (this.platformSwitchCurrent >= 10 ? 1 : 0));
			this.platformSwitchSprite2.height = 10 - this.platformSwitchCurrent;
		} else if(this.rightTrainStation == null && this.leftTrainStation != null) {
			if(this.platformSwitchSprite == null) {
				this.platformSwitchSprite = new PIXI.Sprite(Resources.getTexture("spr_movingplatform"));
				this.platformSwitchSprite2 = new PIXI.Sprite(Resources.getTexture("spr_movingplatform_bottom"));
				this.city.cityBgStageBelow.addChild(this.platformSwitchSprite);
				this.city.cityBgStageBelow.addChild(this.platformSwitchSprite2);
			}
			this.platformSwitchSprite.position.set(this.position.x + 7,this.position.y - this.platformSwitchCurrent + 19);
			this.platformSwitchSprite2.position.set(this.position.x + 7,this.position.y - this.platformSwitchCurrent + 20);
			this.platformSwitchSprite2.height = this.platformSwitchCurrent;
		} else if(this.platformSwitchSprite != null) {
			this.platformSwitchSprite.destroy();
			this.platformSwitchSprite2.destroy();
			this.platformSwitchSprite = null;
			this.platformSwitchSprite2 = null;
		}
		this.currentWaitBetweenTrainsLeft += timeMod / 40;
		this.currentWaitBetweenTrainsRight += timeMod / 40;
	}
	,setPlatformSwitch: function(toVal,toLastSet) {
		if(toLastSet == null) {
			toLastSet = 3;
		}
		this.platformSwitchLastSet = toLastSet;
		this.platformSwitchCurrent = toVal;
	}
	,destroy: function() {
		this.railSprite.destroy();
		if(this.platformSwitchSprite != null) {
			this.platformSwitchSprite.destroy();
		}
		if(this.platformSwitchSprite2 != null) {
			this.platformSwitchSprite2.destroy();
		}
		if(this.decorationSpriteTop != null) {
			this.decorationSpriteTop.destroy();
		}
		if(this.decorationSpriteBottom != null) {
			this.decorationSpriteBottom.destroy();
		}
		Building.prototype.destroy.call(this);
	}
	,postCreate: function() {
		Building.prototype.postCreate.call(this);
		this.updateRails();
		this.updateDecoration();
		if(!Game.isLoading || this.leftTrainStation == null) {
			this.colorTrainsInNetwork();
		}
	}
	,positionSprites: function() {
		this.updateDecoration();
	}
	,updateDecoration: function() {
		if(this.decorationOptionTop == 0 || this.leftTrainStation == null || this.rightTrainStation == null) {
			if(this.decorationSpriteTop != null) {
				this.decorationSpriteTop.destroy();
				this.decorationSpriteTop = null;
			}
		} else if(this.decorationSpriteTop == null) {
			this.decorationSpriteTop = new PIXI.Sprite();
		}
		if(this.decorationOptionTop != 0 && this.leftTrainStation != null && this.rightTrainStation != null) {
			this.decorationSpriteTop.texture = this.decorationOptions[this.decorationOptionTop - 1];
			var correctStage = this.city.cityBgStage;
			if(buildings_TrainStation.decorationOptionsInBackground.indexOf(this.decorationOptionTop - 1) != -1) {
				correctStage = this.city.cityBgStageBelow;
			}
			if(this.decorationSpriteTop.parent != correctStage) {
				correctStage.addChild(this.decorationSpriteTop);
			}
			this.decorationSpriteTop.position.set(this.position.x + 1,this.position.y + 1);
		}
		if(this.decorationOptionBottom == 0) {
			if(this.decorationSpriteBottom != null) {
				this.decorationSpriteBottom.destroy();
				this.decorationSpriteBottom = null;
			}
		} else if(this.decorationSpriteBottom == null) {
			this.decorationSpriteBottom = new PIXI.Sprite();
		}
		if(this.decorationOptionBottom != 0) {
			this.decorationSpriteBottom.texture = this.decorationOptions[this.decorationOptionBottom - 1];
			var correctStage = this.city.cityBgStage;
			var correctPos = this.city.cityBgStage.children.length;
			if(buildings_TrainStation.decorationOptionsInBackground.indexOf(this.decorationOptionBottom - 1) != -1) {
				correctStage = this.city.cityBgStageBelow;
				correctPos = this.city.cityBgStageBelow.children.length;
				if(this.leftTrainStation == null && this.rightTrainStation == null && this.platformSwitchSprite != null) {
					correctPos = correctStage.getChildIndex(this.platformSwitchSprite) - 1;
				}
			}
			if(this.decorationSpriteBottom.parent != correctStage) {
				correctStage.addChildAt(this.decorationSpriteBottom,correctPos);
			}
			this.decorationSpriteBottom.position.set(this.position.x + 1,this.position.y + 11);
		}
	}
	,onCityChange: function() {
		this.updateRails();
	}
	,onCityChangePost: function() {
		if(this.leftTrainStation == null) {
			var didAnything = false;
			var numberOfTrainsInSystem = 0;
			var desiredNumberOfTrains = this.trainSprite != this.trainTextures.length - 1 ? 1 : 0;
			numberOfTrainsInSystem += this.city.simulation.trainsByBuildingLeft.h[this.__id__] != null ? 1 : 0;
			numberOfTrainsInSystem += this.city.simulation.trainsByBuildingRight.h[this.__id__] != null ? 1 : 0;
			var bld = this.leftBuilding;
			while(bld != null) {
				numberOfTrainsInSystem += this.city.simulation.trainsByBuildingLeft.h[bld.__id__] != null ? 1 : 0;
				numberOfTrainsInSystem += this.city.simulation.trainsByBuildingRight.h[bld.__id__] != null ? 1 : 0;
				if(bld.is(buildings_TrainStation)) {
					if(bld.trainSprite != this.trainTextures.length - 1) {
						++desiredNumberOfTrains;
					}
				}
				bld = bld.leftBuilding;
			}
			var bld = this.rightBuilding;
			while(bld != null) {
				numberOfTrainsInSystem += this.city.simulation.trainsByBuildingLeft.h[bld.__id__] != null ? 1 : 0;
				numberOfTrainsInSystem += this.city.simulation.trainsByBuildingRight.h[bld.__id__] != null ? 1 : 0;
				if(bld.is(buildings_TrainStation)) {
					if(bld.trainSprite != this.trainTextures.length - 1) {
						++desiredNumberOfTrains;
					}
				}
				bld = bld.rightBuilding;
			}
			while(numberOfTrainsInSystem > desiredNumberOfTrains) {
				var bld = this;
				var isDone = false;
				while(bld != null) {
					if(this.city.simulation.trainsByBuildingLeft.h[bld.__id__] != null) {
						this.city.simulation.trainsByBuildingLeft.h[bld.__id__].despawn();
						didAnything = true;
						--numberOfTrainsInSystem;
						isDone = true;
						break;
					}
					if(this.city.simulation.trainsByBuildingRight.h[bld.__id__] != null) {
						this.city.simulation.trainsByBuildingRight.h[bld.__id__].despawn();
						didAnything = true;
						--numberOfTrainsInSystem;
						isDone = true;
						break;
					}
					bld = bld.leftBuilding;
				}
				if(isDone) {
					continue;
				}
				var bld1 = this.rightBuilding;
				while(bld1 != null) {
					if(this.city.simulation.trainsByBuildingLeft.h[bld1.__id__] != null) {
						this.city.simulation.trainsByBuildingLeft.h[bld1.__id__].despawn();
						didAnything = true;
						--numberOfTrainsInSystem;
						break;
					}
					if(this.city.simulation.trainsByBuildingRight.h[bld1.__id__] != null) {
						this.city.simulation.trainsByBuildingRight.h[bld1.__id__].despawn();
						didAnything = true;
						--numberOfTrainsInSystem;
						break;
					}
					bld1 = bld1.rightBuilding;
				}
			}
			if(numberOfTrainsInSystem < desiredNumberOfTrains && this.city.simulation.trainsByBuildingRight.h[this.__id__] == null) {
				this.city.simulation.trains.push(new simulation_Train(this.city.trainStage,this.city.simulation,this));
				didAnything = true;
			}
			if(didAnything || numberOfTrainsInSystem != this.numberOfTrainsInSystemPrev || !this.wasLeftBefore) {
				this.colorTrainsInNetwork();
				this.numberOfTrainsInSystemPrev = numberOfTrainsInSystem;
				this.wasLeftBefore = true;
			}
		} else {
			this.wasLeftBefore = false;
		}
		if(this.city.gui.windowRelatedTo == this) {
			this.city.gui.reloadWindow();
		}
		this.updateDecoration();
	}
	,updateRails: function() {
		this.leftTrainStation = null;
		this.rightTrainStation = null;
		if(this.leftTrainStationViaBridge != null) {
			this.leftTrainStation = this.leftTrainStationViaBridge;
		} else {
			var bld = this.leftBuilding;
			while(bld != null) {
				if(bld.is(buildings_TrainStation)) {
					this.leftTrainStation = bld;
					break;
				}
				bld = bld.leftBuilding;
			}
		}
		if(this.rightTrainStationViaBridge != null) {
			this.rightTrainStation = this.rightTrainStationViaBridge;
		} else {
			var bld = this.rightBuilding;
			while(bld != null) {
				if(bld.is(buildings_TrainStation)) {
					this.rightTrainStation = bld;
					break;
				}
				bld = bld.rightBuilding;
			}
		}
		this.railSprite.position.x = this.position.x;
		this.railSprite.position.y = this.position.y + 9;
		this.railSprite.texture = this.railTextures[0];
		this.drawer.changeMainTexture("spr_trainstation");
		this.drawer.changeTextureGroup("spr_trainstation");
		if(this.leftTrainStation == null && this.rightTrainStation != null) {
			this.railSprite.texture = this.railTextures[1];
			this.drawer.changeMainTexture("spr_trainstation_l");
			this.drawer.changeTextureGroup("spr_trainstation");
		}
		if(this.leftTrainStation != null && this.rightTrainStation == null) {
			this.railSprite.texture = this.railTextures[2];
			this.drawer.changeMainTexture("spr_trainstation_r");
			this.drawer.changeTextureGroup("spr_trainstation");
		}
		this.rightTrainStationViaBridge = null;
		this.leftTrainStationViaBridge = null;
	}
	,colorTrainsInNetwork: function() {
		var _gthis = this;
		var _g = [];
		var _g1 = 0;
		var _g2 = this.getConnectedTrainStations();
		while(_g1 < _g2.length) {
			var v = _g2[_g1];
			++_g1;
			if(v.trainSprite != _gthis.trainTextures.length - 1) {
				_g.push(v);
			}
		}
		var _this = _g;
		var result = new Array(_this.length);
		var _g = 0;
		var _g1 = _this.length;
		while(_g < _g1) {
			var i = _g++;
			result[i] = _this[i].trainSprite;
		}
		var correctColorsForNetwork = result;
		var trainMinID = 10000000000000;
		var bld = this;
		while(bld.leftBuilding != null) bld = bld.leftBuilding;
		var firstBuilding = null;
		var firstDirection = simulation_TrainDirection.Left;
		while(bld != null) {
			var trLeft = this.city.simulation.trainsByBuildingLeft.h[bld.__id__];
			var trRight = this.city.simulation.trainsByBuildingRight.h[bld.__id__];
			if(trLeft != null && trLeft.trainID < trainMinID) {
				firstBuilding = bld;
				trainMinID = trLeft.trainID;
				firstDirection = simulation_TrainDirection.Left;
			}
			if(trRight != null && trRight.trainID < trainMinID) {
				firstBuilding = bld;
				trainMinID = trRight.trainID;
				firstDirection = simulation_TrainDirection.Right;
			}
			bld = bld.rightBuilding;
		}
		var currentID = 0;
		var currentBuilding = firstBuilding;
		if(firstDirection == simulation_TrainDirection.Left) {
			var lastSeen = currentBuilding;
			while(currentBuilding != null) {
				lastSeen = currentBuilding;
				if(this.city.simulation.trainsByBuildingLeft.h[currentBuilding.__id__] != null) {
					this.city.simulation.trainsByBuildingLeft.h[currentBuilding.__id__].setTexture(correctColorsForNetwork[currentID]);
					++currentID;
				}
				currentBuilding = currentBuilding.leftBuilding;
			}
			currentBuilding = lastSeen;
			var lastSeen = currentBuilding;
			while(currentBuilding != null) {
				lastSeen = currentBuilding;
				if(this.city.simulation.trainsByBuildingRight.h[currentBuilding.__id__] != null) {
					this.city.simulation.trainsByBuildingRight.h[currentBuilding.__id__].setTexture(correctColorsForNetwork[currentID]);
					++currentID;
				}
				currentBuilding = currentBuilding.rightBuilding;
			}
			currentBuilding = lastSeen;
			while(currentBuilding != firstBuilding) {
				if(this.city.simulation.trainsByBuildingLeft.h[currentBuilding.__id__] != null) {
					this.city.simulation.trainsByBuildingLeft.h[currentBuilding.__id__].setTexture(correctColorsForNetwork[currentID]);
					++currentID;
				}
				currentBuilding = currentBuilding.leftBuilding;
			}
		} else if(firstDirection == simulation_TrainDirection.Right) {
			var lastSeen = currentBuilding;
			while(currentBuilding != null) {
				lastSeen = currentBuilding;
				if(this.city.simulation.trainsByBuildingRight.h[currentBuilding.__id__] != null) {
					this.city.simulation.trainsByBuildingRight.h[currentBuilding.__id__].setTexture(correctColorsForNetwork[currentID]);
					++currentID;
				}
				currentBuilding = currentBuilding.rightBuilding;
			}
			currentBuilding = lastSeen;
			var lastSeen = currentBuilding;
			while(currentBuilding != null) {
				lastSeen = currentBuilding;
				if(this.city.simulation.trainsByBuildingLeft.h[currentBuilding.__id__] != null) {
					this.city.simulation.trainsByBuildingLeft.h[currentBuilding.__id__].setTexture(correctColorsForNetwork[currentID]);
					++currentID;
				}
				currentBuilding = currentBuilding.leftBuilding;
			}
			currentBuilding = lastSeen;
			while(currentBuilding != firstBuilding) {
				if(this.city.simulation.trainsByBuildingRight.h[currentBuilding.__id__] != null) {
					this.city.simulation.trainsByBuildingRight.h[currentBuilding.__id__].setTexture(correctColorsForNetwork[currentID]);
					++currentID;
				}
				currentBuilding = currentBuilding.rightBuilding;
			}
		}
	}
	,addWindowInfoLines: function() {
		var _gthis = this;
		Building.prototype.addWindowInfoLines.call(this);
		this.city.gui.windowAddInfoText(null,function() {
			return common_Localize.lo("train_boarded_here",[_gthis.timesUsed]);
		});
		this.city.gui.windowAddInfoText(null,function() {
			return common_Localize.lo("train_alighted_here",[_gthis.timesUsedTo]);
		});
		if(this.leftTrainStation != null && this.rightTrainStation != null) {
			gui_windowParts_CycleValueButton.create(this.city.gui,function() {
				return _gthis.decorationOptionTop;
			},function(t) {
				_gthis.decorationOptionTop = t;
				_gthis.updateDecoration();
			},function() {
				return _gthis.decorationOptions.length + 1;
			},common_Localize.lo("change_top_half_furniture"));
		}
		gui_windowParts_CycleValueButton.create(this.city.gui,function() {
			return _gthis.decorationOptionBottom;
		},function(t) {
			_gthis.decorationOptionBottom = t;
			_gthis.updateDecoration();
		},function() {
			return _gthis.decorationOptions.length + 1;
		},common_Localize.lo("change_bottom_half_furniture"));
		this.city.gui.windowInner.addChild(new gui_GUISpacing(this.city.gui.windowInner,new common_Point(2,2)));
		var thisWindow = this.city.gui.windowInner;
		var minWaitBetweenTrainsController = new gui_GUIContainer(this.city.gui,this.city.gui.innerWindowStage,thisWindow);
		minWaitBetweenTrainsController.direction = gui_GUIContainerDirection.Vertical;
		var minWaitBetweenTrainsController2 = new gui_GUIContainer(this.city.gui,this.city.gui.innerWindowStage,thisWindow);
		minWaitBetweenTrainsController2.direction = gui_GUIContainerDirection.Horizontal;
		minWaitBetweenTrainsController2.padding.bottom = 6;
		var threadLimitText = new gui_TextElement(minWaitBetweenTrainsController,this.city.gui.innerWindowStage,common_Localize.lo("minimum_wait_between_trains") + " ");
		threadLimitText.padding.top = 1;
		minWaitBetweenTrainsController2.addChild(threadLimitText);
		minWaitBetweenTrainsController2.addChild(new gui_GUISpacing(minWaitBetweenTrainsController2,new common_Point(4,2)));
		var numberSelectControl = this.city.gui;
		var numberSelectControl1 = this.city.gui.innerWindowStage;
		var numberSelectControl2 = this.minimumWaitBetweenTrains;
		var numberSelectControl3 = common_Localize.lo("reset_minimum_wait_between_trains");
		var numberSelectControl4 = new gui_NumberSelectControl(numberSelectControl,numberSelectControl1,minWaitBetweenTrainsController2,{ left : 0, right : 0, top : 0, bottom : 0},function() {
			return 0;
		},function() {
			return 60;
		},numberSelectControl2,function(v) {
			_gthis.minimumWaitBetweenTrains = v;
		},function() {
			_gthis.minimumWaitBetweenTrains = 0;
			return 0;
		},numberSelectControl3);
		minWaitBetweenTrainsController2.addChild(numberSelectControl4);
		minWaitBetweenTrainsController.addChild(minWaitBetweenTrainsController2);
		thisWindow.addChild(minWaitBetweenTrainsController);
		this.city.gui.windowInner.addChild(new gui_GUISpacing(this.city.gui.windowInner,new common_Point(2,2)));
		this.city.gui.windowAddInfoText(common_Localize.lo("change_trains"),null,"Arial15");
		var trainsContainer = new gui_GUIContainer(this.city.gui,this.city.gui.innerWindowStage,this.city.gui.windowInner);
		this.city.gui.windowInner.addChild(trainsContainer);
		var stations = this.getConnectedTrainStations();
		var numberOfButtons = 0;
		var _g = 0;
		while(_g < stations.length) {
			var station = [stations[_g]];
			++_g;
			if(numberOfButtons == 7) {
				trainsContainer = new gui_GUIContainer(this.city.gui,this.city.gui.innerWindowStage,this.city.gui.windowInner);
				this.city.gui.windowInner.addChild(new gui_GUISpacing(this.city.gui.windowInner,new common_Point(2,2)));
				this.city.gui.windowInner.addChild(trainsContainer);
				numberOfButtons = 0;
			} else if(numberOfButtons != 0) {
				trainsContainer.addChild(new gui_GUISpacing(trainsContainer,new common_Point(2,2)));
			}
			++numberOfButtons;
			var btn = [null];
			btn[0] = new gui_ImageButton(this.city.gui,this.city.gui.innerWindowStage,trainsContainer,(function(btn,station) {
				return function() {
					if(_gthis.game.keyboard.down[17]) {
						station[0].trainSprite -= 1;
					} else {
						station[0].trainSprite += 1;
					}
					if(station[0].trainSprite < 0) {
						station[0].trainSprite = _gthis.trainTextures.length - 1;
					}
					if(station[0].trainSprite == _gthis.trainTextures.length - 1) {
						if(common_ArrayExtensions.all(stations,(function() {
							return function(st) {
								return st.trainSprite == _gthis.trainTextures.length - 1;
							};
						})())) {
							if(_gthis.game.keyboard.down[17]) {
								station[0].trainSprite = _gthis.trainTextures.length - 2;
							} else {
								station[0].trainSprite = 0;
							}
						}
						stations[0].onCityChangePost();
					}
					if(station[0].trainSprite >= _gthis.trainTextures.length) {
						station[0].trainSprite = 0;
						stations[0].onCityChangePost();
					}
					btn[0].updateTexture(_gthis.trainTextures[station[0].trainSprite]);
					_gthis.colorTrainsInNetwork();
				};
			})(btn,station),this.trainTextures[station[0].trainSprite],null,null,null,"spr_trainselectorbutton",4);
			trainsContainer.addChild(btn[0]);
		}
		this.city.gui.windowInner.addChild(new gui_GUISpacing(this.city.gui.windowInner,new common_Point(2,6)));
	}
	,save: function(queue,shouldSaveDefinition) {
		if(shouldSaveDefinition == null) {
			shouldSaveDefinition = true;
		}
		Building.prototype.save.call(this,queue);
		if(shouldSaveDefinition) {
			queue.addString(buildings_TrainStation.saveDefinition);
		}
		var value = this.decorationOptionTop;
		if(queue.size + 4 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setInt32(queue.size,value);
		queue.size += 4;
		var value = this.decorationOptionBottom;
		if(queue.size + 4 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setInt32(queue.size,value);
		queue.size += 4;
		var value = this.minimumWaitBetweenTrains;
		if(queue.size + 4 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setInt32(queue.size,value);
		queue.size += 4;
		var value = this.currentWaitBetweenTrainsLeft;
		if(queue.size + 8 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 8) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setDouble(queue.size,value);
		queue.size += 8;
		var value = this.currentWaitBetweenTrainsRight;
		if(queue.size + 8 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 8) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setDouble(queue.size,value);
		queue.size += 8;
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
		var value = this.trainSprite;
		if(queue.size + 4 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 4) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setInt32(queue.size,value);
		queue.size += 4;
	}
	,load: function(queue,definition) {
		Building.prototype.load.call(this,queue);
		if(definition == null) {
			definition = queue.readString();
		}
		var loadMap = gamesave_GameSaveHelper.makeLoadMap(definition,queue);
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"decorationOptionTop")) {
			this.decorationOptionTop = loadMap.h["decorationOptionTop"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"decorationOptionBottom")) {
			this.decorationOptionBottom = loadMap.h["decorationOptionBottom"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"minimumWaitBetweenTrains")) {
			this.minimumWaitBetweenTrains = loadMap.h["minimumWaitBetweenTrains"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"currentWaitBetweenTrainsLeft")) {
			this.currentWaitBetweenTrainsLeft = loadMap.h["currentWaitBetweenTrainsLeft"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"currentWaitBetweenTrainsRight")) {
			this.currentWaitBetweenTrainsRight = loadMap.h["currentWaitBetweenTrainsRight"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"timesUsed")) {
			this.timesUsed = loadMap.h["timesUsed"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"timesUsedTo")) {
			this.timesUsedTo = loadMap.h["timesUsedTo"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"trainSprite")) {
			this.trainSprite = loadMap.h["trainSprite"];
		}
	}
	,__class__: buildings_TrainStation
});
