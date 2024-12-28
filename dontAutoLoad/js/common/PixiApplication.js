var common_PixiApplication = $hxClasses["common.PixiApplication"] = function() {
	this._animationFrameId = null;
	this.pixelRatio = 1;
	this.autoResize = true;
	this.transparent = false;
	this.antialias = false;
	this.forceFXAA = false;
	this.roundPixels = false;
	this.clearBeforeRender = true;
	this.preserveDrawingBuffer = false;
	this.backgroundColor = 16777215;
	this.width = Math.max(window.innerWidth * this.pixelRatio,3 * this.pixelRatio);
	this.height = Math.max(window.innerHeight * this.pixelRatio,3 * this.pixelRatio);
	this.position = "static";
};
common_PixiApplication.__name__ = "common.PixiApplication";
common_PixiApplication.prototype = {
	start: function(rendererType,parentDom,canvasElement) {
		if(rendererType == null) {
			rendererType = "auto";
		}
		if(canvasElement == null) {
			this.canvas = window.document.createElement("canvas");
			var tmp = Std.string(window.innerWidth);
			this.canvas.style.width = tmp + "px";
			var tmp = Std.string(window.innerHeight);
			this.canvas.style.height = tmp + "px";
			this.canvas.style.position = this.position;
		} else {
			this.canvas = canvasElement;
		}
		window.onresize = $bind(this,this._onWindowResize);
		var renderingOptions = { };
		renderingOptions.width = this.width;
		renderingOptions.height = this.height;
		renderingOptions.view = this.canvas;
		renderingOptions.backgroundColor = this.backgroundColor;
		renderingOptions.resolution = 1;
		renderingOptions.antialias = this.antialias;
		renderingOptions.forceFXAA = this.forceFXAA;
		renderingOptions.autoResize = this.autoResize;
		renderingOptions.clearBeforeRender = this.clearBeforeRender;
		renderingOptions.preserveDrawingBuffer = this.preserveDrawingBuffer;
		renderingOptions.roundPixels = this.roundPixels;
		renderingOptions.powerPreference = "high-performance";
		renderingOptions.legacy = this.useLegacyRenderer;
		if(rendererType == null) {
			this.app = new PIXI.Application(renderingOptions);
		} else if(rendererType == "canvas") {
			renderingOptions.noWebGL = true;
			renderingOptions.forceCanvas = true;
			this.app = new PIXI.Application(renderingOptions);
		} else {
			this.app = new PIXI.Application(renderingOptions);
		}
		this.stage = this.app.stage;
		this.renderer = this.app.renderer;
		if(parentDom == null) {
			window.document.body.appendChild(this.app.view);
		} else {
			parentDom.appendChild(this.app.view);
		}
		this.app.ticker.add($bind(this,this._onRequestAnimationFrame));
	}
	,addPostDraw: function(postDraw) {
		($_=this.app.ticker,$bind($_,$_.add))(postDraw,null,-100);
	}
	,_onWindowResize: function(event) {
		var iw = window.innerWidth;
		var ih = window.innerHeight;
		this.width = Math.max(iw * this.pixelRatio,3 * this.pixelRatio);
		this.height = Math.max(ih * this.pixelRatio,3 * this.pixelRatio);
		this.app.renderer.resize(this.width,this.height);
		this.canvas.style.width = iw + "px";
		this.canvas.style.height = ih + "px";
		if(jsFunctions.isAnyApple()) {
			window.scrollTo(0,0);
		}
		if(this.onResize != null) {
			this.onResize();
		}
	}
	,_onRequestAnimationFrame: function() {
		if(this.onUpdate != null) {
			this.onUpdate(this.app.ticker.deltaTime);
		}
	}
	,__class__: common_PixiApplication
};
