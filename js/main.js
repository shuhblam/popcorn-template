/*jshint undef:true */
(function(){
	"use strict";
	VideoJS.setupAllWhenReady();
	var popcorn = new Popcorn('#video'), bufferElement = document.getElementById("bufferText");
	var update = function() {
		if( popcorn.buffered().length > 0 ) {
				bufferElement.innerHTML = popcorn.buffered().end(0);
				if( popcorn.buffered().end( 0 ) > popcorn.duration() ) {
					popcorn.play();
				} else {
					setTimeout( update, 100 );
				}
		} else {
			setTimeout( update, 100 );
		}
	};
	update();
})(window);

