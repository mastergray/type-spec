import { object, string, number, array, enums, assert } from 'superstruct';
import BaseTypeData from "../baseTypeData/index.js";

/**
 * 
 *  TYPES 
 * 
 */

// Define Superstruct Schemas
const PositionSchema = enums(BaseTypeData.POSITION);
const CoilSchema = enums(BaseTypeData.COIL);
const MagnetSchema = enums(BaseTypeData.MAGNET);
const CircuitSchema = enums(BaseTypeData.CIRCUIT);

const SuperstructPickup = object({
    position: PositionSchema,
    make: string(),
    model: string(),
    color: string(),
    coil: CoilSchema,
    magnet: MagnetSchema,
    circuit: CircuitSchema
});

const SuperstructGuitar = object({
    make: string(),
    model: string(),
    color: string(),
    year: number(),
    pickups: array(SuperstructPickup)
});

/**
 * 
 *  Support Functions
 * 
 */

const initSuperstruct = (guitars) => guitars.map((guitar) => {
    try {
        assert(guitar, SuperstructGuitar);
        return guitar;
    } catch (error) {
        throw new Error(`Validation error: ${error.message}`);
    }
});

export {
    SuperstructPickup,
    SuperstructGuitar,
    initSuperstruct
};
