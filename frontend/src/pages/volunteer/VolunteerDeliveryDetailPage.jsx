import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiCheckCircle, FiMapPin, FiPackage} from "react-icons/fi";
import { Polyline } from "react-leaflet";
import { getRoute } from "../../api/routeApi";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
const pickupIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const volunteerIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const ngoIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});
import toast from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  fetchVolunteerActiveDeliveries, acceptDeliveryTask, pickupDeliveryFood,
  startDeliveryTransit, completeDeliveryTask, selectVolunteerActiveDeliveries,
  selectDeliveriesMutationStatus
} from "../../features/deliveries/deliveriesSlice";
import {
  updateLiveLocation,
  selectLiveLocation,
} from "../../features/tracking/trackingSlice";
import { DeliveryStatusBadge } from "../../components/common/StatusBadge";
import Button from "../../components/common/Button";
import { SectionLoader } from "../../components/common/Spinner";
import { DELIVERY_STATUS } from "../../utils/constants";
import { formatRelativeTime } from "../../utils/formatters";
import { motion } from "framer-motion";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png"
});

const NEXT_ACTION = {
  [DELIVERY_STATUS.ASSIGNED]: { label: "Accept Task", action: "accept", color: "secondary" },
  [DELIVERY_STATUS.ACCEPTED]: { label: "Mark Food Picked Up", action: "pickup", color: "primary" },
  [DELIVERY_STATUS.PICKED_UP]: { label: "Start Transit", action: "transit", color: "primary" },
  [DELIVERY_STATUS.IN_TRANSIT]: { label: "Complete Delivery", action: "complete", color: "accent" },
[DELIVERY_STATUS.AWAITING_CONFIRMATION]: {label:"Upload Proof",action:"upload",color:"primary"},
[DELIVERY_STATUS.DELIVERED]:null,
};

const STEPS = [
  { key: DELIVERY_STATUS.ASSIGNED, label: "Assigned" },
  { key: DELIVERY_STATUS.ACCEPTED, label: "Accepted" },
  { key: DELIVERY_STATUS.PICKED_UP, label: "Picked Up" },
  { key: DELIVERY_STATUS.IN_TRANSIT, label: "In Transit" },
 {key: "awaiting_confirmation",label: "Waiting NGO",},
  { key: DELIVERY_STATUS.DELIVERED, label: "Delivered" }
];

const VolunteerDeliveryDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const allDeliveries = useAppSelector(selectVolunteerActiveDeliveries);
  const mutStatus = useAppSelector(selectDeliveriesMutationStatus);
  const [trackingActive, setTrackingActive] = useState(false);
  const [routePoints, setRoutePoints] = useState([]);
  const watchIdRef = useRef(null);
  const volunteerMarkerRef = useRef(null);
  const lastPositionRef = useRef(null);
const delivery = allDeliveries.find(d => d._id === id);
console.log("ALL DELIVERIES");
console.log(allDeliveries);

console.log("CURRENT DELIVERY");
console.log(delivery);
const liveLocation = useAppSelector(selectLiveLocation(id));
// Volunteer
// Volunteer (prefer live tracking location)
const volunteerCoords =
  liveLocation?.currentLocation?.coordinates ||
  delivery?.currentLocation?.coordinates;
useEffect(() => {
  console.log("Volunteer Coordinates Changed:", volunteerCoords);
}, [volunteerCoords]);
useEffect(() => {
  if (
    volunteerMarkerRef.current &&
    volunteerCoords
  ) {
    volunteerMarkerRef.current.setLatLng([
      volunteerCoords[1],
      volunteerCoords[0],
    ]);
  }
}, [volunteerCoords]);
// Destination (NGO)
const destinationCoords = delivery?.destinationLocation?.coordinates;

// Pickup (temporary debugging)
const pickupCoords =
  delivery?.pickupLocation?.coordinates ||
  delivery?.pickupRequestId?.donationId?.pickupLocation?.coordinates;
 
console.log("pickupCoords:", pickupCoords);
console.log("delivery.pickupLocation:", delivery?.pickupLocation);
console.log(
  "donation pickupLocation:",
  delivery?.pickupRequestId?.donationId?.pickupLocation
);
console.log("Delivery:");
console.log(delivery);

