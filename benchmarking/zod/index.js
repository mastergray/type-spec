import { z } from 'zod';
import BaseTypeData from "../baseTypeData/index.js";

/**
 * 
 *  TYPES 
 * 
 */

// Define Zod Schemas
const PositionSchema = z.enum(BaseTypeData.POSITION);
const CoilSchema = z.enum(BaseTypeData.COIL);
const MagnetSchema = z.enum(BaseTypeData.MAGNET);
const CircuitSchema = z.enum(BaseTypeData.CIRCUIT);

const ZodPickup = z.object({
    position: PositionSchema,
    make: z.string().min(1),
    model: z.string().min(1),
    color: z.string().min(1),
    coil: CoilSchema,
    magnet: MagnetSchema,
    circuit: CircuitSchema
});

const ZodGuitar = z.object({
    make: z.string().min(1),
    model: z.string().min(1),
    color: z.string().min(1),
    year: z.number().int().nonnegative(),
    pickups: z.array(ZodPickup)
});

/**
 * 
 *  Support Functions
 * 
 */

const initZod = (guitars) => guitars.map(({ make, model, color, year, pickups }) => {
    try {
        const validGuitar = ZodGuitar.parse({
            make, model, color, year, pickups
        });
        return validGuitar;
    } catch (error) {
        throw new Error(`Validation error: ${error.errors.map(e => e.message).join(", ")}`);
    }
});

export {
    ZodPickup,
    ZodGuitar,
    initZod
};
