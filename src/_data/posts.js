const supabase = require( "../SupabaseClient" );

module.exports = async () =>
{
	let {data: posts, error} = await supabase.selectPosts();

	if( error )
	{
		throw new Error( error );
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
