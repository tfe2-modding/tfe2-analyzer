var worldResources_Forest = $hxClasses["worldResources.Forest"] = function(game,id,city,world,position,worldPosition,stage,texture,amountOfWood,regrowTexture) {
	if(regrowTexture == null) {
		regrowTexture = "spr_forest_grow";
	}
	if(amountOfWood == null) {
		amountOfWood = 200;
	}
	if(texture == null) {
		texture = "spr_forest";
	}
	worldResources_LimitedWorldResource.call(this,game,id,city,world,position,worldPosition,stage,texture,amountOfWood,regrowTexture);
	this.managementMode = worldResources_ForestManagementMode.CutDownAndRegrow;
};
worldResources_Forest.__name__ = "worldResources.Forest";
worldResources_Forest.__super__ = worldResources_LimitedWorldResource;
worldResources_Forest.prototype = $extend(worldResources_LimitedWorldResource.prototype,{
	get_name: function() {
		return common_Localize.lo("forest");
	}
	,get_resourceName: function() {
		return "wood";
	}
	,get_regrowSpeed: function() {
		return 0.003;
	}
	,get_destroyedOnEmpty: function() {
		return this.managementMode == worldResources_ForestManagementMode.CutDownAndUproot;
	}
	,get_doNotGather: function() {
		return this.managementMode == worldResources_ForestManagementMode.Protect;
	}
	,get_treeClimbX: function() {
		return 7;
	}
	,get_treeClimbY: function() {
		return 13;
	}
	,setManagementMode: function(mode,noRecursion) {
		if(noRecursion == null) {
			noRecursion = false;
		}
		this.managementMode = mode;
		if(!noRecursion && gui_UpgradeWindowParts.hasMultiUpgradeModeOn) {
			var _g = 0;
			var _g1 = this.city.permanents;
			while(_g < _g1.length) {
				var permanent = _g1[_g];
				++_g;
				if(permanent.is(worldResources_Forest)) {
					permanent.setManagementMode(mode,true);
				}
			}
		}
	}
	,createMainWindowPart: function() {
		var _gthis = this;
		var gui = this.city.gui;
		worldResources_LimitedWorldResource.prototype.createMainWindowPart.call(this);
		if(this.city.progress.ruleset == progress_Ruleset.HippieCity) {
			gui.windowAddInfoText(common_Localize.lo("hippie_forest_nocut"));
			var minForestsForHippies = 26;
			minForestsForHippies = common_ArrayExtensions.isum(this.city.progress.story.storyInfo.worlds,function(w) {
				return common_ArrayExtensions.count(w.worldResources,function(wr) {
					return wr.className.indexOf("Forest") != -1;
				});
			});
			var canUproot = false;
			if(common_ArrayExtensions.sum(this.city.worlds,function(w) {
				return common_ArrayExtensions.count(w.permanents,function(pm) {
					if(pm.length > 0 && pm[0] != null) {
						return pm[0].is(worldResources_Forest);
					} else {
						return false;
					}
				});
			}) > minForestsForHippies) {
				canUproot = true;
			}
			if(canUproot) {
				gui.windowAddInfoText(common_Localize.lo("hippie_forest_nocut_exception"));
				gui_windowParts_FullSizeTextButton.create(this.city.gui,function() {
					if(_gthis.city.materials.canAfford(new Materials(0,0,1000))) {
						_gthis.city.gui.closeWindow();
						_gthis.destroy();
						_gthis.materialsLeft = 0;
						var _g = _gthis.city.materials;
						_g.set_food(_g.food - 1000);
					} else {
						var showWarningWindow = function() {
							_gthis.city.gui.showSimpleWindow(common_Localize.lo("cant_afford"),null,true);
						};
						showWarningWindow();
						_gthis.city.gui.addWindowToStack(showWarningWindow);
					}
				},this.city.gui.windowInner,function() {
					return common_Localize.lo("hippie_forest_nocut_exception_button");
				},this.city.gui.innerWindowStage,false);
				this.city.gui.windowInner.addChild(new gui_GUISpacing(this.city.gui.windowInner,new common_Point(4,4)));
			}
		} else {
			if(Settings.language == "en") {
				gui.window.minWidth = 235;
			}
			var titleContainer = gui_UpgradeWindowParts.createHeader(gui,common_Localize.lo("forest_management"));
			gui_UpgradeWindowParts.addOneAndMaxButtons(gui,titleContainer,function() {
				gui_UpgradeWindowParts.hasMultiUpgradeModeOn = false;
				_gthis.reloadWindow();
			},function() {
				gui_UpgradeWindowParts.hasMultiUpgradeModeOn = true;
				_gthis.reloadWindow();
			},common_Localize.lo("forest_management_only_this"),function() {
				return "---";
			},function() {
				return common_Localize.lo("forest_management_all") + (" (" + _gthis.city.simulation.stats.amountOfBuildingsOfType(worldResources_Forest) + ").");
			},false);
			gui.windowAddInfoText(gui_UpgradeWindowParts.hasMultiUpgradeModeOn ? common_Localize.lo("forest_management_question_1") + " " : common_Localize.lo("forest_management_question_2") + " ");
			gui_UpgradeWindowParts.createActivatableButton(gui,this.managementMode == worldResources_ForestManagementMode.CutDownAndRegrow,function() {
				_gthis.setManagementMode(worldResources_ForestManagementMode.CutDownAndRegrow);
				_gthis.reloadWindow();
			},common_Localize.lo("forest_regrow"),gui_UpgradeWindowParts.hasMultiUpgradeModeOn ? common_Localize.lo("forest_regrow_description_1") : common_Localize.lo("forest_regrow_description_2"));
			gui_UpgradeWindowParts.createActivatableButton(gui,this.managementMode == worldResources_ForestManagementMode.Protect,function() {
				_gthis.setManagementMode(worldResources_ForestManagementMode.Protect);
				_gthis.reloadWindow();
			},common_Localize.lo("forest_protect"),gui_UpgradeWindowParts.hasMultiUpgradeModeOn ? common_Localize.lo("forest_protect_description_1") : common_Localize.lo("forest_protect_description_2"));
			gui_UpgradeWindowParts.createActivatableButton(gui,this.managementMode == worldResources_ForestManagementMode.CutDownAndUproot,function() {
				_gthis.setManagementMode(worldResources_ForestManagementMode.CutDownAndUproot);
				_gthis.reloadWindow();
			},common_Localize.lo("forest_uproot"),gui_UpgradeWindowParts.hasMultiUpgradeModeOn ? common_Localize.lo("forest_uproot_description_1") : common_Localize.lo("forest_uproot_description_2"));
			gui.windowInner.addChild(new gui_GUISpacing(gui.windowInner,new common_Point(2,4)));
		}
	}
	,createMoveWindow: function() {
		var _gthis = this;
		this.city.createWorldResourceBuilderMove(this);
		this.city.gui.showSimpleWindow(common_Localize.lo("hippie_forest_move"),null,true);
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
		if(this.city.progress.ruleset == progress_Ruleset.HippieCity) {
			this.city.gui.windowAddBottomButtons([{ text : common_Localize.lo("move"), action : function() {
				_gthis.createMoveWindow();
			}}]);
			return;
		}
		var prioritizeButton = null;
		var isConfirmButton = false;
		prioritizeButton = this.city.gui.windowAddBottomButtons([{ text : this.materialsLeft <= 0 ? common_Localize.lo("forest_instant_uproot") : this.city.simulation.resourcePriorityManager.isPrioritized(this) ? common_Localize.lo("prioritized") : common_Localize.lo("prioritize"), onHover : function() {
			if(_gthis.materialsLeft <= 0) {
				if(!isConfirmButton) {
					_gthis.city.gui.tooltip.setText(_gthis,common_Localize.lo("forest_instant_uproot_description"));
				}
			} else if(_gthis.city.simulation.resourcePriorityManager.isPrioritized(_gthis)) {
				_gthis.city.gui.tooltip.setText(_gthis,common_Localize.lo("prioritize_description_1"),common_Localize.lo("prioritized"));
			} else {
				_gthis.city.gui.tooltip.setText(_gthis,common_Localize.lo("prioritize_description_2"),common_Localize.lo("prioritize"));
			}
		}, action : function() {
			if(_gthis.materialsLeft <= 0) {
				if(isConfirmButton) {
					_gthis.city.gui.closeWindow();
					_gthis.destroy();
					_gthis.materialsLeft = 0;
				} else {
					prioritizeButton.setText(common_Localize.lo("really_uproot"));
					isConfirmButton = true;
				}
			} else if(_gthis.city.simulation.resourcePriorityManager.isPrioritized(_gthis)) {
				_gthis.city.simulation.resourcePriorityManager.deprioritize(_gthis);
				prioritizeButton.setText(common_Localize.lo("prioritize"));
			} else {
				_gthis.city.simulation.resourcePriorityManager.prioritize(_gthis);
				prioritizeButton.setText(common_Localize.lo("prioritized"));
			}
		}}])[0];
		var wereMaterialsLeft = this.materialsLeft <= 0;
		prioritizeButton.onUpdate = function() {
			if(_gthis.materialsLeft <= 0 != wereMaterialsLeft) {
				if(_gthis.materialsLeft <= 0) {
					isConfirmButton = false;
					prioritizeButton.setText(common_Localize.lo("forest_instant_uproot"));
				} else if(_gthis.city.simulation.resourcePriorityManager.isPrioritized(_gthis)) {
					prioritizeButton.setText(common_Localize.lo("prioritize"));
				} else {
					prioritizeButton.setText(common_Localize.lo("prioritized"));
				}
				wereMaterialsLeft = _gthis.materialsLeft <= 0;
			}
		};
	}
	,positionSprites: function() {
		worldResources_LimitedWorldResource.prototype.positionSprites.call(this);
		this.stage.isInvalid = true;
	}
	,save: function(queue,shouldSaveDefinition) {
		if(shouldSaveDefinition == null) {
			shouldSaveDefinition = true;
		}
		worldResources_LimitedWorldResource.prototype.save.call(this,queue);
		if(shouldSaveDefinition) {
			queue.addString(worldResources_Forest.saveDefinition);
		}
		var e = this.managementMode;
		queue.addString($hxEnums[e.__enum__].__constructs__[e._hx_index]);
	}
	,load: function(queue,definition) {
		worldResources_LimitedWorldResource.prototype.load.call(this,queue);
		if(definition == null) {
			definition = queue.readString();
		}
		var loadMap = gamesave_GameSaveHelper.makeLoadMap(definition,queue);
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"managementMode")) {
			this.managementMode = loadMap.h["managementMode"];
		}
	}
	,__class__: worldResources_Forest
});
