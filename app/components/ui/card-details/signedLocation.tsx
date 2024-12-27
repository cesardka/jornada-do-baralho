"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { LatLngExpression, LatLngTuple } from "leaflet";

import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";

interface MapProps {
  posix: LatLngExpression | LatLngTuple; // TODO: fix signedLocation type
  zoom?: number;
}

const SignedLocation = ({
  signedLocation,
}: {
  signedLocation: string | null;
}) => {
  const mockupLocation: MapProps = {
    posix: [-23.5505, -46.6333],
    zoom: 13, // and CONFIRM 1️⃣3️⃣
  };

  // TODO: render an empty map with some easter egg if this card has no location yet
  if (!signedLocation) console.log({ signedLocation });

  return (
    <MapContainer
      zoom={mockupLocation.zoom}
      center={mockupLocation.posix}
      dragging={false} // Disables dragging
      touchZoom={false} // Disables zooming with touch gestures
      scrollWheelZoom={false}
      closePopupOnClick={false}
      zoomControl={false}
      style={{ height: "250px", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={mockupLocation.posix} draggable={false}>
        <Popup className="p-4 text-center">
          <h2 className="text-2xl font-semibold">Bar Lagoa</h2>
          <p className="text-lg text-gray-600">
            Esse é apenas um exemplo, mas espero um dia ir lá!
          </p>
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default SignedLocation;
