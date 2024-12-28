var gui_HappinessWindow = $hxClasses["gui.HappinessWindow"] = function() { };
gui_HappinessWindow.__name__ = "gui.HappinessWindow";
gui_HappinessWindow.create = function(city,gui,stage,$window) {
	gui.windowAllowBanner();
	gui.windowAddTitleText(common_Localize.lo("happiness"),null,Resources.getTexture("spr_happiness"));
	var lineHeight = 12;
	var mainContainer = new gui_GUIContainer(gui,stage,$window);
	$window.addChild(mainContainer);
	var mainTexts = new gui_GUIContainer(gui,stage,mainContainer);
	mainTexts.direction = gui_GUIContainerDirection.Vertical;
	mainContainer.addChild(mainTexts);
	var mainNumbers = new gui_GUIContainer(gui,stage,mainContainer);
	mainNumbers.direction = gui_GUIContainerDirection.Vertical;
	mainContainer.addChild(mainNumbers);
	var addTexts = function(getText,getText2,isVisible,paddingLeft,paddingTop) {
		if(paddingTop == null) {
			paddingTop = 0;
		}
		if(paddingLeft == null) {
			paddingLeft = 0;
		}
		var mainTextsHider = new gui_HideableContainer(mainTexts,isVisible);
		var mainTextsChild = new gui_GUIContainer(gui,stage,mainTextsHider,null,null,null,null,{ left : paddingLeft, right : 0, bottom : 0, top : paddingTop});
		mainTextsChild.addChild(new gui_TextElement(mainTextsChild,stage,null,getText,null,null,null,true));
		mainTextsChild.addChild(new gui_GUISpacing(mainTextsChild,new common_Point(5,lineHeight)));
		mainTextsHider.setChild(mainTextsChild);
		mainTexts.addChild(mainTextsHider);
		var mainNumbersHider = new gui_HideableContainer(mainNumbers,isVisible);
		var mainNumbersChilds = new gui_GUIContainer(gui,stage,mainNumbersHider,null,null,null,null,{ left : 0, right : 0, bottom : 0, top : paddingTop});
		mainNumbersChilds.addChild(new gui_TextElement(mainNumbersChilds,stage,null,getText2,null,null,null,true));
		mainNumbersChilds.addChild(new gui_GUISpacing(mainNumbersChilds,new common_Point(0,lineHeight)));
		mainNumbersHider.setChild(mainNumbersChilds);
		mainNumbers.addChild(mainNumbersHider);
	};
	var addTextNumber = function(getText2,isVisible,paddingLeft,paddingTop,paddingBottom) {
		if(paddingBottom == null) {
			paddingBottom = 0;
		}
		if(paddingTop == null) {
			paddingTop = 0;
		}
		if(paddingLeft == null) {
			paddingLeft = 0;
		}
		var mainNumbersHider = new gui_HideableContainer(mainNumbers,isVisible);
		var mainNumbersChilds = new gui_GUIContainer(gui,stage,mainNumbersHider,null,null,null,null,{ left : 0, right : 0, bottom : paddingBottom, top : paddingTop});
		mainNumbersChilds.addChild(new gui_TextElement(mainNumbersChilds,stage,null,getText2,null,null,null,true));
		mainNumbersChilds.addChild(new gui_GUISpacing(mainNumbersChilds,new common_Point(0,lineHeight)));
		mainNumbersHider.setChild(mainNumbersChilds);
		mainNumbers.addChild(mainNumbersHider);
	};
	var happiness = city.simulation.happiness;
	addTexts(function() {
		return common_Localize.lo("home_happiness");
	},function() {
		return "" + (happiness.homeHappiness | 0);
	});
	if(happiness.hippieLifestyle) {
		addTexts(function() {
			return common_Localize.lo("one_with_nature_happiness") + ":      ";
		},function() {
			return "" + (happiness.oneWithNatureHappiness | 0);
		});
	} else {
		addTexts(function() {
			return common_Localize.lo("sense_of_purpose");
		},function() {
			return "" + (happiness.purposeHappiness | 0);
		});
	}
	addTextNumber(function() {
		return "" + (happiness.entertainmentHappiness | 0);
	},null,2,0);
	var outerElem2 = new gui_GUIContainer(city.gui,city.gui.innerWindowStage,mainTexts);
	mainTexts.addChild(outerElem2);
	var createEntertainmentInfoWindow = null;
	createEntertainmentInfoWindow = function() {
		city.gui.createWindow("entertainmentHappinessWindow");
		gui_EntertainmentInformationWindow.create(city,city.gui,city.gui.innerWindowStage,city.gui.windowInner);
		city.gui.addWindowToStack(createEntertainmentInfoWindow);
		city.gui.setWindowReload(createEntertainmentInfoWindow);
	};
	var containerButton = new gui_ContainerButton(city.gui,city.gui.innerWindowStage,outerElem2,createEntertainmentInfoWindow);
	var outerElem = containerButton.container;
	outerElem.padding = { left : 2, right : 3, top : 0, bottom : 0};
	var textElem = new gui_TextElement(outerElem2,city.gui.innerWindowStage,common_Localize.lo("entertainment_happiness"),null,"Arial",{ left : 0, top : 0, bottom : 0, right : 3},null,true);
	outerElem2.addChild(textElem);
	var textElem = new gui_TextElement(outerElem,city.gui.innerWindowStage,"...",null,"Arial",{ left : 3, top : -1, bottom : 0, right : 3},null,true);
	outerElem.addChild(textElem);
	outerElem2.addChild(containerButton);
	var happiness1 = city.simulation.happiness;
	var _g = 0;
	var _g1 = happiness1.entertainmentTypes.length;
	while(_g < _g1) {
		var i = [_g++];
		var entertainmentType = [happiness1.entertainmentTypes[i[0]]];
		addTexts((function(entertainmentType) {
			return function() {
				return simulation_EntertainmentTypeHelpers.getName(entertainmentType[0]) + ":";
			};
		})(entertainmentType),(function(i) {
			return function() {
				return "" + (happiness1.happinessPerEntertainmentType[i[0]] | 0);
			};
		})(i),null,10);
	}
	if(city.progress.story.storyName == "cityofthekey" || city.progress.ruleset == progress_Ruleset.KeyCity) {
		addTexts(function() {
			return common_Localize.lo("glory_of_the_key") + ":";
		},function() {
			return "" + (happiness1.gloryOfTheKey.gloryOfTheKeyHappiness | 0);
		});
		addTexts(function() {
			return common_Localize.lo("sculptures") + ":";
		},function() {
			return "" + (happiness1.gloryOfTheKey.sculpturesHappiness | 0);
		},null,10);
		addTexts(function() {
			return common_Localize.lo("luxury_housing") + ":";
		},function() {
			return "" + (happiness1.gloryOfTheKey.highEndHomeHappiness | 0);
		},null,10);
		addTexts(function() {
			return common_Localize.lo("high_end_restaurants") + ":";
		},function() {
			return "" + (happiness1.gloryOfTheKey.expensiveRestaurantHappiness | 0);
		},null,10);
	}
	addTexts(function() {
		return common_Localize.lo("education_happiness");
	},function() {
		return "" + (happiness1.schoolHappiness | 0);
	});
	addTexts(function() {
		return common_Localize.lo("medical_happiness");
	},function() {
		return "" + (happiness1.medicalHappiness | 0);
	});
	addTexts(function() {
		return common_Localize.lo("food_shortage_unhappiness");
	},function() {
		return "-" + (happiness1.foodShortageUnhappiness | 0);
	},function() {
		return happiness1.foodShortageUnhappiness > 0;
	});
	addTexts(function() {
		return common_Localize.lo("food_rationing_unhappiness");
	},function() {
		return "-" + (happiness1.foodRationingUnhappiness | 0);
	},function() {
		return happiness1.foodRationingUnhappiness > 0;
	});
	addTexts(function() {
		return common_Localize.lo("mandatory_overtime_unhappiness");
	},function() {
		return "-" + (happiness1.overtimeUnhappinessShown | 0);
	},function() {
		return happiness1.overtimeUnhappinessShown > 0;
	});
	addTexts(function() {
		return common_Localize.lo("new_city_enthousiasm");
	},function() {
		return "+" + (happiness1.enthusiasmHappiness | 0);
	},function() {
		return happiness1.enthusiasmHappiness != 0;
	});
	addTexts(function() {
		var res = "";
		var _g = 0;
		var _g1 = happiness1.happinessBoosts;
		while(_g < _g1.length) {
			var bst = _g1[_g];
			++_g;
			if(res != "") {
				res += "\n";
			}
			res += "" + bst.text + ":";
		}
		return res;
	},function() {
		var res = "";
		var _g = 0;
		var _g1 = happiness1.happinessBoosts;
		while(_g < _g1.length) {
			var bst = _g1[_g];
			++_g;
			if(res != "") {
				res += "\n";
			}
			if(bst.boost > 0) {
				res += "+" + (bst.boost | 0);
			} else {
				res += "" + (bst.boost | 0);
			}
		}
		return res;
	},function() {
		return happiness1.happinessBoosts.length > 0;
	},0,4);
	addTexts(function() {
		return common_Localize.lo("total_happiness");
	},function() {
		return "" + (happiness1.happiness | 0);
	},null,0,4);
	addTexts(function() {
		return common_Localize.lo("work_speed_modifier");
	},function() {
		return "" + common_MathExtensions.floatFormat(Math,happiness1.actionSpeedModifier,2);
	});
	if(happiness1.happiness < 100) {
		gui_windowParts_FullSizeTextButton.create(city.gui,function() {
			gui_HappinessWindow.createExplainIncreaseWindow(city,city.gui);
		},city.gui.windowInner,function() {
			return common_Localize.lo("explain_increase_happiness");
		},city.gui.innerWindowStage);
	}
	city.gui.windowInner.addChild(new gui_GUISpacing(city.gui.windowInner,new common_Point(2,4)));
	gui.windowAddBottomButtons();
};
gui_HappinessWindow.createExplainIncreaseWindow = function(city,gui) {
	gui.createWindow("explain_increase_happiness",Resources.getTexture("spr_9p_window_moreopaque"),80);
	var city1 = city;
	var gui1 = gui;
	gui.addWindowToStack(function() {
		gui_HappinessWindow.createExplainIncreaseWindow(city1,gui1);
	});
	var buildingsByType = city.getAmountOfPermanentsPerType();
	gui.windowAddTitleText(common_Localize.lo("explain_increase_happiness_short"));
	if(city.simulation.happiness.numberOfGroupsWithCitizens > 1) {
		gui.windowAddInfoText(null,function() {
			if(city.simulation.happiness.numberOfGroupsWithCitizens > 1) {
				return common_Localize.lo("explainer_happiness_multiple_grous");
			} else {
				return "";
			}
		});
		city.gui.windowInner.addChild(new gui_GUISpacing(city.gui.windowInner,new common_Point(2,4)));
	}
	var anyExplainer = false;
	if(city.simulation.happiness.foodShortageUnhappiness > 0) {
		gui.windowAddInfoText(common_Localize.lo("explainer_food_happiness"));
		anyExplainer = true;
		var this1 = city.getAmountOfPermanentsPerType();
		if(Object.prototype.hasOwnProperty.call(this1.h,"buildings.IndoorFarm") && (!Object.prototype.hasOwnProperty.call(city.simulation.jobAssigner.priorityJobs.h,"buildings.IndoorFarm") || city.simulation.jobAssigner.priorityJobs.h["buildings.IndoorFarm"] == 0)) {
			gui.windowAddInfoText(common_Localize.lo("explainer_food_happiness_2"));
		}
	} else if(city.simulation.happiness.overtimeUnhappinessShown >= 15 && common_ArrayExtensions.any(city.policies.policies,function(p) {
		return ((p) instanceof policies_MandatoryOvertime);
	})) {
		gui.windowAddInfoText(common_Localize.lo("explainer_policy_unhappiness"));
		anyExplainer = true;
	} else {
		if(city.simulation.happiness.homeHappiness < 100) {
			gui.windowAddInfoText(common_Localize.lo("home_happiness"),null,"Arial15");
			if(city.simulation.stats.peopleWithHome < city.simulation.citizens.length) {
				gui.windowAddInfoText(common_Localize.lo("explainer_home_happiness_enough"));
			} else {
				gui.windowAddInfoText(common_Localize.lo("explainer_home_happiness"));
				if(buildingsByType.h["buildings.NormalHouse"] >= 1 && buildingsByType.h["buildings.LivingResearchCenter"] >= 1) {
					gui.windowAddInfoText(common_Localize.lo("explainer_home_happiness_basic"));
				}
			}
			city.gui.windowInner.addChild(new gui_GUISpacing(city.gui.windowInner,new common_Point(2,4)));
			anyExplainer = true;
		}
		if(!city.simulation.happiness.hippieLifestyle) {
			if(city.simulation.happiness.purposeHappiness < 100) {
				gui.windowAddInfoText(common_Localize.lo("sense_of_purpose"),null,"Arial15");
				gui.windowAddInfoText(common_Localize.lo("explainer_sense_of_purpose"));
				city.gui.windowInner.addChild(new gui_GUISpacing(city.gui.windowInner,new common_Point(2,4)));
				anyExplainer = true;
			}
		}
		if(city.simulation.happiness.hippieLifestyle && city.simulation.happiness.oneWithNatureHappiness < 100) {
			gui.windowAddInfoText(common_Localize.lo("one_with_nature_happiness"),null,"Arial15");
			gui.windowAddInfoText(common_Localize.lo("explainer_one_with_nature_happiness"));
			city.gui.windowInner.addChild(new gui_GUISpacing(city.gui.windowInner,new common_Point(2,4)));
			anyExplainer = true;
		}
		if(city.simulation.happiness.entertainmentHappiness < 100) {
			gui.windowAddInfoText(common_Localize.lo("entertainment_happiness"),null,"Arial15");
			gui.windowAddInfoText(common_Localize.lo("explainer_entertainment_happiness"));
			city.gui.windowInner.addChild(new gui_GUISpacing(city.gui.windowInner,new common_Point(2,4)));
			anyExplainer = true;
		}
		if(city.simulation.happiness.schoolHappiness < 100) {
			gui.windowAddInfoText(common_Localize.lo("education_happiness"),null,"Arial15");
			gui.windowAddInfoText(common_Localize.lo("explainer_education_happiness"));
			city.gui.windowInner.addChild(new gui_GUISpacing(city.gui.windowInner,new common_Point(2,4)));
			anyExplainer = true;
		}
		if(city.simulation.happiness.medicalHappiness < 100) {
			gui.windowAddInfoText(common_Localize.lo("medical_happiness"),null,"Arial15");
			if(city.simulation.happiness.medicalHappinessFillsAllCitizens) {
				gui.windowAddInfoText(common_Localize.lo("explainer_medical_happiness_2"));
			} else {
				gui.windowAddInfoText(common_Localize.lo("explainer_medical_happiness"));
			}
			city.gui.windowInner.addChild(new gui_GUISpacing(city.gui.windowInner,new common_Point(2,4)));
			anyExplainer = true;
		}
		if(city.simulation.happiness.gloryOfTheKey != null && city.simulation.happiness.gloryOfTheKey.gloryOfTheKeyHappiness < 100) {
			gui.windowAddInfoText(common_Localize.lo("glory_of_the_key"),null,"Arial15");
			gui.windowAddInfoText(common_Localize.lo("explainer_happiness_key"));
			city.gui.windowInner.addChild(new gui_GUISpacing(city.gui.windowInner,new common_Point(2,4)));
			anyExplainer = true;
		}
	}
	if(!anyExplainer) {
		gui.windowAddInfoText(common_Localize.lo("explainer_no_happiness_explainer"));
		city.gui.windowInner.addChild(new gui_GUISpacing(city.gui.windowInner,new common_Point(2,4)));
	}
	gui.windowAddBottomButtons();
};
