~function(){
	window.CanvasMask = function( config ){
		// if an HTML node
		if( config.nodeType ){
			config = {
				      src : config.getAttribute( 'src'  )
				,    mask : config.getAttribute( 'mask' )
				,     png : config.getAttribute( 'png'  )
				,    node : config
				, replace : true
			};
		}
		this.config = config;
		this.loaded = 0;
		this.canvas = document.createElement( 'canvas' );

		if( config.replace ){
			config.node.parentNode.insertBefore( this.canvas, config.node );
			config.node.parentNode.removeChild( config.node );
		}else{
			config.node.appendChild( this.canvas );
		}

		this.load( config.src, 'src' ).load( config.mask, 'mask' );
	};

	CanvasMask.prototype = {
		// load an image
		load : function( src, target ){
			var    img = document.createElement( 'img' )
			  ,   self = this
			  , loaded = false
			  ;

			this[ target + 'Img' ] = img;

			img.src = src;

			img.onload = function(){
				if( loaded ){ return; }
				loaded = true;

				if( ++self.loaded === 2 ){
					self.onReady();
				}
			};
			if( img.width ){
				img.onload();
			}

			return this;
		}

		// fired when both images have loaded
		, onReady : function(){
			if( !this.canvas ){
				this.canvas = document.createElement( 'img' );
				this.canvas.src = this.config.png;
			}else{
				var ctx    = this.canvas.getContext( '2d' );

				this.canvas.width  = this.config.node.getAttribute( 'width'  ) || this.srcImg.width;
				this.canvas.height = this.config.node.getAttribute( 'height' ) || this.srcImg.height;

				ctx.drawImage( this.maskImg, 0, 0 );
				ctx.globalCompositeOperation = 'source-in';
				ctx.drawImage( this.srcImg , 0, 0 );
			}

			return this;
		}
	}
}();