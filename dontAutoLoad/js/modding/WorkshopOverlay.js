var modding_WorkshopOverlay = $hxClasses["modding.WorkshopOverlay"] = function() {
	this.innerDiv = null;
	this.elem = null;
	this.open = false;
};
modding_WorkshopOverlay.__name__ = "modding.WorkshopOverlay";
modding_WorkshopOverlay.prototype = {
	isOpen: function() {
		return this.open;
	}
	,createOrClose: function() {
		this.open = !this.open;
		if(this.open) {
			this.create();
		} else {
			this.elem.remove();
		}
	}
	,create: function() {
		this.elem = window.document.createElement("div");
		this.elem.style.position = "absolute";
		this.elem.style.width = "100%";
		this.elem.style.height = "100%";
		this.elem.style.background = "rgba(255, 255, 255, 0.95)";
		this.elem.style.top = "0";
		this.elem.style.overflow = "auto";
		this.elem.style.display = "flex";
		this.elem.style.fontFamily = "sans-serif";
		this.elem.style.color = "black";
		this.elem.style.justifyContent = "center";
		window.document.body.appendChild(this.elem);
		this.innerDiv = window.document.createElement("div");
		this.innerDiv.style.maxWidth = "800px";
		this.innerDiv.style.width = "100%";
		this.innerDiv.style.padding = "10px";
		this.elem.appendChild(this.innerDiv);
		this.createMainView();
	}
	,createModManageView: function(modId,modTitle) {
		var _gthis = this;
		while(this.innerDiv.firstChild != null) this.innerDiv.removeChild(this.innerDiv.firstChild);
		var backLink = window.document.createElement("a");
		backLink.innerText = common_Localize.lo("back");
		backLink.href = "javascript:void(0);";
		backLink.addEventListener("click",function() {
			_gthis.createMainView();
		});
		this.innerDiv.appendChild(backLink);
		var leTitle = window.document.createElement("H1");
		leTitle.innerText = common_Localize.lo("manage_mod") + " " + (modTitle == "" ? common_Localize.lo("untitled_mod") : modTitle);
		this.innerDiv.appendChild(leTitle);
		var leSubTitle = window.document.createElement("H2");
		leSubTitle.innerHTML = common_Localize.lo("upload_mod_content");
		this.innerDiv.appendChild(leSubTitle);
		var uploadExplainer = window.document.createElement("p");
		uploadExplainer.innerHTML = common_Localize.lo("upload_mod_content_explainer");
		this.innerDiv.appendChild(uploadExplainer);
		_internalModHelpers.getAllMods(function(mods) {
			if(mods.length == 0) {
				var refreshLink = window.document.createElement("a");
				refreshLink.innerText = common_Localize.lo("no_mods_found_refresh");
				refreshLink.href = "javascript:void(0);";
				refreshLink.addEventListener("click",function() {
					_gthis.createModManageView(modId,modTitle);
				});
				_gthis.innerDiv.appendChild(refreshLink);
			} else {
				var subDirP = window.document.createElement("p");
				var subDirLabel = window.document.createElement("label");
				subDirLabel.innerText = "Mod directory: ";
				subDirLabel.htmlFor = "selectDir";
				var selectionElem = window.document.createElement("select");
				selectionElem.id = "selectDir";
				var x = "- " + common_Localize.lo("choose_subdirectory") + " -";
				mods.splice(0,0,x);
				var _g = 0;
				while(_g < mods.length) {
					var mod = mods[_g];
					++_g;
					var optionElem = window.document.createElement("option");
					optionElem.innerText = mod;
					optionElem.value = mod;
					selectionElem.appendChild(optionElem);
				}
				subDirP.appendChild(selectionElem);
				_gthis.innerDiv.appendChild(subDirP);
				var changeNameP = window.document.createElement("p");
				var changeNameLabel = window.document.createElement("label");
				changeNameLabel.innerText = "Name: ";
				changeNameLabel.htmlFor = "changeNameInput";
				changeNameP.appendChild(changeNameLabel);
				var changeNameInput = window.document.createElement("input");
				changeNameInput.type = "text";
				changeNameInput.id = "changeNameInput";
				changeNameP.appendChild(changeNameInput);
				_gthis.innerDiv.appendChild(changeNameP);
				var uploadImageP = window.document.createElement("p");
				var previewFileElem = window.document.createElement("input");
				previewFileElem.type = "file";
				previewFileElem.accept = ".png,.jpg,.jpeg,.gif";
				previewFileElem.id = "uploadImageButton";
				var previewFileLabel = window.document.createElement("label");
				previewFileLabel.htmlFor = previewFileElem.id;
				previewFileLabel.innerText = "Choose Preview Image (square recommended): ";
				uploadImageP.appendChild(previewFileLabel);
				uploadImageP.appendChild(previewFileElem);
				_gthis.innerDiv.appendChild(uploadImageP);
				var tagsSelectExplain = window.document.createElement("p");
				tagsSelectExplain.innerText = "Choose Tags: ";
				_gthis.innerDiv.appendChild(tagsSelectExplain);
				var tagsSelect = window.document.createElement("p");
				_gthis.innerDiv.appendChild(tagsSelect);
				var possibleTags = ["Building","Upgrade","Scenario","Decoration","Mod"];
				var tagsElements = [];
				var _g = 0;
				while(_g < possibleTags.length) {
					var tag = possibleTags[_g];
					++_g;
					var thisTagSelect = window.document.createElement("input");
					tagsElements.push({ htmlElem : thisTagSelect, tag : tag});
					thisTagSelect.type = "checkbox";
					thisTagSelect.id = "tag" + tag;
					tagsSelect.appendChild(thisTagSelect);
					var thisTagLabel = window.document.createElement("label");
					thisTagLabel.htmlFor = thisTagSelect.id;
					thisTagLabel.innerText = tag;
					tagsSelect.appendChild(thisTagLabel);
				}
				var stateElem = null;
				var buttonElem = window.document.createElement("button");
				buttonElem.innerText = common_Localize.lo("upload");
				var currentlyUploading = false;
				buttonElem.addEventListener("click",function() {
					var thisSubdir = selectionElem.value;
					if(!currentlyUploading) {
						if(thisSubdir != "- " + common_Localize.lo("choose_subdirectory") + " -" || previewFileElem.value != "" && previewFileElem.value != null) {
							stateElem.innerText = "";
							currentlyUploading = true;
							var updateId = greenworks._StartItemUpdate(1180130,modId);
							stateElem.innerText = "Currently uploading...";
							console.log("FloatingSpaceCities/modding/WorkshopOverlay.hx:166:",updateId);
							if(changeNameInput.value != "") {
								greenworks._SetItemTitle(updateId,changeNameInput.value);
							}
							if(thisSubdir != "- " + common_Localize.lo("choose_subdirectory") + " -") {
								console.log("FloatingSpaceCities/modding/WorkshopOverlay.hx:170:",greenworks._SetItemContent(updateId,window._internalModHelpers.path + "\\" + thisSubdir + "\\"));
							}
							if(previewFileElem.value != "" && previewFileElem.value != null) {
								console.log("FloatingSpaceCities/modding/WorkshopOverlay.hx:172:",greenworks._SetItemPreview(updateId,previewFileElem.value));
							}
							var _g = [];
							var _g1 = 0;
							var _g2 = tagsElements;
							while(_g1 < _g2.length) {
								var v = _g2[_g1];
								++_g1;
								if(v.htmlElem.checked) {
									_g.push(v);
								}
							}
							var _this = _g;
							var result = new Array(_this.length);
							var _g = 0;
							var _g1 = _this.length;
							while(_g < _g1) {
								var i = _g++;
								result[i] = _this[i].tag;
							}
							var tagsCurrentlySelected = result;
							if(tagsCurrentlySelected.length > 0) {
								greenworks.SetItemTags(tagsCurrentlySelected);
							}
							greenworks._SubmitItemUpdate(updateId,"Mod Changes",function(res) {
								currentlyUploading = false;
								stateElem.innerText = "Succesfully uploaded! You can add more info about your info on the Steam Workshop web page. Also make sure to change its visibility to Public once your mod is ready for everyone to enjoy.";
								console.log("FloatingSpaceCities/modding/WorkshopOverlay.hx:181:",modId);
								console.log("FloatingSpaceCities/modding/WorkshopOverlay.hx:182:","https://steamcommunity.com/sharedfiles/filedetails/?id=" + modId);
								greenworks.activateGameOverlayToWebPage("https://steamcommunity.com/sharedfiles/filedetails/?id=" + modId);
							},function() {
								currentlyUploading = false;
								stateElem.innerText = "Upload failed! Please check your internet connection and whether you're correctly logged in to Steam. Also, check whether your preview image is not too big.";
							});
						} else {
							stateElem.innerText = common_Localize.lo("please_choose_subdirectory");
						}
					}
				});
				_gthis.innerDiv.appendChild(buttonElem);
				stateElem = window.document.createElement("p");
				_gthis.innerDiv.appendChild(stateElem);
			}
		});
	}
	,createMainView: function() {
		var _gthis = this;
		while(this.innerDiv.firstChild != null) this.innerDiv.removeChild(this.innerDiv.firstChild);
		var backLink = window.document.createElement("a");
		backLink.innerText = common_Localize.lo("back");
		backLink.href = "javascript:void(0);";
		backLink.addEventListener("click",function() {
			_gthis.createOrClose();
		});
		this.innerDiv.appendChild(backLink);
		var leTitle = window.document.createElement("H1");
		leTitle.innerText = common_Localize.lo("steam_workshop");
		this.innerDiv.appendChild(leTitle);
		var leTitle2 = window.document.createElement("H2");
		leTitle2.innerText = common_Localize.lo("get_mods");
		this.innerDiv.appendChild(leTitle2);
		var openLink = window.document.createElement("a");
		openLink.innerText = common_Localize.lo("open_workshop");
		openLink.href = "javascript:void(0);";
		openLink.addEventListener("click",function() {
			greenworks.activateGameOverlayToWebPage("http://steamcommunity.com/app/1180130/workshop");
		});
		this.innerDiv.appendChild(openLink);
		var leTitle4 = window.document.createElement("H2");
		leTitle4.innerText = common_Localize.lo("create_mods");
		this.innerDiv.appendChild(leTitle4);
		var openLinkP = window.document.createElement("p");
		var openLink = window.document.createElement("a");
		openLink.innerText = common_Localize.lo("new_mod_workshop");
		openLink.href = "javascript:void(0);";
		var creatingMod = false;
		openLink.addEventListener("click",function() {
			if(!creatingMod) {
				greenworks._CreateItem(1180130,function(modId) {
					console.log("FloatingSpaceCities/modding/WorkshopOverlay.hx:246:",modId);
					_gthis.createModManageView(modId,"");
				},function() {
					window.alert("Creating a mod failed!");
					creatingMod = false;
				});
			}
		});
		openLinkP.appendChild(openLink);
		this.innerDiv.appendChild(openLinkP);
		var getMoreMods = null;
		getMoreMods = function(pageNum) {
			getYourMods(pageNum,function(mods) {
				var _g = 0;
				while(true) {
					if(!(_g < mods.length)) {
						break;
					}
					var mod = [mods[_g]];
					_g = _g + 1;
					var showModLinkP = (function($this) {
						var $r;
						var _this = window.document;
						$r = _this.createElement("p");
						return $r;
					}(this));
					showModLinkP.style.margin = "0";
					var showModLink = window.document.createElement("a");
					showModLink.innerText = common_Localize.lo("manage_mod") + " " + (mod[0].title == "" ? common_Localize.lo("untitled_mod") : mod[0].title);
					showModLink.href = "javascript:void(0);";
					showModLink.addEventListener("click",(function(mod) {
						return function() {
							_gthis.createModManageView(mod[0].publishedFileId,mod[0].title);
						};
					})(mod));
					_gthis.innerDiv.appendChild(showModLinkP);
					showModLinkP.appendChild(showModLink);
				}
				if(mods.length > 0) {
					var loadMoreLinkP = (function($this) {
						var $r;
						var _this = window.document;
						$r = _this.createElement("p");
						return $r;
					}(this));
					loadMoreLinkP.style.margin = "0";
					var loadMoreLink = window.document.createElement("a");
					loadMoreLink.innerText = common_Localize.lo("load_more");
					loadMoreLink.href = "javascript:void(0);";
					loadMoreLink.addEventListener("click",function() {
						getMoreMods(pageNum + 1);
						loadMoreLinkP.remove();
					});
					_gthis.innerDiv.appendChild(loadMoreLinkP);
					loadMoreLinkP.appendChild(loadMoreLink);
				}
			});
		};
		getMoreMods(1);
	}
	,__class__: modding_WorkshopOverlay
};
