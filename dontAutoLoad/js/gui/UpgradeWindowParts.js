var gui_UpgradeWindowParts = $hxClasses["gui.UpgradeWindowParts"] = function() { };
gui_UpgradeWindowParts.__name__ = "gui.UpgradeWindowParts";
gui_UpgradeWindowParts.createActivatableButton = function(gui,isActive,onClick,name,description,addToContainer,activeTexture,buttonSound,useAlternativeTextElement) {
	if(useAlternativeTextElement == null) {
		useAlternativeTextElement = false;
	}
	if(activeTexture == null) {
		activeTexture = "spr_9p_button_active";
	}
	var infoContainer;
	if(addToContainer == null) {
		addToContainer = gui.windowInner;
	}
	var createdButton = null;
	if(!isActive) {
		var containerButton = new gui_ContainerButton(gui,gui.innerWindowStage,addToContainer,onClick);
		infoContainer = containerButton.container;
		addToContainer.addChild(containerButton);
		if(buttonSound != null) {
			containerButton.buttonSound = buttonSound;
		}
		createdButton = containerButton;
	} else {
		infoContainer = new gui_GUIContainer(gui,gui.innerWindowStage,addToContainer,null,null,null,new gui_NinePatch(Resources.getTexture(activeTexture),1,3,3));
		addToContainer.addChild(infoContainer);
	}
	infoContainer.padding.top = 3;
	infoContainer.padding.left = 3;
	infoContainer.padding.right = 3;
	infoContainer.padding.bottom = 1;
	infoContainer.fillSecondarySize = true;
	infoContainer.direction = gui_GUIContainerDirection.Vertical;
	var nameElement = infoContainer.addChild(new gui_TextElement(infoContainer,gui.innerWindowStage,name));
	var descriptionElement = null;
	if(description != "") {
		if(useAlternativeTextElement) {
			descriptionElement = infoContainer.addChild(new gui_TextElementAlt(infoContainer,gui.innerWindowStage,description,null,"Arial",null,250,null,10));
		} else {
			descriptionElement = infoContainer.addChild(new gui_TextElement(infoContainer,gui.innerWindowStage,description,null,"Arial10"));
		}
	}
	addToContainer.addChild(new gui_GUISpacing(addToContainer,new common_Point(2,2)));
	return { container : infoContainer, titleText : nameElement, description : descriptionElement, button : createdButton};
};
gui_UpgradeWindowParts.createCheckboxButton = function(gui,isChecked,onClick,name,description,addToContainer,activeTexture,buttonSound) {
	if(activeTexture == null) {
		activeTexture = "spr_9p_button_active";
	}
	if(addToContainer == null) {
		addToContainer = gui.windowInner;
	}
	var createdButton = null;
	var containerButton = new gui_CheckboxButton(gui,gui.innerWindowStage,addToContainer,onClick,isChecked);
	var infoContainer = containerButton.container;
	addToContainer.addChild(containerButton);
	if(buttonSound != null) {
		containerButton.buttonSound = buttonSound;
	}
	createdButton = containerButton;
	infoContainer.padding.top = 3;
	infoContainer.padding.left = 3;
	infoContainer.padding.right = 3;
	infoContainer.padding.bottom = 1;
	infoContainer.fillSecondarySize = true;
	infoContainer.direction = gui_GUIContainerDirection.Vertical;
	var checkboxAndNameElement = new gui_GUIContainer(gui,gui.innerWindowStage,infoContainer);
	checkboxAndNameElement.direction = gui_GUIContainerDirection.Horizontal;
	var checkboxTextures = Resources.getTextures("spr_checkbox",2);
	var spr = new PIXI.Sprite(checkboxTextures[1]);
	var spriteContainerHolder = new gui_ContainerHolder(checkboxAndNameElement,gui.innerWindowStage,spr,{ left : 0, right : 3, top : 0, bottom : 0},function() {
		var checkboxTextures1 = checkboxTextures;
		var spriteContainerHolder = isChecked() ? 0 : 1;
		spr.texture = checkboxTextures1[spriteContainerHolder];
	});
	checkboxAndNameElement.addChild(spriteContainerHolder);
	var nameElement = new gui_TextElement(checkboxAndNameElement,gui.innerWindowStage,name);
	checkboxAndNameElement.addChild(nameElement);
	infoContainer.addChild(checkboxAndNameElement);
	var descriptionElement = infoContainer.addChild(new gui_TextElement(infoContainer,gui.innerWindowStage,description,null,"Arial10"));
	addToContainer.addChild(new gui_GUISpacing(addToContainer,new common_Point(2,2)));
	return { container : infoContainer, titleText : nameElement, description : descriptionElement, button : createdButton};
};
gui_UpgradeWindowParts.createHeader = function(gui,name,parent) {
	if(parent == null) {
		parent = gui.windowInner;
	}
	var upgradesTitleContainer = new gui_GUIContainer(gui,gui.innerWindowStage,parent);
	upgradesTitleContainer.fillSecondarySize = true;
	upgradesTitleContainer.addChild(new gui_TextElement(upgradesTitleContainer,gui.innerWindowStage,name,null,"Arial15",{ left : 0, right : 0, top : 3, bottom : 0}));
	upgradesTitleContainer.addChild(new gui_GUIFiller(upgradesTitleContainer,2));
	parent.addChild(upgradesTitleContainer);
	parent.addChild(new gui_GUISpacing(parent,new common_Point(2,2)));
	return upgradesTitleContainer;
};
gui_UpgradeWindowParts.addOneAndMaxButtons = function(gui,titleContainer,whenSwitchedOff,whenSwitchedOn,upgradeOneText,upgradeAllText,upgradeAllTextNoCost,anyUpgradeWithCost) {
	var upgradeOneButton = new gui_TextButton(gui,gui.innerWindowStage,titleContainer,whenSwitchedOff,common_Localize.lo("one"),function() {
		return !gui_UpgradeWindowParts.hasMultiUpgradeModeOn;
	},function() {
		gui.tooltip.setText(upgradeOneButton,upgradeOneText);
	});
	titleContainer.addChild(upgradeOneButton);
	titleContainer.addChild(new gui_GUISpacing(titleContainer,new common_Point(2,2)));
	var upgradeAllButton = new gui_TextButton(gui,gui.innerWindowStage,titleContainer,whenSwitchedOn,anyUpgradeWithCost ? common_Localize.lo("max") : common_Localize.lo("all"),function() {
		return gui_UpgradeWindowParts.hasMultiUpgradeModeOn;
	},function() {
		gui.tooltip.setText(upgradeAllButton,anyUpgradeWithCost ? upgradeAllText() : upgradeAllTextNoCost());
	});
	titleContainer.addChild(upgradeAllButton);
};
