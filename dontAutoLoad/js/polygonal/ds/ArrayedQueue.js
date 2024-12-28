var polygonal_ds_ArrayedQueue = $hxClasses["polygonal.ds.ArrayedQueue"] = function(initialCapacity,source,fixed) {
	if(initialCapacity == null) {
		initialCapacity = 16;
	}
	this.mIterator = null;
	this.mFront = 0;
	this.mSize = 0;
	this.reuseIterator = false;
	this.growthRate = -2;
	this.mInitialCapacity = 1 > initialCapacity ? 1 : initialCapacity;
	this.capacity = this.mInitialCapacity;
	if(source != null) {
		this.mSize = source.length;
		var x = this.mSize;
		var y = this.capacity;
		this.capacity = x > y ? x : y;
	}
	this.mData = new Array(this.capacity);
	if(source != null) {
		var d = this.mData;
		var _g = 0;
		var _g1 = this.mSize;
		while(_g < _g1) {
			var i = _g++;
			d[i] = source[i];
		}
	}
	if(fixed) {
		this.growthRate = 0;
	}
};
polygonal_ds_ArrayedQueue.__name__ = "polygonal.ds.ArrayedQueue";
polygonal_ds_ArrayedQueue.__interfaces__ = [polygonal_ds_Queue];
polygonal_ds_ArrayedQueue.prototype = {
	clear: function(gc) {
		if(gc == null) {
			gc = false;
		}
		if(gc) {
			polygonal_ds_tools_NativeArrayTools.nullify(this.mData);
		}
		this.mFront = this.mSize = 0;
	}
	,iterator: function() {
		if(this.reuseIterator) {
			if(this.mIterator == null) {
				this.mIterator = new polygonal_ds_ArrayedQueueIterator(this);
			} else {
				this.mIterator.reset();
			}
			return this.mIterator;
		} else {
			return new polygonal_ds_ArrayedQueueIterator(this);
		}
	}
	,grow: function() {
		var t = this.capacity;
		this.capacity = polygonal_ds_tools_GrowthRate.compute(this.growthRate,this.capacity);
		this.resizeContainer(t,this.capacity);
	}
	,resizeContainer: function(oldSize,newSize) {
		var dst = new Array(newSize);
		if(oldSize < newSize) {
			if(this.mFront + this.mSize > oldSize) {
				var n1 = oldSize - this.mFront;
				var n2 = oldSize - n1;
				polygonal_ds_tools_NativeArrayTools.blit(this.mData,this.mFront,dst,0,n1);
				polygonal_ds_tools_NativeArrayTools.blit(this.mData,0,dst,n1,n2);
			} else {
				polygonal_ds_tools_NativeArrayTools.blit(this.mData,this.mFront,dst,0,this.mSize);
			}
		} else if(this.mFront + this.mSize > oldSize) {
			var n1 = oldSize - this.mFront;
			var n2 = this.mSize - this.mFront;
			polygonal_ds_tools_NativeArrayTools.blit(this.mData,this.mFront,dst,0,n1);
			polygonal_ds_tools_NativeArrayTools.blit(this.mData,0,dst,this.mFront,n2);
		} else {
			polygonal_ds_tools_NativeArrayTools.blit(this.mData,this.mFront,dst,0,this.mSize);
		}
		this.mData = dst;
		this.mFront = 0;
	}
	,__class__: polygonal_ds_ArrayedQueue
};
