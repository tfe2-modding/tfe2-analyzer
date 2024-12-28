var gui_CustomHouseWindow = $hxClasses["gui.CustomHouseWindow"] = function() { };
gui_CustomHouseWindow.__name__ = "gui.CustomHouseWindow";
gui_CustomHouseWindow.createWindow = function(city,gui,editHouse,houseProps) {
	if(houseProps == null) {
		houseProps = new buildings_CustomHouseProperties();
	}
	gui.createWindow(editHouse == null ? "customHouseCreate" : "customHouseEdit",null,80);
	var city1 = city;
	var gui1 = gui;
	var editHouse1 = editHouse;
	var houseProps1 = houseProps;
	var tmp = function() {
		gui_CustomHouseWindow.createWindow(city1,gui1,editHouse1,houseProps1);
	};
	gui.addWindowToStack(tmp);
	gui.windowAddTitleText(common_Localize.lo("buildinginfo.json/CustomHouse.name"));
	gui.windowInner.addChild(new gui_TextElement(gui.windowInner,gui.innerWindowStage,common_Localize.lo("exterior"),null,"Arial15"));
	gui_CustomHouseWindow.addVisualSelectionButtonsMain(gui,gui.innerWindowStage,gui.windowInner,houseProps,["0","1","4","2","3","7","5","6","15","18","16","17","8","9","10","11","12","13","14"]);
	gui.windowInner.addChild(new gui_GUISpacing(gui.windowInner,new common_Point(2,2)));
	gui_CheckboxButton.createSettingButton(gui,gui.innerWindowStage,gui.windowInner,function() {
		houseProps.mergeWithSimilar = !houseProps.mergeWithSimilar;
	},function() {
		return houseProps.mergeWithSimilar;
	},common_Localize.lo("merge_horizontally"));
	gui.windowInner.addChild(new gui_GUISpacing(gui.windowInner,new common_Point(2,4)));
	gui.windowInner.addChild(new gui_TextElement(gui.windowInner,gui.innerWindowStage,common_Localize.lo("color"),null,"Arial15"));
	gui_CustomHouseWindow.addColorSelectionButtons(city,gui,gui.innerWindowStage,gui.windowInner,function() {
		return houseProps.mainColor;
	},function(c) {
		houseProps.mainColor = c;
	},[11053224,12633284,13818072,15133933,11379091,10389108,11904132,12695452,12242058,8174717,8443606,9878762,11249373,8279735,10384243],null);
	gui.windowInner.addChild(new gui_GUISpacing(gui.windowInner,new common_Point(2,4)));
	gui.windowInner.addChild(new gui_TextElement(gui.windowInner,gui.innerWindowStage,common_Localize.lo("windows_color"),null,"Arial15"));
	gui_CustomHouseWindow.addColorSelectionButtons(city,gui,gui.innerWindowStage,gui.windowInner,function() {
		return houseProps.windowColor;
	},function(c) {
		houseProps.windowColor = c;
	},[14869218,15790320,16383487,16777215,15917786,14733765,15984602,15658729,15333102,12903627,14019822,10810612,14015218,15131626,14404555],Resources.getTexture("spr_customhouse_windowtexturepreview"));
	gui.windowInner.addChild(new gui_GUISpacing(gui.windowInner,new common_Point(2,4)));
	var headerContainer = new gui_GUIContainer(gui,gui.innerWindowStage,gui.windowInner);
	headerContainer.fillSecondarySize = true;
	headerContainer.addChild(new gui_TextElement(headerContainer,gui.innerWindowStage,common_Localize.lo("interior_top"),null,"Arial15"));
	headerContainer.addChild(new gui_GUIFiller(headerContainer));
	var tb = new gui_TextButton(gui,gui.innerWindowStage,headerContainer,function() {
		houseProps.interiorOption1Mirror = !houseProps.interiorOption1Mirror;
	},common_Localize.lo("mirror"),null,null,"spr_button","Arial10");
	tb.extraTextPosY -= 1;
	tb.extraHeight -= 1;
	headerContainer.addChild(tb);
	gui.windowInner.addChild(headerContainer);
	gui.windowInner.addChild(new gui_GUISpacing(gui.windowInner,new common_Point(2,2)));
	gui_CustomHouseWindow.addVisualSelectionButtonsInterior(gui,gui.innerWindowStage,gui.windowInner,houseProps,function() {
		return houseProps.interiorOption1;
	},function(c) {
		houseProps.interiorOption1 = c;
	},function() {
		return houseProps.interiorOption1Mirror;
	});
	gui.windowInner.addChild(new gui_GUISpacing(gui.windowInner,new common_Point(2,4)));
	var headerContainer2 = new gui_GUIContainer(gui,gui.innerWindowStage,gui.windowInner);
	headerContainer2.fillSecondarySize = true;
	headerContainer2.addChild(new gui_TextElement(headerContainer2,gui.innerWindowStage,common_Localize.lo("interior_bottom"),null,"Arial15"));
	headerContainer2.addChild(new gui_GUIFiller(headerContainer2));
	var tb = new gui_TextButton(gui,gui.innerWindowStage,headerContainer2,function() {
		houseProps.interiorOption2Mirror = !houseProps.interiorOption2Mirror;
	},common_Localize.lo("mirror"),null,null,"spr_button","Arial10");
	tb.extraTextPosY -= 1;
	tb.extraHeight -= 1;
	headerContainer2.addChild(tb);
	gui.windowInner.addChild(headerContainer2);
	gui.windowInner.addChild(new gui_GUISpacing(gui.windowInner,new common_Point(2,2)));
	gui_CustomHouseWindow.addVisualSelectionButtonsInterior(gui,gui.innerWindowStage,gui.windowInner,houseProps,function() {
		return houseProps.interiorOption2;
	},function(c) {
		houseProps.interiorOption2 = c;
	},function() {
		return houseProps.interiorOption2Mirror;
	});
	gui.windowInner.addChild(new gui_GUISpacing(gui.windowInner,new common_Point(2,4)));
	gui.windowInner.addChild(new gui_TextElement(gui.windowInner,gui.innerWindowStage,common_Localize.lo("basic_properties"),null,"Arial15"));
	var topPaddingNSC = 2;
	var qualityContainer = new gui_GUIContainer(gui,gui.innerWindowStage,gui.windowInner,null,null,null,null,{ left : 0, top : topPaddingNSC, bottom : 0, right : 0});
	var textElem1 = new gui_TextElement(qualityContainer,gui.innerWindowStage,common_Localize.lo("quality",[""]),null,null,{ left : 0, top : 3, bottom : 0, right : 3});
	qualityContainer.addChild(textElem1);
	var numberSelectControl = new gui_NumberSelectControl(gui,gui.innerWindowStage,qualityContainer,null,function() {
		return 5;
	},function() {
		var maxCap = 55;
		if(city.progress.unlocks.getUnlockState(buildings_MachinePartsFactory) == progress_UnlockState.Researched) {
			maxCap = 70;
		}
		if(city.progress.unlocks.getUnlockState(buildings_RefinedMetalFactory) == progress_UnlockState.Researched) {
			maxCap = 85;
		}
		if(city.progress.unlocks.getUnlockState(buildings_ComputerChipFactory) == progress_UnlockState.Researched) {
			maxCap = 100;
		}
		return maxCap;
	},houseProps.customAttractiveness,function(n) {
		houseProps.customAttractiveness = n;
		if(houseProps.customCapacity > gui_CustomHouseWindow.getMaxCapacityNormal(city) && houseProps.customAttractiveness >= 35) {
			houseProps.customCapacity = gui_CustomHouseWindow.getMaxCapacityNormal(city);
		}
		if(houseProps.customCapacity > 10 && houseProps.customAttractiveness >= 15) {
			houseProps.customCapacity = 10;
		}
	},null,null,5);
	qualityContainer.addChild(numberSelectControl);
	gui.windowInner.addChild(qualityContainer);
	if(numberSelectControl.getMaxValue() < 100) {
		gui.windowInner.addChild(new gui_GUISpacing(gui.windowInner,new common_Point(2,2)));
		gui.windowAddInfoText(common_Localize.lo("unlock_later_quality",[numberSelectControl.getMaxValue()]));
	}
	var capacityContainer = new gui_GUIContainer(gui,gui.innerWindowStage,gui.windowInner,null,null,null,null,{ left : 0, top : topPaddingNSC, bottom : 0, right : 0});
	var textElem = new gui_TextElement(qualityContainer,gui.innerWindowStage,common_Localize.lo("residents_no") + ": ",null,null,{ left : 0, top : 3, bottom : 0, right : 3});
	capacityContainer.addChild(textElem);
	var val2 = textElem.rect.width - textElem1.rect.width + 3;
	textElem1.padding.right = val2 > 3 ? val2 : 3;
	textElem1.updateSize();
	var numberSelectControl = new gui_NumberSelectControl(gui,gui.innerWindowStage,qualityContainer,null,function() {
		return 1;
	},function() {
		var maxCap = gui_CustomHouseWindow.getMaxCapacityNormal(city);
		if(houseProps.customAttractiveness <= 35) {
			maxCap = 10;
		}
		if(houseProps.customAttractiveness <= 10) {
			maxCap = 16;
		}
		return maxCap;
	},houseProps.customCapacity,function(n) {
		houseProps.customCapacity = n;
	});
	capacityContainer.addChild(numberSelectControl);
	gui.windowInner.addChild(capacityContainer);
	if(gui_CustomHouseWindow.getMaxCapacityNormal(city) < 7) {
		gui.windowInner.addChild(new gui_GUISpacing(gui.windowInner,new common_Point(2,2)));
		gui.windowAddInfoText(null,function() {
			if(houseProps.customAttractiveness <= 35) {
				return common_Localize.lo("low_quality_more_residents");
			} else {
				return common_Localize.lo("unlock_later_residents",[numberSelectControl.getMaxValue()]);
			}
		});
	}
	gui.windowInner.addChild(new gui_GUISpacing(gui.windowInner,new common_Point(2,4)));
	gui.windowInner.addChild(new gui_TextElement(gui.windowInner,gui.innerWindowStage,common_Localize.lo("bonuses"),null,"Arial15"));
	var curBonusLevel = gui_CustomHouseWindow.getCurrentMaxNumberOfBonuses(city);
	if(curBonusLevel == 0) {
		gui.windowAddInfoText(common_Localize.lo("unlock_later"));
	} else {
		var gui2 = gui;
		var tmp;
		switch(curBonusLevel) {
		case 1:
			tmp = common_Localize.lo("choose_bonus_one");
			break;
		case 2:
			tmp = common_Localize.lo("choose_bonuses");
			break;
		default:
			var n = curBonusLevel;
			tmp = common_Localize.lo("choose_bonuses_n",[n]);
		}
		gui2.windowAddInfoText(tmp);
		if(city.progress.unlocks.getUnlockState(buildingUpgrades_ModernHomePlant) == progress_UnlockState.Researched) {
			gui_CustomHouseWindow.addBonusButton(city,gui,houseProps,common_Localize.lo("bonus_residents_longer"),0);
		}
		if(city.progress.unlocks.getUnlockState(buildings_TinkerersHome) == progress_UnlockState.Researched) {
			gui_CustomHouseWindow.addBonusButton(city,gui,houseProps,common_Localize.lo("bonus_residents_edu"),1);
		}
		if(city.progress.unlocks.getUnlockState(buildings_FuturisticHome) == progress_UnlockState.Researched) {
			gui_CustomHouseWindow.addBonusButton(city,gui,houseProps,common_Localize.lo("bonus_residents_healthcare"),2);
		}
		if(city.progress.unlocks.getUnlockState(buildings_Villa) == progress_UnlockState.Researched) {
			gui_CustomHouseWindow.addBonusButton(city,gui,houseProps,common_Localize.lo("bonus_private_teleporter"),3);
		}
		gui_CustomHouseWindow.addBonusButton(city,gui,houseProps,common_Localize.lo("bonus_nature_happiness"),4);
		gui_CustomHouseWindow.addBonusButton(city,gui,houseProps,common_Localize.lo("bonus_art_happiness"),5);
		gui_CustomHouseWindow.addBonusButton(city,gui,houseProps,common_Localize.lo("bonus_gaming_happiness"),6);
		if(curBonusLevel == 1) {
			if(Config.hasPremium()) {
				gui.windowAddInfoText(common_Localize.lo("unlock_more_bonuses_later"));
			} else {
				gui.windowAddInfoText(common_Localize.lo("get_premium_to_unlock_more_bonuses"));
				gui_windowParts_FullSizeTextButton.create(gui,function() {
					gui_infoWindows_StoreInfo.createWindow(gui);
				},gui.windowInner,function() {
					return common_Localize.lo("get_premium");
				},gui.innerWindowStage,true);
			}
		}
	}
	gui.windowInner.addChild(new gui_GUISpacing(gui.windowInner,new common_Point(2,4)));
	gui.windowInner.addChild(new gui_TextElement(gui.windowInner,gui.innerWindowStage,common_Localize.lo("material_use"),null,"Arial15"));
	if(Config.hasPremium()) {
		gui.windowAddInfoText(common_Localize.lo("material_use_mods"));
		gui_CustomHouseWindow.addCostModifierButton(gui,houseProps,common_Localize.lo("material_use_food"),0);
		gui_CustomHouseWindow.addCostModifierButton(gui,houseProps,common_Localize.lo("material_use_wood"),1);
		gui_CustomHouseWindow.addCostModifierButton(gui,houseProps,common_Localize.lo("material_use_stone"),2);
		gui_CustomHouseWindow.addCostModifierButton(gui,houseProps,common_Localize.lo("material_use_machineparts"),3);
		gui_CustomHouseWindow.addCostModifierButton(gui,houseProps,common_Localize.lo("material_use_refinedmetals"),4);
		gui_CustomHouseWindow.addCostModifierButton(gui,houseProps,common_Localize.lo("material_use_computerchips"),5);
		gui.windowInner.addChild(new gui_GUISpacing(gui.windowInner,new common_Point(2,2)));
	} else {
		gui.windowAddInfoText(common_Localize.lo("get_premium_to_unlock_material_use"));
		gui_windowParts_FullSizeTextButton.create(gui,function() {
			gui_infoWindows_StoreInfo.createWindow(gui);
		},gui.windowInner,function() {
			return common_Localize.lo("get_premium");
		},gui.innerWindowStage,true);
	}
	gui.windowInner.addChild(new gui_GUISpacing(gui.windowInner,new common_Point(2,4)));
	var windowBottom = new gui_GUIContainer(gui,gui.windowStage,gui.window,null,null,null,null,{ left : 3, right : 3, top : 3, bottom : 3});
	windowBottom.direction = gui_GUIContainerDirection.Vertical;
	windowBottom.fillSecondarySize = true;
	windowBottom.fillPrimarySize = true;
	var windowBottomInner = new gui_GUIContainer(gui,gui.windowStage,gui.window);
	windowBottomInner.fillSecondarySize = true;
	var previewSprite = new PIXI.Container();
	previewSprite.scale.set(2,2);
	var backSprite = Resources.makeSprite("spr_customhouse_" + houseProps.mainType,new common_Rectangle(44,0,20,20));
	var windowSprite = Resources.makeSprite("spr_customhouse_" + houseProps.mainType,new common_Rectangle(66,0,20,20));
	var frontSprite = Resources.makeSprite("spr_customhouse_" + houseProps.mainType,new common_Rectangle(0,0,20,20));
	var interiorSprites = Resources.getTexturesByWidth("spr_customhouse_interiors",20);
	var interiorSprite1 = new PIXI.Sprite(interiorSprites[0]);
	interiorSprite1.position.set(0,3);
	var interiorSprite2 = new PIXI.Sprite(interiorSprites[1]);
	interiorSprite2.position.set(0,12);
	previewSprite.addChild(backSprite);
	previewSprite.addChild(interiorSprite1);
	previewSprite.addChild(interiorSprite2);
	previewSprite.addChild(windowSprite);
	previewSprite.addChild(frontSprite);
	var windowPreview = new gui_ContainerHolder(windowBottomInner,gui.windowStage,previewSprite);
	windowBottomInner.addChild(windowPreview);
	var windowBottomRight = new gui_GUIContainer(gui,gui.windowStage,windowBottomInner);
	windowBottomRight.fillSecondarySize = true;
	windowBottomRight.direction = gui_GUIContainerDirection.Vertical;
	var costPreviewDisplay = new gui_MaterialsCostDisplay(city,houseProps.getCost(city),"");
	var costPreview = new gui_ContainerHolder(windowBottomRight,gui.windowStage,costPreviewDisplay,{ left : 3, right : 3, top : 0, bottom : 0});
	windowBottomRight.addChild(costPreview);
	windowBottomInner.addChild(windowBottomRight);
	windowBottom.addChild(windowBottomInner);
	var bottomButtons = new gui_GUIContainer(city.gui,gui.windowStage,windowBottomRight,null,null,null,null,{ left : 3, right : 0, top : 15 - (city.game.isMobile ? 4 : 0), bottom : 0});
	bottomButtons.fillSecondarySize = true;
	if(editHouse == null) {
		bottomButtons.addChild(new gui_TextButton(city.gui,gui.windowStage,bottomButtons,function() {
			city.createOrRemoveBuilder(buildings_CustomHouse,true,0,false,-1,houseProps.copy());
			gui.closeWindow();
		},common_Localize.lo("build")));
	} else {
		bottomButtons.addChild(new gui_TextButton(city.gui,gui.windowStage,bottomButtons,function() {
			var thisCost = houseProps.getCost(city);
			if(editHouse != null) {
				var curCost = editHouse.properties.getCost(city);
				thisCost.remove(curCost);
				thisCost.keepAboveZeroAll();
			}
			if(city.materials.canAfford(thisCost)) {
				city.materials.remove(thisCost);
				editHouse.properties = houseProps;
				editHouse.setProperties();
				gui.goPreviousWindow();
			}
		},common_Localize.lo("renovate")));
	}
	bottomButtons.addChild(new gui_TextButton(city.gui,gui.windowStage,bottomButtons,function() {
		gui.closeWindow();
	},common_Localize.lo("close")));
	bottomButtons.insertChild(new gui_GUIFiller(bottomButtons,gui.windowInner.rect.width - bottomButtons.rect.width - windowPreview.rect.width - 4),1);
	windowBottomRight.addChild(bottomButtons);
	gui.window.addChild(windowBottom);
	gui.windowOnUpdate = function(tmeMod) {
		backSprite.texture = Resources.getTexture("spr_customhouse_" + houseProps.mainType,new common_Rectangle(44,0,20,20));
		windowSprite.texture = Resources.getTexture("spr_customhouse_" + houseProps.mainType,new common_Rectangle(66,0,20,20));
		frontSprite.texture = Resources.getTexture("spr_customhouse_" + houseProps.mainType,new common_Rectangle(0,0,20,20));
		interiorSprite1.texture = interiorSprites[houseProps.interiorOption1];
		if(houseProps.interiorOption1Mirror) {
			interiorSprite1.anchor.x = 1;
			interiorSprite1.scale.x = -1;
		} else {
			interiorSprite1.anchor.x = 0;
			interiorSprite1.scale.x = 1;
		}
		interiorSprite2.texture = interiorSprites[houseProps.interiorOption2];
		if(houseProps.interiorOption2Mirror) {
			interiorSprite2.anchor.x = 1;
			interiorSprite2.scale.x = -1;
		} else {
			interiorSprite2.anchor.x = 0;
			interiorSprite2.scale.x = 1;
		}
		backSprite.tint = houseProps.windowColor;
		windowSprite.tint = houseProps.windowColor;
		frontSprite.tint = houseProps.mainColor;
		var thisCost = houseProps.getCost(city);
		if(editHouse != null) {
			var curCost = editHouse.properties.getCost(city);
			thisCost.remove(curCost);
			thisCost.keepAboveZeroAll();
		}
		costPreviewDisplay.setCost(thisCost);
	};
};
gui_CustomHouseWindow.getMaxCapacityNormal = function(city) {
	var maxCap = 4;
	if(city.progress.unlocks.getUnlockState(buildings_MechanicalHouse) == progress_UnlockState.Researched || city.progress.unlocks.getUnlockState(buildings_AlienHouse) == progress_UnlockState.Researched) {
		maxCap = 5;
	}
	if(city.progress.unlocks.getUnlockState(buildings_SpaciousHouse) == progress_UnlockState.Researched) {
		maxCap = 6;
	}
	if(city.upgrades.hasUpgrade(cityUpgrades_SuperSpaciousLiving)) {
		maxCap = 7;
	}
	return maxCap;
};
gui_CustomHouseWindow.addCostModifierButton = function(gui,houseProps,text,flag) {
	gui_CheckboxButton.createSettingButton(gui,gui.innerWindowStage,gui.windowInner,function() {
		if(houseProps.costModifiers.indexOf(flag) != -1) {
			HxOverrides.remove(houseProps.costModifiers,flag);
		} else {
			if(houseProps.costModifiers.length >= 2) {
				houseProps.costModifiers.splice(0,1);
			}
			houseProps.costModifiers.push(flag);
		}
	},function() {
		return houseProps.costModifiers.indexOf(flag) != -1;
	},text);
	gui.windowInner.addChild(new gui_GUISpacing(gui.windowInner,new common_Point(2,2)));
};
gui_CustomHouseWindow.getCurrentMaxNumberOfBonuses = function(city) {
	if(city.progress.unlocks.getUnlockState(buildings_ComputerChipFactory) != progress_UnlockState.Researched) {
		return 0;
	}
	if(Config.hasPremium() && city.progress.unlocks.getUnlockState(buildings_GrapheneLab) == progress_UnlockState.Researched) {
		return 2;
	}
	return 1;
};
gui_CustomHouseWindow.addBonusButton = function(city,gui,houseProps,text,flag) {
	gui_CheckboxButton.createSettingButton(gui,gui.innerWindowStage,gui.windowInner,function() {
		if(houseProps.bonuses.indexOf(flag) != -1) {
			HxOverrides.remove(houseProps.bonuses,flag);
		} else {
			if(houseProps.bonuses.length >= gui_CustomHouseWindow.getCurrentMaxNumberOfBonuses(city)) {
				houseProps.bonuses.splice(0,1);
			}
			houseProps.bonuses.push(flag);
		}
	},function() {
		return houseProps.bonuses.indexOf(flag) != -1;
	},text);
	gui.windowInner.addChild(new gui_GUISpacing(gui.windowInner,new common_Point(2,2)));
};
gui_CustomHouseWindow.addVisualSelectionButtonsMain = function(gui,stage,parent,houseProps,types) {
	var typesContainer = new gui_GUIContainer(gui,gui.innerWindowStage,gui.windowInner);
	var curNum = 0;
	var _g = 0;
	while(_g < types.length) {
		var type = types[_g];
		++_g;
		if(++curNum > 11) {
			gui.windowInner.addChild(typesContainer);
			typesContainer = new gui_GUIContainer(gui,gui.innerWindowStage,gui.windowInner);
			curNum = 1;
		}
		var thisType = [type];
		var type1 = [new gui_ImageButton(gui,gui.innerWindowStage,typesContainer,(function(thisType) {
			return function() {
				houseProps.mainType = thisType[0];
			};
		})(thisType),Resources.getTexture("spr_customhouse_" + thisType[0],new common_Rectangle(0,0,20,20)),(function(thisType) {
			return function() {
				return houseProps.mainType == thisType[0];
			};
		})(thisType),null,Resources.getTexture("spr_customhouse_" + thisType[0],new common_Rectangle(44,0,20,20)))];
		type1[0].imageSprite.tint = houseProps.mainColor;
		type1[0].imageSpriteBack.tint = houseProps.windowColor;
		type1[0].onUpdate = (function(type1) {
			return function() {
				type1[0].imageSprite.tint = houseProps.mainColor;
				type1[0].imageSpriteBack.tint = houseProps.windowColor;
			};
		})(type1);
		typesContainer.addChild(type1[0]);
	}
	gui.windowInner.addChild(typesContainer);
};
gui_CustomHouseWindow.addColorSelectionButtons = function(city,gui,stage,parent,getColor,setColor,presets,buttonTexture) {
	if(buttonTexture == null) {
		buttonTexture = Resources.getTexture("spr_highlightedbuilding",new common_Rectangle(0,0,13,13));
	}
	var typesContainer = new gui_GUIContainer(gui,gui.innerWindowStage,gui.windowInner,null,null,null,null,{ left : 1, top : 0, bottom : 0, right : 0});
	var _g = 0;
	while(_g < presets.length) {
		var col = presets[_g];
		++_g;
		var thisColor = [col];
		var colorButton = new gui_ImageButton(gui,gui.innerWindowStage,typesContainer,(function(thisColor) {
			return function() {
				setColor(thisColor[0]);
			};
		})(thisColor),buttonTexture,(function(thisColor) {
			return function() {
				return getColor() == thisColor[0];
			};
		})(thisColor),null,null,"spr_button_smaller_clearactive");
		colorButton.imageSprite.tint = thisColor[0];
		typesContainer.addChild(colorButton);
	}
	var colorButtonCustom = new gui_ImageButton(gui,gui.innerWindowStage,typesContainer,function() {
		gui_ColorPicker.colorPicked = getColor();
		gui_ColorPickerWindow.createWindow(city,setColor,true);
	},Resources.getTexture("spr_customhouse_customcolor"),function() {
		return false;
	},null,null,"spr_button_smaller_clearactive");
	typesContainer.addChild(colorButtonCustom);
	gui.windowInner.addChild(typesContainer);
};
gui_CustomHouseWindow.addVisualSelectionButtonsInterior = function(gui,stage,parent,houseProps,getProp,setProp,isMirrored) {
	var typesContainer = new gui_GUIContainer(gui,gui.innerWindowStage,gui.windowInner,null,null,null,null,{ left : 0, top : 0, bottom : 0, right : 0});
	var interiorSprites = Resources.getTexturesByWidth("spr_customhouse_interiors",20);
	if(!Config.hasPremium()) {
		interiorSprites.splice(44,interiorSprites.length - 44);
	}
	var curNum = 0;
	var _g = 0;
	var _g1 = interiorSprites.length;
	while(_g < _g1) {
		var type = _g++;
		if(++curNum > 11) {
			gui.windowInner.addChild(typesContainer);
			typesContainer = new gui_GUIContainer(gui,gui.innerWindowStage,gui.windowInner,null,null,null,null,{ left : 0, top : 0, bottom : 0, right : 0});
			curNum = 1;
		}
		var specSprite = [Resources.getTexture("spr_customhouse_interiors",new common_Rectangle(type * 22 + 3,0,14,5))];
		var thisType = [type];
		var type1 = [new gui_ImageButton(gui,gui.innerWindowStage,typesContainer,(function(thisType) {
			return function() {
				setProp(thisType[0]);
			};
		})(thisType),specSprite[0],(function(thisType) {
			return function() {
				return getProp() == thisType[0];
			};
		})(thisType),null,Resources.getTexture("spr_customhouse_interior_back"),"spr_button_interiorselect",4)];
		type1[0].imageSpriteBack.tint = houseProps.windowColor;
		type1[0].onUpdate = (function(type1,thisType,specSprite) {
			return function() {
				type1[0].imageSpriteBack.tint = houseProps.windowColor;
				var tmp = isMirrored() ? -1 : 1;
				type1[0].imageSprite.scale.x = tmp;
				if(type1[0].imageSprite.scale.x < 0) {
					type1[0].imageSprite.anchor.x = 1;
				} else {
					type1[0].imageSprite.anchor.x = 0;
				}
				if(houseProps.mergeWithSimilar) {
					type1[0].imageSpriteBack.texture = Resources.getTexture("spr_customhouse_interior_back_wide");
					type1[0].imageSprite.texture = interiorSprites[thisType[0]];
					type1[0].imageSprite.position.x = type1[0].rect.x + 1;
					type1[0].imageSpriteOffsetX = -3;
				} else {
					type1[0].imageSpriteBack.texture = Resources.getTexture("spr_customhouse_interior_back");
					type1[0].imageSprite.texture = specSprite[0];
					type1[0].imageSprite.position.x = type1[0].rect.x + 4;
					type1[0].imageSpriteOffsetX = 0;
				}
			};
		})(type1,thisType,specSprite);
		typesContainer.addChild(type1[0]);
	}
	gui.windowInner.addChild(typesContainer);
};
