const map = L.map("leafletMap", {
  zoomControl: false,
}).setView([39.5, -98.35], 3);

map.touchZoom.disable();
map.doubleClickZoom.disable();
map.scrollWheelZoom.disable();
map.boxZoom.disable();
map.keyboard.disable();
map.dragging.disable();

L.geoJSON(geojson).addTo(map);

const markers = [
  [40.7127837, -74.0059413],
  [48.0522342, -118.2436849],
  [41.8781136, -87.6297982],
  [42.715738, -117.1610838],
  [42.7766642, -96.79698789999999],
];

fetch("https://fakestoreapi.com/users?limit=5")
  .then((res) => res.json())
  .then((json) => {
    console.log(json);
    json.forEach((user, index) => {
      let marker = L.marker(
        // [user.address.geolocation.lat, user.address.geolocation.long],
        markers[index],
        {
          icon: L.divIcon({
            className: "leaflet-marker-div",
            html: "",
          }),
        }
      ).addTo(map);

      marker.bindTooltip(user.username);
    });
  });
