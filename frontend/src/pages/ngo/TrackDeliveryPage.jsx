import { useEffect,useState } from "react";
import { useParams, useNavigate, useLocation, } from "react-router-dom";
import { FiArrowLeft, FiClock, FiNavigation } from "react-icons/fi";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchTrackingHistory, fetchCurrentETA, selectTrackingHistory, 
  selectTrackingETA, selectLiveLocation } from "../../features/tracking/trackingSlice";
import {confirmDelivery} from "../../features/deliveries/deliveriesSlice"; 
import { SectionLoader } from "../../components/common/Spinner";
import { formatRelativeTime } from "../../utils/formatters";
import {connectSocket} from "../../sockets/socket";
import {setLiveLocationFromSocket,} from "../../features/tracking/trackingSlice";

// Fix leaflet default icon paths broken by Vite's asset pipeline
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png"
});

const liveIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [28, 45],
  iconAnchor: [14, 45],
  popupAnchor: [0, -45]
});
const MapFlyTo = ({ center }) => {
    const map = useMap();
    useEffect(() => {
        console.log("Flying to:", center);
        if (center) {
            map.flyTo(center, 14, {
                animate: true,
        duration: 1 });
        }
    }, [center, map]);

    return null;
};

const TrackDeliveryPage = () => {
   console.log("TrackDeliveryPage Loaded");
const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
console.log("Full location:", location);
console.log("location.state:", location.state);
console.log("ngoId from state:", location.state?.ngoId);
const ngoId = location.state?.ngoId;
console.log("Received ngoId:", ngoId);
console.log("location.state:", location.state);
console.log("ngoId:", ngoId);
  const dispatch = useAppDispatch();
  const [proof, setProof] = useState(null);
  const [confirming, setConfirming] = useState(false);
  const history = useAppSelector(selectTrackingHistory(id));
  const eta = useAppSelector(selectTrackingETA(id));
  const live = useAppSelector(selectLiveLocation(id));
  const status = useAppSelector(s => s.tracking.status);
console.log("Delivery ID:", id);
console.log("Location state:", location.state);
console.log("NGO ID:", ngoId);
 
useEffect(() => {
    if (!ngoId) {
        return;
    }
    dispatch(fetchTrackingHistory(id));
    dispatch(fetchCurrentETA(id));

    const socket = connectSocket();
  
    const handleConnect = () => {
    console.log("SOCKET CONNECTED");
    console.log("Socket ID:", socket.id);
    console.log("Joining:", `ngo_${ngoId}`);

    socket.emit("join", `ngo_${ngoId}`);
};
const handleLocationUpdate = (data) => {
    dispatch(setLiveLocationFromSocket(data));
    dispatch(fetchCurrentETA(id));
};
socket.on("connect", handleConnect);
if (socket.connected) {
    console.log("Already connected");
    console.log("Joining:", `ngo_${ngoId}`);

    socket.emit("join", `ngo_${ngoId}`);
}
   
socket.on("location_updated", handleLocationUpdate);
socket.on("proof_uploaded", (data) => {

    if (data.deliveryId !== id) return;

    setProof(data);

});
    
return () => {
socket.off("connect",handleConnect);
socket.off("location_updated",handleLocationUpdate);
socket.off("proof_uploaded");
};
}, [ngoId, id, dispatch]);


  useEffect(() => {
  console.log("Tracking History:", history);
}, [history]);

useEffect(() => {
  console.log("Live Location:", live);
}, [live]);

  // Build route polyline from history
const routePoints =
live?.route?.geometry?.map(([lng, lat]) => [lat, lng]) || [];
  // Live volunteer position
 const livePos =live
        ? [live.latitude, live.longitude]
        : routePoints.length > 0
        ? routePoints[routePoints.length - 1]
        : null;
console.log("Marker Position:", livePos);
  const defaultCenter = livePos || [20.5937, 78.9629];
 
  return (
    <div>
      <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-primary-600 mb-5">
        <FiArrowLeft size={16} /> Back to Deliveries
      </button>
      <h1 className="section-title mb-2">Live Delivery Tracking</h1>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">Delivery ID: {id}</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Map */}
        <div className="lg:col-span-2 h-96 lg:h-[500px] rounded-2xl overflow-hidden card">
          <MapContainer
    key={id}
    center={defaultCenter}
    zoom={12}
    style={{ height: "100%", width: "100%" }}
>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {livePos && (
              <>
                {livePos && <MapFlyTo center={livePos} />}
                <Marker   key={`${livePos?.[0]}-${livePos?.[1]}`}
    position={livePos} icon={liveIcon}>
                  <Popup>Volunteer&apos;s current location</Popup>
                </Marker>
              </>
            )}
            {routePoints.length > 1 && (
              <Polyline positions={routePoints} color="#f97316" weight={4} opacity={0.8} />
            )}
          </MapContainer>
        </div>

        {/* Side panel */}
        <div className="space-y-4">
          {/* ETA card */}
          <div className="card p-5">
            <h3 className="font-display font-bold text-slate-800 dark:text-slate-100 mb-3">ETA & Distance</h3>
            {eta ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-950/30 flex items-center justify-center">
                    <FiClock size={18} className="text-primary-500" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Estimated Time</p>
                    <p className="font-bold text-slate-900 dark:text-white">
                    {eta?.eta || "0 min"} 
                  </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent-50 dark:bg-accent-950/30 flex items-center justify-center">
                    <FiNavigation size={18} className="text-accent-500" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Distance Remaining</p>
                    <p className="font-bold text-slate-900 dark:text-white">
                  { eta?.distance || "0 km"}
                   </p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-400">Waiting for volunteer location…</p>
            )}
          </div>

          {/* Location history */}
          <div className="card p-5">
            <h3 className="font-display font-bold text-slate-800 dark:text-slate-100 mb-3">
              Location History ({history.length})
            </h3>
            {status === "loading" && <SectionLoader label="Loading history…" />}
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {history
  .slice()
  .reverse()
  .map((h, i) => {
    const latitude =
      h.latitude ??
      h.coordinates?.[1];

    const longitude =
      h.longitude ??
      h.coordinates?.[0];

    const time =
      h.timestamp ??
      h.recordedAt ??
      h.createdAt;

    return (
      <div
        key={i}
        className="flex items-center gap-3 text-sm"
      >
        <div className="w-2 h-2 rounded-full bg-primary-400 shrink-0" />

        <div className="flex-1 min-w-0">

          <div className="text-slate-700 dark:text-slate-200">
            <strong>Lat:</strong> {latitude?.toFixed?.(6) ?? latitude}
          </div>

          <div className="text-slate-700 dark:text-slate-200">
            <strong>Lng:</strong> {longitude?.toFixed?.(6) ?? longitude}
          </div>

          <p className="text-xs text-slate-400">
            {formatRelativeTime(time)}
          </p>

        </div>
      </div>
    );
  })} 
              {history.length === 0 && status !== "loading" && (
                <p className="text-sm text-slate-400">No location updates yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
 };

export default TrackDeliveryPage;
