var gui_HelpArrow = $hxClasses["gui.HelpArrow"] = function(gui,stage,getPointsTo,isActive,direction,onlyVisibleAfter) {
	if(onlyVisibleAfter == null) {
		onlyVisibleAfter = 0;
	}
	this.currentCloseButtonAnim = 0;
	this.headerTextElement = null;
	this.closeButton = null;
	this.pleaseAlignExtraTextRight = false;
	this.circleTme = Math.PI / 2;
	this.arrowTime = 0;
	this.gui = gui;
	this.getPointsTo = getPointsTo;
	this.stage = stage;
	this.isActive = isActive;
	this.direction = direction == null ? gui_HelpArrowDirection.Down : direction;
	this.onlyVisibleAfter = onlyVisibleAfter;
	switch(this.direction._hx_index) {
	case 0:
		this.sprite = new PIXI.Sprite(Resources.getTexture("spr_tutorialarrowdown"));
		this.sprite.anchor.set(0.5,1);
		break;
	case 1:
		this.sprite = new PIXI.Sprite(Resources.getTexture("spr_tutorialarrowleft"));
		this.sprite.anchor.set(0,0.5);
		break;
	case 2:
		this.sprite = new PIXI.Sprite(Resources.getTexture("spr_hintinfo_arrow"));
		this.sprite.anchor.set(0.5,1);
		break;
	case 3:
		this.sprite = new PIXI.Sprite(Resources.getTexture("spr_hintinfo_arrow"));
		this.sprite.anchor.set(0.5,1);
		this.sprite.scale.set(1,-1);
		break;
	}
	stage.addChild(this.sprite);
	this.extraText9P = null;
	this.extraText = "";
	this.extraTextElement = null;
	this.setPosition();
};
gui_HelpArrow.__name__ = "gui.HelpArrow";
gui_HelpArrow.prototype = {
	handleMouse: function(mouse) {
		if(this.closeButton != null && this.closeButton.visible) {
			if(mouse.position.x > this.closeButton.position.x && mouse.position.y > this.closeButton.position.y && mouse.position.x < this.closeButton.position.x + this.closeButton.width && mouse.position.y < this.closeButton.position.y + this.closeButton.height) {
				var claim = mouse.claimMouse(this,null,true);
				this.currentCloseButtonAnim = 1;
				if(claim == MouseState.Confirmed) {
					if(Audio.get().buttonSound != null) {
						Audio.get().playSound(Audio.get().buttonSound);
					}
					this.gui.clearTutorial();
				} else if(claim == MouseState.Active) {
					this.currentCloseButtonAnim = 2;
				}
				return true;
			}
			if(mouse.position.x > this.extraText9P.position.x && mouse.position.y > this.extraText9P.position.y && mouse.position.x < this.extraText9P.position.x + this.extraText9P.width && mouse.position.y < this.extraText9P.position.y + this.extraText9P.height) {
				return true;
			}
		}
		return false;
	}
	,addHeaderAndCloseButton: function(headerText) {
		this.hasCloseButton = true;
		this.closeButtonTextures = Resources.getTextures("spr_button_windowheader",3);
		this.closeButton = new PIXI.Sprite(this.closeButtonTextures[0]);
		this.stage.addChild(this.closeButton);
		var closeButtonIcon = new PIXI.Sprite(Resources.getTexture("spr_icon_close"));
		closeButtonIcon.position.set(1,1);
		this.closeButton.addChild(closeButtonIcon);
		this.headerText = headerText;
		this.headerTextElement = new graphics_BitmapText(headerText,{ font : "Arial16", tint : 0});
		this.stage.addChild(this.headerTextElement);
		if(this.extraText9P != null) {
			var hh = this.getExtraTextHeight();
			this.extraText9P.npHeight = hh;
			this.extraText9P.updateSprites();
		}
		this.setPosition();
		this.setExtraTextPosition();
	}
	,useBigMovement: function() {
		this.useCircle = true;
		this.setPosition();
	}
	,addText: function(text) {
		if(this.extraTextElement != null) {
			this.extraText = text;
			this.extraTextElement.set_text(text);
			this.setExtraTextPosition();
			return;
		}
		this.extraText = text;
		this.extraTextElement = new graphics_BitmapText(text,{ font : "Arial", tint : 0});
		if(text.length < 45) {
			this.extraTextElement.set_maxWidth(133);
		} else {
			this.extraTextElement.set_maxWidth(200);
		}
		var hh = this.getExtraTextHeight();
		this.extraText9P = new gui_NinePatch(Resources.getTexture("spr_9p_hintinfo"),5,(this.extraTextElement.width | 0) + 6,hh);
		this.stage.addChild(this.extraText9P);
		this.stage.addChild(this.extraTextElement);
		this.setExtraTextPosition();
	}
	,getExtraTextHeight: function() {
		var hh = 0;
		if(this.extraTextElement != null) {
			hh += (this.extraTextElement.height | 0) + 6;
		}
		if(this.headerTextElement != null) {
			hh += (this.headerTextElement.height | 0) + 6;
		}
		return hh;
	}
	,update: function(timeMod) {
		var pointsTo;
		var tmp;
		if(this.isActive() && this.arrowTime >= this.onlyVisibleAfter) {
			pointsTo = this.getPointsTo();
			tmp = pointsTo != null;
		} else {
			tmp = false;
		}
		if(tmp && this.useCircle && this.circleTme > 0) {
			this.circleTme -= 0.015 * timeMod + 0.04 * timeMod * (this.circleTme / (Math.PI / 2));
		}
		this.arrowTime += timeMod;
		this.setPosition();
		this.setExtraTextPosition();
		if(this.closeButton != null) {
			this.closeButton.texture = this.closeButtonTextures[this.currentCloseButtonAnim];
			this.currentCloseButtonAnim = 0;
		}
	}
	,destroy: function() {
		this.sprite.destroy();
		if(this.extraText9P != null) {
			this.extraText9P.destroy();
		}
		if(this.extraTextElement != null) {
			this.extraTextElement.destroy();
		}
		if(this.headerTextElement != null) {
			this.headerTextElement.destroy();
		}
		if(this.closeButton != null) {
			this.closeButton.destroy();
		}
	}
	,setPosition: function() {
		var pointsTo;
		var tmp;
		if(this.isActive() && this.arrowTime >= this.onlyVisibleAfter) {
			pointsTo = this.getPointsTo();
			tmp = pointsTo != null;
		} else {
			tmp = false;
		}
		if(tmp && this.sprite != null && this.sprite.texture != null) {
			switch(this.direction._hx_index) {
			case 0:
				this.sprite.position.set(pointsTo.rect.get_center().x,pointsTo.rect.y - 2 - Math.sin(this.arrowTime / 10) * 2);
				break;
			case 1:
				this.sprite.position.set(pointsTo.rect.get_x2() + 2 + Math.sin(this.arrowTime / 10) * 2,pointsTo.rect.get_center().y);
				break;
			case 2:
				if(this.pleaseAlignExtraTextRight) {
					this.sprite.position.set(this.gui.game.rect.width - 5 - this.sprite.width - this.gui.safeAreaRight,pointsTo.rect.y - 2);
				} else {
					this.sprite.position.set(pointsTo.rect.get_center().x,pointsTo.rect.y - 2);
				}
				break;
			case 3:
				if(this.pleaseAlignExtraTextRight) {
					this.sprite.position.set(this.gui.game.rect.width - 5 - this.sprite.width - this.gui.safeAreaRight,pointsTo.rect.get_y2());
				} else {
					this.sprite.position.set(pointsTo.rect.get_center().x,pointsTo.rect.get_y2());
				}
				break;
			}
			if(this.useCircle && this.circleTme > 0) {
				if(this.sprite.position.x < this.gui.game.rect.width / 2) {
					this.sprite.rotation = this.circleTme;
				} else {
					this.sprite.rotation = -this.circleTme;
				}
				this.sprite.position.set(Math.cos(this.circleTme) * (this.sprite.position.x - this.gui.game.rect.width / 2) + this.gui.game.rect.width / 2,Math.sin(this.circleTme) * (this.gui.game.rect.height / 2 - this.sprite.position.y) + this.sprite.position.y);
				this.sprite.alpha = Math.cos(this.circleTme);
			} else {
				this.sprite.rotation = 0;
				this.sprite.alpha = 1;
			}
			this.sprite.visible = true;
		} else {
			this.sprite.visible = false;
		}
	}
	,setExtraTextPosition: function() {
		if(this.extraText9P == null) {
			return;
		}
		var pointsTo;
		var tmp;
		if(this.isActive() && this.arrowTime >= this.onlyVisibleAfter) {
			pointsTo = this.getPointsTo();
			tmp = pointsTo != null;
		} else {
			tmp = false;
		}
		if(tmp) {
			switch(this.direction._hx_index) {
			case 0:
				if(pointsTo.rect.get_center().x > this.extraText9P.width + 5 + Math.floor(this.sprite.width / 2)) {
					this.extraText9P.position.set(pointsTo.rect.get_center().x - Math.floor(this.sprite.width / 2) - 2 - this.extraText9P.width,pointsTo.rect.y - 2 - this.extraText9P.height);
				} else {
					this.extraText9P.position.set(pointsTo.rect.get_center().x + Math.floor(this.sprite.width / 2) + 2,pointsTo.rect.y - 2 - this.extraText9P.height);
				}
				break;
			case 1:
				if(pointsTo.rect.get_x2() + this.extraText9P.width > this.gui.game.rect.width) {
					this.extraText9P.position.set(this.gui.game.rect.width - this.extraText9P.width - 5,pointsTo.rect.get_center().y - 2 - Math.floor(this.sprite.height / 2) - this.extraText9P.height);
				} else {
					this.extraText9P.position.set(pointsTo.rect.get_x2(),pointsTo.rect.get_center().y - 2 - Math.floor(this.sprite.height / 2) - this.extraText9P.height);
				}
				break;
			case 2:
				if(this.pleaseAlignExtraTextRight) {
					this.extraText9P.position.set(this.gui.game.rect.width - 5 - this.extraText9P.width,pointsTo.rect.y - 2 - this.sprite.height - this.extraText9P.height);
				} else if(pointsTo.rect.get_center().x > this.extraText9P.width + 5 + Math.floor(this.sprite.width / 2)) {
					this.extraText9P.position.set(pointsTo.rect.get_center().x - this.extraText9P.width + Math.floor(this.sprite.width / 2),pointsTo.rect.y - 2 - this.sprite.height - this.extraText9P.height);
				} else if(pointsTo.rect.get_center().x - this.sprite.width + this.extraText9P.width < this.gui.game.rect.width) {
					this.extraText9P.position.set(pointsTo.rect.get_center().x - Math.floor(this.sprite.width / 2),pointsTo.rect.y - 2 - this.sprite.height - this.extraText9P.height);
				} else {
					this.extraText9P.position.set(5,pointsTo.rect.y - 2 - this.sprite.height - this.extraText9P.height);
				}
				break;
			case 3:
				if(this.pleaseAlignExtraTextRight) {
					this.extraText9P.position.set(this.gui.game.rect.width - 5 - this.extraText9P.width,pointsTo.rect.get_y2() + this.sprite.height);
				} else if(pointsTo.rect.get_center().x > this.extraText9P.width + 5 + Math.floor(this.sprite.width / 2)) {
					this.extraText9P.position.set(pointsTo.rect.get_center().x - this.extraText9P.width + Math.floor(this.sprite.width / 2),pointsTo.rect.get_y2() + this.sprite.height);
				} else if(pointsTo.rect.get_center().x - this.sprite.width + this.extraText9P.width < this.gui.game.rect.width) {
					this.extraText9P.position.set(pointsTo.rect.get_center().x - Math.floor(this.sprite.width / 2),pointsTo.rect.get_y2() + this.sprite.height);
				} else {
					this.extraText9P.position.set(5,pointsTo.rect.get_y2() + this.sprite.height);
				}
				break;
			}
			if(this.headerTextElement != null) {
				this.headerTextElement.position.set(this.extraText9P.position.x + 3,this.extraText9P.position.y + 1);
				this.extraTextElement.position.set(this.extraText9P.position.x + 3,this.extraText9P.position.y + 5 + this.headerTextElement.height);
				if(this.closeButton != null) {
					this.closeButton.position.set(this.extraText9P.position.x + this.extraText9P.width - this.closeButton.width,this.extraText9P.position.y);
				}
				this.headerTextElement.visible = true;
				this.closeButton.visible = true;
			} else {
				this.extraTextElement.position.set(this.extraText9P.position.x + 3,this.extraText9P.position.y + 2);
			}
			this.extraTextElement.visible = true;
			this.extraText9P.visible = true;
		} else {
			this.extraText9P.visible = false;
			this.extraTextElement.visible = false;
			if(this.headerTextElement != null) {
				this.headerTextElement.visible = false;
				this.closeButton.visible = false;
			}
		}
	}
	,__class__: gui_HelpArrow
};
