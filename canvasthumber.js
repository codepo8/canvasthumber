/*
  canvasthumber by Christian Heilmann
  Version: 1.0
  Homepage: http://thewebrocks/demos/canvasthumber
  Copyright (c) 2012, Christian Heilmann
  Code licensed under the BSD License:
  http://wait-till-i.com/license.txt
*/
(function(){
  var s = document.querySelector( '#dropzone' ),
      o = document.querySelector( 'output' ),
      c = document.createElement( 'canvas' ),
      cr = document.querySelector( '#crop' ),
      j = document.querySelector( '#jpeg' ),
      cx = c.getContext( '2d' ),
      thumbwidth = thumbheight = 100;
  function init() {
    if (typeof FileReader !== 'undefined' ) {
      document.body.classList.add( 'dragdrop' );
      s.innerHTML = 'Drop images here';
      cr.addEventListener( 'click', function ( evt ) {
        document.body.classList.toggle( 'cropon' );
      }, false );
      j.addEventListener( 'click', function ( evt ) {
        document.body.classList.toggle( 'jpegon' );
      }, false );
      o.addEventListener( 'click', function ( evt ) {
        var t = evt.target;
        if ( t.tagName === 'IMG' ) {
          t.parentNode.removeChild( t );
        }
      }, false );
      s.addEventListener( 'dragover', function ( evt ) {
        evt.preventDefault();
      }, false );
      s.addEventListener( 'drop', getfiles, false );
    }
  };
  function getfiles( ev ) {
    var files = ev.dataTransfer.files;
    if ( files.length > 0 ) {
      var i = files.length;
      while ( i-- ) {
        var file = files[ i ];
        if ( file.type.indexOf( 'image' ) === -1 ) { continue; }
        var reader = new FileReader();
        reader.readAsDataURL( file );
        reader.onload = function ( ev ) {
          var img = new Image();
          img.src = ev.target.result;
          img.onload = function() {
            imagetocanvas(this);
            addtothumbslist();
          };
        };
      }
    }
    ev.preventDefault();
  };
  function addtothumbslist() {
    var thumb = new Image(),
        url = '',
        jpeg = document.querySelector( '#jpeg' ).checked,
        qu = document.querySelector( '#quality ').value / 100;
    if ( jpeg ) {
      url = c.toDataURL( 'image/jpeg' , qu );
    } else {
      url = c.toDataURL();
    }
    thumb.src = url;
    thumb.title = Math.round( url.length / 1000 * 100 ) / 100 + ' KB';
    o.appendChild( thumb );
  };
  function imagetocanvas(img) {
    thumbwidth = document.querySelector('#width').value || 100;
    thumbheight = document.querySelector('#height').value || 100;
    c.width = thumbwidth;
    c.height = thumbheight;
    var dims = resize( img.width, img.height, thumbwidth, thumbheight );
    if ( document.querySelector( '#crop' ).checked ) {
      c.width = dims.w;
      c.height = dims.h;
      dims.x = 0;
      dims.y = 0;
    }
    var bg = document.querySelector( '#bg' ).value;
    if ( bg !== 'transparent' ) {
      cx.fillStyle = bg;
      cx.fillRect ( 0, 0, thumbwidth, thumbheight );
    }
    cx.drawImage( img, dims.x, dims.y, dims.w, dims.h );
  };
  function resize( imagewidth, imageheight, thumbwidth, thumbheight ) {
    var w = 0, h = 0, x = 0, y = 0,
        widthratio = imagewidth / thumbwidth,
        heightratio = imageheight / thumbheight,
        maxratio = Math.max( widthratio, heightratio );
    if ( maxratio > 1 ) {
        w = imagewidth / maxratio;
        h = imageheight / maxratio;
    } else {
        w = imagewidth;
        h = imageheight;
    }
    x = ( thumbwidth - w ) / 2;
    y = ( thumbheight - h ) / 2;
    return { w:w, h:h, x:x, y:y };
  };
  init();
})();
