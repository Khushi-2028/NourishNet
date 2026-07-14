import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import { useEffect } from "react";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const pickupIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const volunteerIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const ngoIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function FollowVolunteer({ position }) {
  const map = useMap();

  useEffect(() => {
    if (!position) return;

    map.flyTo(position, map.getZoom(), {
      animate: true,
      duration: 0.6,
    });
  }, [position, map]);

  return null;
}

const TrackingMap = ({
  pickupCoords,
  volunteerCoords,
  destinationCoords,
  routePoints = [],
}) => {
  const center =
    volunteerCoords
      ? [volunteerCoords[1], volunteerCoords[0]]
      : pickupCoords
      ? [pickupCoords[1], pickupCoords[0]]
      : [20.5937, 78.9629];

  return (
    <MapContainer
      center={center}
      zoom={13}
      style={{
        width: "100%",
        height: "100%",
        minHeight: "400px",
      }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {volunteerCoords && (
        <FollowVolunteer
          position={[
            volunteerCoords[1],
            volunteerCoords[0],
          ]}
        />
      )}

      {pickupCoords && (
        <Marker
          position={[
            pickupCoords[1],
            pickupCoords[0],
          ]}
          icon={pickupIcon}
        >
          <Popup>Pickup Location</Popup>
        </Marker>
      )}

      {volunteerCoords && (
        <Marker
          position={[
            volunteerCoords[1],
            volunteerCoords[0],
          ]}
          icon={volunteerIcon}
        >
          <Popup>Volunteer</Popup>
        </Marker>
      )}

      {destinationCoords && (
        <Marker
          position={[
            destinationCoords[1],
            destinationCoords[0],
          ]}
          icon={ngoIcon}
        >
          <Popup>NGO Destination</Popup>
        </Marker>
      )}

      {routePoints.length > 0 && (
        <Polyline
          positions={routePoints}
          color="#2563eb"
          weight={5}
        />
      )}
    </MapContainer>
  );
};

export default TrackingMap;