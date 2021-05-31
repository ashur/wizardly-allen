module.exports = (req, res, next) =>
{
	let parsedBody = {};

	Object.keys( req.body ).forEach( key =>
	{
		let oldValue = req.body[key];

		if( typeof oldValue === "string" )
		{
			try {
				parsedBody[key] = JSON.parse( oldValue );
			}
			catch( error )
			{
				parsedBody[key] = oldValue;
			}
		}
	});

	req.body = parsedBody;

	next();
};
