"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { LatLngExpression, LatLngTuple } from "leaflet";
import { useI18n } from "@/app/contexts/I18nContext";

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
  const { t } = useI18n();
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
      closePopupOnClick={true}
      zoomControl={false}
      style={{ height: "200px", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={mockupLocation.posix} draggable={false}>
        <Popup className="p-2 text-center">
          <h2 className="text-lg font-semibold">{t("cardDetails.signedLocation.popupTitle")}</h2>
          <p className="text-md text-gray-600 w-[150px]">
            {t("cardDetails.signedLocation.popupDesc")}
          </p>
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default SignedLocation;
