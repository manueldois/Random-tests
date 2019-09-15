
// Declare global vars
const N_ITERATIONS = 1E7
const ARRAY = new Uint8Array(N_ITERATIONS)
let global_acc = 0

main()
function main() {
    console.log('STARTING LOOPS TEST')
    console.log('Using 1E7 iterations')
    runFunctionTest(independentFor)
    runFunctionTest(arrayFor)
    runFunctionTest(arrayForOf)
    runFunctionTest(arrayForEach)
    runFunctionTest(deepObjectFor)
    runFunctionTest(globalVarFor)
}

function independentFor() {
    let acc = 0
    let N = N_ITERATIONS
    for (let i = 0; i < N; i++) {
        acc++
    }
}

function arrayFor() {
    let acc = 0
    for (let i = 0; i < ARRAY.length; i++) {
        acc++
    }
}

function arrayForOf() {
    let acc = 0
    for (let val of ARRAY) {
        acc++
    }
}

function arrayForEach() {
    let acc = 0
    ARRAY.forEach(val => {
        acc++
    })
}

function deepObjectFor() {
    let deep = { deeper: { acc: 0 } }
    let N = N_ITERATIONS
    for (let i = 0; i < N; i++) {
        deep.deeper.acc++
    }
}

function globalVarFor() {
    let N = N_ITERATIONS
    for (let i = 0; i < N; i++) {
        global_acc++
    }
}

/** Runs a function 30 times and outputs the average run duration in ms */
function runFunctionTest(functionToTest) {
    console.log("\n\nTesting: \n", functionToTest.toString())
    const run_durations = new Uint32Array(30)

    // Execute and record run duration
    for (let i = 0; i < run_durations.length; i++) {
        const start_time = window.performance.now()
        functionToTest()
        const end_time = window.performance.now()
        const run_duration = Math.round(end_time - start_time)
        run_durations[i] = run_duration
    }


    // Take all the durations and calculate the mean and std.dev
    const mean = Math.round(
        run_durations.reduce((acc, duration) => acc + duration) / run_durations.length
        * 100) / 100 // To keep 3 decimal precision

    const std_dev = Math.round(
        Math.sqrt(
            run_durations.reduce((acc, duration) => {
                return acc + (duration - mean) ** 2
            }) / run_durations.length
        )
        * 100) / 100 // To keep 3 decimal precision



    console.log("Run durations: ", run_durations)
    console.log(`Mean: ${mean}, Stddev: ${std_dev}`)
    console.log('----------')

    return { mean, std_dev }
}

