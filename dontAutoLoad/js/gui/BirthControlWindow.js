var gui_BirthControlWindow = $hxClasses["gui.BirthControlWindow"] = function() { };
gui_BirthControlWindow.__name__ = "gui.BirthControlWindow";
gui_BirthControlWindow.create = function(city,gui,stage,thisWindow) {
	gui.windowAddTitleText(common_Localize.lo("birth_control"));
	var currentType = city.simulation.babyMaker.mode;
	gui_UpgradeWindowParts.createActivatableButton(gui,currentType == 1,function() {
		city.simulation.babyMaker.mode = 1;
		city.simulation.babyMaker.targetPopAmount = city.simulation.citizens.length;
		gui.reloadWindow();
	},common_Localize.lo("greatly_discourage_children"),common_Localize.lo("pop_stabilize"));
	gui_UpgradeWindowParts.createActivatableButton(gui,currentType == 2,function() {
		city.simulation.babyMaker.mode = 2;
		gui.reloadWindow();
	},common_Localize.lo("encourage_contraception"),common_Localize.lo("slow_pop_growth"));
	gui_UpgradeWindowParts.createActivatableButton(gui,currentType == 0,function() {
		city.simulation.babyMaker.mode = 0;
		gui.reloadWindow();
	},common_Localize.lo("no_special_policy"),common_Localize.lo("babies_born_normal"));
	gui_UpgradeWindowParts.createActivatableButton(gui,currentType == 3,function() {
		city.simulation.babyMaker.mode = 3;
		gui.reloadWindow();
	},common_Localize.lo("encourage_parenthood"),common_Localize.lo("more_babies_born"));
	gui.windowAddBottomButtons();
};
