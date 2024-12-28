var mobileSpecific_WaitAndShowAd = $hxClasses["mobileSpecific.WaitAndShowAd"] = function(game,stage,text) {
	this.timer2 = 20;
	this.timer = 90;
	this.game = game;
	this.stage = stage;
	this.text = text;
};
mobileSpecific_WaitAndShowAd.__name__ = "mobileSpecific.WaitAndShowAd";
mobileSpecific_WaitAndShowAd.generalUpdate = function(timeMod) {
	if(mobileSpecific_WaitAndShowAd.timeBeforeNextAd > 0) {
		mobileSpecific_WaitAndShowAd.timeBeforeNextAd -= timeMod;
	}
	if(Config.isMoreAdsTest) {
		mobileSpecific_WaitAndShowAd.timeBeforeNextAd -= 10000;
	}
};
mobileSpecific_WaitAndShowAd.prototype = {
	useIfPossible: function(andThen) {
		if(Config.hasRemoveAds()) {
			andThen();
			return;
		}
		if(!common_AdHelper.adAvailableInterstitial()) {
			andThen();
			return;
		}
		if(mobileSpecific_WaitAndShowAd.timeBeforeNextAd > 0 || common_AdHelper.adExpireTime > 0) {
			andThen();
			return;
		}
		this.game.waitAndShowAdInstance = this;
		this.andThen = andThen;
		this.game.pause("WaitAndShowAd");
		this.subStage = new PIXI.Container();
		this.stage.addChild(this.subStage);
		this.gameGraphics = new PIXI.Graphics();
		this.gameGraphics.beginFill(0,0.5);
		this.gameGraphics.drawRect(0,0,this.game.rect.width * this.game.scaling,this.game.rect.height * this.game.scaling);
		this.gameGraphics.endFill();
		this.subStage.addChild(this.gameGraphics);
		var taskComplete = new PIXI.Text(this.text,{ fontFamily : "Arial,sans-serif", fontSize : 24 * this.game.scaling, fill : 16777215, align : "center"});
		taskComplete.anchor.set(0.5,0.5);
		this.subStage.addChild(taskComplete);
		taskComplete.position.set(this.game.rect.width * this.game.scaling / 2,this.game.rect.height * this.game.scaling / 2 - taskComplete.height / 2 + 3 * this.game.scaling);
		var pleaseWait = new PIXI.Text(common_Localize.lo("please_wait"),{ fontFamily : "Arial,sans-serif", fontSize : 15 * this.game.scaling, fill : 16777215, align : "center"});
		pleaseWait.anchor.set(0.5,0.5);
		this.subStage.addChild(pleaseWait);
		pleaseWait.position.set(this.game.rect.width * this.game.scaling / 2,this.game.rect.height * this.game.scaling / 2 + pleaseWait.height / 2 + 3 * this.game.scaling);
		mobileSpecific_WaitAndShowAd.timeBeforeNextAd = 18000;
	}
	,update: function(timeMod) {
		if(this.timer >= 0) {
			this.timer -= timeMod;
			if(this.timer < 0) {
				common_AdHelper.showNonRewardedInterstitialAlways();
				this.timer = -1;
			}
		} else if(this.timer2 >= 0) {
			this.timer2 -= timeMod;
			if(this.timer2 < 0) {
				this.subStage.destroy();
				this.game.resume("WaitAndShowAd");
				this.game.waitAndShowAdInstance = null;
				this.andThen();
			}
		}
	}
	,__class__: mobileSpecific_WaitAndShowAd
};
