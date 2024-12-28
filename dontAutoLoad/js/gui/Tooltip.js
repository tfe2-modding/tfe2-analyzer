var gui_Tooltip = $hxClasses["gui.Tooltip"] = function(game,city,stage) {
	this.isContinousDisplay = false;
	this.contentsSetLastStep = false;
	this.timeBeforeShown = 0;
	this.owner = null;
	this.emptyCost2 = new Materials();
	this.emptyCost = new Materials();
	this.game = game;
	this.stage = stage;
	this.bg = new gui_NinePatch(Resources.getTexture("spr_9p_tooltip"),2,4,4);
	this.bg.position.set(0,0);
	stage.addChild(this.bg);
	this.tooltipHeader = new graphics_BitmapText("",{ font : "Arial16", tint : 0});
	this.tooltipHeader.position.set(2,0);
	stage.addChild(this.tooltipHeader);
	this.tooltipText = new graphics_BitmapText("",{ font : "Arial", tint : 0});
	this.tooltipText.position.set(3,0);
	stage.addChild(this.tooltipText);
	this.tooltipCost = new gui_MaterialsCostDisplay(city,this.emptyCost);
	this.tooltipCost.position.set(3,0);
	stage.addChild(this.tooltipCost);
	this.tooltipCost2 = new gui_MaterialsCostDisplay(city,new Materials());
	this.tooltipCost2.position.set(3,0);
	this.tooltipCost2.setAfterKnowledgeText("");
	stage.addChild(this.tooltipCost2);
	this.tooltipCost2Text = new graphics_BitmapText("",{ font : "Arial", tint : 0});
	this.tooltipCost2Text.position.set(3,0);
	stage.addChild(this.tooltipCost2Text);
	this.tooltipExtraIcons = new gui_IconListDisplay([]);
	stage.addChild(this.tooltipExtraIcons);
	this.tooltipExtraIcons2 = new gui_IconListDisplay([]);
	this.tooltipExtraIcons2.position.set(2,0);
	stage.addChild(this.tooltipExtraIcons2);
	this.tooltipPosition = new common_Point(0,0);
	stage.position.set(-100,-100);
	this.owner = null;
	this.timeBeforeShown = 0;
	this.setTextDisplay("","");
};
gui_Tooltip.__name__ = "gui.Tooltip";
gui_Tooltip.prototype = {
	get_tooltipDelay: function() {
		if(this.game.mouse.isTouch) {
			return 30;
		} else {
			return 0;
		}
	}
	,get_knownGUI: function() {
		return this.game.state.get_publicGUI();
	}
	,update: function(timeMod) {
		if(!this.contentsSetLastStep) {
			this.setTextDisplay();
			this.isContinousDisplay = false;
			this.owner = null;
			this.timeBeforeShown = 0;
			return;
		}
		this.contentsSetLastStep = false;
		if(this.timeBeforeShown > 0) {
			if(!this.isContinousDisplay) {
				this.setTextDisplay();
			}
			this.timeBeforeShown -= timeMod;
			if(!this.isContinousDisplay) {
				return;
			}
		} else if(this.text == "" && this.header == "") {
			return;
		}
		if(this.isContinousDisplay) {
			this.tooltipPosition = new common_Point(0,0);
			var _this_x = this.get_knownGUI().safeAreaLeft;
			var _this_y = this.get_knownGUI().safeAreaTop;
			var tmp = new PIXI.Point(_this_x,_this_y);
			this.stage.position = tmp;
			var tmp = this.game.state == null || this.game.state.get_publicGUI().window == null;
			this.stage.visible = tmp;
		} else {
			this.stage.visible = true;
			if(!this.game.mouse.isTouch) {
				this.tooltipPosition = this.game.mouse.position;
			}
			var _this = this.tooltipPosition;
			var tmp = new PIXI.Point(_this.x,_this.y);
			this.stage.position = tmp;
			this.stage.position.y += this.tooltipPosition.y > this.height ? -this.height : 21 / this.game.scaling | 0;
			if(this.stage.position.x + this.width > this.game.rect.width) {
				this.stage.position.x -= this.width;
				if(this.stage.position.x < 0) {
					this.stage.position.x = 0;
				}
			}
		}
		if(Config.isVerticalVideo) {
			this.stage.visible = false;
		}
	}
	,destroy: function() {
		var container = this.stage;
		var i = container.children.length - 1;
		while(i >= 0) {
			container.children[i].destroy();
			--i;
		}
	}
	,setText: function(owner,text,header,costInfo,extraDisplay,extraDisplay2,cost2,cost2Text) {
		if(cost2Text == null) {
			cost2Text = "";
		}
		if(header == null) {
			header = "";
		}
		this.contentsSetLastStep = true;
		if(this.owner != owner || this.game.mouse.pressed) {
			this.owner = owner;
			this.timeBeforeShown = this.get_tooltipDelay();
			if(this.game.mouse.isTouch) {
				this.tooltipPosition = this.game.mouse.position;
			}
		}
		if(this.timeBeforeShown > 0) {
			if(this.game.mouse.isTouch && !this.game.mouse.down) {
				this.owner = null;
				this.contentsSetLastStep = false;
			}
			return;
		}
		if(this.game.mouse.isTouch) {
			this.game.mouse.claimMouse(this);
		}
		if(this.isContinousDisplay && this.game.mouse.isTouch) {
			this.tooltipPosition = this.game.mouse.position;
		}
		this.isContinousDisplay = false;
		this.setTextDisplay(text,header,costInfo,extraDisplay,extraDisplay2,cost2,cost2Text);
	}
	,setTextForContinuous: function(text,header,costInfo,extraDisplay,extraDisplay2,cost2,cost2Text) {
		if(cost2Text == null) {
			cost2Text = "";
		}
		if(header == null) {
			header = "";
		}
		if(this.owner != null) {
			return;
		}
		this.contentsSetLastStep = true;
		this.isContinousDisplay = true;
		this.setTextDisplay(text,header,costInfo,extraDisplay,extraDisplay2,cost2,cost2Text);
		this.isContinousDisplay = true;
	}
	,setTextDisplay: function(text,header,costInfo,extraDisplay,extraDisplay2,cost2,cost2Text) {
		if(cost2Text == null) {
			cost2Text = "";
		}
		if(header == null) {
			header = "";
		}
		if(text == null) {
			text = "";
		}
		var addW = 6;
		var y = 0;
		var extraDisplayY = y;
		var headerWidth = 0;
		if(this.header == header && this.text == text && this.cost2Text == cost2Text && (costInfo == null && !this.tooltipCost.wouldChangeDisplay(this.emptyCost) || !this.tooltipCost.wouldChangeDisplay(costInfo)) && (cost2 == null && !this.tooltipCost2.wouldChangeDisplay(this.emptyCost) || !this.tooltipCost2.wouldChangeDisplay(cost2)) && (extraDisplay == null && !this.tooltipExtraIcons.wouldChangeDisplay([]) || !this.tooltipExtraIcons.wouldChangeDisplay(extraDisplay)) && (extraDisplay2 == null && !this.tooltipExtraIcons2.wouldChangeDisplay([]) || !this.tooltipExtraIcons2.wouldChangeDisplay(extraDisplay2))) {
			return;
		}
		var maxTooltipWidth = Math.max(this.game.rect.width / 2,Math.min(Math.max(this.tooltipPosition.x - 10,this.game.rect.width - this.tooltipPosition.x - 10),240));
		if(this.isContinousDisplay) {
			maxTooltipWidth = this.game.rect.width - this.get_knownGUI().safeAreaLeft - this.get_knownGUI().safeAreaRight;
		}
		this.header = header;
		this.text = text;
		this.costInfo = costInfo;
		if(extraDisplay != null && extraDisplay.length > 0) {
			this.tooltipExtraIcons.setDisplay(extraDisplay);
		}
		this.width = 0;
		if(this.isContinousDisplay && (this.header != "" || this.text != "")) {
			this.width = Math.ceil(maxTooltipWidth);
		}
		if(header != "") {
			extraDisplayY = y;
			--y;
			var val = maxTooltipWidth - this.tooltipExtraIcons.displayWidth - 10;
			var maxVal = this.isContinousDisplay ? 1000 : 350;
			this.tooltipHeader.set_maxWidth(val < 100 ? 100 : val > maxVal ? maxVal : val);
			this.tooltipHeader.set_text(header);
			headerWidth = Math.ceil(this.tooltipHeader.get_textWidth()) + addW;
			var val1 = this.width;
			this.width = headerWidth > val1 ? headerWidth : val1;
			y += Math.ceil(this.tooltipHeader.get_textHeight()) + 2;
		} else {
			this.tooltipHeader.set_text("");
		}
		if(text != "") {
			++y;
			var val = maxTooltipWidth - 10;
			var maxVal = this.isContinousDisplay ? 1000 : 350;
			this.tooltipText.set_maxWidth(val < 100 ? 100 : val > maxVal ? maxVal : val);
			this.tooltipText.set_text(text);
			this.tooltipText.position.y = y;
			var val1 = this.width;
			var val2 = Math.ceil(this.tooltipText.get_textWidth()) + addW;
			this.width = val2 > val1 ? val2 : val1;
			y += Math.ceil(this.tooltipText.get_textHeight());
		} else {
			this.tooltipText.set_text("");
		}
		if(extraDisplay2 != null && extraDisplay2.length > 0) {
			this.tooltipExtraIcons2.setDisplay(extraDisplay2);
			this.tooltipExtraIcons2.position.y = y + 1;
			var val1 = this.width;
			var val2 = Math.ceil(this.tooltipExtraIcons2.displayWidth) + addW;
			this.width = val2 > val1 ? val2 : val1;
			y += 12;
		} else {
			this.tooltipExtraIcons2.setDisplay([]);
		}
		if(costInfo != null && costInfo.any()) {
			y += 2;
			this.tooltipCost.position.y = y;
			this.tooltipCost.displayCityAmounts = this.game.isMobile && !this.game.isLargeMobile && this.isContinousDisplay;
			this.tooltipCost.maxDisplayWidth = this.game.rect.width;
			this.tooltipCost.setCost(costInfo);
			var val1 = this.width;
			var val2 = this.tooltipCost.displayWidth + addW - 6;
			this.width = val2 > val1 ? val2 : val1;
			y += 11;
		} else {
			this.tooltipCost.setCost(this.emptyCost);
		}
		if(cost2 != null && cost2.any()) {
			var xx = 3;
			this.tooltipCost2Text.set_text(cost2Text);
			this.tooltipCost2Text.position.y = y;
			if(cost2Text != "") {
				xx += Math.ceil(this.tooltipCost2Text.get_textWidth()) + 3;
			}
			y += 2;
			this.tooltipCost2.position.x = xx;
			this.tooltipCost2.position.y = y;
			this.tooltipCost2.maxDisplayWidth = this.game.rect.width - xx;
			this.tooltipCost2.setCost(cost2);
			var val1 = this.width;
			var val2 = this.tooltipCost2.displayWidth + addW - 6 + xx;
			this.width = val2 > val1 ? val2 : val1;
			y += 11;
		} else {
			this.tooltipCost2Text.set_text("");
			this.tooltipCost2.setCost(this.emptyCost2);
		}
		if(extraDisplay != null && extraDisplay.length > 0) {
			var val1 = this.width;
			var val2 = headerWidth + this.tooltipExtraIcons.displayWidth;
			this.width = val2 > val1 ? val2 : val1;
			this.tooltipExtraIcons.position.x = this.width - 1 - this.tooltipExtraIcons.displayWidth;
			this.tooltipExtraIcons.position.y = extraDisplayY + 3;
		} else {
			this.tooltipExtraIcons.setDisplay([]);
		}
		y += 2;
		this.height = y;
		this.bg.npWidth = this.width;
		this.bg.npHeight = this.height;
		this.bg.updateSprites();
	}
	,shown: function() {
		if(this.text == "") {
			return this.header != "";
		} else {
			return true;
		}
	}
	,__class__: gui_Tooltip
};
