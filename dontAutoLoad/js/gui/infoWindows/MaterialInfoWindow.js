var gui_infoWindows_MaterialInfoWindow = $hxClasses["gui.infoWindows.MaterialInfoWindow"] = function() { };
gui_infoWindows_MaterialInfoWindow.__name__ = "gui.infoWindows.MaterialInfoWindow";
gui_infoWindows_MaterialInfoWindow.create = function(city,gui,stage,$window,material,materialName) {
	gui_infoWindows_MaterialInfoWindow.createWindow(city,gui,stage,$window,material,materialName);
};
gui_infoWindows_MaterialInfoWindow.createWindow = function(city,gui,stage,$window,material,materialName) {
	$window.clear();
	gui.windowAddTitleText(materialName + "",null,Resources.getTexture("spr_resource_" + material.toLowerCase()));
	if(material == "stone") {
		var _g = [];
		var _g1 = 0;
		var _g2 = city.connections.numberOfWorldGroups;
		while(_g1 < _g2) {
			var i = _g1++;
			_g.push(false);
		}
		var worldGroupHasCitizens = _g;
		var _g = [];
		var _g1 = 0;
		var _g2 = city.connections.numberOfWorldGroups;
		while(_g1 < _g2) {
			var i = _g1++;
			_g.push(false);
		}
		var worldGroupHasMine = _g;
		var _g = [];
		var _g1 = 0;
		var _g2 = city.connections.numberOfWorldGroups;
		while(_g1 < _g2) {
			var i = _g1++;
			_g.push(false);
		}
		var worldGroupHasRock = _g;
		var _g = 0;
		var _g1 = city.simulation.citizens;
		while(_g < _g1.length) {
			var citizen = _g1[_g];
			++_g;
			if(citizen.onWorld != null) {
				worldGroupHasCitizens[citizen.onWorld.worldGroup] = true;
			}
		}
		var _g = 0;
		var _g1 = city.worlds;
		while(_g < _g1.length) {
			var world = _g1[_g];
			++_g;
			if(common_ArrayExtensions.any(world.permanents,function(pms) {
				return common_ArrayExtensions.any(pms,function(pm) {
					if(pm != null) {
						return pm.is(buildings_StoneMine);
					} else {
						return false;
					}
				});
			})) {
				worldGroupHasMine[world.worldGroup] = true;
			}
			if(common_ArrayExtensions.any(world.permanents,function(pms) {
				return common_ArrayExtensions.any(pms,function(pm) {
					if(pm != null) {
						if(!pm.is(worldResources_Rock)) {
							return pm.is(buildings_StoneTeleporter);
						} else {
							return true;
						}
					} else {
						return false;
					}
				});
			})) {
				worldGroupHasRock[world.worldGroup] = true;
			}
		}
		var showWarning = true;
		var anyHasMine = false;
		var _g = 0;
		var _g1 = city.connections.numberOfWorldGroups;
		while(_g < _g1) {
			var i = _g++;
			if(worldGroupHasCitizens[i] && worldGroupHasRock[i]) {
				showWarning = false;
			}
			if(worldGroupHasMine[i]) {
				anyHasMine = true;
			}
		}
		if(showWarning && anyHasMine && city.simulation.citizens.length > 0) {
			gui.windowAddInfoText(common_Localize.lo("stone_warning"));
		}
		var totalMines = Lambda.count(city.permanents,function(pm) {
			return pm.is(buildings_StoneMine);
		});
		var totalTeleporters = Lambda.count(city.permanents,function(pm) {
			return pm.is(buildings_StoneTeleporter);
		});
		if(totalTeleporters >= 12 && (totalMines <= 5 || totalMines / totalTeleporters < 0.3)) {
			gui.windowAddInfoText(common_Localize.lo("mines_warning"));
		}
	}
	var graphicsContainer = new PIXI.Container();
	var graphics = new PIXI.Graphics();
	var textContainer = new PIXI.Container();
	var stats = city.simulation.stats;
	var graphTopSpacing = 5;
	var graphBarMaxHeight = 100;
	var holder = null;
	var barWidth = 9;
	var barSpacing = 4;
	var daysToDraw = 7;
	var graphMaxWidth = 34 + barWidth * 2 * daysToDraw + barSpacing * daysToDraw;
	var drawMaterialInfo = function() {
		graphics.clear();
		graphics.beginFill(16711680,0);
		graphics.drawRect(0,0,1,1);
		graphics.endFill();
		var maxMaterials = 9.0;
		var ind = MaterialsHelper.findMaterialIndex(material);
		var thisMaterialProdStats = stats.materialProduction[ind];
		var thisMaterialConsStats = stats.materialUsed[ind];
		var anyMaterialsUsed = false;
		maxMaterials = Math.max(maxMaterials,thisMaterialProdStats[0]);
		maxMaterials = Math.max(maxMaterials,thisMaterialConsStats[0]);
		if(thisMaterialConsStats[0] > 0) {
			anyMaterialsUsed = true;
		}
		maxMaterials = Math.max(maxMaterials,thisMaterialProdStats[1]);
		maxMaterials = Math.max(maxMaterials,thisMaterialConsStats[1]);
		if(thisMaterialConsStats[1] > 0) {
			anyMaterialsUsed = true;
		}
		maxMaterials = Math.max(maxMaterials,thisMaterialProdStats[2]);
		maxMaterials = Math.max(maxMaterials,thisMaterialConsStats[2]);
		if(thisMaterialConsStats[2] > 0) {
			anyMaterialsUsed = true;
		}
		maxMaterials = Math.max(maxMaterials,thisMaterialProdStats[3]);
		maxMaterials = Math.max(maxMaterials,thisMaterialConsStats[3]);
		if(thisMaterialConsStats[3] > 0) {
			anyMaterialsUsed = true;
		}
		maxMaterials = Math.max(maxMaterials,thisMaterialProdStats[4]);
		maxMaterials = Math.max(maxMaterials,thisMaterialConsStats[4]);
		if(thisMaterialConsStats[4] > 0) {
			anyMaterialsUsed = true;
		}
		maxMaterials = Math.max(maxMaterials,thisMaterialProdStats[5]);
		maxMaterials = Math.max(maxMaterials,thisMaterialConsStats[5]);
		if(thisMaterialConsStats[5] > 0) {
			anyMaterialsUsed = true;
		}
		maxMaterials = Math.max(maxMaterials,thisMaterialProdStats[6]);
		maxMaterials = Math.max(maxMaterials,thisMaterialConsStats[6]);
		if(thisMaterialConsStats[6] > 0) {
			anyMaterialsUsed = true;
		}
		var zeroes = Math.floor(Math.log(maxMaterials) / Math.log(10));
		var dividers = Math.floor(Math.pow(10,zeroes));
		if((Math.ceil(maxMaterials) / dividers | 0) < 2) {
			dividers = dividers / 5 | 0;
		} else if((Math.ceil(maxMaterials) / dividers | 0) < 4) {
			dividers = dividers / 2 | 0;
		}
		var graphTopAmount = Math.floor(maxMaterials / dividers) * dividers + dividers;
		var barScaling = graphBarMaxHeight / graphTopAmount;
		var numbersOnAxis = (graphTopAmount / dividers | 0) + 1;
		var xx = graphMaxWidth - barWidth;
		var _g = 0;
		var _g1 = daysToDraw;
		while(_g < _g1) {
			var i = _g++;
			var barHeightprod = barScaling * thisMaterialProdStats[i];
			var barHeightcons = barScaling * thisMaterialConsStats[i];
			if(anyMaterialsUsed) {
				graphics.beginFill(16711680);
				graphics.drawRect(xx,graphTopSpacing + graphBarMaxHeight - barHeightcons,barWidth,barHeightcons);
				graphics.endFill();
				xx -= barWidth;
				graphics.beginFill(255);
				graphics.drawRect(xx,graphTopSpacing + graphBarMaxHeight - barHeightprod,barWidth,barHeightprod);
				graphics.endFill();
				xx -= barWidth + barSpacing;
			} else {
				xx -= barWidth;
				graphics.beginFill(255);
				graphics.drawRect(xx,graphTopSpacing + graphBarMaxHeight - barHeightprod,barWidth * 2,barHeightprod);
				graphics.endFill();
				xx -= barWidth + barSpacing;
			}
		}
		var guideXPos = xx + barWidth + barSpacing - 2;
		graphics.beginFill(0,1);
		graphics.drawRect(guideXPos - 1,0,1,graphBarMaxHeight + graphTopSpacing);
		graphics.drawRect(guideXPos - 1,graphBarMaxHeight + graphTopSpacing,graphMaxWidth - guideXPos + 3,1);
		var i = textContainer.children.length - 1;
		while(i >= 0) {
			textContainer.children[i].destroy();
			--i;
		}
		var textIntervals = Math.floor(graphTopAmount / (numbersOnAxis - 1));
		var _g = 0;
		var _g1 = numbersOnAxis;
		while(_g < _g1) {
			var i = _g++;
			var axisText = new graphics_BitmapText("" + common_MathExtensions.largeNumberFormatAlt(Math,textIntervals * i),{ font : "Arial10", tint : 0});
			axisText.get_anchor().set(1,0.5);
			var yPos = graphTopSpacing + graphBarMaxHeight - barScaling * textIntervals * i;
			axisText.position.set(guideXPos - 5,yPos);
			graphics.drawRect(guideXPos - 3,yPos,2,1);
			textContainer.addChild(axisText);
		}
		var xx = graphMaxWidth;
		var maxY = 0;
		var _g = 0;
		var _g1 = daysToDraw;
		while(_g < _g1) {
			var i = _g++;
			var text = "";
			switch(i) {
			case 0:
				text = common_Localize.lo("today");
				break;
			case 1:
				text = common_Localize.lo("yesterday");
				break;
			default:
				text = common_Localize.lo("n_days_ago",[i]);
			}
			var axisText = new graphics_BitmapText(text,{ font : "Arial10", tint : 0});
			axisText.get_anchor().set(0,0.5);
			axisText.rotation = Math.PI / 2;
			axisText.position.set(xx - barWidth,graphTopSpacing + graphBarMaxHeight + 4);
			textContainer.addChild(axisText);
			xx -= barWidth * 2 + barSpacing;
			var val2 = Math.ceil(axisText.position.y + axisText.get_textWidth());
			if(val2 > maxY) {
				maxY = val2;
			}
		}
		graphics.endFill();
		var yy = maxY + 5;
		var xx = 0;
		var drawLegendPart = function(source,color) {
			var legendText = new graphics_BitmapText(source,{ font : "Arial10", tint : 0});
			if(xx + 13 + Math.ceil(legendText.width) > graphMaxWidth) {
				xx = 0;
				yy += 13;
			}
			graphics.beginFill(color,1);
			graphics.drawRect(xx,yy,10,10);
			xx += 13;
			legendText.position.set(xx,yy);
			xx += Math.ceil(legendText.width) + 3;
			textContainer.addChild(legendText);
			graphics.endFill();
		};
		drawLegendPart(common_Localize.lo("production"),255);
		if(anyMaterialsUsed) {
			yy += 13;
			xx = 0;
			drawLegendPart(common_Localize.lo("usage"),16711680);
		}
		if(holder != null) {
			holder.updateSize();
		}
	};
	drawMaterialInfo();
	graphicsContainer.addChild(graphics);
	graphicsContainer.addChild(textContainer);
	holder = new gui_ContainerHolder($window,stage,graphicsContainer,{ left : 0, right : 0, top : 0, bottom : 3},drawMaterialInfo,function(mouse) {
		return false;
	});
	$window.addChild(holder);
	var bitmapText = new graphics_BitmapText("" + 0 + "-" + 10,{ font : "Arial10", tint : 0});
	var bitmapText = new graphics_BitmapText("" + 10 + "-" + 20,{ font : "Arial10", tint : 0});
	var bitmapText = new graphics_BitmapText("" + 20 + "-" + 30,{ font : "Arial10", tint : 0});
	var bitmapText = new graphics_BitmapText("" + 30 + "-" + 40,{ font : "Arial10", tint : 0});
	var bitmapText = new graphics_BitmapText("" + 40 + "-" + 50,{ font : "Arial10", tint : 0});
	var bitmapText = new graphics_BitmapText("" + 50 + "-" + 60,{ font : "Arial10", tint : 0});
	var bitmapText = new graphics_BitmapText("" + 60 + "-" + 70,{ font : "Arial10", tint : 0});
	$window.onDestroy = function() {
		graphics.destroy();
	};
	if(material == "food") {
		gui.windowInner.addChild(new gui_TextElement(gui.windowInner,gui.innerWindowStage,"",function() {
			var eating = city.simulation.eating;
			var shortageText = "";
			if(eating.foodShortage > 0.1) {
				shortageText = "\n" + common_Localize.lo("not_enough_food",[Math.ceil(eating.foodShortage)]);
			}
			return eating.getFoodText() + shortageText;
		},"Arial",null,graphMaxWidth - 10,true));
	}
	if(Config.hasPremium()) {
		gui.windowAddInfoText(null,function() {
			var ind = MaterialsHelper.findMaterialIndex(material);
			return common_Localize.lo("all_time_total_production") + " " + Math.floor(city.simulation.stats.materialProductionTotal[ind] + city.simulation.stats.materialProduction[ind][0]);
		});
	}
	gui.windowAddBottomButtons();
};
