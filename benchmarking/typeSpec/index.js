import BaseTypeData from "../baseTypeData/index.js";
import TypeSpec from "../../src/index.js";

    /**
     * 
     *  TYPES 
     * 
     */

    // Define Type:
    const TypeSpecPickup = TypeSpec.init("Pickup")
        .prop("position", BaseTypeData.POSITION)
        .prop("make", TypeSpec.NONEMPTY_STRING)
        .prop("model", TypeSpec.NONEMPTY_STRING)
        .prop("color", TypeSpec.NONEMPTY_STRING)
        .prop("coil", BaseTypeData.COIL)
        .prop("magnet", BaseTypeData.MAGNET)
        .prop("circuit", BaseTypeData.CIRCUIT);


    // Define Type:
    const TypeSpecGuitar = TypeSpec.init("Guitar")
        .prop("make", TypeSpec.NONEMPTY_STRING)
        .prop("model", TypeSpec.NONEMPTY_STRING)
        .prop("color", TypeSpec.NONEMPTY_STRING)
        .prop("year", TypeSpec.UNSIGNED_INT)
        .prop("pickups", TypeSpec.ARRAY_OF(TypeSpecPickup))

    /**
     * 
     *  Support Functions
     * 
     */

    const initTypeSpec = (guitars) => guitars.map(({make, model, color, year, pickups}) => {
        return TypeSpecGuitar.create({
            make, model, color, year, pickups:pickups.map((pickup) => TypeSpecPickup.create(pickup))
        })
    })

export {
    TypeSpecPickup,
    TypeSpecGuitar,
    initTypeSpec
}

