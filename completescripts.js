(function(b) {
    if (typeof define === "function" && define.amd) {
        define(["jquery"], b)
    } else {
        if (typeof module !== "undefined" && module.exports) {
            module.exports = b(require("jquery"))
        } else {
            b(jQuery)
        }
    }
})(function(k) {
    var i = -1,
        l = -1;
    var n = function(a) {
        return parseFloat(a) || 0
    };
    var m = function(a) {
        var e = 1,
            c = k(a),
            d = null,
            b = [];
        c.each(function() {
            var h = k(this),
                f = h.offset().top - n(h.css("margin-top")),
                g = b.length > 0 ? b[b.length - 1] : null;
            if (g === null) {
                b.push(h)
            } else {
                if (Math.floor(Math.abs(d - f)) <= e) {
                    b[b.length - 1] = g.add(h)
                } else {
                    b.push(h)
                }
            }
            d = f
        });
        return b
    };
    var o = function(b) {
        var a = {
            byRow: true,
            property: "height",
            target: null,
            remove: false
        };
        if (typeof b === "object") {
            return k.extend(a, b)
        }
        if (typeof b === "boolean") {
            a.byRow = b
        } else {
            if (b === "remove") {
                a.remove = true
            }
        }
        return a
    };
    var j = k.fn.matchHeight = function(c) {
        var a = o(c);
        if (a.remove) {
            var b = this;
            this.css(a.property, "");
            k.each(j._groups, function(e, d) {
                d.elements = d.elements.not(b)
            });
            return this
        }
        if (this.length <= 1 && !a.target) {
            return this
        }
        j._groups.push({
            elements: this,
            options: a
        });
        j._apply(this, a);
        return this
    };
    j.version = "master";
    j._groups = [];
    j._throttle = 80;
    j._maintainScroll = false;
    j._beforeUpdate = null;
    j._afterUpdate = null;
    j._rows = m;
    j._parse = n;
    j._parseOptions = o;
    j._apply = function(g, c) {
        var a = o(c),
            b = k(g),
            h = [b];
        var f = k(window).scrollTop(),
            d = k("html").outerHeight(true);
        var e = b.parents().filter(":hidden");
        e.each(function() {
            var r = k(this);
            r.data("style-cache", r.attr("style"))
        });
        e.css("display", "block");
        if (a.byRow && !a.target) {
            b.each(function() {
                var t = k(this),
                    s = t.css("display");
                if (s !== "inline-block" && s !== "flex" && s !== "inline-flex") {
                    s = "block"
                }
                t.data("style-cache", t.attr("style"));
                t.css({
                    display: s,
                    "padding-top": "0",
                    "padding-bottom": "0",
                    "margin-top": "0",
                    "margin-bottom": "0",
                    "border-top-width": "0",
                    "border-bottom-width": "0",
                    height: "100px",
                    overflow: "hidden"
                })
            });
            h = m(b);
            b.each(function() {
                var r = k(this);
                r.attr("style", r.data("style-cache") || "")
            })
        }
        k.each(h, function(v, u) {
            var w = k(u),
                x = 0;
            if (!a.target) {
                if (a.byRow && w.length <= 1) {
                    w.css(a.property, "");
                    return
                }
                w.each(function() {
                    var t = k(this),
                        r = t.attr("style"),
                        q = t.css("display");
                    if (q !== "inline-block" && q !== "flex" && q !== "inline-flex") {
                        q = "block"
                    }
                    var s = {
                        display: q
                    };
                    s[a.property] = "";
                    t.css(s);
                    if (t.outerHeight(false) > x) {
                        x = t.outerHeight(false)
                    }
                    if (r) {
                        t.attr("style", r)
                    } else {
                        t.css("display", "")
                    }
                })
            } else {
                x = a.target.outerHeight(false)
            }
            w.each(function() {
                var q = k(this),
                    r = 0;
                if (a.target && q.is(a.target)) {
                    return
                }
                if (q.css("box-sizing") !== "border-box") {
                    r += n(q.css("border-top-width")) + n(q.css("border-bottom-width"));
                    r += n(q.css("padding-top")) + n(q.css("padding-bottom"))
                }
                q.css(a.property, (x - r) + "px")
            })
        });
        e.each(function() {
            var r = k(this);
            r.attr("style", r.data("style-cache") || null)
        });
        if (j._maintainScroll) {
            k(window).scrollTop((f / d) * k("html").outerHeight(true))
        }
        return this
    };
    j._applyDataApi = function() {
        var a = {};
        k("[data-match-height], [data-mh]").each(function() {
            var b = k(this),
                c = b.attr("data-mh") || b.attr("data-match-height");
            if (c in a) {
                a[c] = a[c].add(b)
            } else {
                a[c] = b
            }
        });
        k.each(a, function() {
            this.matchHeight(true)
        })
    };
    var p = function(a) {
        if (j._beforeUpdate) {
            j._beforeUpdate(a, j._groups)
        }
        k.each(j._groups, function() {
            j._apply(this.elements, this.options)
        });
        if (j._afterUpdate) {
            j._afterUpdate(a, j._groups)
        }
    };
    j._update = function(a, b) {
        if (b && b.type === "resize") {
            var c = k(window).width();
            if (c === i) {
                return
            }
            i = c
        }
        if (!a) {
            p(b)
        } else {
            if (l === -1) {
                l = setTimeout(function() {
                    p(b);
                    l = -1
                }, j._throttle)
            }
        }
    };
    k(j._applyDataApi);
    k(window).bind("load", function(a) {
        j._update(false, a)
    });
    k(window).bind("resize orientationchange", function(a) {
        j._update(true, a)
    })
});

