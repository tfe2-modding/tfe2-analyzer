var gui_LanguageSelectWindow = $hxClasses["gui.LanguageSelectWindow"] = function() { };
gui_LanguageSelectWindow.__name__ = "gui.LanguageSelectWindow";
gui_LanguageSelectWindow.changeLanguage = function(city,langCode,gui) {
	Settings.language = langCode;
	Settings.save();
	common_Localize.loadLanguage(langCode,false,function() {
		common_Localize.translateFiles(city.progress.resources.buildingInfoArray);
		common_Localize.translateStory(city.progress.story.storyName,city.progress.story.storyInfo);
		gui.onLanguageChange();
	},function() {
	});
};
gui_LanguageSelectWindow.create = function(city,gui,stage,thisWindow) {
	var game = city.game;
	gui.windowAddTitleText(common_Localize.lo("language"));
	gui.windowAddInfoText("Full Translations:",null,"Arial15");
	var _g = 0;
	var _g1 = gui_LanguageSelectWindow.languages;
	while(_g < _g1.length) {
		var language = _g1[_g];
		++_g;
		var lang = [language];
		gui_UpgradeWindowParts.createActivatableButton(gui,Settings.language == lang[0].code,(function(lang) {
			return function() {
				gui_LanguageSelectWindow.changeLanguage(city,lang[0].code,gui);
			};
		})(lang),lang[0].name,"",gui.windowInner);
	}
	var _g = 0;
	var _g1 = Resources.customLanguagesInfo;
	while(_g < _g1.length) {
		var lang1 = [_g1[_g]];
		++_g;
		gui_UpgradeWindowParts.createActivatableButton(gui,Settings.language == lang1[0].code,(function(lang) {
			return function() {
				gui_LanguageSelectWindow.changeLanguage(city,lang[0].code,gui);
			};
		})(lang1),lang1[0].name,"",gui.windowInner);
	}
	thisWindow.addChild(new gui_GUISpacing(thisWindow,new common_Point(2,4)));
	gui.windowAddInfoText("(Partially) Machine Translated:",null,"Arial15");
	var _g = 0;
	var _g1 = gui_LanguageSelectWindow.languagesSecondary;
	while(_g < _g1.length) {
		var language = _g1[_g];
		++_g;
		var lang2 = [language];
		gui_UpgradeWindowParts.createActivatableButton(gui,Settings.language == lang2[0].code,(function(lang) {
			return function() {
				gui_LanguageSelectWindow.changeLanguage(city,lang[0].code,gui);
			};
		})(lang2),lang2[0].name,"",gui.windowInner);
	}
	thisWindow.addChild(new gui_GUISpacing(thisWindow,new common_Point(2,6)));
	gui.windowAddBottomButtons();
};
