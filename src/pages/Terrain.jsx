import React from "react";
import { APIProvider, Map, InfoWindow, AdvancedMarker, Pin } from "@vis.gl/react-google-maps";

const Terrain = () => {
  const Marker = (latLng) => {
    return (
      <AdvancedMarker key={""} position={latLng}>
        <Pin background={"#FBBC04"} glyphColor={"#000"} borderColor={"#000"} />
      </AdvancedMarker>
    );
  };

  return (
    <div>
      <APIProvider
        apiKey={"AIzaSyBq2QqD8jU1Bm3ClKYcrm9FImaXxOi3XtA"}
        onLoad={() => console.log("Maps API has loaded.")}
      >
        <Map
          defaultZoom={8}
          defaultCenter={{ lat: 19.1591396, lng: -70.7668276 }}
          onClick={(ev) => Marker(ev.detail.latLng)}
          style={{ blockSize: "90vh" }}
        >
          <InfoWindow position={{ lat: 19.1591396, lng: -70.7668276 }}></InfoWindow>
        </Map>
      </APIProvider>
    </div>
  );
};

export default Terrain;
