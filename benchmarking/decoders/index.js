import * as D from 'decoders';
import BaseTypeData from "../baseTypeData/index.js";

/**
 * 
 *  TYPES 
 * 
 */

// Define Type:
const DecoderPickup = D.object({
  position: BaseTypeData.POSITION,
  make: D.string,
  model: D.string,
  color: D.string,
  coil: BaseTypeData.COIL,
  magnet: BaseTypeData.MAGNET,
  circuit: BaseTypeData.CIRCUIT
});

// Define Type:
const DecoderGuitar = D.object({
  make: D.string,
  model: D.string,
  color: D.string,
  year: D.number,
  pickups: D.array(DecoderPickup)
});

/**
 * 
 *  Support Functions
 * 
 */

const initDecoders = (guitars) => guitars.map((guitarData) => {
  const result = D.run(DecoderGuitar, guitarData);
  if (result.type === 'Ok') {
    return result.value;
  } else {
    throw new Error(`Validation error: ${result.error}`);
  }
});

export {
  DecoderPickup,
  DecoderGuitar,
  initDecoders
};
