module.exports = (req, res, next) =>
{
	if( req.headers["authorization"] !== process.env.APP_ADMIN_TOKEN )
	{
		console.log( "Failed login attempt:", {
			authorization: req.headers["authorization"],
			client: req.headers["client-ip"],
			agent: req.headers["user-agent"],
			resource: `${req.method} ${req.url}`,
		} );

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
