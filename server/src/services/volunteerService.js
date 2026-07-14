import volunteerRepository
from "../repositories/volunteerRepository.js";

class VolunteerService {

  createProfile(data) {

    return volunteerRepository.create(
      data
    );

  }

  getProfile(userId) {

    return volunteerRepository.findByUser(
      userId
    );

  }

}

export default new VolunteerService();