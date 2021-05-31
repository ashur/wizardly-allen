module.exports = (req, res, next) =>
{
	console.log( req.headers );
	console.log( process.env );

	if( req.headers["authorization"] !== process.env.APP_ADMIN_TOKEN )
	{
		res.status( 401 );
		res.json({
			title: "Unauthorized",
			reason: "unauthorized",
		});
	}
	else
	{
		next();
	}
};
