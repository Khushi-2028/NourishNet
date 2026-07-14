import { useEffect ,useMemo} from "react";
import { useParams, useNavigate,useLocation, } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import TrackingMap from "../../components/maps/TrackingMap";
import { connectSocket, joinRoom } from "../../socket/socket";
import {
  fetchTrackingData,
  updateVolunteerLocation,
  selectTrackingDelivery,
  selectTrackingRoute,
  selectTrackingLoading,
  selectTrackingETA,
  selectTrackingDistance,selectLocationHistory,
} from "../../features/tracking/ngoTrackingSlice";
const DeliveryTrackingPage = () => {
  console.log("DeliveryTrackingPage Loaded");
  const { deliveryId } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const delivery = useAppSelector(selectTrackingDelivery);
  const routePoints = useAppSelector(selectTrackingRoute);
  const loading = useAppSelector(selectTrackingLoading);
  const eta = useAppSelector(selectTrackingETA);
  const history = useAppSelector(selectLocationHistory);

const distance = useAppSelector(
  selectTrackingDistance
);

  const location = useLocation();
  const ngoId = location.state?.ngoId;
  useEffect(() => {
  dispatch(fetchTrackingData(deliveryId));
}, [dispatch, deliveryId]);

useEffect(() => {

  if (!delivery?.ngoId?._id) return;

  const socket = connectSocket();

  joinRoom(`ngo_${delivery.ngoId._id}`);

  socket.on("location_updated", (payload) => {

    if (payload.deliveryId !== delivery._id) return;

    dispatch(
      updateVolunteerLocation(payload)
    );

  });

  return () => {

    socket.off("location_updated");

  };

}, [delivery, dispatch]);

  if (loading || !delivery) {
    return (
      <div className="flex items-center justify-center h-[500px]">
        Loading tracking...
      </div>
    );
  }

  const pickupCoords =
    delivery.pickupLocation?.coordinates;

  const volunteerCoords =
    delivery.currentLocation?.coordinates;

  const destinationCoords =
    delivery.destinationLocation?.coordinates;
   

  return (
    <div className="space-y-6">

      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-sm"
      >
        <FiArrowLeft />
        Back
      </button>

      <div className="card p-5">

        <h2 className="text-2xl font-bold mb-2">
          Live Delivery Tracking
        </h2>

        <p>
          Delivery ID:
          <span className="font-semibold ml-2">
            {delivery._id}
          </span>
        </p>

        <p>
          Status:
          <span className="font-semibold ml-2">
            {delivery.status}
          </span>
        </p>
        <div className="grid grid-cols-2 gap-4 mt-5">

  <div className="rounded-xl bg-slate-100 p-4">

    <p className="text-xs text-slate-500">
      ETA
    </p>

    <h3 className="text-xl font-bold">

      {eta || "--"}

    </h3>
   

  </div>

  <div className="rounded-xl bg-slate-100 p-4">

    <p className="text-xs text-slate-500">

      Remaining Distance

    </p>

    <h3 className="text-xl font-bold">

      {distance || "--"}

    </h3>

  </div>

</div>
<div className="card p-5">

<h3 className="font-bold mb-4">

Delivery Progress

</h3>

<div className="space-y-3">

{[
"assigned",
"accepted_by_volunteer",
"picked_up",
"in_transit",
"delivered"
].map((status,index)=>(

<div
key={status}
className="flex items-center gap-3"
>

<div
className={`w-4 h-4 rounded-full ${
delivery.status===status
? "bg-green-500"
: "bg-slate-300"
}`}
/>

<span>

{status.replaceAll("_"," ")}

</span>

</div>

))}

</div>

</div>

      </div>
<div className="card p-5">

    <h3 className="font-bold mb-4">

        Location History

    </h3>

    {history.length === 0 ? (

        <p>No location updates yet.</p>

    ) : (

        history.map((point, index) => (

            <div
                key={index}
                className="border-b py-2"
            >
                <div>

                    Latitude: {point.latitude}

                </div>

                <div>

                    Longitude: {point.longitude}

                </div>

                <div className="text-xs text-gray-500">

                    {new Date(point.timestamp).toLocaleString()}

                </div>

            </div>

        ))

    )}

</div>
  

      <div
        className="rounded-xl overflow-hidden border"
        style={{ height: "550px" }}
      >
        <TrackingMap

key={delivery.currentLocation?.coordinates?.join(",")}
          pickupCoords={pickupCoords}
          volunteerCoords={volunteerCoords}
          destinationCoords={destinationCoords}
          routePoints={routePoints}
        />
      </div>

    </div>
  );
};

export default DeliveryTrackingPage;