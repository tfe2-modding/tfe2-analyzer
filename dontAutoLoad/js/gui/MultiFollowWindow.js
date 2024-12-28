var gui_MultiFollowWindow = $hxClasses["gui.MultiFollowWindow"] = function() { };
gui_MultiFollowWindow.__name__ = "gui.MultiFollowWindow";
gui_MultiFollowWindow.createWindow = function(city,citizens,topText,relatedBuilding,nothingFoundText,extraWindowPartGenerator) {
	city.gui.createWindow(citizens);
	city.gui.setWindowPositioning(city.game.isMobile ? gui_WindowPosition.TopLeft : gui_WindowPosition.Top);
	var city1 = city;
	var citizens1 = citizens;
	var topText1 = topText;
	var relatedBuilding1 = relatedBuilding;
	var nothingFoundText1 = nothingFoundText;
	var extraWindowPartGenerator1 = extraWindowPartGenerator;
	var tmp = function() {
		gui_MultiFollowWindow.createWindow(city1,citizens1,topText1,relatedBuilding1,nothingFoundText1,extraWindowPartGenerator1);
	};
	city.gui.setWindowReload(tmp);
	var city2 = city;
	var citizens2 = citizens;
	var topText2 = topText;
	var relatedBuilding2 = relatedBuilding;
	var nothingFoundText2 = nothingFoundText;
	var extraWindowPartGenerator2 = extraWindowPartGenerator;
	var tmp = function() {
		gui_MultiFollowWindow.createWindow(city2,citizens2,topText2,relatedBuilding2,nothingFoundText2,extraWindowPartGenerator2);
	};
	city.gui.addWindowToStack(tmp);
	var windowTitle = topText;
	city.gui.windowAddTitleText(windowTitle);
	var allCitizensElem = new gui_GUIContainer(city.gui,city.gui.innerWindowStage,city.gui.windowInner);
	allCitizensElem.direction = gui_GUIContainerDirection.Vertical;
	var allCitizensSubElems = [];
	city.gui.windowInner.addChild(allCitizensElem);
	if(extraWindowPartGenerator != null) {
		extraWindowPartGenerator();
	}
	city.gui.windowAddBottomButtons();
	var selectedTexture = Resources.getTexture("spr_selectedhuman");
	var selectedSpritePool = [];
	var selectedBuildingSprite = null;
	if(relatedBuilding != null) {
		selectedBuildingSprite = Resources.makeSprite("spr_selectedbuilding");
		selectedBuildingSprite.alpha = 0.5;
		selectedBuildingSprite.position.set(relatedBuilding.position.x - 1,relatedBuilding.position.y - 1);
		city.farForegroundStage.addChild(selectedBuildingSprite);
	}
	city.gui.windowOnLateUpdate = function() {
		if(relatedBuilding != null) {
			if(relatedBuilding.destroyed) {
				city.gui.clearWindowStack();
				city.gui.closeWindow();
				return;
			}
			selectedBuildingSprite.position.set(relatedBuilding.position.x - 1,relatedBuilding.position.y - 1);
		}
		if(citizens.length == 0) {
			if(allCitizensSubElems.length > 0) {
				var _g = 0;
				while(_g < allCitizensSubElems.length) {
					var elem = allCitizensSubElems[_g];
					++_g;
					elem.elem.destroy();
				}
				allCitizensSubElems = [];
				allCitizensElem.clear();
			}
			if(allCitizensElem.children.length == 0) {
				allCitizensElem.addChild(new gui_TextElement(allCitizensElem,city.gui.innerWindowStage,nothingFoundText));
			}
		} else {
			if(allCitizensSubElems.length == 0) {
				allCitizensElem.clear();
			}
			var _g = 0;
			while(_g < citizens.length) {
				var citizen = [citizens[_g]];
				++_g;
				var thisCitizenElement = Lambda.find(allCitizensSubElems,(function(citizen) {
					return function(elem) {
						return elem.citizen == citizen[0];
					};
				})(citizen));
				if(thisCitizenElement == null) {
					var newButton = new gui_ContainerButton(city.gui,city.gui.innerWindowStage,allCitizensElem,(function(citizen) {
						return function() {
							gui_FollowingCitizen.createWindow(city,citizen[0],false);
						};
					})(citizen));
					newButton.container.padding.top = 3;
					newButton.container.padding.left = 3;
					newButton.container.padding.right = 3;
					newButton.container.padding.bottom = 0;
					newButton.container.fillSecondarySize = true;
					newButton.container.addChildWithoutSizeUpdate(new gui_TextElement(newButton.container,city.gui.innerWindowStage,citizen[0].nameIndex < Resources.citizenNames.length ? Resources.citizenNames[citizen[0].nameIndex] : common_StringExtensions.firstToUpper(common_Localize.lo("citizen"))));
					newButton.container.updateSizeNonRecursive();
					var nbcp = newButton.container.parent.parent;
					newButton.container.parent.parent = null;
					newButton.container.parent.updateSize();
					newButton.container.parent.parent = nbcp;
					newButton.container.updateChildrenPosition();
					allCitizensElem.addChildWithoutSizeUpdate(newButton);
					var spacingElem = new gui_GUISpacing(allCitizensElem,new common_Point(2,4));
					allCitizensElem.addChildWithoutSizeUpdate(spacingElem);
					allCitizensSubElems.push({ elem : newButton, elem2 : spacingElem, citizen : citizen[0]});
				}
			}
			allCitizensElem.updateSize();
			var i = allCitizensSubElems.length - 1;
			while(i >= 0) {
				var elem = allCitizensSubElems[i];
				if(citizens.indexOf(elem.citizen) == -1) {
					allCitizensElem.removeChild(elem.elem);
					allCitizensElem.removeChild(elem.elem2);
					allCitizensSubElems.splice(i,1);
				}
				--i;
			}
		}
		if(selectedSpritePool.length > citizens.length) {
			var _g = citizens.length;
			var _g1 = selectedSpritePool.length;
			while(_g < _g1) {
				var i = _g++;
				selectedSpritePool[i].destroy();
			}
			selectedSpritePool.splice(citizens.length,selectedSpritePool.length - citizens.length);
		}
		var _g = 0;
		var _g1 = citizens.length;
		while(_g < _g1) {
			var i = _g++;
			if(i >= selectedSpritePool.length) {
				var spr = new PIXI.Sprite(selectedTexture);
				selectedSpritePool.push(spr);
				city.furtherForegroundStage.addChild(spr);
			}
			var citizen1 = citizens[i];
			var citizenPos = citizen1.getCityPosition();
			selectedSpritePool[i].position.set(citizenPos.x - 1,citizenPos.y - 6);
		}
	};
	city.gui.windowOnDestroy = function() {
		var _g = 0;
		while(_g < selectedSpritePool.length) {
			var spr = selectedSpritePool[_g];
			++_g;
			spr.destroy();
		}
		if(selectedBuildingSprite != null) {
			selectedBuildingSprite.destroy();
		}
	};
};
