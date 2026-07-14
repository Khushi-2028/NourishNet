import NGO from "../models/NGO.js";

class NGORepository {

  create(data) {
    return NGO.create(data);
  }

  findByUser(userId) {
    return NGO.findOne({ userId });
  }

}

export default new NGORepository();