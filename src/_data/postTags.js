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
		let tags = {};

		posts.forEach( post =>
		{
			let postTags = post.tags || [];
			postTags.forEach( tag =>
			{
				if( tags[tag] )
				{
					tags[tag]++;
				}
				else
				{
					tags[tag] = 1;
				}
			});
		});

		let popularTags = Object.keys( tags )
			.sort( (a,b) =>
			{
				if( tags[b] - tags[a] === 0 )
				{
					if( a > b )
					{
						return 1;
					}
					if( a < b )
					{
						return -1;
					}
				}
				else
				{
					return tags[b] - tags[a];
				}
			});

		return {
			tags: popularTags
		};
	}
};
