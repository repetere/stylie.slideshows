/*
 * slidie
 * https://github.com/typesettin
 *
 * Copyright (c) 2014 Typesettin. All rights reserved.
 */

'use strict';

var should = require('chai').should();
// var component_navigation_header = require('../lib/slidie');

describe('slidie', function () {
	describe('#indexOf()', function () {
		it('should return -1 when the value is not present', function () {
			should.equal(-1, [1, 2, 3].indexOf(5));
			should.equal(-1, [1, 2, 3].indexOf(0));
		});
	});
});
