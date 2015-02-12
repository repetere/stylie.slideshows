'use strict';

var fullWidthSlideshow = require('../../index'),
	fullWidthSlideshow1;

var slideshowEvents = function () {
	fullWidthSlideshow1.on('slided', function (index) {
		console.log('slided to index', index);
	});
};

window.onload = function () {
	fullWidthSlideshow1 = new fullWidthSlideshow({
		element: document.querySelector('#myslidedshow')
	});
	slideshowEvents();
	window.myslideshow = fullWidthSlideshow1;
};
