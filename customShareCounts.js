/*!
 *  Custom share counts with totals!
 *  Version: 1.0.0
 *  Author: David O'Dey
 *  Website: www.davidodey.com
 *  Twitter: @davodey
 *  Github: https://github.com/davodey
 *  License: MIT http://en.wikipedia.org/wiki/MIT_License or GPLv2 http://en.wikipedia.org/wiki/GNU_General_Public_License
 */

(function ($) {
	'use strict';
	$.fn.customShareCount = function( options ) {
		var settings = $.extend({}, $.fn.customShareCount.defaults, options);

		function checkUndefined (x) {
			if (x === undefined) {
				return x = 0;
			} else {
				return x;
			}
		}

		this.on('click', 'a', function () {
			window.open(this.href, '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600');
			return false;
		});

		return this.each(function(){
			var $countUrl = $(this).attr('data-url'),
				$countTitle = $(this).attr('data-title'),
				$twitterHash = $(this).attr('data-hash'),
				$facebookCount = $(this).find('.facebook-count'),
				$linkedinCount = $(this).find('.linkedin-count'),
				$twitterCount = $(this).find('.twitter-count'),
				$googleCount = $(this).find('.google-count'),
				$totalCount = $(this).find('.total-count'),
				ltotalCount = 0,
				ftotalCount = 0,
				ttotalCount = 0,
				gtotalCount = 0,

			network = {
				placeHref: function (target, url) {
					target.attr('href', url);
				},
				loadJson: function (url, jsonUrl, item, target, callback) {
						$.ajax({
							url: jsonUrl,
							cache: true,
							type: 'POST',
							dataType: 'jsonp',
							data: {
								url: url
							},
							success: function (data){
								if (settings.showCounts === true) {
									if (data[item] === undefined) {
										target.text(network.convertK(0));
									} else {
										target.text(network.convertK(data[item]));
									}
								}
								callback(data);
							}
						});

				},
				total: function (){
					if (settings.showTotal === true ){
						$totalCount.text(network.convertK(
							  checkUndefined(ftotalCount)
							+ checkUndefined(ltotalCount)
							+ checkUndefined(ttotalCount) 
							+ checkUndefined(gtotalCount)
						));
					}
				},
				convertK: function (num) {
					return num > 999 ? (num/1000).toFixed(1) + 'k' : num;
				},
				facebook: {
					jsonUrl: 'http://graph.facebook.com/?id=' + $countUrl,
					linkUrl: 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent($countUrl),
					linkTarget: $(this).find('a.facebookBtn'),
					load: function () {
						network.placeHref(this.linkTarget, this.linkUrl);
						network.loadJson($countUrl, this.jsonUrl, 'shares', $facebookCount, function(data) {
							ftotalCount = data.shares;
							network.total();
						});
					}
				},
				linkedin: {
					jsonUrl: 'https://www.linkedin.com/countserv/count/share?url=' + $countUrl,
					linkUrl: 'http://www.linkedin.com/shareArticle?mini=true&url=' + encodeURIComponent($countUrl),
					linkTarget: $(this).find('a.linkedinBtn'),
					load: function () {
						network.placeHref(this.linkTarget, this.linkUrl);
						network.loadJson($countUrl, this.jsonUrl, 'count', $linkedinCount, function(data) {
							ltotalCount = data.count;
							network.total();
						});
					}
				},
				twitter: {
					jsonUrl: 'http://opensharecount.com/count.json?url=' + $countUrl,
					linkUrl:  'http://twitter.com/intent/tweet?text='+ $countTitle + ' '
								+ $countUrl + '&amp;via=' + settings.twitterUsername + ' %23'
								+ $twitterHash + '&amp;source=webclient',
					linkTarget: $(this).find('a.twitterBtn'),
					load: function () {
						network.placeHref(this.linkTarget, this.linkUrl);
						network.loadJson($countUrl, this.jsonUrl, 'count', $twitterCount, function(data) {
							ttotalCount = data.count;
							network.total();
						});
					}
				},
				google: {
					jsonUrl: 'https://count.donreach.com/',
					linkUrl: 'https://plus.google.com/share?url=' + encodeURIComponent($countUrl),
					linkTarget: $(this).find('a.googleBtn'),
					load: function () {
						network.placeHref(this.linkTarget, this.linkUrl);
						network.loadJson($countUrl, this.jsonUrl, 'shares', $googleCount, function(data) {
							if (settings.showCounts === true) {
								$googleCount.text(network.convertK(data.shares.google));
							}
							gtotalCount = data.shares.google;
							network.total();
						});
					}
				}
			};
			if (settings.facebook === true) {
				network.facebook.load();
			}
			if (settings.linkedin === true) {
				network.linkedin.load();
			}
			if (settings.twitter === true) {
				network.twitter.load();
			}
			if (settings.google === true) {
				network.google.load();
			}

		});
	};

	$.fn.customShareCount.defaults = {
		// set true or false to toggle the counts & API calls
		twitter: true,
		facebook: true,
		linkedin: true,
		google: true,
		twitterUsername: '',
		showCounts: true,
		showTotal: true
	};

}(jQuery));