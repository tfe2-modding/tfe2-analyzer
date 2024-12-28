var gui_Slider = $hxClasses["gui.Slider"] = function(gui,stage,parent,fillLevel,setFillLevel) {
	var sliderFillTexture = Resources.getTexture("spr_slider_fill");
	this.fillPatch = new gui_NinePatch(sliderFillTexture,2,20,20);
	this.fillLevel = fillLevel;
	this.setFillLevel = setFillLevel;
	gui_GUIContainer.call(this,gui,stage,parent,null,null,null,new gui_NinePatch(Resources.getTexture("spr_slider_bg"),2,20,20));
	this.padding.top = 3;
	this.padding.left = 3;
	this.padding.right = 3;
	this.padding.bottom = 1;
	this.fillSecondarySize = true;
	stage.addChild(this.fillPatch);
	this.updateFillSize();
};
gui_Slider.__name__ = "gui.Slider";
gui_Slider.__super__ = gui_GUIContainer;
gui_Slider.prototype = $extend(gui_GUIContainer.prototype,{
	updateFillSize: function() {
		if(this.fillPatch != null) {
			var oldBackgroundWidth = this.fillPatch.npWidth;
			var oldBackgroundHeight = this.fillPatch.npHeight;
			var tmp = this.fillLevel() * this.rect.width;
			this.fillPatch.npWidth = Math.round(tmp);
			this.fillPatch.npHeight = this.rect.height;
			if(this.fillPatch != null) {
				this.fillPatch.position.x = this.rect.x;
				this.fillPatch.position.y = this.rect.y;
				this.fillPatch.updateSprites();
			}
			if(oldBackgroundWidth != this.fillPatch.npWidth || oldBackgroundHeight != this.fillPatch.npHeight) {
				this.fillPatch.updateSprites();
			}
		}
	}
	,updatePosition: function(newPosition) {
		gui_GUIContainer.prototype.updatePosition.call(this,newPosition);
		if(this.fillPatch != null) {
			this.fillPatch.position.x = this.rect.x;
			this.fillPatch.position.y = this.rect.y;
			this.fillPatch.updateSprites();
		}
	}
	,updateChildrenPosition: function() {
		gui_GUIContainer.prototype.updateChildrenPosition.call(this);
		this.updateFillSize();
	}
	,updateSizeNonRecursive: function() {
		gui_GUIContainer.prototype.updateSizeNonRecursive.call(this);
	}
	,handleMouse: function(mouse) {
		var _gthis = this;
		if(this.rect.contains(mouse.position)) {
			if(mouse.hasNoClaim()) {
				mouse.strongClaimMouse(this,function() {
					var val = (mouse.position.x - _gthis.rect.x) / _gthis.rect.width;
					var amount = val < 0 ? 0 : val > 1 ? 1 : val;
					if(amount < 0.025) {
						amount = 0;
					}
					if(amount > 0.975) {
						amount = 1;
					}
					_gthis.setFillLevel(amount);
					_gthis.updateFillSize();
					mouse.strongClaimOnEnd = function() {
						_gthis.gui.game.audio.playSound(_gthis.gui.game.audio.buttonSound);
					};
				});
			}
			return true;
		}
		return false;
	}
	,update: function() {
		gui_GUIContainer.prototype.update.call(this);
	}
	,destroy: function() {
		gui_GUIContainer.prototype.destroy.call(this);
		this.fillPatch.destroy();
	}
	,__class__: gui_Slider
});
