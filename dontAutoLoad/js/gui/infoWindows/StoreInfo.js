var gui_infoWindows_StoreInfo = $hxClasses["gui.infoWindows.StoreInfo"] = function() { };
gui_infoWindows_StoreInfo.__name__ = "gui.infoWindows.StoreInfo";
gui_infoWindows_StoreInfo.createWindow = function(gui,instantBuyPremiumVariant) {
	if(instantBuyPremiumVariant == null) {
		instantBuyPremiumVariant = false;
	}
	if(!window.CordovaStore) {
		window.CordovaStore = { };
		window.CordovaStore.isAvailable = function() {
			return Config.isStoreTest;
		};
		window.CordovaStore.getProductInfo = function() {
			return null;
		};
	}
	var bg = new PIXI.Graphics();
	bg.beginFill(2626656);
	bg.drawRect(0,0,gui.game.rect.width + 10,gui.game.rect.height + 10);
	bg.endFill();
	gui.stage.addChild(bg);
	gui.createWindow("get_premium",Resources.getTexture("spr_9p_window_purple"),25,4,"spr_windowparts_purple");
	gui.windowOnDestroy = function() {
		if(bg != null) {
			bg.destroy();
			bg = null;
		}
	};
	if(((gui) instanceof gui_CityGUI)) {
		var cityGUI = gui;
		cityGUI.pauseForWindow();
	}
	var gui1 = gui;
	var tmp = function() {
		gui_infoWindows_StoreInfo.createWindow(gui1);
	};
	gui.setWindowReload(tmp);
	var gui2 = gui;
	var tmp = function() {
		gui_infoWindows_StoreInfo.createWindow(gui2);
	};
	gui.addWindowToStack(tmp);
	gui.windowReloadOnResize = true;
	gui.windowCapturesAllInput = true;
	var loader = new PIXI.Loader();
	if(gui_PremiumInfoWindow.unloaded) {
		loader.add("premium_promo_images/rocket.png");
		loader.add("premium_promo_images/treeland.png");
		loader.add("premium_promo_images/purple.png");
	}
	gui.windowInner.addChild(new gui_TextElement(gui.windowInner,gui.innerWindowStage,"[white]Loading...",null,"Arial",null,320,true));
	loader.use(function(res,next) {
		if(res.error) {
			console.log("FloatingSpaceCities/gui/infoWindows/StoreInfo.hx:58:",res.error);
			gui.closeWindow();
			return;
		}
		next();
	});
	loader.load(function() {
		gui_PremiumInfoWindow.unloaded = false;
		if(gui.window == null || gui.windowRelatedTo != "get_premium") {
			return;
		}
		gui.windowInner.clear();
		gui.windowAddTitleText("[white]" + common_Localize.lo("store"),null,null,false);
		var val2 = gui.game.rect.width - 30 - gui.safeAreaLeft - gui.safeAreaRight;
		var ww = val2 < 370 ? val2 : 370;
		gui.windowInner.addChild(new gui_GUISpacing(gui.windowInner,new common_Point(ww,gui.game.isMobile ? 4 : 1)));
		gui.windowInner.addChild(new gui_TextElement(gui.windowInner,gui.innerWindowStage,"[white]" + common_Localize.lo("store_description"),null,null,null,ww,true));
		gui.windowInner.addChild(new gui_GUISpacing(gui.windowInner,new common_Point(2,2)));
		var getPremiumButtonAction = null;
		if(CordovaStore.isAvailable()) {
			var sprHolder = null;
			var spr = null;
			if(Config.hasPremium() && !Config.isStoreTest) {
				gui.windowInner.addChild(new gui_TextElement(gui.windowInner,gui.innerWindowStage,"[white]" + common_Localize.lo("already_has_premium"),null,null,null,ww,true));
			} else if(mobileSpecific_Premium.hasSpecific("remove_ads") && !Config.hasPremium()) {
				getPremiumButtonAction = gui_infoWindows_StoreInfo.createVersionUpgradeButton(gui,gui.windowInner,"premium_upgrade",common_Localize.lo("premium_upgrade"),[common_Localize.lo("premium_advantage_1"),common_Localize.lo("premium_advantage_6"),common_Localize.lo("premium_advantage_7"),common_Localize.lo("premium_advantage_2"),common_Localize.lo("premium_advantage_3"),common_Localize.lo("premium_advantage_5")],ww);
				gui.windowInner.addChild(new gui_GUISpacing(gui.windowInner,new common_Point(2,6)));
				gui.windowInner.addChild(new gui_TextElement(gui.windowInner,gui.innerWindowStage,"[white]" + common_Localize.lo("removed_ads_already"),null,null,null,ww,true));
			} else {
				getPremiumButtonAction = gui_infoWindows_StoreInfo.createVersionUpgradeButton(gui,gui.windowInner,"premium",common_Localize.lo("get_premium_edition"),instantBuyPremiumVariant ? [] : [common_Localize.lo("premium_advantage_1"),common_Localize.lo("premium_advantage_6"),common_Localize.lo("premium_advantage_7"),common_Localize.lo("premium_advantage_3"),common_Localize.lo("premium_advantage_2"),common_Localize.lo("premium_advantage_4"),common_Localize.lo("premium_advantage_5")],ww);
				gui.windowInner.addChild(new gui_GUISpacing(gui.windowInner,new common_Point(2,6)));
				if(!instantBuyPremiumVariant) {
					gui_infoWindows_StoreInfo.createVersionUpgradeButton(gui,gui.windowInner,"remove_ads",common_Localize.lo("remove_ads"),[common_Localize.lo("remove_ads_1"),common_Localize.lo("remove_ads_2")],ww);
					gui.windowInner.addChild(new gui_GUISpacing(gui.windowInner,new common_Point(2,6)));
				}
				spr = Resources.makeSprite("premium_promo_images/rocket");
				if(gui.game.isMobile && gui.game.scaling >= 4 && spr.height > gui.game.rect.height * 0.55) {
					spr.scale.set((gui.game.scaling - 1) / gui.game.scaling,(gui.game.scaling - 1) / gui.game.scaling);
				}
				sprHolder = new gui_ContainerHolder(gui.windowInner,gui.innerWindowStage,spr,{ left : 0, right : 0, bottom : 6, top : 0});
				gui.windowInner.addChild(sprHolder);
			}
			if(spr != null && sprHolder != null && gui.windowInner.rect.width - 8 > spr.width) {
				sprHolder.padding.left += Math.floor((gui.windowInner.rect.width - 8 - spr.width) / 2);
				var _this = sprHolder.rect;
				sprHolder.updatePosition(new common_Point(_this.x,_this.y));
			}
			var slideShowId = 0;
			var tme = 0.0;
			gui.windowOnUpdate = function(timeMod) {
				tme += timeMod;
				if(tme > 300 && spr != null) {
					slideShowId += 1;
					slideShowId %= 3;
					spr.texture = Resources.getTexture(["premium_promo_images/rocket","premium_promo_images/treeland","premium_promo_images/purple"][slideShowId]);
					tme = 0;
				}
			};
		} else {
			gui.windowInner.addChild(new gui_TextElement(gui.windowInner,gui.innerWindowStage,"[white]" + common_Localize.lo("store_not_available"),null,null,null,ww,true));
		}
		gui.windowAddBottomButtons(null,"[grayish]" + common_Localize.lo("close"),null,"spr_button_upsell_ignore");
		if(getPremiumButtonAction != null && instantBuyPremiumVariant) {
			getPremiumButtonAction();
		}
	});
};
gui_infoWindows_StoreInfo.createVersionUpgradeButton = function(gui,addToContainer,productID,text,advantages,maxWidth) {
	var alreadyHasThis = function() {
		if(!CordovaStore.isAvailable()) {
			return false;
		}
		var productInfo = CordovaStore.getProductInfo(productID);
		if(productInfo == null) {
			return false;
		}
		return productInfo.owned;
	};
	var containerButton = new gui_ContainerButton(gui,gui.innerWindowStage,addToContainer,function() {
		if(alreadyHasThis()) {
			return;
		}
		var createWarningWindow = null;
		createWarningWindow = function() {
			gui.showSimpleWindow(common_Localize.lo("purchase_failed"),null,true);
		};
		var createWarningWindow2 = null;
		createWarningWindow2 = function() {
			gui.showSimpleWindow(common_Localize.lo("purchase_processing"),null,true);
		};
		if(!CordovaStore.isAvailable()) {
			createWarningWindow();
			gui.addWindowToStack(createWarningWindow);
		} else {
			var productInfo = CordovaStore.getProductInfo(productID);
			if(productInfo != null && productInfo.canPurchase) {
				CordovaStore.purchase(productID);
			} else if(productInfo != null && (productInfo.deferred || productInfo.state == "initiated")) {
				createWarningWindow2();
			} else {
				createWarningWindow();
				gui.addWindowToStack(createWarningWindow);
			}
		}
	},alreadyHasThis,null,"spr_button_store");
	var infoContainer = containerButton.container;
	infoContainer.padding.top = 3;
	infoContainer.padding.left = 3;
	infoContainer.padding.right = 3;
	infoContainer.padding.bottom = 1;
	infoContainer.fillSecondarySize = true;
	infoContainer.direction = gui_GUIContainerDirection.Vertical;
	addToContainer.addChild(containerButton);
	var headerWithPrice = new gui_GUIContainer(gui,gui.innerWindowStage,infoContainer);
	headerWithPrice.fillSecondarySize = true;
	headerWithPrice.addChild(new gui_TextElement(headerWithPrice,gui.innerWindowStage,"[white]" + text,null,"Arial16"));
	headerWithPrice.addChild(new gui_GUIFiller(headerWithPrice));
	headerWithPrice.addChild(new gui_TextElementAlt(headerWithPrice,gui.innerWindowStage,null,function() {
		if(!CordovaStore.isAvailable()) {
			return common_Localize.lo("n/a");
		}
		var productInfo = CordovaStore.getProductInfo(productID);
		if(productInfo == null) {
			return "";
		}
		if(productInfo.owned) {
			return common_Localize.lo("purchased");
		}
		if(productInfo.deferred) {
			return "...";
		}
		if(productInfo.state == "initiated") {
			return "...";
		}
		if(productInfo != null && productInfo.valid) {
			return productInfo.price;
		} else {
			return "";
		}
	},"Arial",{ top : -2, bottom : 0, right : 0, left : 0},200,null,14,16777215));
	infoContainer.addChild(headerWithPrice);
	if(advantages.length > 0) {
		infoContainer.addChild(new gui_TextElement(infoContainer,gui.innerWindowStage,"[white]" + "- " + advantages.join("\n- "),null,null,null,maxWidth));
	}
	return containerButton.action;
};