console.log("Destination:");
console.log(delivery?.destinationLocation);

  useEffect(() => { dispatch(fetchVolunteerActiveDeliveries()); }, [dispatch]);
  
  // Auto-start location tracking when in transit
  useEffect(() => {
  if (delivery?.status === DELIVERY_STATUS.IN_TRANSIT) {
    startLocationTracking();
console.log("START LOCATION TRACKING");
    return () => stopLocationTracking();
  }
}, [delivery?.status]);

  const startLocationTracking = () => {
     if (watchIdRef.current) return;
    if (!navigator.geolocation) return;
    setTrackingActive(true);
   
   const send = async (pos) => {
 const latitude = pos.coords.latitude;
const longitude = pos.coords.longitude;
 if (lastPositionRef.current) {
const last = lastPositionRef.current;
const same =
 Math.abs(last.latitude - latitude) < 0.00002 &&
  Math.abs(last.longitude - longitude) < 0.00002;
 if (same) {return;}}
lastPositionRef.current = { latitude, longitude};
 console.log("Sending location...");
try {
 await dispatch(
updateLiveLocation({
deliveryId: id, latitude,longitude
 }) ).unwrap();}
catch (err) {
console.log("FAILED"); console.log(err);}};

   
    // Send once immediately, then watch
    navigator.geolocation.getCurrentPosition(
    send,
    () => {
        toast.error("Unable to access location.");
    }
);
    watchIdRef.current = navigator.geolocation.watchPosition(send,  () => {
        toast.error("Location tracking failed.");
    }, {
      enableHighAccuracy: true,
      maximumAge: 5000,
      timeout:15000
    });
  };

  const stopLocationTracking = () => {
    console.log("STOP LOCATION TRACKING");
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setTrackingActive(false);
  };

  const handleAction = async (action) => {
    let result;
    if (action === "accept") result = await dispatch(acceptDeliveryTask(id));
    else if (action === "pickup") result = await dispatch(pickupDeliveryFood(id));
    else if (action === "transit") {
      result = await dispatch(startDeliveryTransit(id));
      if (startDeliveryTransit.fulfilled.match(result)) startLocationTracking();
    }
    else if (action === "upload") {
    navigate(`/volunteer/upload-proof/${id}`);
    return;
}
    else if (action === "complete") {

    stopLocationTracking();

    result = await dispatch(
        completeDeliveryTask(id)
    );

    if (completeDeliveryTask.fulfilled.match(result)) {

        dispatch(fetchVolunteerActiveDeliveries());

        navigate(`/volunteer/upload-proof/${id}`);

        return;
    }
}

    if (result && (result.type?.endsWith("fulfilled"))) {
      toast.success("Status updated!");
      dispatch(fetchVolunteerActiveDeliveries());
      if (action === "complete") {navigate(`/volunteer/upload-proof/${id}`);}
    } else if (result) {
      toast.error(result.payload || "Action failed");
    }
  };
useEffect(() => {
  if (!volunteerCoords || !destinationCoords) return;
 console.log("Recalculating Route...");
  console.log("Volunteer:", volunteerCoords);
  console.log("Destination:", destinationCoords);

  const loadRoute = async () => {
    try {
      const data = await getRoute(
        volunteerCoords,
        destinationCoords
      );

      const coordinates = data.routes[0].geometry.coordinates;

      const latLngs = coordinates.map(([lng, lat]) => [
        lat,
        lng,
      ]);

      setRoutePoints(latLngs);
    } catch (err) {
      console.error(err);
    }
  };

  loadRoute();
}, [volunteerCoords, destinationCoords]);
useEffect(() => {
    return () => {
        stopLocationTracking();
    };
}, []);
if (!delivery && allDeliveries.length > 0) {
    return (
      <div className="text-center py-16">
        <p className="text-slate-500">Delivery not found or already completed.</p>
        <button onClick={() => navigate(-1)} className="btn-outline mt-4">Go Back</button>
      </div>
    );
  }
  if (!delivery) return <SectionLoader />;

const nextAction = NEXT_ACTION[delivery.status];
const currentStepIdx = STEPS.findIndex(s => s.key === delivery.status);
const mapCenter =volunteerCoords
    ? [volunteerCoords[1], volunteerCoords[0]]
    : pickupCoords
    ? [pickupCoords[1], pickupCoords[0]]
    : [20.5937, 78.9629];
