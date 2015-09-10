(function($) {

	var __pluginName = "swipeMenu";

	var Obj = function($elem, opt) {

		this.opt = $.extend({
			button: opt.button,
			duration: opt.duration,
			wrapper: opt.wrapper,
			timing: opt.timing,
			position: opt.position,
			
		}, opt);

		this.$elem = $elem;
		this.$win = $(window);
		this.$doc = $(document);
		this.$html = $(document.documentElement);
		this.$body = $(document.body);
		this.scrollPosition = 0;
		this.elemPosition = 0;
		this.elemWidth = $elem.outerWidth();
		this.duration = !!this.opt.duration ? self.opt.duration : .3;
		this.isOpened = false;
		this.isMoved = false;
		this.isRight = this.opt.position === "right" ? 1 : -1;
		this.isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);;
		this.isTouch = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

		this.init();
	};

	Obj.prototype.init = function() {
		var self = this;

		this.touchDetection($(this.opt.button), $.proxy(function(event) {
			this.toggle();
		}, this));

		this.orientationchange($.proxy(function(event) {
			this.changePosition();
		}, this));

		this.$doc.on(this.isTouch ? "MSPointerDown touchstart" : "mousedown", function(event) {
			var elemPosition = self.$elem.offset().left,
				startX = self.pointer(event).x,
				startY = self.pointer(event).y,
				direction = undefined;

			if (event.target === $(self.opt.button)[0]) return;

			self.$doc.on(self.isTouch ? "MSPointerMove.swipeMenu touchmove.swipeMenu" : "mousemove.swipeMenu", function(event) {
				var moveX = self.pointer(event).x - startX,
					moveY = self.pointer(event).y - startY,
					move = elemPosition + moveX;

				if (Math.abs(moveX) > Math.abs(moveY) && typeof direction === "undefined") {
					direction = "horisontal";
				} else if (Math.abs(moveX) < Math.abs(moveY) && typeof direction === "undefined") {
					direction = "vertical";
				}

				if (direction == "horisontal") {
					event.preventDefault();

					self.isMoved = true;
					self.$html.addClass("overflowHidden");

					if (move > 0) {
						move = 0;
					} else if (move < -self.elemWidth) {
						move = -self.elemWidth;
					}

					if (self.generateTransform().x > 0 || self.generateTransform().x < -self.elemWidth) return;


					animit(self.$elem[0]).queue({
						transition: "none",
						transform: "translate3d(" + move + "px, 0 ,0)"
					}).play();
				}
			});
		});

		this.$doc.on(this.isTouch ? "MSPointerUp touchend touchcancel" : "mouseup", function(event) {
			self.$doc.off(".swipeMenu");

			if (event.target === $(self.opt.button)[0]) return;

			if (self.generateTransform().x > -self.elemWidth / 2 && self.isMoved) {
				self.open(.3);
			} else if (self.generateTransform().x < -self.elemWidth / 2 && self.isMoved) {
				self.close(.3);
			}

			self.isMoved = false;
		});
	};

	Obj.prototype.open = function(duration) {
		var self = this;

		this.scrollPosition = this.$html.scrollTop() || this.$body.scrollTop();
		this.elemWidth = this.$elem.outerWidth();
		this.isOpened = true;

		animit(this.$elem[0]).queue({
			transform: "translate3d(0, 0 ,0)"
		}, {
			duration: duration,
			timing: !!self.opt.timing ? opt.timing : "ease"
		}).play();

		this.$html.addClass("overflowHidden");
		this.$elem.addClass("swipeMenu-opened");

		if (this.isIOS && !!this.opt.wrapper && !self.$body.hasClass("overflowHidden")) {
			this.$body.addClass("overflowHidden");
			$(this.opt.wrapper).css("top", -this.scrollPosition);
		}
	}

	Obj.prototype.close = function(duration) {
		var self = this;

		self.isOpened = false;
		this.elemWidth = this.$elem.outerWidth();

		animit(this.$elem[0]).queue({
			transform: "translate3d(" + self.elemWidth * self.isRight + "px, 0 ,0)"
		}, {
			duration: duration,
			timing: !!self.opt.timing ? opt.timing : "ease"
		}).play(function() {
			self.$html.removeClass("overflowHidden");

			if (self.isIOS && !!self.opt.wrapper) {
				setTimeout($.proxy(function() {
					if (self.$body.hasClass("overflowHidden")) {
						self.$body.removeClass("overflowHidden");
						$(this.opt.wrapper).css("top", 0);
						$("html, body").scrollTop(this.scrollPosition);

						this.scrollPosition = 0;
					}

				}, self), 100);
			}
		});

		self.$elem.removeClass("swipeMenu-opened");
	}

	Obj.prototype.toggle = function() {
		return this.isOpened ? this.close(this.duration) : this.open(this.duration);
	}

	Obj.prototype.changePosition = function() {
		var translatex;

		if (this.isIOS && !!this.opt.wrapper) {
			var positionTop = Math.abs(parseFloat($(this.opt.wrapper).css("top"))),
				siteheight = $(this.opt.wrapper).outerHeight(),
				winHeight = $(window).height(),
				difference = siteheight - positionTop - winHeight;

			if (difference < 0) {
				this.scrollTop = this.scrollTop - Math.abs(difference);
				$(this.opt.wrapper).css("top", -this.scrollTop);
			}
		}

		if (!this.isOpened) {
			this.elemWidth = this.$elem.outerWidth();
			translatex = "translateX(" + this.elemWidth * this.isRight + "px)";

			this.$elem.css(this.getVendorPropertyName("transition"), "none");
			this.$elem.css(this.getVendorPropertyName("transform"), translatex);
		}
	}

	Obj.prototype.touchDetection = function(elem, func) {
		var self = this,
			$touchArea = typeof elem === "string" ? $(elem) : elem,
			touchStarted = false,
			evt = window.navigator.msPointerEnabled ? "MSPointerDown MSPointerUp" : "touchstart touchend touchcancel",
			click = this.isTouch ? evt : "mousedown mouseup",
			currX, currY, areaWidth, areaHeight, areaOffset;

		$touchArea.on(click, function(event) {
			if (/mousedown|touchstart|MSPointerDown/i.test(event.type)) {
				areaWidth = $touchArea.outerWidth();
				areaHeight = $touchArea.outerHeight();
				areaOffset = $touchArea.offset();
				touchStarted = true;
			};

			if (/mouseup|touchend|MSPointerUp/i.test(event.type) && touchStarted) {
				touchStarted = false;
				currX = self.pointer(event).x;
				currY = self.pointer(event).y;

				if ($.isFunction(func)) {
					if (event.type == "mouseup") {
						setTimeout(function() {
							func(event);
						}, 100);
					} else {
						if ((currX >= areaOffset.left && currX <= areaOffset.left + areaWidth) && (currY >= areaOffset.top && currY <= areaOffset.top + areaHeight)) {
							func(event);
						}
					}
				}
			}
		});
	}

	Obj.prototype.pointer = function(event) {
		var result = { x: null, y: null };

		event = event.originalEvent || event || window.event;

		event = event.touches && event.touches.length ?
			event.touches[0] : event.changedTouches && event.changedTouches.length ?
				event.changedTouches[0] : event;

		if (event.pageX) {
			result.x = event.pageX;
			result.y = event.pageY;
		} else {
			result.x = event.clientX;
			result.y = event.clientY;
		}

		return result;
	};

	Obj.prototype.generateTransform = function() {
		var self = this;

		function getTransform(el) {
			var transform = window.getComputedStyle(el, null).getPropertyValue(self.getVendorPropertyName("transform"));
			var results = transform.match(/matrix(?:(3d)\(-{0,1}\d+(?:, -{0,1}\d+)*(?:, (-{0,1}\d+))(?:, (-{0,1}\d+))(?:, (-{0,1}\d+)), -{0,1}\d+\)|\(-{0,1}\d+(?:, -{0,1}\d+)*(?:, (-{0,1}\d+))(?:, (-{0,1}\d+))\))/);

			if(!results) return [0, 0, 0];
			if(results[1] == "3d") return results.slice(2,5);

			results.push(0);
			return results.slice(5, 8);
		}

		return {
			x : Number(getTransform(this.$elem[0])[0]),
			y : Number(getTransform(this.$elem[0])[1]),
			z : Number(getTransform(this.$elem[0])[2])
		}
	}

	Obj.prototype.getVendorPropertyName = function(prop) {
		var div = document.createElement("div");

		if (prop in div.style) return prop;

		var prefixes = ["-moz-", "-webkit-", "-o-", "-ms-"];

		for (var i = 0; i < prefixes.length; ++i) {
			var vendorProp = prefixes[i] + prop;

			if (vendorProp in div.style) {
				return vendorProp;
			}
		}
	}

	Obj.prototype.duration = function() {
		var duration = this.opt.duration ? this.opt.duration : .3;

		if (this.isOpened) {
			return (Math.abs(this.$elem.offset().left) * duration) / this.elemWidth;
		} else {
			return ( (this.elemWidth - Math.abs(this.$elem.offset().left) ) * duration ) / this.elemWidth;
		}
	}

	Obj.prototype.orientationchange = function(func) {
		if ($.isFunction(func)) {
			$(window).on(this.isMobile ? "orientationchange" : "resize", function(event) {
				func(event);
			});
		}
	}

	Obj.prototype.destroy = function() {
		this.$self.removeData(__pluginName);
	};

	Obj.prototype.update = function(opt) {
		this.opt = $.extend(this.opt, opt);
	};

	$.fn[__pluginName] = function(opt, param) {
		return this.each(function() {
			var $self = $(this);
			var obj;
			if(!!(obj = $self.data(__pluginName))) {
				if(typeof opt === "string" && !!obj[opt])
					obj[opt](param);
				else
					obj.update(opt);
			} else {
				$self.data(__pluginName, new Obj($self, opt));
			}
		});
	}
})(jQuery);