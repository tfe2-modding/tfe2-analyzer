var gui_windowParts_FullSizeTextButton = $hxClasses["gui.windowParts.FullSizeTextButton"] = function() { };
gui_windowParts_FullSizeTextButton.__name__ = "gui.windowParts.FullSizeTextButton";
gui_windowParts_FullSizeTextButton.create = function(gui,onClick,parent,getText,stage,extraSpacingOnMobile) {
	if(extraSpacingOnMobile == null) {
		extraSpacingOnMobile = false;
	}
	var containerButton = new gui_ContainerButton(gui,stage,parent,onClick);
	var infoContainer = containerButton.container;
	parent.addChild(containerButton);
	infoContainer.padding.top = extraSpacingOnMobile && gui.game.isMobile ? 6 : 3;
	infoContainer.padding.left = 3;
	infoContainer.padding.right = 3;
	infoContainer.padding.bottom = extraSpacingOnMobile && gui.game.isMobile ? 3 : 0;
	infoContainer.fillSecondarySize = true;
	infoContainer.direction = gui_GUIContainerDirection.Vertical;
	var subContainer = new gui_GUIContainer(gui,stage,infoContainer);
	subContainer.alignment = gui_GUIContainerAlignment.Center;
	infoContainer.addChild(subContainer);
	subContainer.addChild(new gui_TextElement(subContainer,stage,null,function() {
		return getText();
	}));
	containerButton.buttonPatch.updateSprites(true);
	return containerButton;
};
