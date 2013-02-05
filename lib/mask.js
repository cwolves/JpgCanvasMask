~function(){
	window.CanvasMask = function( config ){
		// if an HTML node
		if( config.nodeType ){
			config = {
				   src : config.getAttribute( 'src'  )
				, mask : config.getAttribute( 'mask' )
				,  png : config.getAttribute( 'png'  )
				, node : config
			};
		}
		this.config = config;
		this.loaded = 0;

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
			var canvas = document.createElement( 'canvas' );
			if( !canvas ){
				canvas = document.createElement( 'img' );
				canvas.src = this.config.png;
			}else{
				var ctx    = canvas.getContext( '2d' );

				canvas.width  = this.config.node.getAttribute( 'width'  ) || this.srcImg.width;
				canvas.height = this.config.node.getAttribute( 'height' ) || this.srcImg.height;

				ctx.drawImage( this.maskImg, 0, 0 );
				ctx.globalCompositeOperation = 'source-in';
				ctx.drawImage( this.srcImg , 0, 0 );
			}

			this.config.node.parentNode.insertBefore( canvas, this.config.node );
			this.config.node.parentNode.removeChild( this.config.node );

			return this;
		}
	}
}();