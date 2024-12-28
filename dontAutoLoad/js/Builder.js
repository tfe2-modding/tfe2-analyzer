var Builder = $hxClasses["Builder"] = function(city,stage,builderType,decorationAppearance,mirrored,decorationAppearanceColor,customHouseProperties) {
	this.buildablePositionsDisplayCacheValid = false;
	this.lastBuilt = -1;
	this.fixedSprite = null;
	this.fixedToPos = null;
	this.fixedToWorld = null;
	this.wasMouseHandled = true;
	this.extraSprites = [];
	this.isLimitedToNumber = -1;
	this.isLimitedToOnePerNCitizens = 0;
	this.isLimitedBuilding = false;
	this.isUniqueBuilding = false;
	this.city = city;
	this.builderType = builderType;
	this.decorationAppearance = decorationAppearance;
	this.decorationAppearanceColor = decorationAppearanceColor;
	this.customHouseProperties = customHouseProperties;
	this.mirrored = mirrored;
	switch(builderType._hx_index) {
	case 0:
		var buildingInfo = builderType.buildingInfo;
		var buildingType = builderType.buildingType;
		if(customHouseProperties != null) {
			var windowSprite = Resources.makeSprite("spr_customhouse_" + customHouseProperties.mainType,new common_Rectangle(66,0,20,20));
			this.sprite = new PIXI.Sprite();
			var sprite1 = Resources.makeSprite("spr_customhouse_" + customHouseProperties.mainType,new common_Rectangle(0,0,20,20));
			sprite1.tint = customHouseProperties.mainColor;
			this.sprite.addChild(sprite1);
			this.sprite.addChild(windowSprite);
			windowSprite.tint = customHouseProperties.windowColor;
		} else if(buildingInfo.specialInfo.indexOf("has_multi_decor_spec") != -1) {
			this.sprite = Resources.makeSprite(Lambda.find(buildingInfo.specialInfo,function(si) {
				return StringTools.startsWith(si,"multi_decor_spec");
			}).split(":")[1].split(",")[decorationAppearance] + "@0,0,20,20");
		} else {
			this.sprite = Resources.makeSprite(buildingInfo.onBuildSprite == null ? Reflect.field(buildingType,"spriteName") : buildingInfo.onBuildSprite,new common_Rectangle(decorationAppearance * 22,0,20,20));
		}
		if(decorationAppearanceColor >= 0) {
			this.sprite.tint = decorationAppearanceColor;
		}
		this.originalCost = Materials.fromBuildingInfo(buildingInfo);
		this.isUniqueBuilding = buildingInfo.specialInfo.indexOf("unique") != -1;
		this.isLimitedBuilding = buildingInfo.specialInfo.indexOf("limited") != -1;
		if(this.isLimitedBuilding) {
			this.isLimitedToOnePerNCitizens = Std.parseInt(Lambda.find(buildingInfo.specialInfo,function(si) {
				return StringTools.startsWith(si,"limitedToCitizens");
			}).split(":")[1]);
		}
		if(this.isUniqueBuilding && city.upgrades.vars.hasGalacticLibrary) {
			if(buildingInfo.specialInfo.indexOf("notUniqueIfGalacticLibrary") != -1) {
				this.isUniqueBuilding = false;
				this.isLimitedBuilding = true;
				this.isLimitedToNumber = 2;
			}
		}
		break;
	case 1:
		var decorationInfo = builderType.decorationInfo;
		this.sprite = Resources.makeSprite("" + decorationInfo.textureName + "@0,0,20,20");
		this.originalCost = Materials.fromDecorationInfo(decorationInfo);
		break;
	case 2:
		var resourceInfo = builderType.resourceInfo;
		this.sprite = Resources.makeSprite("" + resourceInfo.textureName);
		this.originalCost = Materials.fromWorldResourceInfo(resourceInfo);
		break;
	case 3:
		var wr = builderType.worldResource;
		this.sprite = new PIXI.Sprite(wr.sprite.texture);
		break;
	case 4:
		this.sprite = Resources.makeSprite("spr_floatingplatform");
		break;
	case 5:
		var bi = builderType.bridgeInfo;
		this.sprite = Resources.makeSprite(bi.textureName,new common_Rectangle(66,0,20,20));
		this.originalCost = Materials.fromBridgeInfo(bi);
		break;
	}
	if(mirrored) {
		this.sprite.scale.set(-1,1);
		this.sprite.anchor.set(1,0);
	}
	this.stage = stage;
	this.builderSecondaryHelpSprite = Resources.makeSprite("spr_insertbuildinghere");
	stage.addChild(this.sprite);
	stage.addChild(this.builderSecondaryHelpSprite);
	this.sprite.alpha = 0;
	this.builderSecondaryHelpSprite.alpha = 0;
	this.touchAlpha = 0;
	this.showContinuousTooltip();
};
Builder.__name__ = "Builder";
Builder.canRemoveFromLRPerspective = function(advancedMode,building,city) {
	if(advancedMode) {
		if(building.leftBuilding != null && pathfinder_DirectConnectionFinder.find(city,building.leftBuilding,function(bld) {
			return bld.worldPosition.y == 0;
		},function(bld) {
			return bld == building;
		}) == null) {
			return false;
		}
		if(building.rightBuilding != null && pathfinder_DirectConnectionFinder.find(city,building.rightBuilding,function(bld) {
			return bld.worldPosition.y == 0;
		},function(bld) {
			return bld == building;
		}) == null) {
			return false;
		}
		return true;
	}
	if(building.leftBuilding == null || building.leftBuilding.worldPosition.y == 0 || building.leftBuilding.bottomBuilding != null || city.miscCityElements.collidesSpecific(new common_Point(building.leftBuilding.position.x,building.leftBuilding.position.y + 20),miscCityElements_FloatingPlatform)) {
		if(!(building.rightBuilding == null || building.rightBuilding.worldPosition.y == 0 || building.rightBuilding.bottomBuilding != null)) {
			return city.miscCityElements.collidesSpecific(new common_Point(building.rightBuilding.position.x,building.rightBuilding.position.y + 20),miscCityElements_FloatingPlatform);
		} else {
			return true;
		}
	} else {
		return false;
	}
};
Builder.canRemoveLeavingHoleFromStructuralPerspective = function(advancedMode,building,city) {
	if(advancedMode) {
		if(building.leftBuilding != null && pathfinder_DirectConnectionFinder.find(city,building.leftBuilding,function(bld) {
			return bld.worldPosition.y == 0;
		},function(bld) {
			return bld == building;
		}) == null) {
			return false;
		}
		if(building.rightBuilding != null && pathfinder_DirectConnectionFinder.find(city,building.rightBuilding,function(bld) {
			return bld.worldPosition.y == 0;
		},function(bld) {
			return bld == building;
		}) == null) {
			return false;
		}
		if(building.rightBuilding != null && pathfinder_DirectConnectionFinder.find(city,building.topBuilding,function(bld) {
			return bld.worldPosition.y == 0;
		},function(bld) {
			return bld == building;
		}) == null) {
			return false;
		}
		return true;
	}
	if((building.leftBuilding == null || building.leftBuilding.worldPosition.y == 0 || building.leftBuilding.bottomBuilding != null || city.miscCityElements.collidesSpecific(new common_Point(building.leftBuilding.position.x,building.leftBuilding.position.y + 20),miscCityElements_FloatingPlatform)) && (building.rightBuilding == null || building.rightBuilding.worldPosition.y == 0 || building.rightBuilding.bottomBuilding != null || city.miscCityElements.collidesSpecific(new common_Point(building.rightBuilding.position.x,building.rightBuilding.position.y + 20),miscCityElements_FloatingPlatform)) && (building.leftBuilding == null && building.rightBuilding == null && building.topBuilding == null || building.leftBuilding != null && building.rightBuilding != null || building.topBuilding == null)) {
		if(building.topBuilding != null) {
			if(building.topBuilding.leftBuilding != null) {
				return building.topBuilding.rightBuilding != null;
			} else {
				return false;
			}
		} else {
			return true;
		}
	} else {
		return false;
	}
};
Builder.prototype = {
	get_buildingToBuild: function() {
		var _g = this.builderType;
		if(_g._hx_index == 0) {
			var _g1 = _g.buildingInfo;
			var b = _g.buildingType;
			return b;
		} else {
			return null;
		}
	}
	,fixBuilder: function(fixedToWorld,fixedToPos) {
		this.fixedToWorld = fixedToWorld;
		this.fixedToPos = fixedToPos;
		if(fixedToWorld == null || fixedToPos == null) {
			if(this.fixedSprite != null) {
				this.fixedSprite.destroy();
				this.fixedSprite = null;
			}
		} else {
			this.fixedSprite = Resources.makeSprite("spr_forcedbuildinglocation");
			this.stage.addChild(this.fixedSprite);
			this.fixedSprite.position.set(fixedToWorld.rect.x + 20 * fixedToPos - 1,fixedToWorld.rect.y - 20 - 31);
		}
	}
	,invalidateCache: function() {
		this.buildablePositionsDisplayCacheValid = false;
	}
	,isCacheValid: function() {
		return this.buildablePositionsDisplayCacheValid;
	}
	,prevalidateCache: function() {
		this.buildablePositionsDisplayCacheValid = true;
	}
	,update: function(timeMod) {
		this.lastBuilt += timeMod;
		if(this.city.game.isMobile && !this.buildablePositionsDisplayCacheValid) {
			var container = this.city.builderHighlightStage;
			var i = container.children.length - 1;
			while(i >= 0) {
				container.children[i].destroy();
				--i;
			}
		}
		if(!this.wasMouseHandled) {
			this.sprite.alpha = 0;
		}
		if(this.touchAlpha > 0) {
			this.touchAlpha = Math.max(this.touchAlpha - timeMod / 30,0);
		}
		this.wasMouseHandled = false;
		if(this.city.game.mouse.rightPressed) {
			this.cancel();
		}
		this.showContinuousTooltip();
		if(this.city.buildingMode != BuildingMode.Destroy && this.city.buildingMode != BuildingMode.DestroyLeavingHole && this.buildingPrerequirementsValid()) {
			var prereqsvalid = this.city.game.isMobile && !this.city.game.mouse.hasSpecificClaim(this);
			if(prereqsvalid && !this.buildablePositionsDisplayCacheValid) {
				var higherCheckPositions = new haxe_ds_ObjectMap();
				var _g = 0;
				var _g1 = this.city.worlds;
				while(_g < _g1.length) {
					var world = _g1[_g];
					++_g;
					var bestY = 10000000;
					var bestWorld = null;
					var leftPos = world.rect.x - 20;
					var leftPosOnWorld = 0;
					var _g2 = 0;
					var _g3 = this.city.worlds;
					while(_g2 < _g3.length) {
						var world2 = _g3[_g2];
						++_g2;
						if(world2.rect.y < bestY && world2.rect.y > world.rect.y && leftPos >= world2.rect.x && leftPos < world2.rect.get_x2()) {
							bestWorld = world2;
							leftPosOnWorld = (leftPos - bestWorld.rect.x) / 20 | 0;
							bestY = world2.rect.y;
						}
					}
					if(bestWorld != null) {
						var worldHCPs = higherCheckPositions.h[bestWorld.__id__];
						if(worldHCPs == null) {
							worldHCPs = [];
							higherCheckPositions.set(bestWorld,worldHCPs);
						}
						worldHCPs.push({ world : bestWorld, x : leftPosOnWorld, checkUntil : ((bestWorld.rect.y - world.rect.y) / 20 | 0) + world.permanents[0].length});
					}
					var bestY1 = 10000000;
					var bestWorld1 = null;
					var rightPos = world.rect.x + world.rect.width;
					var rightPosOnWorld = 0;
					var _g4 = 0;
					var _g5 = this.city.worlds;
					while(_g4 < _g5.length) {
						var world21 = _g5[_g4];
						++_g4;
						if(world21.rect.y < bestY1 && world21.rect.y > world.rect.y && rightPos >= world21.rect.x && rightPos < world21.rect.get_x2()) {
							bestWorld1 = world21;
							bestY1 = world21.rect.y;
							rightPosOnWorld = (rightPos - bestWorld1.rect.x) / 20 | 0;
						}
					}
					if(bestWorld1 != null) {
						var worldHCPs1 = higherCheckPositions.h[bestWorld1.__id__];
						if(worldHCPs1 == null) {
							worldHCPs1 = [];
							higherCheckPositions.set(bestWorld1,worldHCPs1);
						}
						worldHCPs1.push({ world : bestWorld1, x : rightPosOnWorld, checkUntil : ((bestWorld1.rect.y - world.rect.y) / 20 | 0) + world.permanents[world.permanents.length - 1].length});
					}
				}
				var cityEdges = this.city.getCityEdges();
				var _g = [];
				var _g1 = 0;
				var _g2 = (cityEdges.maxX - cityEdges.minX) / 20 | 0;
				while(_g1 < _g2) {
					var x = _g1++;
					_g.push([]);
				}
				var floatingPlatformsByX = _g;
				var _g = 0;
				var _g1 = this.city.miscCityElements.allMiscElements;
				while(_g < _g1.length) {
					var msc = _g1[_g];
					++_g;
					if(msc.is(miscCityElements_FloatingPlatform)) {
						var fp = msc;
						floatingPlatformsByX[(fp.rect.x - cityEdges.minX) / 20 | 0].push(fp);
					}
				}
				var _g = 0;
				var _g1 = this.city.worlds;
				while(_g < _g1.length) {
					var world = _g1[_g];
					++_g;
					if(this.fixedToWorld != null && world != this.fixedToWorld) {
						continue;
					}
					var _g2 = this.builderType;
					switch(_g2._hx_index) {
					case 0:
						var buildingInfo = _g2.buildingInfo;
						var buildingType = _g2.buildingType;
						var _g3 = 0;
						var _g4 = world.permanents.length;
						while(_g3 < _g4) {
							var x = [_g3++];
							if(this.fixedToPos != null && x[0] != this.fixedToPos) {
								continue;
							}
							var checkYPositionsTo = world.permanents[x[0]].length + 1;
							if(x[0] >= 1) {
								var val2 = world.permanents[x[0] - 1].length;
								if(val2 > checkYPositionsTo) {
									checkYPositionsTo = val2;
								}
							}
							var worldPos = higherCheckPositions.h[world.__id__];
							var anyHCP = worldPos == null ? null : common_ArrayExtensions.whereMax(worldPos,(function(x) {
								return function(hcp) {
									return x[0] == hcp.x;
								};
							})(x),(function() {
								return function(hcp) {
									return hcp.checkUntil;
								};
							})());
							if(anyHCP != null) {
								var val21 = anyHCP.checkUntil;
								if(val21 > checkYPositionsTo) {
									checkYPositionsTo = val21;
								}
							}
							var _g5 = 0;
							var _g6 = checkYPositionsTo;
							while(_g5 < _g6) {
								var y = _g5++;
								if(this.canBuildBuilding(world,x[0],y,buildingType,buildingInfo) == BuildPossibility.BuildingOK) {
									var canBuildHereDisplay = Resources.makeSprite("spr_buildhereoutline");
									canBuildHereDisplay.position.set(world.rect.x + x[0] * 20,world.rect.y - (y + 1) * 20);
									this.city.builderHighlightStage.addChild(canBuildHereDisplay);
									if(this.buildingModeCanReplace() && world.permanents[x[0]].length > y && world.permanents[x[0]][y] != null) {
										canBuildHereDisplay.tint = 16776960;
									}
								}
							}
							var floatingPlatformsArrayPos = (x[0] * 20 + world.rect.x - cityEdges.minX) / 20 | 0;
							if(floatingPlatformsArrayPos >= 0 && floatingPlatformsArrayPos < floatingPlatformsByX.length) {
								var _g7 = 0;
								var _g8 = floatingPlatformsByX[floatingPlatformsArrayPos];
								while(_g7 < _g8.length) {
									var fp = _g8[_g7];
									++_g7;
									var y1 = (world.rect.y - fp.rect.y) / 20 | 0;
									if(y1 > 0 && this.canBuildBuilding(world,x[0],y1,buildingType,buildingInfo) == BuildPossibility.BuildingOK) {
										var canBuildHereDisplay1 = Resources.makeSprite("spr_buildhereoutline");
										canBuildHereDisplay1.position.set(fp.rect.x,fp.rect.y - 20);
										this.city.builderHighlightStage.addChild(canBuildHereDisplay1);
										if(this.buildingModeCanReplace() && world.permanents[x[0]].length > y1 && world.permanents[x[0]][y1] != null) {
											canBuildHereDisplay1.tint = 16776960;
										}
									}
								}
							}
						}
						break;
					case 1:
						var _g9 = _g2.decorationInfo;
						if(!world.canBuildOnSurface()) {
							continue;
						}
						var _g10 = 0;
						var _g11 = world.permanents.length;
						while(_g10 < _g11) {
							var x1 = _g10++;
							if(this.fixedToPos != null && x1 != this.fixedToPos) {
								continue;
							}
							var thesePermanents = world.permanents[x1];
							if(thesePermanents.length == 0 || thesePermanents[0] == null) {
								var canBuildHereDisplay2 = Resources.makeSprite("spr_buildhereoutline");
								canBuildHereDisplay2.position.set(world.rect.x + x1 * 20,world.rect.y - 20);
								this.city.builderHighlightStage.addChild(canBuildHereDisplay2);
							}
						}
						break;
					case 2:
						var _g12 = _g2.resourceInfo;
						if(!world.canBuildOnSurface()) {
							continue;
						}
						var _g13 = 0;
						var _g14 = world.permanents.length;
						while(_g13 < _g14) {
							var x2 = _g13++;
							if(this.fixedToPos != null && x2 != this.fixedToPos) {
								continue;
							}
							var thesePermanents1 = world.permanents[x2];
							if(thesePermanents1.length == 0 || thesePermanents1[0] == null) {
								var canBuildHereDisplay3 = Resources.makeSprite("spr_buildhereoutline");
								canBuildHereDisplay3.position.set(world.rect.x + x2 * 20,world.rect.y - 20);
								this.city.builderHighlightStage.addChild(canBuildHereDisplay3);
							}
						}
						break;
					case 3:
						var _g15 = _g2.worldResource;
						if(!world.canBuildOnSurface()) {
							continue;
						}
						var _g16 = 0;
						var _g17 = world.permanents.length;
						while(_g16 < _g17) {
							var x3 = _g16++;
							if(this.fixedToPos != null && x3 != this.fixedToPos) {
								continue;
							}
							var thesePermanents2 = world.permanents[x3];
							if(thesePermanents2.length == 0 || thesePermanents2[0] == null) {
								var canBuildHereDisplay4 = Resources.makeSprite("spr_buildhereoutline");
								canBuildHereDisplay4.position.set(world.rect.x + x3 * 20,world.rect.y - 20);
								this.city.builderHighlightStage.addChild(canBuildHereDisplay4);
							}
						}
						break;
					default:
					}
				}
				var tmp = this.builderType._hx_index == 4;
				this.buildablePositionsDisplayCacheValid = true;
			} else if(!prereqsvalid) {
				var container = this.city.builderHighlightStage;
				var i = container.children.length - 1;
				while(i >= 0) {
					container.children[i].destroy();
					--i;
				}
				this.buildablePositionsDisplayCacheValid = false;
			}
		} else if(this.buildablePositionsDisplayCacheValid) {
			var container = this.city.builderHighlightStage;
			var i = container.children.length - 1;
			while(i >= 0) {
				container.children[i].destroy();
				--i;
			}
			this.buildablePositionsDisplayCacheValid = false;
		}
	}
	,showContinuousTooltip: function() {
		if(this.city.game.isMobile) {
			var _g = this.builderType;
			switch(_g._hx_index) {
			case 0:
				var buildingInfo = _g.buildingInfo;
				var buildingType = _g.buildingType;
				if(this.customHouseProperties != null) {
					this.city.gui.buildingButtons.showBuildingTooltipCustomHouse(this.customHouseProperties,this,true);
				} else {
					this.city.gui.buildingButtons.showBuildingTooltip(buildingInfo,buildingType,this,true,this.decorationAppearanceColor);
				}
				break;
			case 1:
				var decorationInfo = _g.decorationInfo;
				this.city.gui.buildingButtons.showDecorationTooltip(decorationInfo,this,true);
				break;
			case 2:
				var worldResourceInfo = _g.resourceInfo;
				this.city.gui.buildingButtons.showWorldResourceTooltip(worldResourceInfo,this,true);
				break;
			case 4:
				this.city.gui.buildingButtons.showFloatingPlatformTooltip(this,true);
				break;
			case 5:
				var bridgeInfo = _g.bridgeInfo;
				this.city.gui.buildingButtons.showBridgeTooltip(bridgeInfo,this,true);
				break;
			default:
			}
		}
	}
	,handleMouse: function(mouse) {
		if(this.city.buildingMode == BuildingMode.Destroy || this.city.buildingMode == BuildingMode.DestroyLeavingHole) {
			return false;
		}
		this.wasMouseHandled = true;
		this.sprite.alpha = 0.2;
		var newX = Math.floor(mouse.get_cityX() / 20) * 20;
		var newY = Math.floor(mouse.get_cityY() / 20) * 20;
		this.sprite.position.set(newX,newY);
		this.builderSecondaryHelpSprite.position.set(newX,newY);
		this.sprite.tint = 16777215;
		if(this.decorationAppearanceColor >= 0) {
			this.sprite.tint = this.decorationAppearanceColor;
		}
		this.builderSecondaryHelpSprite.alpha = 0;
		var _g = this.builderType;
		var tmp;
		if(_g._hx_index == 5) {
			var _g1 = _g.bridgeInfo;
			tmp = true;
		} else {
			tmp = false;
		}
		if(tmp) {
			var _g = 0;
			var _g1 = this.extraSprites;
			while(_g < _g1.length) {
				var spr = _g1[_g];
				++_g;
				spr.destroy();
			}
			this.extraSprites = [];
		}
		var _g = this.builderType;
		var tmp;
		if(_g._hx_index == 0) {
			var _g1 = _g.buildingInfo;
			var _g1 = _g.buildingType;
			tmp = true;
		} else {
			tmp = false;
		}
		if(this.city.miscCityElements.isUnbuildable(new common_Point(newX,newY),tmp)) {
			return false;
		}
		if(this.buildingPrerequirementsValid()) {
			if(this.builderType._hx_index == 4) {
				if(this.canPlaceMiscCityElement(newX,newY)) {
					this.sprite.alpha = 0.5;
					var xPos = mouse.get_cityX() / 20 | 0;
					var yPos = mouse.get_cityY() / 20 | 0;
					var claim;
					if(this.buildingModeCanDrag()) {
						claim = mouse.claimMouse(this,"",true,true,true);
						mouse.hasStrongClaim = true;
						mouse.strongClaimOnUpdate = null;
					} else {
						claim = mouse.claimMouse(this,"" + xPos + " " + yPos,false);
					}
					switch(claim._hx_index) {
					case 0:
						this.sprite.alpha = 0.8;
						return true;
					case 1:
						this.buildFloatingPlatform(newX,newY);
						return true;
					default:
					}
				} else {
					this.sprite.alpha = 0.1;
				}
				return false;
			} else {
				var _g = this.builderType;
				if(_g._hx_index == 5) {
					var info = _g.bridgeInfo;
					if(this.canPlaceMiscCityElement(newX,newY)) {
						var bridgeRect = this.getBridgeRect(info,newX,newY);
						if(bridgeRect != null) {
							var xPos = mouse.get_cityX() / 20 | 0;
							var yPos = mouse.get_cityY() / 20 | 0;
							var claim;
							if(this.buildingModeCanDrag()) {
								claim = mouse.claimMouse(this,"",true,true,true);
								mouse.hasStrongClaim = true;
								mouse.strongClaimOnUpdate = null;
							} else {
								claim = mouse.claimMouse(this,"" + xPos + " " + yPos,false);
							}
							var tex = Resources.getTexturesBySizeInverse(info.textureName,20,20,2)[0];
							var numSprites = bridgeRect.width / 20 | 0;
							var _g = 0;
							var _g1 = numSprites;
							while(_g < _g1) {
								var xx = _g++;
								var spr = new PIXI.Sprite(tex[(xx == 0 ? 1 : 0) + (xx == numSprites - 1 ? 2 : 0)]);
								spr.position.set(bridgeRect.x + (xx + 1) * 20,bridgeRect.y);
								this.extraSprites.push(spr);
								spr.alpha = 0.5;
								this.stage.addChild(spr);
							}
							this.sprite.alpha = 0;
							switch(claim._hx_index) {
							case 0:
								var _g = 0;
								var _g1 = this.extraSprites;
								while(_g < _g1.length) {
									var spr = _g1[_g];
									++_g;
									spr.alpha = 0.8;
								}
								return true;
							case 1:
								this.buildBridge(info,newX,newY);
								return true;
							default:
							}
						}
					}
					return false;
				}
			}
			var cost = this.calculateCurrentCost();
			var anyBuilt = false;
			var _g = 0;
			var _g1 = this.city.worlds;
			while(_g < _g1.length) {
				var world = _g1[_g];
				++_g;
				if(this.fixedToWorld != null && world != this.fixedToWorld) {
					continue;
				}
				var tmp;
				var val = mouse.get_cityX();
				var lower = world.rect.x;
				var upper = world.rect.get_x2();
				if(!(val >= lower && val < upper)) {
					var tmp1;
					if(this.buildingModeCanDrag() && mouse.hasSpecificClaim(this)) {
						var val1 = mouse.prevCityPosition.x;
						var lower1 = world.rect.x;
						var upper1 = world.rect.get_x2();
						if(!(val1 >= lower1 && val1 < upper1)) {
							var val2 = world.rect.x;
							var lower2 = Math.min(mouse.prevCityPosition.x,mouse.get_cityX());
							var upper2 = Math.max(mouse.prevCityPosition.x,mouse.get_cityX());
							tmp1 = val2 >= lower2 && val2 < upper2;
						} else {
							tmp1 = true;
						}
					} else {
						tmp1 = false;
					}
					if(tmp1) {
						var _g2 = this.builderType;
						if(_g2._hx_index == 0) {
							var _g3 = _g2.buildingInfo;
							var _g4 = _g2.buildingType;
							tmp = true;
						} else {
							tmp = false;
						}
					} else {
						tmp = false;
					}
				} else {
					tmp = true;
				}
				if(tmp && mouse.get_cityY() < world.rect.y) {
					var xPos = (mouse.get_cityX() - world.rect.x) / 20 | 0;
					if(this.fixedToPos != null && xPos != this.fixedToPos) {
						break;
					}
					var thesePermanents = world.permanents[xPos];
					var yPos = (world.rect.y - mouse.get_cityY() - 1) / 20 | 0;
					var _g5 = this.builderType;
					switch(_g5._hx_index) {
					case 0:
						var buildingInfo = _g5.buildingInfo;
						var buildingType = _g5.buildingType;
						if(this.buildingModeCanDrag() && mouse.hasSpecificClaim(this)) {
							if(this.tryBuildingMulti(world,buildingType,buildingInfo,mouse)) {
								anyBuilt = true;
							}
						} else {
							var buildStatus = this.canBuildBuilding(world,xPos,yPos,buildingType,buildingInfo);
							if(buildStatus == BuildPossibility.BuildingOK) {
								if(this.tryBuildingAt(world,xPos,yPos,buildingType,buildingInfo,mouse)) {
									return true;
								}
							} else if(buildStatus == BuildPossibility.BuildingInWorld) {
								this.sprite.tint = 16744576;
								if(mouse.isTouch) {
									var claim = mouse.claimMouse(this,xPos,false);
									if(claim == MouseState.Active) {
										this.touchAlpha = 1;
										this.sprite.alpha = this.touchAlpha;
										return true;
									}
								}
							} else if(buildStatus == BuildPossibility.WorldNotAllowed) {
								var claim1 = mouse.claimMouse(this,xPos,false);
								if(claim1 == MouseState.Active) {
									world.onCannotBuild();
								}
							}
						}
						break;
					case 1:
						var decorationInfo = _g5.decorationInfo;
						if(!world.canBuildOnSurface()) {
							if(yPos == 0) {
								var claim2 = mouse.claimMouse(this,xPos,false);
								if(claim2 == MouseState.Active) {
									world.onCannotBuild();
								}
							}
							continue;
						}
						if((thesePermanents.length == 0 || thesePermanents[0] == null) && yPos == 0) {
							this.sprite.alpha = 0.5;
							var claim3 = mouse.claimMouse(this,"" + xPos + " " + yPos,false);
							if(claim3 == MouseState.Confirmed) {
								var decorationHere = world.decorations[xPos];
								if(decorationInfo.textureName == "spr_removedecoration") {
									world.removeDecoration(xPos);
								} else if(decorationHere != null && decorationHere.textureName == decorationInfo.textureName) {
									if(++decorationHere.subImage >= decorationHere.textures.length) {
										decorationHere.subImage = 0;
									}
									decorationHere.sprite.texture = decorationHere.textures[decorationHere.subImage];
								} else {
									world.setDecoration(decorationInfo.textureName,xPos);
								}
								this.city.materials.remove(cost);
								this.city.game.audio.playSound(this.city.game.audio.decorateSound);
								return true;
							} else if(claim3 == MouseState.Active) {
								this.sprite.alpha = 0.8;
								return true;
							}
						}
						break;
					case 2:
						var resourceInfo = _g5.resourceInfo;
						if(!world.canBuildOnSurface()) {
							if(yPos == 0) {
								var claim4 = mouse.claimMouse(this,xPos,false);
								if(claim4 == MouseState.Active) {
									world.onCannotBuild();
								}
							}
							continue;
						}
						var allWorldResources = true;
						var _g6 = 0;
						var _g7 = world.permanents.length;
						while(_g6 < _g7) {
							var i = _g6++;
							if(i != xPos && (world.permanents[i].length == 0 || world.permanents[i][0] == null || !world.permanents[i][0].is(WorldResource))) {
								allWorldResources = false;
							}
						}
						if((thesePermanents.length == 0 || thesePermanents[0] == null) && yPos == 0) {
							this.sprite.alpha = 0.5;
							var claim5 = mouse.claimMouse(this,"" + xPos + " " + yPos,false);
							if(claim5 == MouseState.Confirmed) {
								if(allWorldResources) {
									this.city.gui.showSimpleWindow(common_Localize.lo("building_prevented_would_block_world"),null,true);
								} else {
									var name = "worldResources." + resourceInfo.className;
									var newResource = world.createWorldResource($hxClasses[name],xPos);
									if(((newResource) instanceof worldResources_LimitedWorldResource)) {
										var lwr = newResource;
										if(resourceInfo.initialResources == null) {
											lwr.materialsLeft = 0;
										} else {
											lwr.materialsLeft = resourceInfo.initialResources;
										}
										if(resourceInfo.initialGrow != null) {
											lwr.regrowProgress = resourceInfo.initialGrow;
										}
										lwr.updateTexture();
									}
									this.city.materials.remove(cost);
									this.city.game.audio.playSound(this.city.game.audio.decorateSound);
									this.city.connections.updateCityConnections();
									this.city.simulation.updatePathfinder(false);
								}
								return true;
							} else if(claim5 == MouseState.Active) {
								this.sprite.alpha = 0.8;
								return true;
							}
						}
						break;
					case 3:
						var thisResource = _g5.worldResource;
						if(!world.canBuildOnSurface()) {
							if(yPos == 0) {
								var claim6 = mouse.claimMouse(this,xPos,false);
								if(claim6 == MouseState.Active) {
									world.onCannotBuild();
								}
							}
							continue;
						}
						if((thesePermanents.length == 0 || thesePermanents[0] == null) && yPos == 0 && world.canBuildOnSurface()) {
							this.sprite.alpha = 0.5;
							var claim7 = mouse.claimMouse(this,"" + xPos + " " + yPos,false);
							if(claim7 == MouseState.Confirmed) {
								var _g8 = 0;
								var _g9 = this.city.simulation.citizens;
								while(_g8 < _g9.length) {
									var citizen = _g9[_g8];
									++_g8;
									if(citizen.inPermanent == thisResource) {
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
									}
								}
								if(thisResource.world.permanents[thisResource.worldPosition.x].length == 1) {
									thisResource.world.permanents[thisResource.worldPosition.x].splice(0,1);
								} else {
									thisResource.world.permanents[thisResource.worldPosition.x][0] = null;
								}
								thisResource.world = world;
								thisResource.worldPosition.x = xPos;
								thisResource.position.x = world.rect.x + xPos * 20;
								thisResource.position.y = world.rect.y - 20;
								thisResource.positionSprites();
								thesePermanents[0] = thisResource;
								thisResource.world.removeDecoration(xPos);
								this.city.game.audio.playSound(this.city.game.audio.buildSound);
								this.city.connections.updateCityConnections();
								this.city.simulation.updatePathfinder(true);
								return true;
							} else if(claim7 == MouseState.Active) {
								this.sprite.alpha = 0.8;
								return true;
							}
						}
						break;
					case 4:
						break;
					case 5:
						var _g10 = _g5.bridgeInfo;
						break;
					}
				}
			}
			if(anyBuilt) {
				return true;
			}
		} else {
			this.sprite.tint = 16744576;
			this.sprite.alpha = 0.6;
		}
		if(this.city.cityView.isDraggingView) {
			this.sprite.alpha = 0;
		} else if(mouse.isTouch) {
			this.sprite.alpha = this.touchAlpha;
		}
		return false;
	}
	,buildFloatingPlatform: function(xPos,yPos) {
		var cost = this.calculateCurrentCost();
		this.city.materials.remove(cost);
		this.city.game.audio.playSound(this.city.game.audio.buildSound);
		this.city.miscCityElements.addElement(new miscCityElements_FloatingPlatform(this.city,new common_Point(xPos,yPos)));
		var bottomWorld = common_ArrayExtensions.whereMax(this.city.worlds,function(wrld) {
			return wrld.rect.height == 0;
		},function(wrld) {
			return wrld.rect.width;
		});
		if(xPos < bottomWorld.rect.x) {
			bottomWorld.resizeInvisibleWorld(xPos,bottomWorld.rect.width + (bottomWorld.rect.x - xPos));
		} else if(xPos >= bottomWorld.rect.x) {
			bottomWorld.resizeInvisibleWorld(bottomWorld.rect.x,xPos - bottomWorld.rect.x + 20);
		}
		this.city.connections.updateCityConnections();
		this.city.simulation.updatePathfinder(true);
	}
	,buildBridge: function(bridgeInfo,xPos,yPos) {
		var cost = this.calculateCurrentCost();
		this.city.materials.remove(cost);
		this.city.game.audio.playSound(this.city.game.audio.buildSound);
		var name = "miscCityElements." + bridgeInfo.className;
		this.city.miscCityElements.addElement(Type.createInstance($hxClasses[name],[this.city,new common_Point(xPos,yPos)]));
		this.city.connections.updateCityConnections();
		this.city.simulation.updatePathfinder(true);
		var name = "miscCityElements." + bridgeInfo.className;
		this.city.progress.unlocks.research($hxClasses[name]);
	}
	,tryBuildingMulti: function(world,buildingType,buildingInfo,mouse) {
		var prevPos = mouse.prevCityPosition;
		var _this = mouse.cityPosition;
		var _this_x = _this.x - prevPos.x;
		var _this_y = _this.y - prevPos.y;
		var dif = new common_FPoint(_this_x,_this_y);
		var len = dif.get_length();
		if(Math.max(Math.abs(dif.x),Math.abs(dif.y)) > 0) {
			var withFloat = Math.max(Math.abs(dif.x),Math.abs(dif.y));
			dif = new common_FPoint(dif.x / withFloat,dif.y / withFloat);
		}
		var anyOk = false;
		var cur = new common_FPoint(0,0);
		while(cur.get_length() <= len) {
			var cityX = prevPos.x + cur.x;
			var cityY = prevPos.y + cur.y;
			var xPos = Math.floor(cityX - world.rect.x) / 20 | 0;
			var yPos = Math.floor(world.rect.y - cityY - 1) / 20 | 0;
			if(xPos >= 0 && xPos < world.permanents.length) {
				if(this.fixedToPos != null && xPos != this.fixedToPos) {
					break;
				}
				var buildStatus = this.canBuildBuilding(world,xPos,yPos,buildingType,buildingInfo);
				if(buildStatus == BuildPossibility.BuildingOK && this.buildingPrerequirementsValid()) {
					if(this.tryBuildingAt(world,xPos,yPos,buildingType,buildingInfo,mouse)) {
						anyOk = true;
					}
				}
			}
			if(dif.get_length() < 0.0001) {
				return anyOk;
			}
			while(xPos == (Math.floor(prevPos.x + cur.x - world.rect.x) / 20 | 0) && yPos == (Math.floor(world.rect.y - prevPos.y - cur.y - 1) / 20 | 0)) cur = new common_FPoint(cur.x + dif.x,cur.y + dif.y);
		}
		return anyOk;
	}
	,tryBuildingAt: function(world,xPos,yPos,buildingType,buildingInfo,mouse) {
		var _gthis = this;
		var cost = this.calculateCurrentCost();
		var thesePermanents = world.permanents[xPos];
		this.sprite.alpha = 0.5;
		var replaceBuilding = false;
		var insertBuilding = false;
		if(this.buildingModeCanReplace()) {
			replaceBuilding = yPos != thesePermanents.length && thesePermanents[yPos] != null;
		} else {
			insertBuilding = yPos != thesePermanents.length && thesePermanents[yPos] != null;
		}
		if(insertBuilding) {
			this.builderSecondaryHelpSprite.alpha = 1;
			this.sprite.tint = 12632256;
			if(this.decorationAppearanceColor >= 0) {
				this.sprite.tint = this.decorationAppearanceColor;
			}
			this.builderSecondaryHelpSprite.texture = Resources.getTexture("spr_insertbuildinghere");
		} else if(replaceBuilding) {
			this.builderSecondaryHelpSprite.alpha = 1;
			this.sprite.tint = 16777215;
			if(this.decorationAppearanceColor >= 0) {
				this.sprite.tint = this.decorationAppearanceColor;
			}
			this.builderSecondaryHelpSprite.texture = Resources.getTexture("spr_replacebuildinghere");
		}
		var claim = MouseState.None;
		if(this.buildingModeCanDrag()) {
			claim = mouse.claimMouse(this,"",true,true,true);
			mouse.hasStrongClaim = true;
			mouse.strongClaimOnUpdate = null;
		} else {
			claim = mouse.claimMouse(this,"" + xPos + " " + yPos,false);
		}
		if(claim == MouseState.Confirmed) {
			var limitedUnlockNumber = this.city.progress.unlocks.getLimitedUnlockNumber(buildingType);
			if(!Config.hasPremium() && limitedUnlockNumber > 0) {
				var curNum = Lambda.count(this.city.permanents,function(pm) {
					return pm.is(_gthis.get_buildingToBuild());
				});
				if(curNum >= limitedUnlockNumber) {
					mobileSpecific_PremiumWall.showPremiumWall(this.city.gui,buildingInfo,this.city);
					return true;
				}
			}
			var shouldPayCost = true;
			if(replaceBuilding) {
				if(yPos < thesePermanents.length && thesePermanents[yPos] != null) {
					var thisBuildingClass = js_Boot.getClass(thesePermanents[yPos]);
					shouldPayCost = thisBuildingClass != this.get_buildingToBuild();
					if(thisBuildingClass == buildings_CustomHouse) {
						shouldPayCost = true;
					}
					if(shouldPayCost && thesePermanents[yPos].isBuilding) {
						thesePermanents[yPos].giveRecycleReward(shouldPayCost);
					}
					thesePermanents[yPos].destroyForReplacement();
				}
			} else if(insertBuilding) {
				var _g = yPos;
				var _g1 = thesePermanents.length;
				while(_g < _g1) {
					var i = _g++;
					var permanent = thesePermanents[i];
					if(permanent == null) {
						break;
					}
					permanent.position.y -= 20;
					permanent.worldPosition.y += 1;
				}
			}
			var newBuilding = world.build(this.get_buildingToBuild(),xPos,yPos);
			if(buildingInfo.specialInfo.indexOf("as_multi_decor") != -1) {
				newBuilding.customize(this.decorationAppearance,this.mirrored);
			}
			if(buildingInfo.specialInfo.indexOf("as_multi_decor_anycolor") != -1 && this.decorationAppearanceColor >= 0) {
				newBuilding.customizeColor(this.decorationAppearanceColor);
			}
			if(buildingInfo.className == "CustomHouse") {
				newBuilding.properties = this.customHouseProperties;
			}
			this.city.game.audio.playSound(this.city.game.audio.buildSound);
			if(shouldPayCost) {
				this.city.materials.remove(cost);
			}
			this.city.onBuildBuilding(insertBuilding,replaceBuilding,newBuilding,this.get_buildingToBuild(),yPos,thesePermanents);
			this.fixBuilder(null,null);
			if(this.lastBuilt < 0 || this.lastBuilt > 60) {
				this.city.progress.unlocks.checkBuildRelatedUnlocks();
				this.city.saveToBrowserStorageSoon();
			} else {
				this.city.progress.unlocks.checkBuildRelatedUnlocksSoon();
			}
			if(this.city.windowRelatedOnBuildOrDestroy != null) {
				this.city.windowRelatedOnBuildOrDestroy();
			}
			this.lastBuilt = 0;
			var tmp = newBuilding.is(buildings_TheMachine);
			return true;
		} else if(claim == MouseState.Active) {
			this.sprite.alpha = 0.8;
			return true;
		} else if(this.city.game.isMobile) {
			this.builderSecondaryHelpSprite.alpha = 0;
		}
		return false;
	}
	,buildingPrerequirementsValid: function() {
		var _gthis = this;
		var _g = this.builderType;
		switch(_g._hx_index) {
		case 3:
			var _g1 = _g.worldResource;
			return true;
		case 4:
			var currentCost = this.calculateCurrentCost();
			return this.city.materials.canAfford(currentCost);
		default:
		}
		if(this.get_buildingToBuild() != null && this.city.progress.unlocks.getUnlockState(this.get_buildingToBuild()) == progress_UnlockState.Researched) {
			this.originalCost.knowledge = 0;
		}
		var noUniqueProblem = !this.isUniqueBuilding || !common_ArrayExtensions.any(this.city.permanents,function(pm) {
			return pm.is(_gthis.get_buildingToBuild());
		});
		if(noUniqueProblem && this.isLimitedBuilding) {
			if(this.isLimitedToNumber > 0) {
				noUniqueProblem = Lambda.count(this.city.permanents,function(pm) {
					return pm.is(_gthis.get_buildingToBuild());
				}) < this.isLimitedToNumber;
			} else {
				noUniqueProblem = Lambda.count(this.city.permanents,function(pm) {
					return pm.is(_gthis.get_buildingToBuild());
				}) < Math.ceil(this.city.simulation.citizens.length / this.isLimitedToOnePerNCitizens);
			}
		}
		var currentCost = this.calculateCurrentCost();
		if(this.city.materials.canAfford(currentCost)) {
			return noUniqueProblem;
		} else {
			return false;
		}
	}
	,calculateCurrentCost: function() {
		var _g = this.builderType;
		switch(_g._hx_index) {
		case 0:
			var _g1 = _g.buildingType;
			var buildingInfo = _g.buildingInfo;
			if(this.customHouseProperties != null) {
				return this.customHouseProperties.getCost(this.city);
			}
			var cost = this.city.progress.buildingCost.getBuildingCost(buildingInfo);
			if(this.get_buildingToBuild() != null && this.city.progress.unlocks.getUnlockState(this.get_buildingToBuild()) == progress_UnlockState.Researched) {
				cost.knowledge = 0;
			}
			return cost;
		case 4:
			return Builder.floatingPlatformCost;
		case 5:
			var bridgeInfo = _g.bridgeInfo;
			var cost = this.originalCost.copy();
			var name = "miscCityElements." + bridgeInfo.className;
			var bridgeToBuild = $hxClasses[name];
			if(bridgeToBuild != null && this.city.progress.unlocks.getUnlockState(bridgeToBuild) == progress_UnlockState.Researched) {
				cost.knowledge = 0;
			}
			return cost;
		default:
			return this.originalCost;
		}
	}
	,canPlaceMiscCityElement: function(xPos,yPos) {
		var bottomWorld = common_ArrayExtensions.whereMax(this.city.worlds,function(wrld) {
			return wrld.rect.height == 0;
		},function(wrld) {
			return wrld.rect.width;
		});
		if(yPos > bottomWorld.rect.y - 20) {
			return false;
		}
		var _g = 0;
		var _g1 = this.city.worlds;
		while(_g < _g1.length) {
			var world = _g1[_g];
			++_g;
			if(xPos >= world.rect.get_x2() || xPos < world.rect.x) {
				continue;
			}
			var arr = world.permanents[(xPos - world.rect.x) / 20 | 0];
			var worldYPos = ((world.rect.y - yPos) / 20 | 0) - 1;
			if(arr.length > worldYPos && arr[worldYPos] != null) {
				return false;
			}
			if(world.rect.intersects(new common_Rectangle(xPos,yPos - 20,20,40)) && world.mask != null && world.mask[(xPos - world.rect.x) / 20 | 0][(yPos - world.rect.y) / 20 | 0]) {
				return false;
			}
			if(arr[arr.length - 1] != null && arr[arr.length - 1].isBuilding && arr[arr.length - 1].info.specialInfo.indexOf("cityTop") != -1 && worldYPos > arr.length) {
				return false;
			}
		}
		return true;
	}
	,getBridgeRect: function(bridgeInfo,xPos,yPos) {
		var maxSize = bridgeInfo.maxSize;
		var xx = xPos;
		var leftBuilding = null;
		var _g = 0;
		var _g1 = maxSize;
		while(_g < _g1) {
			var i = _g++;
			xx -= 20;
			var permanentHere = this.city.getPermanentAtPos(xx,yPos);
			if(permanentHere != null) {
				if(permanentHere.isBuilding && !permanentHere.cannotBuildOnTop) {
					leftBuilding = permanentHere;
				}
				break;
			}
		}
		xx += 20;
		if(leftBuilding != null) {
			var _g = 0;
			var _g1 = maxSize;
			while(_g < _g1) {
				var i = _g++;
				xx += 20;
				var permanentHere = this.city.getPermanentAtPos(xx,yPos);
				if(permanentHere != null) {
					if(permanentHere.isBuilding && !permanentHere.cannotBuildOnTop) {
						return new common_Rectangle(leftBuilding.position.x,yPos,permanentHere.position.x - leftBuilding.position.x - 20,20);
					}
					break;
				}
			}
		}
		return null;
	}
	,canBuildBuilding: function(world,xPos,yPos,buildingType,buildingInfo) {
		if(yPos == 0 && !world.canBuildOnSurface()) {
			return BuildPossibility.WorldNotAllowed;
		}
		if(!world.canBuildOnNotSurface(buildingInfo.className == "TheMachine" && !this.buildingModeCanReplace())) {
			return BuildPossibility.WorldNotAllowed;
		}
		if(buildingInfo.specialInfo.indexOf("buildOnGround") != -1) {
			if(yPos != 0) {
				return BuildPossibility.BuildingPositionImpossible;
			}
			if(world.permanents[xPos].length > 0 && world.permanents[xPos][yPos] != null) {
				return BuildPossibility.BuildingPositionImpossible;
			}
		}
		var thesePermanents = world.permanents[xPos];
		var yPosTop = world.rect.y - 20 * (thesePermanents.length + 1);
		var buildingXPos = world.rect.x + 20 * xPos;
		var buildingYPos = world.rect.y - 20 * (yPos + 1);
		var noBuildingsYet = thesePermanents.length == 0;
		var topIsBuilding = !noBuildingsYet && thesePermanents[thesePermanents.length - 1].isBuilding;
		var bottomIsNotNoBuilding = noBuildingsYet || (thesePermanents[0] == null || thesePermanents[0].isBuilding);
		var topIsRooftopBuilding = topIsBuilding && thesePermanents[thesePermanents.length - 1].cannotBuildOnTop;
		var yPosTopExcludingRooftop = topIsRooftopBuilding ? yPosTop + 20 : yPosTop;
		var specialAllowBridge = false;
		var specialAllowFloatingPlatform = false;
		var deleteKeyPressed = this.city.game.keyboard.down[46];
		var shiftKeyPressed = this.city.game.keyboard.down[16];
		var mightDoBuildingAssociatedAction = !deleteKeyPressed && !shiftKeyPressed;
		var buildingCanInsertNow = this.city.buildingMode == BuildingMode.Insert && mightDoBuildingAssociatedAction;
		var buildingCanReplaceNow = this.buildingModeCanReplace() && mightDoBuildingAssociatedAction;
		if(!buildingCanReplaceNow && yPos < thesePermanents.length && thesePermanents[yPos] != null && thesePermanents[yPos].isBuilding && thesePermanents[yPos].cannotBuildOnTop) {
			buildingCanInsertNow = true;
		}
		var isBuildingHere = yPos < thesePermanents.length && thesePermanents[yPos] != null && thesePermanents[yPos].isBuilding;
		var isRooftopBuildingHere = false;
		var buildingHereIsOfSameTypeAndThatMakesItImpossibleToBuild = false;
		var potentialLeftPerm = null;
		var potentialRightPerm = null;
		var hasLeftAndRightBuilding = false;
		if(isBuildingHere) {
			buildingHereIsOfSameTypeAndThatMakesItImpossibleToBuild = this.city.buildingMode == BuildingMode.DragReplace && js_Boot.getClass(thesePermanents[yPos]) == buildingType && (!js_Boot.__implements(thesePermanents[yPos],buildings_ICustomizableOnBuild) || thesePermanents[yPos].areSameCustomizations(this.decorationAppearance,this.mirrored,this.decorationAppearanceColor));
			isRooftopBuildingHere = thesePermanents[yPos].cannotBuildOnTop;
			var buildingHere = thesePermanents[yPos];
			if(buildingHere.info.specialInfo.indexOf("disableInsertReplaceOrBuildOnTop") != -1) {
				return BuildPossibility.BuildingPositionImpossible;
			}
		}
		if(this.city.progress.story.storyName == "cityofthekey" && isBuildingHere && buildingCanReplaceNow) {
			var thisPermanent = thesePermanents[yPos];
			if(thisPermanent.is(buildings_LandingSite) && (thisPermanent.position.x == 100 || thisPermanent.position.x == -100)) {
				return BuildPossibility.BuildingPositionImpossible;
			}
		}
		if(this.city.progress.story.storyName == "hippiecommune" && isBuildingHere && buildingCanReplaceNow) {
			var thisPermanent = thesePermanents[yPos];
			if(thisPermanent.is(buildings_BlossomHippieHQ)) {
				return BuildPossibility.BuildingPositionImpossible;
			}
		}
		if((yPos >= thesePermanents.length || thesePermanents[yPos] == null) && yPos > 0) {
			if(buildingInfo.specialInfo.indexOf("rooftop") == -1) {
				potentialLeftPerm = this.city.getPermanentAtPos(buildingXPos - 20,buildingYPos);
				potentialRightPerm = this.city.getPermanentAtPos(buildingXPos + 20,buildingYPos);
				var advancedBuildingAllowed = this.city.upgrades.vars.advancedBuildingAllowed;
				var buildingOnLeft = potentialLeftPerm != null && potentialLeftPerm.isBuilding;
				var buildingOnRight = potentialRightPerm != null && potentialRightPerm.isBuilding;
				var possiblyCanCreateBridge = false;
				if(advancedBuildingAllowed) {
					possiblyCanCreateBridge = buildingOnLeft || buildingOnRight;
				} else {
					possiblyCanCreateBridge = buildingOnLeft && buildingOnRight;
				}
				if(possiblyCanCreateBridge) {
					hasLeftAndRightBuilding = true;
					var potentialLeftBuilding = potentialLeftPerm;
					var potentialRightBuilding = potentialRightPerm;
					var anyHoleInLeftOrRight = false;
					if(advancedBuildingAllowed) {
						anyHoleInLeftOrRight = !(potentialLeftBuilding != null && !potentialLeftBuilding.cannotBuildOnTop || potentialRightBuilding != null && !potentialRightBuilding.cannotBuildOnTop);
					} else {
						anyHoleInLeftOrRight = potentialLeftBuilding.cannotBuildOnTop || potentialRightBuilding.cannotBuildOnTop;
					}
					if(!anyHoleInLeftOrRight) {
						specialAllowBridge = true;
					}
				}
			}
			if(!specialAllowBridge) {
				specialAllowFloatingPlatform = this.city.miscCityElements.collidesSpecific(new common_Point(buildingXPos,buildingYPos + 20),miscCityElements_FloatingPlatform);
			}
			if(specialAllowBridge || specialAllowFloatingPlatform) {
				if(common_ArrayExtensions.any(this.city.worlds,function(w) {
					if(w != world && buildingXPos >= w.rect.x && buildingXPos < w.rect.get_x2() && w.rect.y - buildingYPos > 0) {
						return w.rect.y - buildingYPos < world.rect.y - buildingYPos;
					} else {
						return false;
					}
				})) {
					specialAllowBridge = false;
					specialAllowFloatingPlatform = false;
				}
			}
		}
		var nullInBetween = false;
		if(buildingCanInsertNow) {
			var _g = yPos;
			var _g1 = thesePermanents.length - 1;
			while(_g < _g1) {
				var i = _g++;
				if(thesePermanents[i] == null) {
					if(this.city.miscCityElements.isUnbuildable(new common_Point(buildingXPos,buildingYPos - (i - yPos) * 20),true)) {
						return BuildPossibility.BuildingPositionImpossible;
					}
					nullInBetween = true;
					break;
				}
				if(thesePermanents[i].isBuilding) {
					var bld = thesePermanents[i];
					if(bld.cannotBuildOnTop && thesePermanents[i + 1] != null) {
						return BuildPossibility.BuildingPositionImpossible;
					}
				}
			}
		}
		var isCityTopBuilding = buildingInfo.specialInfo.indexOf("cityTop") != -1;
		if(isCityTopBuilding) {
			if(yPos != thesePermanents.length) {
				return BuildPossibility.BuildingPositionImpossible;
			}
			if(common_ArrayExtensions.any(this.city.worlds,function(w) {
				if(w.rect.y < buildingYPos && w.rect.x <= buildingXPos) {
					return w.rect.get_x2() > buildingXPos;
				} else {
					return false;
				}
			})) {
				return BuildPossibility.BuildingPositionImpossible;
			}
			if(common_ArrayExtensions.any(this.city.miscCityElements.allMiscElements,function(m) {
				if(m.rect.y < buildingYPos && m.rect.x <= buildingXPos) {
					return m.rect.get_x2() > buildingXPos;
				} else {
					return false;
				}
			})) {
				return BuildPossibility.BuildingPositionImpossible;
			}
		} else if(yPos != 0 && yPos >= thesePermanents.length && thesePermanents[thesePermanents.length - 1] != null && thesePermanents[thesePermanents.length - 1].isBuilding && thesePermanents[thesePermanents.length - 1].info.specialInfo.indexOf("cityTop") != -1) {
			return BuildPossibility.BuildingPositionImpossible;
		}
		var isRooftopBuilding = buildingInfo.specialInfo.indexOf("rooftop") != -1;
		var isAdvancedBuildingMode = this.city.upgrades.vars.advancedBuildingAllowed;
		if(buildingCanReplaceNow && isBuildingHere && (!isRooftopBuilding || isRooftopBuildingHere) && !buildingHereIsOfSameTypeAndThatMakesItImpossibleToBuild || (noBuildingsYet || topIsBuilding || specialAllowBridge || specialAllowFloatingPlatform) && (yPos != 0 || bottomIsNotNoBuilding) && ((buildingCanInsertNow || yPos < thesePermanents.length && thesePermanents[yPos] == null) && (buildingYPos >= yPosTopExcludingRooftop && buildingYPos < world.rect.y) && (yPos == 0 || hasLeftAndRightBuilding || yPos > 0 && thesePermanents[yPos] != null && thesePermanents[yPos].isBuilding || yPos > 0 && thesePermanents[yPos - 1] != null && thesePermanents[yPos - 1].isBuilding && !thesePermanents[yPos - 1].cannotBuildOnTop) || !buildingCanInsertNow && mightDoBuildingAssociatedAction && (buildingYPos >= yPosTopExcludingRooftop && buildingYPos < yPosTopExcludingRooftop + 20) || specialAllowBridge || specialAllowFloatingPlatform) && (yPos >= thesePermanents.length || thesePermanents[yPos] == null && specialAllowBridge || yPos == 0 || thesePermanents[yPos - 1] != null || buildingCanInsertNow || specialAllowFloatingPlatform) && (!isRooftopBuilding || yPos == thesePermanents.length || thesePermanents[yPos] == null || specialAllowFloatingPlatform || yPos == thesePermanents.length - 1 && buildingCanReplaceNow && thesePermanents[yPos].isBuilding && !buildingHereIsOfSameTypeAndThatMakesItImpossibleToBuild && (yPos == 0 || thesePermanents[yPos].bottomBuilding != null && !thesePermanents[yPos].bottomBuilding.cannotBuildOnTop) && Builder.canRemoveFromLRPerspective(isAdvancedBuildingMode,thesePermanents[yPos],this.city))) {
			var buildingYPosToUseForIntersectionCheck = buildingCanInsertNow ? buildingYPos < yPosTop ? buildingYPos : yPosTop : buildingYPos;
			if(nullInBetween) {
				return BuildPossibility.BuildingOK;
			}
			if(buildingCanInsertNow && yPos < thesePermanents.length && thesePermanents[yPos] == null) {
				return BuildPossibility.BuildingOK;
			}
			if(this.city.miscCityElements.isUnbuildable(new common_Point(buildingXPos,buildingYPosToUseForIntersectionCheck),true)) {
				return BuildPossibility.BuildingPositionImpossible;
			}
			if(yPos < thesePermanents.length && thesePermanents[yPos] == null) {
				return BuildPossibility.BuildingOK;
			}
			if(!common_ArrayExtensions.any(this.city.worlds,function(w) {
				if(w != world && w.mask != null) {
					if(w.rect.intersects(new common_Rectangle(buildingXPos,buildingYPosToUseForIntersectionCheck,20,20))) {
						return w.mask[(buildingXPos - w.rect.x) / 20 | 0][(buildingYPosToUseForIntersectionCheck - w.rect.y) / 20 | 0];
					} else {
						return false;
					}
				} else {
					return false;
				}
			})) {
				return BuildPossibility.BuildingOK;
			} else {
				return BuildPossibility.BuildingInWorld;
			}
		}
		return BuildPossibility.BuildingPositionImpossible;
	}
	,cancel: function() {
		this.sprite.destroy();
		var _g = 0;
		var _g1 = this.extraSprites;
		while(_g < _g1.length) {
			var spr = _g1[_g];
			++_g;
			spr.destroy();
		}
		this.builderSecondaryHelpSprite.destroy();
		if(this.fixedSprite != null) {
			this.fixedSprite.destroy();
		}
		this.city.builder = null;
		if(this.city.specialActionOld != null) {
			this.city.specialActionOld.activate();
		}
	}
	,buildingModeCanReplace: function() {
		if(this.city.buildingMode != BuildingMode.Replace) {
			return this.city.buildingMode == BuildingMode.DragReplace;
		} else {
			return true;
		}
	}
	,buildingModeCanDrag: function() {
		if(this.city.buildingMode != BuildingMode.Drag) {
			return this.city.buildingMode == BuildingMode.DragReplace;
		} else {
			return true;
		}
	}
	,__class__: Builder
};
