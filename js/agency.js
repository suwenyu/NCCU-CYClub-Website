/*!
 * Start Bootstrap - Agency Bootstrap Theme (http://startbootstrap.com)
 * Code licensed under the Apache License v2.0.
 * For details, see http://www.apache.org/licenses/LICENSE-2.0.
 */

// jQuery for page scrolling feature - requires jQuery Easing plugin
$(function() {
    $('a.page-scroll').bind('click', function(event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: $($anchor.attr('href')).offset().top
        }, 1500, 'easeInOutExpo');
        event.preventDefault();
    });
});

// Highlight the top nav as scrolling occurs
$('body').scrollspy({
    target: '.navbar-fixed-top'
})

// Closes the Responsive Menu on Menu Item Click
$('.navbar-collapse ul li a').click(function() {
    $('.navbar-toggle:visible').click();
});

$('label.category-reason').click(function(e){
  e.preventDefault();
    $('li.category-reason').each(function(entry) {
      $(this).toggle(1000);
    });
});


$('label.category-crisis').click(function(e){
    e.preventDefault();
    $('li.category-crisis').each(function(entry) {
      $(this).toggle(1000);
    });
});

$('label.category-east').click(function(e){
    e.preventDefault();
    $('li.category-east').each(function(entry) {
      $(this).toggle(1000);
    });
});

$('label.category-west').click(function(e){
    e.preventDefault();
    $('li.category-west').each(function(entry) {
      $(this).toggle(1000);
    });
});

$('label.category-world').click(function(e){
    e.preventDefault();
    $('li.category-world').each(function(entry) {
      $(this).toggle(1000);
    });
});

$('label.category-south').click(function(e){
    e.preventDefault();
    $('li.category-south').each(function(entry) {
      $(this).toggle(1000);
    });
});

$('label.category-sea').click(function(e){
    e.preventDefault();
    $('li.category-sea').each(function(entry) {
      $(this).toggle(1000);
    });
});

$('label.category-end').click(function(e){
    e.preventDefault();
    $('li.category-end').each(function(entry) {
      $(this).toggle(1000);
    });
});

$('label.category-impact').click(function(e){
    e.preventDefault();
    $('li.category-impact').each(function(entry) {
      $(this).toggle(1000);
    });
});