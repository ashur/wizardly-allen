const { createClient } = require( "@supabase/supabase-js" );
require( "dotenv" ).config();

let supabase = createClient(
	process.env.SUPABASE_URL,
	process.env.SUPABASE_KEY
);

/**
 * @param {Object} post
 * @return {Promise<Object[]>}
 */
module.exports.insertPost = async (post) =>
{
	return supabase
		.from( "posts" )
		.insert([ post ]);
};

/**
 * @param {Object} subscription
 * @return {Promise<Object[]>}
 */
module.exports.createSubscription = async (subscription) =>
{
	return supabase
		.from( "subscriptions" )
		.insert([ subscription ]);
};

/**
 * @param {string} subscriptionHash
 * @return {Promise<Object>}
 */
module.exports.getSubscription = async (subscriptionHash) =>
{
	return await supabase
		.from( "subscriptions" )
		.select()
		.match( { hash: subscriptionHash } );
};

/**
 * @return {Promise<Object>}
 */
module.exports.getSubscriptions = async () =>
{
	return await supabase
		.from( "subscriptions" )
		.select();
};

/**
 * @param {Number} postId
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
 * @return {Promise<Object[]>}
 */
module.exports.selectPosts = async () =>
{
	return await supabase
		.from( "posts" )
		.select();
};

/**
 * @param {Number} postId
 * @param {Object} updatedPost
 * @return {Promise<Object[]>}
 */
module.exports.updatePost = async (postId, updatedPost) =>
{
	return await supabase
		.from( "posts" )
		.update( updatedPost )
		.match( { id: postId } );
};

/**
 * @param {Number} subscriptionHash
 * @param {Object} updatedSubscription
 * @return {Promise<Object[]>}
 */
module.exports.updateSubscription = async (subscriptionHash, updatedSubscription) =>
{
	if( Object.keys( updatedSubscription ).length === 0 )
	{
		return {
			data: null,
			error: {
				status: 304,
				title: "Not Modified",
				reason: "not-modified",
			},
		};
	}

	return await supabase
		.from( "subscriptions" )
		.update( updatedSubscription )
		.match( { hash: subscriptionHash } );
};
