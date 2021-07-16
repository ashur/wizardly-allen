let elBody = document.querySelector( "body" );
let elDocument = document.documentElement;
let elChain = document.querySelector( ".PullChain" );

let app = {
	state: {
		x: 0,
		y: 0,
		light: true,
	},

	/* Methods */
	followCursor( event )
	{
		if( this.state.light )
		{
			return;
		}

		this.moveTo( event.clientX, event.clientY );
	},

	moveTo( x, y )
	{
		this.state.x = x;
		this.state.y = y;
		elDocument.style.setProperty( "--blacklight-x", `calc( ${this.state.x}px - var( --blacklight-size ) )` );
		elDocument.style.setProperty( "--blacklight-y", `calc( ${this.state.y}px - var( --blacklight-size ) )` );
	},

	toggleLight( event )
	{
		this.state.light = !this.state.light;

		if( !this.state.light )
		{
			if( window.matchMedia("(pointer:fine)").matches )
			{
				this.moveTo( event.clientX, event.clientY );
			}
			else
			{
				this.moveTo( window.innerWidth / 2, 175 );
			}
		}

		elChain.style.setProperty( "--chain-pull-length", "0.75rem" );

		setTimeout( () =>
		{
			elChain.style.setProperty( "--chain-pull-length", "0rem" );

			elBody.classList.toggle( "lights-on" );
			elBody.classList.toggle( "lights-off" );

		}, 150 );
	}
};

document.querySelector( "body" ).addEventListener( "mousemove", event => app.followCursor( event ) );
