/* global describe, it */
const Feed = require( "../src/Feed" );
const {assert} = require( "chai" );

describe( "Feed", () =>
{
	it( "should use options to populate options", () =>
	{
		let options = {
			site: {
				url: "https://example.com",
				title: "Example Feed",
				author: {
					name: "Lauren Ipsum",
					link: "https://example.com/lipsum"
				}
			},
			subscriptionHash: "",
			posts: [],
			ignoredTags: [],
		};

		let feed = new Feed( options );

		assert.equal( feed.feed.options.title, options.site.title, "title" );
		assert.equal( feed.feed.options.description, options.site.description, "description" );
		assert.equal( feed.feed.options.link, options.site.url, "link" );
		assert.equal( feed.feed.options.id, options.site.url, "id" );
		assert.deepEqual( feed.feed.options.author, options.site.author, "author" );
	});

	it( "should use site.url and subscriptionHash for feed URL", () =>
	{
		let options = {
			site: {
				url: "https://example.com",
			},
			subscriptionHash: "a0b1c2d3",
			posts: [],
			ignoredTags: [],
		};

		let feed = new Feed( options );

		assert.equal( feed.feed.options.feedLinks.json, `${options.site.url}/feeds/${options.subscriptionHash}` );
		assert.equal( feed.feed.options.feedLinks.rss, `${options.site.url}/feeds/${options.subscriptionHash}.xml` );
	});

	it( "should use posts as items", () =>
	{
		let options = {
			site: {
				url: "https://example.com",
				title: "Example Feed",
				author: {
					name: "Lauren Ipsum",
					link: "https://example.com/lipsum"
				}
			},
			subscriptionHash: "a0b1c2d3",
			posts: [
				{
					id: 1,
					created: "2021-05-23T19:57:23.455317",
					url: "https://example.com/foo/bar",
					title: "Foo Bar",
					body: "Lorem ipsum dolor sit amet",
					tags: ["Boo","Far"],
					source: {}
				}
			],
			ignoredTags: [],
		};

		let feed = new Feed( options );

		assert.equal( feed.feed.items.length, options.posts.length );
		assert.equal( feed.feed.items[0].title, options.posts[0].title );
	});

	it( "should convert body contents from Markdown to HTML", () =>
	{
		let options = {
			site: {
				url: "https://example.com",
				title: "Example Feed",
				author: {
					name: "Lauren Ipsum",
					link: "https://example.com/lipsum"
				}
			},
			subscriptionHash: "a0b1c2d3",
			posts: [
				{
					id: 1,
					created: "2021-05-23T19:57:23.455317",
					url: "https://example.com/foo/bar",
					title: "Foo Bar",
					body: "_Lorem ipsum dolor sit amet_",
					tags: ["Boo","Far"],
					source: {}
				}
			],
			ignoredTags: [],
		};

		let feed = new Feed( options );
		let contentLines = feed.feed.items[0].content
			.split( "\n" )
			.filter( line => line.length > 0 );

		assert.equal( contentLines[0], "<p><em>Lorem ipsum dolor sit amet</em></p>" );
	});

	it( "should append image after content if defined", () =>
	{
		let options = {
			site: {
				url: "https://example.com",
				title: "Example Feed",
				author: {
					name: "Lauren Ipsum",
					link: "https://example.com/lipsum"
				}
			},
			subscriptionHash: "a0b1c2d3",
			posts: [
				{
					id: 1,
					created: "2021-05-23T19:57:23.455317",
					url: "https://example.com/foo/bar",
					title: "Foo Bar",
					body: "_Lorem ipsum dolor sit amet_",
					tags: ["Boo","Far"],
					image: "https://example.com/foo.png",
					source: {}
				}
			],
			ignoredTags: [],
		};

		let feed = new Feed( options );
		let contentLines = feed.feed.items[0].content
			.split( "\n" )
			.filter( line => line.length > 0 );

		assert.equal( contentLines[1], `<p><img src="${options.posts[0].image}" alt=""></p>` );
	});

	it( "should append source after content, image if defined", () =>
	{
		let options = {
			site: {
				url: "https://example.com",
				title: "Example Feed",
				author: {
					name: "Lauren Ipsum",
					link: "https://example.com/lipsum"
				}
			},
			subscriptionHash: "a0b1c2d3",
			posts: [
				{
					id: 1,
					created: "2021-05-23T19:57:23.455317",
					url: "https://example.com/foo/bar",
					title: "Foo Bar",
					body: "_Lorem ipsum dolor sit amet_",
					tags: ["Boo","Far"],
					image: "https://example.com/foo.png",
					source: {
						name: "Whizbang",
						url: "https://example.com/whizbang"
					}
				}
			],
			ignoredTags: [],
		};

		let feed = new Feed( options );
		let contentLines = feed.feed.items[0].content
			.split( "\n" )
			.filter( line => line.length > 0 );

		assert.equal( contentLines[2], `<p><em>via <a href="${options.posts[0].source.url}">${options.posts[0].source.name}</a></em></p>` );
	});

	it( "should append configuration link to every post", () =>
	{
		let options = {
			site: {
				url: "https://example.com",
				title: "Example Feed",
				author: {
					name: "Lauren Ipsum",
					link: "https://example.com/lipsum"
				}
			},
			subscriptionHash: "a0b1c2d3",
			posts: [
				{
					id: 1,
					created: "2021-05-23T19:57:23.455317",
					url: "https://example.com/foo/bar",
					title: "Foo Bar",
					body: "_Lorem ipsum dolor sit amet_",
					tags: ["Boo","Far"],
					source: {}
				}
			],
			ignoredTags: [],
		};

		let feed = new Feed( options );
		let contentLines = feed.feed.items[0].content
			.split( "\n" )
			.filter( line => line.length > 0 );

		assert.equal( contentLines[1], `<p><a href="${options.site.url}/configure/${options.subscriptionHash}">⚙︎</a></p>` );
	});

	it( "should filter posts that contain ignored tags (case insensitive)", () =>
	{
		let options = {
			site: {
				url: "https://example.com",
				title: "Example Feed",
				author: {
					name: "Lauren Ipsum",
					link: "https://example.com/lipsum"
				}
			},
			subscriptionHash: "a0b1c2d3",
			posts: [
				{
					id: 1,
					created: "2021-05-23T19:57:23.455317",
					url: "https://example.com/post-1",
					title: "Post 1",
					body: "_Lorem ipsum dolor sit amet_",
					tags: ["Boo","Far"],
					source: {}
				},
				{
					id: 2,
					created: "2021-05-24T19:57:23.455317",
					url: "https://example.com/post-2",
					title: "Post 2",
					body: "_Lorem ipsum dolor sit amet_",
					tags: [],
					source: {}
				},
				{
					id: 3,
					created: "2021-05-25T19:57:23.455317",
					url: "https://example.com/post-3",
					title: "Post 3",
					body: "_Lorem ipsum dolor sit amet_",
					tags: ["Baz", "Boz"],
					source: {}
				}
			],
			ignoredTags: ["boo", "baz"],
		};

		let feed = new Feed( options );

		assert.equal( feed.feed.items.length, 1, "Items in feed" );
		assert.equal( feed.feed.items[0].title, options.posts[1].title );
	});

	it( "should sort posts in reverse chronological order", () =>
	{
		let options = {
			site: {
				url: "https://example.com",
				title: "Example Feed",
				author: {
					name: "Lauren Ipsum",
					link: "https://example.com/lipsum"
				}
			},
			subscriptionHash: "a0b1c2d3",
			posts: [
				{
					id: 1,
					created: "2021-01-23T19:57:23.455317",
					url: "https://example.com/post-1",
					title: "Post 1",
					body: "_Lorem ipsum dolor sit amet_",
					tags: ["Boo","Far"],
					source: {}
				},
				{
					id: 3,
					created: "2021-03-24T19:57:23.455317",
					url: "https://example.com/post-3",
					title: "Post 3",
					body: "_Lorem ipsum dolor sit amet_",
					tags: [],
					source: {}
				},
				{
					id: 2,
					created: "2021-02-25T19:57:23.455317",
					url: "https://example.com/post-2",
					title: "Post 2",
					body: "_Lorem ipsum dolor sit amet_",
					tags: ["Baz", "Boz"],
					source: {}
				}
			],
			ignoredTags: [],
		};

		let feed = new Feed( options );

		assert.equal( feed.feed.items[0].title, options.posts[1].title );
		assert.equal( feed.feed.items[1].title, options.posts[2].title );
		assert.equal( feed.feed.items[2].title, options.posts[0].title );
	});
});
