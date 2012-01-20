(function(g){

/*var URL =
	window.URL		||
	window.webkitURL	||
	window.mozURL		||
	window.msURL		||
	window.oURL;

var BlobBuilder =
	window.BlobBuilder		||
	window.WebKitBlobBuilder	||
	window.MozBlobBuilder		||
	window.MSBlobBuilder		||
	window.OBlobBuilder;

var Uint8Array = window.Uint8Array;*/

var char = String.fromCharCode;

function dWord(w){
	return	char(0x000000FF & w)		+
		char((0x0000FF00 & w) >> 8)	+
		char((0x00FF0000 & w) >> 16)	+
		char((0xFF000000 & w) >> 24)	;
}

function sWord(w){
	return	char(0x00FF & w) +
		char((0xFF00 & w) >> 8);
}

/**
 * Creates a dynamic url of the supplied data, using Blob URLs where available, falling back to Data URLs.
 *
 * @param {String} data The data to create the dynamic URL from.
 * @param {String} mime The mime type of the data (default: application/octet).
 * @this {DynUrl}
 * @constructor
*/
function DynUrl(data, mime){
	var	l	= data.length,
		bb, buf;
	this.mime = mime || this.mime;
	/* Try to use Blob URLs */
	/* FIXME: The Blob URLs don't sem to work with audio? */
	/* try{
		buf		= new Uint8Array(data.length);
		for (bb=0; bb<l; bb++){
			buf[bb]	= data.charCodeAt[bb];
		}
		bb		= new BlobBuilder();
		bb.append(buf.buffer);
		this.url	= URL.createObjectURL(bb.getBlob(this.mime));
		this.type	= 'blob';
	*/
	/* Fall back to Data URLs */
	/*} catch(e) {*/
		this.url = 'data:' + mime + ';base64,' + btoa(data);
	/*}*/
}

DynUrl.prototype = {
	url:	null,
	mime:	'application/octet',
	type:	'data',
	revoke: function(){
/* FIXME: Nothing to revoke with data URLs, fix the blobs
		switch (type){
		case 'blob':
			window[urlPath].revokeObjectURL(this.blob); break;
		default:*/
			/* Nothing to do here. */
		/*}*/
	},
	toString: function(){
		return this.url;
	}
};


/**
 * Generates an audio element of specified duration of silence.
 *
 * @param {Number} duration Duration of silence in seconds (default: 5).
 * @param {Audio} audio The audio element to work with (optional).
 * @this {Silence}
 * @constructor
*/
function Silence(duration, audio){
	this.duration	= isNaN(duration) || duration === null ? this.duration : duration;
	this.elem	= audio || document.createElement('audio');
	var	sr	= 11025,
		l	= ~~(this.duration * sr),
		data	= 
		'WAVE'			+ // RIFF ID
		'fmt '			+ // Chunk ID
		dWord(16)		+ // Chunk size
		sWord(1)		+ // Format
		sWord(1)		+ // Channels
		dWord(sr)		+ // Sample rate
		dWord(sr)		+ // Byte rate (8 bit audio)
		sWord(1)		+ // Block align (8 bit audio)
		sWord(8)		+ // Bits per sample
		'data'			+ // Chunk ID
		dWord(l)		+ // Chunk size
		/* FIXME: uglifyjs doesn't like this, but it's not my problem */
		Array(l+1).join('\x7F')	; // Data

	data		=
		'RIFF'			+ // Group ID
		dWord(data.length)	+ // File Length
		data;

	this.url	= new DynUrl(data, 'audio/wav');
	this.elem.src	= this.url;
}

Silence.prototype = {
	elem:		null,
	url:		null,
	duration:	5,
	/* Call this when discarding the audio to avoid memory leaks */
	destroy:	function(){
		this.url.revoke();
	}
};

g.DynUrl	= DynUrl;
g.Silence	= Silence;

}(this));