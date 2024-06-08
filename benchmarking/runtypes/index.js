import { Record, String, Number, Array, Literal, Union } from 'runtypes';
import BaseTypeData from "../baseTypeData/index.js";

/**
 * 
 *  TYPES 
 * 
 */

// Define Runtypes Schemas
const PositionSchema = Union(...BaseTypeData.POSITION.map(pos => Literal(pos)));
const CoilSchema = Union(...BaseTypeData.COIL.map(coil => Literal(coil)));
const MagnetSchema = Union(...BaseTypeData.MAGNET.map(magnet => Literal(magnet)));
const CircuitSchema = Union(...BaseTypeData.CIRCUIT.map(circuit => Literal(circuit)));

const RuntypesPickup = Record({
    position: PositionSchema,
    make: String,
    model: String,
    color: String,
    coil: CoilSchema,
    magnet: MagnetSchema,
    circuit: CircuitSchema
});

const RuntypesGuitar = Record({
    make: String,
    model: String,
    color: String,
    year: Number.withConstraint(n => Number.isInteger(n) && n >= 0 || `${n} is not a valid year`),
    pickups: Array(RuntypesPickup)
});

/**
 * 
 *  Support Functions
 * 
 */

const initRuntypes = (guitars) => guitars.map(({ make, model, color, year, pickups }) => {
    try {
        const validGuitar = RuntypesGuitar.check({
            make, model, color, year, pickups
        });
        return validGuitar;
    } catch (error) {
        throw new Error(`Validation error: ${error.details.map(e => e.message).join(", ")}`);
    }
});

export {
    RuntypesPickup,
    RuntypesGuitar,
    initRuntypes
};
