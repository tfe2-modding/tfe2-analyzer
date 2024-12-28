var gui_MainMenuGUI = $hxClasses["gui.MainMenuGUI"] = function(game,outerStage) {
	GUI.call(this,game,outerStage);
};
gui_MainMenuGUI.__name__ = "gui.MainMenuGUI";
gui_MainMenuGUI.createNewScenarioWindow = function(game,gui,windowOnDestroy) {
	gui.createWindow();
	var game1 = game;
	var gui1 = gui;
	var windowOnDestroy1 = windowOnDestroy;
	var tmp = function() {
		gui_MainMenuGUI.createNewScenarioWindow(game1,gui1,windowOnDestroy1);
	};
	gui.addWindowToStack(tmp);
	gui.windowAddTitleText(common_Localize.lo("start_scenario"));
	var stories = Resources.allStoriesInfo;
	var _g = 0;
	while(_g < stories.length) {
		var story = stories[_g];
		++_g;
		if(!story.freePlay && progress_StoryLoader.hasCompletedRequirements(game,story)) {
			gui_MainMenuGUI.addStoryToWindow(game,gui,story);
		}
	}
	if(progress_StoryLoader.shouldShowUnlockAllStoriesButton(game)) {
		var button = new gui_ContainerButton(gui,gui.innerWindowStage,gui.windowInner,function() {
			game.metaGame.unlockAll();
			var game1 = game;
			var gui1 = gui;
			var windowOnDestroy1 = windowOnDestroy;
			var button = function() {
				gui_MainMenuGUI.createNewScenarioWindow(game1,gui1,windowOnDestroy1);
			};
			gui.reloadWindow(button);
		});
		button.container.padding.top = 3;
		button.container.padding.left = 3;
		button.container.padding.right = 3;
		button.container.padding.bottom = 1;
		button.container.fillSecondarySize = true;
		button.container.addChild(new gui_TextElement(button.container,gui.innerWindowStage,common_Localize.lo("unlock_all")));
		gui.windowInner.addChild(button);
	}
	gui.windowInner.addChild(new gui_GUISpacing(gui.windowInner,new common_Point(4,6)));
	gui.windowAddInfoText(common_Localize.lo("free_play") + ":",null,"Arial");
	var _g = 0;
	while(_g < stories.length) {
		var story = stories[_g];
		++_g;
		if(story.freePlay && progress_StoryLoader.hasCompletedRequirements(game,story)) {
			gui_MainMenuGUI.addStoryToWindow(game,gui,story);
		}
	}
	gui.windowAddBottomButtons();
	gui.windowOnDestroy = windowOnDestroy;
};
gui_MainMenuGUI.createPlayedBeforeWindow = function(game,gui,windowOnDestroy) {
	gui.createWindow();
	gui.clearWindowStack();
	var game1 = game;
	var gui1 = gui;
	var windowOnDestroy1 = windowOnDestroy;
	var tmp = function() {
		gui_MainMenuGUI.createPlayedBeforeWindow(game1,gui1,windowOnDestroy1);
	};
	gui.addWindowToStack(tmp);
	gui.windowAddTitleText(common_Localize.lo("welcome_back"));
	var activableButton = gui_UpgradeWindowParts.createActivatableButton(gui,false,function() {
	},common_Localize.lo("import_city"),common_Localize.lo("got_export"),gui.windowInner);
	activableButton.button.onHover = function() {
		game.setOnClickTo = function() {
			var importButton = window.document.getElementById("importFile");
			importButton.value = "";
			importButton.click();
			game.onClick = null;
		};
	};
	gui_UpgradeWindowParts.createActivatableButton(gui,false,function() {
		gui_MainMenuGUI.createNewScenarioWindow(game,gui,windowOnDestroy);
	},common_Localize.lo("new_city"),common_Localize.lo("new_city_explain"),gui.windowInner);
	gui.windowAddBottomButtons();
	gui.windowOnDestroy = windowOnDestroy;
};
gui_MainMenuGUI.addStoryToWindow = function(game,gui,story) {
	var description = "";
	if(game.metaGame.hasWonScenario(story.link)) {
		var time = game.metaGame.getScenarioTime(story.link);
		description = common_Localize.lo("best_time",[time / 1440 | 0,(time / 60 | 0) % 24,time % 60]) + " " + "\n";
		if(story.link == "multipleWorlds") {
			common_Achievements.achieve("MULTIPLE_WORLDS_WIN");
		} else if(story.link == "rocketLaunch") {
			common_Achievements.achieve("ROCKETLAUNCH_WIN");
		}
	}
	description += story.description;
	gui_UpgradeWindowParts.createActivatableButton(gui,false,function() {
		var oldOnDestroy = gui.windowOnDestroy;
		gui.windowOnDestroy = null;
		game.createNewGameState(story.link);
	},StringTools.replace(StringTools.replace(story.name,"Free Play - ",""),common_Localize.lo("free_play") + " - ",""),description,gui.windowInner);
};
gui_MainMenuGUI.__super__ = GUI;
gui_MainMenuGUI.prototype = $extend(GUI.prototype,{
	createPlayWindow: function(windowOnDestroy) {
		gui_MainMenuGUI.createNewScenarioWindow(this.game,this,windowOnDestroy);
	}
	,doCreatePlayedBeforeWindow: function(windowOnDestroy) {
		gui_MainMenuGUI.createPlayedBeforeWindow(this.game,this,windowOnDestroy);
	}
	,__class__: gui_MainMenuGUI
});
