( function() {

'use strict';

test( 'container size', function() {
  var container = document.querySelector('#container-size');
  var pckry = new Packery( container );
  equal( container.style.height, '40px', 'default height' );

  pckry.options.gutter = 4;
  pckry._getMeasurements();
  pckry.layout();
  equal( container.style.height, '40px', 'added gutter, height same' );

  // addPaddingBorders() {
  container.style.padding = '1px 2px 3px 4px';
  container.style.borderStyle = 'solid';
  container.style.borderWidth = '1px 2px 3px 4px';
  pckry.layout();
  equal( container.style.height, '40px', 'add padding, height same' );

  // border box
  container.style.WebkitBoxSizing = 'border-box';
  container.style.MozBoxSizing = 'border-box';
  container.style.boxSizing = 'border-box';
  pckry.layout();
  equal( container.style.height, '48px', 'border-box, height + padding + border' );
});

})();
