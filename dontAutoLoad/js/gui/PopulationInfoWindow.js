var gui_PopulationInfoWindow = $hxClasses["gui.PopulationInfoWindow"] = function() { };
gui_PopulationInfoWindow.__name__ = "gui.PopulationInfoWindow";
gui_PopulationInfoWindow.create = function(city,gui,stage,$window) {
	gui_PopulationInfoWindow.createWindow(city,gui,stage,$window);
};
gui_PopulationInfoWindow.createWindow = function(city,gui,stage,$window) {
	$window.clear();
	gui.windowAddTitleText(common_Localize.lo("pop_by_age"),null,Resources.getTexture("spr_population"));
	var childrenTotal = 0;
	gui.windowAddInfoText(null,function() {
		return common_Localize.lo("citizens_and_children",[city.simulation.citizens.length,childrenTotal]);
	});
	gui.windowAddInfoText(null,function() {
		return common_Localize.lo("citizens_by_age_explain");
	});
	var ageExceedingCitizensExist = false;
	var oldestAge = 0;
	var graphicsContainer = new PIXI.Container();
	var graphics = new PIXI.Graphics();
	var citizensPerAge;
	var graphStartX = 40;
	var graphMaxWidth = 210;
	var maxAge = 120;
	var ageRangeSize = 10;
	var drawAgeGraphicsAndStats = function() {
		ageExceedingCitizensExist = false;
		oldestAge = 0;
		graphics.clear();
		graphics.beginFill(0);
		graphics.drawRect(0,0,1,maxAge);
		graphics.drawRect(graphStartX - 1,0,1,maxAge);
		graphics.drawRect(0,maxAge,graphStartX,1);
		var _g = [];
		var _g1 = 0;
		var _g2 = maxAge + 1;
		while(_g1 < _g2) {
			var i = _g1++;
			_g.push(0);
		}
		citizensPerAge = _g;
		childrenTotal = 0;
		var _g = 0;
		var _g1 = city.simulation.citizens;
		while(_g < _g1.length) {
			var citizen = _g1[_g];
			++_g;
			var age = citizen.get_age() | 0;
			if(age > maxAge) {
				citizensPerAge[maxAge]++;
				ageExceedingCitizensExist = true;
			} else {
				citizensPerAge[age]++;
			}
			if(age < 16) {
				childrenTotal += 1;
			}
			if(age > oldestAge) {
				oldestAge = age;
			}
		}
		var maxCitizens = common_ArrayExtensions.max(citizensPerAge);
		if(maxCitizens != 0) {
			var _g = 0;
			var _g1 = maxAge + 1;
			while(_g < _g1) {
				var age = _g++;
				var scale = citizensPerAge[age] / maxCitizens;
				graphics.drawRect(graphStartX,age,scale * graphMaxWidth,1);
				graphics.drawRect(graphStartX,age,scale * graphMaxWidth,1);
				if(age % ageRangeSize == 0) {
					graphics.drawRect(0,age,graphStartX,1);
				}
			}
		}
		graphics.endFill();
	};
	drawAgeGraphicsAndStats();
	graphicsContainer.addChild(graphics);
	var holder = null;
	holder = new gui_ContainerHolder($window,stage,graphicsContainer,{ left : 0, right : 0, top : 0, bottom : 3},drawAgeGraphicsAndStats,function(mouse) {
		var holder1;
		var val = mouse.get_x();
		if(val >= holder.rect.x && val < holder.rect.x + holder.rect.width) {
			var val = mouse.get_y();
			holder1 = val >= holder.rect.y && val < holder.rect.y + holder.rect.height;
		} else {
			holder1 = false;
		}
		if(holder1) {
			if(mouse.get_x() >= holder.rect.x + graphStartX) {
				var selectedAge = mouse.get_y() - holder.rect.y;
				if(selectedAge < maxAge || selectedAge == maxAge && !ageExceedingCitizensExist) {
					gui.tooltip.setText(holder,citizensPerAge[selectedAge] == 1 ? common_Localize.lo("one_citizen_age",[selectedAge]) : common_Localize.lo("n_citizens_age",[citizensPerAge[selectedAge],selectedAge]));
				} else if(selectedAge == maxAge) {
					gui.tooltip.setText(holder,citizensPerAge[selectedAge] == 1 ? common_Localize.lo("one_citizen_age_oldest",[selectedAge + "+",oldestAge]) : common_Localize.lo("n_citizens_age_oldest",[citizensPerAge[selectedAge],selectedAge + "+",oldestAge]));
				}
			} else {
				var selectedAgeRange = ((mouse.get_y() - holder.rect.y) / ageRangeSize | 0) * ageRangeSize;
				if(selectedAgeRange < maxAge) {
					var numberOfCitizensInRange = 0;
					var isLastAgeRange = selectedAgeRange == maxAge - ageRangeSize;
					var _g = selectedAgeRange;
					var _g1 = selectedAgeRange + ageRangeSize + (isLastAgeRange ? 1 : 0);
					while(_g < _g1) {
						var i = _g++;
						numberOfCitizensInRange += citizensPerAge[i];
					}
					if(isLastAgeRange && ageExceedingCitizensExist) {
						gui.tooltip.setText(holder,numberOfCitizensInRange == 1 ? common_Localize.lo("one_citizen_age_upper_range",[selectedAgeRange]) : common_Localize.lo("n_citizens_age_upper_range",[numberOfCitizensInRange,selectedAgeRange]));
					} else {
						gui.tooltip.setText(holder,numberOfCitizensInRange == 1 ? common_Localize.lo("one_citizen_age_range",[selectedAgeRange,selectedAgeRange + ageRangeSize]) : common_Localize.lo("n_citizens_age_range",[numberOfCitizensInRange,selectedAgeRange,selectedAgeRange + ageRangeSize]));
					}
				}
			}
			return true;
		}
		return false;
	});
	$window.addChild(holder);
	var _g = 0;
	var _g1 = maxAge / ageRangeSize | 0;
	while(_g < _g1) {
		var i = _g++;
		var bitmapText = new graphics_BitmapText("" + i * 10 + "-" + (i * 10 + 10),{ font : "Arial10", tint : 0},true);
		if(i == (maxAge / ageRangeSize | 0) - 1 && ageExceedingCitizensExist) {
			bitmapText.set_text("" + i * 10 + "+");
		}
		bitmapText.position.set(2,i * 10);
		graphicsContainer.addChild(bitmapText);
	}
	$window.onDestroy = function() {
		graphics.destroy();
	};
	var popLimitController = new gui_GUIContainer(gui,stage,$window);
	popLimitController.direction = gui_GUIContainerDirection.Vertical;
	var hasCreatedPopLimitController = false;
	popLimitController.onUpdate = function() {
		if(!hasCreatedPopLimitController && city.simulation.citizens.length >= 1950) {
			var popLimitController2 = new gui_GUIContainer(gui,stage,$window);
			popLimitController2.direction = gui_GUIContainerDirection.Horizontal;
			hasCreatedPopLimitController = true;
			popLimitController2.padding.bottom = 6;
			var popLimitText = new gui_TextElement(popLimitController,stage,common_Localize.lo("pop_limit") + " ");
			popLimitText.padding.top = 1;
			popLimitController2.addChild(popLimitText);
			popLimitController2.addChild(new gui_GUISpacing(popLimitController2,new common_Point(4,2)));
			var gui1 = gui;
			var stage1 = stage;
			var city1 = city.simulation.babyMaker.softPopLimit;
			var numberSelectControl = common_Localize.lo("reset_pop_limit");
			var numberSelectControl1 = new gui_NumberSelectControl(gui1,stage1,popLimitController2,{ left : 0, right : 0, top : 0, bottom : 0},function() {
				return 2000;
			},function() {
				if(Settings.hasSecretCode("unlimitedPop")) {
					return 99999999;
				} else {
					return gui_PopulationInfoWindow.maximumPopLimit;
				}
			},city1,function(v) {
				city.simulation.babyMaker.softPopLimit = v;
			},function() {
				return 3000;
			},numberSelectControl,25);
			popLimitController2.addChild(numberSelectControl1);
			popLimitController.addChild(popLimitController2);
			popLimitController.addChild(new gui_TextElement(popLimitController,stage,common_Localize.lo("pop_limit_hint")));
		}
	};
	$window.addChild(popLimitController);
	gui.windowAddBottomButtons([{ text : common_Localize.lo("follow_citizen"), action : function() {
		city.viewActions.showFollow();
	}}]);
};
