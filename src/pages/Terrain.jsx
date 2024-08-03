import React, { useState, useEffect } from "react";
import { Map, GoogleApiWrapper, Polygon, Marker, InfoWindow } from "google-maps-react";
import mqtt from "mqtt";
import { v7 } from "uuid";

import "../styles/terrain.css";
import edgeIcon from "../styles/images/edgeIcon.png";

const protocol = "ws";
const host = "maptest.ddns.net";
const port = "8083";
const path = "/mqtt";
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`;
const topic = "swift/modules/+";
const connectUrl = `${protocol}://${host}:${port}${path}`;

function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

const Terrain = (props) => {
  const [polygonCoords, setPolygonCoords] = useState([]);
  const [client, setClient] = useState(null);
  const [modules, setModules] = useState({});
  const [terrains, setTerrains] = useState({});
  const [state, setState] = useState({
    showingInfoWindow: false,
    activeMarker: {},
    selectedPlace: {},
  });
  const [stateZone, setStateZone] = useState({
    showingInfoWindow: false,
    activeMarker: {},
    selectedPlace: {},
  });
  const [moduleInfo, setModuleInfo] = useState({
    moduleId: "",
    sensors: { humity: { h_01: 0 }, lux: { l_01: 0 } },
    location: { lat: 0, lng: 0, sat: 0 },
  });

  const mqttConnect = () => {
    const newClient = mqtt.connect(connectUrl, {
      clientId,
      clean: true,
      connectTimeout: 4000,
      username: "emqx",
      password: "public",
      reconnectPeriod: 1000,
    });

    newClient.on("connect", () => {
      newClient.subscribe(topic, (err) => {
        if (err) console.error("Error subscribing to MQTT topic:", err);
      });
    });

    newClient.on("message", async (topic, message) => {
      const newModule = JSON.parse(message.toString());

      await setModules((prevModules) => {
        const updatedModules = { ...prevModules };
        updatedModules[newModule.moduleId] = newModule;
        return updatedModules;
      });
    });

    newClient.on("error", (err) => {
      console.error("MQTT connection error:", err);
      newClient.end();
    });

    setClient(newClient);
  };

  const fetchTerrains = async () => {
    try {
      const response = await fetch("http://maptest.ddns.net:3003/api/terrains");

      if (!response.ok) {
        throw new Error("Error al obtener los terrenos");
      }

      const data = await response.json();
      setTerrains(data);
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    if (!client) mqttConnect();
    fetchTerrains();
    return () => {
      if (client) client.end();
    };
  }, [modules]);

  const handleMapClick = (mapProps, map, clickEvent) => {
    const newCoord = {
      lat: clickEvent.latLng.lat(),
      lng: clickEvent.latLng.lng(),
    };
    setPolygonCoords([...polygonCoords, newCoord]);
  };

  const handlePolygonClick = async (props, polygon, clickEvent) => {
    try {
      let terrainName = prompt("Ingrese el nombre:", "");
      const terrainData = { terrainId: v7(), terrainName, location: polygonCoords };
      console.log(terrainData);
      if (terrainName == null || terrainName === "") {
        console.log("terrainName not provided");
      } else {
        const response = await fetch("http://maptest.ddns.net:3003/api/terrains", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(terrainData),
        });

        if (!response.ok) {
          throw new Error("Failed to create a new terrain");
        }
        const newTerrain = await response.json();
        console.log("New terrain created:", newTerrain);
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  const onMarkerClick = (props, marker, e) => {
    setModuleInfo(props.object);
    setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true,
    });
  };

  const onTerrainClick = (props, terrain, e) => {
    setStateZone({
      selectedPlace: props,
      activeMarker: terrain,
      showingInfoWindow: true,
    });
  };

  const showModules = () => {
    return Object.values(modules).map((module, index) => (
      <Marker
        key={index}
        object={module}
        position={{
          lat: module.location.lat,
          lng: module.location.lng,
        }}
        icon={{
          url: edgeIcon,
          scaledSize: new window.google.maps.Size(100, 100),
          labelOrigin: new window.google.maps.Point(40, 15),
        }}
        onClick={onMarkerClick}
      />
    ));
  };

  const showTerrains = () => {
    return Object.values(terrains).map((terrain, index) => {
      const color = getRandomColor();
      return (
        <Polygon
          key={index}
          paths={terrain.location}
          strokeColor={color}
          strokeOpacity={0.8}
          strokeWeight={2}
          fillColor={color}
          fillOpacity={0.45}
          object={terrain}
          onClick={onTerrainClick}
        />
      );
    });
  };

  return (
    <div className="terrain-panel">
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
        {modules && showModules()}
        {terrains && showTerrains()}

        <InfoWindow marker={stateZone.activeMarker} visible={true}>
          <div className="info-window-panel">
            <center>
              <div className="info-header">Zone</div>
              <div className="info-sub-header">hello</div>
            </center>
          </div>
        </InfoWindow>

        <InfoWindow marker={state.activeMarker} visible={state.showingInfoWindow}>
          <div className="info-window-panel">
            <center>
              <div className="info-header">Module Edge</div>
              <div className="info-sub-header">{moduleInfo.moduleId}</div>
            </center>
            <div className="info-container">
              <div className="info-field">
                <strong>Humedad:</strong> {moduleInfo.sensors.humity.h_01.toFixed(2)}%
              </div>
              <div className="info-field">
                <strong>Iluminancia:</strong> {moduleInfo.sensors.lux.l_01} lux
              </div>
              <div className="info-field">
                <strong>Fecha:</strong> {new Date(Date.now()).toISOString()}
              </div>
            </div>
          </div>
        </InfoWindow>


      </Map>
    </div>
  );
};

export default GoogleApiWrapper({
  apiKey: "AIzaSyBq2QqD8jU1Bm3ClKYcrm9FImaXxOi3XtA",
})(Terrain);
