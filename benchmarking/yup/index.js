import * as yup from 'yup';
import BaseTypeData from "../baseTypeData/index.js";

/**
 * 
 *  TYPES 
 * 
 */

// Define Yup Schemas
const PositionSchema = yup.string().oneOf(BaseTypeData.POSITION).required();
const CoilSchema = yup.string().oneOf(BaseTypeData.COIL).required();
const MagnetSchema = yup.string().oneOf(BaseTypeData.MAGNET).required();
const CircuitSchema = yup.string().oneOf(BaseTypeData.CIRCUIT).required();

const YupPickup = yup.object().shape({
    position: PositionSchema,
    make: yup.string().required(),
    model: yup.string().required(),
    color: yup.string().required(),
    coil: CoilSchema,
    magnet: MagnetSchema,
    circuit: CircuitSchema
});

const YupGuitar = yup.object().shape({
    make: yup.string().required(),
    model: yup.string().required(),
    color: yup.string().required(),
    year: yup.number().integer().min(0).required(),
    pickups: yup.array().of(YupPickup).required()
});

/**
 * 
 *  Support Functions
 * 
 */

const initYup = (guitars) => guitars.map(({ make, model, color, year, pickups }) => {
    try {
        const validGuitar = YupGuitar.validateSync({
            make, model, color, year, pickups
        }, { abortEarly: false });
        return validGuitar;
    } catch (error) {
        throw new Error(`Validation error: ${error.errors}`);
    }
});

export {
    YupPickup,
    YupGuitar,
    initYup
};
