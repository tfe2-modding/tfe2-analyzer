var gui_SaveLoadWindows = $hxClasses["gui.SaveLoadWindows"] = function() { };
gui_SaveLoadWindows.__name__ = "gui.SaveLoadWindows";
gui_SaveLoadWindows.createSaveWindow = function(game,gui,text,windowOnDone,windowOnDestroy) {
	gui.createWindow();
	gui.windowRelatedTo = "saveLoad";
	var game1 = game;
	var gui1 = gui;
	var text1 = text;
	var windowOnDone1 = windowOnDone;
	var windowOnDestroy1 = windowOnDestroy;
	var tmp = function() {
		gui_SaveLoadWindows.createSaveWindow(game1,gui1,text1,windowOnDone1,windowOnDestroy1);
	};
	gui.addWindowToStack(tmp);
	gui.windowAddTitleText(common_Localize.lo("choose_save_slot"));
	gui.windowAddInfoText(text);
	gui.windowAddBottomButtons();
	gui_SaveLoadWindows.addSaveSlotButtons(game,gui,function(res) {
		gui.windowOnDestroy = null;
		gui.closeWindow();
		windowOnDone(res);
	},false,true);
	gui.windowOnDestroy = windowOnDestroy;
};
gui_SaveLoadWindows.createDeleteWindow = function(game,gui,text,windowOnDone,windowOnDestroy) {
	gui.createWindow();
	gui.windowRelatedTo = "saveLoadDEL";
	var game1 = game;
	var gui1 = gui;
	var text1 = text;
	var windowOnDone1 = windowOnDone;
	var windowOnDestroy1 = windowOnDestroy;
	var tmp = function() {
		gui_SaveLoadWindows.createDeleteWindow(game1,gui1,text1,windowOnDone1,windowOnDestroy1);
	};
	gui.addWindowToStack(tmp,true);
	var game2 = game;
	var gui2 = gui;
	var text2 = text;
	var windowOnDone2 = windowOnDone;
	var windowOnDestroy2 = windowOnDestroy;
	var tmp = function() {
		gui_SaveLoadWindows.createDeleteWindow(game2,gui2,text2,windowOnDone2,windowOnDestroy2);
	};
	gui.setWindowReload(tmp);
	gui.windowAddTitleText(common_Localize.lo("delete_save"));
	gui.windowAddInfoText(text);
	gui.windowAddBottomButtons();
	gui_SaveLoadWindows.addSaveSlotButtons(game,gui,function(res) {
		var canDelete = true;
		if(((game.state) instanceof City)) {
			var cityState = game.state;
			canDelete = cityState.cityMainFile != res;
		}
		if(canDelete) {
			common_Storage.getItem("__meta__mostRecentlyPlayed",function(err,result) {
				var continueDeletionProcess = function() {
					common_Storage.setItem(res + "__meta","SPEC_DELETED",function() {
						common_Storage.setItem(res,"",function() {
							common_Storage.setItem("__meta_mostRecentSubOf_" + res,"",function() {
								gui.reloadWindow();
							});
						});
					});
				};
				if(StringTools.startsWith(result,res)) {
					if(((game.state) instanceof MainMenu)) {
						var mainMenuState = game.state;
						mainMenuState.deletedCurSave = true;
					}
					common_Storage.setItem("__meta__mostRecentlyPlayed","DELETED_SAVE",continueDeletionProcess);
				} else {
					continueDeletionProcess();
				}
			});
		} else {
			var createThisWindow = null;
			createThisWindow = function() {
				gui.showSimpleWindow(common_Localize.lo("cant_delete_curr"),null,true);
				gui.addWindowToStack(createThisWindow,true);
				gui.setWindowReload(createThisWindow);
			};
			createThisWindow();
		}
	},true,true,true);
	gui.windowOnDestroy = windowOnDestroy;
};
gui_SaveLoadWindows.createLoadWindow = function(game,gui,text,windowOnDone,windowOnDestroy) {
	gui.createWindow();
	gui.windowRelatedTo = "saveLoad";
	var game1 = game;
	var gui1 = gui;
	var text1 = text;
	var windowOnDone1 = windowOnDone;
	var windowOnDestroy1 = windowOnDestroy;
	var tmp = function() {
		gui_SaveLoadWindows.createLoadWindow(game1,gui1,text1,windowOnDone1,windowOnDestroy1);
	};
	gui.addWindowToStack(tmp);
	gui.windowAddTitleText(common_Localize.lo("load_a_game"));
	gui.windowAddInfoText(text);
	gui.windowAddBottomButtons([{ text : common_Localize.lo("import_command"), action : function() {
	}, onHover : function() {
		game.setOnClickTo = function() {
			var importButton = window.document.getElementById("importFile");
			importButton.value = "";
			importButton.click();
			game.onClick = null;
		};
	}},{ text : common_Localize.lo("delete_save"), action : function() {
		gui_SaveLoadWindows.createDeleteWindow(game,gui,"",function(sve) {
		});
	}}]);
	gui_SaveLoadWindows.addSaveSlotButtons(game,gui,function(res) {
		gui.windowOnDestroy = null;
		gui.closeWindow();
		windowOnDone(res);
	},true,false);
	gui.windowOnDestroy = windowOnDestroy;
};
gui_SaveLoadWindows.addSaveSlotButtons = function(game,gui,onDone,makeInactiveIfEmpty,showOverwrite,showOverwiteAsDelete) {
	if(showOverwiteAsDelete == null) {
		showOverwiteAsDelete = false;
	}
	gui_SaveLoadWindows.createSaveSlotButton(game,gui,0,onDone,makeInactiveIfEmpty,showOverwrite,false,showOverwiteAsDelete);
	gui_SaveLoadWindows.createSaveSlotButton(game,gui,1,onDone,makeInactiveIfEmpty,showOverwrite,false,showOverwiteAsDelete);
	gui_SaveLoadWindows.createSaveSlotButton(game,gui,2,onDone,makeInactiveIfEmpty,showOverwrite,false,showOverwiteAsDelete);
	gui_SaveLoadWindows.createSaveSlotButton(game,gui,3,onDone,makeInactiveIfEmpty,showOverwrite,false,showOverwiteAsDelete);
	gui_SaveLoadWindows.createSaveSlotButton(game,gui,4,onDone,makeInactiveIfEmpty,showOverwrite,false,showOverwiteAsDelete);
	gui_SaveLoadWindows.createSaveSlotButton(game,gui,5,onDone,makeInactiveIfEmpty,showOverwrite,false,showOverwiteAsDelete);
	gui_SaveLoadWindows.createSaveSlotButton(game,gui,6,onDone,makeInactiveIfEmpty,showOverwrite,false,showOverwiteAsDelete);
	gui_SaveLoadWindows.createSaveSlotButton(game,gui,7,onDone,makeInactiveIfEmpty,showOverwrite,false,showOverwiteAsDelete);
	gui_SaveLoadWindows.createSaveSlotButton(game,gui,8,onDone,makeInactiveIfEmpty,showOverwrite,false,showOverwiteAsDelete);
	gui_SaveLoadWindows.createSaveSlotButton(game,gui,9,onDone,makeInactiveIfEmpty,showOverwrite,true,showOverwiteAsDelete);
};
gui_SaveLoadWindows.createSaveSlotButton = function(game,gui,slot,onChoose,makeInactiveIfEmpty,showOverwrite,recurseIfFull,showOverwriteAsDelete) {
	if(gui.windowRelatedTo != "saveLoad" && gui.windowRelatedTo != "saveLoadDEL") {
		return;
	}
	var parentContainer = new gui_GUIContainer(gui,gui.innerWindowStage,gui.windowInner);
	parentContainer.fillSecondarySize = true;
	parentContainer.direction = gui_GUIContainerDirection.Vertical;
	common_Storage.getItem("" + slot + "__meta",function(err,slotBottomText) {
		if(gui.windowRelatedTo != "saveLoad" && gui.windowRelatedTo != "saveLoadDEL") {
			return;
		}
		var makeInactive = false;
		var extraText = "";
		var needsOverwrite = false;
		var shouldRecurse = false;
		if(err != null || slotBottomText == null || slotBottomText == "SPEC_DELETED") {
			if(slotBottomText == "SPEC_DELETED") {
				shouldRecurse = true;
			}
			slotBottomText = common_Localize.lo("empty");
			makeInactive = makeInactiveIfEmpty;
		} else {
			if(showOverwrite) {
				extraText = " " + common_Localize.lo("overwrite");
				needsOverwrite = true;
			}
			shouldRecurse = true;
		}
		var overwriteIsOn = false;
		var ab = null;
		ab = gui_UpgradeWindowParts.createActivatableButton(gui,makeInactive,function() {
			if(needsOverwrite && !overwriteIsOn) {
				overwriteIsOn = true;
				var ab1 = ab.titleText;
				var ab2 = showOverwriteAsDelete ? common_Localize.lo("really_delete",[slot + 1]) : common_Localize.lo("really_overwrite",[slot + 1]);
				ab1.setText(ab2);
			} else {
				onChoose("" + slot);
			}
		},common_Localize.lo("slot_n",[slot + 1]) + extraText,slotBottomText,parentContainer,"spr_9p_button_disabled",null,gui_SaveLoadWindows.isWeirdText(slotBottomText));
		if(recurseIfFull && slot < 199 && shouldRecurse) {
			gui_SaveLoadWindows.createSaveSlotButton(game,gui,slot + 1,onChoose,makeInactiveIfEmpty,showOverwrite,true,showOverwriteAsDelete);
		}
	});
	parentContainer.padding.bottom = 2;
	gui.windowInner.insertChild(parentContainer,gui.windowInner.children.length - 1);
};
gui_SaveLoadWindows.isWeirdText = function(str) {
	var r = new EReg("[^a-zA-Z\\-: 0-9<>\\[\\]{}~`=|\\\\@!#$%^&*\\(\\)_?]+","g");
	return r.match(str);
};
