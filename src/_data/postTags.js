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

		let sortedTags = Object.keys( tags )
			.sort( (a,b) =>
			{
				if( tags[b] - tags[a] === 0 )
				{
					return( "" + b.attr).localeCompare( a.attr );
				}
				else
				{
					return tags[b] - tags[a];
				}
			});

		return {
			tags: tags,
			sortedTags: sortedTags,
		};
	}
};
