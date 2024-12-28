var gui_ColorPickerWindow = $hxClasses["gui.ColorPickerWindow"] = function() { };
gui_ColorPickerWindow.__name__ = "gui.ColorPickerWindow";
gui_ColorPickerWindow.createWindow = function(city,onConfirm,limitedColors) {
	if(limitedColors == null) {
		limitedColors = false;
	}
	city.gui.createWindow("colorPicker",null,28);
	var city1 = city;
	var onConfirm1 = onConfirm;
	var tmp = function() {
		gui_ColorPickerWindow.createWindow(city1,onConfirm1);
	};
	city.gui.addWindowToStack(tmp);
	var windowTitle = common_Localize.lo("choose_color");
	city.gui.windowAddTitleText(windowTitle,null,Resources.getTexture("spr_colorpicker_colorpicked"));
	var cp = new gui_ColorPicker(city.gui.windowInner,city.gui.innerWindowStage,function(c) {
		city.gui.windowIconSprite.tint = c;
	},limitedColors);
	city.gui.windowIconSprite.tint = gui_ColorPicker.colorPicked;
	city.gui.windowInner.addChild(cp);
	city.gui.windowInner.addChild(new gui_GUISpacing(city.gui.windowInner,new common_Point(2,4)));
	city.gui.windowAddBottomButtons([{ text : common_Localize.lo("confirm"), action : function() {
		onConfirm(gui_ColorPicker.colorPicked);
		city.gui.goPreviousWindow();
	}},{ text : common_Localize.lo("color_code"), action : function() {
		var inp = window.prompt(common_Localize.lo("color_code_enter"));
		if(inp != null) {
			var col = common_ColorExtensions.parse(inp);
			if(col == null) {
				window.alert(common_Localize.lo("color_not_parsed"));
			} else {
				onConfirm(common_ColorExtensions.toHexInt(thx_color_Rgbxa.toRgb(col)));
				city.gui.goPreviousWindow();
			}
		}
	}},{ text : common_Localize.lo("pick_color"), action : function() {
		city.activateSpecialCityAction(new cityActions_CityPickColor(city,onConfirm));
	}}],"");
};
