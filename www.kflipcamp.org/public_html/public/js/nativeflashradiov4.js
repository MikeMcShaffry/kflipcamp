/*
 HTML5 RADIO PLAYER V4.20.04.09
 https://www.flashradio.info

 Copyright (C) SODAH | JOERG KRUEGER
 https://www.sodah.de

*/
(function(a, k) {
		"function" === typeof define && define.amd ? define(["jquery"], k) : a.jQuery ? k(a.jQuery) : k(a.Zepto)
	}
)(this, function(a, k) {
	a.fn.flashradio = function(g) {
		var e = "string" === typeof g
			, t = Array.prototype.slice.call(arguments, 1)
			, I = this;
		g = !e && t.length ? a.extend.apply(null, [!0, g].concat(t)) : g;
		if (e && "_" === g.charAt(0))
			return I;
		e ? this.each(function() {
			var e = a(this).data("flashradio")
				, R = e && a.isFunction(e[g]) ? e[g].apply(e, t) : e;
			if (R !== e && R !== k)
				return I = R,
					!1
		}) : this.each(function() {
			a(this).data("flashradio", new a.flashradio(this,g))
		});
		return I
	}
	;
	a.flashradio = function(g, e) {
		function t(a) {
			var b = document.createElement("link");
			b.type = "text/css";
			b.rel = "stylesheet";
			b.href = "https://fonts.googleapis.com/css?family=" + a;
			document.getElementsByTagName("head")[0].appendChild(b)
		}
		function I() {
			navigator.userAgent.toString().toLowerCase();
			try {
				var h = window.localStorage.getItem(b + "volume");
				null !== h && (C = h)
			} catch (z) {
				D(z)
			}
			Ga() && (C = 100);
			"" != Ua && t(Ua);
			"" != Va && t(Va);
			Wa = document.getElementById(b);
			Wa.innerHTML = "";
			a("#" + b).addClass("sodahnativeflashradio4").css({
				overflow: "hidden",
				display: "block"
			});
			F = document.createElement("div");
			F.id = b + "containerinside";
			Wa.appendChild(F);
			a("#" + b + "containerinside").css({
				position: "relative",
				left: "0px",
				top: "0px",
				height: "100%",
				width: "100%",
				background: Xa
			});
			"big" == x && (ia() || (h = document.createElement("img"),
				h.id = b + "coverblurshadow1",
				F.appendChild(h),
			"circle" == Ha && a("#" + b + "coverblurshadow1").css({
				"border-radius": "50%"
			}),
				a("#" + b + "coverblurshadow1").css({
					"z-index": "17",
					"-webkit-filter": "blur(40px)",
					filter: "blur(40px)",
					opacity: "1",
					position: "absolute",
					padding: "0",
					margin: "0"
				}).sodahdisableSelection(),
				h = document.createElement("img"),
				h.id = b + "coverblurshadow2",
				F.appendChild(h),
			"circle" == Ha && a("#" + b + "coverblurshadow2").css({
				"border-radius": "50%"
			}),
				a("#" + b + "coverblurshadow2").css({
					"z-index": "18",
					"-webkit-filter": "blur(40px)",
					filter: "blur(40px)",
					opacity: "1",
					position: "absolute",
					padding: "0",
					margin: "0"
				}).sodahdisableSelection()),
				h = document.createElement("div"),
				h.id = b + "volumecontrollerbackground",
				F.appendChild(h),
				a("#" + b + "volumecontrollerbackground").css({
					"z-index": "19",
					position: "absolute",
					"background-color": J,
					opacity: "0.1",
					left: "20px",
					height: "3px",
					overflow: "hidden",
					"border-radius": "1.5px"
				}).sodahdisableSelection());
			Na = document.createElement("div");
			Na.id = b + "volumecontroller";
			F.appendChild(Na);
			a("#" + b + "volumecontroller").css({
				"z-index": "20",
				position: "absolute",
				"background-color": Rb
			}).sodahdisableSelection();
			"big" == x && a("#" + b + "volumecontroller").css({
				"background-color": J,
				left: "20px",
				height: "3px",
				width: "0",
				"border-radius": "1.5px"
			});
			"big" == x ? (h = document.createElement("div"),
				h.id = b + "volumeicon",
				Na.appendChild(h),
				a("#" + b + "volumeicon").css({
					"z-index": "20",
					position: "absolute",
					top: "-3px",
					right: "-20px",
					height: "8.891px",
					width: "40px",
					padding: "0",
					margin: "0",
					"line-height": "0px",
					"background-color": J,
					fill: m
				}).html('<svg version="1.1" id="Ebene_3" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 548 122" style="enable-background:new 0 0 548 122;" xml:space="preserve"><path d="M535.5,0.5h-523c-6.6,0-12,5.4-12,12v97c0,6.6,5.4,12,12,12h523c6.6,0,12-5.4,12-12v-97C547.5,5.9,542.1,0.5,535.5,0.5z M231.5,105.5h-24v-89h24V105.5z M286.5,105.5h-24v-89h24V105.5z M340.5,105.5h-24v-89h24V105.5z"/></svg>').sodahdisableSelection(),
				h = document.createElement("div"),
				h.id = b + "temp_stationname",
				F.appendChild(h),
				a("#" + b + "temp_stationname").css({
					"z-index": "0",
					"font-family": ja,
					overflow: "visible",
					position: "absolute",
					opacity: 0,
					"text-align": "left",
					"white-space": "nowrap",
					height: "24px",
					"font-size": "16px",
					lineHeight: "16px"
				}).sodahdisableSelection(),
				h = document.createElement("div"),
				h.id = b + "temp_artist",
				F.appendChild(h),
				a("#" + b + "temp_artist").css({
					"z-index": "0",
					"font-family": ja,
					overflow: "visible",
					position: "absolute",
					opacity: 0,
					"text-align": "left",
					"white-space": "nowrap",
					height: "30px",
					"font-size": "20px",
					lineHeight: "20px"
				}).sodahdisableSelection(),
				h = document.createElement("div"),
				h.id = b + "temp_songtitle",
				F.appendChild(h),
				a("#" + b + "temp_songtitle").css({
					"z-index": "0",
					"font-family": ja,
					overflow: "visible",
					position: "absolute",
					opacity: 0,
					"text-align": "left",
					"white-space": "nowrap",
					height: "24px",
					"font-size": "16px",
					lineHeight: "16px"
				}).sodahdisableSelection()) : (Ya = document.createElement("div"),
				Ya.id = b + "temp_song",
				F.appendChild(Ya),
				a("#" + b + "temp_song").css({
					position: "absolute",
					"z-index": "0",
					"font-family": ja,
					overflow: "visible",
					opacity: 0,
					"text-align": "left",
					"white-space": "nowrap"
				}).sodahdisableSelection(),
				Za = document.createElement("div"),
				Za.id = b + "temp_radio",
				F.appendChild(Za),
				a("#" + b + "temp_radio").css({
					position: "absolute",
					"z-index": "0",
					"font-family": Oa,
					overflow: "visible",
					opacity: 0,
					"text-align": "left",
					"white-space": "nowrap"
				}).sodahdisableSelection());
			try {
				d = document.createElement("canvas"),
					d.id = b + "canvas",
					F.appendChild(d),
					a("#" + b + "canvas").css({
						"z-index": "21",
						display: "block",
						background: "none",
						position: "absolute"
					}),
				"big" == x && a("#" + b + "canvas").css({
					"z-index": "5"
				}),
					c = d.getContext("2d"),
					c.fillStyle = m
			} catch (z) {
				D(z)
			}
			"big" == x ? (h = document.createElement("div"),
				h.id = b + "stationname",
				F.appendChild(h),
				a("#" + b + "stationname").css({
					"z-index": "22",
					"font-family": Oa,
					overflow: "hidden",
					position: "absolute",
					left: "20px",
					color: J,
					"text-align": "left",
					"white-space": "nowrap",
					height: "24px",
					"font-size": "16px",
					lineHeight: "16px",
					"text-shadow": "0px 0px 5px rgba(" + p(fa).r + ", " + p(fa).g + ", " + p(fa).b + ", 0.6)"
				}).sodahdisableSelection(),
				h = document.createElement("div"),
				h.id = b + "artist",
				F.appendChild(h),
				a("#" + b + "artist").css({
					"z-index": "22",
					"font-family": ja,
					overflow: "hidden",
					position: "absolute",
					left: "20px",
					color: J,
					"text-align": "left",
					"white-space": "nowrap",
					height: "30px",
					"font-size": "20px",
					lineHeight: "20px",
					"text-shadow": "0px 0px 5px rgba(" + p(fa).r + ", " + p(fa).g + ", " + p(fa).b + ", 0.6)"
				}).sodahdisableSelection(),
				h = document.createElement("div"),
				h.id = b + "songtitle",
				F.appendChild(h),
				a("#" + b + "songtitle").css({
					"z-index": "22",
					position: "absolute",
					left: "20px",
					overflow: "hidden",
					"font-family": ja,
					color: J,
					"white-space": "nowrap",
					height: "24px",
					"font-size": "16px",
					lineHeight: "16px",
					"text-shadow": "0px 0px 5px rgba(" + p(fa).r + ", " + p(fa).g + ", " + p(fa).b + ", 0.6)"
				}).sodahdisableSelection()) : (channelname = document.createElement("div"),
				channelname.id = b + "channelname",
				F.appendChild(channelname),
				a("#" + b + "channelname").css({
					position: "absolute",
					"z-index": "22",
					overflow: "hidden",
					"font-family": Oa,
					color: J,
					"white-space": "nowrap",
					"text-align": "left"
				}).sodahdisableSelection(),
				$a = document.createElement("div"),
				$a.id = b + "statustext",
				F.appendChild($a),
				a("#" + b + "statustext").css({
					position: "absolute",
					"z-index": "22",
					overflow: "hidden",
					"font-family": ja,
					color: J,
					"white-space": "nowrap",
					"text-align": "left"
				}).sodahdisableSelection());
			sa = document.createElement("div");
			sa.id = b + "volumesetcontainer";
			F.appendChild(sa);
			a("#" + b + "volumesetcontainer").css({
				position: "absolute",
				"z-index": "43"
			}).sodahdisableSelection();
			"big" == x && a("#" + b + "volumesetcontainer").css({
				height: "40px",
				width: "40px",
				bottom: "40px",
				right: "20px"
			});
			ab = document.createElement("div");
			ab.id = b + "volumeupbutton";
			sa.appendChild(ab);
			a("#" + b + "volumeupbutton").css({
				position: "absolute",
				fill: J
			}).html('<svg xmlns="http://www.w3.org/2000/svg"xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" viewBox="0 0 800 800"><path fill-rule="evenodd" clip-rule="evenodd" d="M545.676,86.489c14.686-2.451,25.617,5.51,36.586,10.976 c50.467,25.145,90.846,61.559,121.957,105.695c36.729,52.107,62.104,111.54,63.418,197.163 c0.619,40.392-6.879,78.427-18.293,110.574c-11.559,32.553-26.215,59.762-44.717,85.369 c-27.123,37.537-59.275,70.676-100.818,94.313c-6.74,3.836-13.5,8.24-20.732,11.789c-13.199,6.479-33.148,18.762-49.189,6.098 c-9.744-7.693-15.137-23.627-7.316-36.586c5.221-8.65,14.797-12.842,24.391-17.074c19.174-8.459,36.504-19.939,52.441-32.521 c42.008-33.164,74.291-75.611,93.092-132.932c8.752-26.68,17.211-60.645,14.23-97.159c-0.783-9.597-0.719-18.443-1.627-26.831 c-2.674-24.729-8.688-46.792-17.074-67.482c-10.945-26.999-23.814-50.801-40.652-72.36c-7.646-9.793-16.938-20.547-26.83-29.676 c-19.475-17.972-41.15-34.263-65.855-47.156c-14.627-7.633-34.898-12.01-36.182-33.741 C521.668,100.793,533.361,88.544,545.676,86.489z"/><path fill-rule="evenodd" clip-rule="evenodd" d="M342.417,131.613c13.52-0.659,24.913,8.526,28.049,19.919 c2.251,8.171,1.22,19.046,1.22,30.083c0,145.936,0,287.211,0,434.165c0,10.596,1.203,21.74-0.407,30.488 c-2.75,14.943-20.474,27.541-38.619,19.92c-7.665-3.219-14.735-11.482-21.139-17.887c-42.516-42.516-83.082-83.488-126.021-126.428 c-3.266-3.268-7.283-7.953-10.569-8.539c-9.47-1.68-20.244,0-30.083,0c-19.667,0-39.878,0-60.166,0 c-10.165,0-20.518,1.055-29.27-0.813c-10.942-2.334-20.231-10.883-22.358-21.139c-1.349-6.498-0.407-14.875-0.407-22.764 c0-46.528,0-90.371,0-137.405c0-10.514-0.845-21.152,2.439-28.049c3.64-7.646,11.651-14.358,22.358-15.854 c17.026-2.38,39.482-0.407,58.133-0.407c21.264,0,40.268,0,58.539,0c5.924,0,17.312-14.872,21.139-18.7 c38.748-38.748,76.943-76.537,116.265-115.858C320.443,143.423,326.955,132.366,342.417,131.613z"/><path fill-rule="evenodd" clip-rule="evenodd" d="M504.212,190.151c11.813-0.833,23.587,6.137,33.741,11.789 c28.867,16.071,53.221,37.1,71.547,62.604c12.014,16.717,24.061,35.695,31.709,57.726c7.678,22.119,12.268,47.98,13.414,75.207 c1.213,28.769-5.297,54.604-12.602,76.831c-14.658,44.607-41.742,77.303-74.393,104.477c-7.686,6.396-16.842,12.406-26.83,17.887 c-12.879,7.066-29.714,18.773-46.343,10.977c-12.367-5.799-21.715-23.805-12.604-39.434c5.439-9.326,16.416-13.232,25.611-18.293 c33.083-18.203,60.483-44.904,76.019-81.303c10.098-23.66,17.5-53.273,13.822-87.81c-2.361-22.174-9.406-41.17-17.074-56.913 c-8.992-18.46-23.578-37.04-38.619-50.002c-12.168-10.487-24.719-18.474-39.839-26.423c-12.549-6.597-28.033-16.262-22.766-37.4 C481.554,199.86,491.683,191.036,504.212,190.151z"/><path fill-rule="evenodd" clip-rule="evenodd" d="M456.649,294.627c12.543-2.064,22.457,3.727,31.303,8.943 c18.758,11.064,33.714,28.004,43.089,48.376c5.629,12.23,10.859,30.956,10.57,47.969c-0.658,38.536-18.93,70.033-41.466,88.215 c-4.451,3.594-10.027,6.871-15.854,10.164c-5.461,3.084-11.988,6.908-17.887,7.723c-14.371,1.984-26.4-7.043-30.488-16.666 c-2.91-6.854-3.279-16.693,0.406-23.58c7.52-14.049,26.189-18.113,36.586-30.082c5.488-6.314,9.74-14.529,11.383-23.577\tc4.76-26.199-5.623-44.244-19.512-54.475c-9.348-6.883-21.275-12.916-28.457-23.171 C428.942,315.932,439.655,297.505,456.649,294.627z"/></svg>').sodahdisableSelection();
			"big" == x && a("#" + b + "volumeupbutton").css({
				height: "40px",
				width: "40px"
			});
			bb = document.createElement("div");
			bb.id = b + "volumeoffbutton";
			sa.appendChild(bb);
			a("#" + b + "volumeoffbutton").css({
				position: "absolute",
				fill: J,
				visibility: "hidden"
			}).html('<svg xmlns="http://www.w3.org/2000/svg"xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" viewBox="0 0 800 800"><path fill-rule="evenodd" clip-rule="evenodd" d="M342.417,131.613c13.52-0.659,24.913,8.526,28.049,19.919 c2.251,8.171,1.22,19.046,1.22,30.083c0,145.936,0,287.211,0,434.165c0,10.596,1.203,21.74-0.407,30.488 c-2.75,14.943-20.474,27.541-38.619,19.92c-7.665-3.219-14.735-11.482-21.139-17.887c-42.516-42.516-83.082-83.488-126.021-126.428 c-3.266-3.268-7.283-7.953-10.569-8.539c-9.47-1.68-20.244,0-30.083,0c-19.667,0-39.878,0-60.166,0 c-10.165,0-20.518,1.055-29.27-0.813c-10.942-2.334-20.231-10.883-22.358-21.139c-1.349-6.498-0.407-14.875-0.407-22.764 c0-46.528,0-90.371,0-137.405c0-10.514-0.845-21.152,2.439-28.049c3.64-7.646,11.651-14.358,22.358-15.854 c17.026-2.38,39.482-0.407,58.133-0.407c21.264,0,40.268,0,58.539,0c5.924,0,17.312-14.872,21.139-18.7 c38.748-38.748,76.943-76.537,116.265-115.858C320.443,143.423,326.955,132.366,342.417,131.613z"/></svg>').sodahdisableSelection();
			"big" == x && a("#" + b + "volumeoffbutton").css({
				height: "40px",
				width: "40px"
			});
			"small" == x && (za = document.createElement("div"),
				za.id = b + "volumetext",
				sa.appendChild(za),
				a("#" + b + "volumetext").css({
					position: "absolute",
					"font-family": ja,
					color: J,
					"white-space": "nowrap",
					"text-align": "center"
				}).sodahdisableSelection());
			Pa = document.createElement("img");
			Pa.id = b + "volumehit";
			sa.appendChild(Pa);
			Pa.src = "data:image/gif;base64,R0lGODlhAQABAJEAAAAAAP///////wAAACH5BAEAAAIALAAAAAABAAEAAAICVAEAOw%3D%3D";
			a("#" + b + "volumehit").css({
				position: "absolute",
				cursor: "pointer",
				"z-index": "24",
				padding: "0",
				margin: "0"
			});
			Ga() || a("#" + b + "volumehit").mouseenter(function() {
				0 == C ? (a("#" + b + "volumeoffbutton").stop(),
					a("#" + b + "volumeoffbutton").animate({
						opacity: .5
					}, 200, function() {})) : (a("#" + b + "volumeupbutton").stop(),
					a("#" + b + "volumeupbutton").animate({
						opacity: .5
					}, 200, function() {}))
			}).mouseleave(function() {
				0 == C ? (a("#" + b + "volumeoffbutton").stop(),
					a("#" + b + "volumeoffbutton").animate({
						opacity: 1
					}, 200, function() {})) : (a("#" + b + "volumeupbutton").stop(),
					a("#" + b + "volumeupbutton").animate({
						opacity: 1
					}, 200, function() {}))
			}).click(function() {
				0 == C ? (C = Sb,
					R(C)) : (Sb = C,
					R(0, C),
					C = 0);
				B()
			});
			a("#" + b + "volumehit").sodahdisableSelection();
			"big" == x && a("#" + b + "volumehit").css({
				height: "40px",
				width: "40px"
			});
			if ("false" != ka) {
				a("#" + b + "volumetext").css({
					opacity: .25
				});
				"small" == x && (a("#" + b + "volumeupbutton").css({
					opacity: .25
				}),
					a("#" + b + "volumeoffbutton").css({
						opacity: .25
					}));
				h = document.createElement("div");
				h.id = b + "imagecontainer";
				F.appendChild(h);
				a("#" + b + "imagecontainer").css({
					position: "absolute",
					"z-index": "19",
					"background-color": m,
					"box-sizing": "border-box",
					"-moz-box-sizing": "border-box",
					"-webkit-box-sizing": "border-box",
					border: "2px solid " + m
				}).sodahdisableSelection();
				"big" == x && ("circle" == Ha && a("#" + b + "imagecontainer").css({
					"border-radius": "50%"
				}),
					a("#" + b + "imagecontainer").css({
						overflow: "hidden",
						"background-color": "transparent",
						border: "0"
					}));
				var aa = document.createElement("img");
				aa.id = b + "imagehit1";
				h.appendChild(aa);
				a("#" + b + "imagehit1").css({
					position: "absolute",
					"z-index": "21",
					top: "0px",
					left: "0px",
					height: "100%",
					width: "100%",
					cursor: "pointer",
					padding: "0",
					margin: "0"
				}).click(function() {
					"" != oa && window.open(oa)
				}).fadeOut(0).sodahdisableSelection();
				aa = document.createElement("img");
				aa.id = b + "imagehit2";
				h.appendChild(aa);
				a("#" + b + "imagehit2").css({
					position: "absolute",
					"z-index": "20",
					top: "0px",
					left: "0px",
					height: "100%",
					width: "100%",
					cursor: "pointer",
					padding: "0",
					margin: "0"
				}).click(function() {
					"" != oa && window.open(oa)
				}).fadeOut(0).sodahdisableSelection();
				"big" == x && ("circle" == Ha && a("#" + b + "imagehit1, #" + b + "imagehit2").css({
					"border-radius": "50%"
				}),
					a("#" + b + "imagehit1, #" + b + "imagehit2").css({
						"box-sizing": "border-box",
						"-moz-box-sizing": "border-box",
						"-webkit-box-sizing": "border-box",
						border: "20px solid rgba(" + p(J).r + ", " + p(J).g + ", " + p(J).b + ", 0.25)"
					}))
			} else
				a("#" + b + "volumesetcontainer").css({
					"background-color": m
				});
			Qa = document.createElement("img");
			Qa.id = b + "volumegrab";
			Qa.src = "data:image/gif;base64,R0lGODlhAQABAJEAAAAAAP///////wAAACH5BAEAAAIALAAAAAABAAEAAAICVAEAOw%3D%3D";
			F.appendChild(Qa);
			a("#" + b + "volumegrab").css({
				position: "absolute",
				"z-index": "44",
				padding: "0",
				margin: "0"
			}).sodahdisableSelection();
			"big" == x && a("#" + b + "volumegrab").css({
				left: "20px"
			});
			Ga() || (a("#" + b + "volumegrab").mouseover(function(h) {
				a("#" + b + "volumegrab").css("cursor", "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAAABx0RVh0U29mdHdhcmUAQWRvYmUgRmlyZXdvcmtzIENTNAay06AAAALlSURBVEiJxZe9bhNBEMd/5zsSkhjs0Fi0SYG7CAmltQUpeAGeISmTB6CFSOQFkoKOwqJAQAQNCCHyIUs0KYAiEmUaQ2GshORuPyhu196c95wLSHik0a3v7P3Nf2Zudx1orRmHlcZCHSc48t0MgqDIbwPjANr4SHPL6gWPsJIDe2k+PwAUIIwXaxqt9ZB7LAC2gTfANeCtNga8A24CVeAqEDrB5bKKgrctaHNzU5fLZe2Aj42/B2omsEkTQC64SHOVgMaI54GUcjqO47vAd+AFcB2YAq7kqS8K9ppSCiAQQiCEAAi63e494DkwC0yT9tEQvAjY7V7m5+cBkFJaGEmS9MFCCDqdTgN4Rlr3aTxpLwLWwMOtrS0Ams0mjUZjCGaDcMZ3gBvADJ6UFwU/XV5ePraTKqXIgbnjgLTWFnyOVeQ91qTvJ0mSoJSi1Wr1A7AwKWVfvRlD2t0TeFI9Cmxr238vLUwphZQSKSVHR0eTLiwDDo1Sd+GBrPyMvQa6wCvSBumn0dbXNpj1w8PDSaf2Nniv5SkuAY1er1dWSt2vVCotTBqtWt/VHRvLXT7zFAfAjlXU6XSaFmwV+dw+29vbA/hGuoYrPJtIbqqjKFqvVqsf7KRLS0tTPojPV1ZWDhg0pTTwQoq1EOJzGIYbtVrtU5IkrK6uemG+e8At4BEQG5dZxXk1VkAipWwDQghBvV4nW2Nfndvttp0jBk6BMzzb5aiuFsBJFEXrc3NzH0fV1PW1tbUD4Ou/gBUQCyH2wzB8Uq/Xdy5qKifNjw30FEi4RI1d+JmUcj8Mw42FhYVdC8mrt7EY+G089oEvWjJtZ55IKXfDMAwWFxdvk9mxMvbFAE/ISTNA4DtxeA57JdJ1d4Z0n50FyqTrsJs1TarwF/AD+El6OpHwd4c9ZaLXzthu8lmwIFXcM98bSjMUV2ytZGAT5jq06zA4ccYMFpA0Kod1WTAM6juqzjYz5ya/EPw/bGx/Yf4AHxykPX4eCXQAAAAASUVORK5CYII%3D), auto")
			}),
				a("#" + b + "volumegrab").sodahgrab({
					onstart: function(h) {
						a("#" + b + "volumegrab").css("cursor", "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAAABx0RVh0U29mdHdhcmUAQWRvYmUgRmlyZXdvcmtzIENTNAay06AAAAKmSURBVEiJ7ZbPaxNBFMc/m4lttYtNBem9F3MrgvRawR78C/wbemz/CS3Yf8OLXgQ9KAgi9gcBLz2oh0IOhfZSLdUkTZN9s+NhZtpNdrJZFeyhDgzz2GTn8977vnmzkTGGyxiVS6H+B18JcDX0MIqiMu9GbgKYoTU4sicoCC4BU8BLZz8CUkC7mToHis+pMSY3C6CvgRbwRkRMr9czwDugDbwFbgExMOmcG8kqC47iODbGGCMiJo5j0+12TafTMUDn5OTEHB8fG6DjHLntHLjGhRwDjLLFFbXb7baIICIAZOxKxo4ODg4eAC+AWeAGVs5c0ZQFK4AkSUJgRIQkSQAiEaHZbC4Bz4Cag+fSXlRcvpAq3msRIU1T9vf3ERG01hweHk552zvh7HtYzROgjy28cx2LIn4F/HBrnI3SR661Pn8mIuzt7U1lshIBN4FprNYDrFERV4ClVqsVp2n6cGZm5nk2Yq11cM3abkw6aC7VoyKOgE0f0dHR0X0P9hGFpv9te3sb4CuDTaYUmGq1ul6r1d77TZeXl6+HIKG5srKyi9VTGNJ2HNiIyCel1Mbc3NzHJElYXV0NwkLPgDvAY2xR5QoLRmucAonWugGIiFCv1xnWOKRzo9Hwe/SBM6DnIh8AF1W1AKfVanV9fn7+Q5Gm2bm2trYLfPkbcAr0RWRHKfW0Xq9vjiuqTJqfOOgZ9hynw5uP61wp0NNa7yilNhYWFrY8ZJTebvSBrpv9EHjctegr81RrvaWUihYXF+9ScEyAzw54yog0A0Sh2yjwIVDBNoNpbPOfxXazCQazZrAR/gS+Ad+xN5aGP/sQSJ33JmP7m2cYLNiIW+5/uTRD+Yj98BfGhFtzrdCBBBu5byDWqwzrd8FwoW+Rzj4zA5uPBf+LcfW+q38BmqVkrsNuDnIAAAAASUVORK5CYII%3D), auto");
						ha = "big" == x ? a("#" + b + "volumecontroller").width() : G ? a("#" + b + "volumecontroller").height() : a("#" + b + "volumecontroller").width()
					},
					onmove: function(h) {
						if ("big" == x)
							ha + h.offset.x < a("#" + b + "volumegrab").width() ? a("#" + b + "volumecontroller").css({
								width: ha + h.offset.x + "px"
							}) : a("#" + b + "volumecontroller").css({
								width: a("#" + b + "volumegrab").width() + "px"
							}),
							0 > ha + h.offset.x && a("#" + b + "volumecontroller").css({
								width: "0px"
							}),
								C = 100 * a("#" + b + "volumecontroller").width() / a("#" + b + "volumegrab").width();
						else {
							if (G) {
								ha + h.offset.y < a("#" + b + "volumegrab").height() ? a("#" + b + "volumecontroller").css({
									height: ha + h.offset.y + "px"
								}) : a("#" + b + "volumecontroller").css({
									height: a("#" + b + "volumegrab").height() + "px"
								});
								0 > ha + h.offset.y && a("#" + b + "volumecontroller").css({
									height: "0px"
								});
								try {
									d.height = a("#" + b + "volumecontroller").height()
								} catch (Ia) {
									D(Ia)
								}
								C = 100 * a("#" + b + "volumecontroller").height() / a("#" + b + "volumegrab").height()
							} else {
								ha + h.offset.x < a("#" + b + "volumegrab").width() ? a("#" + b + "volumecontroller").css({
									width: ha + h.offset.x + "px"
								}) : a("#" + b + "volumecontroller").css({
									width: a("#" + b + "volumegrab").width() + "px"
								});
								0 > ha + h.offset.x && a("#" + b + "volumecontroller").css({
									width: "0px"
								});
								try {
									d.width = a("#" + b + "volumecontroller").width()
								} catch (Ia) {
									D(Ia)
								}
								C = 100 * a("#" + b + "volumecontroller").width() / a("#" + b + "volumegrab").width()
							}
							za.innerHTML = Math.ceil(C) + "%"
						}
						B();
						O.volume = C / 100
					},
					onfinish: function(h) {
						a("#" + b + "volumegrab").css("cursor", "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAAABx0RVh0U29mdHdhcmUAQWRvYmUgRmlyZXdvcmtzIENTNAay06AAAALlSURBVEiJxZe9bhNBEMd/5zsSkhjs0Fi0SYG7CAmltQUpeAGeISmTB6CFSOQFkoKOwqJAQAQNCCHyIUs0KYAiEmUaQ2GshORuPyhu196c95wLSHik0a3v7P3Nf2Zudx1orRmHlcZCHSc48t0MgqDIbwPjANr4SHPL6gWPsJIDe2k+PwAUIIwXaxqt9ZB7LAC2gTfANeCtNga8A24CVeAqEDrB5bKKgrctaHNzU5fLZe2Aj42/B2omsEkTQC64SHOVgMaI54GUcjqO47vAd+AFcB2YAq7kqS8K9ppSCiAQQiCEAAi63e494DkwC0yT9tEQvAjY7V7m5+cBkFJaGEmS9MFCCDqdTgN4Rlr3aTxpLwLWwMOtrS0Ams0mjUZjCGaDcMZ3gBvADJ6UFwU/XV5ePraTKqXIgbnjgLTWFnyOVeQ91qTvJ0mSoJSi1Wr1A7AwKWVfvRlD2t0TeFI9Cmxr238vLUwphZQSKSVHR0eTLiwDDo1Sd+GBrPyMvQa6wCvSBumn0dbXNpj1w8PDSaf2Nniv5SkuAY1er1dWSt2vVCotTBqtWt/VHRvLXT7zFAfAjlXU6XSaFmwV+dw+29vbA/hGuoYrPJtIbqqjKFqvVqsf7KRLS0tTPojPV1ZWDhg0pTTwQoq1EOJzGIYbtVrtU5IkrK6uemG+e8At4BEQG5dZxXk1VkAipWwDQghBvV4nW2Nfndvttp0jBk6BMzzb5aiuFsBJFEXrc3NzH0fV1PW1tbUD4Ou/gBUQCyH2wzB8Uq/Xdy5qKifNjw30FEi4RI1d+JmUcj8Mw42FhYVdC8mrt7EY+G089oEvWjJtZ55IKXfDMAwWFxdvk9mxMvbFAE/ISTNA4DtxeA57JdJ1d4Z0n50FyqTrsJs1TarwF/AD+El6OpHwd4c9ZaLXzthu8lmwIFXcM98bSjMUV2ytZGAT5jq06zA4ccYMFpA0Kod1WTAM6juqzjYz5ya/EPw/bGx/Yf4AHxykPX4eCXQAAAAASUVORK5CYII%3D), auto");
						try {
							window.localStorage.removeItem(b + "volume"),
								window.localStorage.setItem(b + "volume", C)
						} catch (Ia) {
							D(Ia)
						}
					}
				}));
			Aa = document.createElement("div");
			Aa.id = b + "playstopcontainer";
			F.appendChild(Aa);
			mobilecheck() || a("#" + b + "playstopcontainer").mouseenter(function() {
				pa ? (a("#" + b + "stopbutton").stop(),
					a("#" + b + "stopbutton").animate({
						opacity: .5
					}, 200, function() {})) : (a("#" + b + "playbutton").stop(),
					a("#" + b + "playbutton").animate({
						opacity: .5
					}, 200, function() {}))
			}).mouseleave(function() {
				pa ? (a("#" + b + "stopbutton").stop(),
					a("#" + b + "stopbutton").animate({
						opacity: 1
					}, 200, function() {})) : (a("#" + b + "playbutton").stop(),
					a("#" + b + "playbutton").animate({
						opacity: 1
					}, 200, function() {}))
			});
			a("#" + b + "playstopcontainer").click(function() {
				(pa = !pa) ? Z() : X()
			}).sodahdisableSelection();
			"big" == x ? a("#" + b + "playstopcontainer").css({
				"z-index": "42",
				position: "absolute",
				height: "80px",
				width: "80px",
				overflow: "hidden",
				"border-radius": "50%",
				border: "2px solid " + J,
				bottom: "20px",
				cursor: "pointer",
				"background-color": m
			}) : a("#" + b + "playstopcontainer").css({
				position: "absolute",
				left: "0px",
				top: "0px",
				"background-color": m,
				cursor: "pointer"
			});
			cb = document.createElement("div");
			cb.id = b + "player";
			Aa.appendChild(cb);
			a("#" + b + "player").css({
				position: "absolute",
				top: "0px",
				left: "0px",
				width: "0px",
				height: "0px"
			});
			db = document.createElement("div");
			db.id = b + "playbutton";
			Aa.appendChild(db);
			a("#" + b + "playbutton").css({
				position: "absolute",
				"z-index": "43",
				fill: J
			}).html('<svg version="1.1" id="Ebene_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 800 800" enable-background="new 0 0 800 800" xml:space="preserve"><path d="M226.928,725.51c-5.258,3.01-94.982,65.39-94.98,0l-0.001-647.112c0-75.341,92.9-0.739,94.982,0l421.455,285.66 c26.227,26.226,26.229,68.752,0,94.981L226.928,725.51z"/></svg>').sodahdisableSelection();
			"big" == x && a("#" + b + "playbutton").css({
				top: "20px",
				left: "20px",
				right: "20px",
				bottom: "20px"
			});
			eb = document.createElement("div");
			eb.id = b + "stopbutton";
			Aa.appendChild(eb);
			a("#" + b + "stopbutton").css({
				position: "absolute",
				"z-index": "44",
				visibility: "hidden",
				fill: J
			}).html('<svg version="1.1" id="Ebene_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 800 800" style="enable-background:new 0 0 800 800;" xml:space="preserve"><g><path d="M719.4,772H517.8c-27.5,0-50.1-22.5-50.1-50.1V82.1c0-27.5,22.5-50.1,50.1-50.1h201.6c27.5,0,50.1,22.5,50.1,50.1v639.8 C769.5,749.5,747,772,719.4,772z"/></g><g><path d="M280.7,772H79.1C51.5,772,29,749.5,29,721.9V82.1C29,54.5,51.5,32,79.1,32h201.6c27.5,0,50.1,22.5,50.1,50.1v639.8 C330.8,749.5,308.3,772,280.7,772z"/></g></svg>').sodahdisableSelection();
			"big" == x && a("#" + b + "stopbutton").css({
				top: "20px",
				left: "20px",
				right: "20px",
				bottom: "20px"
			});
			O = new Audio;
			O.id = b + "html5audio";
			O.preload = "auto";
			setInterval(function() {
				pa && Ra && 1 == O.networkState && O.play()["catch"](function() {})
			}, 1E3);
			"small" == x && (G ? a("#" + b + "volumecontroller").css({
				height: "0px"
			}) : a("#" + b + "volumecontroller").css({
				width: "0px"
			}));
			B();
			a(window).resize(function() {
				S()
			});
			S();
			setTimeout(function() {
				S()
			}, 200);
			Ba();
			R(C, 0);
			K();
			setTimeout(function() {
				!fb || mobilecheck() || Tb() || (pa = !0,
					Z())
			}, 10)
		}
		function B() {
			0 == C ? (a("#" + b + "volumeoffbutton").css({
				visibility: "visible"
			}),
				a("#" + b + "volumeupbutton").css({
					visibility: "hidden"
				})) : (a("#" + b + "volumeoffbutton").css({
				visibility: "hidden"
			}),
				a("#" + b + "volumeupbutton").css({
					visibility: "visible"
				}))
		}
		function R(h, c) {
			if ("big" == x)
				c = c || 0,
				c != h && a({
					countNum: c
				}).animate({
					countNum: Math.floor(h)
				}, {
					duration: 800,
					easing: "linear",
					step: function() {
						try {
							0 == Math.ceil(this.countNum) % 5 && (O.volume = this.countNum / 100)
						} catch (z) {
							D(z)
						}
					},
					complete: function() {
						try {
							O.volume = h / 100
						} catch (z) {
							D(z)
						}
					}
				}),
					a("#" + b + "volumecontroller").stop(),
					a("#" + b + "volumecontroller").animate({
						width: (f - 40) / 100 * h + "px"
					}, {
						duration: 800,
						progress: function() {},
						complete: function() {}
					});
			else if (c = c || 0,
			c != h && a({
				countNum: c
			}).animate({
				countNum: Math.floor(h)
			}, {
				duration: 800,
				easing: "linear",
				step: function() {
					za.innerHTML = Math.ceil(this.countNum) + "%";
					try {
						0 == Math.ceil(this.countNum) % 5 && (O.volume = this.countNum / 100)
					} catch (z) {
						D(z)
					}
				},
				complete: function() {
					za.innerHTML = Math.floor(h) + "%";
					try {
						O.volume = h / 100
					} catch (z) {
						D(z)
					}
				}
			}),
				G) {
				a("#" + b + "volumecontroller").css({
					left: "0px",
					top: f + "px"
				});
				a("#" + b + "volumecontroller").stop();
				a("#" + b + "volumecontroller").animate({
					height: y / 100 * h + "px"
				}, {
					duration: 800,
					progress: function() {
						try {
							d.height = Math.round(a("#" + b + "volumecontroller").height())
						} catch (z) {
							D(z)
						}
					},
					complete: function() {
						try {
							d.height = Math.round(a("#" + b + "volumecontroller").height())
						} catch (z) {
							D(z)
						}
					}
				});
				a("#" + b + "volumecontroller").css({
					width: f + "px",
					"border-bottom": "solid 1px " + m,
					"border-right": "none"
				});
				try {
					a("#" + b + "canvas").css({
						top: f + "px",
						left: "0px"
					}),
						d.width = f
				} catch (z) {
					D(z)
				}
			} else {
				a("#" + b + "volumecontroller").css({
					top: "0px",
					left: n + "px"
				});
				a("#" + b + "volumecontroller").stop();
				a("#" + b + "volumecontroller").animate({
					width: y / 100 * h + "px"
				}, {
					duration: 800,
					progress: function() {
						try {
							d.width = Math.round(a("#" + b + "volumecontroller").width())
						} catch (z) {
							D(z)
						}
					},
					complete: function() {
						try {
							d.width = Math.round(a("#" + b + "volumecontroller").width())
						} catch (z) {
							D(z)
						}
					}
				});
				a("#" + b + "volumecontroller").css({
					"border-right": "solid 1px " + m,
					"border-bottom": "none",
					height: n + "px"
				});
				try {
					a("#" + b + "canvas").css({
						top: "0px",
						left: n + "px"
					}),
						d.height = n
				} catch (z) {
					D(z)
				}
			}
		}
		function S() {
			f = a("#" + b).width();
			n = a("#" + b).height();
			if ("small" == x) {
				if (G = f < n ? !0 : !1) {
					y = n - 2 * f;
					a("#" + b + "volumecontroller").css({
						left: "0px",
						top: f + "px",
						width: f + "px",
						height: y / 100 * C + "px",
						"border-bottom": "solid 1px " + m,
						"border-right": "none"
					}).stop();
					try {
						a("#" + b + "canvas").css({
							left: "0px",
							top: f + "px"
						}),
							d.width = f,
							d.height = Math.round(y / 100 * C)
					} catch (z) {
						D(z)
					}
					a("#" + b + "playstopcontainer").css({
						height: f + "px",
						width: f + "px"
					});
					a("#" + b + "playbutton, #" + b + "stopbutton").css({
						top: f / 4 / 2 + "px",
						left: f / 4 / 2 + "px",
						right: f / 4 / 2 + "px",
						bottom: f / 4 / 2 + "px"
					});
					a("#" + b + "channelname").css({
						"font-size": f / 2 + "px",
						overflow: "hidden",
						"line-height": f / 2 + "px",
						height: f / 2 + "px",
						width: y + "px",
						top: f + y / 2 + "px",
						left: f - f / 2 / 2 - y / 2 + "px",
						rotate: "90deg"
					});
					a("#" + b + "statustext").css({
						"font-size": f / 4 + "px",
						"line-height": f / 4 + "px",
						height: f / 4 + "px",
						width: y + "px",
						top: f + y / 2 + "px",
						left: -(y / 2) + f / 10 + f / 4 / 2 + "px",
						rotate: "90deg"
					});
					a("#" + b + "volumegrab").css({
						left: "0px",
						top: f + "px",
						height: y + "px",
						width: f + "px"
					});
					"false" != ka ? (a("#" + b + "channelname").css({
						width: y - f + "px",
						top: f + (y - f) / 2 + "px",
						left: f - f / 2 / 2 - (y - f) / 2 + "px"
					}),
						a("#" + b + "statustext").css({
							width: y - f + "px",
							top: f + (y - f) / 2 + "px",
							left: -((y - f) / 2) + f / 10 + f / 4 / 2 + "px"
						}),
						a("#" + b + "imagecontainer").css({
							left: "0px",
							top: f + y + "px",
							width: f + "px",
							height: f + "px"
						}),
						a("#" + b + "imagehit1", "#" + b + "imagehit2").css({
							width: f + "px",
							height: f + "px",
							left: "0px",
							top: "0px"
						}),
						a("#" + b + "volumesetcontainer").css({
							left: "0px",
							top: y + "px",
							width: f + "px",
							height: f + "px"
						}),
						a("#" + b + "volumeupbutton , #" + b + "volumeoffbutton").css({
							height: f / 2 + "px",
							width: f / 2 + "px",
							top: (f - f / 2) / 2 + "px",
							left: f - (f / 20 + f / 2) + "px",
							rotate: "90deg"
						}),
						a("#" + b + "volumetext").css({
							"font-size": f / 4 + "px",
							"line-height": f / 4 + "px",
							height: f / 4 + "px",
							width: f + "px",
							top: f / 2 - f / 8 + "px",
							left: f / 4 / 2 - f / 2 + f / 10 + "px",
							rotate: "90deg"
						})) : (a("#" + b + "volumesetcontainer").css({
						left: "0px",
						top: f + y + "px",
						width: f + "px",
						height: f + "px"
					}),
						a("#" + b + "volumeupbutton , #" + b + "volumeoffbutton").css({
							top: f / 20 + "px",
							left: (f - f / 2) / 2 + "px",
							width: f / 2 + "px",
							height: f / 2 + "px",
							rotate: "0deg"
						}),
						a("#" + b + "volumetext").css({
							"font-size": f / 4 + "px",
							"line-height": f / 4 + "px",
							height: f / 4 + "px",
							width: f + "px",
							top: f - f / 4 - f / 10 + f / 40 + "px",
							left: "0px",
							rotate: "0deg"
						}),
						a("#" + b + "volumehit").css({
							width: f + "px",
							height: f + "px",
							left: "0px",
							top: "0px"
						}))
				} else {
					y = f - 2 * n;
					a("#" + b + "volumecontroller").css({
						top: "0px",
						left: n + "px",
						height: n + "px",
						width: y / 100 * C + "px",
						"border-right": "solid 1px " + m,
						"border-bottom": "none"
					}).stop();
					try {
						a("#" + b + "canvas").css({
							top: "0px",
							left: n + "px"
						}),
							d.width = Math.round(y / 100 * C),
							d.height = n
					} catch (z) {}
					a("#" + b + "playstopcontainer").css({
						height: n + "px",
						width: n + "px"
					});
					a("#" + b + "playbutton, #" + b + "stopbutton").css({
						top: n / 4 / 2 + "px",
						left: n / 4 / 2 + "px",
						right: n / 4 / 2 + "px",
						bottom: n / 4 / 2 + "px"
					});
					a("#" + b + "volumegrab").css({
						top: "0px",
						left: n + "px",
						width: y + "px",
						height: n + "px"
					});
					a("#" + b + "channelname").css({
						top: "0px",
						left: n + "px",
						height: n / 1.5 + "px",
						"font-size": n / 2 + "px",
						lineHeight: n / 2 + "px",
						"margin-left": n / 10 + "px",
						padding: "0",
						rotate: "0deg"
					});
					a("#" + b + "statustext").css({
						"font-size": n / 4 + "px",
						"line-height": n / 4 + "px",
						height: n / 2 + "px",
						top: n - n / 4 - n / 10 + n / 40 + "px",
						left: n + "px",
						"margin-left": n / 10 + "px",
						rotate: "0deg"
					});
					"false" != ka ? (a("#" + b + "channelname").css({
						width: y - n + "px"
					}),
						a("#" + b + "statustext").css({
							width: y - n + "px"
						}),
						a("#" + b + "imagecontainer").css({
							left: n + y + "px",
							top: "0px",
							width: n + "px",
							height: n + "px"
						}),
						a("#" + b + "imagehit1", "#" + b + "imagehit2").css({
							width: n + "px",
							height: n + "px",
							left: "0px",
							top: "0px"
						}),
						a("#" + b + "volumesetcontainer").css({
							left: y + "px",
							top: "0px",
							width: n + "px",
							height: n + "px"
						})) : (a("#" + b + "channelname").css({
						width: y + "px"
					}),
						a("#" + b + "statustext").css({
							width: y + "px"
						}),
						a("#" + b + "volumesetcontainer").css({
							left: n + y + "px",
							top: "0px",
							width: n + "px",
							height: n + "px"
						}),
						a("#" + b + "volumehit").css({
							width: n + "px",
							height: n + "px",
							left: "0px",
							top: "0px"
						}));
					a("#" + b + "volumeupbutton, #" + b + "volumeoffbutton").css({
						top: n / 20 + "px",
						left: (n - n / 2) / 2 + "px",
						width: n / 2 + "px",
						height: n / 2 + "px",
						rotate: "0deg"
					});
					a("#" + b + "volumetext").css({
						"font-size": n / 4 + "px",
						"line-height": n / 4 + "px",
						height: n / 4 + "px",
						width: n + "px",
						top: n - n / 4 - n / 10 + n / 40 + "px",
						left: "0px",
						rotate: "0deg"
					})
				}
				ca();
				P()
			} else {
				var h = n / 2 - 20;
				a("#" + b + "imagecontainer").css({
					height: h + "px",
					width: h + "px",
					top: "20px",
					left: f / 2 - h / 2 + "px"
				});
				ia() || a("#" + b + "coverblurshadow1, #" + b + "coverblurshadow2").css({
					height: h + "px",
					width: h + "px",
					top: "80px",
					left: f / 2 - h / 2 + "px"
				});
				a("#" + b + "stationname").css({
					top: n / 2 + 20 + "px",
					width: f - 40 + "px"
				});
				a("#" + b + "artist").css({
					top: n / 2 + 50 + "px",
					width: f - 40 + "px"
				});
				a("#" + b + "songtitle").css({
					top: n / 2 + 80 + "px",
					width: f - 40 + "px"
				});
				if ("1" == la || "2" == la || "3" == la || "4" == la || "5" == la || "7" == la || "8" == la) {
					h = 0;
					var c = n
				} else
					h = n / 2,
						c = n / 2;
				a("#" + b + "canvas").css({
					top: h + "px",
					height: c + "px",
					width: f + "px"
				});
				d.width = f;
				d.height = c;
				a("#" + b + "footercontainer").css({
					width: f + "px"
				});
				a("#" + b + "volumegrab").css({
					top: n / 2 + n / 2 / 2 - 20 + "px",
					height: "40px",
					width: f - 40 + "px"
				});
				a("#" + b + "volumecontrollerbackground").css({
					top: n / 2 + n / 2 / 2 - 1.5 + "px",
					width: f - 40 + "px"
				});
				a("#" + b + "volumecontroller").css({
					top: n / 2 + n / 2 / 2 - 1.5 + "px",
					width: (f - 40) / 100 * C + "px"
				}).stop();
				Ga() && a("#" + b + "volumesetcontainer, #" + b + "volumecontroller, #" + b + "volumecontrollerbackground").css({
					display: "none"
				});
				a("#" + b + "playstopcontainer").css({
					left: f / 2 - 40 + "px"
				});
				ma();
				l();
				H()
			}
			L = [];
			for (h = 0; 512 > h; h++)
				c = {},
					c.x = Math.floor(Math.random() * f + 1),
					c.y = Math.floor(Math.random() * n + 1),
					c.radius = G ? Math.floor(Math.random() * f / 5 + 2) : Math.floor(Math.random() * n / 5 + 2),
					c.alpha = 1,
					c.speed = Math.floor(50 * Math.random() + 30),
					L.push(c)
		}
		function ma() {
			a("#" + b + "temp_stationname").html(Y);
			a("#" + b + "temp_stationname").width() > f - 80 - 40 ? gb || ($mq_stationname = a("#" + b + "stationname").sodahmarquee({
				duration: 5E3 * f / 300,
				direction: "left",
				duplicated: !0
			}),
				gb = !0) : (a("#" + b + "stationname").css({
				"text-align": "center"
			}).html(Y),
				gb = !1)
		}
		function l() {
			a("#" + b + "temp_artist").html(M);
			M != Ub && (a("#" + b + "artist").css({
				"text-align": "left"
			}).html(M),
				MarqueeArtistrunning = !1);
			a("#" + b + "temp_artist").width() > f - 40 ? MarqueeArtistrunning || ($mq_artist = a("#" + b + "artist").sodahmarquee({
				duration: 5E3 * f / 300,
				direction: "left",
				duplicated: !0
			}),
				MarqueeArtistrunning = !0) : (a("#" + b + "artist").css({
				"text-align": "center"
			}).html(M),
				MarqueeArtistrunning = !1);
			Ub = M
		}
		function H() {
			a("#" + b + "temp_songtitle").html(N);
			N != Vb && (a("#" + b + "songtitle").css({
				"text-align": "left"
			}).html(N),
				MarqueeSongtitlerunning = !1);
			a("#" + b + "temp_songtitle").width() > f - 40 ? MarqueeSongtitlerunning || ($mq_songtitle = a("#" + b + "songtitle").sodahmarquee({
				duration: 5E3 * f / 300,
				direction: "left",
				duplicated: !0
			}),
				MarqueeSongtitlerunning = !0) : (a("#" + b + "songtitle").css({
				"text-align": "center"
			}).html(N),
				MarqueeSongtitlerunning = !1);
			Vb = N
		}
		function ca() {
			"TRUE" == ta.toUpperCase() && (Ca = !1,
				a("#" + b + "channelname").html(Y),
				a("#" + b + "temp_radio").html(Y),
				na());
			"FALSE" == ta.toUpperCase() && (a("#" + b + "channelname").html(Y),
				a("#" + b + "channelname").css({
					overflow: "hidden",
					"text-overflow": "ellipsis"
				}));
			if ("AUTO" == ta.toUpperCase()) {
				a("#" + b + "temp_radio").css({
					"font-size": n / 2 + "px",
					lineHeight: "1"
				}).html(Y);
				var h = 2;
				"false" != ka && (h = 3);
				a("#" + b + "channelname").html(Y);
				Ca = !1;
				G ? a("#" + b + "temp_radio").width() > n - h * f ? na() : (a("#" + b + "channelname").html(Y),
					Ca = !1) : a("#" + b + "temp_radio").width() > f - h * n ? na() : (a("#" + b + "channelname").html(Y),
					Ca = !1)
			}
			latest_radioname = Y
		}
		function na() {
			if (!Ca) {
				try {
					Wb.sodahmarquee("destroy")
				} catch (aa) {}
				var h = G ? 2 * (a("#" + b + "temp_radio").width() + n) : 10 * (a("#" + b + "temp_radio").width() + f);
				Wb = a("#" + b + "channelname").sodahmarquee({
					duration: h,
					direction: "left",
					gap: f / 2,
					duplicated: !0
				});
				Ca = !0
			}
		}
		function P() {
			"TRUE" == ta.toUpperCase() && (a("#" + b + "statustext").html(v),
				a("#" + b + "temp_song").html(v),
				Da = !1,
				V());
			"FALSE" == ta.toUpperCase() && v != Xb && (a("#" + b + "statustext").html(v),
				a("#" + b + "statustext").css({
					overflow: "hidden",
					"text-overflow": "ellipsis"
				}));
			if ("AUTO" == ta.toUpperCase()) {
				a("#" + b + "temp_song").css({
					"font-size": n / 4 + "px",
					"line-height": n / 4 + "px"
				}).html(v);
				var h = 2;
				"false" != ka && (h = 3);
				a("#" + b + "statustext").html(v);
				Da = !1;
				G ? a("#" + b + "temp_song").width() > n - h * f ? V() : (a("#" + b + "statustext").html(v),
					Da = !1) : a("#" + b + "temp_song").width() > f - h * n ? V() : (a("#" + b + "statustext").html(v),
					Da = !1)
			}
			Xb = v
		}
		function V() {
			if (!Da) {
				try {
					Yb.sodahmarquee("destroy")
				} catch (aa) {}
				var h = G ? 2 * (a("#" + b + "temp_song").width() + n) : 10 * (a("#" + b + "temp_song").width() + f);
				Yb = a("#" + b + "statustext").sodahmarquee({
					duration: h,
					direction: "left",
					gap: f / 2,
					duplicated: !0
				});
				Da = !0
			}
		}
		function Z() {
			if (Ra) {
				fb && (da = "fake");
				if ("undefined" == typeof Ja && "real" == da) {
					try {
						Ja = new (window.AudioContext || window.webkitAudioContext),
							ua = Ja.createAnalyser(),
							ua.smoothingTimeConstant = .9,
							ua.fftSize = 1024
					} catch (h) {
						"real" == da && (da = "fake"),
							D(h)
					}
					try {
						"crossOrigin"in O && (O.crossOrigin = "anonymous",
							O.onerror = ba,
							Zb = O,
							$b = Ja.createMediaElementSource(Zb),
							$b.connect(ua),
							ua.connect(Ja.destination))
					} catch (h) {
						D("SODAH: " + h)
					}
				}
				ac = "none" != r.toLowerCase() && "nothing" != r.toLowerCase() && "php" != r.toLowerCase() && "true" == bc ? r + Ea() : Ea();
				a("#" + b + "playbutton").css({
					visibility: "hidden"
				});
				a("#" + b + "stopbutton").css({
					visibility: "visible"
				});
				try {
					a(".sodahnativeflashradio4").each(function() {
						a(this).attr("id") != b && a(this).data("flashradio").stopradio()
					})
				} catch (h) {
					D(h)
				}
				O.src = ac;
				O.play()["catch"](function() {})
			}
		}
		function ba(a) {
			a.target ? D("server not set correctly") : D("browser doesn't support crossOrigin requests")
		}
		function X() {
			if (0 < O.readyState) {
				a("#" + b + "playbutton").css({
					visibility: "visible"
				});
				a("#" + b + "stopbutton").css({
					visibility: "hidden"
				});
				pa = !1;
				try {
					O.pause()
				} catch (h) {}
			}
		}
		function K() {
			if ("fake" == da || "real" == da) {
				try {
					window.requestAnimationFrame(K) || window.mozRequestAnimationFrame(K) || window.webkitRequestAnimationFrame(K) || window.msRequestAnimationFrame(K) || window.oRequestAnimationFrame(K)
				} catch (cc) {}
				if ("fake" == da) {
					q = [];
					for (var a = 0; 511 > a; a += 1)
						pa ? q.push(Math.floor(254 / (a / 100 + 1) * Math.random() + 1)) : q.push(0),
							Ka[a] += (q[a] - Ka[a]) / 9;
					q = Ka
				}
				try {
					"real" == da && (q = new Uint8Array(ua.frequencyBinCount),
						ua.getByteFrequencyData(q))
				} catch (cc) {}
				try {
					switch (la) {
						case "1":
							Fa();
							break;
						case "2":
							c.clearRect(0, 0, d.width, d.height);
							c.lineWidth = 1;
							c.miterLimit = 1;
							c.beginPath();
							if (G) {
								c.moveTo(0, 0);
								for (b = 0; b < q.length / 2; b += 1)
									c.lineTo(q[b] * d.width / 255, b * d.height / q.length * 2);
								c.lineTo(0, d.height);
								c.lineTo(0, 0)
							} else {
								c.moveTo(0, d.height);
								for (var b = 0; b < q.length / 2; b += 1)
									c.lineTo(b * d.width / q.length * 2, d.height - q[b] * d.height / 255 + 2);
								c.lineTo(d.width, d.height);
								c.lineTo(0, d.height)
							}
							c.fillStyle = "rgba(" + p(m).r + ", " + p(m).g + ", " + p(m).b + ", 1.0)";
							c.fill();
							c.closePath();
							break;
						case "3":
							c.clearRect(0, 0, d.width, d.height);
							c.lineWidth = 1;
							c.miterLimit = 1;
							if (G)
								for (l = 0; l < d.height; l += 3)
									g = Math.round(q.length / 2 * l / d.height),
										c.beginPath(),
										c.moveTo(0, l),
										c.lineTo(q[g] * d.width / 255, l),
										c.strokeStyle = "rgba(" + p(m).r + ", " + p(m).g + ", " + p(m).b + ", 1.0)",
										c.stroke(),
										c.closePath();
							else
								for (var l = 0; l < d.width; l += 3) {
									var g = Math.round(q.length / 2 * l / d.width);
									c.beginPath();
									c.moveTo(l, d.height);
									c.lineTo(l, d.height - q[g] * d.height / 255 + 2);
									c.strokeStyle = "rgba(" + p(m).r + ", " + p(m).g + ", " + p(m).b + ", 1.0)";
									c.stroke();
									c.closePath()
								}
							break;
						case "4":
							c.clearRect(0, 0, d.width, d.height);
							c.lineWidth = 0;
							c.miterLimit = 1;
							u = [];
							c.beginPath();
							if (G) {
								c.moveTo(0, 0);
								u = [];
								for (f = 0; f < d.height + 20; f += 20)
									e = Math.round(q.length / 8 * f / d.height),
										u.push(q[e] * d.width / 255),
										u.push(f);
								T(c, u, .5);
								c.lineTo(0, d.height);
								c.lineTo(0, 0)
							} else {
								c.moveTo(0, d.height);
								for (var f = 0; f < d.width + 20; f += 20) {
									var e = Math.round(q.length / 8 * f / d.width);
									u.push(f);
									u.push(d.height - q[e] * d.height / 255 + 2)
								}
								T(c, u, .5);
								c.lineTo(d.width, d.height);
								c.lineTo(0, d.height)
							}
							c.fillStyle = "rgba(" + p(m).r + ", " + p(m).g + ", " + p(m).b + ", 0.2)";
							c.fill();
							c.closePath();
							c.beginPath();
							if (G) {
								c.moveTo(0, 0);
								u = [];
								for (f = 0; f < d.height + 20; f += 20)
									e = Math.round(q.length / 8 * f / d.height),
										u.push(q[e + e] * d.width / 255),
										u.push(f);
								T(c, u, .5);
								c.lineTo(0, d.height);
								c.lineTo(0, 0)
							} else {
								c.moveTo(0, d.height);
								u = [];
								for (f = 0; f < d.width + 20; f += 20)
									e = Math.round(q.length / 8 * f / d.width),
										u.push(f),
										u.push(d.height - q[e + e] * d.height / 255 + 2);
								T(c, u, .5);
								c.lineTo(d.width, d.height);
								c.lineTo(0, d.height)
							}
							c.fillStyle = "rgba(" + p(m).r + ", " + p(m).g + ", " + p(m).b + ", 0.3)";
							c.fill();
							c.closePath();
							c.beginPath();
							if (G) {
								c.moveTo(0, 0);
								u = [];
								for (f = 0; f < d.height + 20; f += 20)
									e = Math.round(q.length / 8 * f / d.height),
										u.push(q[e + e + e] * d.width / 255),
										u.push(f);
								T(c, u, .5);
								c.lineTo(0, d.height);
								c.lineTo(0, 0)
							} else {
								c.moveTo(0, d.height);
								u = [];
								for (f = 0; f < d.width + 20; f += 20)
									e = Math.round(q.length / 8 * f / d.width),
										u.push(f),
										u.push(d.height - q[e + e + e] * d.height / 255 + 2);
								T(c, u, .5);
								c.lineTo(d.width, d.height);
								c.lineTo(0, d.height)
							}
							c.fillStyle = "rgba(" + p(m).r + ", " + p(m).g + ", " + p(m).b + ", 0.4)";
							c.fill();
							c.closePath();
							c.beginPath();
							if (G) {
								c.moveTo(0, 0);
								u = [];
								for (f = 0; f < d.height + 20; f += 20)
									e = Math.round(q.length / 8 * f / d.height),
										u.push(q[e + e + e + e] * d.width / 255),
										u.push(f);
								T(c, u, .5);
								c.lineTo(0, d.height);
								c.lineTo(0, 0)
							} else {
								c.moveTo(0, d.height);
								u = [];
								for (f = 0; f < d.width + 20; f += 20)
									e = Math.round(q.length / 8 * f / d.width),
										u.push(f),
										u.push(d.height - q[e + e + e + e] * d.height / 255 + 2);
								T(c, u, .5);
								c.lineTo(d.width, d.height);
								c.lineTo(0, d.height)
							}
							c.fillStyle = "rgba(" + p(m).r + ", " + p(m).g + ", " + p(m).b + ", 0.5)";
							c.fill();
							c.closePath();
							break;
						case "5":
							c.clearRect(0, 0, d.width, d.height);
							c.lineWidth = 2;
							c.lineCap = "round";
							c.miterLimit = 1;
							c.strokeStyle = "rgba(" + p(m).r + ", " + p(m).g + ", " + p(m).b + ", 1.0)";
							u = [];
							c.beginPath();
							if (G)
								for (c.moveTo(0, 0),
										 u = [],
										 w = 0; w < d.height + 20; w += 20)
									k = Math.round(q.length / 8 * w / d.height),
										u.push(q[k] * d.width / 255),
										u.push(w);
							else {
								c.moveTo(0, d.height);
								for (var w = 0; w < d.width + 20; w += 20) {
									var k = Math.round(q.length / 8 * w / d.width);
									u.push(w);
									u.push(d.height - q[k] * d.height / 255 + 2)
								}
							}
							T(c, u, .5);
							c.stroke();
							c.closePath();
							c.lineWidth = 1.8;
							c.lineCap = "round";
							c.miterLimit = 1;
							c.strokeStyle = "rgba(" + p(m).r + ", " + p(m).g + ", " + p(m).b + ", 0.8)";
							c.beginPath();
							if (G)
								for (c.moveTo(0, 0),
										 u = [],
										 w = 0; w < d.height + 20; w += 20)
									k = Math.round(q.length / 8 * w / d.height),
										u.push(q[k + k] * d.width / 255),
										u.push(w);
							else
								for (c.moveTo(0, d.height),
										 u = [],
										 w = 0; w < d.width + 20; w += 20)
									k = Math.round(q.length / 8 * w / d.width),
										u.push(w),
										u.push(d.height - q[k + k] * d.height / 255 + 2);
							T(c, u, .5);
							c.stroke();
							c.closePath();
							c.lineWidth = 1.6;
							c.lineCap = "round";
							c.miterLimit = 1;
							c.strokeStyle = "rgba(" + p(m).r + ", " + p(m).g + ", " + p(m).b + ", 0.6)";
							c.beginPath();
							if (G)
								for (c.moveTo(0, 0),
										 u = [],
										 w = 0; w < d.height + 20; w += 20)
									k = Math.round(q.length / 8 * w / d.height),
										u.push(q[k + k + k] * d.width / 255),
										u.push(w);
							else
								for (c.moveTo(0, d.height),
										 u = [],
										 w = 0; w < d.width + 20; w += 20)
									k = Math.round(q.length / 8 * w / d.width),
										u.push(w),
										u.push(d.height - q[k + k + k] * d.height / 255 + 2);
							T(c, u, .5);
							c.stroke();
							c.closePath();
							c.lineWidth = 1.6;
							c.lineCap = "round";
							c.miterLimit = 1;
							c.strokeStyle = "rgba(" + p(m).r + ", " + p(m).g + ", " + p(m).b + ", 0.4)";
							c.beginPath();
							if (G)
								for (c.moveTo(0, 0),
										 u = [],
										 w = 0; w < d.height + 20; w += 20)
									k = Math.round(q.length / 8 * w / d.height),
										u.push(q[k + k + k + k] * d.width / 255),
										u.push(w);
							else
								for (c.moveTo(0, d.height),
										 u = [],
										 w = 0; w < d.width + 20; w += 20)
									k = Math.round(q.length / 8 * w / d.width),
										u.push(w),
										u.push(d.height - q[k + k + k + k] * d.height / 255 + 2);
							T(c, u, .5);
							c.stroke();
							c.closePath();
							break;
						case "6":
							c.clearRect(0, 0, d.width, d.height);
							c.lineWidth = 2;
							c.lineJoin = "round";
							if (G)
								for (A = 0; A < d.height; A += 5)
									v = Math.round(q.length / 2 * A / d.height),
										t = (d.width - q[v] * d.width / 300) / 2,
										c.beginPath(),
										c.moveTo(d.width / 2, A),
										c.lineTo(t, A),
										c.lineTo(d.width / 2, A),
										c.strokeStyle = "rgba(" + p(m).r + ", " + p(m).g + ", " + p(m).b + ", 0.5)",
										c.stroke(),
										c.closePath(),
										c.beginPath(),
										c.moveTo(d.width / 2, A),
										c.lineTo(d.width - t, A),
										c.lineTo(d.width / 2, A),
										c.strokeStyle = "rgba(" + p(m).r + ", " + p(m).g + ", " + p(m).b + ", 0.5)",
										c.stroke(),
										c.closePath(),
										t = (d.width - q[v] * d.width / 600) / 2,
										c.beginPath(),
										c.moveTo(d.width / 2, A),
										c.lineTo(t, A),
										c.lineTo(d.width / 2, A),
										c.strokeStyle = "rgba(" + p(m).r + ", " + p(m).g + ", " + p(m).b + ", 0.5)",
										c.stroke(),
										c.closePath(),
										c.beginPath(),
										c.moveTo(d.width / 2, A),
										c.lineTo(d.width - t, A),
										c.lineTo(d.width / 2, A),
										c.strokeStyle = "rgba(" + p(m).r + ", " + p(m).g + ", " + p(m).b + ", 0.5)",
										c.stroke(),
										c.closePath();
							else
								for (var A = 0; A < d.width; A += 5) {
									var v = Math.round(q.length / 2 * A / d.width)
										, t = (d.height - q[v] * d.height / 300) / 2;
									c.beginPath();
									c.moveTo(A, d.height / 2);
									c.lineTo(A, t);
									c.lineTo(A, d.height / 2);
									c.strokeStyle = "rgba(" + p(m).r + ", " + p(m).g + ", " + p(m).b + ", 0.5)";
									c.stroke();
									c.closePath();
									c.beginPath();
									c.moveTo(A, d.height / 2);
									c.lineTo(A, d.height - t);
									c.lineTo(A, d.height / 2);
									c.strokeStyle = "rgba(" + p(m).r + ", " + p(m).g + ", " + p(m).b + ", 0.5)";
									c.stroke();
									c.closePath();
									t = (d.height - q[v] * d.height / 600) / 2;
									c.beginPath();
									c.moveTo(A, d.height / 2);
									c.lineTo(A, t);
									c.lineTo(A, d.height / 2);
									c.strokeStyle = "rgba(" + p(m).r + ", " + p(m).g + ", " + p(m).b + ", 0.5)";
									c.stroke();
									c.closePath();
									c.beginPath();
									c.moveTo(A, d.height / 2);
									c.lineTo(A, d.height - t);
									c.lineTo(A, d.height / 2);
									c.strokeStyle = "rgba(" + p(m).r + ", " + p(m).g + ", " + p(m).b + ", 0.5)";
									c.stroke();
									c.closePath()
								}
							break;
						case "7":
							c.clearRect(0, 0, d.width, d.height);
							for (var r = 0; r < q.length / 2; r += 2)
								c.beginPath(),
									c.moveTo(L[r].x - L[r].radius * q[r] / 255 / 2, n),
									c.lineTo(L[r].x, n - n * q[r] / 255),
									c.lineTo(L[r].x + L[r].radius * q[r] / 255 / 2, n),
									c.fillStyle = "rgba(" + p(m).r + ", " + p(m).g + ", " + p(m).b + ", " + (q[r] / 255 / 2 + .2) + ")",
									c.fill(),
									c.closePath();
							for (r = 1; r < q.length / 2; r += 2)
								c.beginPath(),
									c.moveTo(L[r].x - L[r].radius * q[r] / 255 / 2, 0),
									c.lineTo(L[r].x, n * q[r] / 255),
									c.lineTo(L[r].x + L[r].radius * q[r] / 255 / 2, 0),
									c.fillStyle = "rgba(" + p(m).r + ", " + p(m).g + ", " + p(m).b + ", " + (q[r] / 255 / 2 + .2) + ")",
									c.fill(),
									c.closePath();
							break;
						case "8":
							c.clearRect(0, 0, d.width, d.height);
							hb++;
							for (a = 0; a < q.length / 2; a++) {
								b = c;
								r = Math.cos(hb / L[a].speed) * L[a].radius + L[a].x;
								var x = Math.sin(hb / L[a].speed) * L[a].radius + L[a].y
									, H = L[a].radius * q[a] / 255
									, y = q[a] / 255 / 2 + .5;
								b.beginPath();
								b.arc(r, x, H, 0, 2 * Math.PI);
								b.closePath();
								b.fillStyle = "rgba(" + p(m).r + ", " + p(m).g + ", " + p(m).b + ", " + y + ")";
								b.fill()
							}
							break;
						default:
							Fa()
					}
				} catch (cc) {}
			}
		}
		function Fa() {
			c.clearRect(0, 0, d.width, d.height);
			c.lineWidth = 1;
			c.miterLimit = 1;
			c.beginPath();
			if (G)
				for (c.moveTo(0, 0),
						 a = 0; a < q.length / 2; a += 1)
					c.lineTo(q[a] * d.width / 255, a * d.height / q.length * 2);
			else {
				c.moveTo(0, d.height);
				for (var a = 0; a < q.length / 2; a += 1)
					c.lineTo(a * d.width / q.length * 2, d.height - q[a] * d.height / 255 + 2)
			}
			c.strokeStyle = "rgba(" + p(m).r + ", " + p(m).g + ", " + p(m).b + ", 1.0)";
			c.stroke();
			c.closePath()
		}
		function T(a, b, c, l, d, f) {
			a.beginPath();
			var h = l;
			c = "undefined" != typeof c ? c : .5;
			h = h ? h : !1;
			d = d ? d : 16;
			var g = [], e;
			l = b.slice(0);
			h ? (l.unshift(b[b.length - 1]),
				l.unshift(b[b.length - 2]),
				l.unshift(b[b.length - 1]),
				l.unshift(b[b.length - 2]),
				l.push(b[0]),
				l.push(b[1])) : (l.unshift(b[1]),
				l.unshift(b[0]),
				l.push(b[b.length - 2]),
				l.push(b[b.length - 1]));
			for (e = 2; e < l.length - 4; e += 2)
				for (h = 0; h <= d; h++) {
					var aa = (l[e + 2] - l[e - 2]) * c;
					var z = (l[e + 4] - l[e]) * c;
					var n = (l[e + 3] - l[e - 1]) * c;
					var k = (l[e + 5] - l[e + 1]) * c;
					var m = h / d;
					var p = 2 * Math.pow(m, 3) - 3 * Math.pow(m, 2) + 1;
					var q = -(2 * Math.pow(m, 3)) + 3 * Math.pow(m, 2);
					var r = Math.pow(m, 3) - 2 * Math.pow(m, 2) + m;
					m = Math.pow(m, 3) - Math.pow(m, 2);
					aa = p * l[e] + q * l[e + 2] + r * aa + m * z;
					n = p * l[e + 1] + q * l[e + 3] + r * n + m * k;
					g.push(aa);
					g.push(n)
				}
			a.moveTo(g[0], g[1]);
			for (qa = 2; qa < g.length - 1; qa += 2)
				a.lineTo(g[qa], g[qa + 1]);
			if (f)
				for (a.beginPath(),
						 f = 0; f < b.length - 1; f += 2)
					a.rect(b[f] - 2, b[f + 1] - 2, 4, 4)
		}
		function U(a) {
			var b = "";
			if ("undefined" !== typeof a) {
				var h = 0;
				/[^A-Za-z0-9\+\/=]/g.exec(a);
				a = a.replace(/[^A-Za-z0-9\+\/=]/g, "");
				do {
					var c = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(a.charAt(h++));
					var l = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(a.charAt(h++));
					var d = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(a.charAt(h++));
					var f = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(a.charAt(h++));
					c = c << 2 | l >> 4;
					l = (l & 15) << 4 | d >> 2;
					var g = (d & 3) << 6 | f;
					b += String.fromCharCode(c);
					64 != d && (b += String.fromCharCode(l));
					64 != f && (b += String.fromCharCode(g))
				} while (h < a.length)
			}
			return unescape(b)
		}
		function ea(a) {
			var b = 0
				, h = "";
			do
				h += String.fromCharCode(a.charCodeAt(b++) - 1);
			while (b < a.length - 1);
			return h
		}
		function Ba() {
			for (var a = window.location.href.toString().toLocaleLowerCase(), b = ea(U(dc)).toString(), c = [46, 102, 108, 97, 115, 104, 114, 97, 100, 105, 111, 46, 105, 110, 102, 111], d = [46, 115, 111, 100, 97, 104, 46, 100, 101], f = "", g = "", e = 0; e < c.length; e++)
				f += String.fromCharCode(c[e]);
			for (e = 0; e < d.length; e++)
				g += String.fromCharCode(d[e]);
			//if ("" != dc && -1 != a.indexOf(b) && 4 < b.length || -1 != a.indexOf(f) || -1 != a.indexOf(g))
			if (true)
				W(),
					ec(),
					song_timer = setInterval(function() {
						ec()
					}, fc),
					Ra = !0;
			else {
				a = [80, 76, 69, 65, 83, 69, 32, 71, 69, 84, 32, 84, 72, 69, 32, 84, 79, 75, 69, 78, 32, 79, 78, 32, 87, 87, 87, 46, 70, 76, 65, 83, 72, 82, 65, 68, 73, 79, 46, 73, 78, 70, 79, 47, 82, 69, 71, 73, 83, 84, 69, 82];
				Ra = !1;
				setTimeout(function() {
					X()
				}, 2E3);
				v = "";
				for (e = 0; e < a.length; e++)
					v += String.fromCharCode(a[e]);
				"small" == x ? P() : (e = v.split(" - "),
					0 < e.length ? (M = e[0],
						N = e[1]) : (M = v,
						N = ""),
					l(),
					H())
			}
		}
		function Ea() {
			switch (Sa) {
				case "icecast2":
					var a = Q + ra;
					break;
				case "shoutcast2":
					a = Q + gc;
					break;
				case "radionomy":
					a = Q;
					break;
				case "radiojar":
					a = Q;
					break;
				case "radioco":
					a = Q;
					break;
				default:
					a = Q + hc
			}
			D("Streaming URL: " + a);
			return a
		}
		function La() {
			var b = "https://api.radionomy.com/currentsong.cfm?radiouid=" + ib + "&apikey=" + jb + "&callmeback=yes&type=xml&cover=no&previous=yes";
			D(b);
			a.ajax({
				dataType: "xml",
				url: b,
				crossDomain: !0,
				success: function(b) {
					Y = a(b).find("radioname").text();
					"small" == x ? ca() : ma()
				}
			})
		}
		function va() {
			var b = "none" == r.toLowerCase() || "nothing" == r.toLowerCase() || "php" == r.toLowerCase() ? Q + "/stats?sid=" + Ma + "&json=1&callback=?" : r + Q + "/stats?sid=" + Ma + "&json=1&callback=?";
			"php" == r.toLowerCase() ? a.ajax({
				dataType: "text",
				method: "POST",
				crossDomain: !0,
				url: wa + "fallback.php",
				data: {
					url: b,
					mode: "fallback"
				},
				success: function(a) {
					ic(JSON.parse(rc(a)))
				}
			}) : a.ajax({
				dataType: "jsonp",
				url: b,
				crossDomain: !0,
				success: function(a) {
					ic(a)
				}
			})
		}
		function ic(b) {
			try {
				Y = a("<div/>").html(b.servertitle).text(),
					"small" == x ? ca() : ma()
			} catch (aa) {}
		}
		function rc(a) {
			a = a.replace(/\\n/g, "\\n").replace(/\\'/g, "\\'").replace(/\\"/g, '\\"').replace(/\\&/g, "\\&").replace(/\\r/g, "\\r").replace(/\\t/g, "\\t").replace(/\\b/g, "\\b").replace(/\\f/g, "\\f");
			a = a.replace(/[\u0000-\u0019]+/g, "");
			return a = a.substr(2, a.length - 3)
		}
		function sc() {
			var b = "none" == r.toLowerCase() || "nothing" == r.toLowerCase() || "php" == r.toLowerCase() ? Q + "/status-json.xsl" : r + Q + "/status-json.xsl";
			"php" == r.toLowerCase() ? a.ajax({
				dataType: "text",
				method: "POST",
				crossDomain: !1,
				url: wa + "fallback.php",
				data: {
					url: b,
					mode: "fallback"
				},
				success: function(a) {
					jc(a)
				}
			}) : a.ajax({
				dataType: "text",
				url: b,
				crossDomain: !0,
				success: function(a) {
					jc(a)
				}
			})
		}
		function jc(b) {
			try {
				b = JSON.parse(b);
				var c = {};
				if (b.icestats.source.length === k)
					c = b.icestats.source;
				else
					for (var h = 0; h < b.icestats.source.length; h++) {
						var l = b.icestats.source[h].listenurl;
						ra == l.substr(l.length - ra.length, ra.length) && (c = b.icestats.source[h])
					}
				c.hasOwnProperty("server_name") && (Y = a("<div/>").html(c.server_name).text());
				c.hasOwnProperty("title");
				"small" == x ? ca() : ma()
			} catch (Fc) {}
		}
		function tc(c) {
			"true" == ka && ("" == c && (c = xa),
				E++,
			2 < E && (E = 1),
				a("#" + b + "coverblurshadow" + E).attr("src", c),
				a("#" + b + "imagehit" + E).attr("src", c).on("load", function() {
					1 == E ? (a("#" + b + "imagehit1").fadeIn("slow"),
						a("#" + b + "imagehit2").fadeOut("slow"),
					ia() || (a("#" + b + "coverblurshadow1").fadeIn("slow"),
						a("#" + b + "coverblurshadow2").fadeOut("slow"))) : (a("#" + b + "imagehit2").fadeIn("slow"),
						a("#" + b + "imagehit1").fadeOut("slow"),
					ia() || (a("#" + b + "coverblurshadow2").fadeIn("slow"),
						a("#" + b + "coverblurshadow1").fadeOut("slow")))
				}))
		}
		function ya() {
			if ("true" == ka) {
				var c = "https://itunes.apple.com/search?term=" + encodeURIComponent(v) + "&media=music&limit=1";
				D(c);
				a.ajax({
					dataType: "jsonp",
					url: c,
					success: function(c) {
						var h = "";
						1 == c.results.length ? (h = c.results[0].artworkUrl100,
							h = "none" == r.toLowerCase() || "nothing" == r.toLowerCase() || "php" == r.toLowerCase() ? h.replace("100x100", "300x300") : r + h.replace("100x100", "300x300"),
							oa = c.results[0].trackViewUrl,
						"" != kb && (oa += "&app=itunes&at=" + kb)) : (h = xa,
							oa = "");
						E++;
						2 < E && (E = 1);
						a("#" + b + "coverblurshadow" + E).attr("src", h);
						a("#" + b + "imagehit" + E).attr("src", h).on("load", function() {
							1 == E ? (a("#" + b + "imagehit1").fadeIn("slow"),
								a("#" + b + "imagehit2").fadeOut("slow"),
							ia() || (a("#" + b + "coverblurshadow1").fadeIn("slow"),
								a("#" + b + "coverblurshadow2").fadeOut("slow"))) : (a("#" + b + "imagehit2").fadeIn("slow"),
								a("#" + b + "imagehit1").fadeOut("slow"),
							ia() || (a("#" + b + "coverblurshadow2").fadeIn("slow"),
								a("#" + b + "coverblurshadow1").fadeOut("slow")))
						})
					},
					error: function() {
						cover = xa;
						oa = "";
						E++;
						2 < E && (E = 1);
						ia() || a("#" + b + "coverblurshadow" + E).attr("src", cover);
						a("#" + b + "imagehit" + E).attr("src", cover).on("load", function() {
							1 == E ? (a("#" + b + "imagehit1").fadeIn("slow"),
								a("#" + b + "imagehit2").fadeOut("slow"),
							ia() || (a("#" + b + "coverblurshadow1").fadeIn("slow"),
								a("#" + b + "coverblurshadow2").fadeOut("slow"))) : (a("#" + b + "imagehit2").fadeIn("slow"),
								a("#" + b + "imagehit1").fadeOut("slow"),
							ia() || (a("#" + b + "coverblurshadow1").fadeOut("slow"),
								a("#" + b + "coverblurshadow2").fadeIn("slow")))
						})
					}
				})
			}
		}
		function W() {
			"false" != ka && "" != xa && (E++,
			2 < E && (E = 1),
				a("#" + b + "coverblurshadow" + E).attr("src", xa),
				a("#" + b + "imagehit" + E).attr("src", xa).on("load", function() {
					1 == E ? (a("#" + b + "imagehit1").fadeIn("slow"),
						a("#" + b + "coverblurshadow1").fadeIn("slow"),
						a("#" + b + "imagehit2").fadeOut("slow"),
						a("#" + b + "coverblurshadow2").fadeOut("slow")) : (a("#" + b + "imagehit2").fadeIn("slow"),
						a("#" + b + "coverblurshadow2").fadeIn("slow"),
						a("#" + b + "imagehit1").fadeOut("slow"),
						a("#" + b + "coverblurshadow1").fadeOut("slow"))
				}))
		}
		function ec() {
			if ("" != Ta)
				uc();
			else
				switch (Sa) {
					case "icecast2":
						vc();
						break;
					case "shoutcast1":
						wc();
						break;
					case "shoutcast2":
						xc();
						break;
					case "radionomy":
						yc();
						break;
					case "radiojar":
						zc();
						break;
					case "radioco":
						Ac()
				}
		}
		function vc() {
			var b = "none" == r.toLowerCase() || "nothing" == r.toLowerCase() || "php" == r.toLowerCase() ? Q + "/status-json.xsl" : r + Q + "/status-json.xsl";
			"php" == r.toLowerCase() ? a.ajax({
				dataType: "text",
				method: "POST",
				crossDomain: !1,
				url: wa + "fallback.php",
				data: {
					url: b,
					mode: "fallback"
				},
				success: function(a) {
					kc(a)
				},
				error: function(a, b, c) {
					W()
				}
			}) : a.ajax({
				dataType: "text",
				url: b,
				crossDomain: !0,
				success: function(a) {
					kc(a)
				},
				error: function(a, b, c) {
					W()
				}
			})
		}
		function kc(b) {
			try {
				b = JSON.parse(b);
				var c = {};
				if (b.icestats.source.length === k)
					c = b.icestats.source;
				else
					for (var h = 0; h < b.icestats.source.length; h++) {
						var d = b.icestats.source[h].listenurl;
						ra == d.substr(d.length - ra.length, ra.length) && (c = b.icestats.source[h])
					}
				if (c.hasOwnProperty("title") && v != a("<div/>").html(c.title).text())
					if (v = a("<div/>").html(c.title).text(),
						ya(),
					"small" == x)
						P();
					else {
						var f = v.split(" - ");
						0 < f.length ? (M = f[0],
							N = f[1]) : (M = v,
							N = "");
						l();
						H()
					}
			} catch (qc) {
				D(qc)
			}
			"" == v && W()
		}
		function wc() {
			var b = "none" == r.toLowerCase() || "nothing" == r.toLowerCase() || "php" == r.toLowerCase() ? Q + "/7.html" : r + Q + "/7.html";
			"php" == r.toLowerCase() ? a.ajax({
				dataType: "text",
				method: "POST",
				crossDomain: !1,
				url: wa + "fallback.php",
				data: {
					url: b,
					mode: "fallback"
				},
				success: function(a) {
					var b = [];
					var c = 0
						, h = 0;
					for (a += ""; c < a.length; ) {
						var l = a.charCodeAt(c);
						if (191 >= l)
							b[h++] = String.fromCharCode(l),
								c++;
						else if (223 >= l) {
							var d = a.charCodeAt(c + 1);
							b[h++] = String.fromCharCode((l & 31) << 6 | d & 63);
							c += 2
						} else if (239 >= l) {
							d = a.charCodeAt(c + 1);
							var f = a.charCodeAt(c + 2);
							b[h++] = String.fromCharCode((l & 15) << 12 | (d & 63) << 6 | f & 63);
							c += 3
						} else {
							d = a.charCodeAt(c + 1);
							f = a.charCodeAt(c + 2);
							var e = a.charCodeAt(c + 3);
							l = (l & 7) << 18 | (d & 63) << 12 | (f & 63) << 6 | e & 63;
							l -= 65536;
							b[h++] = String.fromCharCode(55296 | l >> 10 & 1023);
							b[h++] = String.fromCharCode(56320 | l & 1023);
							c += 4
						}
					}
					b = b.join("");
					lc(b)
				},
				error: function(a, b, c) {
					W()
				}
			}) : a.ajax({
				dataType: "text",
				url: b,
				crossDomain: !0,
				success: function(a) {
					lc(a)
				},
				error: function(a, b, c) {
					W()
				}
			})
		}
		function lc(b) {
			b = a(b).text();
			b = b.split(",");
			if (6 < b.length) {
				var c = a("<div/>").html(b[6]).text();
				if (7 < b.length)
					for (var h = 7; h < b.length; h++)
						c += "," + a("<div/>").html(b[h]).text();
				v != c && (v = c,
					ya(),
					"small" == x ? P() : (b = v.split(" - "),
						0 < b.length ? (M = b[0],
							N = b[1]) : (M = v,
							N = ""),
						l(),
						H()))
			}
			"" == v && W()
		}
		function yc() {
			a.ajax({
				dataType: "xml",
				url: "https://api.radionomy.com/currentsong.cfm?radiouid=" + ib + "&apikey=" + jb + "&callmeback=yes&type=xml&cover=yes&previous=yes",
				crossDomain: !0,
				success: function(b) {
					var c = a(b).find("track").find("artists").text();
					a(b).find("track").find("title").text() != a(b).find("track").find("artists").text() && (c += " - " + a(b).find("track").find("title").text());
					v != c && (v = c,
						ya(),
						"small" == x ? P() : (b = v.split(" - "),
							0 < b.length ? (M = b[0],
								N = b[1]) : (M = v,
								N = ""),
							l(),
							H()));
					"" == v && W()
				},
				error: function(a, b, c) {
					W()
				}
			})
		}
		function zc() {
			a.ajax({
				type: "GET",
				crossDomain: !0,
				cache: !1,
				url: "//www.radiojar.com/api/stations/" + Bc + "/now_playing/?rand=" + Math.random(),
				dataType: "jsonp",
				async: !0,
				success: function(a) {
					if (a)
						try {
							var b = a.artist + " - " + a.title;
							v != b && (v = b,
								ya(),
								"small" == x ? P() : (M = a.artist,
									N = a.title,
									l(),
									H()))
						} catch (z) {}
				},
				error: function(a, b, c) {}
			})
		}
		function Ac() {
			var a = new XMLHttpRequest;
			a.open("GET", "https://public.radio.co/stations/" + Cc + "/status");
			a.send();
			a.onreadystatechange = function() {
				if (4 == this.readyState && 200 == this.status) {
					var b = JSON.parse(a.responseText)
						, c = b.current_track.title;
					b = b.current_track.artwork_url_large;
					v != c && (v = c,
						"true" == mc ? tc(b) : ya(),
						"small" == x ? P() : (c = c.split(" - ", 2),
							M = c[0],
							N = c[1],
							l(),
							H()))
				}
			}
		}
		function xc() {
			var b = "none" == r.toLowerCase() || "nothing" == r.toLowerCase() || "php" == r.toLowerCase() ? Q + "/currentsong?sid=" + Ma : r + Q + "/currentsong?sid=" + Ma;
			"php" == r.toLowerCase() ? a.ajax({
				dataType: "text",
				method: "POST",
				crossDomain: !1,
				url: wa + "fallback.php",
				data: {
					url: b,
					mode: "fallback"
				},
				success: function(a) {
					nc(a)
				},
				error: function(a, b, c) {
					W()
				}
			}) : a.ajax({
				dataType: "text",
				url: b,
				crossDomain: !0,
				success: function(a) {
					nc(a)
				},
				error: function(a, b, c) {
					W()
				}
			})
		}
		function nc(a) {
			v != a && (v = a,
				ya(),
				"small" == x ? P() : (a = v.split(" - "),
					0 < a.length ? (M = a[0],
						N = a[1]) : (M = v,
						N = ""),
					l(),
					H()));
			"" == v && W()
		}
		function uc() {
			var b = "none" == r.toLowerCase() || "nothing" == r.toLowerCase() || "php" == r.toLowerCase() ? Ta : r + Ta;
			"php" == r.toLowerCase() ? a.ajax({
				dataType: "text",
				method: "POST",
				crossDomain: !1,
				url: wa + "fallback.php",
				data: {
					url: b,
					mode: "fallback"
				},
				success: function(a) {
					oc(a)
				},
				error: function(a, b, c) {
					W()
				}
			}) : a.ajax({
				dataType: "text",
				url: b,
				crossDomain: !0,
				success: function(a) {
					oc(a)
				},
				error: function(a, b, c) {
					W()
				}
			})
		}
		function oc(b) {
			try {
				if (v != a("<div/>").html(b).text())
					if (v = a("<div/>").html(b).text(),
						ya(),
					"small" == x)
						P();
					else {
						var c = v.split(" - ");
						0 < c.length ? (M = c[0],
							N = c[1]) : (M = v,
							N = "");
						l();
						H()
					}
			} catch (z) {}
			"" == v && W()
		}
		function D(a) {
			pc && window.console && console.log(a)
		}
		function p(a) {
			return (a = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(a)) ? {
				r: parseInt(a[1], 16),
				g: parseInt(a[2], 16),
				b: parseInt(a[3], 16)
			} : null
		}
		function ia() {
			return 0 <= navigator.userAgent.search(/MSIE|Trident/)
		}
		function Ga() {
			return !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform)
		}
		function Tb() {
			return /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
		}
		var Dc = g.id;
		if (arguments.length) {
			this.element = a(g);
			this.options = a.extend(!0, {}, this.options, e);
			var Ec = this;
			this.element.bind("remove.flashradio", function() {
				Ec.destroy()
			})
		}
		for (var dc = e.token, Bc = e.radiojar, Cc = e.radioco, lb = e.radiouid, mb = e.apikey, nb = e.corsproxy, ob = e.streamprefix, pb = e.streamurl, qb = e.streampath, rb = e.streamid, sb = e.mountpoint, tb = e.streamtype, ub = e.themefontcolor, vb = e.themecolor, wb = e.radioname, xb = e.scroll, yb = e.autoplay, zb = e.debug, Ab = e.ownsongtitleurl, Bb = e.startvolume, Cb = e.songinformationinterval, Db = e.titlefontname, Eb = e.titlegooglefontname, Fb = e.songfontname, Gb = e.songgooglefontname, Hb = e.useanalyzer, Ib = e.analyzertype, Jb = e.radiocover, Kb = e.usecover, Lb = e.affiliatetoken, Mb = e.usestreamcorsproxy, Nb = e.getcoveroverradioco, Ob = e.userinterface, Pb = e.bigcoverstyle, Qb = e.backgroundcolor, b, Wa, F, Aa, db, eb, Na, sa, Pa, ab, bb, ib = "", jb = "", r = "none", hc = "/;type=mp3", Q = "http://streaming.radionomy.com/JamendoLounge", gc = "", Ma = "", ra = "", Sa = "other", J = "#FFFFFF", m = "#0d72bf", Y = "", ta = "AUTO", fb = !1, pc = !1, Ta = "", Xa, Rb, pa = !1, G = !1, Qa, ha, y, C = 75, za, fc = 2E4, Oa = "", Ua = "", ja = "", Va = "", xa = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAEsCAYAAAB5fY51AAAACXBIWXMAAAsTAAALEwEAmpwYAAAKT2lDQ1BQaG90b3Nob3AgSUNDIHByb2ZpbGUAAHjanVNnVFPpFj333vRCS4iAlEtvUhUIIFJCi4AUkSYqIQkQSoghodkVUcERRUUEG8igiAOOjoCMFVEsDIoK2AfkIaKOg6OIisr74Xuja9a89+bN/rXXPues852zzwfACAyWSDNRNYAMqUIeEeCDx8TG4eQuQIEKJHAAEAizZCFz/SMBAPh+PDwrIsAHvgABeNMLCADATZvAMByH/w/qQplcAYCEAcB0kThLCIAUAEB6jkKmAEBGAYCdmCZTAKAEAGDLY2LjAFAtAGAnf+bTAICd+Jl7AQBblCEVAaCRACATZYhEAGg7AKzPVopFAFgwABRmS8Q5ANgtADBJV2ZIALC3AMDOEAuyAAgMADBRiIUpAAR7AGDIIyN4AISZABRG8lc88SuuEOcqAAB4mbI8uSQ5RYFbCC1xB1dXLh4ozkkXKxQ2YQJhmkAuwnmZGTKBNA/g88wAAKCRFRHgg/P9eM4Ors7ONo62Dl8t6r8G/yJiYuP+5c+rcEAAAOF0ftH+LC+zGoA7BoBt/qIl7gRoXgugdfeLZrIPQLUAoOnaV/Nw+H48PEWhkLnZ2eXk5NhKxEJbYcpXff5nwl/AV/1s+X48/Pf14L7iJIEyXYFHBPjgwsz0TKUcz5IJhGLc5o9H/LcL//wd0yLESWK5WCoU41EScY5EmozzMqUiiUKSKcUl0v9k4t8s+wM+3zUAsGo+AXuRLahdYwP2SycQWHTA4vcAAPK7b8HUKAgDgGiD4c93/+8//UegJQCAZkmScQAAXkQkLlTKsz/HCAAARKCBKrBBG/TBGCzABhzBBdzBC/xgNoRCJMTCQhBCCmSAHHJgKayCQiiGzbAdKmAv1EAdNMBRaIaTcA4uwlW4Dj1wD/phCJ7BKLyBCQRByAgTYSHaiAFiilgjjggXmYX4IcFIBBKLJCDJiBRRIkuRNUgxUopUIFVIHfI9cgI5h1xGupE7yAAygvyGvEcxlIGyUT3UDLVDuag3GoRGogvQZHQxmo8WoJvQcrQaPYw2oefQq2gP2o8+Q8cwwOgYBzPEbDAuxsNCsTgsCZNjy7EirAyrxhqwVqwDu4n1Y8+xdwQSgUXACTYEd0IgYR5BSFhMWE7YSKggHCQ0EdoJNwkDhFHCJyKTqEu0JroR+cQYYjIxh1hILCPWEo8TLxB7iEPENyQSiUMyJ7mQAkmxpFTSEtJG0m5SI+ksqZs0SBojk8naZGuyBzmULCAryIXkneTD5DPkG+Qh8lsKnWJAcaT4U+IoUspqShnlEOU05QZlmDJBVaOaUt2ooVQRNY9aQq2htlKvUYeoEzR1mjnNgxZJS6WtopXTGmgXaPdpr+h0uhHdlR5Ol9BX0svpR+iX6AP0dwwNhhWDx4hnKBmbGAcYZxl3GK+YTKYZ04sZx1QwNzHrmOeZD5lvVVgqtip8FZHKCpVKlSaVGyovVKmqpqreqgtV81XLVI+pXlN9rkZVM1PjqQnUlqtVqp1Q61MbU2epO6iHqmeob1Q/pH5Z/YkGWcNMw09DpFGgsV/jvMYgC2MZs3gsIWsNq4Z1gTXEJrHN2Xx2KruY/R27iz2qqaE5QzNKM1ezUvOUZj8H45hx+Jx0TgnnKKeX836K3hTvKeIpG6Y0TLkxZVxrqpaXllirSKtRq0frvTau7aedpr1Fu1n7gQ5Bx0onXCdHZ4/OBZ3nU9lT3acKpxZNPTr1ri6qa6UbobtEd79up+6Ynr5egJ5Mb6feeb3n+hx9L/1U/W36p/VHDFgGswwkBtsMzhg8xTVxbzwdL8fb8VFDXcNAQ6VhlWGX4YSRudE8o9VGjUYPjGnGXOMk423GbcajJgYmISZLTepN7ppSTbmmKaY7TDtMx83MzaLN1pk1mz0x1zLnm+eb15vft2BaeFostqi2uGVJsuRaplnutrxuhVo5WaVYVVpds0atna0l1rutu6cRp7lOk06rntZnw7Dxtsm2qbcZsOXYBtuutm22fWFnYhdnt8Wuw+6TvZN9un2N/T0HDYfZDqsdWh1+c7RyFDpWOt6azpzuP33F9JbpL2dYzxDP2DPjthPLKcRpnVOb00dnF2e5c4PziIuJS4LLLpc+Lpsbxt3IveRKdPVxXeF60vWdm7Obwu2o26/uNu5p7ofcn8w0nymeWTNz0MPIQ+BR5dE/C5+VMGvfrH5PQ0+BZ7XnIy9jL5FXrdewt6V3qvdh7xc+9j5yn+M+4zw33jLeWV/MN8C3yLfLT8Nvnl+F30N/I/9k/3r/0QCngCUBZwOJgUGBWwL7+Hp8Ib+OPzrbZfay2e1BjKC5QRVBj4KtguXBrSFoyOyQrSH355jOkc5pDoVQfujW0Adh5mGLw34MJ4WHhVeGP45wiFga0TGXNXfR3ENz30T6RJZE3ptnMU85ry1KNSo+qi5qPNo3ujS6P8YuZlnM1VidWElsSxw5LiquNm5svt/87fOH4p3iC+N7F5gvyF1weaHOwvSFpxapLhIsOpZATIhOOJTwQRAqqBaMJfITdyWOCnnCHcJnIi/RNtGI2ENcKh5O8kgqTXqS7JG8NXkkxTOlLOW5hCepkLxMDUzdmzqeFpp2IG0yPTq9MYOSkZBxQqohTZO2Z+pn5mZ2y6xlhbL+xW6Lty8elQfJa7OQrAVZLQq2QqboVFoo1yoHsmdlV2a/zYnKOZarnivN7cyzytuQN5zvn//tEsIS4ZK2pYZLVy0dWOa9rGo5sjxxedsK4xUFK4ZWBqw8uIq2Km3VT6vtV5eufr0mek1rgV7ByoLBtQFr6wtVCuWFfevc1+1dT1gvWd+1YfqGnRs+FYmKrhTbF5cVf9go3HjlG4dvyr+Z3JS0qavEuWTPZtJm6ebeLZ5bDpaql+aXDm4N2dq0Dd9WtO319kXbL5fNKNu7g7ZDuaO/PLi8ZafJzs07P1SkVPRU+lQ27tLdtWHX+G7R7ht7vPY07NXbW7z3/T7JvttVAVVN1WbVZftJ+7P3P66Jqun4lvttXa1ObXHtxwPSA/0HIw6217nU1R3SPVRSj9Yr60cOxx++/p3vdy0NNg1VjZzG4iNwRHnk6fcJ3/ceDTradox7rOEH0x92HWcdL2pCmvKaRptTmvtbYlu6T8w+0dbq3nr8R9sfD5w0PFl5SvNUyWna6YLTk2fyz4ydlZ19fi753GDborZ752PO32oPb++6EHTh0kX/i+c7vDvOXPK4dPKy2+UTV7hXmq86X23qdOo8/pPTT8e7nLuarrlca7nuer21e2b36RueN87d9L158Rb/1tWeOT3dvfN6b/fF9/XfFt1+cif9zsu72Xcn7q28T7xf9EDtQdlD3YfVP1v+3Njv3H9qwHeg89HcR/cGhYPP/pH1jw9DBY+Zj8uGDYbrnjg+OTniP3L96fynQ89kzyaeF/6i/suuFxYvfvjV69fO0ZjRoZfyl5O/bXyl/erA6xmv28bCxh6+yXgzMV70VvvtwXfcdx3vo98PT+R8IH8o/2j5sfVT0Kf7kxmTk/8EA5jz/GMzLdsAAAAgY0hSTQAAeiUAAICDAAD5/wAAgOkAAHUwAADqYAAAOpgAABdvkl/FRgAAD21JREFUeNrs3S1z48gWBuCzqQBDQUPDQMPAwIGBAwcu3J+y8MLAgYGBgYGGhoaGhma5wHLFk82HJMtSt/p5qlw7m2QmttR6+3SrJf31+voaADm4sgkAgQUgsACBBSCwAAQWILAABBaAwAIEFoDAAhBYgMACEFgAAgsQWAACC0BgAQILQGABCCxAYAEILACBBQgsAIEFILAAgQUgsACBBSCwAAQWILAABBaAwAIEFoDAAhBYgMACEFgAAgsQWAACC0BgAQILQGABCCxAYAEILACBBQgsAIEFILAAgQVwYdc2AV+YRcS8/vOi/m9Vv95/v41tROzrP+/r/z/9+q5+wR/+en19tRU4Bs/iJJAWCbyvY3Bt3v0ZgUVBFvVrXr+qzN7/9uS1OanQEFhMwDwibk6Camr2dXBtBJjAIs8h3jGgbur/L8k+ItZ1eK3jbb4MgUViIXV88WZ98hJeAosR3UTEUki1Dq+VTSGwGEYVEbd1UM1sjrOGjS9hzktgcbFq6jamOXE+pm0dXKougUUPlhFxF/ktP8jNrg6tlzDXJbBoZVZXU7eJD/s2DT/LPKNtvz+puHaaosAij6DaxZ+ryzcnQ6hzKpDqpFqc15/z+LV5YgG9iognFZfA4r/uRgyqTbytHt/F+JfALOLjS4bGrLgMFQUWMfwcVa4rw08D7PgaOrie6+BCYBVnHhE/BjrwNvG2+ntKp/EXIwTYLiIew4XYAqsQszqolheuBkq7PGUWb5cjDXFJ0joO81s7TVpgTXn49+OCB5OV3H9WsLcXDi/DRIE1SVVE3F9o2LKLt9PwJoU/dqy6LlXVbupqy6p5gZW92zhMqvfdy6/q18YmbjVsXNb7pLrAv/+k2hJYOR8cP3uuqixq7M+i7kj6rno3cZiUt38EVlZDkPseqyprgS47XL/rebi4r0NrbfMKrNT9qIccgkpwvdTDRARWkg3+Z/R33dyzoJpEcG0j4sF+FFgpWdRh1ccQ0PqedPbpXfQzx7WvQ8tZRIE1utt6GHiuXVhBnaKbev9WPYTWU1gjJ7BGdN/T0OG5fpGmWbxdnG5fC6wsG/CvOH++ahNOgedkXndS5+73Vb3fEVgXV0U/k+t62nzd1a9zrOvQMhkvsC7aw/6K8ybXt3VDNQGbf1v4GefNbTmDKLCSDqtVuIPl1KYG7uO8x6wJLYGVXFg5QzRt554pFloCK5mw2kXEb0NA7URoCSyNkNSGiL+i+wkZ7UVgjRZWqyjv1PUsDvM51Ul1uS7sADz3jrJCS2ANHlYlXvT62R0qSr0s5f6M0CqxsxNYI4XVY5Q3uT6PiL+/+P4+Iv4tsGpY1sEltHpwZRN8WM7fC6vWfjTYrrcFbpdzQmcZ5y9OFVgT9yu6T5iWGlZVNLujwbLQNnVOaN0VvN0E1jfuhVUni4Y/V0V/9worKbR+FLzdBNYnbs/oyUoOq2MQNVXygdc1tI5LJWalH6QC661C6LpKufSwahtCVeHb6tzQEliFq+JwAWsXLrV5O5gEVrvQ6vIosHn0c6NIgZWxrrc17trodBCc09kdn2QtsAp0F93mVLqW9fB+OqHLYtr7UoO/5MBaRLc1Ltvw2Cb689AhtI4P6BVYhTguDm1rH4e7LrjGi74cH7jatk3No8BFpaUGVteS+iHce53+He9A29ZdFLZMpMTAuoluk5ZP4X5WXx1wnGcd3U7i3Je0kUoLrK5Dwa6NqaRhDefr0ikWNTQsLbDuov0Shl04I8hwusyRFjM0LCmwFtHtbgEm2RlS1w6yiKFhSYHVZYXwc5ifYXjr+tV2aDj52/eUEli3HUrmbXjI6SVsbIJGHqP9Gem7mPgF0iUE1iy6TUo+OmYY0b5DG5zFxK81LCGwuvQ6hoKkUo22HRouY8IT8FMPrKrDuN5QkNSGhm1P+ky2ypp6YHUZCrpOkNSGhm3b5CKa3wVWYCVUXS1b/p1VmBQmPV3a5b3AykvbsrhLTwZDads2u3TYAmsk82h/veBzWCBKurbR/oZ/dwIrD20n2nfhWkHS17ZTnVyVNcXA6rKTHh0LEXGYqF3W1WmVyL5cxNttgavC90+XjnVSVdb1BHdq2x20CRPtN/Hx065fYpx5vePDFhafVBnPBe+rlzrAm64tPHbgqyl8+KlVWLMO1VXJjf9YVX32II7bEXroKg6Ps1p80SEtC95f+w5V1mSuMZxaYLXdMaqr709/t+nN+6qQv/t9PwrfZ8/R7jrDeUxkXVbpgVV6ddVkXmgWwz5WqsmBNfR7SjW0iquyphRYy5aVgOqq+UE/ZDhUCb6nFK2i3RnDSZy0mFpgqa7amff8c0Oq7L7y5rKmElhVyzG66qpdEKUYDgu7L15aVlnL3D/wVAKrbc+x0tZbh5CKJj1tzxh2OYsusC6gzXzGTmBNJrBmdmPrtiywEgirNgeTS3DKG9JOWdsOeJFztTyVwGpTQquuKL3KynbyvbTAWoc7MjA9m2h3S+9sl4TkHlg30W4ew3CQqWrTtqtch9O5X/zcpqfYRhoPlqjq933z7r2twoMvUreo99vxYN/X1c0qgcr9OHpo2oEvI8MbVpYUWKsE3u8yDtfBzT44EG7rRvdo2NqqExrCLA4XiC8+aYN39X5bj7gt9vXvX7Y4drILrJyHhG2Hg2MH1jw+voXL+890L4daHaRDuI+vF6oeA60yLBRYX5XnbcvlMc16/jnSq+THDqxttLuLwzK3HXFVQCOKkUv1VBrzWMMp0q2ysjtbmGtgVS0DQGCdP5wyr5aH9QWPo9HlNum+jPa3kVk52FRkA5nH+BfV7+pX0yD6GYc7l6xz2MC5BNYsDrfN7TJJuKj//j6jz0qzA9O++7hTb1M1zevQOlZnq5TDK5chYdewOpa9/2Q0Xnd9XL6BNbZFnHeW+bOHkQisFn70cBDPTnoRmKr7Hv6NWSR8z/zUh4TLmNATPwaoyswzXaZqyaUNVD0edxGHhaVJTaWkGlizGOcRUzk59oTLk68d70bxHE40nE4J3L6r0o+rwlcT7LT6LBZu6raUzDW414k2rmWYfP7Orw8a6THoFxHxO8zzLL8YJt3U2+pxIpVpdYF/89gp3tbtafTtdJVY4/onhn8OXq4H4vyb3vbvKPu2xvP4fk5nPqEq/pIna6q6PS0F1ltvdx801WRebyawGre9qUwRXFofJ8CyD6xKWLVumPOEGnFJQyRt73C2fbR2lUJg3RsCXqz0H6o3FA7lbIcqRjxzP/ak+yLyOW18F3+uIt7F2xm5obeZA7X/978bcDtUdVs63ZfbOJy53GRyLKxihJM61wl88Bzcx38nHKv6/d+EM3IpahPs1YD778cnFcqi/voqDmcuU3cbI9wAcMwh4TyT6moRX58dcUaOppYNhlPLTDry5Ri/dMzAymUFe19n5PoK54XjPluziX2WwUNrzMDK5XSygKAvU7t0avBj+GrEEMiht5mFM5iosJLpzK9K+aAdzTNvjG5VU87+2IwUwIMeywJr2uGgOlSJTardXzm4s7O70M+i8xNYn/Qeen6BxTRUUw+sqVZXQpjvLC74b28n+JmSGRIq46HfECjiho1XmewMZTaUWTmqsAQW9qsKS2OE/tqIkYjAmkRgeTIOAotseBoOH9kJLKAvlz6LLLCA3rRdp7ewydIIrI3NnuxBAgKLyQ5DYNDh6BiB5SwXCKxsAmsfznSdY2ETGDonZNBjeawhoSqLlIbDKQ6dd5ls50GP5bECazPBA0QIq5r6DCCBJbAu2sgMc5lCAAmsTwJrP7FGtnFMUmB7GvR9jrmsYZ3JDmkarIaE9NVGcmlLu6ErR4HVTw+yz+jzkH6bX0/s80wmsHYT2SkvjkUatqUmFftKYKUXWBERzxnslNU3Jfp+4MAyuZ+vfYM2/5RJR76LEebZrhIIgxx2zsMnvd6+/t6QIWKuLG8vdSjtP2hLTxlV66MUG9cJfPCniPiZQc/4WL8WJ1/fZPC+S65mmq7FGrrTfKlfObWl99trlHm2FAJrXVcvy0x21iaBA1E11uyzLwYOrF1mbemcImOUzvAqoQ1gqNN/CG1tp0G3066A7bqOEc9iphJYx7kgodW80Uy5Bx9yG217rBamfhH1Ng7TIqNJ6X5Yx9Cynqmfg3EVZc9hbRoG9nOPv3M+8Tb3MHabuk5so+wj4ncc5h5+hBvQfRVGVRzm/apPvv9kM8XviLiPiJtPhm/POshGwf+cSrV+nfBG+l9E3NbBxceVwXMdWJVh4Jcd4Oxd57eLQh7acObw7ym19nSd+EZbC6xvOfiaBZcgbxdWow//PnKVwcH40mOjhakHc19D6SSPlxweQvEU56372MdhTudf7ZmJe+ihktykXLFfZ7IjXuJtcelNfL8gcBdvZ4maXnAKUxnKzU+Ok3l8vdxiWx8v2/pYSXpp0XVGO+N4kfFxiPjRjtgnvMHbrLzeFHrAVQm+p03LNppKW3t/HJyeeNhFpvOe1xk37twWmary+g2s2cD7bpZ5m5zEiQcPUh2O1en9GnKN3sa+E1glzi80KcMtZEzPqsHP7ASWwJqapwaNfmUzJVkdb87ctwisLBv+Q3w817GJhNe/EL8/Ca3jvdJUxgO4tgkGt4nDZUeTOGtz8v6n7nhxfhV/nhzo824PCKykD4DNRD7LrqD9tguXQhkSAggsQGABCCwAgUUGdjYBAovPbBr+3FDXyO0u8N4RWEzEvuef68M2wfeEwCKjCmvIambb888hsCgssIa87GSd4HtCYJGAbYPQ2gxczazj+7msod8TAotEfHW//H2McxeCxy++N9Z7QmCRSJX18G6Ita///38NK5m+b6a3qX/36l2YbuLzu11QABc/cwyt32f8/dmF3tOjXYMKCxBYAAILQGABAgtAYAECC0BgwX/MbQIEFrmY2QQILEBgAQgsAIEFCCwAgQUgsACBBSCwyJdnBCKwyIZ7rCOwmKSNTYDAYkw7w0cEFlMMLMNHBBbZDPMEFgKL0TUJorUhIQKLFKx7+hkQWFzc6pvqaVv/DAgsRreLiIf4eAJ+W38PzvLX6+urrUDf5hGxiMPtkLeGgggswJAQQGABCCxAYAEILACBBQgsAIEFILAAgQUgsAAEFiCwAAQWgMACBBaAwAIQWIDAAhBYAAILEFgAAgtAYAECC0BgAQILQGABCCxAYAEILACBBQgsAIEFILAAgQUgsAAEFiCwAAQWgMACBBaAwAIQWIDAAhBYAAILEFgAAgtAYAECC0BgAQLLJgAEFoDAAgQWgMACEFiAwAIQWABn+f8AjqF84lqxwzIAAAAASUVORK5CYII=", ka = "true", kb = "", Xb = "", Ya, Za, Da = !1, Ca = !1, gb = !1, E = 2, Zb, Ja, d, ua, c, $b, $a, v = "", q = [], da = "nothing", la = "1", x = "small", Ha = "circle", u = [], oa = "", bc = "false", mc = "true", fa = "", Ub = "", M = " ", Vb = "", N = "", L = [], hb = 0, Ka = [], qa = 0; 511 > qa; qa += 1)
			Ka.push(Math.floor(254 / (qa / 100 + 1) * Math.random() + 1));
		var f = 0, n = 0, Sb = 0, Yb, Wb, O, ac, cb, wa, Ra = !0;
		a(document).ready(function() {
			b = Dc;
			var a = document.getElementsByTagName("script"), c, l;
			for (c = 0; l = a[c]; c++)
				if (l = l.src,
				0 <= l.indexOf("nativeflashradiov4.js"))
					var d = l.substring(0, l.indexOf("nativeflashradiov4.js"));
			wa = d;
			nb != k && "" != nb.toString() && (r = nb.toString());
			mb != k && "" != mb.toString() && (jb = mb.toString());
			lb != k && "" != lb.toString() && (ib = lb.toString());
			ob != k && "" != ob.toString() && (hc = ob.toString());
			pb != k && "" != pb.toString() && (Q = pb.toString());
			qb != k && "" != qb.toString() && (gc = qb.toString());
			rb != k && "" != rb.toString() && (Ma = rb.toString());
			sb != k && "" != sb.toString() && (ra = sb.toString());
			tb != k && "" != tb.toString() && (Sa = tb.toString().toLowerCase());
			ub != k && "" != ub.toString() && (J = ub.toString());
			vb != k && "" != vb.toString() && (m = vb.toString());
			Kb != k && "" != Kb.toString() && (ka = Kb.toString().toLowerCase());
			Mb != k && "" != Mb.toString() && (bc = Mb.toString().toLowerCase());
			Nb != k && "" != Nb.toString() && (mc = Nb.toString().toLowerCase());
			Lb != k && "" != Lb.toString() && (kb = Lb.toString());
			Ob != k && "" != Ob.toString() && (x = Ob.toString().toLowerCase());
			Pb != k && "" != Pb.toString() && (Ha = Pb.toString().toLowerCase());
			if (Qb != k && "" != Qb.toString())
				Xa = Qb.toString().toLowerCase();
			else {
				a = m;
				c = -.9;
				a = String(a).replace(/[^0-9a-f]/gi, "");
				6 > a.length && (a = a[0] + a[0] + a[1] + a[1] + a[2] + a[2]);
				c = c || 0;
				d = "#";
				var f;
				for (f = 0; 3 > f; f++)
					l = parseInt(a.substr(2 * f, 2), 16),
						l = Math.round(Math.min(Math.max(0, l + l * c), 255)).toString(16),
						d += ("00" + l).substr(l.length);
				Xa = d
			}
			Rb = "rgba(" + p(m).r + ", " + p(m).g + ", " + p(m).b + ", 0.6)";
			d = J;
			d = d.replace("#", "");
			a = parseInt(d.substr(0, 2), 16);
			c = parseInt(d.substr(2, 2), 16);
			d = parseInt(d.substr(4, 2), 16);
			fa = 127 > (299 * a + 587 * c + 114 * d) / 1E3 ? "#ffffff" : "#000000";
			if (wb != k && "" != wb.toString())
				Y = wb.toString();
			else
				switch (Sa) {
					case "icecast2":
						sc();
						break;
					case "shoutcast2":
						va();
						break;
					case "radionomy":
						La()
				}
			xb != k && "" != xb.toString() && (ta = xb.toString().toLowerCase());
			yb != k && "" != yb.toString() && (fb = "true" == yb.toString().toLowerCase() ? !0 : !1);
			zb != k && "" != zb.toString() && (pc = "true" == zb.toString().toLowerCase() ? !0 : !1);
			Ab != k && "" != Ab.toString() && (a = Ab.toString(),
			/^(f|ht)tps?:\/\//i.test(a) || (a = "http://" + a),
				Ta = a);
			Bb != k && "" != Bb.toString() && (C = parseInt(Bb.toString()));
			Cb != k && "" != Cb.toString() && (fc = parseInt(Cb.toString()));
			Db != k && "" != Db.toString() && (Oa = Db.toString());
			Eb != k && "" != Eb.toString() && (Ua = Eb.toString());
			Fb != k && "" != Fb.toString() && (ja = Fb.toString());
			Gb != k && "" != Gb.toString() && (Va = Gb.toString());
			Hb != k && "" != Hb.toString() && (da = Hb.toString().toLowerCase());
			Ib != k && "" != Ib.toString() && (la = Ib.toString());
			Jb != k && "" != Jb.toString() && (xa = Jb.toString());
			Ga() && (C = 100);
			"real" == da && Tb() && (da = "fake");
			I()
		});
		this.stopradio = function() {
			X()
		}
		;
		this.startradio = function() {
			Z()
		}
		;
		this.setvolume = function(a) {
			C = parseInt(a);
			B();
			R(C)
		}
		;
		html5audiocheck = function() {
			var a = !1;
			try {
				var b = document.createElement("audio");
				a = !(!b.canPlayType || !b.canPlayType("audio/mpeg;").replace(/no/, ""))
			} catch (z) {
				a = !1
			}
			a && (a = /chrome/.test(navigator.userAgent.toLowerCase()) || /Firefox[\/\s](\d+\.\d+)/.test(navigator.userAgent) || /OPR\/(\d+\.\d+)/i.test(navigator.userAgent) || /^((?!chrome|android).)*safari/i.test(navigator.userAgent) ? !0 : !1);
			return a
		}
		;
		mobilecheck = function() {
			return navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/BlackBerry/i) || navigator.userAgent.match(/Windows Phone/i) ? !0 : !1
		}
	}
});
(function(a) {
		function k(l, e, k) {
			if ("touch" !== e.substr(0, 5))
				return a(l).unbind(e, k);
			var t;
			for (t = 0; t < g._binds.length; t++)
				g._binds[t].elem === l && g._binds[t].type === e && g._binds[t].func === k && (document.addEventListener ? l.removeEventListener(e, g._binds[t].fnc, !1) : l.detachEvent("on" + e, g._binds[t].fnc),
					g._binds.splice(t--, 1))
		}
		function g(l, e, k, t) {
			if ("touch" !== e.substr(0, 5))
				return a(l).bind(e, t, k);
			if (g[e])
				return g[e].bind(l, e, k, t);
			var I = function(a) {
				a || (a = window.event);
				a.stopPropagation || (a.stopPropagation = function() {
						this.cancelBubble = !0
					}
				);
				a.data = t;
				k.call(l, a)
			};
			document.addEventListener ? l.addEventListener(e, I, !1) : l.attachEvent("on" + e, I);
			g._binds.push({
				elem: l,
				type: e,
				func: k,
				fnc: I
			})
		}
		function e(a) {
			a.data.position.x = a.pageX;
			a.data.position.y = a.pageY;
			a.data.start.x = a.pageX;
			a.data.start.y = a.pageY;
			a.data.event = a;
			a.data.onstart && a.data.onstart.call(a.data.element, a.data) || (a.preventDefault && a.data.preventDefault && a.preventDefault(),
			a.stopPropagation && a.data.stopPropagation && a.stopPropagation(),
				g(a.data.affects, "mousemove", t, a.data),
				g(a.data.affects, "mouseup", I, a.data))
		}
		function t(a) {
			a.preventDefault && a.data.preventDefault && a.preventDefault();
			a.stopPropagation && a.data.preventDefault && a.stopPropagation();
			a.data.move.x = a.pageX - a.data.position.x;
			a.data.move.y = a.pageY - a.data.position.y;
			a.data.position.x = a.pageX;
			a.data.position.y = a.pageY;
			a.data.offset.x = a.pageX - a.data.start.x;
			a.data.offset.y = a.pageY - a.data.start.y;
			a.data.event = a;
			a.data.onmove && a.data.onmove.call(a.data.element, a.data)
		}
		function I(a) {
			a.preventDefault && a.data.preventDefault && a.preventDefault();
			a.stopPropagation && a.data.stopPropagation && a.stopPropagation();
			k(a.data.affects, "mousemove", t);
			k(a.data.affects, "mouseup", I);
			a.data.event = a;
			a.data.onfinish && a.data.onfinish.call(a.data.element, a.data)
		}
		function B(a) {
			a.data.position.x = a.touches[0].pageX;
			a.data.position.y = a.touches[0].pageY;
			a.data.start.x = a.touches[0].pageX;
			a.data.start.y = a.touches[0].pageY;
			a.data.event = a;
			a.data.onstart && a.data.onstart.call(a.data.element, a.data) || (a.preventDefault && a.data.preventDefault && a.preventDefault(),
			a.stopPropagation && a.data.stopPropagation && a.stopPropagation(),
				g(a.data.affects, "touchmove", R, a.data),
				g(a.data.affects, "touchend", S, a.data))
		}
		function R(a) {
			a.preventDefault && a.data.preventDefault && a.preventDefault();
			a.stopPropagation && a.data.stopPropagation && a.stopPropagation();
			a.data.move.x = a.touches[0].pageX - a.data.position.x;
			a.data.move.y = a.touches[0].pageY - a.data.position.y;
			a.data.position.x = a.touches[0].pageX;
			a.data.position.y = a.touches[0].pageY;
			a.data.offset.x = a.touches[0].pageX - a.data.start.x;
			a.data.offset.y = a.touches[0].pageY - a.data.start.y;
			a.data.event = a;
			a.data.onmove && a.data.onmove.call(a.data.elem, a.data)
		}
		function S(a) {
			a.preventDefault && a.data.preventDefault && a.preventDefault();
			a.stopPropagation && a.data.stopPropagation && a.stopPropagation();
			k(a.data.affects, "touchmove", R);
			k(a.data.affects, "touchend", S);
			a.data.event = a;
			a.data.onfinish && a.data.onfinish.call(a.data.element, a.data)
		}
		var ma = a.extend;
		g._binds = [];
		a.fn.sodahgrab = function(a, k) {
			return this.each(function() {
				var k = {
					move: {
						x: 0,
						y: 0
					},
					offset: {
						x: 0,
						y: 0
					},
					position: {
						x: 0,
						y: 0
					},
					start: {
						x: 0,
						y: 0
					},
					affects: document.documentElement,
					stopPropagation: !1,
					preventDefault: !0,
					touch: !0
				};
				ma(k, a);
				k.element = this;
				g(this, "mousedown", e, k);
				k.touch && g(this, "touchstart", B, k)
			})
		}
		;
		a.fn.sodahungrab = function(a) {
			return this.each(function() {
				k(this, "mousedown", "mousedown")
			})
		}
	}
)(jQuery);
jQuery.fn.extend({
	sodahdisableSelection: function() {
		this.each(function() {
			this.onselectstart = function() {
				return !1
			}
			;
			this.onmousedown = function(a) {
				return !1
			}
			;
			this.unselectable = "on";
			jQuery(this).css("-moz-user-select", "none");
			jQuery(this).css("-webkit-user-select", "none");
			jQuery(this).css("-webkit-touch-callout", "none");
			jQuery(this).css("-khtml-user-select", "none");
			jQuery(this).css("-ms-user-select", "none");
			jQuery(this).css("user-select", "none");
			jQuery(this).css("tap-highlight-color", "rgba(0, 0, 0, 0)");
			jQuery(this).css("-o-tap-highlight-color", "rgba(0, 0, 0, 0)");
			jQuery(this).css("-moz-tap-highlight-color", "rgba(0, 0, 0, 0)");
			jQuery(this).css("-webkit-tap-highlight-color", "rgba(0, 0, 0, 0)")
		})
	}
});
(function(a) {
		var k = document.createElement("div");
		k = k.style;
		var g = a.support;
		g.transform = "" === k.MozTransform ? "MozTransform" : "" === k.MsTransform ? "MsTransform" : "" === k.WebkitTransform ? "WebkitTransform" : "" === k.OTransform ? "OTransform" : "" === k.transform ? "transform" : !1;
		g.matrixFilter = !g.transform && "" === k.filter;
		k = null;
		a.cssNumber.rotate = !0;
		a.cssHooks.rotate = {
			set: function(e, k) {
				var t = g.transform;
				if ("string" === typeof k) {
					var B = k;
					k = ~B.indexOf("deg") ? parseInt(B, 10) * (2 * Math.PI / 360) : ~B.indexOf("grad") ? parseInt(B, 10) * (Math.PI / 200) : parseFloat(B)
				}
				a.data(e, "transform", {
					rotate: k
				});
				t ? e.style[t] = "rotate(" + k + "rad)" : g.matrixFilter && (t = Math.cos(k),
					B = Math.sin(k),
					e.style.filter = ["progid:DXImageTransform.Microsoft.Matrix(", "M11=" + t + ",", "M12=" + -B + ",", "M21=" + B + ",", "M22=" + t + ",", "SizingMethod='auto expand')"].join(""),
					t = a.rotate.centerOrigin) && (e.style["margin" == t ? "marginLeft" : "left"] = -(e.offsetWidth / 2) + e.clientWidth / 2 + "px",
					e.style["margin" == t ? "marginTop" : "top"] = -(e.offsetHeight / 2) + e.clientHeight / 2 + "px")
			},
			get: function(e, g) {
				var k = a.data(e, "transform");
				return k && k.rotate ? k.rotate : 0
			}
		};
		a.fx.step.rotate = function(e) {
			a.cssHooks.rotate.set(e.elem, e.now + e.unit)
		}
		;
		a.rotate = {
			centerOrigin: "margin",
			radToDeg: function(a) {
				return 180 * a / Math.PI
			}
		}
	}
)(jQuery);
(function(a) {
		a.fn.sodahmarquee = function(k) {
			return this.each(function() {
				var g = a.extend({}, a.fn.sodahmarquee.defaults, k), e = a(this), t, I, B = 3, R = "animation-play-state", S = !1, ma = function(a, e, g) {
					for (var k = ["webkit", "moz", "MS", "o", ""], l = 0; l < k.length; l++)
						k[l] || (e = e.toLowerCase()),
							a.addEventListener(k[l] + e, g, !1)
				}, l = function(a) {
					var e = [], g;
					for (g in a)
						a.hasOwnProperty(g) && e.push(g + ":" + a[g]);
					e.push();
					return "{" + e.join(",") + "}"
				}, H = {
					pause: function() {
						S && g.allowCss3Support ? t.css(R, "paused") : a.fn.pause && t.pause();
						e.data("runningStatus", "paused");
						e.trigger("paused")
					},
					resume: function() {
						S && g.allowCss3Support ? t.css(R, "running") : a.fn.resume && t.resume();
						e.data("runningStatus", "resumed");
						e.trigger("resumed")
					},
					toggle: function() {
						H["resumed" === e.data("runningStatus") ? "pause" : "resume"]()
					},
					destroy: function() {
						clearTimeout(e.timer);
						e.find("*").addBack().off();
						e.html(e.find(".js-marquee:first").html())
					}
				};
				if ("string" === typeof k)
					a.isFunction(H[k]) && (t || (t = e.find(".js-marquee-wrapper")),
					!0 === e.data("css3AnimationIsSupported") && (S = !0),
						H[k]());
				else {
					var ca;
					a.each(g, function(a) {
						ca = e.attr("data-" + a);
						if ("undefined" !== typeof ca) {
							switch (ca) {
								case "true":
									ca = !0;
									break;
								case "false":
									ca = !1
							}
							g[a] = ca
						}
					});
					g.speed && (g.duration = parseInt(e.width(), 10) / g.speed * 1E3);
					var na = "up" === g.direction || "down" === g.direction;
					g.gap = g.duplicated ? parseInt(g.gap) : 0;
					e.wrapInner('<div class="js-marquee"></div>');
					var P = e.find(".js-marquee").css({
						"margin-right": g.gap,
						"float": "left"
					});
					g.duplicated && P.clone(!0).appendTo(e);
					e.wrapInner('<div style="width:100000px" class="js-marquee-wrapper"></div>');
					t = e.find(".js-marquee-wrapper");
					if (na) {
						var V = e.height();
						t.removeAttr("style");
						e.height(V);
						e.find(".js-marquee").css({
							"float": "none",
							"margin-bottom": g.gap,
							"margin-right": 0
						});
						g.duplicated && e.find(".js-marquee:last").css({
							"margin-bottom": 0
						});
						var Z = e.find(".js-marquee:first").height() + g.gap;
						g.startVisible && !g.duplicated ? (g._completeDuration = (parseInt(Z, 10) + parseInt(V, 10)) / parseInt(V, 10) * g.duration,
							g.duration *= parseInt(Z, 10) / parseInt(V, 10)) : g.duration *= (parseInt(Z, 10) + parseInt(V, 10)) / parseInt(V, 10)
					} else {
						var ba = e.find(".js-marquee:first").width() + g.gap;
						var X = e.width();
						g.startVisible && !g.duplicated ? (g._completeDuration = (parseInt(ba, 10) + parseInt(X, 10)) / parseInt(X, 10) * g.duration,
							g.duration *= parseInt(ba, 10) / parseInt(X, 10)) : g.duration *= (parseInt(ba, 10) + parseInt(X, 10)) / parseInt(X, 10)
					}
					g.duplicated && (g.duration /= 2);
					if (g.allowCss3Support) {
						P = document.body || document.createElement("div");
						var K = "marqueeAnimation-" + Math.floor(1E7 * Math.random())
							, Fa = ["Webkit", "Moz", "O", "ms", "Khtml"]
							, T = "animation"
							, U = ""
							, ea = "";
						void 0 !== P.style.animation && (ea = "@keyframes " + K + " ",
							S = !0);
						if (!1 === S)
							for (var Ba = 0; Ba < Fa.length; Ba++)
								if (void 0 !== P.style[Fa[Ba] + "AnimationName"]) {
									P = "-" + Fa[Ba].toLowerCase() + "-";
									T = P + T;
									R = P + R;
									ea = "@" + P + "keyframes " + K + " ";
									S = !0;
									break
								}
						S && (U = K + " " + g.duration / 1E3 + "s " + g.delayBeforeStart / 1E3 + "s infinite " + g.css3easing,
							e.data("css3AnimationIsSupported", !0))
					}
					var Ea = function() {
						t.css("transform", "translateY(" + ("up" === g.direction ? V + "px" : "-" + Z + "px") + ")")
					}
						, La = function() {
						t.css("transform", "translateX(" + ("left" === g.direction ? X + "px" : "-" + ba + "px") + ")")
					};
					g.duplicated ? (na ? g.startVisible ? t.css("transform", "translateY(0)") : t.css("transform", "translateY(" + ("up" === g.direction ? V + "px" : "-" + (2 * Z - g.gap) + "px") + ")") : g.startVisible ? t.css("transform", "translateX(0)") : t.css("transform", "translateX(" + ("left" === g.direction ? X + "px" : "-" + (2 * ba - g.gap) + "px") + ")"),
					g.startVisible || (B = 1)) : g.startVisible ? B = 2 : na ? Ea() : La();
					var va = function() {
						g.duplicated && (1 === B ? (g._originalDuration = g.duration,
							g.duration = na ? "up" === g.direction ? g.duration + V / (Z / g.duration) : 2 * g.duration : "left" === g.direction ? g.duration + X / (ba / g.duration) : 2 * g.duration,
						U && (U = K + " " + g.duration / 1E3 + "s " + g.delayBeforeStart / 1E3 + "s " + g.css3easing),
							B++) : 2 === B && (g.duration = g._originalDuration,
						U && (K += "0",
							ea = a.trim(ea) + "0 ",
							U = K + " " + g.duration / 1E3 + "s 0s infinite " + g.css3easing),
							B++));
						na ? g.duplicated ? (2 < B && t.css("transform", "translateY(" + ("up" === g.direction ? 0 : "-" + Z + "px") + ")"),
							I = {
								transform: "translateY(" + ("up" === g.direction ? "-" + Z + "px" : 0) + ")"
							}) : g.startVisible ? 2 === B ? (U && (U = K + " " + g.duration / 1E3 + "s " + g.delayBeforeStart / 1E3 + "s " + g.css3easing),
							I = {
								transform: "translateY(" + ("up" === g.direction ? "-" + Z + "px" : V + "px") + ")"
							},
							B++) : 3 === B && (g.duration = g._completeDuration,
						U && (K += "0",
							ea = a.trim(ea) + "0 ",
							U = K + " " + g.duration / 1E3 + "s 0s infinite " + g.css3easing),
							Ea()) : (Ea(),
							I = {
								transform: "translateY(" + ("up" === g.direction ? "-" + t.height() + "px" : V + "px") + ")"
							}) : g.duplicated ? (2 < B && t.css("transform", "translateX(" + ("left" === g.direction ? 0 : "-" + ba + "px") + ")"),
							I = {
								transform: "translateX(" + ("left" === g.direction ? "-" + ba + "px" : 0) + ")"
							}) : g.startVisible ? 2 === B ? (U && (U = K + " " + g.duration / 1E3 + "s " + g.delayBeforeStart / 1E3 + "s " + g.css3easing),
							I = {
								transform: "translateX(" + ("left" === g.direction ? "-" + ba + "px" : X + "px") + ")"
							},
							B++) : 3 === B && (g.duration = g._completeDuration,
						U && (K += "0",
							ea = a.trim(ea) + "0 ",
							U = K + " " + g.duration / 1E3 + "s 0s infinite " + g.css3easing),
							La()) : (La(),
							I = {
								transform: "translateX(" + ("left" === g.direction ? "-" + ba + "px" : X + "px") + ")"
							});
						e.trigger("beforeStarting");
						if (S) {
							t.css(T, U);
							var k = ea + " { 100%  " + l(I) + "}"
								, H = t.find("style");
							0 !== H.length ? H.filter(":last").html(k) : a("head").append("<style>" + k + "</style>");
							ma(t[0], "AnimationIteration", function() {
								e.trigger("finished")
							});
							ma(t[0], "AnimationEnd", function() {
								va();
								e.trigger("finished")
							})
						} else
							t.animate(I, g.duration, g.easing, function() {
								e.trigger("finished");
								g.pauseOnCycle ? e.timer = setTimeout(va, g.delayBeforeStart) : va()
							});
						e.data("runningStatus", "resumed")
					};
					e.on("pause", H.pause);
					e.on("resume", H.resume);
					g.pauseOnHover && (e.on("mouseenter", H.pause),
						e.on("mouseleave", H.resume));
					S && g.allowCss3Support ? va() : e.timer = setTimeout(va, g.delayBeforeStart)
				}
			})
		}
		;
		a.fn.sodahmarquee.defaults = {
			allowCss3Support: !0,
			css3easing: "linear",
			easing: "linear",
			delayBeforeStart: 1E3,
			direction: "left",
			duplicated: !1,
			duration: 5E3,
			speed: 0,
			gap: 20,
			pauseOnCycle: !1,
			pauseOnHover: !1,
			startVisible: !1
		}
	}
)(jQuery);