function applyMatchHeight() {
    $("#myshp-body .spelplus_category_menu .nav_header_menu11_div_sp .nav_header_menu11_item").matchHeight();
    $("#myshp-body .spelplus_category_menu .nav_header_menu11_div_sp").matchHeight();
    $("#myshp-body #myshp_list .myshp_list_row .myshp_list_product .cos-product-title").matchHeight();
    $("#myshp-body #myshp_list .myshp_list_row .myshp_list_product .cos-product-features").matchHeight();
    $("#myshp-body #myshp_list .myshp_list_row .myshp_list_product").matchHeight();
    $("#myshp-body .cos-related-products-list .cos-related-product .cos-related-product-title").matchHeight();
    $("#myshp-body .cos-related-products-list .cos-related-product .cos-related-product-features").matchHeight();
    $("#myshp-body .cos-related-products-list .cos-related-product").matchHeight()
}
$(document).ready(function() {

	$('.cos-sidebar-search input[name="_globalsearch"]').attr("placeholder","zoek artikel");
    applyMatchHeight();
    $("#myshp-body #myshp_menu_side .myshp_filtermenu_group .myshp_block_menu_filter_list li input[type=checkbox]").each(function() {
        $(this).parent().addClass("cos-checkbox-container");
        if ($(this).is(":checked")) {
            $(this).parent().addClass("cos-checkbox-checked");
            $(this).parent().prepend('<span class="cos-checkbox"><i class="fa fa-check" aria-hidden="true"></i></span>')
        } else {
            $(this).parent().prepend('<span class="cos-checkbox"><i class="fa fa-circle" aria-hidden="true"></i></span>')
        }
    });
    $("#myshp-body .cos-jump-to-top i").click(function() {
        $("html, body").animate({
            scrollTop: 0
        }, 800);
        return false
    });
    $("#myshp-body .cos-toggle-menu").click(function() {
        $("#myshp-body .cos-yellow-circles").toggleClass("cos-toggled").toggle()
    });
    if ($(".myshp_column_count_3 #myshp-body #myshp_nifty #myshp_menu_side_right").length) {
        $(".myshp_column_count_3 #myshp-body #myshp_nifty #myshp_menu_side_right").clone().insertAfter("#myshp-body #myshp_menu_side").addClass("cos-newsletter-basket-mobile")
    }
    if ($(".cos-sidebar-pages-menu").length) {
        $(".cos-sidebar-pages-menu").clone().insertBefore("#myshp-body #myshp_footer").addClass("cos-sidebar-pages-menu-mobile")
    }
    if ($(".cos-mobile-top-banner").length) {
        var c = $(".cos-mobile-top-banner img").attr("src");
        $(".cos-mobile-logo-banner .cos-banner").attr("style", "background-image: url('" + c + "');");
        $("#myshp-body .cos-mobile-logo-banner .cos-banner").show()
    }
    if ($(".cos-product-details-form").length && $("#myshp_info_product .myshp_info_features").length) {
        $(".cos-product-details-form").appendTo("#myshp_info_product .myshp_info_features").show()
    }
    $("#myshp-body .cos-product-details-form, #myshp-body .cos-product-details-form iframe").removeAttr("style").removeAttr("height").removeAttr("width");
    if (!$("#cos-product-in-stock").length) {
        $(".cos-reserve-product").show()
    }
    $("#myshp-body .cos-reserve-product").click(function() {
        $("#myshp-body .cos-product-details-form").show()
    });

		$("#myshp-body .cos-reserve-product").click(function() {
        $("#myshp-body .cos-product-details-form").show()
    });


		var sidebarHeight = $('#myshp_menu_side').outerHeight(true);
		var rightContentHeight = $('#myshp_content_frame').outerHeight(true);
		var elementsMaxHeight = Math.max(sidebarHeight, rightContentHeight);

		$('#myshp_menu_side').height(elementsMaxHeight);
		$('#myshp_content_frame').height(elementsMaxHeight);
		$('#myshp_menu_side_right').height(elementsMaxHeight);





		var d = $("#cos-basketcount").text();
    $("#myshp_menu_side_right #myshp_menu_side_basket").prepend('<span class="cos-total-products">' + d + "</span>");

		$(".cos-bestel-confirmation").appendTo("#myshp_menu_side_right #myshp_menu_side_basket");

		function numbersOnlyString(x) {
			var y = x.replace(/&#160;/g, "");
					y = y.replace(/\D/g,'');
			return y;
		}

		myshopEvent().onOrder(function() {
			$('.cos-bestel-confirmation').fadeIn(600,function(){

				if (typeof myshop("no").shoppingCart === "function") {
					var myshopCartData = myshop("no").shoppingCart().storage;
					var myshopCartTotalProductsRaw = myshopCartData.get("count");
					var myshopCartTotalProducts = numbersOnlyString(myshopCartTotalProductsRaw);

					$('.cos-total-products').text(myshopCartTotalProducts);
					$('.cos-basket-button-mobile span').html('Winkelwagen<i>('+myshopCartTotalProducts+')</i>');

					setTimeout(function() {
						$('.cos-bestel-confirmation').fadeOut(600);
					}, 3000);
				}

			});
		});

});


$( window ).load(function() {
	var sidebarHeight = $('#myshp_menu_side').outerHeight(true);
	var rightContentHeight = $('#myshp_content_frame').outerHeight(true);
	var elementsMaxHeight = Math.max(sidebarHeight, rightContentHeight);

	$('#myshp_menu_side').height(elementsMaxHeight);
	$('#myshp_content_frame').height(elementsMaxHeight);
	$('#myshp_menu_side_right').height(elementsMaxHeight);

});