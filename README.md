# slidie

A very simple (framework independent) 100% width HTML slider that scales down to mobile. Added Touch & Swipe Support. Inspired by [Responsive full width slideshow](http://tympanus.net/codrops/2013/02/26/full-width-image-slider/)

[API Documenation](https://github.com/typesettin/slidie/blob/master/doc/api.md)
 
[![Full Width Slideshow](https://raw.githubusercontent.com/typesettin/slidie/master/example/img/slideshowscreenshot.png)](https://raw.githubusercontent.com/typesettin/slidie/master/example/img/slideshowscreenshot.png)

## Example

Check out `example/index.html`, the example javascript for the example page is `resources/js/example_src.js`

## Installation

```
$ npm install slidie
```

The full width slideshow component is a browserified javascript module.

## Usage

*JavaScript*
```javascript
var fullWidthSlideshow = require('slidie'),
	mySlideshow;
//initialize nav component after the dom has loaded
window.addEventListener('load',function(){
	var tabelement = document.getElementById(tabelement);
	mySlideshow = new fullWidthSlideshow({element:'myslideshow'});
});
```

*HTML*
```html
<html>
	<head>
  	<title>Your Page</title>
  	<link rel="stylesheet" type="text/css" href="[path/to]/slidie.css">
  	<script src='[path/to/browserify/bundle].js'></script>
	</head>
	<body>
		 <div id="myslideshow" class="myslideshow p_c_fws-slideshow  p_c_fws-slideshow-preview">
        <ul>
          <li>
            slideshow slide 1, this can be any html
          </li>
          <li>
            slideshow slide 2, anything can go here
          </li>
          <li>
            slideshow slide 3
          </li>
        </ul>
      </div>
      <!-- /content -->
    </div>
    <!-- /tabs -->
	</body>
</html>
```

##API

```javascript
mySlideshow.jump(3); //jump to slideshow at slide '3'
mySlideshow.navigate('next'); //jump to next slide
```
##Development
*Make sure you have grunt installed*
```
$ npm install -g grunt-cli
```

Then run grunt watch
```
$ grunt watch
```

For generating documentation
```
$ grunt doc
$ jsdoc2md lib/**/*.js index.js > doc/api.md
```

##Notes
* The Tab Module uses Node's event Emitter for event handling.
* The Template Generator uses EJS, but you can generate your own mark up
* The less file is located in `resources/stylesheets`