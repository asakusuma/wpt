window.entryPerChunk = 50;

async function fetchOperatorDictionary() {
    let response = await fetch(`/mathml/support/operator-dictionary.json`);
    return response.json();
}

function splitKey(key) {
    var value = key.split(" ")
    return {
        characters: value[0],
        form: value[1]
    };
}

function spaceIndexToLength(index) {
    // See https://mathml-refresh.github.io/mathml-core/#operator-dictionary
    return ["0",
            "0.05555555555555555em",
            "0.1111111111111111em",
            "0.16666666666666666em",
            "0.2222222222222222em",
            "0.2777777777777778em",
            "0.3333333333333333em",
            "0.3888888888888889em"
           ][index];
}

function defaultLspace(entry) {
    return spaceIndexToLength(entry.hasOwnProperty("lspace") ? entry["lspace"] : 5)
}

function defaultRspace(entry) {
    return spaceIndexToLength(entry.hasOwnProperty("rspace") ? entry["rspace"] : 5)
}
