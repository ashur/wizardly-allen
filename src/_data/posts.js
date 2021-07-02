const supabase = require( "../SupabaseClient" );

module.exports = async () =>
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
			return {
				posts: posts.map( post =>
				{
					post.tags = post.tags || [];
					return post;
				}),
			};
		}
	}
	catch( error )
	{
		if( process.env.NODE_ENV === "production" )
		{
			console.error( error );
		}
		else
		{
			return {
				posts: [],
			};
		}
	}
};
