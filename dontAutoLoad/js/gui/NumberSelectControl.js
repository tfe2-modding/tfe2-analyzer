var gui_NumberSelectControl = $hxClasses["gui.NumberSelectControl"] = function(gui,stage,parent,padding,getMinValue,getMaxValue,initialValue,setValue,setToOnClick,onClickHelp,stepSize,minWidth) {
	if(minWidth == null) {
		minWidth = 20;
	}
	if(stepSize == null) {
		stepSize = 1;
	}
	if(onClickHelp == null) {
		onClickHelp = "";
	}
	if(initialValue == null) {
		initialValue = 0;
	}
	this.number = 0;
	var _gthis = this;
	gui_GUIContainer.call(this,gui,stage,parent,null,null,null,null,padding);
	this.getMinValue = getMinValue;
	this.getMaxValue = getMaxValue;
	this.number = initialValue;
	this.setValue = setValue;
	this.setToOnClick = setToOnClick;
	this.numberButton = new gui_ContainerButton(gui,stage,this,function() {
		if(setToOnClick != null) {
			var originalNumber = _gthis.number;
			_gthis.number = setToOnClick();
			if(_gthis.number != originalNumber) {
				setValue(_gthis.number);
			}
		}
	},null,function() {
		gui.tooltip.setText(_gthis,onClickHelp);
	});
	var extraSpacing = gui.game.isMobile ? 2 : 0;
	var extraSpacingLR = gui.game.isMobile ? 4 : 0;
	this.numberButton.container.padding = { left : 3 + extraSpacingLR, right : 3 + extraSpacingLR, top : 3 + extraSpacing, bottom : -1 + extraSpacing};
	this.numberButton.container.minHeight = 12;
	this.numberButton.container.minWidth = minWidth;
	this.numberButton.container.addChild(new gui_TextElement(this.numberButton.container,stage,null,function() {
		if(_gthis.number == _gthis.beyondHighestValue) {
			return _gthis.beyondHighestText;
		} else {
			return "" + _gthis.number;
		}
	},null,null,null,false,true));
	this.addChild(this.numberButton);
	this.numberButton.buttonPatch.updateSprites(true);
	var upDownButtons = new gui_GUIContainer(gui,stage,this);
	upDownButtons.direction = gui.game.isMobile ? gui_GUIContainerDirection.Horizontal : gui_GUIContainerDirection.Vertical;
	this.upButton = new gui_ImageButton(gui,stage,this,function() {
		if(!(_gthis.beyondHighestValue != null && _gthis.number == _gthis.beyondHighestValue)) {
			if(getMaxValue == null || _gthis.number + stepSize <= getMaxValue()) {
				_gthis.number += stepSize;
				if(setValue != null) {
					setValue(_gthis.number);
				}
			} else if(_gthis.beyondHighestValue != null && _gthis.number != _gthis.beyondHighestValue) {
				_gthis.number = _gthis.beyondHighestValue;
				if(setValue != null) {
					setValue(_gthis.number);
				}
			}
		}
	},Resources.getTexture(gui.game.isMobile ? "spr_arrowup_big" : "spr_arrowup"),null,null,null,gui.game.isMobile ? "spr_button_small" : "spr_minibutton");
	this.upButton.canBeHeld = true;
	upDownButtons.addChild(this.upButton);
	this.downButton = new gui_ImageButton(gui,stage,this,function() {
		if(_gthis.beyondHighestValue != null && _gthis.number == _gthis.beyondHighestValue) {
			if(getMaxValue != null) {
				_gthis.number = getMaxValue();
			}
			if(setValue != null) {
				setValue(_gthis.number);
			}
		} else if(getMinValue == null || _gthis.number - stepSize >= getMinValue()) {
			_gthis.number -= stepSize;
			if(setValue != null) {
				setValue(_gthis.number);
			}
		}
	},Resources.getTexture(gui.game.isMobile ? "spr_arrowdown_big" : "spr_arrowdown"),null,null,null,gui.game.isMobile ? "spr_button_small" : "spr_minibutton");
	this.downButton.canBeHeld = true;
	upDownButtons.addChild(this.downButton);
	this.addChild(upDownButtons);
};
gui_NumberSelectControl.__name__ = "gui.NumberSelectControl";
gui_NumberSelectControl.__super__ = gui_GUIContainer;
gui_NumberSelectControl.prototype = $extend(gui_GUIContainer.prototype,{
	enableBeyondHighestValuePossibility: function(valueUsed,textShown) {
		this.beyondHighestValue = valueUsed;
		this.beyondHighestText = textShown;
	}
	,update: function() {
		gui_GUIContainer.prototype.update.call(this);
		if(this.number != this.beyondHighestValue) {
			var originalNumber = this.number;
			if(this.getMinValue != null) {
				var val1 = this.getMinValue();
				var val2 = this.number;
				this.number = val2 > val1 ? val2 : val1;
			}
			if(this.getMaxValue != null) {
				var val1 = this.getMaxValue();
				var val2 = this.number;
				this.number = val2 < val1 ? val2 : val1;
			}
			if(this.number != originalNumber) {
				this.setValue(this.number);
			}
		}
	}
	,__class__: gui_NumberSelectControl
});
