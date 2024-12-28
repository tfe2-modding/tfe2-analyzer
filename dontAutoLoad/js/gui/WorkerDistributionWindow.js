var gui_WorkerDistributionWindow = $hxClasses["gui.WorkerDistributionWindow"] = function() { };
gui_WorkerDistributionWindow.__name__ = "gui.WorkerDistributionWindow";
gui_WorkerDistributionWindow.create = function(city,gui,stage,$window) {
	gui_WorkerDistributionWindow.createWindow(city,gui,stage,$window);
};
gui_WorkerDistributionWindow.createWindow = function(city,gui,stage,$window) {
	gui.windowAllowBanner();
	$window.clear();
	gui.windowAddTitleText(common_Localize.lo("assign_workers"),null,Resources.getTexture("spr_work"));
	var buildingTypesWithJobUnsorted = [];
	var buildingTypesWithJobClassNames = [];
	var _g = 0;
	var _g1 = city.permanents;
	while(_g < _g1.length) {
		var pm = _g1[_g];
		++_g;
		if(pm.is(buildings_Work)) {
			var cls = js_Boot.getClass(pm);
			var i = buildingTypesWithJobUnsorted.indexOf(cls);
			if(i == -1) {
				i = buildingTypesWithJobUnsorted.length;
				buildingTypesWithJobUnsorted.push(cls);
				var splitClassName = cls.__name__.split(".");
				buildingTypesWithJobClassNames.push(splitClassName[splitClassName.length - 1]);
			}
		}
	}
	var buildingTypesWithJob = [];
	var _g = 0;
	var _g1 = city.progress.resources.buildingInfoArray;
	while(_g < _g1.length) {
		var bi = _g1[_g];
		++_g;
		var i = buildingTypesWithJobClassNames.indexOf(bi.className);
		if(i != -1) {
			buildingTypesWithJob.push(buildingTypesWithJobUnsorted[i]);
		}
	}
	var allBuildingTypeData = [];
	var updateBuildingTypeData = function() {
		allBuildingTypeData = [];
		var _g = 0;
		while(_g < buildingTypesWithJob.length) {
			var bt = buildingTypesWithJob[_g];
			++_g;
			allBuildingTypeData.push({ number : 0, filledJobs : 0, jobs : 0});
		}
		var _g = 0;
		var _g1 = city.permanents;
		while(_g < _g1.length) {
			var pm = _g1[_g];
			++_g;
			if(pm.is(buildings_Work)) {
				var thisJob = pm;
				var cls = js_Boot.getClass(pm);
				var i = buildingTypesWithJob.indexOf(cls);
				if(i != -1) {
					var data = allBuildingTypeData[i];
					data.jobs += thisJob.get_jobs();
					data.filledJobs += thisJob.workers.length;
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
	var priorityChooseContainer = new gui_GUIContainer(gui,stage,buildingOptionsContainer);
	buildingPictures.direction = gui_GUIContainerDirection.Vertical;
	buildingWorkerNumbersContainer.direction = gui_GUIContainerDirection.Vertical;
	priorityChooseContainer.direction = gui_GUIContainerDirection.Vertical;
	var _g = 0;
	var _g1 = buildingTypesWithJob.length;
	while(_g < _g1) {
		var i = [_g++];
		var buildingType = [buildingTypesWithJob[i[0]]];
		var className = [buildingType[0].__name__];
		if(city.progress.story.storyName == "cityofthekey" && className[0] == "buildings.SecretSocietyHouse") {
			continue;
		}
		if(city.progress.story.storyName == "hippiecommune" && className[0] == "buildings.BlossomHippieHQ") {
			continue;
		}
		var buildingTypeData = allBuildingTypeData[i[0]];
		var thisBuildingPictureContainer = new gui_GUIContainer(gui,stage,buildingPictures);
		thisBuildingPictureContainer.addChild(gui_BuildingTypeImage.create(stage,city,buildingType[0],thisBuildingPictureContainer,gui));
		var thisBuildingNumberContainer = new gui_GUIContainer(gui,stage,thisBuildingPictureContainer,null,null,null,null,infoPadding);
		thisBuildingNumberContainer.addChild(new gui_TextElement(thisBuildingNumberContainer,stage,"x" + buildingTypeData.number + ": "));
		thisBuildingPictureContainer.addChild(thisBuildingNumberContainer);
		buildingPictures.addChild(thisBuildingPictureContainer);
		var workerNumberContainer = new gui_GUIContainer(gui,stage,buildingWorkerNumbersContainer,null,null,null,null,infoPadding);
		workerNumberContainer.minHeight = singleRowHeightWithoutPadding;
		workerNumberContainer.addChild(new gui_TextElement(workerNumberContainer,stage,null,(function(i) {
			return function() {
				return common_Localize.lo("workers",[allBuildingTypeData[i[0]].filledJobs,allBuildingTypeData[i[0]].jobs]) + ",";
			};
		})(i)));
		buildingWorkerNumbersContainer.addChild(workerNumberContainer);
		var topPaddingPrio = 2;
		var priorityWorkersContainer = new gui_GUIContainer(gui,stage,priorityChooseContainer,null,null,null,null,{ left : 4, top : topPaddingPrio, bottom : 0, right : 0});
		priorityWorkersContainer.minHeight = singleRowHeight - topPaddingPrio;
		var currentPrioNumber = city.simulation.jobAssigner.priorityJobs.h[className[0]];
		if(currentPrioNumber == null) {
			currentPrioNumber = 0;
		}
		var numberSelectControl = new gui_NumberSelectControl(gui,stage,priorityWorkersContainer,null,(function() {
			return function() {
				return 0;
			};
		})(),(function(i) {
			return function() {
				return allBuildingTypeData[i[0]].jobs;
			};
		})(i),currentPrioNumber,(function(className,buildingType) {
			return function(n) {
				var currentPrioJobs = city.simulation.jobAssigner.priorityJobs.h[className[0]];
				if(currentPrioJobs > n) {
					city.simulation.jobAssigner.availableClassesForJob.push({ classType : PermanentMetaHelper.getClassID(buildingType[0].__name__), number : currentPrioJobs - n});
				}
				city.simulation.jobAssigner.priorityJobs.h[className[0]] = n;
				city.simulation.jobAssigner.buildingsHaveWork = true;
			};
		})(className,buildingType),(function(i) {
			return function() {
				if(city.game.keyboard.down[16]) {
					return 0;
				} else if(city.game.keyboard.down[17]) {
					return 1000000;
				}
				return allBuildingTypeData[i[0]].filledJobs;
			};
		})(i),city.game.isMobile ? common_Localize.lo("set_priority_jobs_mobi") : common_Localize.lo("set_priority_jobs_desktop"));
		numberSelectControl.enableBeyondHighestValuePossibility(1000000,"Max");
		priorityWorkersContainer.addChild(numberSelectControl);
		if(className[0] == "buildings.StoneMine") {
			gui_WorkerDistributionWindow.tutorialStoneMineUpButton = numberSelectControl.upButton;
			gui_WorkerDistributionWindow.tutorialStoneMineDownButton = numberSelectControl.downButton;
		} else if(className[0] == "buildings.WoodcuttingCentre") {
			gui_WorkerDistributionWindow.tutorialWoodCuttersUpButton = numberSelectControl.upButton;
		}
		priorityWorkersContainer.addChild(new gui_TextElement(priorityWorkersContainer,stage," " + common_Localize.lo("priority") + ".",null,null,{ left : 0, top : 3, bottom : 0, right : 0}));
		priorityChooseContainer.addChild(priorityWorkersContainer);
	}
	if(buildingTypesWithJob.length == 0) {
		gui.windowAddInfoText(common_Localize.lo("no_work_buildings"));
	}
	buildingOptionsContainer.addChild(buildingPictures);
	buildingOptionsContainer.addChild(buildingWorkerNumbersContainer);
	buildingOptionsContainer.addChild(priorityChooseContainer);
	$window.addChild(buildingOptionsContainer);
	var _g = ($_=city.gui,$bind($_,$_.reloadWindow));
	var city1 = city;
	var gui1 = gui;
	var stage1 = stage;
	var window1 = $window;
	var createWindowFunc = function() {
		gui_WorkerDistributionWindow.createWindow(city1,gui1,stage1,window1);
	};
	var tmp = function() {
		_g(createWindowFunc);
	};
	city.windowRelatedOnBuildOrDestroy = tmp;
	$window.onDestroy = function() {
		city.windowRelatedOnBuildOrDestroy = null;
		gui_WorkerDistributionWindow.tutorialStoneMineUpButton = null;
		gui_WorkerDistributionWindow.tutorialStoneMineDownButton = null;
		gui_WorkerDistributionWindow.tutorialWoodCuttersUpButton = null;
	};
	gui.windowAddBottomButtons();
};
