import {initTypeSpec} from "./typeSpec/index.js"
import { initTypeSpecBuild } from "./typeSpecBuild/index.js";
import { initObjectModel } from "./objectmodel/index.js";
import { initZod } from "./zod/index.js";
import { initRuntypes } from "./runtypes/index.js";
import { initJoi } from "./joi/index.js";
import { initYup } from "./yup/index.js";
import { initSuperstruct } from "./superstruct/index.js";
import { initArchetype } from "./archetype/index.js";
import { initTcomb } from "./tcomb/index.js";
import { initDecoders } from "./decoders/index.js";
import BaseTypeData from "./baseTypeData/index.js";
import Benchmark from "benchmark";
import heapdump from "heapdump";

const LIMIT = 5000;
const GUITARS = BaseTypeData.GUITARS;
//const guitars = initDecoders(GUITARS);
//console.log(guitars)


// Define benchmark suite
const suite = new Benchmark.Suite;

// Helper function to take heap snapshot
const takeHeapSnapshot = (label, fn) => {
  fn();
  return new Promise((resolve, reject) => {
    const snapshotFile = `./test/heap-${label}-${Date.now()}.heapsnapshot`;
    heapdump.writeSnapshot(snapshotFile, (err, filename) => {
      if (err) {
        return reject(err);
      }
      console.log(`Heap snapshot saved to ${filename}`);
      resolve(filename);
    });
  });
}

(async () => {
  await takeHeapSnapshot("TypeSpec", () => {
    for (let i = 0; i < LIMIT; i++) {
      initTypeSpec(GUITARS)
  }
  })
  await takeHeapSnapshot("TypeSpecBuild", () => {
    for (let i = 0; i < LIMIT; i++) {
      initTypeSpecBuild(GUITARS)
  }
  })
  await takeHeapSnapshot("Zod", () => {
    for (let i = 0; i < LIMIT; i++) {
      initZod(GUITARS);
  }
  })
})();

/*
suite
  .add('TypeSpec', function () {
    for (let i = 0; i < LIMIT; i++) {
        initTypeSpec(GUITARS)
    }
  })
  .add('TypeSpecBuild', function () {
    for (let i = 0; i < LIMIT; i++) {
        initTypeSpecBuild(GUITARS)
    }
  })
  .add('ObjectModel', function () {
    for (let i = 0; i < LIMIT; i++) {
       initObjectModel(GUITARS)
    }
  })
  .add('Zod', function () {
    for (let i = 0; i < LIMIT; i++) {
        initZod(GUITARS);
    }
  })
  .add('Runtypes', function () {
    for (let i = 0; i < LIMIT; i++) {
        initRuntypes(GUITARS);
    }
  })
  .add('Joi', function () {
    for (let i = 0; i < LIMIT; i++) {
        initJoi(GUITARS);
    }
  })
  .add('Yup', function () {
    for (let i = 0; i < LIMIT; i++) {
        initYup(GUITARS);
    }
  })
  .add('Superstruct', function () {
    for (let i = 0; i < LIMIT; i++) {
        initSuperstruct(GUITARS);
    }
  })
  .add('Archetype', function () {
    for (let i = 0; i < LIMIT; i++) {
        initArchetype(GUITARS);
    }
  })
  .add('tcomb', function () {
    for (let i = 0; i < LIMIT; i++) {
        initTcomb(GUITARS);
    }
  })
  .add('Decoders', function () {
    for (let i = 0; i < LIMIT; i++) {
      initDecoders(GUITARS)
    }
  })
  .on('cycle', function (event) {
    console.log(String(event.target));
  })
  .on('complete', function () {
    console.log('Fastest is ' + this.filter('fastest').map('name'));
  })
  .run({ async: true });*/

