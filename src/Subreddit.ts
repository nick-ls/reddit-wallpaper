import fetch from "node-fetch";

export type Sort = "hot" | "top" | "new";
export type Time = "hour" | "day" | "week" | "month" | "year" | "all";

export default class Subreddit {
	private dataUrl: string;
	private cacheUrls: any;

	constructor(name: string, sort: Sort, time: Time) {
		this.dataUrl = `https://www.reddit.com/r/${name}/${sort}.json?t=${time}&limit=25`;
		this.updateCache();
	}

	getRandomImage() {

	}
	async updateCache() {
		let response = await fetch(this.dataUrl);
		let body = await response.json();
		this.cacheUrls = body.data.children.map((post: any)=>post.data.url);
		console.log(body);
	}
}