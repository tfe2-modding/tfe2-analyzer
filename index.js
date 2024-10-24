const fs = require("fs")
const path = require("path")
const tfe2Path = "C:/Program Files (x86)/Steam/steamapps/common/The_Final_Earth_2/game"

function t(s,...v) {
	return path.join(tfe2Path, String.raw({raw:s},...v))
}

fs.rmSync("analyzer-output", {
	recursive: true,
	force: true,
})

fs.mkdirSync("analyzer-output")

function lang(inp) {
	return Object.fromEntries(inp.match(/.+/gm).map(e=>e.split("|")))
}

function warn(...args) {
	console.warn("[ANALYZER WARN]", ...args)
}

function createCanvas(width, height) {
	const canvas = document.createElement('canvas')
	canvas.width = width
	canvas.height = height
	return canvas
}

const game_js = fs.readFileSync(t`js/game_js.js`, "utf8")
const english = lang(fs.readFileSync(t`lang_en.csv`, "utf8"))
const english_entries = Object.entries(english)
const buildinginfo = JSON.parse(fs.readFileSync(t`buildinginfo.json`, "utf8"))
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

fs.mkdirSync("analyzer-output/wiki")
fs.mkdirSync("analyzer-output/wiki/buildings")

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

fs.mkdirSync("analyzer-output/buildings")

for (const [className, info] of Object.entries(buildings)) {
	if (info.__isInterface__) {
		delete buildings[className]
		continue
	}
	if (info.spriteName) try {
		const {frame} = sprites.frames[info.spriteName+".png"]
		c.width = 20
		c.height = 20
		ctx.clearRect(c.width, c.height)
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
		fs.writeFileSync(path.join("analyzer-output/wiki/buildings", className+".png"), tempC.toBuffer())
		Object.defineProperty(buildings[className], "hasValidWikiSprite", {
			enumerable: false,
			writable: true,
			value: true
		})
	} catch(e) {
		warn(className, "referenced missing sprite", info.spriteName, ":\n\t", e.message)
	}
	fs.writeFileSync(path.join("analyzer-output/buildings", className+".json"), JSON.stringify(info, null, "\t"))
}

// all sprites

fs.mkdirSync("analyzer-output/sprites")
fs.mkdirSync("analyzer-output/wiki/resources")
for (const [filename, {frame}] of Object.entries(sprites.frames)) {
	try {
		c.width = frame.w
		c.height = frame.h
		ctx.clearRect(c.width, c.height)
		ctx.drawImage(texture, -frame.x, -frame.y)
		fs.writeFileSync(path.join("analyzer-output/sprites", filename), c.toBuffer())
		if (filename.startsWith("spr_resource_")) {
			tempC.width = c.width * 2
			tempC.height = c.height * 2
			tempCtx.imageSmoothingEnabled = false
			tempCtx.drawImage(c, 0, 0, c.width * 2, c.height * 2)
			fs.writeFileSync(path.join("analyzer-output/wiki/resources", filename.replace("spr_resource_", "")), tempC.toBuffer())
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