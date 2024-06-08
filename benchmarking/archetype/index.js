import Archetype from 'archetype';
import BaseTypeData from "../baseTypeData/index.js";

// Enum values as arrays
const POSITION_VALUES = BaseTypeData.POSITION;
const COIL_VALUES = BaseTypeData.COIL;
const MAGNET_VALUES = BaseTypeData.MAGNET;
const CIRCUIT_VALUES = BaseTypeData.CIRCUIT;

/**
 * 
 *  TYPES 
 * 
 */

// Define Type:
const ArchetypePickup = new Archetype({
    position: { $type: String, enum: POSITION_VALUES, required: true },
    make: { $type: String, required: true },
    model: { $type: String, required: true },
    color: { $type: String, required: true },
    coil: { $type: String, enum: COIL_VALUES, required: true },
    magnet: { $type: String, enum: MAGNET_VALUES, required: true },
    circuit: { $type: String, enum: CIRCUIT_VALUES, required: true }
}).compile('Pickup');

const ArchetypeGuitar = new Archetype({
    make: { $type: String, required: true },
    model: { $type: String, required: true },
    color: { $type: String, required: true },
    year: { $type: Number, required: true },
    pickups: { $type: [ArchetypePickup], required: true }
}).compile('Guitar');

/**
 * 
 *  Support Functions
 * 
 */

const initArchetype = (guitars) => guitars.map((guitar) => {
    try {
        return new ArchetypeGuitar(guitar);
    } catch (error) {
        throw new Error(`Validation error: ${error.message}`);
    }
});

export {
    ArchetypePickup,
    ArchetypeGuitar,
    initArchetype
};