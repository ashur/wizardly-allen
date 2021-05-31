module.exports = (req, res, next) =>
{
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
