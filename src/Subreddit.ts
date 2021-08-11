import fetch from "node-fetch";
import { RequestInfo } from "node-fetch";

export type Sort = "hot" | "top" | "new";
export type Time = "hour" | "day" | "week" | "month" | "year" | "all";

export default class Subreddit {
	private dataUrl: string;
	private cacheUrls: any;

	constructor(name: string, sort: Sort, time: Time) {
		this.dataUrl = `https://www.reddit.com/r/${name}/${sort}.json?t=${time}&limit=50`;
		this.updateCache();
	}

	getRandomImage() {

	}
	async updateCache() {
		let response = await fetch(this.dataUrl);
		let body = await response.json();
		this.cacheUrls = body.data.children.map((post:any)=>post.data.url).filter(async (url: string)=> {
			let headers = (await fetch(url, {method: "HEAD"})).headers;
			return ["image/jpeg", "image/png"].includes(headers.get("Content-Type") as string);
		});
		console.log(this.cacheUrls)
	}
}