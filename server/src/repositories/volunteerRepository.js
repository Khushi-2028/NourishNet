import Volunteer
from "../models/Volunteer.js";

class VolunteerRepository {

  create(data) {

    return Volunteer.create(
      data
    );

  }

  findByUser(userId) {

    return Volunteer.findOne({
      userId
    });

  }

  update(id,data){

    return Volunteer.findByIdAndUpdate(
      id,
      data,
      {new:true}
    );

  }

}

export default new VolunteerRepository();