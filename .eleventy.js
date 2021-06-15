const nunjucksComponents = require( "@aaashur/eleventy-plugin-nunjucks-components" );

module.exports = config =>
{
	config.addPlugin( nunjucksComponents );

	/* Filters */
	config.addFilter( "dump", json =>
	{
		if( process.env.NODE_ENV === "production" )
		{
			return JSON.stringify( json );
		}
		else
		{
			return JSON.stringify( json, null, 4 );
		}
	});

	return {
		dir: {
			input: "src",
			output: "dist",
		},

		htmlTemplateEngine: "njk",
		markdownTemplateEngine: "njk",

		templateFormats: ["css", "md", "njk"],
	};
};
