import { useState,useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiUser, FiInfo } from "react-icons/fi";
import toast from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { assignVolunteerToPickup, selectDeliveriesMutationStatus } from "../../features/deliveries/deliveriesSlice";
import PageHeader from "../../components/common/PageHeader";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Select from "../../components/common/Select";
import {
    fetchAvailableVolunteers,
    selectAvailableVolunteers
} from "../../features/volunteers/volunteersSlice";

const AssignVolunteerPage = () => {
  const { id } = useParams(); // pickup request ID
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const mutStatus = useAppSelector(selectDeliveriesMutationStatus);
  const availableVolunteers =useAppSelector(selectAvailableVolunteers);
const [search,setSearch]=useState("");
  const [selectedVolunteer, setSelectedVolunteer] = useState("");
const [manualVolunteerId, setManualVolunteerId] = useState("");
const filteredVolunteers = availableVolunteers.filter((v) =>
  v.userId?.name
    ?.toLowerCase()
    .includes(search.toLowerCase())
);
useEffect(() => {
    dispatch(fetchAvailableVolunteers());
}, [dispatch]);
  const onSubmit = async () => {

  // Use dropdown value first, otherwise use manually entered ID
  const volunteerId = selectedVolunteer || manualVolunteerId;

  if (!volunteerId) {
    toast.error("Please select a volunteer or enter Volunteer ID.");
    return;
  }

  const result = await dispatch(
    assignVolunteerToPickup({
      pickupId: id,
      volunteerId,
    })
  );

  if (assignVolunteerToPickup.fulfilled.match(result)) {
    toast.success("Volunteer assigned!");
    navigate("/ngo/deliveries");
  } else {
    toast.error(result.payload || "Failed to assign volunteer");
  }
};
  
  return (
    <div>
      <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-primary-600 mb-5">
        <FiArrowLeft size={16} /> Back
      </button>
      <PageHeader title="Assign Volunteer" description="Enter the volunteer's ID to assign them to this pickup." />

      <div className="card p-6 max-w-md">
        {/* Backend limitation notice */}
        <div className="flex gap-3 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 mb-6">
          <FiInfo size={18} className="text-amber-600 shrink-0 mt-0.5" />
          <div className="text-sm text-amber-700 dark:text-amber-300">
            <p className="font-semibold mb-0.5">Volunteer Selection</p>
            <p>Enter the registered volunteer ID to assign this delivery.</p>
          </div>
        </div>

        <form
onSubmit={(e)=>{
e.preventDefault();
onSubmit();
}}
className="space-y-4"
>
<Input

label="Search Volunteer"

placeholder="Rahul"

value={search}

onChange={(e)=>setSearch(e.target.value)}

/>     
 <Select
  label="Available Volunteers"
  value={selectedVolunteer}
  onChange={(e) => {
    setSelectedVolunteer(e.target.value);
    setManualVolunteerId(e.target.value);
  }}
  
    options={filteredVolunteers.map((v) => ({
      value: v._id,
      label: `${v.userId?.name || "Unknown"} • ${v.vehicleType} 
      • ⭐ ${v.rating} • ${v.completedDeliveries} deliveries`,
    }))}
 />   
<div className="space-y-3 max-h-80 overflow-y-auto"> 
{
filteredVolunteers.map((v) => (

<div
key={v._id}
className={`border rounded-lg p-4 cursor-pointer ${
selectedVolunteer===v._id
?"border-green-500 bg-green-50"
:"border-gray-300"
}`}
>

<h3>{v.userId?.name}</h3>
<p>Vehicle : {v.vehicleType}</p>

<p>Rating : ⭐ {v.rating}</p>

<p>Completed : {v.completedDeliveries}</p>

<p>Phone : {v.phone}</p>

<p className="text-xs text-slate-500">
ID : {v._id}
</p>

<p>
Status :
<span className="text-green-600 ml-1">
Available
</span>
</p>

<Button
    size="sm"
    onClick={()=>{
        setSelectedVolunteer(v._id);
        setManualVolunteerId(v._id);
    }}
>
    Select
</Button>


</div>
))
}
</div>
{/* OR Divider */}
  <div className="text-center text-slate-400 font-semibold">
    OR
  </div>

  {/* Manual Volunteer ID */}
  <Input
    label="Volunteer ID"
    placeholder="Enter Volunteer ID manually"
    value={manualVolunteerId}
    onChange={(e) => setManualVolunteerId(e.target.value)}
  />
          <div className="flex gap-3 pt-2">
            <Button type="submit" loading={mutStatus === "loading"}>Assign Volunteer</Button>
            <Button type="button" variant="ghost" onClick={() => navigate(-1)}>Cancel</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignVolunteerPage;
