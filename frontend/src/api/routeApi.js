import axios from "axios";

export const getRoute = async (start, end) => {
  const url = `https://router.project-osrm.org/route/v1/driving/${start[0]},${start[1]};${end[0]},${end[1]}`;

  const { data } = await axios.get(url, {
    params: {
      overview: "full",
      geometries: "geojson",
    },
  });

  return data;
};