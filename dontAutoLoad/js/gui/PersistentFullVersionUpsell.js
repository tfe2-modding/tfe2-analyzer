var gui_PersistentFullVersionUpsell = $hxClasses["gui.PersistentFullVersionUpsell"] = function(gui,stage) {
	this.padding = 5;
	this.gui = gui;
	this.stage = stage;
	this.create();
};
gui_PersistentFullVersionUpsell.__name__ = "gui.PersistentFullVersionUpsell";
gui_PersistentFullVersionUpsell.prototype = {
	create: function() {
		var game = this.gui.game;
		this.textures = Resources.getTextures("steam_badge_coolmath",3);
		this.sprite = new PIXI.Sprite(this.textures[0]);
		this.sprite.scale.set(1 / game.get_preDPIAdjustScaling(),1 / game.get_preDPIAdjustScaling());
		this.stage.addChild(this.sprite);
		this.sprite.position.set(game.rect.width - this.padding - this.sprite.width,this.padding);
	}
	,handleMouse: function(mouse) {
		var game = this.gui.game;
		if(mouse.get_x() >= game.rect.width - this.padding * game.get_preDPIAdjustScaling() - this.sprite.width && mouse.get_x() < game.rect.width - this.padding * game.get_preDPIAdjustScaling() && mouse.get_y() >= this.padding * game.get_preDPIAdjustScaling() && mouse.get_y() < this.padding * game.get_preDPIAdjustScaling() + this.sprite.height) {
			this.sprite.texture = mouse.down ? this.textures[2] : this.textures[1];
			game.setOnClickTo = function() {
				window.open("https://store.steampowered.com/app/1180130/The_Final_Earth_2/?utm_source=coolmathgames&utm_medium=web&utm_campaign=ingamepersistent","_blank");
			};
			return true;
		}
		this.sprite.texture = this.textures[0];
		return false;
	}
	,resize: function() {
		var game = this.gui.game;
		this.sprite.position.set(game.rect.width - 10 - this.sprite.width,10);
	}
	,__class__: gui_PersistentFullVersionUpsell
};
