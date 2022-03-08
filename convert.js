
const fs = require('fs')
const turf = require('@turf/turf')
const geohash = require('ngeohash');
const highzoomStream = fs.createWriteStream("./wind_highzoom.geojsonld");
const midzoomStream = fs.createWriteStream("./wind_midzoom.geojsonld");
const lowzoomStream = fs.createWriteStream("./wind_lowzoom.geojsonld");

let lowZoomDistance = 180000
let midZoomDistance = 20000
let highZoomDistance = 6000

// number of steps to use in the animation
const steps = 25;

function waitOpen(stream) {
    return new Promise(resolve => {
        stream.once('open', async function(fd) {
            resolve()
        })
    })
}

async function run() {
    await Promise.all([
        waitOpen(lowzoomStream),
    ])
    process(
        lowzoomStream,
    )
}

run()

async function process(
    lowzoomStream,
) {
    const filedata = fs.readFileSync('./data/weather_16.json', 'utf8').toString().split("\n")

    const hashmap = {}
    let i = 0;

    for(const line of filedata) {

        i++;
        let json;
        try {
            json = JSON.parse(line)
        } catch(err) {
            console.warn(err)
            break
        }
        
        const lat = json.city.coord.lat
        const lon = json.city.coord.lon

        const midZoomHash = geohash.encode(lat, lon, 4);
        let midZoom = false
        if (!hashmap[midZoomHash]) {
            hashmap[midZoomHash] = json
            midZoom = true
        }

        const lowZoomHash = geohash.encode(lat, lon, 3);
        let lowZoom = false
        if (!hashmap[lowZoomHash]) {
            hashmap[lowZoomHash] = json
            lowZoom = true
        }

        if (lowZoom) {
            await writePointsAlongLine(lowzoomStream, json, lowZoomDistance)
        }
        if (midZoom) {
            await writePointsAlongLine(midzoomStream, json, midZoomDistance)
        }
        await writePointsAlongLine(highzoomStream, json, highZoomDistance)
    }
}

async function writePointsAlongLine(stream, json, distance) {
    const windDeg = json.wind.deg
    const city = json.city.name
    const lat = json.city.coord.lat
    const lon = json.city.coord.lon
    const windDistance = distance // meters of wind distance

    const oppositeBearing = windDeg + 180
    const originBearing = oppositeBearing > 360 ? oppositeBearing - 360 : oppositeBearing

    const origin = turf.destination(
        turf.point([
            lon,
            lat,
        ]),
        windDistance / 2 / 1000,
        originBearing,
    )
    const dest = turf.destination(
        turf.point([
            lon,
            lat,
        ]),
        windDistance / 2 / 1000,
        windDeg,
    )
    const feature = {
        "type": "FeatureCollection",
        "features": [
            origin,
            turf.point([
                lon,
                lat,
            ]),
            dest,
        ]
    }
    const features = makePoints(
        origin.geometry.coordinates,
        dest.geometry.coordinates,
    )
    feature.features = feature.features.concat(features)

    for (const v of features) {
        v.properties.distance = distance
        let writeResult = stream.write(
            JSON.stringify(v)
        )
        if (writeResult===false) {
            await new Promise(resolve => stream.once('drain', resolve))
        }
        writeResult = stream.write('\n')
        if (writeResult===false) {
            await new Promise(resolve => stream.once('drain', resolve))
        }
    }
}

function makePoints(origin, dest) {
    const line = turf.lineString([
        dest,
        origin,
    ])

    // Calculate the distance in kilometers between route start/end point.
    const lineDistance = turf.length(line);

    const arc = [];

    let j = 1;
    // Draw an arc between the `origin` & `destination` of the two points
    for (let i = 0; i < lineDistance; i += lineDistance / steps) {
        const segment = turf.along(line, i);
        segment.properties = {
            value: j,
        }
        arc.push(segment);
        j++
    }
    return arc
}
