var pooling_Int32ArrayPool = $hxClasses["pooling.Int32ArrayPool"] = function() { };
pooling_Int32ArrayPool.__name__ = "pooling.Int32ArrayPool";
pooling_Int32ArrayPool.returnToPool = function(arr) {
	if(arr.length < 20 && pooling_Int32ArrayPool.pool[arr.length].length < 10000) {
		pooling_Int32ArrayPool.pool[arr.length].push(arr);
	}
};
var pooling_PooledSprite = {};
pooling_PooledSprite.create = function(texture,stage) {
	if(pooling_PooledSprite.pool.h[stage.__id__] == null) {
		var v = [];
		pooling_PooledSprite.pool.set(stage,v);
	}
	var spr;
	if(pooling_PooledSprite.pool.h[stage.__id__].length == 0) {
		var this1 = new PIXI.Sprite();
		spr = this1;
		stage.addChild(spr);
	} else {
		spr = pooling_PooledSprite.pool.h[stage.__id__].pop();
	}
	spr.texture = texture;
	spr.visible = true;
	return spr;
};
