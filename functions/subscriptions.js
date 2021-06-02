const express = require( "express" );
const parseBody = require( "./middleware/parse-body" );
const requireAuth = require( "./middleware/auth" );
const serverless = require( "serverless-http" );
const supabase = require( "../src/SupabaseClient" );
const uniqueSlug = require( "unique-slug" );

const app = express();
app.use( express.json() );

/**
 * Fetch all subscriptions
 *
 * @method GET
 * @restricted true
 */
app.get( "/api/:apiVersion/subscriptions/", [requireAuth], async (req, res) =>
{
	let {data: subscriptions, error} = await supabase.getSubscriptions();

	if( error )
	{
		res.status( 500 );
		res.json({
			title: "Server Error",
			reason: "server-error",
			error: error,
		});
	}
	else
	{
		subscriptions.sort( (a,b) =>
		{
			let createdA = new Date( a.created );
			let createdB = new Date( b.created );

			return createdB - createdA;
		});

		res.json({
			subscriptions: subscriptions,
		});
	}
});

/**
 * Fetch a single subscription
 *
 * @method GET
 */
app.get( "/api/:apiVersion/subscriptions/:hash", async (req, res) =>
{
	let {data: subscriptions, error} = await supabase.getSubscription( req.params.hash );
	console.log( {subscriptions}, {error} );

	if( error )
	{
		let errorSlug = uniqueSlug();

		console.log( "Server Error:", {
			id: errorSlug,
			error: error,
		});

		res.status( 500 );
		res.json({
			title: "Server Error",
			reason: "server-error",
			id: errorSlug,
		});
	}
	else
	{
		if( subscriptions.length === 0 )
		{
			res.status( 404 );
			res.json({
				title: "Not Found",
				reason: "not-found",
				error: error,
			});
		}
		else
		{
			let fetched = new Date();
			let subscription = subscriptions[0];
			subscription.fetched = fetched;

			res.json({
				subscription: subscription,
			});

			await supabase.updateSubscription(
				subscription.hash,
				{
					fetched: fetched,
				},
			);
		}
	}
});

/**
 * Create a new subscription
 *
 * @method POST
 */
app.post( "/api/:apiVersion/subscriptions", async (req, res) =>
{
	let {data: subscriptions, error} = await supabase.createSubscription
	(
		{
			hash: uniqueSlug( Date.now().toString() + uniqueSlug() ),
			ignored_tags: [],
		}
	);

	if( error )
	{
		res.status( 400 );
		res.json({
			title: "Bad Request",
			reason: "bad-request",
			error: error,
		});
	}
	else
	{
		res.json({
			subscription: subscriptions[0],
		});
	}
});

/**
 * Update a subscription
 *
 * @method PUT
 */
app.put( "/api/:apiVersion/subscriptions/:hash", [parseBody], async (req, res) =>
{
	let updatedProperties = Object.assign( {}, req.body );
	delete updatedProperties.id;
	delete updatedProperties.hash;

	let {data: subscriptions, error} = await supabase.updateSubscription( req.params.hash, updatedProperties );

	if( error )
	{
		if( Array.isArray( error ) && error.length === 0 )
		{
			res.status( 404 );
			res.json({
				title: "Not Found",
				reason: "not-found",
			});
		}
		else if( error.status )
		{
			res.status( error.status );
			res.json({
				title: error.title,
				reason: error.reason,
			});
		}
	}
	else
	{
		res.json({
			subscription: subscriptions[0],
		});
	}
});

app.use( "*", async (req, res) =>
{
	res.status( 400 );
	res.json({ error: "Bad request" });
});

module.exports.handler = serverless( app );
