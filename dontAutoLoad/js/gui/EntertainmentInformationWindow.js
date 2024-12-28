var gui_EntertainmentInformationWindow = $hxClasses["gui.EntertainmentInformationWindow"] = function() { };
gui_EntertainmentInformationWindow.__name__ = "gui.EntertainmentInformationWindow";
gui_EntertainmentInformationWindow.create = function(city,gui,stage,$window) {
	gui_EntertainmentInformationWindow.createWindow(city,gui,stage,$window);
};
gui_EntertainmentInformationWindow.createWindow = function(city,gui,stage,$window) {
	gui.windowAllowBanner();
	$window.clear();
	gui.windowAddTitleText(common_Localize.lo("categories/Entertainment.name"),null,Resources.getTexture("spr_happiness"));
	var ebType = -1;
	var ebFailed = false;
	var _g = 0;
	var _g1 = city.permanents;
	while(_g < _g1.length) {
		var bld = _g1[_g];
		++_g;
		if(bld.isBuilding) {
			var bl = bld;
			if(bl.isEntertainment) {
				if(ebType == -1) {
					ebType = bl.shardId;
				} else if(bl.shardId != ebType) {
					ebFailed = true;
					break;
				}
			}
		}
	}
	if(ebFailed) {
		gui.windowInner.addChild(new gui_TextElement($window,stage,common_Localize.lo("entertainment_information_multiple_wg_with_citizens"),null,null,null,150));
	}
	var happiness = city.simulation.happiness;
	if(happiness.numberOfGroupsWithCitizens > 1) {
		gui.windowAddInfoText(null,function() {
			if(happiness.numberOfGroupsWithCitizens > 1) {
				return common_Localize.lo("entertainment_information_no_citizens");
			} else {
				return "";
			}
		});
	}
	var updates = [];
	var _g = 0;
	var _g1 = happiness.entertainmentTypes.length;
	while(_g < _g1) {
		var i = _g++;
		var entertainmentType = happiness.entertainmentTypes[i];
		gui.windowAddInfoText(simulation_EntertainmentTypeHelpers.getName(entertainmentType),null,"Arial15");
		updates.push(gui_EntertainmentInformationWindow.addEntertainmentTypeInfo(city,gui,stage,$window,entertainmentType));
		gui.windowInner.addChild(new gui_GUISpacing(gui.windowInner,new common_Point(2,4)));
	}
	var curUpdate = 0;
	$window.onUpdate = function() {
		updates[curUpdate]();
		curUpdate = (curUpdate + 1) % updates.length;
	};
	var _g = ($_=city.gui,$bind($_,$_.reloadWindow));
	var tmp = function() {
		_g();
	};
	city.windowRelatedOnBuildOrDestroy = tmp;
	$window.onDestroy = function() {
		city.windowRelatedOnBuildOrDestroy = null;
	};
	gui.windowAddBottomButtons();
};
gui_EntertainmentInformationWindow.addEntertainmentTypeInfo = function(city,gui,stage,$window,entertainmentType) {
	var entTypesUnsorted = [];
	var entTypeClassNames = [];
	var infoPadding = { left : 2, top : 5, bottom : 0, right : 0};
	var singleRowHeight = 20;
	var singleRowHeightWithoutPadding = singleRowHeight - 5;
	var _g = 0;
	var _g1 = city.permanents;
	while(_g < _g1.length) {
		var pm = _g1[_g];
		++_g;
		if(pm.isBuilding && pm.isEntertainment) {
			var thisEntertainmentBuilding = pm;
			if(thisEntertainmentBuilding.get_entertainmentType() != entertainmentType && (thisEntertainmentBuilding.get_secondaryEntertainmentTypes() == null || thisEntertainmentBuilding.get_secondaryEntertainmentTypes().indexOf(entertainmentType) == -1)) {
				continue;
			}
			var cls = js_Boot.getClass(pm);
			var i = entTypesUnsorted.indexOf(cls);
			if(i == -1) {
				i = entTypesUnsorted.length;
				entTypesUnsorted.push(cls);
				var splitClassName = cls.__name__.split(".");
				entTypeClassNames.push(splitClassName[splitClassName.length - 1]);
			}
		}
	}
	var buildingTypesWithEntertainment = [];
	var _g = 0;
	var _g1 = city.progress.resources.buildingInfoArray;
	while(_g < _g1.length) {
		var bi = _g1[_g];
		++_g;
		var i = entTypeClassNames.indexOf(bi.className);
		if(i != -1) {
			buildingTypesWithEntertainment.push(entTypesUnsorted[i]);
		}
	}
	var allBuildingTypeData = [];
	var totalCapacity = 0.0;
	var updateBuildingTypeData = function() {
		allBuildingTypeData = [];
		totalCapacity = 0;
		var _g = 0;
		while(_g < buildingTypesWithEntertainment.length) {
			var bt = buildingTypesWithEntertainment[_g];
			++_g;
			allBuildingTypeData.push({ number : 0, capacity : 0});
		}
		var _g = 0;
		var _g1 = city.permanents;
		while(_g < _g1.length) {
			var pm = _g1[_g];
			++_g;
			var thisBuilding = pm;
			var cls = js_Boot.getClass(pm);
			var i = buildingTypesWithEntertainment.indexOf(cls);
			if(i != -1) {
				if(thisBuilding.get_entertainmentType() != entertainmentType && (thisBuilding.get_secondaryEntertainmentTypes() == null || thisBuilding.get_secondaryEntertainmentTypes().indexOf(entertainmentType) == -1)) {
					continue;
				}
				var data = allBuildingTypeData[i];
				data.capacity += thisBuilding.get_entertainmentCapacity();
				data.number += 1;
				totalCapacity += thisBuilding.get_entertainmentCapacity();
			}
		}
	};
	updateBuildingTypeData();
	var _g = 0;
	var _g1 = buildingTypesWithEntertainment.length;
	while(_g < _g1) {
		var i = _g++;
		var buildingOptionsContainer = new gui_GUIContainer(gui,stage,$window);
		buildingOptionsContainer.fillSecondarySize = true;
		var buildingType = buildingTypesWithEntertainment[i];
		var buildingTypeData = [allBuildingTypeData[i]];
		var thisBuildingPictureContainer = new gui_GUIContainer(gui,stage,buildingOptionsContainer);
		var cont = new PIXI.Container();
		var sprName = Reflect.field(buildingType,"spriteName");
		var this1 = city.progress.resources.buildingInfo;
		var key = buildingType.__name__;
		var buildingInfo = [this1.h[key]];
		if(buildingInfo[0].buttonBack != "none") {
			cont.addChild(Resources.makeSprite(buildingInfo[0].buttonBack == null ? "" + sprName + "@44,0,20,20" : buildingInfo[0].buttonBack));
		}
		cont.addChild(Resources.makeSprite("" + sprName + "@0,0,20,20"));
		var ch = [null];
		ch[0] = new gui_ContainerHolder(thisBuildingPictureContainer,stage,cont,null,null,(function(ch,buildingInfo) {
			return function(mouse) {
				if(ch[0].rect.contains(mouse.position)) {
					gui.tooltip.setText(ch[0],buildingInfo[0].name);
					return true;
				}
				return false;
			};
		})(ch,buildingInfo));
		thisBuildingPictureContainer.addChild(ch[0]);
		var thisBuildingNumberContainer = new gui_GUIContainer(gui,stage,thisBuildingPictureContainer,null,null,null,null,infoPadding);
		thisBuildingNumberContainer.addChild(new gui_TextElement(thisBuildingNumberContainer,stage,"x" + buildingTypeData[0].number + ": "));
		thisBuildingPictureContainer.addChild(thisBuildingNumberContainer);
		buildingOptionsContainer.addChild(thisBuildingPictureContainer);
		buildingOptionsContainer.addChild(new gui_GUIFiller(buildingOptionsContainer));
		var workerNumberContainer = new gui_GUIContainer(gui,stage,buildingOptionsContainer,null,null,null,null,infoPadding);
		workerNumberContainer.minHeight = singleRowHeightWithoutPadding;
		workerNumberContainer.addChild(new gui_TextElement(workerNumberContainer,stage,null,(function(buildingTypeData) {
			return function() {
				return "" + buildingTypeData[0].capacity;
			};
		})(buildingTypeData)));
		buildingOptionsContainer.addChild(workerNumberContainer);
		$window.addChild(buildingOptionsContainer);
	}
	if(buildingTypesWithEntertainment.length == 0) {
		gui.windowAddInfoText("--");
	} else {
		var totalContainer = new gui_GUIContainer(gui,stage,$window);
		totalContainer.fillSecondarySize = true;
		totalContainer.addChild(new gui_TextElement(totalContainer,stage,common_Localize.lo("total") + ":",null,null,{ left : 0, top : 5, bottom : 0, right : 0}));
		totalContainer.addChild(new gui_GUIFiller(totalContainer));
		var numberContainer = new gui_GUIContainer(gui,stage,totalContainer,null,null,null,null,infoPadding);
		numberContainer.minHeight = singleRowHeightWithoutPadding;
		numberContainer.addChild(new gui_TextElement(numberContainer,stage,null,function() {
			return "" + totalCapacity;
		}));
		totalContainer.addChild(numberContainer);
		$window.addChild(totalContainer);
	}
	return updateBuildingTypeData;
};
