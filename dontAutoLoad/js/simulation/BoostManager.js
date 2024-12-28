var simulation_BoostManager = $hxClasses["simulation.BoostManager"] = function(simulation) {
	this.boostShownExplainer = false;
	this.timeUntilNextExtraBoost = 0;
	this.claimedExtraBoostType = null;
	this.currentExtraBoostLeft = 0;
	this.currentExtraBoostType = null;
	this.currentExtraBoostArrow = null;
	this.disableRewardedAd = false;
	this.currentGlobalBoostAmount = 1.0;
	this.infoButtonShown = false;
	this.infoButtonParent = null;
	this.normalMaxBoost = 10800;
	this.maxBoost = 10800;
	this.boostLeft = 0;
	var _gthis = this;
	this.simulation = simulation;
	this.city = simulation.city;
	if(5 == 6) {
		this.maxBoost = 7200;
		this.normalMaxBoost = 7200;
	} else if(5 == 8) {
		this.normalMaxBoost = 14400;
	}
	this.timeUntilNextExtraBoost = 36000 + random_Random.getFloat(36000);
	if(5 != 8) {
		this.boostShownExplainer = true;
	} else {
		common_Storage.getItem("boostShownExplainer",function(err,res) {
			if(err == null) {
				if(res == "boostShownExplainer") {
					_gthis.boostShownExplainer = true;
				}
			}
		});
	}
};
simulation_BoostManager.__name__ = "simulation.BoostManager";
simulation_BoostManager.prototype = {
	update: function(timeMod) {
		if(this.boostLeft > 0) {
			this.boostLeft -= timeMod;
			this.currentGlobalBoostAmount = 2.0;
		} else {
			this.currentGlobalBoostAmount = 1;
		}
		this.actuallyCreateBoostButtonIfPossible();
		this.optionallyCreateExtraBoost(timeMod);
	}
	,optionallyCreateExtraBoost: function(timeMod) {
		if(this.city.simulationSpeed < 0.1 || this.city.pauseGame) {
			return;
		}
		if(this.city.game.isMobile) {
			return;
		}
		if(5 != 6) {
			return;
		}
		var actualTimeMod = timeMod / (this.city.simulationSpeed * 0.6666666666666666666);
		if(this.currentExtraBoostArrow == null) {
			if(this.infoButton != null && this.boostAvailable()) {
				if(this.timeUntilNextExtraBoost <= 0) {
					this.createExtraBoost();
					this.timeUntilNextExtraBoost = 54000 + random_Random.getFloat(36000);
				}
			}
			this.timeUntilNextExtraBoost -= timeMod;
		} else {
			this.currentExtraBoostLeft -= actualTimeMod;
			if(this.currentExtraBoostLeft <= 0) {
				this.destroyExtraBoost();
			} else {
				this.currentExtraBoostArrow.update(timeMod);
				this.currentExtraBoostArrow.addText(this.getExtraBoostTypeText() + " " + common_Localize.lo("claim_within_n_s",[this.currentExtraBoostLeft / 60 | 0]));
			}
		}
	}
	,getExtraBoostTypeText: function() {
		if(this.currentExtraBoostType == null) {
			return "";
		}
		switch(this.currentExtraBoostType._hx_index) {
		case 0:
			return common_Localize.lo("2x_boost");
		case 1:
			return common_Localize.lo("3x_boost");
		case 2:
			return common_Localize.lo("double_bonus_boost");
		case 3:
			return common_Localize.lo("triple_bonus_boost");
		}
	}
	,getSpecialSuccessText: function() {
		if(this.claimedExtraBoostType == null) {
			return "";
		}
		switch(this.claimedExtraBoostType._hx_index) {
		case 0:
			return common_Localize.lo("2x_boost_claimed");
		case 1:
			return common_Localize.lo("3x_boost_claimed");
		case 2:
			return common_Localize.lo("double_bonus_boost_claimed");
		case 3:
			return common_Localize.lo("triple_bonus_boost_claimed");
		}
	}
	,destroyExtraBoost: function() {
		if(this.currentExtraBoostArrow != null) {
			this.currentExtraBoostArrow.destroy();
			this.currentExtraBoostArrow = null;
		}
		this.currentExtraBoostLeft = 0;
		this.currentExtraBoostType = null;
	}
	,createExtraBoost: function() {
		var _gthis = this;
		if(this.currentExtraBoostArrow == null) {
			this.currentExtraBoostArrow = new gui_HelpArrow(this.city.gui,this.city.gui.stage,function() {
				if(!_gthis.infoButtonShown) {
					return null;
				}
				return _gthis.infoButton;
			},function() {
				return true;
			},gui_HelpArrowDirection.DownHint);
			this.currentExtraBoostType = random_Random.fromArray([simulation_ExtraBoostType.DoubleBoost,simulation_ExtraBoostType.DoubleBoost,simulation_ExtraBoostType.DoubleBoost,simulation_ExtraBoostType.TripleBoost,simulation_ExtraBoostType.DoubleMaterialReward,simulation_ExtraBoostType.TripleMaterialReward]);
			var duration = 16;
			this.currentExtraBoostArrow.addText(this.getExtraBoostTypeText() + " " + common_Localize.lo("claim_within_n_s",[duration]));
			this.currentExtraBoostLeft = duration * 60;
		}
	}
	,boostAvailable: function() {
		if((mobileSpecific_Premium.has("remove_ads") && 5 == 8 || common_AdHelper.adAvailableRewarded()) && this.boostLeft <= 0 && !this.disableRewardedAd) {
			return !this.city.progress.sandbox.unlimitedResources;
		} else {
			return false;
		}
	}
	,doBoost: function() {
		var _gthis = this;
		if(this.boostLeft <= 0 && this.boostAvailable()) {
			if(this.currentExtraBoostType != null && this.currentExtraBoostLeft >= 0) {
				this.claimedExtraBoostType = this.currentExtraBoostType;
				this.destroyExtraBoost();
			}
			common_AdHelper.showRewardedInterstitial(function() {
				Analytics.sendEventFirebase("rewarded_complete","rewarded_type","boost");
				_gthis.boostLeft = _gthis.normalMaxBoost;
				_gthis.maxBoost = _gthis.normalMaxBoost;
				var specialBoostText = "";
				var extraRewardMultiplier = 1;
				if(_gthis.claimedExtraBoostType != null) {
					switch(_gthis.claimedExtraBoostType._hx_index) {
					case 0:
						_gthis.boostLeft *= 2;
						_gthis.maxBoost *= 2;
						break;
					case 1:
						_gthis.boostLeft *= 3;
						_gthis.maxBoost *= 3;
						break;
					case 2:
						extraRewardMultiplier *= 2;
						break;
					case 3:
						extraRewardMultiplier *= 3;
						break;
					}
					specialBoostText = _gthis.getSpecialSuccessText();
					_gthis.claimedExtraBoostType = null;
				}
				if(simulation_BoostManager.enableExtraReward) {
					var mouse = _gthis.city.game.mouse;
					mouse.resetPosition();
					var extraReward = _gthis.getRandomReward(extraRewardMultiplier);
					extraReward.materials.addToProduction(_gthis.city.simulation.stats);
					_gthis.city.materials.add(extraReward.materials);
					var createAdRewardWindow = null;
					createAdRewardWindow = function() {
						_gthis.city.gui.createWindow("adRewardWindow");
						_gthis.city.gui.setWindowReload(createAdRewardWindow);
						gui_AdRewardWindow.create(_gthis.city,_gthis.city.gui,_gthis.city.gui.innerWindowStage,_gthis.city.gui.windowInner,extraReward,specialBoostText);
					};
					createAdRewardWindow();
					_gthis.city.gui.clearTutorial();
				}
			},function() {
				_gthis.city.gui.showSimpleWindow(common_Localize.lo("boost_failed"));
			},true);
		}
	}
	,actuallyCreateBoostButtonIfPossible: function() {
		if(this.infoButtonParent != null) {
			if((this.boostLeft > 0 || this.boostAvailable()) && !Settings.boostHidden) {
				if(!this.infoButtonShown) {
					this.infoButtonShown = true;
					this.actuallyCreateBoostButton();
				}
			} else if(this.infoButtonShown) {
				this.infoButtonShown = false;
				this.infoButtonParent.removeChild(this.infoButton);
				this.infoButton = null;
			}
		}
	}
	,actuallyCreateBoostButton: function() {
		var _gthis = this;
		var parent = this.infoButtonParent;
		var stage = this.city.gui.stage;
		var theGUI = this.city.gui;
		var onClick = function() {
			if(_gthis.boostLeft <= 0 && _gthis.boostAvailable()) {
				if(_gthis.boostShownExplainer || Config.hasRemoveAds()) {
					_gthis.doBoost();
				} else {
					gui_infoWindows_BoostHelpWindow.createWindow(_gthis.city,function() {
						_gthis.doBoost();
						_gthis.boostShownExplainer = true;
						common_Storage.setItem("boostShownExplainer","boostShownExplainer",function() {
						});
						_gthis.city.gui.closeWindow();
					});
				}
			}
		};
		var onHover = function() {
			if(_gthis.boostLeft > 0) {
				theGUI.tooltip.setText(common_Localize.lo("boost"),common_Localize.lo("boost_active_description"),common_Localize.lo("boost_active"));
			} else {
				theGUI.tooltip.setText(common_Localize.lo("boost"),common_Localize.lo("boost_use_case") + (simulation_BoostManager.enableExtraReward ? "\n" + common_Localize.lo("boost_earn_extra_reward") : ""));
			}
		};
		var getAmount = function() {
			return common_Localize.lo("boost");
		};
		var textureName = "spr_icon_boost";
		var minWidth = 20;
		var isActive = function() {
			return _gthis.boostLeft > 0;
		};
		this.infoButton = new gui_ContainerButtonWithProgress(this.city.gui,stage,parent,onClick,isActive,onHover,"spr_transparentbutton_info",10526880,16777215,function() {
			if(_gthis.boostLeft <= 0) {
				return -1;
			}
			var val = _gthis.boostLeft / _gthis.maxBoost;
			if(val < 0) {
				return 0;
			} else if(val > 1) {
				return 1;
			} else {
				return val;
			}
		});
		this.infoButton.container.fillSecondarySize = true;
		var extraSpacing = theGUI.game.isMobile ? 3 : 0;
		var extraSpacingText = theGUI.game.isMobile ? 2 : 0;
		this.infoButton.container.padding = { left : 2 + extraSpacing, right : extraSpacing + 3, top : extraSpacing + 2, bottom : extraSpacing + 1};
		this.infoButton.container.updateSize();
		this.infoButton.container.addChild(new gui_ContainerHolder(this.infoButton.container,stage,new PIXI.Sprite(Resources.getTexture(textureName))));
		this.infoButton.container.addChild(new gui_TextElement(this.infoButton.container,stage,null,getAmount,"Arial15",{ left : 1 + extraSpacingText, right : 0, top : 2, bottom : 0}));
		this.infoButton.container.minWidth = minWidth;
		parent.insertChild(this.infoButton,0);
		return this.infoButton;
	}
	,getRandomReward: function(extraRewardMultiplier) {
		var rewardText = "";
		var rewardMaterials = new Materials();
		var canGiveMachineParts = false;
		var canGiveRefinedMetal = false;
		var canGiveComputerChips = false;
		var baseRewardMaxI = 11;
		if(this.city.materials.machineParts > 0.2) {
			baseRewardMaxI = 16;
			canGiveMachineParts = true;
		}
		if(this.city.materials.refinedMetal > 0.2) {
			baseRewardMaxI = 19;
			canGiveRefinedMetal = true;
		}
		if(this.city.materials.computerChips > 0.2) {
			baseRewardMaxI = 22;
			canGiveComputerChips = true;
		}
		var baseRewardI = random_Random.getInt(baseRewardMaxI);
		switch(baseRewardI) {
		case 0:
			rewardText = "Lunchbox";
			rewardMaterials.add(new Materials(0,0,10));
			break;
		case 1:
			rewardText = "Pile of Wood";
			rewardMaterials.add(new Materials(25));
			break;
		case 2:
			rewardText = "Book";
			rewardMaterials.add(new Materials(0,0,0,0,15));
			break;
		case 3:
			rewardText = "Alien Candy Bar";
			rewardMaterials.add(new Materials(0,0,15,0,5));
			break;
		case 4:
			rewardText = "Rock";
			rewardMaterials.add(new Materials(0,20,0,0,0));
			break;
		case 5:
			rewardText = "Pile of Materials";
			rewardMaterials.add(new Materials(random_Random.getInt(10,30),random_Random.getInt(10,30),0,0,0));
			break;
		case 6:
			rewardText = "Flower";
			rewardMaterials.add(new Materials(5,0,0,0,9));
			break;
		case 7:
			rewardText = "Statue";
			rewardMaterials.add(new Materials(0,15,0,0,7));
			break;
		case 8:
			rewardText = "Comet";
			rewardMaterials.add(new Materials(0,20,0,0,15));
			break;
		case 9:
			rewardText = "Brick";
			rewardMaterials.add(new Materials(0,25,0,0));
			break;
		case 10:
			rewardText = random_Random.fromArray(["Cabbage","Potato","Carrot","Bread"]);
			rewardMaterials.add(new Materials(0,0,7));
			break;
		case 11:
			rewardText = "Box of Wires";
			rewardMaterials.add(new Materials(5,0,0,10,0));
			break;
		case 12:
			rewardText = "Toolbox";
			rewardMaterials.add(new Materials(0,12,0,9));
			break;
		case 13:
			rewardText = "Mechanical Pear";
			rewardMaterials.add(new Materials(0,0,1,1,20));
			break;
		case 14:
			rewardText = "Beeping Device";
			rewardMaterials.add(new Materials(0,10,0,5,2));
			break;
		case 15:
			rewardText = "Robot Arm";
			rewardMaterials.add(new Materials(0,10,0,10,25));
			break;
		case 16:
			rewardText = "Sphere";
			rewardMaterials.add(new Materials(0,0,0,0,10,10,0));
			break;
		case 17:
			rewardText = "Gem";
			rewardMaterials.add(new Materials(0,0,0,0,0,20,0));
			break;
		case 18:
			rewardText = "Pile of Pebbles";
			rewardMaterials.add(new Materials(0,40,0,0,0,10,0));
			break;
		case 19:
			rewardText = "Laptop";
			rewardMaterials.add(new Materials(0,0,0,5,0,4,1));
			break;
		case 20:
			rewardText = "UFO";
			rewardMaterials.add(new Materials(0,0,0,0,15,5,2));
			break;
		case 21:
			rewardText = "Flashing Box";
			rewardMaterials.add(new Materials(0,20,0,0,8,0,1));
			break;
		}
		var extraWordR = random_Random.getFloat(0.8);
		var addedExtra = false;
		if(extraWordR < 0.05 && !addedExtra) {
			rewardText = "Big " + rewardText;
			rewardMaterials.multiply(1.5);
			addedExtra = true;
		}
		extraWordR -= 0.05;
		if(extraWordR < 0.04 && !addedExtra) {
			rewardText = "Mega " + rewardText;
			rewardMaterials.multiply(2);
			addedExtra = true;
		}
		extraWordR -= 0.04;
		if(extraWordR < 0.02 && !addedExtra) {
			rewardText = "Giant " + rewardText;
			rewardMaterials.multiply(3);
			addedExtra = true;
		}
		extraWordR -= 0.02;
		if(extraWordR < 0.02 && !addedExtra) {
			rewardText = "Smart " + rewardText;
			rewardMaterials.knowledge += 5;
			if(canGiveComputerChips) {
				rewardMaterials.computerChips += 1;
			}
			addedExtra = true;
		}
		extraWordR -= 0.02;
		if(extraWordR < 0.01 && canGiveComputerChips && !addedExtra) {
			rewardText = "Network-Connected " + rewardText;
			rewardMaterials.computerChips += 2;
			addedExtra = true;
		}
		extraWordR -= 0.01;
		if(extraWordR < 0.02 && !addedExtra) {
			rewardText = "Edible " + rewardText;
			var _g = rewardMaterials;
			_g.set_food(_g.food + 20);
			addedExtra = true;
		}
		extraWordR -= 0.02;
		if(extraWordR < 0.02 && !addedExtra) {
			rewardText = "Slimy " + rewardText;
			var _g = rewardMaterials;
			_g.set_food(_g.food + 5);
			addedExtra = true;
		}
		extraWordR -= 0.02;
		if(extraWordR < 0.02 && canGiveRefinedMetal && !addedExtra) {
			rewardText = "Cold " + rewardText;
			rewardMaterials.refinedMetal += 5;
			addedExtra = true;
		}
		extraWordR -= 0.02;
		if(extraWordR < 0.02 && canGiveMachineParts && !addedExtra && rewardText.indexOf("Mechanical") == -1) {
			rewardText = "Mechanical " + rewardText;
			rewardMaterials.machineParts += 6;
			addedExtra = true;
		}
		extraWordR -= 0.02;
		if(extraWordR < 0.02 && !addedExtra) {
			rewardText = "Growing " + rewardText;
			rewardMaterials.wood += 20;
			rewardMaterials.multiply(1.5);
			addedExtra = true;
		}
		extraWordR -= 0.02;
		if(extraWordR < 0.02 && !addedExtra && canGiveRefinedMetal) {
			rewardText = "Metal " + rewardText;
			rewardMaterials.refinedMetal += 4;
			addedExtra = true;
		}
		extraWordR -= 0.02;
		if(extraWordR < 0.02 && !addedExtra) {
			rewardText = "Musical " + rewardText;
			rewardMaterials.wood += 5;
			rewardMaterials.knowledge += 10;
			addedExtra = true;
		}
		extraWordR -= 0.02;
		if(extraWordR < 0.02 && !addedExtra) {
			rewardText = "Paper " + rewardText;
			rewardMaterials.multiply(0.5);
			rewardMaterials.knowledge += 15;
			addedExtra = true;
		}
		extraWordR -= 0.02;
		if(extraWordR < 0.02 && !addedExtra && canGiveMachineParts) {
			rewardText = "Rotating " + rewardText;
			rewardMaterials.machineParts += 10;
			addedExtra = true;
		}
		extraWordR -= 0.02;
		if(extraWordR < 0.03 && !addedExtra) {
			rewardText = "Cool-Looking " + rewardText;
			rewardMaterials.multiply(2.2);
			rewardMaterials.knowledge += 1;
			addedExtra = true;
		}
		extraWordR -= 0.03;
		if(extraWordR < 0.02 && !addedExtra && canGiveComputerChips) {
			rewardText = "IOT " + rewardText;
			rewardMaterials.computerChips += 1;
			addedExtra = true;
		}
		extraWordR -= 0.02;
		if(extraWordR < 0.02 && !addedExtra) {
			rewardText = "Overgrown " + rewardText;
			rewardMaterials.wood *= 3;
			rewardMaterials.wood += 20;
			addedExtra = true;
		}
		extraWordR -= 0.02;
		if(extraWordR < 0.01 && !addedExtra) {
			rewardText = "Tiny " + rewardText;
			rewardMaterials.multiply(0.75);
			addedExtra = true;
		}
		extraWordR -= 0.01;
		if(extraWordR < 0.02 && !addedExtra && canGiveComputerChips) {
			rewardText = "Luminous " + rewardText;
			rewardMaterials.computerChips += 1;
			rewardMaterials.knowledge += 2;
			addedExtra = true;
		}
		extraWordR -= 0.02;
		if(extraWordR < 0.02 && !addedExtra) {
			rewardText = "Dark " + rewardText;
			rewardMaterials.knowledge += 5;
			rewardMaterials.stone += 2;
			addedExtra = true;
		}
		extraWordR -= 0.02;
		if(extraWordR < 0.02 && !addedExtra) {
			rewardText = "Stony " + rewardText;
			rewardMaterials.stone += 20;
			addedExtra = true;
		}
		extraWordR -= 0.02;
		if(extraWordR < 0.02 && !addedExtra) {
			rewardText = "Ancient " + rewardText;
			rewardMaterials.stone += 10;
			addedExtra = true;
		}
		extraWordR -= 0.02;
		if(extraWordR < 0.02 && !addedExtra) {
			rewardText = "Starry " + rewardText;
			rewardMaterials.stone += 10;
			rewardMaterials.knowledge += 5;
			addedExtra = true;
		}
		extraWordR -= 0.02;
		if(extraWordR < 0.02 && !addedExtra) {
			rewardText = "Delicious " + rewardText;
			var _g = rewardMaterials;
			_g.set_food(_g.food + 10);
			addedExtra = true;
		}
		extraWordR -= 0.02;
		if(extraWordR < 0.02 && !addedExtra) {
			rewardText = "Profitable " + rewardText;
			rewardMaterials.multiply(1.2);
			var _g = rewardMaterials;
			_g.set_food(_g.food + 15);
			addedExtra = true;
		}
		extraWordR -= 0.02;
		if(extraWordR < 0.02 && !addedExtra) {
			rewardText = "Extremely Normal-Looking " + rewardText;
			addedExtra = true;
		}
		extraWordR -= 0.02;
		if(extraWordR < 0.02 && !addedExtra && canGiveRefinedMetal) {
			rewardText = "Shiny " + rewardText;
			rewardMaterials.refinedMetal += 10;
			addedExtra = true;
		}
		extraWordR -= 0.02;
		if(extraWordR < 0.02 && !addedExtra && canGiveMachineParts) {
			rewardText = "Dancing " + rewardText;
			rewardMaterials.machineParts += 8;
			addedExtra = true;
		}
		extraWordR -= 0.02;
		if(extraWordR < 0.02 && !addedExtra && canGiveComputerChips) {
			rewardText = "Computerized " + rewardText;
			rewardMaterials.computerChips += 2;
			addedExtra = true;
		}
		extraWordR -= 0.02;
		var productionBasedMultiplier = Math.pow(this.city.simulation.stats.materialProduction[MaterialsHelper.findMaterialIndex("wood")][1] + this.city.simulation.stats.materialProduction[MaterialsHelper.findMaterialIndex("stone")][1] + this.city.simulation.stats.materialProduction[MaterialsHelper.findMaterialIndex("food")][1] + this.city.simulation.stats.materialProduction[MaterialsHelper.findMaterialIndex("knowledge")][1],0.66) / 16;
		var minVal = extraRewardMultiplier > 1.5 ? 2 : 1;
		rewardMaterials.multiply(productionBasedMultiplier < minVal ? minVal : productionBasedMultiplier > 12 ? 12 : productionBasedMultiplier);
		rewardMaterials.multiply(extraRewardMultiplier);
		rewardMaterials.roundAll();
		return { text : rewardText, materials : rewardMaterials};
	}
	,save: function(queue,shouldSaveDefinition) {
		if(shouldSaveDefinition == null) {
			shouldSaveDefinition = true;
		}
		if(shouldSaveDefinition) {
			queue.addString(simulation_BoostManager.saveDefinition);
		}
		var value = this.boostLeft;
		if(queue.size + 8 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 8) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setDouble(queue.size,value);
		queue.size += 8;
		var value = this.maxBoost;
		if(queue.size + 8 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 8) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setDouble(queue.size,value);
		queue.size += 8;
		var value = this.normalMaxBoost;
		if(queue.size + 8 > queue.bytes.length) {
			var oldBytes = queue.bytes;
			queue.bytes = new haxe_io_Bytes(new ArrayBuffer((queue.size + 8) * 2));
			queue.bytes.blit(0,oldBytes,0,queue.size);
		}
		queue.bytes.setDouble(queue.size,value);
		queue.size += 8;
	}
	,load: function(queue,definition) {
		if(definition == null) {
			definition = queue.readString();
		}
		var loadMap = gamesave_GameSaveHelper.makeLoadMap(definition,queue);
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"boostLeft")) {
			this.boostLeft = loadMap.h["boostLeft"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"maxBoost")) {
			this.maxBoost = loadMap.h["maxBoost"];
		}
		if(Object.prototype.hasOwnProperty.call(loadMap.h,"normalMaxBoost")) {
			this.normalMaxBoost = loadMap.h["normalMaxBoost"];
		}
	}
	,__class__: simulation_BoostManager
};
