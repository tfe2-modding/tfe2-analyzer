var gui_PremiumInfoWindow = $hxClasses["gui.PremiumInfoWindow"] = function() { };
gui_PremiumInfoWindow.__name__ = "gui.PremiumInfoWindow";
gui_PremiumInfoWindow.create = function(city,gui,stage,$window,campaign,onClose) {
	gui_PremiumInfoWindow.createWindow(city,gui,stage,$window,campaign,onClose);
};
gui_PremiumInfoWindow.createWindow = function(city,gui,stage,$window,campaign,onClose) {
	var loader = new PIXI.Loader();
	if(gui_PremiumInfoWindow.unloaded) {
		loader.add("premium_promo_images/rocket.png");
		loader.add("premium_promo_images/treeland.png");
		loader.add("premium_promo_images/purple.png");
	}
	gui.windowOnDestroy = onClose;
	gui.windowRelatedTo = "premiumUpsell";
	gui.windowInner.addChild(new gui_TextElement(gui.windowInner,gui.innerWindowStage,"[white]Loading...",null,"Arial",null,320,true));
	loader.use(function(res,next) {
		if(res.error) {
			console.log("FloatingSpaceCities/gui/PremiumInfoWindow.hx:45:",res.error);
			gui.closeWindow();
			return;
		}
		next();
	});
	loader.load(function() {
		gui_PremiumInfoWindow.unloaded = false;
		if(gui.window == null || gui.windowRelatedTo != "premiumUpsell") {
			return;
		}
		$window.clear();
		gui.windowAddTitleText("[white]Check out the extended version!",null,null,false);
		if(city.game.isMobile) {
			city.gui.windowInner.addChild(new gui_GUISpacing(city.gui.windowInner,new common_Point(2,4)));
		}
		var spr = Resources.makeSprite("premium_promo_images/rocket");
		if(city.game.isMobile && city.game.scaling >= 4 && spr.height > city.game.rect.height * 0.55) {
			spr.scale.set((city.game.scaling - 2) / city.game.scaling,(city.game.scaling - 2) / city.game.scaling);
		}
		var sprHolder = new gui_ContainerHolder(gui.windowInner,gui.innerWindowStage,spr,{ left : 0, right : 0, bottom : 6, top : 0});
		gui.windowInner.addChild(sprHolder);
		var addInfoText = function() {
			gui.windowInner.addChild(new gui_TextElement(gui.windowInner,gui.innerWindowStage,"[white]I hope you're enjoying The Final Earth 2! Want even more?",null,"Arial",null,320,true));
			gui.windowInner.addChild(new gui_TextElement(gui.windowInner,gui.innerWindowStage,"[white]- Explore new worlds with the rocket!",null,"Arial",null,320,true));
			gui.windowInner.addChild(new gui_TextElement(gui.windowInner,gui.innerWindowStage,"[white]- Build trains, floating platforms and indoor landing pads!",null,"Arial",null,320,true));
			gui.windowInner.addChild(new gui_TextElement(gui.windowInner,gui.innerWindowStage,"[white]- Discover more buildings and missions!",null,"Arial",null,320,true));
			gui.windowInner.addChild(new gui_TextElement(gui.windowInner,gui.innerWindowStage,"[white]- Unlock sandbox mode for unlimited resources!",null,"Arial",null,320,true));
		};
		if(!city.game.isMobile) {
			addInfoText();
		}
		var bottomButtons = new gui_GUIContainer(gui,stage,gui.windowInner);
		gui.windowInner.addChild(bottomButtons);
		var textButtonText = 5 == 8 ? "Get Premium" : "Get it on Steam!";
		var hasValidProductInfo = false;
		var textButton = new gui_TextButton(gui,stage,bottomButtons,function() {
		},textButtonText,function() {
			return false;
		},function() {
			if(5 == 8) {
				gui.windowOnDestroy = null;
				if(!hasValidProductInfo) {
					gui_infoWindows_StoreInfo.createWindow(gui);
				} else {
					gui_infoWindows_StoreInfo.createWindow(gui,true);
				}
			} else {
				city.game.setOnClickTo = function() {
					window.open("https://store.steampowered.com/app/1180130/The_Final_Earth_2/?utm_source=coolmathgames&utm_medium=web&utm_campaign=" + campaign);
				};
			}
		},"spr_button_upsell","Arial16");
		if(5 == 8) {
			var productInfo = null;
			if(mobileSpecific_Premium.hasSpecific("remove_ads") && !Config.hasPremium()) {
				productInfo = CordovaStore.getProductInfo("premium_upgrade");
			} else {
				productInfo = CordovaStore.getProductInfo("premium");
			}
			hasValidProductInfo = productInfo != null && productInfo.valid;
			if(hasValidProductInfo) {
				var price = productInfo.price;
				var priceElem = new gui_TextElementAlt(null,gui.innerWindowStage,null,function() {
					return "(" + price + ")";
				},"Arial",{ top : 0, bottom : 0, right : 0, left : 5},200,null,14);
				priceElem.get_textContainer().style.fill = 16777215;
				textButton.extraElements.push(priceElem);
				priceElem.update();
			}
		}
		textButton.bitmapText.set_tint(16777215);
		bottomButtons.addChild(textButton);
		var guiSpacing = new gui_GUISpacing(bottomButtons,new common_Point(4,2));
		bottomButtons.addChild(guiSpacing);
		var textButtonClose = new gui_TextButton(gui,stage,bottomButtons,function() {
			gui.closeWindow();
		},"Not right now",function() {
			return false;
		},function() {
		},"spr_button_upsell_ignore");
		textButtonClose.bitmapText.set_tint(12630990);
		textButtonClose.extraTextPosY = 2 + textButtonClose.extraTextPosY;
		textButtonClose.extraHeight = 4 + textButtonClose.extraHeight;
		textButtonClose.setText("Not right now");
		bottomButtons.addChild(textButtonClose);
		if(city.game.isMobile) {
			city.gui.windowInner.addChild(new gui_GUISpacing(city.gui.windowInner,new common_Point(2,6)));
			addInfoText();
		}
		textButton.extraWidth = gui.windowInner.rect.width - 8 - textButton.rect.width - textButtonClose.rect.width - (city.game.isMobile ? 4 : 0) - common_ArrayExtensions.isum(textButton.extraElements,function(ee) {
			return ee.rect.width;
		});
		textButton.setText(textButtonText);
		var _this = textButton.rect;
		textButton.updatePosition(new common_Point(_this.x,_this.y));
		if(gui.windowInner.rect.width - 8 > spr.width) {
			sprHolder.padding.left += Math.floor((gui.windowInner.rect.width - 8 - spr.width) / 2);
			var _this = sprHolder.rect;
			sprHolder.updatePosition(new common_Point(_this.x,_this.y));
		}
		var slideShowId = 0;
		var tme = 0.0;
		gui.windowOnUpdate = function(timeMod) {
			tme += timeMod;
			if(tme > 300) {
				slideShowId += 1;
				slideShowId %= 3;
				spr.texture = Resources.getTexture(["premium_promo_images/rocket","premium_promo_images/treeland","premium_promo_images/purple"][slideShowId]);
				tme = 0;
			}
		};
	});
};
