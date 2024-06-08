import t from 'tcomb';
import BaseTypeData from "../baseTypeData/index.js";

    /**
     * 
     *  TYPES 
     * 
     */

    // Define Type:
    const TcombPickup = t.struct({
        position: t.enums.of(BaseTypeData.POSITION),
        make: t.String,
        model: t.String,
        color: t.String,
        coil: t.enums.of(BaseTypeData.COIL),
        magnet: t.enums.of(BaseTypeData.MAGNET),
        circuit: t.enums.of(BaseTypeData.CIRCUIT)
    }, 'Pickup');

    // Define Type:
    const TcombGuitar = t.struct({
        make: t.String,
        model: t.String,
        color: t.String,
        year: t.Number,
        pickups: t.list(TcombPickup)
    }, 'Guitar');

    /**
     * 
     *  Support Functions
     * 
     */

    const initTcomb = (guitars) => guitars.map(({make, model, color, year, pickups}) => {
        return TcombGuitar({
            make, model, color, year, pickups:pickups.map((pickup) => TcombPickup(pickup))
        })
    })

export {
    TcombPickup,
    TcombGuitar,
    initTcomb
}
