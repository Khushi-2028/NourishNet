const deliveryWorkflow = {

  assigned: [
    "accepted_by_volunteer"
  ],

  accepted_by_volunteer: [
    "picked_up"
  ],

  picked_up: [
    "in_transit"
  ],

  in_transit: [
    "delivered"
  ],

  delivered: []

};

export default deliveryWorkflow;