var GUI = $hxClasses["GUI"] = function(game,outerStage) {
	this.safeAreaTop = 0;
	this.safeAreaBottom = 0;
	this.safeAreaRight = 0;
	this.safeAreaLeft = 0;
	this.guiTimer = 0;
	this.spaceAboveBelowWindow = 40;
	this.windowCanBeClosed = true;
	this.windowCapturesAllInput = false;
	this.windowReloadOnResize = false;
	this.windowShowingBanner = false;
	this.windowPosition = gui_WindowPosition.Center;
	this.overlayElements = [];
	this.notificationPanelTimeout = -1;
	this.notificationPanel = null;
	this.windowSimpleButtonContainer = null;
	this.game = game;
	this.outerStage = outerStage;
	this.stage = new PIXI.Container();
	outerStage.addChild(this.stage);
	this.windowStage = new PIXI.Container();
	outerStage.addChild(this.windowStage);
	this.prevWindowStack = [];
	this.windowStackMeta = [];
	this.gameHelpStage = new PIXI.Container();
	outerStage.addChild(this.gameHelpStage);
	this.tooltipStage = new PIXI.Container();
	outerStage.addChild(this.tooltipStage);
	this.notificationStage = new PIXI.Container();
	outerStage.addChild(this.notificationStage);
	this.tooltip = new gui_Tooltip(game,null,this.tooltipStage);
	this.notifications = [];
	this.computeSafeSpace();
};
GUI.__name__ = "GUI";
GUI.prototype = {
	get_windowHeight: function() {
		var tmp = this.game.rect.height;
		var tmp1;
		if(this.windowPosition == gui_WindowPosition.CenterWithBanner) {
			var tmp2 = 50 / this.game.scaling * this.game.get_pixelRatio();
			var val1 = this.safeAreaTop;
			var val2 = this.safeAreaBottom;
			tmp1 = Math.floor(35 + Math.max(tmp2,val2 > val1 ? val2 : val1));
		} else {
			var val1 = this.spaceAboveBelowWindow;
			var val11 = this.safeAreaTop;
			var val2 = this.safeAreaBottom;
			var val21 = val2 > val11 ? val2 : val11;
			tmp1 = val21 > val1 ? val21 : val1;
		}
		return tmp - tmp1;
	}
	,get_keyboard: function() {
		return this.game.keyboard;
	}
	,computeSafeSpace: function() {
		if(5 == 8) {
			var topSafeSpaceStr = window.getComputedStyle(window.document.documentElement).getPropertyValue("--safe-space-top-var");
			var bottomSafeSpaceStr = window.getComputedStyle(window.document.documentElement).getPropertyValue("--safe-space-bottom-var");
			var leftSafeSpaceStr = window.getComputedStyle(window.document.documentElement).getPropertyValue("--safe-space-left-var");
			var rightSafeSpaceStr = window.getComputedStyle(window.document.documentElement).getPropertyValue("--safe-space-right-var");
			if(topSafeSpaceStr != "" && topSafeSpaceStr != null && topSafeSpaceStr.indexOf("px") != -1) {
				var nonDigits_r = new RegExp("D","g".split("u").join(""));
				var topSafeSpace = Std.parseInt(topSafeSpaceStr.replace(nonDigits_r,""));
				var bottomSafeSpace = Std.parseInt(bottomSafeSpaceStr.replace(nonDigits_r,""));
				var leftSafeSpace = Std.parseInt(leftSafeSpaceStr.replace(nonDigits_r,""));
				var rightSafeSpace = Std.parseInt(rightSafeSpaceStr.replace(nonDigits_r,""));
				this.safeAreaLeft = Math.round(leftSafeSpace / this.game.get_preDPIAdjustScaling());
				this.safeAreaTop = Math.round(topSafeSpace / this.game.get_preDPIAdjustScaling());
				this.safeAreaBottom = Math.round(bottomSafeSpace / this.game.get_preDPIAdjustScaling());
				this.safeAreaRight = Math.round(rightSafeSpace / this.game.get_preDPIAdjustScaling());
			}
		}
		if(Config.isVerticalVideo) {
			this.safeAreaLeft = 452;
			this.safeAreaTop = 50;
			this.safeAreaBottom = 140;
			this.safeAreaRight = 457;
		}
	}
	,update: function(timeMod) {
		this.guiTimer += timeMod;
		if(this.windowOnUpdate != null && this.window != null) {
			this.windowOnUpdate(timeMod);
		}
		this.tooltip.update(timeMod);
		var _g = 0;
		var _g1 = this.overlayElements;
		while(_g < _g1.length) {
			var overlayElement = _g1[_g];
			++_g;
			overlayElement.update(timeMod);
		}
		if(this.game.keyboard.anyBack() && (this.window == null || this.windowCanBeClosed)) {
			if(this.notificationPanel != null) {
				this.notificationPanel.destroy();
				this.notificationPanel = null;
			} else if(this.window != null) {
				this.goPreviousWindow();
			} else {
				this.onEscapePressWithoutWindow();
			}
		}
		if(this.window != null) {
			this.window.update();
		}
		if(this.game.keyboard.down[17] && this.game.keyboard.pressed[121]) {
			this.stage.visible = !this.stage.visible;
		}
		var i = this.notifications.length;
		while(--i >= 0) this.notifications[i].update(timeMod);
		if(this.windowShowingBanner && (this.window == null || this.windowPosition != gui_WindowPosition.CenterWithBanner || this.notificationPanel != null)) {
			common_AdHelper.hideBanner();
			this.windowShowingBanner = false;
		}
	}
	,onEscapePressWithoutWindow: function() {
	}
	,lateUpdate: function() {
		if(this.windowOnLateUpdate != null && this.window != null) {
			this.windowOnLateUpdate();
		}
	}
	,handleMouse: function(mouse) {
		if(this.window != null && this.window.handleMouse(mouse)) {
			return true;
		}
		if(this.windowCapturesAllInput) {
			return true;
		}
		return false;
	}
	,createWindowInCurrentContext: function(relatedTo,windowBackground) {
		this.createWindow(relatedTo,windowBackground);
	}
	,notify: function(text,title,notificationTime) {
		if(notificationTime == null) {
			notificationTime = 600;
		}
		var newNotification = new gui_TopScreenNotification(this.game,this,this.notificationStage,text,title,notificationTime);
		this.notifications.push(newNotification);
	}
	,createWindow: function(relatedTo,windowBackground,spaceAboveBelowWindow,windowPadding,scrollbarTexture) {
		if(scrollbarTexture == null) {
			scrollbarTexture = "spr_windowparts";
		}
		if(windowPadding == null) {
			windowPadding = 2;
		}
		if(spaceAboveBelowWindow == null) {
			spaceAboveBelowWindow = 40;
		}
		this.closeWindow(true);
		this.spaceAboveBelowWindow = spaceAboveBelowWindow;
		this.game.mouse.releaseAllClaims(true);
		var windowBackground1 = new gui_NinePatch(windowBackground == null ? Resources.getTexture("spr_9p_window") : windowBackground,1,4,4);
		this.window = new gui_GUIContainer(this,this.windowStage,null,new common_Point(this.game.rect.width / 2 | 0,this.game.rect.height / 2 | 0),new common_FPoint(0.5,0.5),null,windowBackground1);
		this.window.direction = gui_GUIContainerDirection.Vertical;
		this.windowPosition = gui_WindowPosition.Center;
		this.windowScrollableOuter = new gui_ContainerWithScrollbar(500,this.get_windowHeight(),this,this.windowStage,this.window,null,null,null,null,null,null,scrollbarTexture);
		this.window.addChild(this.windowScrollableOuter);
		this.windowInner = new gui_GUIContainer(this,this.innerWindowStage,this.windowScrollableOuter,new common_Point(0,0),null,null,null,{ top : windowPadding, right : windowPadding, bottom : windowPadding, left : windowPadding});
		this.windowInner.direction = gui_GUIContainerDirection.Vertical;
		this.windowScrollableOuter.setInnerContainer(this.windowInner);
		this.innerWindowStage = this.windowScrollableOuter.scrollable.stage;
		this.windowRelatedTo = relatedTo;
		this.windowOnLateUpdate = null;
		this.windowOnUpdate = null;
		this.windowTitleElem = null;
		this.windowReloadOnResize = false;
		this.windowCapturesAllInput = false;
		this.windowIsOnStack = false;
		this.windowSimpleButtonContainer = null;
		this.windowCanBeClosed = true;
	}
	,windowAllowBanner: function() {
		if(!common_AdHelper.canShowBanner()) {
			return;
		}
		if(this.notificationPanel != null) {
			return;
		}
		this.setWindowPositioning(gui_WindowPosition.CenterWithBanner);
		common_AdHelper.showBanner();
		this.windowShowingBanner = true;
	}
	,addWindowToStack: function(windowCreate,onlyIfNotThere,metaData) {
		if(metaData == null) {
			metaData = "";
		}
		if(onlyIfNotThere == null) {
			onlyIfNotThere = true;
		}
		if(this.prevWindowStack.length == 0 || this.prevWindowStack[this.prevWindowStack.length - 1] != windowCreate) {
			this.prevWindowStack.push(windowCreate);
			this.windowStackMeta.push(metaData);
		}
		this.windowIsOnStack = true;
	}
	,clearWindowStack: function() {
		this.prevWindowStack = [];
		this.windowStackMeta = [];
		this.windowIsOnStack = false;
	}
	,setWindowReload: function(func) {
		this.windowReload = func;
	}
	,windowAddBottomButtons: function(extraButtons,textOnCloseButton,closeAction,buttonTexture) {
		if(buttonTexture == null) {
			buttonTexture = "spr_button";
		}
		if(textOnCloseButton == null) {
			textOnCloseButton = "lo_close";
		}
		var _gthis = this;
		if(textOnCloseButton == "lo_close") {
			textOnCloseButton = common_Localize.lo("close");
		}
		if(!GUI.closeButtonEnabled && (extraButtons == null || extraButtons.length == 0)) {
			return [];
		}
		var bottomButtons = new gui_GUIContainer(this,this.innerWindowStage,this.windowInner);
		bottomButtons.fillSecondarySize = true;
		this.windowInner.addChild(bottomButtons);
		var addedButtons = [];
		if(extraButtons != null) {
			var _g = 0;
			while(_g < extraButtons.length) {
				var button = [extraButtons[_g]];
				++_g;
				var buttonTexture1 = button[0].buttonTexture;
				if(buttonTexture1 == null) {
					buttonTexture1 = "spr_button";
				}
				if(button[0].spr != null) {
					var but = [null];
					var but1 = but;
					var value = this.innerWindowStage;
					var button1 = button[0];
					var value1 = Resources.getTexture(button[0].spr);
					var value2 = button[0].onHover != null ? button[0].onHover : (function(but,button) {
						return function() {
							_gthis.tooltip.setText(but[0],button[0].text);
						};
					})(but,button);
					but1[0] = new gui_ImageButton(this,value,bottomButtons,button1.action,value1,null,value2,null,this.game.isMobile ? "spr_button_smaller_mobile" : "spr_button_smaller",this.game.isMobile ? 4 : 2);
					bottomButtons.addChild(but[0]);
					bottomButtons.addChild(new gui_GUISpacing(bottomButtons,new common_Point(2,2)));
				} else {
					addedButtons.push(bottomButtons.addChild(new gui_TextButton(this,this.innerWindowStage,bottomButtons,button[0].action,button[0].text,null,button[0].onHover,buttonTexture1)));
					bottomButtons.addChild(new gui_GUISpacing(bottomButtons,new common_Point(2,2)));
				}
			}
		}
		bottomButtons.addChild(new gui_GUIFiller(bottomButtons,0));
		if(textOnCloseButton != "" && (GUI.closeButtonEnabled || closeAction != null)) {
			if(closeAction == null) {
				closeAction = $bind(this,this.goPreviousWindow);
			}
			addedButtons.push(bottomButtons.addChild(new gui_TextButton(this,this.innerWindowStage,bottomButtons,closeAction,textOnCloseButton,null,null,buttonTexture)));
		}
		return addedButtons;
	}
	,goPreviousWindow: function() {
		this.closeWindow();
		if(this.prevWindowStack.length > 0) {
			if(this.windowIsOnStack) {
				this.prevWindowStack.pop();
				this.windowStackMeta.pop();
				if(this.prevWindowStack.length > 0) {
					this.windowStackMeta.pop();
					(this.prevWindowStack.pop())();
				}
			}
		}
	}
	,closeWindow: function(inProcessOfOpeningAnother) {
		if(inProcessOfOpeningAnother == null) {
			inProcessOfOpeningAnother = false;
		}
		if(this.window != null) {
			this.window.destroy();
			this.window = null;
			this.windowRelatedTo = null;
			this.windowReload = null;
			this.windowOnLateUpdate = null;
			this.windowOnUpdate = null;
			this.windowTitleElem = null;
			this.windowReloadOnResize = false;
			this.windowCapturesAllInput = false;
			this.windowSimpleButtonContainer = null;
			this.windowCanBeClosed = true;
			this.spaceAboveBelowWindow = 40;
			if(this.windowOnDestroy != null) {
				this.windowOnDestroy();
			}
			this.windowOnDestroy = null;
		}
	}
	,windowAddTitleText: function(text,textUpdateFunction,icon,hasCloseButton) {
		if(hasCloseButton == null) {
			hasCloseButton = true;
		}
		if(text == null) {
			text = "";
		}
		var _gthis = this;
		if(this.windowTitleElem != null) {
			this.windowTitleElem.setTextAndTextUpdate(text,textUpdateFunction);
			return this.windowTitleElem;
		}
		var thisStage = this.windowStage;
		var parent = this.window;
		var spacing = new gui_GUISpacing(this.windowInner,new common_Point(0,0));
		this.windowInner.addChild(spacing);
		var container = new gui_GUIContainerWithSizeCallback(this,thisStage,parent);
		container.fillSecondarySize = true;
		container.setSizeCallback(function() {
			spacing.rect.width = container.rect.width - 6;
			spacing.updateSize();
		});
		container.addChild(new gui_GUISpacing(container,new common_Point(3,0)));
		if(icon != null) {
			this.windowIconSprite = new PIXI.Sprite(icon);
			container.addChild(new gui_GUISpacing(container,new common_Point(1,0)));
			container.addChild(new gui_ContainerHolder(parent,this.windowStage,this.windowIconSprite,{ top : 4, bottom : 0, left : 0, right : 0}));
			container.addChild(new gui_GUISpacing(container,new common_Point(2,0)));
		}
		var textElem = new gui_TextElement(container,thisStage,text,textUpdateFunction,"Arial16",{ left : 0, top : 3, right : 0, bottom : -3},null,true);
		container.addChild(textElem);
		container.addChild(new gui_GUIFiller(container));
		if(hasCloseButton) {
			var closeButton = new gui_ImageButton(this,thisStage,container,function() {
				if(_gthis.window != null) {
					_gthis.goPreviousWindow();
				}
			},Resources.getTexture("spr_icon_close"),null,null,null,this.game.isMobile ? "spr_button_windowheader_mobi" : "spr_button_windowheader",this.game.isMobile ? 2 : 1);
			container.addChild(closeButton);
		}
		parent.insertChild(container,0);
		this.windowTitleElem = textElem;
		if(this.game.isMobile) {
			this.windowInner.padding.top = 0;
		}
		return textElem;
	}
	,windowAddInfoText: function(text,textUpdateFunction,font) {
		if(font == null) {
			font = "Arial";
		}
		if(text == null) {
			text = "";
		}
		return this.windowInner.addChild(new gui_TextElement(this.windowInner,this.innerWindowStage,text,textUpdateFunction,font,null,null,true));
	}
	,windowAddInfoTextClickable: function(onClick,text,textUpdateFunction,font) {
		if(font == null) {
			font = "Arial";
		}
		if(text == null) {
			text = "";
		}
		var textElem = new gui_TextElement(this.windowInner,this.innerWindowStage,text,textUpdateFunction,font,null,null,true);
		textElem.handleMouseFunction = function(mouse) {
			if(textElem.rect.contains(mouse.position)) {
				switch(mouse.claimMouse(textElem)._hx_index) {
				case 0:
					return true;
				case 1:
					onClick();
					return true;
				default:
					return false;
				}
			}
			return false;
		};
		return this.windowInner.addChild(textElem);
	}
	,windowAddSimpleButton: function(image,onClick,text,textUpdateFunction,font) {
		if(font == null) {
			font = "Arial";
		}
		if(text == null) {
			text = "";
		}
		if(this.windowSimpleButtonContainer == null) {
			this.windowSimpleButtonContainer = new gui_GUIContainer(this,this.innerWindowStage,this.windowInner);
			this.windowInner.addChild(this.windowSimpleButtonContainer);
			this.windowInner.addChild(new gui_GUISpacing(this.windowInner,new common_Point(2,4)));
		} else {
			this.windowSimpleButtonContainer.addChild(new gui_GUISpacing(this.windowSimpleButtonContainer,new common_Point(4,2)));
		}
		var containerButton = new gui_ContainerButton(this,this.innerWindowStage,this.windowSimpleButtonContainer,onClick);
		var outerElem = containerButton.container;
		var extraSpacing = 0;
		var extraSpacingText = 0;
		outerElem.padding = { left : 2 + extraSpacing, right : extraSpacing + 3, top : extraSpacing + 2, bottom : extraSpacing + (-1)};
		outerElem.addChild(new gui_ContainerHolder(outerElem,this.innerWindowStage,new PIXI.Sprite(image)));
		var textElem = new gui_TextElement(outerElem,this.innerWindowStage,text,textUpdateFunction,font,{ left : 1 + extraSpacingText, top : 1, bottom : 0, right : 0},null,true);
		textElem.handleMouseFunction = function(mouse) {
			if(textElem.rect.contains(mouse.position)) {
				switch(mouse.claimMouse(textElem)._hx_index) {
				case 0:
					return true;
				case 1:
					onClick();
					return true;
				default:
					return false;
				}
			}
			return false;
		};
		outerElem.addChild(textElem);
		var elem = this.windowSimpleButtonContainer.addChild(containerButton);
		return elem;
	}
	,resize: function() {
		this.outerStage.scale.x = this.outerStage.scale.y = this.game.scaling;
		if(this.window != null) {
			if(this.windowReloadOnResize && this.windowReload != null) {
				this.windowReload();
			} else {
				this.updateWindowPosition();
				this.windowUpdateSize();
			}
		}
	}
	,windowUpdateSize: function() {
		this.windowScrollableOuter.scrollable.maxHeight = this.get_windowHeight();
		this.windowScrollableOuter.maxHeight = this.get_windowHeight();
		this.windowScrollableOuter.scrollable.updateSize();
	}
	,showSimpleWindow: function(text,header,closeWindowIfAny,inAnyContext) {
		if(inAnyContext == null) {
			inAnyContext = false;
		}
		if(closeWindowIfAny == null) {
			closeWindowIfAny = false;
		}
		if(header == null) {
			header = "";
		}
		if(text == null) {
			text = "";
		}
		if(this.window != null) {
			if(closeWindowIfAny) {
				this.closeWindow();
			} else {
				return false;
			}
		}
		if(inAnyContext) {
			this.createWindowInCurrentContext();
		} else {
			this.createWindow();
		}
		if(header != "") {
			this.windowAddTitleText(header);
		}
		this.windowAddInfoText(text);
		this.windowAddBottomButtons();
		return true;
	}
	,reloadWindow: function(createWindowFunc) {
		if(createWindowFunc == null) {
			createWindowFunc = this.windowReload;
		}
		if(createWindowFunc == null) {
			return;
		}
		var _this = this.windowScrollableOuter.scrollable.scrollPosition;
		var scrollPosition = new common_Point(_this.x,_this.y);
		var windowStackLengthOrig = null;
		var windowStack1 = null;
		var windowStack1Meta = null;
		if(this.windowIsOnStack && this.windowStackMeta.length >= 1) {
			windowStackLengthOrig = this.prevWindowStack.length;
			windowStack1 = this.prevWindowStack.pop();
			windowStack1Meta = this.windowStackMeta.pop();
		}
		createWindowFunc();
		if(this.prevWindowStack.length < windowStackLengthOrig) {
			this.prevWindowStack.push(windowStack1);
			this.windowStackMeta.push(windowStack1Meta);
			this.windowIsOnStack = true;
		}
		this.windowScrollableOuter.forceSetScrollPosition(scrollPosition);
	}
	,setWindowPositioning: function(positioning) {
		this.windowPosition = positioning;
		this.updateWindowPosition();
	}
	,updateWindowPosition: function() {
		var _g = this.windowPosition;
		switch(_g._hx_index) {
		case 0:
			this.window.origin.x = 0.5;
			this.window.origin.y = 0;
			this.window.updatePosition(new common_Point(this.game.rect.width / 2 | 0,10));
			break;
		case 1:
			this.window.origin.x = 0.5;
			this.window.origin.y = 0.5;
			this.window.updatePosition(new common_Point(this.game.rect.width / 2 | 0,this.game.rect.height / 2 | 0));
			break;
		case 2:
			var offsetToTop = _g.offsetToTop;
			this.window.origin.x = 0.5;
			this.window.origin.y = 0.5;
			this.window.updatePosition(new common_Point(this.game.rect.width / 2 | 0,(this.game.rect.height / 2 | 0) - offsetToTop));
			break;
		case 3:
			this.window.origin.x = 0;
			this.window.origin.y = 0;
			this.window.updatePosition(new common_Point(10,10));
			break;
		case 4:
			this.window.origin.x = 0.5;
			this.window.origin.y = 0.5;
			var offsetToTop = Math.ceil(25 / this.game.scaling * this.game.get_pixelRatio());
			this.window.updatePosition(new common_Point(this.game.rect.width / 2 | 0,(this.game.rect.height / 2 | 0) + offsetToTop));
			this.windowUpdateSize();
			break;
		}
	}
	,onLanguageChange: function() {
		this.reloadWindow();
		if(this.tooltip != null) {
			this.tooltip.destroy();
		}
		this.tooltip = new gui_Tooltip(this.game,null,this.tooltipStage);
	}
	,__class__: GUI
};
