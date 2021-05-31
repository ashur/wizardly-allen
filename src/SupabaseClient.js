const { createClient } = require( "@supabase/supabase-js" );
require( "dotenv" ).config();

let supabase = createClient(
	process.env.SUPABASE_URL,
	process.env.SUPABASE_KEY
);

/**
 * @param {Object} post
 * @return {Promise<[Object]>}
 */
module.exports.insertPost = async (post) =>
{
	return supabase
		.from( "posts" )
		.insert([ post ]);
};

/**
 * @param {number} postId
 * @return {Promise<Object>}
 */
module.exports.selectPost = async (postId) =>
{
	return await supabase
		.from( "posts" )
		.select()
		.match( { id: postId } );
};

/**
 * @return {Promise<[Object]>}
 */
module.exports.selectPosts = async () =>
{
	return await supabase
		.from( "posts" )
		.select();
};

/**
 * @param {number} postId
 * @param {Object} updatedPost
 * @return {Promise<[Object]>}
 */
module.exports.updatePost = async (postId, updatedPost) =>
{
	return await supabase
		.from( "posts" )
		.update( updatedPost )
		.match( { id: postId } );
};
