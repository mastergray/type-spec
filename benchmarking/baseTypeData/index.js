// Data used to create types with:
const POSITION = ["neck", "middle", "bridge"]
const COIL = ["single-coil", "humbucker"]
const MAGNET = ["alnico-5", "alnico-2", "ceramic", "unknown"]
const CIRCUIT = ["active", "passive"]
const GUITARS = [
    {
        "make":"Ibanez",
        "model":"GRX20L",
        "year":2001,
        "color":"black",
        "pickups":[
            {
                "make":"Jackson USA",
                "model":"Unknown",
                "color":"Black",
                "position":"neck",
                "magnet":"unknown",
                "coil":"humbucker",
                "circuit":"passive"
            },
            {
                "make":"Seymour Duncan",
                "model":"SH-4",
                "color":"Black",
                "position":"bridge",
                "magnet":"alnico-5",
                "coil":"humbucker",
                "circuit":"passive"
            }
        ]
    },
    {
        "make":"Schecter",
        "model":"Omen",
        "year":2002,
        "color":"black",
        "pickups":[
            {
                "make":"DiMarzio",
                "model":"Evolution Neck",
                "color":"Chrome",
                "position":"neck",
                "coil":"humbucker",
                "circuit":"passive",
                "magnet":"ceramic"
            },
            {
                "make":"DiMarzio",
                "model":"SH-JB",
                "color":"Black",
                "position":"bridge",
                "coil":"humbucker",
                "circuit":"passive",
                "magnet":"alnico-5"
            }
        ]
    },
    {
        "make":"Fender",
        "model":"Standard Starocaster",
        "year":2003,
        "color":"black/white",
        "pickups":[
            {
                "make":"DiMarzio",
                "model":"YJM",
                "color":"Black",
                "position":"neck",
                "coil":"humbucker",
                "circuit":"passive",
                "magnet":"alnico-5"
            },
            {
                "make":"Seymour Duncan",
                "model":"JB Jr.",
                "color":"Black",
                "position":"middle",
                "coil":"humbucker",
                "circuit":"passive",
                "magnet":"ceramic"
            },
            {
                "make":"Seymour Duncan",
                "model":"Hot Rails.",
                "color":"Black",
                "position":"bridge",
                "coil":"humbucker",
                "circuit":"passive",
                "magnet":"ceramic"
            }
        ]
    }, 
]

export default {
    POSITION,
    COIL,
    MAGNET, 
    CIRCUIT,
    GUITARS
}


