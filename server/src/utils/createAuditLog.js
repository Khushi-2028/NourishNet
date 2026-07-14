import AuditLog 
from "../models/AuditLog.js";

const createAuditLog = async (data) => {

  return await AuditLog.create(
    data
  );

};

export default createAuditLog;