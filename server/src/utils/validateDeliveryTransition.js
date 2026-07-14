import deliveryWorkflow 
from "./deliveryWorkflow.js";

const validateTransition = (
  currentStatus,
  nextStatus
) => {

  const allowed =
    deliveryWorkflow[currentStatus];

  return allowed.includes(
    nextStatus
  );

};

export default validateTransition;