import cron from "node-cron";
import Donation from "../models/Donation.js";

cron.schedule(

"*/5 * * * *",

async()=>{

const cutoff=
new Date(
Date.now()-30*60*1000
);

await Donation.updateMany(

{
reserved:true,
status:"accepted",
reservedAt:{
$lte:cutoff
}
},

{
reserved:false,
reservedAt:null,
status:"available",
acceptedByNgo:null
}

);

console.log(
"Expired reservations released"
);

}

);