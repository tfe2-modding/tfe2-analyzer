var gui_ClimateCrisisExplainerWindow = $hxClasses["gui.ClimateCrisisExplainerWindow"] = function() { };
gui_ClimateCrisisExplainerWindow.__name__ = "gui.ClimateCrisisExplainerWindow";
gui_ClimateCrisisExplainerWindow.create = function(city,gui,stage,thisWindow) {
	city.gui.windowAddTitleText(common_Localize.lo("climate_crisis_explainer_1"));
	thisWindow.addChild(new gui_TextElement(thisWindow,stage,common_Localize.lo("climate_crisis_explainer_2"),null,"Arial"));
	thisWindow.addChild(new gui_GUISpacing(thisWindow,new common_Point(2,6)));
	thisWindow.addChild(new gui_TextElement(thisWindow,stage,common_Localize.lo("climate_crisis_explainer_3"),null,"Arial15"));
	thisWindow.addChild(new gui_TextElement(thisWindow,stage,common_Localize.lo("climate_crisis_explainer_4"),null,"Arial"));
	thisWindow.addChild(new gui_GUISpacing(thisWindow,new common_Point(2,6)));
	thisWindow.addChild(new gui_TextElement(thisWindow,stage,common_Localize.lo("climate_crisis_explainer_5"),null,"Arial15"));
	thisWindow.addChild(new gui_TextElement(thisWindow,stage,common_Localize.lo("climate_crisis_explainer_6"),null,"Arial"));
	thisWindow.addChild(new gui_GUISpacing(thisWindow,new common_Point(2,6)));
	thisWindow.addChild(new gui_TextElement(thisWindow,stage,common_Localize.lo("climate_crisis_explainer_7"),null,"Arial15"));
	thisWindow.addChild(new gui_TextElement(thisWindow,stage,common_Localize.lo("climate_crisis_explainer_8"),null,"Arial"));
	thisWindow.addChild(new gui_GUISpacing(thisWindow,new common_Point(2,6)));
	thisWindow.addChild(new gui_TextElement(thisWindow,stage,common_Localize.lo("climate_crisis_explainer_9"),null,"Arial15"));
	thisWindow.addChild(new gui_TextElement(thisWindow,stage,common_Localize.lo("climate_crisis_explainer_10"),null,"Arial"));
	thisWindow.addChild(new gui_GUISpacing(thisWindow,new common_Point(2,6)));
	thisWindow.addChild(new gui_TextElement(thisWindow,stage,common_Localize.lo("thanks_signoff"),null,"Arial"));
	thisWindow.addChild(new gui_GUISpacing(thisWindow,new common_Point(2,6)));
	thisWindow.addChild(new gui_TextElement(thisWindow,stage,"Florian van Strien",null,"Arial"));
	thisWindow.addChild(new gui_GUISpacing(thisWindow,new common_Point(2,10)));
	gui.windowAddBottomButtons([{ text : common_Localize.lo("read_more_link"), onHover : function() {
		city.game.setOnClickTo = function() {
			window.open("https://www.climaterealityproject.org/climate-101","_blank");
		};
	}, action : function() {
	}}]);
};
