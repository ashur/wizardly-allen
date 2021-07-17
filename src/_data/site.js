module.exports = {
	title: "The Invisible Link Company",
	description: {
		short: "An RSS-only link blog",
		long: "A link blog available only via RSS"
	},
	url: process.env.DEPLOY_PRIME_URL || process.env.URL || "https://invisiblelink.co",
	language: "en",
	author: {
		name: "Ashur Cabrera",
		link: "https://ashur.cab/rera"
	},
	assetsDomain: process.env.NODE_ENV === "production" ? "https://assets.invisiblelink.co" : "",
	apiVersion: 1,
};
