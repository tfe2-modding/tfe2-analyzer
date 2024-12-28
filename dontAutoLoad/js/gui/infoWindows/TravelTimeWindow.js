var gui_infoWindows_TravelTimeWindow = $hxClasses["gui.infoWindows.TravelTimeWindow"] = function() { };
gui_infoWindows_TravelTimeWindow.__name__ = "gui.infoWindows.TravelTimeWindow";
gui_infoWindows_TravelTimeWindow.createWindow = function(city,clearWindowStack) {
	if(clearWindowStack == null) {
		clearWindowStack = true;
	}
	if(clearWindowStack) {
		city.gui.clearWindowStack();
	}
	var cachedPaths = new haxe_ds_StringMap();
	city.gui.createWindow("travel_time");
	city.gui.setWindowPositioning(city.game.isMobile ? gui_WindowPosition.TopLeft : gui_WindowPosition.Top);
	city.windowRelatedOnBuildOrDestroy = function() {
		cachedPaths = new haxe_ds_StringMap();
	};
	city.gui.window.onDestroy = function() {
		city.windowRelatedOnBuildOrDestroy = null;
	};
	var city1 = city;
	var clearWindowStack1 = clearWindowStack;
	var tmp = function() {
		gui_infoWindows_TravelTimeWindow.createWindow(city1,clearWindowStack1);
	};
	city.gui.addWindowToStack(tmp);
	var windowTitle = common_Localize.lo("commute_explorer");
	var selectedPermanent = null;
	city.gui.windowAddTitleText(windowTitle);
	city.activateSpecialCityAction(new cityActions_CheckTravelTimes(city,function(pm) {
		selectedPermanent = pm;
		city.game.audio.playSound(city.game.audio.buildingClickSound);
	}));
	var showInfo = true;
	var extraSpacing = new gui_GUISpacing(city.gui.windowInner,new common_Point(2,0));
	city.gui.windowInner.addChild(extraSpacing);
	var textButtons = [];
	city.gui.windowInner.addChild(new gui_TextElement(city.gui.windowInner,city.gui.innerWindowStage,null,function() {
		var txt = "";
		if(selectedPermanent != null) {
			txt = common_Localize.lo("selected_x",[selectedPermanent.get_name()]);
			textButtons[0].setText(common_Localize.lo("deselect"));
			var people = cityActions_TravelTimes.getPeopleOfPermanent(selectedPermanent);
			if(people == null || people.length == 0) {
				txt += "\n" + common_Localize.lo("no_info_for_building");
			} else {
				var travelTimeAvg = cityActions_TravelTimes.getAverageTravelTime(selectedPermanent);
				if(travelTimeAvg == null || travelTimeAvg < 0) {
					txt += "\n" + common_Localize.lo("no_average_yet");
				} else {
					txt += "\n" + common_Localize.lo("average_travel_time",[common_MathExtensions.floatFormat(Math,travelTimeAvg,0)]);
				}
			}
			extraSpacing.rect.height = 0;
			return txt;
		} else {
			textButtons[0].setText(showInfo ? common_Localize.lo("collapse_info") : common_Localize.lo("show_info"));
		}
		if(!showInfo) {
			extraSpacing.rect.height = -1;
			return "";
		}
		txt = common_Localize.lo("check_commute_time");
		if(city.simulation.time.timeSinceStart < 1727.9999999999998) {
			txt += "\n" + common_Localize.lo("just_created_save") + " " + common_Localize.lo("data_available_time");
		} else if(city.simulation.time.timeSinceStart < city.simulation.time.lastLoadTime + 1727.9999999999998) {
			txt += "\n" + common_Localize.lo("just_loaded_save") + " " + common_Localize.lo("data_available_time");
		} else {
			var avgTime = 0.0;
			var citizensAvg = 0;
			var _g = 0;
			var _g1 = city.simulation.citizens;
			while(_g < _g1.length) {
				var citizen = _g1[_g];
				++_g;
				var ct = citizen.lastMorningCommuteTime;
				if(citizen.home == citizen.job && citizen.job != null) {
					++citizensAvg;
				} else if(ct >= 0) {
					avgTime += ct;
					++citizensAvg;
				}
			}
			if(citizensAvg > 0) {
				txt += "\n" + common_Localize.lo("average_travel_time",[common_MathExtensions.floatFormat(Math,avgTime / citizensAvg,0)]);
			}
		}
		extraSpacing.rect.height = 0;
		return txt;
	},null,null,null,false));
	var thisTextButton = null;
	textButtons = city.gui.windowAddBottomButtons([{ text : common_Localize.lo("collapse_info"), action : function() {
		if(selectedPermanent != null) {
			selectedPermanent = null;
		} else {
			showInfo = !showInfo;
		}
		thisTextButton.setText(showInfo ? common_Localize.lo("collapse_info") : common_Localize.lo("show_info"));
	}}]);
	thisTextButton = textButtons[0];
	var stage = city.furtherForegroundTempStage;
	city.gui.windowOnLateUpdate = function() {
		cityActions_TravelTimes.doHighlight(city);
		if(selectedPermanent != null && selectedPermanent.destroyed) {
			selectedPermanent = null;
		} else if(selectedPermanent != null) {
			var selectedSprite = Resources.makeSprite("spr_selectedbuilding");
			selectedSprite.position.set(selectedPermanent.position.x - 1,selectedPermanent.position.y - 1);
			stage.addChild(selectedSprite);
			var gr2 = new PIXI.Graphics();
			stage.addChild(gr2);
			var gr = new PIXI.Graphics();
			stage.addChild(gr);
			var gr3 = new PIXI.Graphics();
			stage.addChild(gr3);
			var people = cityActions_TravelTimes.getPeopleOfPermanent(selectedPermanent);
			if(people != null) {
				var linesToCreate_h = Object.create(null);
				var circlesToCreate = new haxe_ds_ObjectMap();
				gr3.beginFill(16711680,1);
				var _g = 0;
				while(_g < people.length) {
					var person = [people[_g]];
					++_g;
					if(person[0].home != null && person[0].job != null) {
						var homeAsPermanent = person[0].home;
						var route = null;
						var cachedRoute = cachedPaths.h[homeAsPermanent.id + "-" + person[0].job.id];
						if(cachedRoute == null) {
							route = city.simulation.routeFinder.query(homeAsPermanent,(function(person) {
								return function(pm) {
									return pm == person[0].job;
								};
							})(person),null,null,null,-1,person[0]);
							cachedPaths.h[homeAsPermanent.id + "-" + person[0].job.id] = route;
						} else {
							route = cachedRoute;
						}
						var _g1 = 0;
						var _g2 = route.length - 1;
						while(_g1 < _g2) {
							var i = _g1++;
							var pm1 = route[i];
							var pm2 = route[i + 1];
							var currentLine = linesToCreate_h[pm1.id + "-" + pm2.id];
							if(currentLine != null) {
								var v = currentLine + 1;
								linesToCreate_h[pm1.id + "-" + pm2.id] = v;
							} else {
								linesToCreate_h[pm1.id + "-" + pm2.id] = 1;
							}
						}
						var homeCircles = circlesToCreate.h[homeAsPermanent.__id__];
						if(homeCircles == null) {
							circlesToCreate.set(homeAsPermanent,0);
						} else {
							var v1 = homeCircles + 1;
							circlesToCreate.set(homeAsPermanent,v1);
						}
						var jobCircles = circlesToCreate.h[person[0].job.__id__];
						if(jobCircles == null) {
							circlesToCreate.set(person[0].job,0);
						} else {
							var v2 = jobCircles + 1;
							circlesToCreate.set(person[0].job,v2);
						}
					}
				}
				var ci = circlesToCreate.keys();
				while(ci.hasNext()) {
					var ci1 = ci.next();
					gr3.drawCircle(ci1.position.x + 10.,ci1.position.y + 10.,(circlesToCreate.h[ci1.__id__] + 1) / 2 + 2);
				}
				gr3.endFill();
				gr2.beginFill(0,1);
				var line = haxe_ds_StringMap.keysIterator(linesToCreate_h);
				while(line.hasNext()) {
					var line1 = line.next();
					var splitLine = line1.split("-");
					var pm1ID = Std.parseInt(splitLine[0]);
					var pm2ID = Std.parseInt(splitLine[1]);
					var pm1 = city.permanentsByID.h[pm1ID];
					var pm2 = city.permanentsByID.h[pm2ID];
					if(pm1 == null || pm2 == null) {
						continue;
					}
					var bld1 = pm1;
					var bld2 = pm2;
					var isIndirect = (pm1.is(buildings_Teleporter) && pm2.is(buildings_Teleporter) || pm1.is(buildings_Teleporter) && pm2.is(buildings_House) && pm2.get_hasPrivateTeleporter() || pm2.is(buildings_Teleporter) && pm1.is(buildings_House) && pm1.get_hasPrivateTeleporter() || pm1.is(buildings_LandingSite) && pm2.is(buildings_LandingSite) || pm1.is(buildings_HyperElevator) && pm2.is(buildings_HyperElevator)) && (!pm1.isBuilding && !pm2.isBuilding || bld1.leftBuilding != bld2 && bld1.rightBuilding != bld2 && bld1.topBuilding != bld2 && bld1.bottomBuilding != bld2);
					var x1 = pm1.position.x + 10.;
					var y1 = pm1.position.y + 10.;
					var x2 = pm2.position.x + 10.;
					var y2 = pm2.position.y + 10.;
					gr.lineStyle(linesToCreate_h[line1] + 1,0,isIndirect ? 0.5 : 1);
					gr.moveTo(x1,y1);
					gr.lineTo(x2,y2);
					if(!isIndirect) {
						gr2.drawCircle(x1,y1,(linesToCreate_h[line1] + 1) / 2);
						gr2.drawCircle(x2,y2,(linesToCreate_h[line1] + 1) / 2);
					}
				}
				gr2.endFill();
			}
		}
	};
	city.gui.windowOnDestroy = function() {
		if(city.specialAction != null) {
			city.specialAction.deactivate(true);
		}
		city.specialActionOld = null;
	};
};
