import mapsService from "./mapsService.js";
import calculateETA from "../utils/calculateETA.js";

class RouteOptimizationService {

    /*
    =====================================
    Optimize Route
    =====================================
    */

    async optimizeRoute(origin, destination) {

        const route =
            await mapsService.getRoute(
                origin,
                destination
            );

        if (!route.routes.length) {

            throw new Error(
                "No route found."
            );

        }

        const bestRoute =
            route.routes[0];

        return {

            distanceMeters:
                bestRoute.distance,

            distanceKm:
                Number(
                    (
                        bestRoute.distance /
                        1000
                    ).toFixed(2)
                ),

            durationSeconds:
                bestRoute.duration,

            eta:
                calculateETA(
                    bestRoute.duration
                ),

            geometry:
                bestRoute.geometry.coordinates

        };

    }

}

export default
new RouteOptimizationService();