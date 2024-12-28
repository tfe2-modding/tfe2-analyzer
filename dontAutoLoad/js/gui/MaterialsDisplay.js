var gui_MaterialsDisplay = $hxClasses["gui.MaterialsDisplay"] = function(materials,maxWidth) {
	if(maxWidth == null) {
		maxWidth = 1000;
	}
	this.maxWidth = 1000;
	PIXI.Container.call(this);
	this.maxWidth = maxWidth;
	this.materials = materials;
	this.updateMaterialsDisplay();
};
gui_MaterialsDisplay.__name__ = "gui.MaterialsDisplay";
gui_MaterialsDisplay.__super__ = PIXI.Container;
gui_MaterialsDisplay.prototype = $extend(PIXI.Container.prototype,{
	setMaterials: function(materials) {
		this.materials = materials;
		this.updateMaterialsDisplay();
	}
	,updateMaterialsDisplay: function() {
		var _gthis = this;
		var i = this.children.length;
		while(--i >= 0) {
			var child = this.children[i];
			this.removeChildAt(i);
			child.destroy({ children : true});
		}
		var xx = 0;
		var yy = 0;
		var displayW = 0;
		if(this.materials.food > 0) {
			xx -= 2;
			if(xx + 50 > this.maxWidth) {
				if(displayW <= xx) {
					displayW = xx;
				}
				xx = 0;
				yy = 12;
			}
			var spr = new PIXI.Sprite(Resources.getTexture("spr_resource_" + "food".toLowerCase()));
			spr.position.x = xx;
			spr.position.y = yy;
			this.addChild(spr);
			xx += (spr.width | 0) + 1;
			xx -= 2;
			var bitmapText = new graphics_BitmapText("" + this.materials.food,{ font : "Arial", tint : 0},true);
			bitmapText.position.set(xx,-1 + yy);
			this.addChild(bitmapText);
			xx += (bitmapText.get_textWidth() | 0) + 3;
		}
		if(this.materials.wood > 0) {
			if(xx + 50 > this.maxWidth) {
				if(displayW <= xx) {
					displayW = xx;
				}
				xx = 0;
				yy = 12;
			}
			var spr = new PIXI.Sprite(Resources.getTexture("spr_resource_" + "wood".toLowerCase()));
			spr.position.x = xx;
			spr.position.y = yy;
			this.addChild(spr);
			xx += (spr.width | 0) + 1;
			var bitmapText = new graphics_BitmapText("" + this.materials.wood,{ font : "Arial", tint : 0},true);
			bitmapText.position.set(xx,-1 + yy);
			this.addChild(bitmapText);
			xx += (bitmapText.get_textWidth() | 0) + 3;
		}
		if(this.materials.stone > 0) {
			if(xx + 50 > this.maxWidth) {
				if(displayW <= xx) {
					displayW = xx;
				}
				xx = 0;
				yy = 12;
			}
			var spr = new PIXI.Sprite(Resources.getTexture("spr_resource_" + "stone".toLowerCase()));
			spr.position.x = xx;
			spr.position.y = yy;
			this.addChild(spr);
			xx += (spr.width | 0) + 1;
			var bitmapText = new graphics_BitmapText("" + this.materials.stone,{ font : "Arial", tint : 0},true);
			bitmapText.position.set(xx,-1 + yy);
			this.addChild(bitmapText);
			xx += (bitmapText.get_textWidth() | 0) + 3;
		}
		if(this.materials.machineParts > 0) {
			if(xx + 50 > this.maxWidth) {
				if(displayW <= xx) {
					displayW = xx;
				}
				xx = 0;
				yy = 12;
			}
			var spr = new PIXI.Sprite(Resources.getTexture("spr_resource_" + "machineParts".toLowerCase()));
			spr.position.x = xx;
			spr.position.y = yy;
			this.addChild(spr);
			xx += (spr.width | 0) + 1;
			var bitmapText = new graphics_BitmapText("" + this.materials.machineParts,{ font : "Arial", tint : 0},true);
			bitmapText.position.set(xx,-1 + yy);
			this.addChild(bitmapText);
			xx += (bitmapText.get_textWidth() | 0) + 3;
		}
		if(this.materials.refinedMetal > 0) {
			if(xx + 50 > this.maxWidth) {
				if(displayW <= xx) {
					displayW = xx;
				}
				xx = 0;
				yy = 12;
			}
			var spr = new PIXI.Sprite(Resources.getTexture("spr_resource_" + "refinedMetal".toLowerCase()));
			spr.position.x = xx;
			spr.position.y = yy;
			this.addChild(spr);
			xx += (spr.width | 0) + 1;
			var bitmapText = new graphics_BitmapText("" + this.materials.refinedMetal,{ font : "Arial", tint : 0},true);
			bitmapText.position.set(xx,-1 + yy);
			this.addChild(bitmapText);
			xx += (bitmapText.get_textWidth() | 0) + 3;
		}
		if(this.materials.computerChips > 0) {
			if(xx + 50 > this.maxWidth) {
				if(displayW <= xx) {
					displayW = xx;
				}
				xx = 0;
				yy = 12;
			}
			var spr = new PIXI.Sprite(Resources.getTexture("spr_resource_" + "computerChips".toLowerCase()));
			spr.position.x = xx;
			spr.position.y = yy;
			this.addChild(spr);
			xx += (spr.width | 0) + 1;
			var bitmapText = new graphics_BitmapText("" + this.materials.computerChips,{ font : "Arial", tint : 0},true);
			bitmapText.position.set(xx,-1 + yy);
			this.addChild(bitmapText);
			xx += (bitmapText.get_textWidth() | 0) + 3;
		}
		if(this.materials.cacao > 0) {
			if(xx + 50 > this.maxWidth) {
				if(displayW <= xx) {
					displayW = xx;
				}
				xx = 0;
				yy = 12;
			}
			var spr = new PIXI.Sprite(Resources.getTexture("spr_resource_" + "cacao".toLowerCase()));
			spr.position.x = xx;
			spr.position.y = yy;
			this.addChild(spr);
			xx += (spr.width | 0) + 1;
			var bitmapText = new graphics_BitmapText("" + this.materials.cacao,{ font : "Arial", tint : 0},true);
			bitmapText.position.set(xx,-1 + yy);
			this.addChild(bitmapText);
			xx += (bitmapText.get_textWidth() | 0) + 3;
		}
		if(this.materials.chocolate > 0) {
			if(xx + 50 > this.maxWidth) {
				if(displayW <= xx) {
					displayW = xx;
				}
				xx = 0;
				yy = 12;
			}
			var spr = new PIXI.Sprite(Resources.getTexture("spr_resource_" + "chocolate".toLowerCase()));
			spr.position.x = xx;
			spr.position.y = yy;
			this.addChild(spr);
			xx += (spr.width | 0) + 1;
			var bitmapText = new graphics_BitmapText("" + this.materials.chocolate,{ font : "Arial", tint : 0},true);
			bitmapText.position.set(xx,-1 + yy);
			this.addChild(bitmapText);
			xx += (bitmapText.get_textWidth() | 0) + 3;
		}
		if(this.materials.graphene > 0) {
			if(xx + 50 > this.maxWidth) {
				if(displayW <= xx) {
					displayW = xx;
				}
				xx = 0;
				yy = 12;
			}
			var spr = new PIXI.Sprite(Resources.getTexture("spr_resource_" + "graphene".toLowerCase()));
			spr.position.x = xx;
			spr.position.y = yy;
			this.addChild(spr);
			xx += (spr.width | 0) + 1;
			var bitmapText = new graphics_BitmapText("" + this.materials.graphene,{ font : "Arial", tint : 0},true);
			bitmapText.position.set(xx,-1 + yy);
			this.addChild(bitmapText);
			xx += (bitmapText.get_textWidth() | 0) + 3;
		}
		if(this.materials.rocketFuel > 0) {
			if(xx + 50 > this.maxWidth) {
				if(displayW <= xx) {
					displayW = xx;
				}
				xx = 0;
				yy = 12;
			}
			var spr = new PIXI.Sprite(Resources.getTexture("spr_resource_" + "rocketFuel".toLowerCase()));
			spr.position.x = xx;
			spr.position.y = yy;
			this.addChild(spr);
			xx += (spr.width | 0) + 1;
			var bitmapText = new graphics_BitmapText("" + this.materials.rocketFuel,{ font : "Arial", tint : 0},true);
			bitmapText.position.set(xx,-1 + yy);
			this.addChild(bitmapText);
			xx += (bitmapText.get_textWidth() | 0) + 3;
		}
		var _g = 0;
		var _g1 = MaterialsHelper.modMaterials;
		while(_g < _g1.length) {
			var modMaterial = _g1[_g];
			++_g;
			var currentMaterial = modMaterial.variableName;
			if(this.materials[currentMaterial] > 0) {
				if(currentMaterial == "food") {
					xx -= 2;
				}
				if(xx + 50 > this.maxWidth) {
					if(displayW <= xx) {
						displayW = xx;
					}
					xx = 0;
					yy = 12;
				}
				var spr = new PIXI.Sprite(Resources.getTexture("spr_resource_" + currentMaterial.toLowerCase()));
				spr.position.x = xx;
				spr.position.y = yy;
				this.addChild(spr);
				xx += (spr.width | 0) + 1;
				if(currentMaterial == "food") {
					xx -= 2;
				}
				var bitmapText = new graphics_BitmapText("" + this.materials[currentMaterial],{ font : "Arial", tint : 0},true);
				bitmapText.position.set(xx,-1 + yy);
				this.addChild(bitmapText);
				xx += (bitmapText.get_textWidth() | 0) + 3;
			}
		}
		if(this.materials.knowledge > 0) {
			if(xx + 50 > this.maxWidth) {
				if(displayW <= xx) {
					displayW = xx;
				}
				xx = 0;
				yy = 12;
			}
			var spr = new PIXI.Sprite(Resources.getTexture("spr_resource_" + "knowledge".toLowerCase()));
			spr.position.x = xx;
			spr.position.y = yy;
			this.addChild(spr);
			xx += (spr.width | 0) + 1;
			var bitmapText = new graphics_BitmapText("" + this.materials.knowledge,{ font : "Arial", tint : 0},true);
			bitmapText.position.set(xx,-1 + yy);
			this.addChild(bitmapText);
			xx += (bitmapText.get_textWidth() | 0) + 3;
		}
		var addExtraIcon = function(textureName,amount) {
			var spr = new PIXI.Sprite(Resources.getTexture(textureName));
			spr.position.x = xx;
			_gthis.addChild(spr);
			xx += (spr.width | 0) + 1;
			var bitmapText = new graphics_BitmapText("" + amount,{ font : "Arial", tint : 0});
			bitmapText.position.set(xx,-1);
			_gthis.addChild(bitmapText);
			xx += (bitmapText.get_textWidth() | 0) + 3;
		};
		this.displayWidth = displayW > xx ? displayW : xx;
	}
	,__class__: gui_MaterialsDisplay
});
