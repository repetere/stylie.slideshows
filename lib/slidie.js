/*
 * slidie
 * http://github.com/typesettin
 *
 * Copyright (c) 2013 Amex Pub. All rights reserved.
 */

'use strict';

var classie = require('classie'),
	extend = require('util-extend'),
	events = require('events'),
	util = require('util'),
	Hammer = require('hammerjs'),
	detectCSS = require('detectcss');

var getEventTarget = function (e) {
	e = e || window.event;
	return e.target || e.srcElement;
};

/**
 * A module that represents a full with slideshow componenet object, a slidie is a slideshow.
 * @{@link https://github.com/typesettin/slidie}
 * @author Yaw Joseph Etse
 * @copyright Copyright (c) 2014 Typesettin. All rights reserved.
 * @license MIT
 * @constructor fullWidthSlideshow
 * @requires module:util-extent
 * @requires module:util
 * @requires module:events
 * @requires module:hammerjs
 * @requires module:detectcss
 * @param {object} config {el -  element of tab container}
 * @param {object} options configuration options
 */
var fullWidthSlideshow = function (config) {
	// console.log(config);
	this.$el = config.element;
	this._init(config.options);
	this.jump = this._jump;
	this.slide = this._slide;
	this.navigate = this._navigate;
};

util.inherits(fullWidthSlideshow, events.EventEmitter);

/** module default configuration */
fullWidthSlideshow.prototype._init = function (options) {
	var defaults = {
		// default transition speed (ms)
		speed: 500,
		// default transition easing
		easing: 'ease'
	};
	// options = extend( defaults,options );
	// options
	options = options || {};
	this.options = extend(defaults, options);
	// cache some elements and initialize some variables
	this._config();
	// initialize/bind the events
	this._initEvents();
};

/**
 * initializes slideshow and shows current slide.
 * @emits slidesInitialized
 */
fullWidthSlideshow.prototype._config = function () {
	// the list of items
	this.$list = this.$el.querySelector('ul');
	this.$items = this.$list.querySelectorAll('li');
	// total number of items
	this.itemsCount = this.$items.length;
	// support for CSS Transitions & transforms

	this.support = detectCSS.prefixed('transition') && detectCSS.feature('transform');
	this.support3d = detectCSS.prefixed('perspective');

	// transition end event name and transform name
	// transition end event name
	var transEndEventNames = {
			'WebkitTransition': 'webkitTransitionEnd',
			'MozTransition': 'transitionend',
			'OTransition': 'oTransitionEnd',
			'msTransition': 'MSTransitionEnd',
			'transition': 'transitionend'
		},
		transformNames = {
			'WebkitTransform': '-webkit-transform',
			'MozTransform': '-moz-transform',
			'OTransform': '-o-transform',
			'msTransform': '-ms-transform',
			'transform': 'transform'
		};

	if (this.support) {
		this.transEndEventName = transEndEventNames[detectCSS.prefixed('transition')] + '.p_c_fws';
		this.transformName = transformNames[detectCSS.prefixed('transform')];
	}
	// current and old item´s index
	this.current = 0;
	this.old = 0;
	// check if the list is currently moving
	this.isAnimating = false;
	// the list (ul) will have a width of 100% x itemsCount
	this.$list.style.width = 100 * this.itemsCount + '%';
	// apply the transition
	if (this.support) {
		this.$list.style.transition = this.transformName + ' ' + this.options.speed + 'ms ' + this.options.easing;
	}
	// each item will have a width of 100 / itemsCount

	for (var x in this.$items) {
		if (this.$items[x].style) {
			this.$items[x].style.width = 100 / this.itemsCount + '%';
		}
	}
	// add navigation arrows and the navigation dots if there is more than 1 item
	if (this.itemsCount > 1) {
		// add navigation arrows (the previous arrow is not shown initially):
		var nav = document.createElement('nav');
		nav.innerHTML = '<span class="p_c_fws-slideprev" style="display:none;">&lt;</span><span class="p_c_fws-slidenext">&gt;</span>';
		this.$el.appendChild(nav);
		this.$navPrev = this.$el.querySelector('.p_c_fws-slideprev');
		this.$navNext = this.$el.querySelector('.p_c_fws-slidenext');


		var dots = '';
		for (var i = 0; i < this.itemsCount; ++i) {
			// current dot will have the class p_c_fws-cuurentdot
			var dot = i === this.current ? '<span class="p_c_fws-cuurentdot" data-itr="' + i + '"></span>' : '<span data-itr="' + i + '"></span>';
			dots += dot;
		}
		var navDots = document.createElement('div');
		navDots.setAttribute('class', 'p_c_fws-slidedots');
		// console.log("navDots",navDots);
		navDots.innerHTML = dots;
		this.$el.appendChild(navDots);
		this.$navDots = navDots.querySelectorAll('span');
	}
	this.emit('slidesInitialized');
};

