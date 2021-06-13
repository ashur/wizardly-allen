const express = require( "express" );
const Feed = require( "../src/Feed" );
const parseBody = require( "./middleware/parse-body" );
const path = require( "path" );
const {serverError} = require( "./utils/error" );
const serverless = require( "serverless-http" );
const site = require( "../src/_data/site" );
const supabase = require( "../src/SupabaseClient" );

const {posts} = require( "./data/posts.json" );
const {tags} = require( "./data/tags.json" )

const app = express();
app.use( express.json() );

/**
 * Fetch a single feed
 *
 * @method GET
 */
async function getFeed (req, res)
{
	let ext = path.extname( req.params.hash );
	let hash = path.basename( req.params.hash, ext );
	let format = ext === ".xml" ? "rss" : "json";

	try
	{
		let {data: subscriptions, error: supabaseError} = await supabase.getSubscription( hash );

		if( supabaseError )
		{
			throw new Error( supabaseError.message );
		}
		else
		{
			if( subscriptions.length === 0 )
			{
				res.status( 404 );
				res.json({
					title: "Not Found",
					reason: "not-found",
				});
			}
			else
			{
				let fetched = new Date();
				let subscription = subscriptions[0];

				let feedPosts = Object.assign( [], posts );
				let popularTags = tags.slice( 0, 5 );

				let welcomeBody = `Hello! Thank you for subscribing to this strange little [tumblelog](https://kottke.org/05/10/tumblelogs), available only via RSS.\n\n## RSS only?\n\n ## What can I expect?\n\nPopular topics include:\n${popularTags.map( tag => `- ${tag}` ).join( "\n" )}\n\n### Customize your feed\n\nNaturally, not everything will strike your fancy, but maybe there’s a particular topic that's just not your jam.\n\nAt the bottom of every post you'll find a “⚙︎” link to fine-tune your feed so you see only the links you're interested in.\n\nI think that's it! Poke around the backlog if you're curious, but don't worry too much what's already come and gone. Let what's in store .\n\nxoxo,\n[Ashur](${site.author.link})`;

				feedPosts.push({
					created: subscription.created,
					url: `${site.url}/configure/${hash}`,
					title: `🍍 Welcome to ${site.title}`,
					body: welcomeBody,
					tags: [],
				});

				console.log( "feeds.js: site >>>", site )

				let feed = new Feed({
					site: site,
					subscriptionHash: subscription.hash,
					posts: feedPosts,
					ignoredTags: subscription.ignored_tags || []
				});

				res.send( feed[format]() );

				await supabase.updateSubscription(
					subscription.hash,
					{
						fetched: fetched,
					},
				);
			}
		}
	}
	catch( error )
	{
		// If there's a server error, tell the RSS client the user's feed hasn't
		// changed to avoid getting banned
		serverError( error, req, res, 304 );
	}
}

app.get( "/api/:apiVersion/feeds/:hash", getFeed );
app.get( "/feed/:hash", getFeed );

app.use( "*", async (req, res) =>
{
	res.status( 400 );
	res.json({ error: "Bad request" });
});

module.exports.handler = serverless( app );
