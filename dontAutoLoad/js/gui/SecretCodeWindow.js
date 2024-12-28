var gui_SecretCodeWindow = $hxClasses["gui.SecretCodeWindow"] = function() { };
gui_SecretCodeWindow.__name__ = "gui.SecretCodeWindow";
gui_SecretCodeWindow.create = function(city,gui,stage,thisWindow) {
	gui.windowAddTitleText(common_Localize.lo("secret_code"));
	thisWindow.addChild(new gui_TextElement(thisWindow,stage,common_Localize.lo("secret_code_use") + "\n" + common_Localize.lo("secret_code_acquire")));
	thisWindow.addChild(new gui_GUISpacing(gui.windowInner,new common_Point(2,2)));
	thisWindow.addChild(new gui_TextButton(gui,stage,gui.windowInner,function() {
	},common_Localize.lo("mailing_list_header"),function() {
		return false;
	},function() {
		city.game.setOnClickTo = function() {
			window.open(Config.mailingListURL,"_blank");
		};
	}));
	thisWindow.addChild(new gui_GUISpacing(gui.windowInner,new common_Point(2,6)));
	thisWindow.addChild(new gui_TextElement(thisWindow,stage,common_Localize.lo("sample_code_1") + " Dance All Night"));
	thisWindow.addChild(new gui_GUISpacing(gui.windowInner,new common_Point(2,4)));
	var handleInput = function(input) {
		if(input == null) {
			return false;
		}
		switch(input.toLowerCase()) {
		case "coolmath":
			var createThisWindow = null;
			createThisWindow = function() {
				gui.showSimpleWindow(gui_SecretCodeWindow.getCoolMathText(city,true),"",true);
				gui.addWindowToStack(createThisWindow,true);
				gui.setWindowReload(createThisWindow);
			};
			createThisWindow();
			return true;
		case "dance all night":
			Settings.unlockSecretCode("nightClubColors");
			var createThisWindow1 = null;
			createThisWindow1 = function() {
				gui.showSimpleWindow(common_Localize.lo("secret_code_1"),common_Localize.lo("secret_code_activated"),true);
				gui.addWindowToStack(createThisWindow1,true);
				gui.setWindowReload(createThisWindow1);
			};
			createThisWindow1();
			return true;
		case "debug_pathfinder":
			gui.createWindow();
			gui.windowAddInfoText(null,function() {
				return "" + city.simulation.pathfinder.getTotalNumberOfRequested() + " - " + city.simulation.pathfinder.numberOfPathsDoneLastStepPerThread;
			});
			return true;
		case "hangar":
			Settings.unlockSecretCode("hangar");
			var createThisWindow2 = null;
			createThisWindow2 = function() {
				gui.showSimpleWindow("",common_Localize.lo("secret_code_activated"),true);
				gui.addWindowToStack(createThisWindow2,true);
				gui.setWindowReload(createThisWindow2);
			};
			createThisWindow2();
			return true;
		case "maximum lag":
			Settings.unlockSecretCode("unlimitedPop");
			var createThisWindow3 = null;
			createThisWindow3 = function() {
				gui.showSimpleWindow(common_Localize.lo("secret_code_4"),common_Localize.lo("secret_code_activated"),true);
				gui.addWindowToStack(createThisWindow3,true);
				gui.setWindowReload(createThisWindow3);
			};
			createThisWindow3();
			return true;
		case "orchid":
			Settings.unlockSecretCode("orchid");
			var createThisWindow4 = null;
			createThisWindow4 = function() {
				gui.showSimpleWindow(common_Localize.lo("secret_code_2"),common_Localize.lo("secret_code_activated"),true);
				gui.addWindowToStack(createThisWindow4,true);
				gui.setWindowReload(createThisWindow4);
			};
			createThisWindow4();
			return true;
		case "stats":
			var createThisWindow5 = null;
			createThisWindow5 = function() {
				gui.showSimpleWindow(gui_SecretCodeWindow.getCoolMathText(city,false),"",true);
				gui.addWindowToStack(createThisWindow5,true);
				gui.setWindowReload(createThisWindow5);
			};
			createThisWindow5();
			return true;
		}
		return false;
	};
	if(5 == 8) {
		thisWindow.addChild(new gui_TextButton(gui,stage,gui.windowInner,function() {
			var inp = window.prompt(common_Localize.lo("enter_a_secret_code"));
			if(inp != null && !handleInput(inp)) {
				window.alert(common_Localize.lo("secret_code_incorrect"));
			}
		},common_Localize.lo("enter_secret_code"),function() {
			return false;
		}));
	} else {
		var textInput = new gui_TextInput(gui.windowInner,gui,city.game,common_Localize.lo("enter_secret_code"));
		thisWindow.addChild(textInput);
		textInput.onInput = handleInput;
	}
	thisWindow.addChild(new gui_GUISpacing(gui.windowInner,new common_Point(2,4)));
	gui.windowAddBottomButtons();
};
gui_SecretCodeWindow.getCoolMathText = function(city,triggeredByCoolmath) {
	var numberOfBuildings = Lambda.count(city.permanents,function(pm) {
		return pm.isBuilding;
	});
	var nameDataText = "";
	if(Resources.citizenNames.length > 0) {
		var namesOccurences_h = Object.create(null);
		var _g = 0;
		var _g1 = city.simulation.citizens;
		while(_g < _g1.length) {
			var citizen = _g1[_g];
			++_g;
			var key = citizen.nameIndex < Resources.citizenNames.length ? Resources.citizenNames[citizen.nameIndex] : common_StringExtensions.firstToUpper(common_Localize.lo("citizen"));
			if(!Object.prototype.hasOwnProperty.call(namesOccurences_h,key)) {
				namesOccurences_h[citizen.nameIndex < Resources.citizenNames.length ? Resources.citizenNames[citizen.nameIndex] : common_StringExtensions.firstToUpper(common_Localize.lo("citizen"))] = 1;
			} else {
				var _g2 = citizen.nameIndex < Resources.citizenNames.length ? Resources.citizenNames[citizen.nameIndex] : common_StringExtensions.firstToUpper(common_Localize.lo("citizen"));
				var v = namesOccurences_h[_g2] + 1;
				namesOccurences_h[_g2] = v;
			}
		}
		var mostOccuringName = "";
		var mostOccuringNameOcc = 0;
		var totalUniqueNames = 0;
		var occ = haxe_ds_StringMap.keysIterator(namesOccurences_h);
		while(occ.hasNext()) {
			var occ1 = occ.next();
			if(mostOccuringNameOcc < namesOccurences_h[occ1]) {
				mostOccuringName = occ1;
				mostOccuringNameOcc = namesOccurences_h[occ1];
			}
			++totalUniqueNames;
		}
		var sce = "";
		if(mostOccuringNameOcc > 2 && triggeredByCoolmath) {
			sce = " If you want to know why there is a name that is so relatively common, take a look at the birthday paradox.";
		}
		nameDataText = "\n\n" + common_Localize.lo("citizen_name_stats",[city.simulation.citizens.length,totalUniqueNames,mostOccuringName,namesOccurences_h[mostOccuringName]]) + sce;
	}
	var highestStack = 0;
	var _g = 0;
	var _g1 = city.worlds;
	while(_g < _g1.length) {
		var w = _g1[_g];
		++_g;
		var _g2 = 0;
		var _g3 = w.permanents;
		while(_g2 < _g3.length) {
			var s = _g3[_g2];
			++_g2;
			var thisStackLen = 0;
			var maxStackLen = 0;
			var _g4 = 0;
			while(_g4 < s.length) {
				var b = s[_g4];
				++_g4;
				if(b != null && b.isBuilding) {
					++thisStackLen;
				} else {
					thisStackLen = 0;
				}
				if(maxStackLen <= thisStackLen) {
					maxStackLen = thisStackLen;
				}
			}
			if(highestStack <= maxStackLen) {
				highestStack = maxStackLen;
			}
		}
	}
	var transportStats = "";
	if(city.landingSites.length > 0) {
		if(transportStats == "") {
			transportStats = "\n\n";
		} else {
			transportStats += " ";
		}
		transportStats += common_Localize.lo("landing_pads_stats",[common_ArrayExtensions.sum(city.landingSites,function(ls) {
			return ls.timesUsed;
		}),common_ArrayExtensions.sum(city.landingSites,function(ls) {
			return ls.timesUsedStopOver;
		})]);
		if(city.simulation.flyingSaucers.length > 10) {
			var spaceShipPeople = common_ArrayExtensions.isum(city.simulation.flyingSaucers,function(fs) {
				return fs.passengers.length;
			});
			transportStats += " " + common_Localize.lo("landing_pads_air",[city.simulation.flyingSaucers.length,spaceShipPeople]);
		}
	}
	var _g = [];
	var _g1 = 0;
	var _g2 = city.permanents;
	while(_g1 < _g2.length) {
		var v = _g2[_g1];
		++_g1;
		if(v.is(buildings_HyperElevator)) {
			_g.push(v);
		}
	}
	var hyperElevators = _g;
	if(hyperElevators.length > 0) {
		if(transportStats == "") {
			transportStats = "\n\n";
		} else {
			transportStats += "\n";
		}
		transportStats += common_Localize.lo("hyper_elevators_stats",[common_ArrayExtensions.sum(hyperElevators,function(he) {
			return he.timesUsed;
		})]);
	}
	var _g = [];
	var _g1 = 0;
	var _g2 = city.permanents;
	while(_g1 < _g2.length) {
		var v = _g2[_g1];
		++_g1;
		if(v.is(buildings_TrainStation)) {
			_g.push(v);
		}
	}
	var trainStations = _g;
	if(trainStations.length > 0) {
		if(transportStats == "") {
			transportStats = "\n\n";
		} else {
			transportStats += "\n";
		}
		transportStats += common_Localize.lo("train_station_stats",[common_ArrayExtensions.sum(trainStations,function(he) {
			return he.timesUsed;
		})]);
	}
	if(city.teleporters.length > 0) {
		if(transportStats == "") {
			transportStats = "\n\n";
		} else {
			transportStats += "\n";
		}
		transportStats += common_Localize.lo("teleporter_stats",[common_ArrayExtensions.sum(city.teleporters,function(tp) {
			return tp.timesUsed;
		})]);
	}
	var statsText = common_Localize.lo("stats_info");
	if(triggeredByCoolmath) {
		statsText = "Alright, I did some cool math; here are some stats about your city!";
	}
	return "" + statsText + " :)\n\n" + common_Localize.lo("building_stats",[numberOfBuildings,highestStack]) + transportStats + nameDataText;
};
