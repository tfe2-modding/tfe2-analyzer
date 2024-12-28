var graphics_BackgroundImages = $hxClasses["graphics.BackgroundImages"] = function(stage,city) {
	this.didntInit = false;
	this.parallaxLayers = 3;
	this.parallax = 0.2;
	this.cloudSpeedCurMult = 1;
	this.cloudSpeedParallaxMult = 0.12500000125000002;
	this.cloudSpeedBase = 0.12500000125000002;
	this.stage = stage;
	var _g = [];
	var _g1 = 0;
	var _g2 = this.parallaxLayers;
	while(_g1 < _g2) {
		var i = _g1++;
		_g.push(new PIXI.Container());
	}
	this.cloudsStages = _g;
	var _g = [];
	var _g1 = 0;
	var _g2 = this.parallaxLayers;
	while(_g1 < _g2) {
		var i = _g1++;
		_g.push([]);
	}
	this.cloudsByLayer = _g;
	this.backgroundImagesStage = new PIXI.Container();
	stage.addChild(this.backgroundImagesStage);
	var _g = 0;
	var _g1 = this.cloudsStages;
	while(_g < _g1.length) {
		var cloudSingleStage = _g1[_g];
		++_g;
		stage.addChild(cloudSingleStage);
	}
	this.city = city;
	this.backgroundSprites = [];
};
graphics_BackgroundImages.__name__ = "graphics.BackgroundImages";
graphics_BackgroundImages.prototype = {
	postCreate: function() {
		if(this.city.progress.story != null && this.city.progress.story.storyInfo != null && this.city.progress.story.storyInfo.backgroundSprites != null) {
			var _g = 0;
			var _g1 = this.city.progress.story.storyInfo.backgroundSprites;
			while(_g < _g1.length) {
				var bgSprite = _g1[_g];
				++_g;
				var textures = Resources.getTexturesByWidth(bgSprite.sprite,bgSprite.width);
				var backgroundSprite = new PIXI.Sprite(textures[textures.length - 2]);
				backgroundSprite.alpha = 1;
				backgroundSprite.anchor.set(0.5,0.5);
				this.backgroundImagesStage.addChild(backgroundSprite);
				var sprite = new PIXI.Sprite(textures[bgSprite.image]);
				sprite.alpha = 0.4;
				sprite.anchor.set(0.5,0.5);
				this.backgroundImagesStage.addChild(sprite);
				var fgSprite = new PIXI.Sprite(textures[textures.length - 1]);
				fgSprite.alpha = 0.04;
				fgSprite.anchor.set(0.5,0.5);
				this.backgroundImagesStage.addChild(fgSprite);
				this.backgroundSprites.push({ info : bgSprite, sprite : sprite, backgroundSprite : backgroundSprite, fgSprite : fgSprite});
			}
			this.resize();
		}
		if(Settings.disableClouds) {
			this.didntInit = true;
			return;
		}
		var edges = this.city.getCityEdges();
		var _g = 0;
		var _g1 = this.parallaxLayers;
		while(_g < _g1) {
			var j = _g++;
			var _g2 = 0;
			var _g3 = 500 + ((edges.maxX - edges.minX) / 40 | 0);
			while(_g2 < _g3) {
				var i = _g2++;
				this.doCloudsStep(40,edges,j);
			}
		}
	}
	,resize: function() {
	}
	,update: function(timeMod) {
		this.backgroundImagesStage.visible = !Settings.disablePlanets;
		if(!Settings.disableClouds && this.didntInit) {
			var edges = this.city.getCityEdges();
			var _g = 0;
			var _g1 = this.parallaxLayers;
			while(_g < _g1) {
				var j = _g++;
				var _g2 = 0;
				while(_g2 < 500) {
					var i = _g2++;
					this.doCloudsStep(40,edges,j);
				}
			}
			this.didntInit = false;
		}
		var this1 = this.city.skyColor;
		var skyCol = this1;
		var useCurCloudCol = this.city.stars.cloudsAlpha;
		var skyColMult = 1 - useCurCloudCol;
		var _g = 0;
		var _g1 = this.backgroundSprites;
		while(_g < _g1.length) {
			var bgSprite = _g1[_g];
			++_g;
			var len = Math.sqrt(bgSprite.info.x * bgSprite.info.x + bgSprite.info.y * bgSprite.info.y);
			var dir = Math.atan2(bgSprite.info.y,bgSprite.info.x) + this.city.simulation.time.timeSinceStart * 0.0000175 * bgSprite.info.velocity;
			var xx = len * Math.cos(dir);
			var yy = len * Math.sin(dir);
			bgSprite.sprite.position.set(xx,yy);
			bgSprite.backgroundSprite.position.set(bgSprite.sprite.position.x,bgSprite.sprite.position.y);
			bgSprite.fgSprite.position.set(bgSprite.sprite.position.x,bgSprite.sprite.position.y);
		}
		var _g = 0;
		var _g1 = this.backgroundSprites;
		while(_g < _g1.length) {
			var bgSprite = _g1[_g];
			++_g;
			bgSprite.backgroundSprite.tint = this.city.skyColor;
		}
		var game = this.city.game;
		var edges = this.city.getCityEdges();
		var zoomScale = this.city.zoomScale;
		var _g = 0;
		var _g1 = this.parallaxLayers;
		while(_g < _g1) {
			var i = _g++;
			var cloudsStage = this.cloudsStages[i];
			if(Settings.disableClouds) {
				cloudsStage.visible = false;
				continue;
			}
			var _this = this.city.viewPos;
			var withFloat = this.parallax + this.parallax * i;
			var viewPos_x = _this.x * withFloat;
			var viewPos_y = _this.y * withFloat;
			cloudsStage.alpha = useCurCloudCol;
			if(cloudsStage.alpha == 0) {
				cloudsStage.visible = false;
			} else {
				cloudsStage.visible = true;
			}
			if(this.city.cityView.city.viewIsControlled) {
				cloudsStage.position.set((-viewPos_x + game.addX) * zoomScale + (game.rect.width / 2 | 0) * game.scaling,(-viewPos_y + game.addY) * zoomScale + game.scaling * (game.rect.height / 2 | 0));
			} else {
				cloudsStage.position.set(Math.floor((-viewPos_x + game.addX) * zoomScale + (game.rect.width / 2 | 0) * game.scaling),Math.floor((-viewPos_y + game.addY) * zoomScale + game.scaling * (game.rect.height / 2 | 0)));
			}
			this.doCloudsStep(timeMod,edges,i);
		}
		var _this = this.city.viewPos;
		var viewPosPlanets_x = _this.x * 0.15000000015;
		var viewPosPlanets_y = _this.y * 0.15000000015;
		if(this.city.cityView.city.viewIsControlled) {
			this.backgroundImagesStage.position.set((-viewPosPlanets_x + game.addX) * zoomScale + (game.rect.width / 2 | 0) * game.scaling,(-viewPosPlanets_y + game.addY) * zoomScale + game.scaling * (game.rect.height / 2 | 0));
		} else {
			this.backgroundImagesStage.position.set(Math.floor((-viewPosPlanets_x + game.addX) * zoomScale + (game.rect.width / 2 | 0) * game.scaling),Math.floor((-viewPosPlanets_y + game.addY) * zoomScale + game.scaling * (game.rect.height / 2 | 0)));
		}
	}
	,doCloudsStep: function(timeMod,edges,layer) {
		var game = this.city.game;
		var thisParallax = this.parallax * (layer + 1);
		var clouds = this.cloudsByLayer[layer];
		var cityLeftForThisViewPos = edges.minX * thisParallax - 300 - 300;
		var cityLeftForThisViewPos1 = (game.rect.width / 2 | 0) * game.scaling;
		var val = this.city.cityView.get_game().scaling / 2;
		var maxVal = Settings.allowMoreZoom ? 1 : 2;
		var cityLeftForThisViewPos2 = cityLeftForThisViewPos - cityLeftForThisViewPos1 * Math.floor(val < 1 ? 1 : val > maxVal ? maxVal : val);
		var cityRightForThisViewPos = edges.maxX * thisParallax + 120 + 300;
		var cityRightForThisViewPos1 = (game.rect.width / 2 | 0) * game.scaling;
		var val = this.city.cityView.get_game().scaling / 2;
		var maxVal = Settings.allowMoreZoom ? 1 : 2;
		var cityRightForThisViewPos2 = cityRightForThisViewPos + cityRightForThisViewPos1 * Math.floor(val < 1 ? 1 : val > maxVal ? maxVal : val);
		var extraYCreate = (game.rect.height / 2 | 0) * game.scaling;
		var val = this.city.cityView.get_game().scaling / 2;
		var maxVal = Settings.allowMoreZoom ? 1 : 2;
		var extraYCreate1 = extraYCreate * Math.floor(val < 1 ? 1 : val > maxVal ? maxVal : val);
		var minCloudY = edges.minY * thisParallax - 300 - extraYCreate1;
		var maxCloudY = edges.maxY * thisParallax + 300 + extraYCreate1;
		if(clouds.length < 1000 && random_Random.getFloat() < timeMod * Math.min(0.15,(7 - layer * 1.8) * (maxCloudY - minCloudY) * 0.0000009)) {
			var newCloud = new graphics_Cloud(this,this.cloudsStages[layer],new common_FPoint(cityLeftForThisViewPos2 - 300,random_Random.getFloat(minCloudY,maxCloudY)),layer + 1);
			var newCloudTransformedRect = newCloud.rect.clone();
			if(common_ArrayExtensions.any(clouds,function(cl) {
				newCloudTransformedRect.x = newCloud.rect.x + Math.round(newCloud.position.x - cl.position.x);
				newCloudTransformedRect.y = newCloud.rect.y + Math.round(newCloud.position.y - cl.position.y);
				return cl.rect.intersects(newCloudTransformedRect);
			})) {
				newCloud.destroy();
			} else {
				clouds.push(newCloud);
			}
		}
		var i = clouds.length;
		while(--i >= 0) {
			var cloud = clouds[i];
			cloud.update(timeMod);
			if(cloud.position.x > cityRightForThisViewPos2) {
				cloud.destroy();
				clouds.splice(i,1);
			}
		}
	}
	,__class__: graphics_BackgroundImages
};
