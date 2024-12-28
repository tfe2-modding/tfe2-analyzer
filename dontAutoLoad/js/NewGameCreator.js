var NewGameCreator = $hxClasses["NewGameCreator"] = function(game,stage,newFile) {
	this.game = game;
	this.stage = stage;
	var cityStage = new PIXI.Container();
	stage.addChild(cityStage);
	this.bgCity = new City(game,cityStage,newFile,true,"___");
	this.guiStage = new PIXI.Container();
	stage.addChild(this.guiStage);
	this.gui = new GUI(game,this.guiStage);
	this.resize();
	this.startUI(newFile);
	this.resize();
};
NewGameCreator.__name__ = "NewGameCreator";
NewGameCreator.__interfaces__ = [GameState];
NewGameCreator.prototype = {
	get_publicGUI: function() {
		return this.gui;
	}
	,startUI: function(newFile) {
		var isFreePlay = Lambda.find(Resources.allStoriesInfo,function(st) {
			return st.link == newFile;
		}).freePlay;
		if(isFreePlay != null && isFreePlay) {
			var _g = $bind(this,this.createSaveWindow);
			var storyName = newFile;
			var restoreStateOnCancel = false;
			var tmp = function() {
				_g(storyName,restoreStateOnCancel);
			};
			gui_FreePlayConfigureWindow.createWindow(this.bgCity,this.gui,tmp,($_=this.game,$bind($_,$_.restoreState)));
		} else {
			this.createSaveWindow(newFile);
		}
	}
	,createSaveWindow: function(storyName,restoreStateOnCancel) {
		if(restoreStateOnCancel == null) {
			restoreStateOnCancel = true;
		}
		var _gthis = this;
		this.gui.windowOnDestroy = null;
		gui_SaveLoadWindows.createSaveWindow(this.game,this.gui,common_Localize.lo("save_slot_choice"),function(fileName) {
			_gthis.game.destroyTempSaveState();
			_gthis.bgCity.disableDisplayOnlyMode(fileName);
			_gthis.bgCity.progress.unlocks.postInitialCreate();
			Config.doPlay();
			Analytics.sendEvent("game","newGame",null,storyName);
			Analytics.sendEventFirebase("newGame","scenario",storyName);
			_gthis.game.switchState(_gthis.bgCity);
			Config.onCitySwitch(true);
			_gthis.guiStage.destroy();
			common_Storage.setItem("__meta_mostRecentSubOf_" + fileName,fileName,function() {
			});
		},function() {
			if(restoreStateOnCancel) {
				_gthis.game.restoreState();
			}
		});
	}
	,handleMouse: function(mouse) {
		if(this.gui.handleMouse(mouse)) {
			return true;
		}
		return false;
	}
	,update: function(timeMod) {
		this.bgCity.update(timeMod);
		this.gui.update(timeMod);
	}
	,postDraw: function() {
		this.bgCity.postDraw();
	}
	,resize: function() {
		this.bgCity.resize();
		this.gui.resize();
	}
	,refocus: function() {
		this.bgCity.refocus();
	}
	,stop: function() {
		this.bgCity.stop();
	}
	,pause: function() {
	}
	,resume: function() {
	}
	,onContextRestored: function() {
		this.bgCity.onContextRestored();
	}
	,__class__: NewGameCreator
};
