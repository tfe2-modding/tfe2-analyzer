var graphics_Cloud = $hxClasses["graphics.Cloud"] = function(bgImages,stage,position,parallaxLayer) {
	this.stage = stage;
	this.bgImages = bgImages;
	this.textures = Resources.getTextures("spr_clouds",16,false,2);
	this.position = position;
	this.cloudStage = new PIXI.Container();
	this.parallaxLayer = parallaxLayer;
	this.rect = new common_Rectangle(0,0,0,0);
	this.alph = 0.1 + parallaxLayer * 0.15 + random_Random.getFloat(0.1);
	stage.addChild(this.cloudStage);
	this.cloudStage.position.set(position.x,position.y);
	if(!graphics_Cloud.initedTexturesSuperMeta) {
		graphics_Cloud.initedTexturesSuperMeta = true;
		graphics_Cloud.topLeftCornerTextures = [];
		graphics_Cloud.topRightCornerTextures = [];
		graphics_Cloud.bottomLeftCornerTextures = [];
		graphics_Cloud.bottomRightCornerTextures = [];
		graphics_Cloud.topLeftSecondCornerTextures = [];
		graphics_Cloud.bottomLeftSecondCornerTextures = [];
		graphics_Cloud.topLeftSimpleCornerTextures = [];
		graphics_Cloud.bottomLeftSimpleCornerTextures = [];
		graphics_Cloud.topLeftSecondCornerTexturesNoUp = [];
		graphics_Cloud.topRightCornerTexturesNoUp = [];
		graphics_Cloud.leftTextures = [];
		graphics_Cloud.rightTextures = [];
		graphics_Cloud.topTextures = [];
		graphics_Cloud.leftRightTextures = [];
		graphics_Cloud.leftRightTexturesNoTop = [];
		var _g = 0;
		var _g1 = graphics_Cloud.texturesMeta.length;
		while(_g < _g1) {
			var i = _g++;
			var meta = graphics_Cloud.texturesMeta[i];
			if(meta == 7 || meta == 9 || meta == 10) {
				graphics_Cloud.topLeftCornerTextures.push(i);
			}
			if(meta == 9 || meta == 10) {
				graphics_Cloud.topLeftSecondCornerTextures.push(i);
			}
			if(meta == 10) {
				graphics_Cloud.topLeftSecondCornerTexturesNoUp.push(i);
			}
			if(meta == 5 || meta == 12 || meta == 13) {
				graphics_Cloud.topRightCornerTextures.push(i);
			}
			if(meta == 5 || meta == 13) {
				graphics_Cloud.topRightCornerTexturesNoUp.push(i);
			}
			if(meta == 8 || meta == 11) {
				graphics_Cloud.bottomLeftCornerTextures.push(i);
			}
			if(meta == 11) {
				graphics_Cloud.bottomLeftSecondCornerTextures.push(i);
			}
			if(meta == 6 || meta == 14) {
				graphics_Cloud.bottomRightCornerTextures.push(i);
			}
			if(meta == 7) {
				graphics_Cloud.topLeftSimpleCornerTextures.push(i);
			}
			if(meta == 8) {
				graphics_Cloud.bottomLeftSimpleCornerTextures.push(i);
			}
			if(meta == 1) {
				graphics_Cloud.leftTextures.push(i);
			}
			if(meta == 3) {
				graphics_Cloud.rightTextures.push(i);
			}
			if(meta == 0) {
				graphics_Cloud.topTextures.push(i);
			}
			if(meta == 2 || meta == 4) {
				graphics_Cloud.leftRightTextures.push(i);
			}
			if(meta == 4) {
				graphics_Cloud.leftRightTexturesNoTop.push(i);
			}
		}
	}
	this.makeANiceCloudForMe();
};
graphics_Cloud.__name__ = "graphics.Cloud";
graphics_Cloud.prototype = {
	makeANiceCloudForMe: function() {
		var parallaxLayer = 4 - this.parallaxLayer;
		var extendCloudLeftHere = [];
		var extendCloudRightHere = [];
		var doSecondCorner = -1;
		if(parallaxLayer == 3 && random_Random.getFloat() < 0.8) {
			this.addSpriteAt(new common_Point(0,0),random_Random.fromArray(graphics_Cloud.leftTextures));
			extendCloudRightHere.push(new common_Point(1,0));
		} else {
			var topLeft = random_Random.fromArray(graphics_Cloud.topLeftCornerTextures);
			var topRight = random_Random.fromArray(graphics_Cloud.topRightCornerTextures);
			var bottomLeft = random_Random.fromArray(graphics_Cloud.bottomLeftCornerTextures);
			var bottomRight = random_Random.fromArray(graphics_Cloud.bottomRightCornerTextures);
			this.addSpriteAt(new common_Point(0,0),topLeft);
			this.addSpriteAt(new common_Point(1,0),topRight);
			this.addSpriteAt(new common_Point(0,1),bottomLeft);
			this.addSpriteAt(new common_Point(1,1),bottomRight);
			if(graphics_Cloud.texturesMeta[topLeft] == 9 || graphics_Cloud.texturesMeta[topLeft] == 10) {
				extendCloudLeftHere.push(new common_Point(-1,0));
			}
			if(graphics_Cloud.texturesMeta[bottomLeft] == 11) {
				extendCloudLeftHere.push(new common_Point(-1,1));
			}
			if(random_Random.getFloat() < (parallaxLayer == 2 ? 0.1 : 0.8) && parallaxLayer < 3) {
				var secondCornerDesire = random_Random.getInt(4);
				if(secondCornerDesire < 2 && ((graphics_Cloud.texturesMeta[topRight] == 12 || graphics_Cloud.texturesMeta[topRight] == 13) && graphics_Cloud.texturesMeta[bottomRight] == 14)) {
					doSecondCorner = 0;
				}
				if(secondCornerDesire == 2 && (graphics_Cloud.texturesMeta[topRight] == 12 || graphics_Cloud.texturesMeta[topRight] == 13)) {
					doSecondCorner = 1;
				}
				if(secondCornerDesire == 3 && graphics_Cloud.texturesMeta[bottomRight] == 14) {
					doSecondCorner = 2;
				}
			}
			if((doSecondCorner == -1 || doSecondCorner == 2) && (graphics_Cloud.texturesMeta[topRight] == 12 || graphics_Cloud.texturesMeta[topRight] == 13)) {
				extendCloudRightHere.push(new common_Point(2,0));
			}
			if((doSecondCorner == -1 || doSecondCorner == 1) && graphics_Cloud.texturesMeta[bottomRight] == 14) {
				extendCloudRightHere.push(new common_Point(2,1));
			}
			if(graphics_Cloud.texturesMeta[topLeft] == 9) {
				this.addSpriteAt(new common_Point(0,-1),random_Random.fromArray(graphics_Cloud.topTextures));
			}
			if(graphics_Cloud.texturesMeta[topRight] == 12) {
				this.addSpriteAt(new common_Point(1,-1),random_Random.fromArray(graphics_Cloud.topTextures));
			}
			if(doSecondCorner != -1) {
				var secondCornerPoint_y;
				var secondCornerPoint_x = 2;
				switch(doSecondCorner) {
				case 0:
					secondCornerPoint_y = 0;
					break;
				case 1:
					secondCornerPoint_y = -1;
					break;
				case 2:
					secondCornerPoint_y = 1;
					break;
				default:
					secondCornerPoint_y = 0;
				}
				var topLeft = random_Random.fromArray(doSecondCorner == 1 ? graphics_Cloud.topLeftSimpleCornerTextures : doSecondCorner == 2 ? graphics_Cloud.topLeftSecondCornerTexturesNoUp : graphics_Cloud.topLeftSecondCornerTextures);
				var topRight = random_Random.fromArray(doSecondCorner == 2 ? graphics_Cloud.topRightCornerTexturesNoUp : graphics_Cloud.topRightCornerTextures);
				var bottomLeft = random_Random.fromArray(doSecondCorner == 2 ? graphics_Cloud.bottomLeftCornerTextures : graphics_Cloud.bottomLeftSecondCornerTextures);
				var bottomRight = random_Random.fromArray(graphics_Cloud.bottomRightCornerTextures);
				this.addSpriteAt(new common_Point(secondCornerPoint_x,secondCornerPoint_y),topLeft);
				this.addSpriteAt(new common_Point(secondCornerPoint_x + 1,secondCornerPoint_y),topRight);
				this.addSpriteAt(new common_Point(secondCornerPoint_x,secondCornerPoint_y + 1),bottomLeft);
				this.addSpriteAt(new common_Point(secondCornerPoint_x + 1,secondCornerPoint_y + 1),bottomRight);
				if(doSecondCorner == 2 && graphics_Cloud.texturesMeta[bottomLeft] == 11) {
					extendCloudLeftHere.push(new common_Point(secondCornerPoint_x - 1,secondCornerPoint_y + 1));
				}
				if(graphics_Cloud.texturesMeta[topRight] == 12 || graphics_Cloud.texturesMeta[topRight] == 13) {
					extendCloudRightHere.push(new common_Point(secondCornerPoint_x + 2,secondCornerPoint_y));
				}
				if(graphics_Cloud.texturesMeta[bottomRight] == 14) {
					extendCloudRightHere.push(new common_Point(secondCornerPoint_x + 2,secondCornerPoint_y + 1));
				}
				if(graphics_Cloud.texturesMeta[topLeft] == 9) {
					this.addSpriteAt(new common_Point(secondCornerPoint_x,secondCornerPoint_y - 1),random_Random.fromArray(graphics_Cloud.topTextures));
				}
				if(graphics_Cloud.texturesMeta[topRight] == 12) {
					this.addSpriteAt(new common_Point(secondCornerPoint_x + 1,secondCornerPoint_y - 1),random_Random.fromArray(graphics_Cloud.topTextures));
				}
			}
		}
		while(extendCloudLeftHere.length > 0) {
			var here = extendCloudLeftHere.pop();
			if(here.x > -1 && random_Random.getFloat() < 0.6 - 0.1 * parallaxLayer) {
				var newExtend;
				if(here.y <= 0) {
					newExtend = random_Random.fromArray(graphics_Cloud.leftRightTextures);
				} else {
					newExtend = random_Random.fromArray(graphics_Cloud.leftRightTexturesNoTop);
				}
				this.addSpriteAt(here,newExtend);
				if(graphics_Cloud.texturesMeta[newExtend] == 2) {
					this.addSpriteAt(new common_Point(here.x,here.y - 1),random_Random.fromArray(graphics_Cloud.topTextures));
				}
				extendCloudLeftHere.push(new common_Point(here.x - 1,here.y));
			} else {
				var newExtend1 = random_Random.fromArray(graphics_Cloud.leftTextures);
				this.addSpriteAt(here,newExtend1);
			}
		}
		while(extendCloudRightHere.length > 0) {
			var here = extendCloudRightHere.pop();
			if(here.x < 3 && random_Random.getFloat() < 0.6 - 0.1 * parallaxLayer) {
				var newExtend;
				if(here.y <= 0 && (doSecondCorner != 1 || here.y <= -1)) {
					newExtend = random_Random.fromArray(graphics_Cloud.leftRightTextures);
				} else {
					newExtend = random_Random.fromArray(graphics_Cloud.leftRightTexturesNoTop);
				}
				this.addSpriteAt(here,newExtend);
				if(graphics_Cloud.texturesMeta[newExtend] == 2) {
					this.addSpriteAt(new common_Point(here.x,here.y - 1),random_Random.fromArray(graphics_Cloud.topTextures));
				}
				extendCloudRightHere.push(new common_Point(here.x + 1,here.y));
			} else {
				var newExtend1 = random_Random.fromArray(graphics_Cloud.rightTextures);
				this.addSpriteAt(here,newExtend1);
			}
		}
	}
	,addSpriteAt: function(position,textureIndex) {
		var spr = new PIXI.Sprite(this.textures[textureIndex]);
		spr.position.set(position.x * 60,position.y * 60);
		this.cloudStage.addChild(spr);
		spr.alpha = this.alph;
		var x2Orig = this.rect.get_x2();
		var y2Orig = this.rect.get_y2();
		var val1 = this.rect.x;
		var val2 = position.x * 60;
		this.rect.x = val2 < val1 ? val2 : val1;
		var val1 = this.rect.y;
		var val2 = position.y * 60;
		this.rect.y = val2 < val1 ? val2 : val1;
		var val2 = position.x * 60 + 60;
		this.rect.width = (val2 > x2Orig ? val2 : x2Orig) - this.rect.x;
		var val2 = position.y * 60 + 60;
		this.rect.height = (val2 > y2Orig ? val2 : y2Orig) - this.rect.y;
	}
	,update: function(timeMod) {
		this.position.x += this.bgImages.cloudSpeedCurMult * (this.bgImages.cloudSpeedBase * timeMod + this.bgImages.cloudSpeedParallaxMult * timeMod * this.parallaxLayer);
		this.cloudStage.position.set(this.position.x,this.position.y);
	}
	,destroy: function() {
		this.cloudStage.destroy({ children : true});
	}
	,__class__: graphics_Cloud
};
