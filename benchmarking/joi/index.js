import Joi from 'joi';
import BaseTypeData from "../baseTypeData/index.js";

    /**
     * 
     *  TYPES 
     * 
     */

    // Define Joi Schemas
    const JoiPickup = Joi.object({
        position: BaseTypeData.POSITION,
        make: Joi.string().min(1).required(),
        model: Joi.string().min(1).required(),
        color: Joi.string().min(1).required(),
        coil: BaseTypeData.COIL,
        magnet: BaseTypeData.MAGNET,
        circuit: BaseTypeData.CIRCUIT
    });

    const JoiGuitar = Joi.object({
        make: Joi.string().min(1).required(),
        model: Joi.string().min(1).required(),
        color: Joi.string().min(1).required(),
        year: Joi.number().integer().min(0).required(),
        pickups: Joi.array().items(JoiPickup).required()
    });

    /**
     * 
     *  Support Functions
     * 
     */

    const initJoi = (guitars) => guitars.map(({make, model, color, year, pickups}) => {
        const { error, value } = JoiGuitar.validate({
            make, model, color, year, pickups: pickups.map((pickup) => {
                const { error: pickupError, value: pickupValue } = JoiPickup.validate(pickup);
                if (pickupError) throw new Error(pickupError);
                return pickupValue;
            })
        });
        if (error) throw new Error(error);
        return value;
    });

export {
    JoiPickup,
    JoiGuitar,
    initJoi
}
