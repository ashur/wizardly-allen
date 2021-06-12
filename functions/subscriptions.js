const express = require( "express" );
const parseBody = require( "./middleware/parse-body" );
const requireAuth = require( "./middleware/auth" );
const {serverError} = require( "./utils/error" );
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
	try
	{
		let {data: subscriptions, error: supabaseError} = await supabase.getSubscriptions();

		if( supabaseError )
		{
			throw new Error( supabaseError.message );
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
	}
	catch( error )
	{
		serverError( error, res );
	}
});

/**
 * Fetch a single subscription
 *
 * @method GET
 */
app.get( "/api/:apiVersion/subscriptions/:hash", async (req, res) =>
{
	try
	{
		let {data: subscriptions, error: supabaseError} = await supabase.getSubscription( req.params.hash );

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
	}
	catch( error)
	{
		serverError( error, res );
	}
});

/**
 * Create a new subscription
 *
 * @method POST
 */
app.post( "/api/:apiVersion/subscriptions", async (req, res) =>
{
	try
	{
		let {data: subscriptions, error: supabaseError} = await supabase.createSubscription
		(
			{
				hash: uniqueSlug( Date.now().toString() + uniqueSlug() ),
				ignored_tags: [],
			}
		);

		if( supabaseError )
		{
			throw new Error( supabaseError.message );
		}
		else
		{
			res.json({
				subscription: subscriptions[0],
			});
		}
	}
	catch( error )
	{
		serverError( error, res );
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

	try
	{
		let {data: subscriptions, error: supabaseError} = await supabase.updateSubscription( req.params.hash, updatedProperties );

		if( supabaseError )
		{
			// Attempting to update non-existent record
			if( Array.isArray( supabaseError ) && supabaseError.length === 0 )
			{
				res.status( 404 );
				res.json({
					title: "Not Found",
					reason: "not-found",
				});
			}
			else
			{
				throw new Error( supabaseError.message );
			}
		}
		else
		{
			res.json({
				subscription: subscriptions[0],
			});
		}
	}
	catch( error )
	{
		serverError( error, res );
	}
});

app.use( "*", async (req, res) =>
{
	res.status( 400 );
	res.json({ error: "Bad request" });
});

module.exports.handler = serverless( app );
