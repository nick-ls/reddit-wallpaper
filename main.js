const request = require("request");
const wallpaper = require("wallpaper");
const fs = require("fs");
const os = require("os");
const platform = process.platform;

var subreddits = [];
var frequency = 1;
var imgnum = 0;
var cache = [];
var currentInterval;

fs.readFile("profiles.json",(err,data)=>{
	var data = JSON.parse(data);
	subreddits = data["default"];
	frequency = data["frequency"]*3600000;
	fetchImages();
})

function fetchImages() {
	for (var i = 0; i < subreddits.length; i++) {
		let key = Object.keys(subreddits[i])[0];
		let val = Object.values(subreddits[i])[0];
		let subreddit = `https://www.reddit.com/r/${key}/${val}/.json?limit=50`;
		request(subreddit,(err,res,data)=>{
			if (!err && res.statusCode==200) {
				var data = JSON.parse(data).data.children;
				for (var x = 0; x < data.length; x++) {
					let filetype = data[x].data.url.match(/[^.]+$/g)[0];
					if (["png","jpg","jpeg"].includes(filetype)) {
						cache.push(data[x].data.url);
					}
				}
			}
		});
	}
	currentInterval = setInterval(changeWallpaper,frequency);
}

function changeWallpaper() {
	currentImg = cache[Math.floor(Math.random()*cache.length)];
	request(currentImg,{encoding:"binary"},(error,response,imgdata)=>{
		if (!error && response.statusCode == "200") {
			let filetype = currentImg.match(/[^.]+$/g)[0];
			if (!fs.existsSync(os.homedir()+"/.wallpapers")) {
				fs.mkdir(os.homedir()+"/.wallpapers/",{recursive:true},direrror=>{
					if (direrror) {
						console.log(direrror);
					}
				});
			}
			fs.writeFile(`${os.homedir()}/.wallpapers/wallpaper${imgnum}.${filetype}`,imgdata,"binary",(errorwriting)=>{
				if (!errorwriting) {
					wallpaper.set(`${os.homedir()}/.wallpapers/wallpaper${imgnum}.${filetype}`).then(promise=>{
						console.log(promise);
					});
					imgnum++;
				}
			});
		}
	})
}