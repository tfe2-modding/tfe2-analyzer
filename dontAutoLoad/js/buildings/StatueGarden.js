var buildings_StatueGarden = $hxClasses["buildings.StatueGarden"] = function(game,stage,bgStage,city,world,position,worldPosition,id) {
	this.mirrored = false;
	buildings_Park.call(this,game,stage,bgStage,city,world,position,worldPosition,id);
};
buildings_StatueGarden.__name__ = "buildings.StatueGarden";
buildings_StatueGarden.__super__ = buildings_Park;
buildings_StatueGarden.prototype = $extend(buildings_Park.prototype,{
	get_myParkTextures: function() {
		return "spr_statuegarden_statues";
	}
	,get_changePlantsText: function() {
		return common_Localize.lo("change_sculptures");
	}
	,get_entertainmentType: function() {
		return 3;
	}
	,get_baseEntertainmentCapacity: function() {
		return 40;
	}
	,get_numberOfLockedParkTextures: function() {
		return 0;
	}
	,postLoad: function() {
		buildings_Park.prototype.postLoad.call(this);
		if(this.mirrored) {
			this.mirrorSprite();
		}
	}
	,mirrorSprite: function() {
		if(this.mirrored) {
			this.parkSprite.anchor.set(1,0);
			this.parkSprite.scale.set(-1,1);
			this.bgStage.isInvalid = true;
		} else {
			this.parkSprite.anchor.set(0,0);
			this.parkSprite.scale.set(1,1);
			this.bgStage.isInvalid = true;
		}
	}
	,createWindowAddBottomButtons: function() {
		var _gthis = this;
		gui_windowParts_FullSizeTextButton.create(this.city.gui,function() {
			_gthis.mirrored = !_gthis.mirrored;
			_gthis.mirrorSprite();
		},this.city.gui.windowInner,function() {
			return common_Localize.lo("mirror");
		},this.city.gui.innerWindowStage);
		this.city.gui.windowInner.addChild(new gui_GUISpacing(this.city.gui.windowInner,new common_Point(2,4)));
		buildings_Park.prototype.createWindowAddBottomButtons.call(this);
	}
	,addWindowInfoLines: function() {
		var _gthis = this;
		buildings_Park.prototype.addWindowInfoLines.call(this);
		var devMessageShown = false;
		var devMessageContainerOuter = new gui_GUIContainer(this.city.gui,this.city.gui.innerWindowStage,this.city.gui.windowInner);
		var devMessageContainer = null;
		this.city.gui.windowInner.addChild(devMessageContainerOuter);
		this.city.gui.windowInner.onUpdate = function() {
			if(_gthis.currentTexture == 0) {
				if(!devMessageShown) {
					devMessageShown = true;
					devMessageContainer = new gui_GUIContainer(_gthis.city.gui,_gthis.city.gui.innerWindowStage,devMessageContainerOuter);
					devMessageContainer.direction = gui_GUIContainerDirection.Vertical;
					devMessageContainer.addChild(new gui_GUISpacing(devMessageContainer,new common_Point(2,6)));
					devMessageContainer.addChild(new gui_TextElement(devMessageContainer,_gthis.city.gui.innerWindowStage,common_Localize.lo("dev_message"),null,"Arial15"));
					devMessageContainer.addChild(new gui_TextElement(devMessageContainer,_gthis.city.gui.innerWindowStage,common_Localize.lo("climate_crisis_message_1")));
					var createClimateCrisisExplainerWindow = null;
					createClimateCrisisExplainerWindow = function() {
						_gthis.city.gui.createWindow("climateCrisisWindow",Resources.getTexture("spr_9p_window_moreopaque"));
						_gthis.city.gui.addWindowToStack(createClimateCrisisExplainerWindow);
						gui_ClimateCrisisExplainerWindow.create(_gthis.city,_gthis.city.gui,_gthis.city.gui.innerWindowStage,_gthis.city.gui.windowInner);
					};
					devMessageContainer.addChild(new gui_TextButton(_gthis.city.gui,_gthis.city.gui.innerWindowStage,devMessageContainer,createClimateCrisisExplainerWindow,common_Localize.lo("see_what_you_can_do")));
					devMessageContainer.addChild(new gui_GUISpacing(devMessageContainer,new common_Point(2,6)));
					devMessageContainerOuter.addChild(devMessageContainer);
					_gthis.city.gui.setWindowPositioning(gui_WindowPosition.CenterOffset(devMessageContainer.rect.height / 2 | 0));
				}
			} else if(devMessageShown) {
				devMessageShown = false;
				devMessageContainerOuter.removeChild(devMessageContainer);
				_gthis.city.gui.setWindowPositioning(gui_WindowPosition.Center);
			}
		};
	}
	,save: function(queue,shouldSaveDefinition) {
		if(shouldSaveDefinition == null) {
			shouldSaveDefinition = true;
		}
		buildings_Park.prototype.save.call(this,queue);
		if(shouldSaveDefinition) {
			queue.addString(buildings_StatueGarden.saveDefinition);
		}
		var value = this.mirrored;
		if(queue.size + 1 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 1) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.b[queue.size] = value ? 1 : 0;
		queue.size += 1;
	}
	,load: function(queue,definition) {
		buildings_Park.prototype.load.call(this,queue);
		if(definition == null) {
			definition = queue.readString();
		}
		var loadMap = gamesave_GameSaveHelper.makeLoadMap(definition,queue);
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"mirrored")) {
			this.mirrored = loadMap.h["mirrored"];
		}
		this.postLoad();
	}
	,__class__: buildings_StatueGarden
});
