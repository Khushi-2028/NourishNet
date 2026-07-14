import axios from "axios";
import OSRM_CONFIG from "../config/osrm.js";

class MapsService {

    /*
    ======================================
    Get Driving Route
    ======================================
    */

    async getRoute(origin, destination) {

        try {

            const url =

                `${OSRM_CONFIG.BASE_URL}/route/v1/${OSRM_CONFIG.PROFILE}/` +
                `${origin.longitude},${origin.latitude};` +
                `${destination.longitude},${destination.latitude}` +
                "?overview=full&geometries=geojson";

            const response = await axios.get(url);

            return response.data;

        }

        catch (error) {

    console.log("========== OSRM ERROR ==========");
    console.log(error.message);

    if (error.response) {
        console.log(error.response.status);
        console.log(error.response.data);
    }

    throw new Error("Unable to fetch route.");

}

    }

    /*
    ======================================
    Get Distance
    ======================================
    */

    async getDistance(origin, destination) {

        const route = await this.getRoute(origin, destination);

        if (!route.routes.length) {

            throw new Error("No route found.");

        }

        return route.routes[0].distance;

    }

    /*
    ======================================
    Get Duration
    ======================================
    */

    async getDuration(origin, destination) {

        const route = await this.getRoute(origin, destination);

        if (!route.routes.length) {

            throw new Error("No route found.");

        }

        return route.routes[0].duration;

    }

    /*
    ======================================
    Route Coordinates
    ======================================
    */

    async getCoordinates(origin, destination) {

        const route = await this.getRoute(origin, destination);

        if (!route.routes.length) {

            throw new Error("No route found.");

        }

        return route.routes[0].geometry.coordinates;

    }

}

export default new MapsService();