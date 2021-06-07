const express = require( "express" );
const parseBody = require( "./middleware/parse-body" );
const requireAuth = require( "./middleware/auth" );
const serverless = require( "serverless-http" );
const supabase = require( "../src/SupabaseClient" );

const app = express();
app.use( express.json() );

app.get( "/api/:apiVersion/posts/", async (req, res) =>
{
	let {data: posts, error} = await supabase.selectPosts();

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
		posts.sort( (a,b) =>
		{
			let createdA = new Date( a.created );
			let createdB = new Date( b.created );

			return createdB - createdA;
		});

		posts.forEach( post => post.tags = post.tags || [] );

		res.json({
			posts: posts,
		});
	}
});

app.get( "/api/:apiVersion/posts/:id", async (req, res) =>
{
	let {data: post, error} = await supabase.selectPost( req.params.id );

	if( error )
	{
		res.status( 500 );
		res.json({
			title: "Server Error",
			reason: "server-error",
			error: error,
		});
	}

	if( post && post.length > 0 )
	{
		res.json({
			post: post[0],
		});
	}
	else
	{
		res.status( 404 );
		res.json({
			title: "Not Found",
			reason: "not-found",
			error: error,
		});
	}
});

app.post( "/api/:apiVersion/posts", [requireAuth, parseBody], async (req, res) =>
{
	let {data: post, error} = await supabase.insertPost( req.body );

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
			post: post[0],
		});
	}
});

app.put( "/api/:apiVersion/posts/:id", [requireAuth, parseBody], async (req, res) =>
{
	let postId = parseInt( req.params.id );

	let updatedProperties = Object.assign( {}, req.body );
	delete updatedProperties.id

	let {data: post, error} = await supabase.updatePost( postId, updatedProperties );

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
	}
	else
	{
		res.json({
			post: post[0],
		});
	}
});

app.use( "*", async (req, res) =>
{
	res.status( 400 );
	res.json({ error: "Bad request" });
});

module.exports.handler = serverless( app );
