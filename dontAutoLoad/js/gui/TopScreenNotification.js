var gui_TopScreenNotification = $hxClasses["gui.TopScreenNotification"] = function(game,gui,outerStage,header,text,displayTime) {
	if(displayTime == null) {
		displayTime = 600;
	}
	this.fadeout = 1;
	this.game = game;
	this.gui = gui;
	this.stage = new PIXI.Container();
	this.outerStage = outerStage;
	this.outerStage.addChild(this.stage);
	this.bg = new gui_NinePatch(Resources.getTexture("spr_9p_tooltip"),2,4,4);
	this.bg.position.set(0,0);
	this.stage.addChild(this.bg);
	this.tooltipHeader = new graphics_BitmapText("",{ font : "Arial16", tint : 0});
	this.tooltipHeader.position.set(2,0);
	this.stage.addChild(this.tooltipHeader);
	this.tooltipText = new graphics_BitmapText("",{ font : "Arial", tint : 0});
	this.tooltipText.position.set(3,0);
	this.stage.addChild(this.tooltipText);
	this.tooltipPosition = new common_Point(0,0);
	this.stage.position.set(0,0);
	this.setTextDisplay(header,text);
	this.displayTime = displayTime;
};
gui_TopScreenNotification.__name__ = "gui.TopScreenNotification";
gui_TopScreenNotification.prototype = {
	update: function(timeMod) {
		if(this.displayTime < 0) {
			this.fadeout -= 0.05 * timeMod;
			this.stage.alpha = this.fadeout;
			if(this.fadeout < 0) {
				this.stage.destroy();
				HxOverrides.remove(this.gui.notifications,this);
			}
			return;
		}
		this.displayTime -= timeMod;
	}
	,setTextDisplay: function(text,header) {
		if(header == null) {
			header = "";
		}
		if(text == null) {
			text = "";
		}
		var addW = 6;
		var y = 0;
		var headerWidth = 0;
		if(this.header == header && this.text == text) {
			return;
		}
		var maxTooltipWidth = this.game.rect.width;
		this.header = header;
		this.text = text;
		this.width = 0;
		if(this.header != "" || this.text != "") {
			this.width = Math.ceil(maxTooltipWidth);
		}
		if(header != "") {
			--y;
			var val = maxTooltipWidth - 10;
			this.tooltipHeader.set_maxWidth(val < 100 ? 100 : val > 1000 ? 1000 : val);
			this.tooltipHeader.set_text(header);
			headerWidth = Math.ceil(this.tooltipHeader.get_textWidth()) + addW;
			y += Math.ceil(this.tooltipHeader.get_textHeight()) + 2;
		} else {
			this.tooltipHeader.set_text("");
		}
		if(text != "") {
			++y;
			var val = maxTooltipWidth - 10;
			this.tooltipText.set_maxWidth(val < 100 ? 100 : val > 1000 ? 1000 : val);
			this.tooltipText.set_text(text);
			this.tooltipText.position.y = y;
			y += Math.ceil(this.tooltipText.get_textHeight());
		} else {
			this.tooltipText.set_text("");
		}
		y += 2;
		this.height = y;
		this.bg.npWidth = this.width;
		this.bg.npHeight = this.height;
		this.bg.updateSprites();
	}
	,__class__: gui_TopScreenNotification
};
