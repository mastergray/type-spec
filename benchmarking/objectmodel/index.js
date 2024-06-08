import { ObjectModel, ArrayModel } from "objectmodel";
import BaseTypeData from "../baseTypeData/index.js";

/**
 * 
 *  TYPES 
 * 
 */

// Define Pickup Type using ObjectModel:
const PickupModel = ObjectModel({
    position: BaseTypeData.POSITION,
    make: String,
    model: String,
    color: String,
    coil: BaseTypeData.COIL,
    magnet: BaseTypeData.MAGNET,
    circuit: BaseTypeData.CIRCUIT
}).assert(
    pickup => typeof pickup.make === 'string' && pickup.make.trim().length > 0,
    pickup => typeof pickup.model === 'string' && pickup.model.trim().length > 0,
    pickup => typeof pickup.color === 'string' && pickup.color.trim().length > 0
);

// Define Guitar Type using ObjectModel:
const GuitarModel = ObjectModel({
    make: String,
    model: String,
    color: String,
    year: Number,
    pickups: ArrayModel(PickupModel)
}).assert(
    guitar => typeof guitar.make === 'string' && guitar.make.trim().length > 0,
    guitar => typeof guitar.model === 'string' && guitar.model.trim().length > 0,
    guitar => typeof guitar.color === 'string' && guitar.color.trim().length > 0,
    guitar => Number.isInteger(guitar.year) && guitar.year >= 0
);

/**
 * 
 *  Support Functions
 * 
 */

const initObjectModel = (guitars) => guitars.map(({ make, model, color, year, pickups }) => {
    return new GuitarModel({
        make,
        model,
        color,
        year,
        pickups: pickups.map(pickup => new PickupModel(pickup))
    });
});

export {
    PickupModel,
    GuitarModel,
    initObjectModel
};