/**
 * handle slideshow click events.
 */
fullWidthSlideshow.prototype._initEvents = function () {
	if (this.options) {
		var hammertime = new Hammer(this.$el, {
			drag_block_horizontal: true
		});

		hammertime.on('swiperight', function (ev) {
			this.emit('swipedright', ev);
			this._navigate('previous');
		}.bind(this));

		hammertime.on('swipeleft', function (ev) {
			this.emit('swipeleft', ev);
			this._navigate('next');
		}.bind(this));
	}

	if (this.itemsCount > 1) {
		this.$navPrev.addEventListener('click', function () {
			this._navigate('previous');
		}.bind(this));

		this.$navNext.addEventListener('click', function () {
			this._navigate('next');
		}.bind(this));


		this.$navDotDom = this.$el.querySelector('.p_c_fws-slidedots');

		this.$navDotDom.addEventListener('click', function (event) {
			var target = getEventTarget(event);
			if (target.tagName === 'SPAN') {
				this._jump(target.getAttribute('data-itr'));
			}
		}.bind(this));
	}
};

/**
 * move slideshow to slide based on the direction.
 * @param {string} direction (previous|next) slide
 * @emits slided
 */
fullWidthSlideshow.prototype._navigate = function (direction) {
	// do nothing if the list is currently moving
	if (this.isAnimating) {
		return false;
	}

	this.isAnimating = true;
	// update old and current values
	this.old = this.current;
	if (direction === 'next' && this.current < this.itemsCount - 1) {
		++this.current;
	}
	else if (direction === 'previous' && this.current > 0) {
		--this.current;
	}
	this.emit('navigatedComponent', this.current);

	// slide
	this._slide();
	// console.log('this._slide()',this._slide());

};

/**
 * slide to show this.current(index) slide.
 * @emits slided
 */
fullWidthSlideshow.prototype._slide = function () {

	// check which navigation arrows should be shown
	this._toggleNavControls();
	// translate value
	var translateVal = -1 * this.current * 100 / this.itemsCount;

	if (this.support) {
		this.$list.style[this.transformName] = this.support3d ? 'translate3d(' + translateVal + '%,0,0)' : 'translate(' + translateVal + '%)';
	}
	else {
		this.$list.style['margin-left'] = -1 * this.current * 100 + '%';
	}

	var transitionendfn = function () {
		this.isAnimating = false;
	}.bind(this);

	if (this.support) {
		this.$list.addEventListener(this.transEndEventName, transitionendfn());
	}
	else {
		transitionendfn.call();
	}
	this.emit('slided', this.current);
};


/**
 * update slideshow ui.
 */
fullWidthSlideshow.prototype._toggleNavControls = function () {

	// if the current item is the first one in the list, the left arrow is not shown
	// if the current item is the last one in the list, the right arrow is not shown
	switch (this.current) {
	case 0:
		this.$navNext.style.display = 'block';
		this.$navPrev.style.display = 'none';
		break;
	case this.itemsCount - 1:
		this.$navNext.style.display = 'none';
		this.$navPrev.style.display = 'block';
		break;
	default:
		this.$navNext.style.display = 'block';
		this.$navPrev.style.display = 'block';
		break;
	}
	// highlight navigation dot
	classie.remove(this.$navDots[this.old], 'p_c_fws-cuurentdot');
	classie.add(this.$navDots[this.current], 'p_c_fws-cuurentdot');

	// this.$navDots[this.old].removeClass( 'p_c_fws-cuurentdot' ).end().eq( this.current ).addClass( 'p_c_fws-cuurentdot' );

};
/**
 * jump to specific slide.
 * @param {number} position slide to show
 */
fullWidthSlideshow.prototype._jump = function (position) {

	// do nothing if clicking on the current dot, or if the list is currently moving
	if (position === this.current || this.isAnimating) {
		return false;
	}
	this.isAnimating = true;
	// update old and current values
	this.old = this.current;
	this.current = position;
	// slide
	this._slide();

};
/**
 * delete/remove slideshow elements
 */
fullWidthSlideshow.prototype.destroy = function () {
	if (this.itemsCount > 1) {
		this.$navPrev.parent().remove();
		this.$navDots.parent().remove();
	}
	this.$list.css('width', 'auto');
	if (this.support) {
		this.$list.css('transition', 'none');
	}
	this.$items.css('width', 'auto');
};

if (typeof window === 'object') {
	window.fullWidthSlideshow = fullWidthSlideshow;
}
if (typeof module === 'object') {
	module.exports = fullWidthSlideshow;
}
