import BaseTypeData from "../baseTypeData/index.js";
import TypeSpec from "../../src/index.js";

    /**
     * 
     *  TYPES 
     * 
     */

    // Define Type:
    const TypeSpecBuildPickup = TypeSpec.init("Pickup")
        .prop("position", BaseTypeData.POSITION)
        .prop("make", TypeSpec.NONEMPTY_STRING)
        .prop("model", TypeSpec.NONEMPTY_STRING)
        .prop("color", TypeSpec.NONEMPTY_STRING)
        .prop("coil", BaseTypeData.COIL)
        .prop("magnet", BaseTypeData.MAGNET)
        .prop("circuit", BaseTypeData.CIRCUIT)
        .build();


    // Define Type:
    const TypeSpecBuildGuitar = TypeSpec.init("Guitar")
        .prop("make", TypeSpec.NONEMPTY_STRING)
        .prop("model", TypeSpec.NONEMPTY_STRING)
        .prop("color", TypeSpec.NONEMPTY_STRING)
        .prop("year", TypeSpec.UNSIGNED_INT)
        .prop("pickups", TypeSpec.ARRAY_OF(TypeSpecBuildPickup))
        .build();

    /**
     * 
     *  Support Functions
     * 
     */

    const initTypeSpecBuild = (guitars) => guitars.map(({make, model, color, year, pickups}) => {
        return TypeSpecBuildGuitar.create({
            make, model, color, year, pickups:pickups.map((pickup) => TypeSpecBuildPickup.create(pickup))
        })
    })

export {
    TypeSpecBuildPickup,
    TypeSpecBuildGuitar,
    initTypeSpecBuild
}

