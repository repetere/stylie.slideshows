/*
 * stylie.slideshows
 * http://github.com/typesettin
 *
 * Copyright (c) 2013 Amex Pub. All rights reserved.
 */

'use strict';

var classie = require('classie'),
	extend = require('util-extend'),
	events = require('events'),
	Pushie = require('pushie'),
	util = require('util'),
	slideshowPushie,
	Hammer,
	detectCSS = require('detectcss');

var getEventTarget = function (e) {
	e = e || window.event;
	return e.target || e.srcElement;
};

/**
 * A module that represents a full with slideshow componenet object, a stylie.slideshows is a slideshow.
 * @{@link https://github.com/typesettin/stylie.slideshows}
 * @author Yaw Joseph Etse
 * @copyright Copyright (c) 2014 Typesettin. All rights reserved.
 * @license MIT
 * @constructor StylieSlideshow
 * @requires module:util-extent
 * @requires module:util
 * @requires module:events
 * @requires module:hammerjs
 * @requires module:detectcss
 * @param {object} config {el -  element of tab container}
 * @param {object} options configuration options
 */
var StylieSlideshow = function (config) {
	// console.log(config);
	this.$el = config.element;
	this.jump = this._jump;
	this.slide = this._slide;
	this.navigate = this._navigate;
	this._init(config.options);
};

util.inherits(StylieSlideshow, events.EventEmitter);

/** module default configuration */
StylieSlideshow.prototype._init = function (options) {
	var defaults = {
		speed: 500, // default transition speed (ms)
		touchsupport: true,
		usepushstate: false,
		navarrows: true,
		navarrows_next_html: '&gt;',
		navarrows_next_class: 'ts-ss-slidenext',
		navarrows_prev_html: '&lt;',
		navarrows_prev_class: 'ts-ss-slideprev',
		navdots: true,
		navdots_class: 'ts-ss-dots',
		navdots_current_class: 'ts-ss-currentdot',
		easing: 'ease' // default transition easing
	};
	options = options || {};
	this.options = extend(defaults, options);
	this._config();
	this._initEvents(); // initialize/bind the events
};

/**
 * initializes slideshow and shows current slide.
 * @emits slidesInitialized
 */
StylieSlideshow.prototype._config = function () {

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
	if (this.itemsCount > 1) { // add navigation arrows and the navigation dots if there is more than 1 item
		if (this.options.navarrows) { // add navigation arrows (the previous arrow is not shown initially):
			var nav = document.createElement('nav');
			nav.innerHTML = '<span class="' + this.options.navarrows_prev_class + '" style="display:none;">' + this.options.navarrows_prev_html + '</span><span class="' + this.options.navarrows_next_class + '">' + this.options.navarrows_next_html + '</span>';
			this.$el.appendChild(nav);
			this.$navPrev = this.$el.querySelector('.' + this.options.navarrows_prev_class);
			this.$navNext = this.$el.querySelector('.' + this.options.navarrows_next_class);
		}
		if (this.options.navdots) {
			var dots = '';
			for (var i = 0; i < this.itemsCount; ++i) { // current dot will have the class p_c_fws-cuurentdot
				var dot = i === this.current ? '<span class="' + this.options.navdots_current_class + '" data-itr="' + i + '"></span>' : '<span data-itr="' + i + '"></span>';
				dots += dot;
			}
			var navDots = document.createElement('div');
			navDots.setAttribute('class', this.options.navdots_class);
			// console.log("navDots",navDots);
			navDots.innerHTML = dots;
			this.$el.appendChild(navDots);
			this.$navDots = navDots.querySelectorAll('span');
		}
	}
	if (this.options.usepushstate) {
		var initSlideIndex,
			jumpToSlide = function (data) {
				// console.log('popcallback');
				this.jump(data.currentSlide);
			}.bind(this),
			jumpToFirstInitialSlide = function () {
				var winhref, winhash;
				for (var q = 0; q < this.itemsCount; q++) {
					winhref = window.location.href;
					winhref = (winhref.search(window.location.origin) >= 0) ? winhref.replace(window.location.origin, '') : winhref;
					winhash = window.location.hash.substr(1, window.location.hash.length);
					winhash = (winhash.search(window.location.origin) >= 0) ? winhash.replace(window.location.origin, '') : winhash;
					if (this.$items[q].getAttribute('data-ts-ss-href') === winhref || this.$items[q].getAttribute('data-ts-ss-href') === winhash) {
						initSlideIndex = q;
					}
					if (initSlideIndex) {
						this.jump(initSlideIndex);
					}
				}
			}.bind(this); //,
		// initialSlideIndex=0;
		slideshowPushie = new Pushie({
			popcallback: jumpToSlide,
			pushcallback: function ( /*data*/ ) {
				// console.log('pushcallback');
			},
			replacecallback: function ( /*data*/ ) {
				// console.log('replacecallback');
			},
		});
		jumpToFirstInitialSlide();
	}
	this.emit('slidesInitialized');
};

/**
 * handle slideshow click events.
 */
StylieSlideshow.prototype._initEvents = function () {
	if (this.options.touchsupport) {
		Hammer = require('hammerjs');
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
		if (this.options.navarrows) {
			this.$navPrev.addEventListener('click', function () {
				this._navigate('previous');
			}.bind(this));

			this.$navNext.addEventListener('click', function () {
				this._navigate('next');
			}.bind(this));
		}
		if (this.options.navdots) {
			this.$navDotDom = this.$el.querySelector('.' + this.options.navdots_class);

			this.$navDotDom.addEventListener('click', function (event) {
				var target = getEventTarget(event);
				if (target.tagName === 'SPAN') {
					this._jump(target.getAttribute('data-itr'));
				}
			}.bind(this));
		}
	}
};

/**
 * move slideshow to slide based on the direction.
 * @param {string} direction (previous|next) slide
 * @emits slided
 */
StylieSlideshow.prototype._navigate = function (direction) {
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
StylieSlideshow.prototype._slide = function () {
	// check which navigation arrows should be shown
	this._toggleNavControls();
	if (this.options.usepushstate) {
		// console.log('this.current', this.current);
		// console.log('this.$items[this.current]', this.$items[this.current]);
		var currentSlideEl = this.$items[this.current],
			currentSlideElTitle = currentSlideEl.getAttribute('data-ts-ss-href');
		slideshowPushie.pushHistory({
			data: {
				currentSlide: this.current
			},
			title: currentSlideElTitle,
			href: currentSlideElTitle
		});
	}
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
StylieSlideshow.prototype._toggleNavControls = function () {
	if (this.options.navarrows) {
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
	}
	if (this.options.navdots) { // highlight navigation dot
		classie.remove(this.$navDots[this.old], this.options.navdots_current_class);
		classie.add(this.$navDots[this.current], this.options.navdots_current_class);
	}
};
/**
 * jump to specific slide.
 * @param {number} position slide to show
 */
StylieSlideshow.prototype._jump = function (position) {
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
StylieSlideshow.prototype.destroy = function () {
	if (this.itemsCount > 1) {
		if (this.options.navarrows) {
			this.$navPrev.parent().remove();
		}
		if (this.options.navdots) {
			this.$navDots.parent().remove();
		}
	}
	this.$list.css('width', 'auto');
	if (this.support) {
		this.$list.css('transition', 'none');
	}
	this.$items.css('width', 'auto');
};

if (typeof window === 'object') {
	window.StylieSlideshow = StylieSlideshow;
}
if (typeof module === 'object') {
	module.exports = StylieSlideshow;
}
