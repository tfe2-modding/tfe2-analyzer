var polygonal_ds_PriorityQueue = $hxClasses["polygonal.ds.PriorityQueue"] = function(initalCapacity,inverse,source) {
	if(inverse == null) {
		inverse = false;
	}
	if(initalCapacity == null) {
		initalCapacity = 1;
	}
	this.mSize = 0;
	this.growthRate = -2;
	this.mInitialCapacity = 1 > initalCapacity ? 1 : initalCapacity;
	this.capacity = initalCapacity;
	this.mInverse = inverse;
	if(source != null) {
		this.mSize = source.length;
		var x = this.mSize;
		var y = this.capacity;
		this.capacity = x > y ? x : y;
	}
	this.mData = new Array(this.capacity + 1);
	this.mData[0] = null;
	if(source != null) {
		var d = this.mData;
		var _g = 1;
		var _g1 = this.mSize + 1;
		while(_g < _g1) {
			var i = _g++;
			d[i] = source[i - 1];
		}
		this.repair();
	}
};
polygonal_ds_PriorityQueue.__name__ = "polygonal.ds.PriorityQueue";
polygonal_ds_PriorityQueue.__interfaces__ = [polygonal_ds_Queue];
polygonal_ds_PriorityQueue.prototype = {
	enqueue: function(val) {
		if(this.mSize == this.capacity) {
			this.grow();
		}
		this.mData[++this.mSize] = val;
		val.position = this.mSize;
		var index = this.mSize;
		var d = this.mData;
		var parent = index >> 1;
		var t = d[index];
		var p = t.priority;
		if(this.mInverse) {
			while(parent > 0) {
				var parentVal = d[parent];
				if(p - parentVal.priority < 0) {
					d[index] = parentVal;
					parentVal.position = index;
					index = parent;
					parent >>= 1;
				} else {
					break;
				}
			}
		} else {
			while(parent > 0) {
				var parentVal = d[parent];
				if(p - parentVal.priority > 0) {
					d[index] = parentVal;
					parentVal.position = index;
					index = parent;
					parent >>= 1;
				} else {
					break;
				}
			}
		}
		d[index] = t;
		t.position = index;
	}
	,dequeue: function() {
		var d = this.mData;
		var x = d[1];
		x.position = -1;
		d[1] = d[this.mSize];
		var index = 1;
		var d = this.mData;
		var child = index << 1;
		var childVal;
		var t = d[index];
		var p = t.priority;
		if(this.mInverse) {
			while(child < this.mSize) {
				if(child < this.mSize - 1) {
					if(d[child].priority - d[child + 1].priority > 0) {
						++child;
					}
				}
				childVal = d[child];
				if(p - childVal.priority > 0) {
					d[index] = childVal;
					childVal.position = index;
					t.position = child;
					index = child;
					child <<= 1;
				} else {
					break;
				}
			}
		} else {
			while(child < this.mSize) {
				if(child < this.mSize - 1) {
					if(d[child].priority - d[child + 1].priority < 0) {
						++child;
					}
				}
				childVal = d[child];
				if(p - childVal.priority < 0) {
					d[index] = childVal;
					childVal.position = index;
					t.position = child;
					index = child;
					child <<= 1;
				} else {
					break;
				}
			}
		}
		d[index] = t;
		t.position = index;
		this.mSize--;
		return x;
	}
	,reprioritize: function(val,priority) {
		var oldPriority = val.priority;
		if(oldPriority == priority) {
			return this;
		}
		val.priority = priority;
		var pos = val.position;
		if(this.mInverse) {
			if(priority < oldPriority) {
				var index = pos;
				var d = this.mData;
				var parent = index >> 1;
				var t = d[index];
				var p = t.priority;
				if(this.mInverse) {
					while(parent > 0) {
						var parentVal = d[parent];
						if(p - parentVal.priority < 0) {
							d[index] = parentVal;
							parentVal.position = index;
							index = parent;
							parent >>= 1;
						} else {
							break;
						}
					}
				} else {
					while(parent > 0) {
						var parentVal = d[parent];
						if(p - parentVal.priority > 0) {
							d[index] = parentVal;
							parentVal.position = index;
							index = parent;
							parent >>= 1;
						} else {
							break;
						}
					}
				}
				d[index] = t;
				t.position = index;
			} else {
				var index = pos;
				var d = this.mData;
				var child = index << 1;
				var childVal;
				var t = d[index];
				var p = t.priority;
				if(this.mInverse) {
					while(child < this.mSize) {
						if(child < this.mSize - 1) {
							if(d[child].priority - d[child + 1].priority > 0) {
								++child;
							}
						}
						childVal = d[child];
						if(p - childVal.priority > 0) {
							d[index] = childVal;
							childVal.position = index;
							t.position = child;
							index = child;
							child <<= 1;
						} else {
							break;
						}
					}
				} else {
					while(child < this.mSize) {
						if(child < this.mSize - 1) {
							if(d[child].priority - d[child + 1].priority < 0) {
								++child;
							}
						}
						childVal = d[child];
						if(p - childVal.priority < 0) {
							d[index] = childVal;
							childVal.position = index;
							t.position = child;
							index = child;
							child <<= 1;
						} else {
							break;
						}
					}
				}
				d[index] = t;
				t.position = index;
				var index = this.mSize;
				var d = this.mData;
				var parent = index >> 1;
				var t = d[index];
				var p = t.priority;
				if(this.mInverse) {
					while(parent > 0) {
						var parentVal = d[parent];
						if(p - parentVal.priority < 0) {
							d[index] = parentVal;
							parentVal.position = index;
							index = parent;
							parent >>= 1;
						} else {
							break;
						}
					}
				} else {
					while(parent > 0) {
						var parentVal = d[parent];
						if(p - parentVal.priority > 0) {
							d[index] = parentVal;
							parentVal.position = index;
							index = parent;
							parent >>= 1;
						} else {
							break;
						}
					}
				}
				d[index] = t;
				t.position = index;
			}
		} else if(priority > oldPriority) {
			var index = pos;
			var d = this.mData;
			var parent = index >> 1;
			var t = d[index];
			var p = t.priority;
			if(this.mInverse) {
				while(parent > 0) {
					var parentVal = d[parent];
					if(p - parentVal.priority < 0) {
						d[index] = parentVal;
						parentVal.position = index;
						index = parent;
						parent >>= 1;
					} else {
						break;
					}
				}
			} else {
				while(parent > 0) {
					var parentVal = d[parent];
					if(p - parentVal.priority > 0) {
						d[index] = parentVal;
						parentVal.position = index;
						index = parent;
						parent >>= 1;
					} else {
						break;
					}
				}
			}
			d[index] = t;
			t.position = index;
		} else {
			var index = pos;
			var d = this.mData;
			var child = index << 1;
			var childVal;
			var t = d[index];
			var p = t.priority;
			if(this.mInverse) {
				while(child < this.mSize) {
					if(child < this.mSize - 1) {
						if(d[child].priority - d[child + 1].priority > 0) {
							++child;
						}
					}
					childVal = d[child];
					if(p - childVal.priority > 0) {
						d[index] = childVal;
						childVal.position = index;
						t.position = child;
						index = child;
						child <<= 1;
					} else {
						break;
					}
				}
			} else {
				while(child < this.mSize) {
					if(child < this.mSize - 1) {
						if(d[child].priority - d[child + 1].priority < 0) {
							++child;
						}
					}
					childVal = d[child];
					if(p - childVal.priority < 0) {
						d[index] = childVal;
						childVal.position = index;
						t.position = child;
						index = child;
						child <<= 1;
					} else {
						break;
					}
				}
			}
			d[index] = t;
			t.position = index;
			var index = this.mSize;
			var d = this.mData;
			var parent = index >> 1;
			var t = d[index];
			var p = t.priority;
			if(this.mInverse) {
				while(parent > 0) {
					var parentVal = d[parent];
					if(p - parentVal.priority < 0) {
						d[index] = parentVal;
						parentVal.position = index;
						index = parent;
						parent >>= 1;
					} else {
						break;
					}
				}
			} else {
				while(parent > 0) {
					var parentVal = d[parent];
					if(p - parentVal.priority > 0) {
						d[index] = parentVal;
						parentVal.position = index;
						index = parent;
						parent >>= 1;
					} else {
						break;
					}
				}
			}
			d[index] = t;
			t.position = index;
		}
		return this;
	}
	,repair: function() {
		var i = this.mSize >> 1;
		while(i >= 1) {
			this.heapify(i,this.mSize);
			--i;
		}
	}
	,heapify: function(p,s) {
		var d = this.mData;
		var l = p << 1;
		var r = l + 1;
		var max = p;
		if(this.mInverse) {
			if(l <= s && d[l].priority - d[max].priority < 0) {
				max = l;
			}
			if(l + 1 <= s && d[l + 1].priority - d[max].priority < 0) {
				max = r;
			}
		} else {
			if(l <= s && d[l].priority - d[max].priority > 0) {
				max = l;
			}
			if(l + 1 <= s && d[l + 1].priority - d[max].priority > 0) {
				max = r;
			}
		}
		var a;
		var b;
		var t;
		if(max != p) {
			a = d[max];
			b = d[p];
			d[max] = b;
			d[p] = a;
			t = a.position;
			a.position = b.position;
			b.position = t;
			this.heapify(max,s);
		}
	}
	,grow: function() {
		this.capacity = polygonal_ds_tools_GrowthRate.compute(this.growthRate,this.capacity);
		this.resizeContainer(this.capacity);
	}
	,resizeContainer: function(newSize) {
		var t = new Array(newSize + 1);
		polygonal_ds_tools_NativeArrayTools.blit(this.mData,0,t,0,this.mSize + 1);
		this.mData = t;
	}
	,__class__: polygonal_ds_PriorityQueue
};
