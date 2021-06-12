const uniqueSlug = require( "unique-slug" );

module.exports.serverError = (error, res, status=500) =>
{
	let errorSlug = uniqueSlug();

	let errorLog = {
		id: errorSlug,
		error: error.message || error,
		name: error.name,
	};

	if( error.stack )
	{
		errorLog.stack = error.stack;
	}

	console.error( "Server Error:", errorLog );

	if( !res.headersSent )
	{
		res.status( status );
		res.json({
			title: "Server Error",
			reason: "server-error",
			id: errorSlug,
		});
	}
	else
	{
		console.log( "Notice: Error not sent to client, headers already sent" );
	}
};
