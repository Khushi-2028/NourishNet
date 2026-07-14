import donationRepository
from "../repositories/donationRepository.js";

class DonationService {

  createDonation(data) {

    return donationRepository.create(
      data
    );

  }

  getDonation(id) {

    return donationRepository.findById(
      id
    );

  }

  updateDonation(
    id,
    data
  ) {

    return donationRepository.update(

      id,

      data

    );

  }

  deleteDonation(id) {

    return donationRepository.delete(
      id
    );

  }

  getAllDonations(

    filter,

    skip,

    limit

  ) {

    return donationRepository.findAll(

      filter,

      skip,

      limit

    );

  }

  countDonations(
    donorId
  ) {

    return donationRepository.countByDonor(
      donorId
    );

  }

  countDelivered(
    donorId
  ) {

    return donationRepository.countDelivered(
      donorId
    );

  }
  getFoodSaved(donorId) {
    return donationRepository.getFoodSaved(donorId);
}

}

export default new DonationService();