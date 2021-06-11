const {Feed: FeedLibrary} = require( "feed" );
const md = require( "markdown-it" )({
	html: true,
	typographer: true,
	breaks: true,
});

class Feed
{
	/**
	 * @param {Object} options
	 * @param {Object} options.site
	 * @param {string} options.site.title
	 * @param {string} options.site.url
	 * @param {string} options.subscriptionHash
	 * @param {Object[]} options.posts
	 * @param {string[]} options.ignoredTags
	 */
	constructor( options )
	{
		let feedOptions = {
			title: options.site.title,
			description: options.site.description,
			link: options.site.url,
			id: options.site.url,
			author: options.site.author,
			feedLinks: {
				json: `${options.site.url}/feeds/${options.subscriptionHash}`,
				rss: `${options.site.url}/feeds/${options.subscriptionHash}.xml`,
			},
		};

		this.feed = new FeedLibrary( feedOptions );

		options.posts
			.filter ( post =>
			{
				let ignoredTags = options.ignoredTags.map( tag => tag.toLowerCase() );
				return !post.tags.some( tag =>
				{
					return ignoredTags.includes( tag.toLowerCase() );
				})
			})
			.map( post =>
			{
				post.content = "";
				post.content += md.render( post.body );

				if( post.image )
				{
					post.content += `\n<p><img src="${post.image}" alt=""></p>`
				}
				if( post.source && post.source.url )
				{
					post.content += `\n<p><em>via <a href="${post.source.url}">${post.source.name}</a></em></p>`;
				}

				post.content += `\n<p><a href="${options.site.url}/configure/${options.subscriptionHash}">⚙︎</a></p>`;

				return post;
			})
			.sort( (a,b) =>
			{
				let createdA = new Date( a.created );
				let createdB = new Date( b.created );

				return createdB - createdA;
			})
			.forEach( post =>
			{
				this.feed.addItem({
					title: post.title,
					id: post.url,
					link: post.url,
					description: post.description,
					content: post.content,
					date: new Date( post.created ),
					image: post.image
				});
			});

		return;

		// let feedOptions = Object.assign( {}, site );

// 		posts
// 			.filter( post =>
// 			{
// 				return !post.tags.some( tag => ignoredTags.includes( tag ) );
// 			})
// 			.sort( (a, b) =>
// 			{
// 				let createdA = new Date( a.created );
// 				let createdB = new Date( b.created );
// 				return createdB - createdA;
// 			})
// 			.map( post =>
// 			{
// 				post.description = md.render( post.body );
//
// 				// Content
// 				post.content = "";
// 				post.content += md.render( post.body );
//
// 				if( post.image )
// 				{
// 					post.content += `<img src="${post.image}" alt="">`
// 				}
//
// 				if( post.source && post.source.url )
// 				{
// 					post.content += md.render( `\nvia [${post.source.name}](${post.source.url})` )
// 				}
//
// 				post.content += md.render( `\n[⚙︎](${site.url}/configure/${subscriptionHash})` );
//
// 				return post;
// 			})
// 			.forEach( post =>
// 			{
// 				this.feed.addItem({
// 					title: post.title,
// 					id: post.url,
// 					link: post.url,
// 					description: post.description,
// 					content: post.content,
// 					date: new Date( post.created ),
// 					image: post.image
// 				});
// 			});
	}

	/**
	 * @returns {}
	 */
	atom()
	{
		return this.feed.atom1()
	}


	/**
	 * @returns {}
	 */
	json()
	{
		return this.feed.json1()
	}

	/**
	 * @returns {}
	 */
	rss()
	{
		return this.feed.rss2()
	}
}

module.exports = Feed;