console.log("Marker Position:", volunteerCoords);
  return (
    <div>
      <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-primary-600 mb-5">
        <FiArrowLeft size={16} /> Back to Deliveries
      </button>

      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="section-title">{delivery.pickupRequestId?.donationId?.title || "Delivery Task"}</h1>
          <p className="text-sm text-slate-500 mt-1">{formatRelativeTime(delivery.createdAt)}</p>
        </div>
        <DeliveryStatusBadge status={delivery.status} />
      </div>

      {/* Progress stepper */}
      <div className="card p-5 mb-5">
        <div className="flex items-center">
          {STEPS.map((step, i) => (
            <div key={step.key} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-1.5">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  i <= currentStepIdx
                    ? "bg-primary-500 text-white"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-400"
                }`}>
                  {i < currentStepIdx ? <FiCheckCircle size={16} /> : i + 1}
                </div>
                <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 text-center leading-tight w-14 sm:w-auto">
                  {step.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-1 mb-5 transition-colors ${
                  i < currentStepIdx ? "bg-primary-400" : "bg-slate-200 dark:bg-slate-700"
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Delivery info */}
        <div className="space-y-4">
          <div className="card p-5 space-y-4">
            <h3 className="font-display font-bold text-slate-800 dark:text-slate-100">Delivery Details</h3>
            <InfoRow icon={FiPackage} label="Food Item" value={delivery.pickupRequestId?.donationId?.title || "—"} />
            <InfoRow icon={FiMapPin} label="Pickup Address"
              value={delivery.pickupRequestId?.donationId?.pickupAddress || "—"} />
            <InfoRow icon={FiMapPin} label="Destination" value={delivery.destinationLocation?.address || "NGO Location"} />
          </div>

          {nextAction && (
            <motion.div initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }} className="card p-5">
              <h3 className="font-display font-bold text-slate-800 dark:text-slate-100 mb-3">Next Action</h3>
              {trackingActive && (
                <div className="flex items-center gap-2 text-xs font-medium text-accent-600 mb-3">
                  <div className="w-2 h-2 rounded-full bg-accent-500 animate-pulse" />
                  Live location tracking active
                </div>
              )}
              <Button
                variant={nextAction.color}
                loading={mutStatus === "loading"}
                onClick={() => handleAction(nextAction.action)}
                icon={FiCheckCircle}
                fullWidth
              >
                {nextAction.label}
              </Button>
            </motion.div>
          )}

          {delivery.status === DELIVERY_STATUS.DELIVERED && (
            <div className="card p-5 text-center">
              <FiCheckCircle size={36} className="text-accent-500 mx-auto mb-3" />
              <p className="font-display font-bold text-slate-900 dark:text-white">Delivery Completed!</p>
              <p className="text-sm text-slate-500 mt-1">Thank you for your contribution.</p>
            </div>
          )}
        </div>

        {/* Map */}
        <div className="h-72 lg:h-auto min-h-64 rounded-2xl overflow-hidden card">
          <MapContainer center={mapCenter} zoom={13} style={{ height: "100%", width: "100%", minHeight: "16rem" }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {pickupCoords && (
              <Marker position={[pickupCoords[1], pickupCoords[0]]} icon={pickupIcon}>
                <Popup>Pickup Location</Popup>
              </Marker>
            )}
{volunteerCoords && (<Marker 
 ref={volunteerMarkerRef}
 position={
  [ volunteerCoords[1],volunteerCoords[0],
    ]} icon={volunteerIcon}>
    <Popup>Volunteer</Popup>
  </Marker>
)}
{destinationCoords && (
  <Marker
    position={[
      destinationCoords[1],
      destinationCoords[0],
    ]} icon={ngoIcon}
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
        </div>
      </div>
    </div>
  );
};

const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3">
    <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center shrink-0 mt-0.5">
      <Icon size={14} className="text-primary-500" />
    </div>
    <div>
      <p className="text-xs text-slate-400 font-medium">{label}</p>
      <p className="text-sm text-slate-700 dark:text-slate-200">{value}</p>
    </div>
  </div>
);

export default VolunteerDeliveryDetailPage;
