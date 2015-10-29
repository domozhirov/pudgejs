window.animit = function() {
	"use strict";
	var t = function(i) {
		if (!(this instanceof t)) return new t(i);
		if (i instanceof HTMLElement) this.elements = [i];
		else {
			if ("[object Array]" !== Object.prototype.toString.call(i)) throw new Error("First argument must be an array or an instance of HTMLElement.");
			this.elements = i
		}
		this.transitionQueue = [], this.lastStyleAttributeDict = [];
		var n = this;
		this.elements.forEach(function(t, i) {
			t.hasAttribute("data-animit-orig-style") ? n.lastStyleAttributeDict[i] = t.getAttribute("data-animit-orig-style") : (n.lastStyleAttributeDict[i] = t.getAttribute("style"), t.setAttribute("data-animit-orig-style", n.lastStyleAttributeDict[i] || ""))
		})
	};
	t.prototype = {
		transitionQueue: void 0,
		element: void 0,
		play: function(t) {
			return "function" == typeof t && this.transitionQueue.push(function(i) {
				t(), i()
			}), this.startAnimation(), this
		},
		queue: function(i, n) {
			var e = this.transitionQueue;
			if (i && n && (n.css = i, i = new t.Transition(n)), i instanceof Function || i instanceof t.Transition || (i = new t.Transition(i.css ? i : {
					css: i
				})), i instanceof Function) e.push(i);
			else {
				if (!(i instanceof t.Transition)) throw new Error("Invalid arguments");
				e.push(i.build())
			}
			return this
		},
		wait: function(t) {
			return this.transitionQueue.push(function(i) {
				setTimeout(i, 1e3 * t)
			}), this
		},
		resetStyle: function(n) {
			function e() {
				r.elements.forEach(function(i, n) {
					i.style[t.prefix + "Transition"] = "none", i.style.transition = "none", r.lastStyleAttributeDict[n] ? i.setAttribute("style", r.lastStyleAttributeDict[n]) : (i.setAttribute("style", ""), i.removeAttribute("style"))
				})
			}
			n = n || {};
			var r = this;
			if (n.transition && !n.duration) throw new Error('"options.duration" is required when "options.transition" is enabled.');
			if (n.transition || n.duration && n.duration > 0) {
				var o = n.transition || "all " + n.duration + "s " + (n.timing || "linear"),
					s = "transition: " + o + "; -" + t.prefix + "-transition: " + o + ";";
				this.transitionQueue.push(function(a) {
					var u = this.elements;
					u.forEach(function(i, n) {
						i.style[t.prefix + "Transition"] = o, i.style.transition = o;
						var e = (r.lastStyleAttributeDict[n] ? r.lastStyleAttributeDict[n] + "; " : "") + s;
						i.setAttribute("style", e)
					});
					var c = i.addOnTransitionEnd(u[0], function() {
							clearTimeout(l), e(), a()
						}),
						l = setTimeout(function() {
							c(), e(), a()
						}, 1e3 * n.duration * 1.4)
				})
			} else this.transitionQueue.push(function(t) {
				e(), t()
			});
			return this
		},
		startAnimation: function() {
			return this._dequeueTransition(), this
		},
		_dequeueTransition: function() {
			var t = this.transitionQueue.shift();
			if (this._currentTransition) throw new Error("Current transition exists.");
			this._currentTransition = t;
			var i = this,
				n = !1,
				e = function() {
					if (n) throw new Error("Invalid state: This callback is called twice.");
					n = !0, i._currentTransition = void 0, i._dequeueTransition()
				};
			t && t.call(this, e)
		}
	}, t.cssPropertyDict = function() {
		var t = window.getComputedStyle(document.documentElement, ""),
			i = {},
			n = "A".charCodeAt(0),
			e = "z".charCodeAt(0);
		for (var r in t) t.hasOwnProperty(r) && n <= r.charCodeAt(0) && e >= r.charCodeAt(0) && "cssText" !== r && "parentText" !== r && "length" !== r && (i[r] = !0);
		return i
	}(), t.hasCssProperty = function(i) {
		return !!t.cssPropertyDict[i]
	}, t.prefix = function() {
		var t = window.getComputedStyle(document.documentElement, ""),
			i = (Array.prototype.slice.call(t).join("").match(/-(moz|webkit|ms)-/) || "" === t.OLink && ["", "o"])[1];
		return i
	}(), t.runAll = function() {
		for (var t = 0; t < arguments.length; t++) arguments[t].play()
	}, t.Transition = function(t) {
		this.options = t || {}, this.options.duration = this.options.duration || 0, this.options.timing = this.options.timing || "linear", this.options.css = this.options.css || {}, this.options.property = this.options.property || "all"
	}, t.Transition.prototype = {
		build: function() {
			function n(n) {
				var e = {};
				return Object.keys(n).forEach(function(r) {
					var o = n[r];
					r = i.normalizeStyleName(r);
					var s = t.prefix + i.capitalize(r);
					t.cssPropertyDict[r] ? e[r] = o : t.cssPropertyDict[s] ? e[s] = o : (e[s] = o, e[r] = o)
				}), e
			}
			if (0 === Object.keys(this.options.css).length) throw new Error("options.css is required.");
			var e = n(this.options.css);
			if (this.options.duration > 0) {
				var r = i.buildTransitionValue(this.options),
					o = this;
				return function(n) {
					var s = this.elements,
						a = 1e3 * o.options.duration * 1.4,
						u = i.addOnTransitionEnd(s[0], function() {
							clearTimeout(c), n()
						}),
						c = setTimeout(function() {
							u(), n()
						}, a);
					s.forEach(function(i) {
						i.style[t.prefix + "Transition"] = r, i.style.transition = r, Object.keys(e).forEach(function(t) {
							i.style[t] = e[t]
						})
					})
				}
			}
			return this.options.duration <= 0 ? function(i) {
				var n = this.elements;
				n.forEach(function(i) {
					i.style[t.prefix + "Transition"] = "none", i.transition = "none", Object.keys(e).forEach(function(t) {
						i.style[t] = e[t]
					})
				}), n.length && n[0].offsetHeight, window.requestAnimationFrame ? requestAnimationFrame(i) : setTimeout(i, 1e3 / 30)
			} : void 0
		}
	};
	var i = {
		normalizeStyleName: function(t) {
			return t = t.replace(/-[a-zA-Z]/g, function(t) {
				return t.slice(1).toUpperCase()
			}), t.charAt(0).toLowerCase() + t.slice(1)
		},
		capitalize: function(t) {
			return t.charAt(0).toUpperCase() + t.slice(1)
		},
		buildTransitionValue: function(t) {
			t.property = t.property || "all", t.duration = t.duration || .4, t.timing = t.timing || "linear";
			var i = t.property.split(/ +/);
			return i.map(function(i) {
				return i + " " + t.duration + "s " + t.timing
			}).join(", ")
		},
		addOnTransitionEnd: function(t, n) {
			if (!t) return function() {};
			var e = function(i) {
					t == i.target && (i.stopPropagation(), r(), n())
				},
				r = function() {
					i._transitionEndEvents.forEach(function(i) {
						t.removeEventListener(i, e)
					})
				};
			return i._transitionEndEvents.forEach(function(i) {
				t.addEventListener(i, e, !1)
			}), r
		},
		_transitionEndEvents: function() {
			return "webkit" === t.prefix || "o" === t.prefix || "moz" === t.prefix || "ms" === t.prefix ? [t.prefix + "TransitionEnd", "transitionend"] : ["transitionend"]
		}()
	};
	return t
}();