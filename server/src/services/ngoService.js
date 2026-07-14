import ngoRepository
from "../repositories/ngoRepository.js";

class NGOService {

  createProfile(data) {
    return ngoRepository.create(data);
  }

  getProfile(userId) {
    return ngoRepository.findByUser(userId);
  }

}

export default new NGOService();