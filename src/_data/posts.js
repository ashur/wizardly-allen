const supabase = require( "../SupabaseClient" );

module.exports = async () =>
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
};
