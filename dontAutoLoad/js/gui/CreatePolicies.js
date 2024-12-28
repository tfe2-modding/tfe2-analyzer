var gui_CreatePolicies = $hxClasses["gui.CreatePolicies"] = function() { };
gui_CreatePolicies.__name__ = "gui.CreatePolicies";
gui_CreatePolicies.create = function(policies,city,addHeader) {
	if(addHeader == null) {
		addHeader = true;
	}
	var gui = city.gui;
	var _g = [];
	var _g1 = 0;
	var _g2 = policies;
	while(_g1 < _g2.length) {
		var v = _g2[_g1];
		++_g1;
		if(city.progress.unlocks.getUnlockState(v) == progress_UnlockState.Unlocked) {
			_g.push(v);
		}
	}
	var unlockedPolicies = _g;
	var policies = city.policies;
	var policiesList = policies.policies;
	if(unlockedPolicies.length == 0) {
		return;
	}
	if(addHeader) {
		gui_UpgradeWindowParts.createHeader(gui,common_Localize.lo("city_policies"));
	}
	var buttonsContainer = new gui_GUIContainer(gui,gui.innerWindowStage,gui.windowInner);
	gui.windowInner.addChild(buttonsContainer);
	buttonsContainer.direction = gui_GUIContainerDirection.Vertical;
	buttonsContainer.fillSecondarySize = true;
	var recreateButtons = function() {
		buttonsContainer.clear();
		var _g = 0;
		while(_g < unlockedPolicies.length) {
			var policy = [unlockedPolicies[_g]];
			++_g;
			var policyName = [policy[0].__name__];
			var info = Resources.policiesInfo.h[policyName[0]];
			var currentName = info.name;
			var currentDescription = info.description;
			var materialsToPay = [Materials.fromPoliciesInfo(info)];
			var infoContainerInfo = gui_UpgradeWindowParts.createCheckboxButton(gui,(function(policy) {
				return function() {
					return common_ArrayExtensions.any(policiesList,(function(policy) {
						return function(bu) {
							return js_Boot.getClass(bu) == policy[0];
						};
					})(policy));
				};
			})(policy),(function(materialsToPay,policyName,policy) {
				return function() {
					if(policyName[0] == "policies.HippieLifestyle" && city.progress.ruleset == progress_Ruleset.HippieCity) {
						var showWarningWindow = (function() {
							return function() {
								city.gui.showSimpleWindow(common_Localize.lo("hippie_try_disable_onewithnature"),null,true);
							};
						})();
						showWarningWindow();
						city.gui.addWindowToStack(showWarningWindow);
						return;
					}
					var existingPolicy = Lambda.find(policiesList,(function(policy) {
						return function(bu) {
							return js_Boot.getClass(bu) == policy[0];
						};
					})(policy));
					if(existingPolicy != null) {
						city.policies.removePolicy(existingPolicy);
						city.simulation.houseAssigner.shouldUpdateHouses = true;
					} else {
						if(policyName[0] == "policies.HippieLifestyle" && city.progress.allCitiesInfo.betrayedHippies) {
							var showWarningWindow = (function() {
								return function() {
									city.gui.showSimpleWindow(common_Localize.lo("hippie_betrayed_try_enable_onewithnature"),null,true);
								};
							})();
							showWarningWindow();
							city.gui.addWindowToStack(showWarningWindow);
							return;
						}
						if(city.materials.canAfford(materialsToPay[0])) {
							city.materials.remove(materialsToPay[0]);
							city.policies.addPolicy(Type.createInstance(policy[0],[]));
							city.simulation.houseAssigner.shouldUpdateHouses = true;
						}
					}
				};
			})(materialsToPay,policyName,policy),currentName,currentDescription,buttonsContainer,null);
		}
	};
	recreateButtons();
	gui.windowInner.addChild(new gui_GUISpacing(gui.windowInner,new common_Point(2,4)));
};
