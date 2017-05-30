var earth;
var animation;
//creates the earth with


  function initialize(e, centerAt) {
    var input = e.target.value
    var mapOptions= {
            position: centerAt,
            // sky: true,
            atmosphere: true,
            opacity: .8
            // dragging: false
          }
    earth = new WE.map('earth_div', mapOptions);

    var layer = WE.tileLayerJSON('https://tileserver.maptiler.com/swissimage25m/%7Bz%7D/%7Bx%7D/%7By%7D.jpg/nasa.json', {attribution: .5 })

    // var layer = WE.tileLayer('http://data.webglearth.com/natural-earth-color/{z}/{x}/{y}.jpg'
    // , {
    //   minZoom: 0,
    //   maxZoom: 5,
    //   tms: true})
      layer.addTo(earth);
      earth.setView([10,0],2)
      addMarkers();
    startAnimation();
};

function startAnimation(){
    earth.setHeading(-23.5);
    var before = null;
    animation? cancelAnimationFrame(animation) : null ;
    requestAnimationFrame(function animate(now) {
        var c = earth.getPosition();
        var elapsed = before? now - before: 0;
        before = now;
        earth.setCenter([c[0], c[1] - 1*(elapsed/50)]);
        earth.setTilt(0);
        animation = requestAnimationFrame( animate );
    })
}


//Loops through all of the points and fetches the lng/lat and places that point on the map
// idealy: get all the lng/lat for each locations on sign up so there is no need to fetch multiple times
function addMarkers(){
  // debugger;
  removeMarkers()
  var uniquePlaces = uniqueCity(users)

  for (var i = 0; i < uniquePlaces.length; i++) {
    if (uniquePlaces[i].geo.lat && uniquePlaces[i].geo.lng) {

          var lat = uniquePlaces[i].geo.lat
          var lng = uniquePlaces[i].geo.lng

          var cPoint = [lat, lng]
          var marker = WE.marker(cPoint);
          var circle = WE.polygon(makeCircle(cPoint, .7, 10),
            {
              color: "#ffff00",
              weight: 4,
              opactiy: 1,
              fillColor: "#ffff00",
              fillOpacity: 1
            });
            // earth.points.push(circle)
          // marker.addTo(earth);
          circle.addTo(earth);

      }
    }
}

function removeMarkers(){
  // debugger;

  for (var i = 0; i < earth.ub.length; i++) {
        earth.ub[i].removeAll();
    }
}




//this function makes a circle of points around a center point like [50, -9]
//because the circle feature desnt work in webEarth
function makeCircle(centerArr, radius, points){
  var circle = [];
  for(var i=0; i<points; i++){
    var x = centerArr[0] + radius * Math.cos(2 * Math.PI * i / points);
    var y = centerArr[1] + radius * Math.sin(2 * Math.PI * i / points);

    circle.push([x,y])
  }
  return circle;
};

function uniqueCity(req){
  var unique = [];
  for (var i = 0; i < req.length; i++) {
    if (!unique.contains(req[i]) && req[i].city !== ""){
      unique.push(req[i]);
    };
  };
  return unique;
}

function panToLocation(coors){
  var seconds = 10000;
  cancelAnimationFrame(animation);
  var marker = WE.marker(coors);
  marker.addTo(earth);
  earth.panTo(coors,{heading: 90, tilt: 30, duration: 1});
  setTimeout(function(){earth.panTo([10,0])}, seconds - 4000);
  setTimeout(startAnimation, seconds);
  setTimeout(function(){marker.removeFrom(earth)}, seconds);
      }


function setCenterView(){
  earth.setView([20,0], 4);
  earth.setHeading(90);
}

function updateMarker(){
  animation? cancelAnimationFrame(animation) : null ;
  var results = users.filter(isInUser)
  var i = 0
  if (results[i].geo == {}){
  while (results[i].geo == {}) {
      i++
      if (results[i].geo !== {}) {
        setTimeout(panToLocation([results[0].geo.lat, results[0].geo.lng]) ,4000)
      }
    }
  } else {
    setTimeout(panToLocation([results[0].geo.lat, results[0].geo.lng]) ,4000)
  }

}

function isInUser(val){
  var searchBarValue = document.getElementById("search").value
    return val.firstName.toLowerCase().includes(searchBarValue.toLowerCase()) || val.lastName.toLowerCase().includes(searchBarValue.toLowerCase()) || val.city.toLowerCase().includes(searchBarValue.toLowerCase())
}
