var gui_ActivableButton = $hxClasses["gui.ActivableButton"] = function() { };
gui_ActivableButton.__name__ = "gui.ActivableButton";
gui_ActivableButton.create = function(gui,stage,parent,onClick,isActive,text) {
	var button1 = new gui_ContainerButton(gui,stage,parent,onClick,isActive,null,"spr_button_activable");
	var extraSpacing = gui.game.isMobile ? 3 : 0;
	button1.container.padding.top = 3 + extraSpacing;
	button1.container.padding.left = 3;
	button1.container.padding.right = 3;
	button1.container.padding.bottom = extraSpacing;
	if(text != null) {
		button1.container.addChild(new gui_TextElement(button1.container,gui.innerWindowStage,text));
	}
	button1.container.fillSecondarySize = true;
	return button1;
};
