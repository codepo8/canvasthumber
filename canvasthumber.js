/*
  canvasthumber by Christian Heilmann
  Version: 1.0
  Homepage: http://thewebrocks/demos/canvasthumber
  Copyright (c) 2012, Christian Heilmann
  Code licensed under the BSD License:
  http://wait-till-i.com/license.txt
*/
(function(){
  var s  = document.querySelector( '#dropzone' ),
      o  = document.querySelector( 'output' ),
      cr = document.querySelector( '#crop' ),
      j  = document.querySelector( '#jpeg' ),
      c  = document.createElement( 'canvas' ),
      cx = c.getContext( '2d' ),
      thumbwidth = thumbheight = 100,
      crop = false,
      background = 'white',
      jpeg = false,
      quality = 0.8;

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
    var files = ev.dataTransfer.files,
        url = window.URL || window.webkitURL,
        objURL = url.createObjectURL || false;

    if ( files.length > 0 ) {
      var i = files.length;
      while ( i-- ) {
        var file = files[ i ];
        if ( file.type.indexOf( 'image' ) === -1 ) { continue; }
        if(objURL) {
          loadImage(url.createObjectURL(file));
        } else {
          var reader = new FileReader();
          reader.readAsDataURL( file );
          reader.onload = function ( ev ) {
            loadImage(ev.target.result);
          };
        }
      }
    }
    ev.preventDefault();
  }
  function loadImage(file) {
    var img = new Image();
    img.src = file;
    img.onload = function() {
      grabformvalues();
      imagetocanvas( this, thumbwidth, thumbheight, crop, background );
    };
  }
  function grabformvalues() {
    thumbwidth  = document.querySelector( '#width' ).value;
    thumbheight = document.querySelector( '#height' ).value;
    crop = document.querySelector( '#crop' ).checked;
    background = document.querySelector( '#bg' ).value;
    jpeg  = document.querySelector( '#jpeg' ).checked,
    quality = document.querySelector( '#quality ').value / 100;
  }
  function imagetocanvas( img, thumbwidth, thumbheight, crop, background ) {
    c.width = thumbwidth;
    c.height = thumbheight;
    var dimensions = resize( img.width, img.height, thumbwidth, thumbheight );
    if ( crop ) {
      c.width = dimensions.w;
      c.height = dimensions.h;
      dimensions.x = 0;
      dimensions.y = 0;
    }
    if ( background !== 'transparent' ) {
      cx.fillStyle = background;
      cx.fillRect ( 0, 0, thumbwidth, thumbheight );
    }
    cx.drawImage( 
      img, dimensions.x, dimensions.y, dimensions.w, dimensions.h 
    );
    addtothumbslist( jpeg, quality );
  };
  function addtothumbslist( jpeg, quality ) {
    var thumb = new Image(),
        url = jpeg ? c.toDataURL( 'image/jpeg' , quality ) : c.toDataURL();
    thumb.src = url;
    thumb.title = Math.round( url.length / 1000 * 100 ) / 100 + ' KB';
    o.appendChild( thumb );
  };
  function resize( imagewidth, imageheight, thumbwidth, thumbheight ) {
    var w = 0, h = 0, x = 0, y = 0,
        widthratio  = imagewidth / thumbwidth,
        heightratio = imageheight / thumbheight,
        maxratio    = Math.max( widthratio, heightratio );
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
