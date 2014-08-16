/*
  canvasthumber by Christian Heilmann
  Version: 1.0
  Homepage: http://thewebrocks/demos/canvasthumber
  Copyright (c) 2012, Christian Heilmann
  Code licensed under the BSD License:
  http://wait-till-i.com/license.txt
*/
(function(){
  var s  = document.querySelector('#dropzone');
  var o  = document.querySelector('output');
  var cr = document.querySelector('#crop');
  var z  = document.querySelector('#zip');
  var t  = document.querySelector('#thumbslist');
  var r  = document.querySelector('#remove');
  var j  = document.querySelector('#jpeg');
  var c  = document.createElement('canvas');
  var q = document.querySelector('#quality');
  var cx = c.getContext('2d');
  var thumbwidth = 100;
  var thumbheight = 100;
  var crop = false;
  var background = 'white';
  var jpeg = false;
  var quality = 0.8;
  zip.addEventListener('click', zipit, false);
  r.addEventListener('click', purgethumbs, false);

  function init() {
    if (typeof FileReader !== 'undefined') {
      document.body.classList.add('dragdrop');
      s.innerHTML = 'Drop images here';
      cr.addEventListener('click', function (ev) {
        document.body.classList.toggle('cropon');
      }, false );
      j.addEventListener('click', function (ev) {
        document.body.classList.toggle('jpegon');
      }, false );
      q.addEventListener('mousemove', function (ev) {
        this.nextSibling.innerHTML = this.value+'%';
      }, false );
      q.addEventListener('keyup', function (ev) {
        this.nextSibling.innerHTML = this.value+'%';
      }, false );
      z.addEventListener('click', zipit, false );
      r.addEventListener('click', purgethumbs, false );
      o.addEventListener('click', function (ev) {
        var t = ev.target;
        if (t.tagName === 'IMG') {
          while (t.tagName !== 'LI') {
            t = t.parentNode;
          }
          t.parentNode.removeChild(t);
        }
      }, false );
      s.addEventListener('dragover', function ( ev ) {
        ev.preventDefault();
      }, false );
      s.addEventListener('drop', getfiles, false );
    }
  }

  function getfiles(ev) {
    o.classList.add('doingit');
    var files = ev.dataTransfer.files,
        url = window.URL || window.webkitURL,
        objURL = url.createObjectURL || false;

    if ( files.length > 0 ) {
      var i = files.length;
      while ( i-- ) {
        var file = files[ i ];
        if ( file.type.indexOf('image') === -1 ) { continue; }
        if(objURL) {
          loadImage(url.createObjectURL(file),file.name);
        } else {
          var reader = new FileReader();
          reader.readAsDataURL( file );
          reader.onload = function ( ev ) {
            loadImage(ev.target.result,file.name);
          }
        }
      }
    }
    ev.preventDefault();
  }

  function loadImage(file, name) {
    var img = new Image();
    img.src = file;
    img.onload = function() {
      grabformvalues();
      imagetocanvas( this, thumbwidth, thumbheight, crop, background, name );
    };
  }
  function grabformvalues() {
    thumbwidth  = document.querySelector('#width').value;
    thumbheight = document.querySelector('#height').value;
    crop = document.querySelector('#crop').checked;
    background = document.querySelector('#bg').value;
    jpeg  = document.querySelector('#jpeg').checked,
    quality = q.value / 100;
  }
  function imagetocanvas( img, thumbwidth, thumbheight, crop, background, name ) {
    c.width = thumbwidth;
    c.height = thumbheight;
    var dimensions = resize( img.width, img.height, thumbwidth, thumbheight );
    if ( crop ) {
      c.width = dimensions.w;
      c.height = dimensions.h;
      dimensions.x = 0;
      dimensions.y = 0;
    }
    if ( background !== 'transparent') {
      cx.fillStyle = background;
      cx.fillRect ( 0, 0, thumbwidth, thumbheight );
    }
    cx.drawImage(
      img, dimensions.x, dimensions.y, dimensions.w, dimensions.h
    );
    addtothumbslist( jpeg, quality, name );
  }

  function addtothumbslist(jpeg, quality, name) {
    var thumb = new Image(),
        url = jpeg ? c.toDataURL('image/jpeg', quality) : c.toDataURL();
    thumb.src = url;
    var thumbname = name.split('.');
    thumbname = thumbname[0] + '_tn.' + (jpeg ? 'jpg' : thumbname[1]);
    thumb.title = thumbname +' ' + Math.round(url.length / 1000 * 100) / 100 + ' KB';
    thumb.setAttribute('data-filename', thumbname);
    var item = document.createElement('li');
    var textlabel = document.createElement('span');
    textlabel.innerHTML = thumb.title;
    item.appendChild(thumb);
    item.appendChild(textlabel);
    t.appendChild(item);
  }
  function purgethumbs() {
    t.innerHTML = '';
  }
  function zipit() {
    var zip = new JSZip();
    var imgs = o.querySelectorAll('img');
    var allimgs = imgs.length;
    while (allimgs--) {
      zip.file(
        imgs[allimgs].getAttribute('data-filename'),
        imgs[allimgs].src.substr(imgs[allimgs].src.indexOf(',') + 1),
        { base64: true }
      );
    }
    saveAs(
      zip.generate({type: 'blob'}),
      'thumbnails.zip'
    );
  }

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
  }
  init();
})();
