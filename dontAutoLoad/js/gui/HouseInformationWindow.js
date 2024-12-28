var gui_HouseInformationWindow = $hxClasses["gui.HouseInformationWindow"] = function() { };
gui_HouseInformationWindow.__name__ = "gui.HouseInformationWindow";
gui_HouseInformationWindow.create = function(city,gui,stage,$window) {
	gui_HouseInformationWindow.createWindow(city,gui,stage,$window);
};
gui_HouseInformationWindow.createWindow = function(city,gui,stage,$window) {
	gui.windowAllowBanner();
	$window.clear();
	gui.windowAddTitleText(common_Localize.lo("housing_information"),null,Resources.getTexture("spr_housing"));
	$window.addChild(new gui_TextElement($window,stage,null,function() {
		return gui_HouseInformationWindow.getHousingHelpText(city.simulation.stats);
	}));
	if(city.simulation.stats.peopleWithHome < city.simulation.stats.people) {
		gui_windowParts_FullSizeTextButton.create(city.gui,function() {
			var citizen = common_ArrayExtensions.findRandom(city.simulation.citizens,function(c) {
				return c.home == null;
			});
			if(citizen != null) {
				gui_FollowingCitizen.createWindow(city,citizen,false);
			}
		},city.gui.windowInner,function() {
			return common_Localize.lo("find_homeless");
		},city.gui.innerWindowStage);
		$window.addChild(new gui_GUISpacing($window,new common_Point(2,6)));
	}
	var homeTypesUnsorted = [];
	var homeTypeClassNames = [];
	var _g = 0;
	var _g1 = city.permanents;
	while(_g < _g1.length) {
		var pm = _g1[_g];
		++_g;
		if(pm.is(buildings_House)) {
			var cls = js_Boot.getClass(pm);
			var i = homeTypesUnsorted.indexOf(cls);
			if(i == -1) {
				i = homeTypesUnsorted.length;
				homeTypesUnsorted.push(cls);
				var splitClassName = cls.__name__.split(".");
				homeTypeClassNames.push(splitClassName[splitClassName.length - 1]);
			}
		}
	}
	var buildingTypesWithJob = [];
	var _g = 0;
	var _g1 = city.progress.resources.buildingInfoArray;
	while(_g < _g1.length) {
		var bi = _g1[_g];
		++_g;
		var i = homeTypeClassNames.indexOf(bi.className);
		if(i != -1) {
			buildingTypesWithJob.push(homeTypesUnsorted[i]);
		}
	}
	var allBuildingTypeData = [];
	var updateBuildingTypeData = function() {
		allBuildingTypeData = [];
		var _g = 0;
		while(_g < buildingTypesWithJob.length) {
			var bt = buildingTypesWithJob[_g];
			++_g;
			allBuildingTypeData.push({ number : 0, filledHousing : 0, housing : 0});
		}
		var _g = 0;
		var _g1 = city.permanents;
		while(_g < _g1.length) {
			var pm = _g1[_g];
			++_g;
			if(pm.is(buildings_House)) {
				var thisHouse = pm;
				var cls = js_Boot.getClass(pm);
				var i = buildingTypesWithJob.indexOf(cls);
				if(i != -1) {
					var data = allBuildingTypeData[i];
					data.housing += thisHouse.get_residentCapacity();
					data.filledHousing += thisHouse.residents.length;
					data.number += 1;
				}
			}
		}
	};
	updateBuildingTypeData();
	$window.onUpdate = updateBuildingTypeData;
	var infoPadding = { left : 2, top : 5, bottom : 0, right : 0};
	var singleRowHeight = 20;
	var singleRowHeightWithoutPadding = singleRowHeight - 5;
	var buildingOptionsContainer = new gui_GUIContainer(gui,stage,$window);
	var buildingPictures = new gui_GUIContainer(gui,stage,buildingOptionsContainer);
	var buildingWorkerNumbersContainer = new gui_GUIContainer(gui,stage,buildingOptionsContainer);
	buildingPictures.direction = gui_GUIContainerDirection.Vertical;
	buildingWorkerNumbersContainer.direction = gui_GUIContainerDirection.Vertical;
	var _g = 0;
	var _g1 = buildingTypesWithJob.length;
	while(_g < _g1) {
		var i = [_g++];
		var buildingType = buildingTypesWithJob[i[0]];
		var className = buildingType.__name__;
		var buildingTypeData = allBuildingTypeData[i[0]];
		var thisBuildingPictureContainer = new gui_GUIContainer(gui,stage,buildingPictures);
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
		thisBuildingNumberContainer.addChild(new gui_TextElement(thisBuildingNumberContainer,stage,"x" + buildingTypeData.number + ": "));
		thisBuildingPictureContainer.addChild(thisBuildingNumberContainer);
		buildingPictures.addChild(thisBuildingPictureContainer);
		var workerNumberContainer = new gui_GUIContainer(gui,stage,buildingWorkerNumbersContainer,null,null,null,null,infoPadding);
		workerNumberContainer.minHeight = singleRowHeightWithoutPadding;
		workerNumberContainer.addChild(new gui_TextElement(workerNumberContainer,stage,null,(function(i) {
			return function() {
				return common_Localize.lo("residents",[allBuildingTypeData[i[0]].filledHousing,allBuildingTypeData[i[0]].housing]);
			};
		})(i)));
		buildingWorkerNumbersContainer.addChild(workerNumberContainer);
	}
	if(buildingTypesWithJob.length == 0) {
		gui.windowAddInfoText(common_Localize.lo("there_are_no_houses"));
	}
	buildingOptionsContainer.addChild(buildingPictures);
	buildingOptionsContainer.addChild(buildingWorkerNumbersContainer);
	$window.addChild(buildingOptionsContainer);
	var _g = ($_=city.gui,$bind($_,$_.reloadWindow));
	var city1 = city;
	var gui1 = gui;
	var stage1 = stage;
	var window1 = $window;
	var createWindowFunc = function() {
		gui_HouseInformationWindow.createWindow(city1,gui1,stage1,window1);
	};
	var tmp = function() {
		_g(createWindowFunc);
	};
	city.windowRelatedOnBuildOrDestroy = tmp;
	$window.onDestroy = function() {
		city.windowRelatedOnBuildOrDestroy = null;
	};
	gui.windowAddBottomButtons();
};
gui_HouseInformationWindow.getHousingHelpText = function(stats) {
	if(stats.peopleWithHome >= stats.people) {
		if(stats.houseCapacity == stats.peopleWithHome) {
			return common_Localize.lo("houses_exactly_enough");
		} else {
			return common_Localize.lo("house_n_cap_remaining",[stats.houseCapacity - stats.peopleWithHome]);
		}
	} else {
		var homeless = stats.people - stats.peopleWithHome;
		if(homeless == 1) {
			return common_Localize.lo("homeless_one");
		} else {
			return common_Localize.lo("homeless_n",[homeless]);
		}
	}
};
