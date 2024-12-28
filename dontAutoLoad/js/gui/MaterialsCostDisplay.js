var gui_MaterialsCostDisplay = $hxClasses["gui.MaterialsCostDisplay"] = function(city,cost,beforeKnowledgeText) {
	if(beforeKnowledgeText == null) {
		beforeKnowledgeText = "";
	}
	this.afterKnowledgeText = " " + common_Localize.lo("to_research");
	this.maxDisplayWidth = -1;
	this.displayCityAmounts = false;
	PIXI.Container.call(this);
	this.city = city;
	this.materialDisplayedRed = new haxe_ds_StringMap();
	this.materialDisplayedRed.h["food"] = false;
	this.materialDisplayedRed.h["wood"] = false;
	this.materialDisplayedRed.h["stone"] = false;
	this.materialDisplayedRed.h["machineParts"] = false;
	this.materialDisplayedRed.h["refinedMetal"] = false;
	this.materialDisplayedRed.h["computerChips"] = false;
	this.materialDisplayedRed.h["cacao"] = false;
	this.materialDisplayedRed.h["chocolate"] = false;
	this.materialDisplayedRed.h["graphene"] = false;
	this.materialDisplayedRed.h["rocketFuel"] = false;
	var _g = 0;
	var _g1 = MaterialsHelper.modMaterials;
	while(_g < _g1.length) {
		var modMaterial = _g1[_g];
		++_g;
		var currentMaterial = modMaterial.variableName;
		this.materialDisplayedRed.h[currentMaterial] = false;
	}
	this.materialDisplayedRed.h["knowledge"] = false;
	this.beforeKnowledgeText = beforeKnowledgeText;
	this.cost = cost;
	this.cityAmountDisplayed = null;
	this.updateCostDisplay();
};
gui_MaterialsCostDisplay.__name__ = "gui.MaterialsCostDisplay";
gui_MaterialsCostDisplay.__super__ = PIXI.Container;
gui_MaterialsCostDisplay.prototype = $extend(PIXI.Container.prototype,{
	setAfterKnowledgeText: function(newText) {
		this.afterKnowledgeText = newText;
	}
	,setBeforeKnowledgeText: function(value) {
		this.beforeKnowledgeText = value;
	}
	,setCost: function(cost) {
		this.cost = cost;
		this.updateCostDisplay();
	}
	,updateCostDisplay: function() {
		var _gthis = this;
		var hasMaximumDisplayWidthFailed = false;
		var shouldUpdateCostDisplayAgain = true;
		while(shouldUpdateCostDisplayAgain) {
			shouldUpdateCostDisplayAgain = false;
			var i = this.children.length;
			while(--i >= 0) {
				var child = this.children[i];
				this.removeChildAt(i);
				child.destroy({ children : true});
			}
			var xx = [0];
			var shownBeforeKnowledgeText = false;
			var anyMaterialShownBefore = false;
			if(this.cost.food > 0) {
				xx[0] -= 2;
				anyMaterialShownBefore = true;
				var spr = new PIXI.Sprite(Resources.getTexture("spr_resource_" + "food".toLowerCase()));
				spr.position.x = xx[0];
				this.addChild(spr);
				xx[0] += (spr.width | 0) + 1;
				xx[0] -= 2;
				var extraText = "";
				var extraText1 = "";
				if(this.displayCityAmounts && !hasMaximumDisplayWidthFailed && !this.city.progress.sandbox.unlimitedResources) {
					extraText1 = common_MathExtensions.largeNumberFormat(Math,this.city.materials.food | 0) + "/";
				}
				var tooLittleOfMaterial = this.city != null && this.city.materials.food < this.cost.food;
				var bitmapText = new graphics_BitmapText(extraText1 + this.cost.food + extraText,{ font : "Arial", tint : this.city != null && tooLittleOfMaterial ? 16711680 : 0});
				this.materialDisplayedRed.h["food"] = tooLittleOfMaterial;
				bitmapText.position.set(xx[0],-1);
				this.addChild(bitmapText);
				xx[0] += (bitmapText.get_textWidth() | 0) + 3;
			} else {
				this.materialDisplayedRed.h["food"] = false;
			}
			if(this.cost.wood > 0) {
				anyMaterialShownBefore = true;
				var spr1 = new PIXI.Sprite(Resources.getTexture("spr_resource_" + "wood".toLowerCase()));
				spr1.position.x = xx[0];
				this.addChild(spr1);
				xx[0] += (spr1.width | 0) + 1;
				var extraText2 = "";
				var extraText11 = "";
				if(this.displayCityAmounts && !hasMaximumDisplayWidthFailed && !this.city.progress.sandbox.unlimitedResources) {
					extraText11 = common_MathExtensions.largeNumberFormat(Math,this.city.materials.wood | 0) + "/";
				}
				var tooLittleOfMaterial1 = this.city != null && this.city.materials.wood < this.cost.wood;
				var bitmapText1 = new graphics_BitmapText(extraText11 + this.cost.wood + extraText2,{ font : "Arial", tint : this.city != null && tooLittleOfMaterial1 ? 16711680 : 0});
				this.materialDisplayedRed.h["wood"] = tooLittleOfMaterial1;
				bitmapText1.position.set(xx[0],-1);
				this.addChild(bitmapText1);
				xx[0] += (bitmapText1.get_textWidth() | 0) + 3;
			} else {
				this.materialDisplayedRed.h["wood"] = false;
			}
			if(this.cost.stone > 0) {
				anyMaterialShownBefore = true;
				var spr2 = new PIXI.Sprite(Resources.getTexture("spr_resource_" + "stone".toLowerCase()));
				spr2.position.x = xx[0];
				this.addChild(spr2);
				xx[0] += (spr2.width | 0) + 1;
				var extraText3 = "";
				var extraText12 = "";
				if(this.displayCityAmounts && !hasMaximumDisplayWidthFailed && !this.city.progress.sandbox.unlimitedResources) {
					extraText12 = common_MathExtensions.largeNumberFormat(Math,this.city.materials.stone | 0) + "/";
				}
				var tooLittleOfMaterial2 = this.city != null && this.city.materials.stone < this.cost.stone;
				var bitmapText2 = new graphics_BitmapText(extraText12 + this.cost.stone + extraText3,{ font : "Arial", tint : this.city != null && tooLittleOfMaterial2 ? 16711680 : 0});
				this.materialDisplayedRed.h["stone"] = tooLittleOfMaterial2;
				bitmapText2.position.set(xx[0],-1);
				this.addChild(bitmapText2);
				xx[0] += (bitmapText2.get_textWidth() | 0) + 3;
			} else {
				this.materialDisplayedRed.h["stone"] = false;
			}
			if(this.cost.machineParts > 0) {
				anyMaterialShownBefore = true;
				var spr3 = new PIXI.Sprite(Resources.getTexture("spr_resource_" + "machineParts".toLowerCase()));
				spr3.position.x = xx[0];
				this.addChild(spr3);
				xx[0] += (spr3.width | 0) + 1;
				var extraText4 = "";
				var extraText13 = "";
				if(this.displayCityAmounts && !hasMaximumDisplayWidthFailed && !this.city.progress.sandbox.unlimitedResources) {
					extraText13 = common_MathExtensions.largeNumberFormat(Math,this.city.materials.machineParts | 0) + "/";
				}
				var tooLittleOfMaterial3 = this.city != null && this.city.materials.machineParts < this.cost.machineParts;
				var bitmapText3 = new graphics_BitmapText(extraText13 + this.cost.machineParts + extraText4,{ font : "Arial", tint : this.city != null && tooLittleOfMaterial3 ? 16711680 : 0});
				this.materialDisplayedRed.h["machineParts"] = tooLittleOfMaterial3;
				bitmapText3.position.set(xx[0],-1);
				this.addChild(bitmapText3);
				xx[0] += (bitmapText3.get_textWidth() | 0) + 3;
			} else {
				this.materialDisplayedRed.h["machineParts"] = false;
			}
			if(this.cost.refinedMetal > 0) {
				anyMaterialShownBefore = true;
				var spr4 = new PIXI.Sprite(Resources.getTexture("spr_resource_" + "refinedMetal".toLowerCase()));
				spr4.position.x = xx[0];
				this.addChild(spr4);
				xx[0] += (spr4.width | 0) + 1;
				var extraText5 = "";
				var extraText14 = "";
				if(this.displayCityAmounts && !hasMaximumDisplayWidthFailed && !this.city.progress.sandbox.unlimitedResources) {
					extraText14 = common_MathExtensions.largeNumberFormat(Math,this.city.materials.refinedMetal | 0) + "/";
				}
				var tooLittleOfMaterial4 = this.city != null && this.city.materials.refinedMetal < this.cost.refinedMetal;
				var bitmapText4 = new graphics_BitmapText(extraText14 + this.cost.refinedMetal + extraText5,{ font : "Arial", tint : this.city != null && tooLittleOfMaterial4 ? 16711680 : 0});
				this.materialDisplayedRed.h["refinedMetal"] = tooLittleOfMaterial4;
				bitmapText4.position.set(xx[0],-1);
				this.addChild(bitmapText4);
				xx[0] += (bitmapText4.get_textWidth() | 0) + 3;
			} else {
				this.materialDisplayedRed.h["refinedMetal"] = false;
			}
			if(this.cost.computerChips > 0) {
				anyMaterialShownBefore = true;
				var spr5 = new PIXI.Sprite(Resources.getTexture("spr_resource_" + "computerChips".toLowerCase()));
				spr5.position.x = xx[0];
				this.addChild(spr5);
				xx[0] += (spr5.width | 0) + 1;
				var extraText6 = "";
				var extraText15 = "";
				if(this.displayCityAmounts && !hasMaximumDisplayWidthFailed && !this.city.progress.sandbox.unlimitedResources) {
					extraText15 = common_MathExtensions.largeNumberFormat(Math,this.city.materials.computerChips | 0) + "/";
				}
				var tooLittleOfMaterial5 = this.city != null && this.city.materials.computerChips < this.cost.computerChips;
				var bitmapText5 = new graphics_BitmapText(extraText15 + this.cost.computerChips + extraText6,{ font : "Arial", tint : this.city != null && tooLittleOfMaterial5 ? 16711680 : 0});
				this.materialDisplayedRed.h["computerChips"] = tooLittleOfMaterial5;
				bitmapText5.position.set(xx[0],-1);
				this.addChild(bitmapText5);
				xx[0] += (bitmapText5.get_textWidth() | 0) + 3;
			} else {
				this.materialDisplayedRed.h["computerChips"] = false;
			}
			if(this.cost.cacao > 0) {
				anyMaterialShownBefore = true;
				var spr6 = new PIXI.Sprite(Resources.getTexture("spr_resource_" + "cacao".toLowerCase()));
				spr6.position.x = xx[0];
				this.addChild(spr6);
				xx[0] += (spr6.width | 0) + 1;
				var extraText7 = "";
				var extraText16 = "";
				if(this.displayCityAmounts && !hasMaximumDisplayWidthFailed && !this.city.progress.sandbox.unlimitedResources) {
					extraText16 = common_MathExtensions.largeNumberFormat(Math,this.city.materials.cacao | 0) + "/";
				}
				var tooLittleOfMaterial6 = this.city != null && this.city.materials.cacao < this.cost.cacao;
				var bitmapText6 = new graphics_BitmapText(extraText16 + this.cost.cacao + extraText7,{ font : "Arial", tint : this.city != null && tooLittleOfMaterial6 ? 16711680 : 0});
				this.materialDisplayedRed.h["cacao"] = tooLittleOfMaterial6;
				bitmapText6.position.set(xx[0],-1);
				this.addChild(bitmapText6);
				xx[0] += (bitmapText6.get_textWidth() | 0) + 3;
			} else {
				this.materialDisplayedRed.h["cacao"] = false;
			}
			if(this.cost.chocolate > 0) {
				anyMaterialShownBefore = true;
				var spr7 = new PIXI.Sprite(Resources.getTexture("spr_resource_" + "chocolate".toLowerCase()));
				spr7.position.x = xx[0];
				this.addChild(spr7);
				xx[0] += (spr7.width | 0) + 1;
				var extraText8 = "";
				var extraText17 = "";
				if(this.displayCityAmounts && !hasMaximumDisplayWidthFailed && !this.city.progress.sandbox.unlimitedResources) {
					extraText17 = common_MathExtensions.largeNumberFormat(Math,this.city.materials.chocolate | 0) + "/";
				}
				var tooLittleOfMaterial7 = this.city != null && this.city.materials.chocolate < this.cost.chocolate;
				var bitmapText7 = new graphics_BitmapText(extraText17 + this.cost.chocolate + extraText8,{ font : "Arial", tint : this.city != null && tooLittleOfMaterial7 ? 16711680 : 0});
				this.materialDisplayedRed.h["chocolate"] = tooLittleOfMaterial7;
				bitmapText7.position.set(xx[0],-1);
				this.addChild(bitmapText7);
				xx[0] += (bitmapText7.get_textWidth() | 0) + 3;
			} else {
				this.materialDisplayedRed.h["chocolate"] = false;
			}
			if(this.cost.graphene > 0) {
				anyMaterialShownBefore = true;
				var spr8 = new PIXI.Sprite(Resources.getTexture("spr_resource_" + "graphene".toLowerCase()));
				spr8.position.x = xx[0];
				this.addChild(spr8);
				xx[0] += (spr8.width | 0) + 1;
				var extraText9 = "";
				var extraText18 = "";
				if(this.displayCityAmounts && !hasMaximumDisplayWidthFailed && !this.city.progress.sandbox.unlimitedResources) {
					extraText18 = common_MathExtensions.largeNumberFormat(Math,this.city.materials.graphene | 0) + "/";
				}
				var tooLittleOfMaterial8 = this.city != null && this.city.materials.graphene < this.cost.graphene;
				var bitmapText8 = new graphics_BitmapText(extraText18 + this.cost.graphene + extraText9,{ font : "Arial", tint : this.city != null && tooLittleOfMaterial8 ? 16711680 : 0});
				this.materialDisplayedRed.h["graphene"] = tooLittleOfMaterial8;
				bitmapText8.position.set(xx[0],-1);
				this.addChild(bitmapText8);
				xx[0] += (bitmapText8.get_textWidth() | 0) + 3;
			} else {
				this.materialDisplayedRed.h["graphene"] = false;
			}
			if(this.cost.rocketFuel > 0) {
				anyMaterialShownBefore = true;
				var spr9 = new PIXI.Sprite(Resources.getTexture("spr_resource_" + "rocketFuel".toLowerCase()));
				spr9.position.x = xx[0];
				this.addChild(spr9);
				xx[0] += (spr9.width | 0) + 1;
				var extraText10 = "";
				var extraText19 = "";
				if(this.displayCityAmounts && !hasMaximumDisplayWidthFailed && !this.city.progress.sandbox.unlimitedResources) {
					extraText19 = common_MathExtensions.largeNumberFormat(Math,this.city.materials.rocketFuel | 0) + "/";
				}
				var tooLittleOfMaterial9 = this.city != null && this.city.materials.rocketFuel < this.cost.rocketFuel;
				var bitmapText9 = new graphics_BitmapText(extraText19 + this.cost.rocketFuel + extraText10,{ font : "Arial", tint : this.city != null && tooLittleOfMaterial9 ? 16711680 : 0});
				this.materialDisplayedRed.h["rocketFuel"] = tooLittleOfMaterial9;
				bitmapText9.position.set(xx[0],-1);
				this.addChild(bitmapText9);
				xx[0] += (bitmapText9.get_textWidth() | 0) + 3;
			} else {
				this.materialDisplayedRed.h["rocketFuel"] = false;
			}
			var _g = 0;
			var _g1 = MaterialsHelper.modMaterials;
			while(_g < _g1.length) {
				var modMaterial = _g1[_g];
				++_g;
				var currentMaterial = modMaterial.variableName;
				if(this.cost[currentMaterial] > 0) {
					if(currentMaterial == "food") {
						xx[0] -= 2;
					} else if(currentMaterial == "knowledge" && this.beforeKnowledgeText != "" && anyMaterialShownBefore) {
						var bitmapText10 = new graphics_BitmapText(this.beforeKnowledgeText,{ font : "Arial", tint : 0});
						bitmapText10.position.set(xx[0],-1);
						this.addChild(bitmapText10);
						shownBeforeKnowledgeText = true;
						xx[0] += (bitmapText10.get_textWidth() | 0) + 3;
					}
					anyMaterialShownBefore = true;
					var spr10 = new PIXI.Sprite(Resources.getTexture("spr_resource_" + currentMaterial.toLowerCase()));
					spr10.position.x = xx[0];
					this.addChild(spr10);
					xx[0] += (spr10.width | 0) + 1;
					if(currentMaterial == "food") {
						xx[0] -= 2;
					}
					var extraText20 = "";
					var extraText110 = "";
					if(this.displayCityAmounts && !hasMaximumDisplayWidthFailed && !this.city.progress.sandbox.unlimitedResources) {
						extraText110 = common_MathExtensions.largeNumberFormat(Math,this.city.materials[currentMaterial] | 0) + "/";
					}
					if(currentMaterial == "knowledge" && !hasMaximumDisplayWidthFailed) {
						extraText20 = this.afterKnowledgeText;
					}
					var tooLittleOfMaterial10 = this.city != null && this.city.materials[currentMaterial] < this.cost[currentMaterial];
					var bitmapText11 = new graphics_BitmapText(extraText110 + this.cost[currentMaterial] + extraText20,{ font : "Arial", tint : this.city != null && tooLittleOfMaterial10 ? 16711680 : 0});
					this.materialDisplayedRed.h[currentMaterial] = tooLittleOfMaterial10;
					bitmapText11.position.set(xx[0],-1);
					this.addChild(bitmapText11);
					xx[0] += (bitmapText11.get_textWidth() | 0) + 3;
				} else {
					this.materialDisplayedRed.h[currentMaterial] = false;
				}
			}
			if(this.cost.knowledge > 0) {
				if(this.beforeKnowledgeText != "" && anyMaterialShownBefore) {
					var bitmapText12 = new graphics_BitmapText(this.beforeKnowledgeText,{ font : "Arial", tint : 0});
					bitmapText12.position.set(xx[0],-1);
					this.addChild(bitmapText12);
					shownBeforeKnowledgeText = true;
					xx[0] += (bitmapText12.get_textWidth() | 0) + 3;
				}
				anyMaterialShownBefore = true;
				var spr11 = new PIXI.Sprite(Resources.getTexture("spr_resource_" + "knowledge".toLowerCase()));
				spr11.position.x = xx[0];
				this.addChild(spr11);
				xx[0] += (spr11.width | 0) + 1;
				var extraText21 = "";
				var extraText111 = "";
				if(this.displayCityAmounts && !hasMaximumDisplayWidthFailed && !this.city.progress.sandbox.unlimitedResources) {
					extraText111 = common_MathExtensions.largeNumberFormat(Math,this.city.materials.knowledge | 0) + "/";
				}
				if(!hasMaximumDisplayWidthFailed) {
					extraText21 = this.afterKnowledgeText;
				}
				var tooLittleOfMaterial11 = this.city != null && this.city.materials.knowledge < this.cost.knowledge;
				var bitmapText13 = new graphics_BitmapText(extraText111 + this.cost.knowledge + extraText21,{ font : "Arial", tint : this.city != null && tooLittleOfMaterial11 ? 16711680 : 0});
				this.materialDisplayedRed.h["knowledge"] = tooLittleOfMaterial11;
				bitmapText13.position.set(xx[0],-1);
				this.addChild(bitmapText13);
				xx[0] += (bitmapText13.get_textWidth() | 0) + 3;
			} else {
				this.materialDisplayedRed.h["knowledge"] = false;
			}
			if(!shownBeforeKnowledgeText && this.beforeKnowledgeText != "") {
				var bitmapText14 = new graphics_BitmapText(this.beforeKnowledgeText,{ font : "Arial", tint : 0});
				bitmapText14.position.set(xx[0],-1);
				this.addChild(bitmapText14);
				xx[0] += (bitmapText14.get_textWidth() | 0) + 3;
			}
			var addExtraIcon = (function(xx) {
				return function(textureName,amount) {
					var spr = new PIXI.Sprite(Resources.getTexture(textureName));
					spr.position.x = xx[0];
					_gthis.addChild(spr);
					xx[0] += (spr.width | 0) + 1;
					var bitmapText = new graphics_BitmapText("" + amount,{ font : "Arial", tint : 0});
					bitmapText.position.set(xx[0],-1);
					_gthis.addChild(bitmapText);
					xx[0] += (bitmapText.get_textWidth() | 0) + 3;
				};
			})(xx);
			this.displayWidth = xx[0];
			if(!hasMaximumDisplayWidthFailed && this.maxDisplayWidth > 0 && xx[0] > this.maxDisplayWidth) {
				hasMaximumDisplayWidthFailed = true;
				shouldUpdateCostDisplayAgain = true;
			}
		}
		if(this.city != null) {
			this.cityAmountDisplayed = this.city.materials.copy();
		}
	}
	,wouldChangeDisplay: function(newCost) {
		if(this.displayCityAmounts) {
			if(this.cityAmountDisplayed == null) {
				return true;
			}
			if(this.cityAmountDisplayed.anyMaterialDifferent(this.city.materials)) {
				return true;
			}
		}
		if(newCost.food != this.cost.food) {
			return true;
		}
		var tooLittleOfMaterial = this.city != null && this.city.materials.food < newCost.food;
		if(this.materialDisplayedRed.h["food"] != tooLittleOfMaterial) {
			return true;
		}
		if(newCost.wood != this.cost.wood) {
			return true;
		}
		var tooLittleOfMaterial = this.city != null && this.city.materials.wood < newCost.wood;
		if(this.materialDisplayedRed.h["wood"] != tooLittleOfMaterial) {
			return true;
		}
		if(newCost.stone != this.cost.stone) {
			return true;
		}
		var tooLittleOfMaterial = this.city != null && this.city.materials.stone < newCost.stone;
		if(this.materialDisplayedRed.h["stone"] != tooLittleOfMaterial) {
			return true;
		}
		if(newCost.machineParts != this.cost.machineParts) {
			return true;
		}
		var tooLittleOfMaterial = this.city != null && this.city.materials.machineParts < newCost.machineParts;
		if(this.materialDisplayedRed.h["machineParts"] != tooLittleOfMaterial) {
			return true;
		}
		if(newCost.refinedMetal != this.cost.refinedMetal) {
			return true;
		}
		var tooLittleOfMaterial = this.city != null && this.city.materials.refinedMetal < newCost.refinedMetal;
		if(this.materialDisplayedRed.h["refinedMetal"] != tooLittleOfMaterial) {
			return true;
		}
		if(newCost.computerChips != this.cost.computerChips) {
			return true;
		}
		var tooLittleOfMaterial = this.city != null && this.city.materials.computerChips < newCost.computerChips;
		if(this.materialDisplayedRed.h["computerChips"] != tooLittleOfMaterial) {
			return true;
		}
		if(newCost.cacao != this.cost.cacao) {
			return true;
		}
		var tooLittleOfMaterial = this.city != null && this.city.materials.cacao < newCost.cacao;
		if(this.materialDisplayedRed.h["cacao"] != tooLittleOfMaterial) {
			return true;
		}
		if(newCost.chocolate != this.cost.chocolate) {
			return true;
		}
		var tooLittleOfMaterial = this.city != null && this.city.materials.chocolate < newCost.chocolate;
		if(this.materialDisplayedRed.h["chocolate"] != tooLittleOfMaterial) {
			return true;
		}
		if(newCost.graphene != this.cost.graphene) {
			return true;
		}
		var tooLittleOfMaterial = this.city != null && this.city.materials.graphene < newCost.graphene;
		if(this.materialDisplayedRed.h["graphene"] != tooLittleOfMaterial) {
			return true;
		}
		if(newCost.rocketFuel != this.cost.rocketFuel) {
			return true;
		}
		var tooLittleOfMaterial = this.city != null && this.city.materials.rocketFuel < newCost.rocketFuel;
		if(this.materialDisplayedRed.h["rocketFuel"] != tooLittleOfMaterial) {
			return true;
		}
		var _g = 0;
		var _g1 = MaterialsHelper.modMaterials;
		while(_g < _g1.length) {
			var modMaterial = _g1[_g];
			++_g;
			var currentMaterial = modMaterial.variableName;
			if(newCost[currentMaterial] != this.cost[currentMaterial]) {
				return true;
			}
			var tooLittleOfMaterial = this.city != null && this.city.materials[currentMaterial] < newCost[currentMaterial];
			if(this.materialDisplayedRed.h[currentMaterial] != tooLittleOfMaterial) {
				return true;
			}
		}
		if(newCost.knowledge != this.cost.knowledge) {
			return true;
		}
		var tooLittleOfMaterial = this.city != null && this.city.materials.knowledge < newCost.knowledge;
		if(this.materialDisplayedRed.h["knowledge"] != tooLittleOfMaterial) {
			return true;
		}
		return false;
	}
	,__class__: gui_MaterialsCostDisplay
});
