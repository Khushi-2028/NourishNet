import adminRepository from "../repositories/adminRepository.js";
import {generatePDF,generateExcel,
        generateCSV} from "../utils/reportGenerator.js";
/*
=========================================
REPORT DATA FORMATTER
=========================================
*/

const formatReportData = (records, type) => {

    return records.map((record, index) => {

        if (type === "donation") {

            return {

                "S.No": index + 1,

                "Donation ID": record._id?.toString(),

                "Title": record.title,

                "Description": record.description,

                "Food Type": record.foodType,

                "Quantity": `${record.quantity} ${record.unit || "kg"}`,

                "Status": record.status,

                "Quality": record.qualityStatus,

                "Donor Name": record.donorId?.name || "-",

                "Donor Email": record.donorId?.email || "-",

                "Preparation Time": record.preparationTime
                    ? new Date(record.preparationTime).toLocaleString()
                    : "-",

                "Expiry Time": record.expiryTime
                    ? new Date(record.expiryTime).toLocaleString()
                    : "-",

                "Pickup Address": record.pickupAddress || "-",

                "Pickup Latitude":
                    record.pickupLocation?.latitude ?? "-",

                "Pickup Longitude":
                    record.pickupLocation?.longitude ?? "-",

                "Created":
                    new Date(record.createdAt).toLocaleString(),

                "Image":
                    record.images?.length
                        ? record.images[0]
                        : "No Image",

                /*
                Used only by PDF
                */

                imagePath:
                    record.images?.length
                        ? record.images[0]
                        : null

            };

        }

        return {

            "S.No": index + 1,

            "Delivery ID": record._id?.toString(),

            "Donation Title":
                record.donationId?.title || "-",

            "Donor":
                record.donationId?.donorId?.name || "-",

            "Volunteer":
                record.volunteerId?.userId?.name || "-",

            "NGO":
                record.ngoId?.userId?.name || "-",

            "Status":
                record.status,

            "Pickup Time":
                record.pickupTime
                    ? new Date(record.pickupTime).toLocaleString()
                    : "-",

            "Delivery Time":
                record.deliveryTime
                    ? new Date(record.deliveryTime).toLocaleString()
                    : "-",

            "Pickup Latitude":
                record.pickupLocation?.coordinates?.[1] ?? "-",

            "Pickup Longitude":
                record.pickupLocation?.coordinates?.[0] ?? "-",

            "Current Latitude":
                record.currentLocation?.coordinates?.[1] ?? "-",

            "Current Longitude":
                record.currentLocation?.coordinates?.[0] ?? "-",

            "Destination Latitude":
                record.destinationLocation?.coordinates?.[1] ?? "-",

            "Destination Longitude":
                record.destinationLocation?.coordinates?.[0] ?? "-",

            "Proof Notes":
                record.proofNotes || "-",

            "Confirmed At":
                record.confirmedAt
                    ? new Date(record.confirmedAt).toLocaleString()
                    : "-",

            imagePath:
                record.proofImage || null

        };

    });

};


        class AdminService {
//Dashboard
async getDashboard() {
return await adminRepository.getDashboardStats();}

//Get All Users
async getUsers(search, role, page, limit) {
return await adminRepository.getUsers(
search,role,page, limit);}

//Get User By Id
async getUserById(id) {
return await adminRepository.getUserById(id);}

//Update User
async updateUser(id, data) {
return await adminRepository.updateUser(
id, data);}

//Delete User
async deleteUser(id) {
return await adminRepository.deleteUser(id);}

//Get All NGOs
async getNGOs() {
return await adminRepository.getNGOs();}

//Get NGO By Id
async getNGOById(id) {
return await adminRepository.getNGOById(id);}

//Approve NGO
async approveNGO(id) {
return await adminRepository.approveNGO(id);}

//Reject NGO
async rejectNGO(id) {
 return await adminRepository.rejectNGO(id);}

//Get All Volunteers
async getVolunteers() {
return await adminRepository.getVolunteers();}

/*
=========================================
Get Volunteer By Id
=========================================
*/
async getVolunteerById(id) {

    return await adminRepository.getVolunteerById(id);

}
/*
=========================================
Get All Donations
=========================================
*/

async getDonations() {

    return await adminRepository.getDonations();

}

/*
=========================================
Get Donation By Id
=========================================
*/

async getDonationById(id) {

    return await adminRepository.getDonationById(id);

}

/*
=========================================
Delete Donation
=========================================
*/

async deleteDonation(id) {

    return await adminRepository.deleteDonation(id);

}
/*
=========================================
Get All Deliveries
=========================================
*/

async getDeliveries() {

    return await adminRepository.getDeliveries();

}

/*
=========================================
Get Delivery By Id
=========================================
*/

async getDeliveryById(id) {

    return await adminRepository.getDeliveryById(id);

}
/*
=========================================
Audit Logs
=========================================
*/

async getAuditLogs(filters) {

    return await adminRepository.getAuditLogs(filters);

}
/*
=========================================
Analytics
=========================================
*/

async getAnalytics() {

    return await adminRepository.getAnalytics();

}
/*
=========================================
Environmental Impact
=========================================
*/

async getEnvironmentalImpact() {

    return await adminRepository.getEnvironmentalImpact();

}
/*
====================================
Generate Donation Report
====================================
*/
async generateDonationReport(format) {

    const donations = await adminRepository.donationReport();

    const data = formatReportData(
        donations,
        "donation"
    );

    if (format === "pdf")
        return await generatePDF(
            data,
            "Donation Report"
        );

    if (format === "excel")
        return await generateExcel(data);

    if (format === "csv")
        return generateCSV(data);

}


/*
====================================
Generate Delivery Report
====================================
*/

async generateDeliveryReport(format) {

    const deliveries =
        await adminRepository.deliveryReport();

    const data = formatReportData(
        deliveries,
        "delivery"
    );
console.log(data[0]);
    if (format === "pdf")
        return await generatePDF(
            data,
            "Delivery Report"
        );

    if (format === "excel")
        return await generateExcel(data);

    if (format === "csv")
        return generateCSV(data);

}
        }export default new AdminService();