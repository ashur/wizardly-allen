const uniqueSlug = require( "unique-slug" );

module.exports.serverError = (error, res, status=500) =>
{
	let errorSlug = uniqueSlug();

	console.log( "message:", error.message );

	let errorLog = {
		id: errorSlug,
		error: error.message || error,
	};

	if( error.stack )
	{
		errorLog.stack = error.stack;
	}

	console.log( "Server Error:", errorLog );

	res.status( status );
	res.json({
		title: "Server Error",
		reason: "server-error",
		id: errorSlug,
	});
};
