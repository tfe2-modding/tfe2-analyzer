const olddirname = global.__dirname
if (confirm("Run the analyzer?")) try {
	common_Localize.translateFiles()
	const fs = require("fs")
	const path = require("path")
	const process = require("process")
	const tfe2Path = "C:/Program Files (x86)/Steam/steamapps/common/The_Final_Earth_2/game"
	const log = []

	process.chdir(decodeURI(document.currentScript.src.replace("file:///", "").replace("index.js", "")))

	function t(s,...v) {
		return path.join(tfe2Path, String.raw({raw:s},...v))
	}

	fs.rmSync("dontAutoLoad", {
		recursive: true,
		force: true,
	})

	fs.mkdirSync("dontAutoLoad")

	function lang(inp) {
		return Object.fromEntries(inp.match(/.+/gm).map(e=>e.split("|")))
	}

	function warn(...args) {
		log.push(["[ANALYZER WARN]", ...args].join(" "))
		console.warn("[ANALYZER WARN]", ...args)
	}

	function createCanvas(width, height) {
		const canvas = document.createElement('canvas')
		canvas.width = width
		canvas.height = height
		return canvas
	}

	function toBuffer(canvas) {
		return Buffer.from(canvas.toDataURL().replace(/^data:image\/\w+;base64,/, ""), "base64")
	}

	const game_js = fs.readFileSync(t`js/game_js.js`, "utf8")
	const english = common_Localize.defaultLocalizations.h
	const english_entries = Object.entries(english)
	const buildinginfo = Resources.buildingInfoArray
	const buildingUpgradesInfo = Object.values(Resources.buildingUpgradesInfo.h)
	const texture = Resources.getTexture("sprites").baseTexture.resource.source
	const c = createCanvas(20, 20)
	const ctx = c.getContext("2d")
	ctx.imageSmoothingEnabled = false
	const tempC = createCanvas(20, 20)
	const tempCtx = tempC.getContext("2d")
	tempCtx.imageSmoothingEnabled = false
	const sprites = JSON.parse(fs.readFileSync(t`sprites.json`, "utf8"))

	// create building data

	const buildings = {}

	for (const info of buildinginfo) {
		const building = {}
		Object.assign(building, info)
		delete building.className
		buildings[info.className] = building
	}


	for (const match of game_js.matchAll(/^buildings_(\w+)\.(\w+)\s*=\s*(\[?["\d][^;]*|\w+);$/gm)) {
		const className = match[1]
		if (className.startsWith("building")) continue
		const prop = match[2]
		let value
		try {
			value = JSON.parse(match[3])
		} catch(e) {
			value = match[3]
		}
		if (!buildings[className]) {
			buildings[className] = {}
		}
		buildings[className][prop] = value
	}
	for (const [key, value] of english_entries) {
		if (key.startsWith("buildinginfo.json/")) {
			const [className, prop] = key.replace("buildinginfo.json/","").split(".")
			if (!buildings[className]) {
				buildings[className] = {}
			}
			buildings[className][prop] = value
		}
	}

	fs.mkdirSync("dontAutoLoad/buildings")
	fs.mkdirSync("dontAutoLoad/wiki")
	fs.mkdirSync("dontAutoLoad/wiki/buildings")
	fs.mkdirSync("dontAutoLoad/wiki/buildingIcons")
	fs.mkdirSync("dontAutoLoad/wiki/buildingTables")
	
	for (const [className, info] of Object.entries(buildings)) {
		if (info.__isInterface__) {
			delete buildings[className]
			continue
		}
		if (info.spriteName) try {
			const {frame} = sprites.frames[info.spriteName+".png"]
			c.width = 20
			c.height = 20
			// with door
			ctx.clearRect(0, 0, c.width, c.height)
			if (info.buttonBack) {
				if (info.buttonBack != "none") {
					const {frame} = sprites.frames[info.buttonBack+".png"]
					ctx.drawImage(texture, -frame.x, -frame.y)
				}
			} else {
				ctx.drawImage(texture, -frame.x - 44, -frame.y)
			}
			ctx.drawImage(texture, -frame.x - 22, -frame.y)
			tempC.width = c.width * 15
			tempC.height = c.height * 15
			tempCtx.imageSmoothingEnabled = false
			tempCtx.drawImage(c, 0, 0, c.width * 15, c.height * 15)
			fs.writeFileSync(path.join("dontAutoLoad/wiki/buildings", className+".png"), toBuffer(tempC))
			fs.writeFileSync(path.join("dontAutoLoad/wiki/buildingIcons", "icon_"+className+"_door.png"), toBuffer(c))
			// without door
			ctx.clearRect(0, 0, c.width, c.height)
			if (info.buttonBack) {
				if (info.buttonBack != "none") {
					const {frame} = sprites.frames[info.buttonBack+".png"]
					ctx.drawImage(texture, -frame.x, -frame.y)
				}
			} else {
				ctx.drawImage(texture, -frame.x - 44, -frame.y)
			}
			ctx.drawImage(texture, -frame.x, -frame.y)
			tempC.width = c.width * 15
			tempC.height = c.height * 15
			tempCtx.imageSmoothingEnabled = false
			tempCtx.drawImage(c, 0, 0, c.width * 15, c.height * 15)
			fs.writeFileSync(path.join("dontAutoLoad/wiki/buildings", className+"_doorless.png"), toBuffer(tempC))
			fs.writeFileSync(path.join("dontAutoLoad/wiki/buildingIcons", "icon_"+className+".png"), toBuffer(c))
			Object.defineProperty(buildings[className], "hasValidWikiSprite", {
				enumerable: false,
				writable: true,
				value: true
			})
		} catch(e) {
			warn(className, "referenced missing sprite", info.spriteName, ":\n\t", e.message)
		}
		const bClass = $hxClasses["buildings."+className]
		if (bClass) {
			if (bClass.prototype.get_possibleUpgrades) info.upgrades = bClass.prototype.get_possibleUpgrades().map(e=>Resources.buildingUpgradesInfo.h[e.__name__])
			if (bClass.prototype.get_possibleBuildingModes) info.modes = bClass.prototype.get_possibleBuildingModes().map(e=>Resources.buildingUpgradesInfo.h[e.__name__])
			if (bClass.prototype.get_possibleCityUpgrades) info.cityUpgrades = bClass.prototype.get_possibleCityUpgrades().map(e=>e.__name__)
			if (bClass.prototype.get_possiblePolicies) info.policies = bClass.prototype.get_possiblePolicies().map(e=>e.__name__)
		}
		fs.writeFileSync(path.join("dontAutoLoad/buildings", className+".json"), JSON.stringify(info, null, "\t"))
		function getWikiCost(info, prefix="", includeknowledge) {
			return Object.entries(info).map(([key, value])=>{
				let filenames = {
					food: "Food",
					wood: "Wood",
					stone: "Stone",
					machineParts: "Machineparts",
					refinedMetal: "Refinedmetal",
					computerChips: "Computerchips",
					graphene: "Graphene",
					rocketFuel: "Rocketfuel",
					knowledge: "Knowledge"
				}
				if ((includeknowledge || key != "knowledge") && MaterialsHelper.materialNames.includes(key) && value) {
					return prefix+"[[File:"+filenames[key]+".png]] "+value.toLocaleString()+" "+(key == "refinedMetal" ? "Refined Metals" : MaterialsHelper.findMaterialDisplayName(MaterialsHelper.findMaterialIndex(key)))+"<br>"
				}
			}).filter(e=>e!=null).join("\n")
		}
		fs.writeFileSync(path.join("dontAutoLoad/wiki/buildingTables", className+".wiki"), `{{Building
|image=<gallery>
${className}.png|With door
${className}_doorless.png|Without door
</gallery>
${info.description ? `|description=''"${info.description.replace("!unlocks", " Also unlocks new buildings.")}"''` : ""}
|build_cost=${getWikiCost(info)}
${info.residents ? "|residents="+info.residents.toLocaleString() : ""}
${info.jobs ? "|jobs="+info.jobs.toLocaleString() : ""}
${info.quality ? "|quality="+info.quality.toLocaleString() : ""}
${info.knowledge ? "|research_cost=[[File:Knowledge.png]] "+info.knowledge.toLocaleString()+" Knowledge" : ""}
${info.teleporterOperatingCost ? "|operating_cost=[[File:Knowledge.png]] "+info.teleporterOperatingCost.toLocaleString()+" Knowledge per day" : ""}
${info.showUnlockHint ? "|requirements="+info.showUnlockHint : ""}
${info.upgrades?.map((e,i)=>{
return `|upgrade${i+1}='''${e.name}''': "''${e.description}''"
${getWikiCost(e, "* ", true)}`
}).join("\n")}
${info.modes?.map((e,i)=>{
return `|mode${i+1}='''${e.name}''': "''${e.description}''"
${getWikiCost(e, "* ", true)}`
}).join("\n")}
}}`.replace(/[\n\r]+/gm, "\n"))
	}

	// all sprites

	fs.mkdirSync("dontAutoLoad/sprites")
	fs.mkdirSync("dontAutoLoad/wiki/resources")
	for (const [filename, {frame}] of Object.entries(sprites.frames)) {
		try {
			c.width = frame.w
			c.height = frame.h
			ctx.clearRect(0, 0, c.width, c.height)
			ctx.drawImage(texture, -frame.x, -frame.y)
			fs.writeFileSync(path.join("dontAutoLoad/sprites", filename), toBuffer(c))
			if (filename.startsWith("spr_resource_")) {
				tempC.width = c.width * 2
				tempC.height = c.height * 2
				tempCtx.imageSmoothingEnabled = false
				tempCtx.drawImage(c, 0, 0, c.width * 2, c.height * 2)
				fs.writeFileSync(path.join("dontAutoLoad/wiki/resources", filename.replace("spr_resource_", "")), toBuffer(tempC))
			}
		} catch(e) {
			warn("error writing sprite :\n\t", e.message)
		}
	}

	// cleanup warnings

	for (const [className, building] of Object.entries(buildings)) {
		if (!building.hasValidWikiSprite) {
			warn("could not create building sprite for", className)
		}
	}

	// try to arrange game_js in a structured manner

	fs.mkdirSync("dontAutoLoad/js")
	let game_js_split = game_js.split(/^var \w+ = \$hx(?:C|E)/gm)
	let game_js_entries = {}
	for (let i = 0; i < game_js_split.length; i++) {
		let e = game_js_split[i]
		if (i == 0) {
			// first entry, make it index.js
			game_js_entries.index = e
			continue
		}
		let isClass = e.startsWith("lasses[")
		let key = JSON.parse(e.match(/\[[^\]]+?\]/)[0])[0]
		let value = "var " + key.replaceAll(".", "_") + " = $hx" + (isClass ? "C" : "E") + e
		if (i == game_js_split.length - 1) {
			// last entry, append the end bit to index.js
			let parts = e.split(/^function/gm)
			value = parts.shift()
			game_js_entries.index += "\nfunction" + parts.join("function")
		}
		game_js_entries[key] = value
	}
	for (const [k, v] of Object.entries(game_js_entries)) {
		let path_split = k.split(".")
		let filename = path_split.pop() + ".js"
		if (path_split.length > 0) {
			fs.mkdirSync("dontAutoLoad/js/"+path_split.join("/"), {
				recursive: true
			})
		}
		path_split.push(filename)
		let p = path_split.join("/")
		fs.writeFileSync("dontAutoLoad/js/"+p, v)
	}

	fs.writeFileSync("dontAutoLoad/log.txt", log.join("\n"))

	nw.Shell.openExternal(path.resolve("dontAutoLoad"))
	process.chdir(olddirname)
} catch(e) {
	require("process").chdir(olddirname)
	alert(e)
	console.error(e)
}