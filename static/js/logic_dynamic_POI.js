
function createMap(pointsOfInterest) {


  // Create the tile layer that will be the background of our map.
  var streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });


  // Create a baseMaps object to hold the streetmap layer.
  var baseMaps = {
    "Street Map": streetmap
  };

  // Create an overlayMaps object.
  var overlayMaps = {
    "Attractions": pointsOfInterest
  };

  // cleanup container map
  var container = L.DomUtil.get('poi_map');
  if (container != null) {
    container._leaflet_id = null;
  }

  // Create the map object with options.
  var map = L.map("poi_map", {
    center: getHotelLatLon(),
    zoom: 12,
    layers: [streetmap, pointsOfInterest]
  });

  // Create a layer control, and pass it baseMaps and overlayMaps. Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: true
  }).addTo(map);


  var greenIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  L.marker(getHotelLatLon(), { icon: greenIcon }).addTo(map)
    .bindPopup(getHotelName())
    .openPopup();
}

function createMarkers(response2) {

  console.log(response2)
  // Pull the response.data.
  var POIs = response2.features;
  console.log(POIs)
  // Initialize an array to hold the markers.
  var touristSites = [];

  // Loop through the POIs array.
  for (var index = 0; index < POIs.length; index++) {
    var site = POIs[index];

    // For each site, create a marker, and bind a popup with the site's name.
    var touristMarker = L.marker([site.properties.lat, site.properties.lon])
      .bindPopup(site.properties.name + "Street: " + site.properties.street);

    // Add the marker to the array.
    touristSites.push(touristMarker);
  }

  // Create a layer group and pass it to the createMap function.
  createMap(L.layerGroup(touristSites));
}

function getHotelLatLon() {
  var hotel = document.querySelector("#hoteldata");
  var selectedHotel = hotel.options[hotel.selectedIndex];
  var cityLat = selectedHotel.getAttribute('hotelLatitude');
  var cityLon = selectedHotel.getAttribute('hotelLongitude');
  return [cityLat, cityLon]
}

function getHotelName() {
  var hotel = document.querySelector("#hoteldata");
  var selectedHotel = hotel.options[hotel.selectedIndex];
  return selectedHotel.getAttribute('hotelName');
}

function findCity(response) {

  radius = 25000

  latLon = getHotelLatLon()
  cityLat = latLon[0]
  cityLon = latLon[1]
  categories = "tourism"
  limit = 200
  filters = `circle%3A${cityLon}%2C${cityLat}%2C${radius}`
  geoKey = "e36b93f065f8427b8961aa2d1de2d5b1"
  bias = `proximity:${cityLon},${cityLat}`

  params = {
    "categories": categories,
    "limit": limit,
    "filter": filters,
    "apiKey": geoKey
  }

  markerURL = (`https://api.geoapify.com/v2/places?categories=${categories}&limit=${limit}&filter=${filters}&apiKey=${geoKey}`)
  console.log(markerURL)

  d3.json(markerURL).then(function (data) {
    //console.log(data)
    createMarkers(data)

  })


}
function optionChanged(value) {

  // Log the new value  
  console.log(value);

  // Perform an API call. Call findCity when it completes.
  target_city = 'Chicago'
  geoKey = "e36b93f065f8427b8961aa2d1de2d5b1"
  url = (`https://api.geoapify.com/v1/geocode/search?text="${target_city}&format=json&apiKey=${geoKey}`)
  d3.json(url).then(findCity);
};


  //https://api.geoapify.com/v1/geocode/search?text={target_city}&format=json&apiKey=

  //  d3.json("https://api.geoapify.com/v2/places?categories=tourism&filter=place:
  //5114c48e44e4eb55c0590c5397644ceb4440f00101f901ecde010000000000c002069203074368696361676f&lang=en&
  //limit=200&apiKey=e36b93f065f8427b8961aa2d1de2d5b1").then(createMarkers);


