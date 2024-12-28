var graphics_CullableContainer = $hxClasses["graphics.CullableContainer"] = function() {
	PIXI.Container.call(this);
};
graphics_CullableContainer.__name__ = "graphics.CullableContainer";
graphics_CullableContainer.__super__ = PIXI.Container;
graphics_CullableContainer.prototype = $extend(PIXI.Container.prototype,{
	preDraw: function(cullRectangle) {
		this.cull(cullRectangle);
	}
	,uncull: function() {
		var _g = 0;
		var _g1 = this.children;
		while(_g < _g1.length) {
			var child = _g1[_g];
			++_g;
			child.visible = true;
		}
	}
	,cull: function(cullRectangle) {
		var x2 = cullRectangle.get_x2();
		var y2 = cullRectangle.get_y2();
		var _g = 0;
		var _g1 = this.children;
		while(_g < _g1.length) {
			var child = _g1[_g];
			++_g;
			var childAsDynamic = child;
			if(childAsDynamic.width != null) {
				child.visible = child.x + childAsDynamic.width >= cullRectangle.x && child.y + childAsDynamic.height >= cullRectangle.y && child.x < x2 && child.y < y2;
			}
		}
	}
	,__class__: graphics_CullableContainer
});
