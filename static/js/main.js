(new WOW).init(),$(document).ready(function(){$.extend($.lazyLoadXT,{edgeY:200,srcAttr:"data-src"}),"/about/"==window.location.pathname&&$("#about__link").addClass("about__link").removeClass("hvr-underline-from-center"),"/blog/"==window.location.pathname&&$("#blog__link").addClass("blog__link").removeClass("hvr-underline-from-center"),"/contacts/"==window.location.pathname&&$("#contact__link").addClass("contact__link").removeClass("hvr-underline-from-center");var e=document.getElementById("scene");if(null!=e)new Parallax(e);if("/"==window.location.href&&1==localStorage.team_swipe){localStorage.team_swipe=null,setTimeout(function(){document.getElementById("main__title-team").scrollIntoView()},500)}if($("#team__link").on("click",function(){if("/"==window.location.pathname){setTimeout(function(){document.getElementById("main__title-team").scrollIntoView()},500)}else localStorage.setItem("team_swipe",1),window.location.pathname="/"}),$(".team__footer").on("click",function(){if("/"==window.location.pathname){setTimeout(function(){document.getElementById("main__title-team").scrollIntoView()},500)}else localStorage.setItem("team_swipe",1),window.location.pathname="/"}),"/"==window.location.pathname&&1==localStorage.practise_swipe){localStorage.practise_swipe=null,setTimeout(function(){document.getElementById("main__title-practise").scrollIntoView()},500)}$("#practise__link").on("click",function(){if("/"==window.location.pathname){setTimeout(function(){document.getElementById("team-btn").scrollIntoView()},500)}else localStorage.setItem("practise_swipe",1),window.location.pathname="/"}),$(".practise__footer").on("click",function(){if("/"==window.location.pathname){setTimeout(function(){document.getElementById("team-btn").scrollIntoView()},500)}else localStorage.setItem("practise_swipe",1),window.location.pathname="/"});var t=$(".menu-link"),o=($(".menu-link_active"),$(".menu"));$(".menu-link").on("click",function(){t.toggleClass("menu-link_active"),o.toggleClass("menu_active"),$(this).hasClass("menu-link_active")?$("html,body").css("overflow","hidden"):$("html,body").css("overflow","visible")}),$(".punch_link").on("click",function(){t.toggleClass("menu-link_active"),o.removeClass("menu_active"),$("html,body").css("overflow","visible")}),jQuery(function(o){o(document).mouseup(function(e){var t=o("sub-m-1");t.is(e.target)||0!==t.has(e.target).length||t.hide()})});$(".sliderLogo").slick({nextArrow:document.querySelector("#my-arrow-next"),prevArrow:document.querySelector("#my-arrow-prev"),dots:!1,swipe:!1,fade:!0,autoplay:!0,autoplaySpeed:5e3,pauseOnHover:!1});var n=$(".sliderS").slick({nextArrow:document.querySelector("#my-arrow-next"),prevArrow:document.querySelector("#my-arrow-prev"),dots:!1,swipe:!1,fade:!0,speed:100});$(".my-1").on("click",function(){n.slick("slickNext")}),$(".my-2").on("click",function(){n.slick("slickPrev")}),$(".city-name").on("click",function(){$(this)[0].dataset.tab,$(".city-name").removeClass("city-name_active"),$(this).addClass("city-name_active"),$(".map-info-block").removeClass("map-info-block_active"),$("#"+$(this)[0].dataset.tab).addClass("map-info-block_active"),$(".map-footer").removeClass("map-footer_active"),$("#m"+$(this)[0].dataset.tab).addClass("map-footer_active"),console.log($("#m"+$(this)[0].dataset.tab).addClass("map-footer_active"))}),$("#phone").mask("+38 (099) 99 - 99 - 999")});