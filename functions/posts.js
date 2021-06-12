const express = require( "express" );
const parseBody = require( "./middleware/parse-body" );
const requireAuth = require( "./middleware/auth" );
const {serverError} = require( "./utils/error" );
const serverless = require( "serverless-http" );
const supabase = require( "../src/SupabaseClient" );

const app = express();
app.use( express.json() );

app.get( "/api/:apiVersion/posts/", async (req, res) =>
{
	try
	{
		let {data: posts, error: supabaseError} = await supabase.selectPosts();

		if( supabaseError )
		{
			throw new Error( supabaseError.message );
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
	}
	catch( error )
	{
		serverError( error, res );
	}
});

app.get( "/api/:apiVersion/posts/:id", async (req, res) =>
{
	try
	{
		let {data: posts, error: supabaseError} = await supabase.selectPost( req.params.id );

		if( supabaseError )
		{
			throw new Error( supabaseError.message );
		}

		if( posts && posts.length > 0 )
		{
			res.json({
				post: posts[0],
			});
		}
		else
		{
			res.status( 404 );
			res.json({
				title: "Not Found",
				reason: "not-found"
			});
		}
	}
	catch( error )
	{
		serverError( error, res );
	}
});

app.post( "/api/:apiVersion/posts", [requireAuth, parseBody], async (req, res) =>
{
	try
	{
		let {data: posts, error: supabaseError } = await supabase.insertPost( req.body );

		if( supabaseError )
		{
			throw new Error( supabaseError.message );
		}
		else
		{
			res.json({
				post: posts[0],
			});
		}
	}
	catch( error )
	{
		serverError( error, res );
	}
});

app.put( "/api/:apiVersion/posts/:id", [requireAuth, parseBody], async (req, res) =>
{
	try
	{
		let postId = parseInt( req.params.id );

		let updatedProperties = Object.assign( {}, req.body );
		delete updatedProperties.id;

		let {data: posts, error: supabaseError } = await supabase.updatePost( postId, updatedProperties );

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
				post: posts[0],
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
