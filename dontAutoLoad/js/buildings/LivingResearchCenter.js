var buildings_LivingResearchCenter = $hxClasses["buildings.LivingResearchCenter"] = function(game,stage,bgStage,city,world,position,worldPosition,id) {
	this.totalKnowledgeGenerated = 0;
	buildings_WorkWithHome.call(this,game,stage,bgStage,city,world,position,worldPosition,id);
};
buildings_LivingResearchCenter.__name__ = "buildings.LivingResearchCenter";
buildings_LivingResearchCenter.__super__ = buildings_WorkWithHome;
buildings_LivingResearchCenter.prototype = $extend(buildings_WorkWithHome.prototype,{
	get_possibleCityUpgrades: function() {
		return [cityUpgrades_CozyLiving,cityUpgrades_WoodenLiving,cityUpgrades_SpaciousLiving,cityUpgrades_SlimyLiving,cityUpgrades_SecretiveLiving,cityUpgrades_MechanicalLiving,cityUpgrades_SuperSpaciousLiving];
	}
	,walkAround: function(citizen,stepsInBuilding) {
		var r = random_Random.getInt(3);
		if(citizen.relativeY < 5) {
			citizen.changeFloorAndWaitRandom(30,60);
		} else if(r == 1) {
			if(random_Random.getInt(2) == 0) {
				citizen.moveAndWait(random_Random.getInt(3,7),random_Random.getInt(30,60),null,false,false);
			} else {
				citizen.moveAndWait(random_Random.getInt(12,16),random_Random.getInt(30,60),null,false,false);
			}
		} else {
			var pool = pooling_Int32ArrayPool.pool;
			var arr = pool[2].length > 0 ? pool[2].splice(pool[2].length - 1,1)[0] : new Int32Array(2);
			arr[0] = 8;
			arr[1] = random_Random.getInt(90,120);
			citizen.setPath(arr,0,2,true);
			citizen.pathEndFunction = null;
			citizen.pathOnlyRelatedTo = citizen.inPermanent;
		}
	}
	,work: function(citizen,timeMod,shouldStopWorking) {
		if(shouldStopWorking) {
			citizen.currentAction = 2;
			return;
		}
		if(citizen.relativeY < 2) {
			if(random_Random.getInt(2) == 0) {
				var modifyWithHappiness = false;
				var slowMove = true;
				if(slowMove == null) {
					slowMove = false;
				}
				if(modifyWithHappiness == null) {
					modifyWithHappiness = false;
				}
				citizen.moveAndWait(random_Random.getInt(3,6),random_Random.getInt(60,120),null,modifyWithHappiness,slowMove);
			} else {
				var modifyWithHappiness = false;
				var slowMove = true;
				if(slowMove == null) {
					slowMove = false;
				}
				if(modifyWithHappiness == null) {
					modifyWithHappiness = false;
				}
				citizen.moveAndWait(random_Random.getInt(13,14),random_Random.getInt(60,120),null,modifyWithHappiness,slowMove);
			}
		} else if(random_Random.getInt(2) == 0) {
			var modifyWithHappiness = false;
			var slowMove = true;
			if(slowMove == null) {
				slowMove = false;
			}
			if(modifyWithHappiness == null) {
				modifyWithHappiness = false;
			}
			citizen.moveAndWait(random_Random.getInt(3,15),random_Random.getInt(60,120),null,modifyWithHappiness,slowMove);
		}
		var newKnowledge = 0.10799999999999998 * citizen.get_educationSpeedModifier() * this.city.simulation.boostManager.currentGlobalBoostAmount;
		this.city.materials.knowledge += newKnowledge;
		this.city.simulation.stats.materialProduction[10][0] += newKnowledge;
		this.totalKnowledgeGenerated += newKnowledge;
	}
	,addWindowInfoLines: function() {
		var _gthis = this;
		buildings_WorkWithHome.prototype.addWindowInfoLines.call(this);
		this.city.gui.windowAddInfoText(null,function() {
			return common_Localize.lo("knowledge_gathered",[_gthis.totalKnowledgeGenerated | 0]);
		});
	}
	,createMainWindowPart: function() {
		var _gthis = this;
		buildings_WorkWithHome.prototype.createMainWindowPart.call(this);
		var createUpgradeAllHousesWindow = null;
		createUpgradeAllHousesWindow = function() {
			_gthis.city.gui.createWindow(_gthis);
			gui_ReplaceAllHousesWindow.create(_gthis.city,_gthis.city.gui,_gthis.city.gui.innerWindowStage,_gthis.city.gui.windowInner);
			_gthis.city.gui.addWindowToStack(createUpgradeAllHousesWindow);
		};
		var tb = new gui_ContainerButton(this.city.gui,this.city.gui.innerWindowStage,this.city.gui.windowInner,createUpgradeAllHousesWindow);
		var extraSpacing = this.city.game.isMobile ? 3 : 0;
		tb.container.padding.top = 3 + extraSpacing;
		tb.container.padding.left = 3;
		tb.container.padding.right = 3;
		tb.container.padding.bottom = extraSpacing;
		tb.container.fillSecondarySize = true;
		tb.container.addChild(new gui_TextElement(tb,this.city.gui.innerWindowStage,common_Localize.lo("upgrade_basic_houses")));
		this.city.gui.windowInner.addChild(tb);
		this.city.gui.windowInner.addChild(new gui_GUISpacing(this.city.gui.windowInner,new common_Point(2,6)));
		var createUpgradeCustomHousesWindow = null;
		createUpgradeCustomHousesWindow = function() {
			_gthis.city.gui.createWindow(_gthis);
			gui_UpgradeCustomHousesWindow.create(_gthis.city,_gthis.city.gui,_gthis.city.gui.innerWindowStage,_gthis.city.gui.windowInner);
			_gthis.city.gui.addWindowToStack(createUpgradeCustomHousesWindow);
		};
		var tb = new gui_ContainerButton(this.city.gui,this.city.gui.innerWindowStage,this.city.gui.windowInner,createUpgradeCustomHousesWindow);
		var extraSpacing = this.city.game.isMobile ? 3 : 0;
		tb.container.padding.top = 3 + extraSpacing;
		tb.container.padding.left = 3;
		tb.container.padding.right = 3;
		tb.container.padding.bottom = extraSpacing;
		tb.container.fillSecondarySize = true;
		tb.container.addChild(new gui_TextElement(tb,this.city.gui.innerWindowStage,common_Localize.lo("upgrade_custom_houses")));
		this.city.gui.windowInner.addChild(tb);
		this.city.gui.windowInner.addChild(new gui_GUISpacing(this.city.gui.windowInner,new common_Point(2,6)));
	}
	,save: function(queue,shouldSaveDefinition) {
		if(shouldSaveDefinition == null) {
			shouldSaveDefinition = true;
		}
		buildings_WorkWithHome.prototype.save.call(this,queue);
		if(shouldSaveDefinition) {
			queue.addString(buildings_LivingResearchCenter.saveDefinition);
		}
		var value = this.totalKnowledgeGenerated;
		if(queue.size + 8 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 8) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setDouble(queue.size,value);
		queue.size += 8;
	}
	,load: function(queue,definition) {
		buildings_WorkWithHome.prototype.load.call(this,queue);
		if(definition == null) {
			definition = queue.readString();
		}
		var loadMap = gamesave_GameSaveHelper.makeLoadMap(definition,queue);
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"totalKnowledgeGenerated")) {
			this.totalKnowledgeGenerated = loadMap.h["totalKnowledgeGenerated"];
		}
	}
	,__class__: buildings_LivingResearchCenter
});
