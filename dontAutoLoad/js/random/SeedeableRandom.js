var random_SeedeableRandom = $hxClasses["random.SeedeableRandom"] = function(seed) {
	var x = this.seed = seed == null ? Std.random(2147483647) : seed;
	var this1 = new haxe__$Int64__$_$_$Int64(x >> 31,x);
	this.state0 = this1;
	var this1 = new haxe__$Int64__$_$_$Int64(0,89432);
	this.state1 = this1;
};
random_SeedeableRandom.__name__ = "random.SeedeableRandom";
random_SeedeableRandom.prototype = {
	getInt64: function() {
		var s0 = this.state0;
		var s1 = this.state1;
		this.state0 = s1;
		var b = 23;
		b &= 63;
		var b1;
		if(b == 0) {
			var this1 = new haxe__$Int64__$_$_$Int64(s1.high,s1.low);
			b1 = this1;
		} else if(b < 32) {
			var this1 = new haxe__$Int64__$_$_$Int64(s1.high << b | s1.low >>> 32 - b,s1.low << b);
			b1 = this1;
		} else {
			var this1 = new haxe__$Int64__$_$_$Int64(s1.low << b - 32,0);
			b1 = this1;
		}
		var this1 = new haxe__$Int64__$_$_$Int64(s1.high ^ b1.high,s1.low ^ b1.low);
		s1 = this1;
		var b = 18;
		b &= 63;
		var b1;
		if(b == 0) {
			var this1 = new haxe__$Int64__$_$_$Int64(s1.high,s1.low);
			b1 = this1;
		} else if(b < 32) {
			var this1 = new haxe__$Int64__$_$_$Int64(s1.high >> b,s1.high << 32 - b | s1.low >>> b);
			b1 = this1;
		} else {
			var this1 = new haxe__$Int64__$_$_$Int64(s1.high >> 31,s1.high >> b - 32);
			b1 = this1;
		}
		var this1 = new haxe__$Int64__$_$_$Int64(s1.high ^ b1.high,s1.low ^ b1.low);
		s1 = this1;
		var this1 = new haxe__$Int64__$_$_$Int64(s1.high ^ s0.high,s1.low ^ s0.low);
		s1 = this1;
		var b = 5;
		b &= 63;
		var b1;
		if(b == 0) {
			var this1 = new haxe__$Int64__$_$_$Int64(s0.high,s0.low);
			b1 = this1;
		} else if(b < 32) {
			var this1 = new haxe__$Int64__$_$_$Int64(s0.high >> b,s0.high << 32 - b | s0.low >>> b);
			b1 = this1;
		} else {
			var this1 = new haxe__$Int64__$_$_$Int64(s0.high >> 31,s0.high >> b - 32);
			b1 = this1;
		}
		var this1 = new haxe__$Int64__$_$_$Int64(s1.high ^ b1.high,s1.low ^ b1.low);
		s1 = this1;
		this.state1 = s1;
		var a = this.state0;
		var b = this.state1;
		var high = a.high + b.high | 0;
		var low = a.low + b.low | 0;
		if(haxe_Int32.ucompare(low,a.low) < 0) {
			var ret = high++;
			high = high | 0;
		}
		var this1 = new haxe__$Int64__$_$_$Int64(high,low);
		return this1;
	}
	,getInt: function(val0,val1) {
		var min = 0;
		var max = 2147483647;
		if(val0 != null && val1 != null) {
			min = val0;
			max = val1;
		} else if(val0 != null) {
			max = val0;
		}
		var a = this.getInt64();
		var b = 1;
		b &= 63;
		var a1;
		if(b == 0) {
			var this1 = new haxe__$Int64__$_$_$Int64(a.high,a.low);
			a1 = this1;
		} else if(b < 32) {
			var this1 = new haxe__$Int64__$_$_$Int64(a.high >>> b,a.high << 32 - b | a.low >>> b);
			a1 = this1;
		} else {
			var this1 = new haxe__$Int64__$_$_$Int64(0,a.high >>> b - 32);
			a1 = this1;
		}
		var x = max - min;
		var this1 = new haxe__$Int64__$_$_$Int64(x >> 31,x);
		var x = haxe_Int64.divMod(a1,this1).modulus;
		if(x.high != x.low >> 31) {
			throw haxe_Exception.thrown("Overflow");
		}
		return min + x.low;
	}
	,getFloat: function(val0,val1) {
		var min = 0;
		var max = 1;
		if(val0 != null && val1 != null) {
			min = val0;
			max = val1;
		} else if(val0 != null) {
			max = val0;
		}
		var rndVal = this.getInt64();
		return Math.abs(rndVal.low / 2147483647) * (max - min) + min;
	}
	,__class__: random_SeedeableRandom
};
