export const emitDashboardRefresh = (
    io,
    ngoId
) => {

    io.to(
        `ngo_${ngoId}`
    ).emit(
        "dashboard_refresh"
    );

};

export const emitNotification = (
    io,
    userId,
    notification
) => {

    io.to(
        `user_${userId}`
    ).emit(
        "new_notification",
        notification
    );

};

export const emitDeliveryCompleted = (
    io,
    ngoId,
    delivery
) => {

    io.to(
        `ngo_${ngoId}`
    ).emit(
        "delivery_completed",
        delivery
    );

};

export const emitLocationUpdated = (
    io,
    ngoId,
    data
) => {
     const room = `ngo_${ngoId}`;

    console.log("================================");
    console.log("EMITTING LOCATION UPDATE");
    console.log("Room:", room);

    console.log("All adapter rooms:");
console.log([...io.sockets.adapter.rooms.entries()]);

const clients = io.sockets.adapter.rooms.get(room);

console.log("Clients in target room:");
console.log(clients);

    console.log("================================");

    io.to(room).emit("location_updated", data);
    console.log("LOCATION UPDATE EMITTED");
console.log(data);
console.log("================================");
};