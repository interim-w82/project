var mapOptions = {
  center: [37.8, -96.9],
  zoom: 4,
  zoomControl: false,
  attributionControl: false,
};

var mymap = L.map('mapid', mapOptions);
var layer = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
mymap.addLayer(layer );

      // var map = new L.Map('map', {center: new L.LatLng(51.51, -0.11), zoom: 9});
      // var googleLayer = new L.Google('ROADMAP');
      // map.addLayer(googleLayer);
    // .setView([51.505, -0.09], 13);
// mymapview = document.getElementById("mapid");
// mymapview.height($(window).height())
// console.log(window.height);
  // .height($(window).height()).width($(window).width());
// mymap.invalidateSize();
