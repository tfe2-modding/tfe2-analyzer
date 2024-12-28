var gui_windowParts_CycleValueButton = $hxClasses["gui.windowParts.CycleValueButton"] = function() { };
gui_windowParts_CycleValueButton.__name__ = "gui.windowParts.CycleValueButton";
gui_windowParts_CycleValueButton.create = function(gui,getValue,setValue,maxValue,text,textGetter,increment) {
	if(increment == null) {
		increment = 1;
	}
	if(text == null) {
		text = "";
	}
	if(textGetter == null) {
		textGetter = function() {
			return text;
		};
	}
	var button = gui_windowParts_FullSizeTextButton.create(gui,function() {
		var curr = getValue();
		curr += increment;
		if(curr >= maxValue()) {
			setValue(curr % increment);
		} else {
			setValue(curr);
		}
	},gui.windowInner,textGetter,gui.innerWindowStage);
	gui.windowInner.addChild(new gui_GUISpacing(gui.windowInner,new common_Point(2,4)));
	return button;
};
