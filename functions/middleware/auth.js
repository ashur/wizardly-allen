/**
 * Requests must include an `Authorization: Bearer <token>` header, which
 * exposes Netlify Identity context.
 *
 * @see https://docs.netlify.com/functions/functions-and-identity/
 */
module.exports.requireAuth = (req, res, next) =>
{
	let clientContext = req.apiGateway.context.clientContext;

	if( !clientContext.identity )
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
