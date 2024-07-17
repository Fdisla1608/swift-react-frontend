import React, { useState } from "react";
import { Map, GoogleApiWrapper, Polygon } from "google-maps-react";

const Terrain = (props) => {
  const [polygonCoords, setPolygonCoords] = useState([]);

  const handleMapClick = (mapProps, map, clickEvent) => {
    const newCoord = {
      lat: clickEvent.latLng.lat(),
      lng: clickEvent.latLng.lng(),
    };
    setPolygonCoords([...polygonCoords, newCoord]);
  };

  const handlePolygonClick = (mapProps, map, clickEvent) => {
    console.log(polygonCoords);
  };

  return (
    <Map
      google={props.google}
      initialCenter={{ lat: 19.474776576674287, lng: -70.69596049938065 }}
      zoom={14}
      onClick={handleMapClick}
    >
      <Polygon
        paths={polygonCoords}
        strokeColor="#0000FF"
        strokeOpacity={0.8}
        strokeWeight={2}
        fillColor="#0000FF"
        fillOpacity={0.35}
        onClick={handlePolygonClick}
      />
    </Map>
  );
};

export default GoogleApiWrapper({
  apiKey: "AIzaSyBq2QqD8jU1Bm3ClKYcrm9FImaXxOi3XtA",
})(Terrain);
