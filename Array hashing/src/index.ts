import './styles.scss'
import { Timeline } from './util'

console.log('STARTING ARRAY HASHING TEST')

// Build Tuple Array with XY coords of cells

function runAllTests(TEST_SIZE) {
    let ARRAY_A: Uint16Array, ARRAY_B: Uint16Array
    const HALF_INDEX = Math.floor(TEST_SIZE / 2)
    const MAX_RADIUS = TEST_SIZE
    console.log("Array sizes: ", TEST_SIZE)

    console.log("\n Testing indexwise equal XY sets...")
    ARRAY_A = XYSpiral(TEST_SIZE, MAX_RADIUS)
    ARRAY_B = XYSpiral(TEST_SIZE, MAX_RADIUS)
    testCompareXYArrays(ARRAY_A, ARRAY_B)

    console.log("\n Testing equal XY sets where one array is the first but shifted 2 indexes...")
    ARRAY_A = XYSpiral(TEST_SIZE, MAX_RADIUS)
    // B is A shifted left (first tuple is A's second, last tuple is A's first)
    for (let i = 0; i < ARRAY_A.length - 2; i += 2) {
        ARRAY_B[i] = ARRAY_A[i + 2];
        ARRAY_B[i + 1] = ARRAY_A[i + 2 + 1];
    }
    ARRAY_B[ARRAY_B.length - 2] = ARRAY_A[0]
    ARRAY_B[ARRAY_B.length - 1] = ARRAY_A[1]
    testCompareXYArrays(ARRAY_A, ARRAY_B)

    console.log("\n Testing totaly different XY sets...")
    ARRAY_A = XYSpiral(TEST_SIZE, MAX_RADIUS)
    ARRAY_B = XYSpiral(TEST_SIZE, MAX_RADIUS, 2)
    testCompareXYArrays(ARRAY_A, ARRAY_B)

    console.log("\n Testing sets one element different...")
    ARRAY_A = XYSpiral(TEST_SIZE, MAX_RADIUS)
    ARRAY_B = XYSpiral(TEST_SIZE, MAX_RADIUS)
    ARRAY_B[HALF_INDEX] = 999
    testCompareXYArrays(ARRAY_A, ARRAY_B)

    console.log("\n Testing sets two elements different...")
    ARRAY_A = XYSpiral(TEST_SIZE, MAX_RADIUS)
    ARRAY_B = XYSpiral(TEST_SIZE, MAX_RADIUS)
    ARRAY_B[HALF_INDEX] = 999
    ARRAY_B[HALF_INDEX + 1] = -999
    testCompareXYArrays(ARRAY_A, ARRAY_B)
}

function testCompareXYArrays(ARRAY_A: Uint16Array, ARRAY_B: Uint16Array) {
    console.log("Array A: ", ARRAY_A, "Array B: ", ARRAY_B)
    const TIMELINE = new Timeline('Compare two arrays')

    const XY_HASH_A = reduceToSingle(ARRAY_A)
    const XY_HASH_B = reduceToSingle(ARRAY_B)
    TIMELINE.mark('HashXY')

    const CUM_SUM_XY_HASH_A = cumSum(XY_HASH_A)
    const CUM_SUM_XY_HASH_B = cumSum(XY_HASH_B)
    TIMELINE.mark('Cumsum hash')

    const CUM_MULT_XY_HASH_A = cumMult(XY_HASH_A)
    const CUM_MULT_XY_HASH_B = cumMult(XY_HASH_B)
    TIMELINE.mark('Cummult hash')

    const ELEMENTWISE_XYHASH_COMPARE = elementwiseCompareSet(XY_HASH_A, XY_HASH_B)
    TIMELINE.mark('Elementwise singles compare')
    TIMELINE.end()

    console.log("cumSum equal: ", CUM_SUM_XY_HASH_A == CUM_SUM_XY_HASH_B)
    console.log("cumMult equal: ", CUM_MULT_XY_HASH_A == CUM_MULT_XY_HASH_B)
    console.log("Elementwise singles array equivalent: ", ELEMENTWISE_XYHASH_COMPARE)

    console.log(TIMELINE.TIMES)
}

function XYSpiral(N_POINTS: number, MAX_RADIUS: number, N_REVOLUTIONS: number = 1) {
    const XY1 = new Uint16Array(N_POINTS * 2)
    for (let i = 0; i <= XY1.length; i += 2) {
        const ANGLE = (i / XY1.length) * 360 * N_REVOLUTIONS
        const DISTANCE = (i / XY1.length) * MAX_RADIUS / 2
        const X = Math.cos(ANGLE / (2 * Math.PI)) * DISTANCE + MAX_RADIUS / 2
        const Y = Math.sin(ANGLE / (2 * Math.PI)) * DISTANCE + MAX_RADIUS / 2
        XY1[i] = X
        XY1[i + 1] = Y
    }
    return XY1
}

function reduceToSingle(ARRAY: Uint16Array): Uint32Array {
    const SINGLES_ARRAY = new Uint32Array(ARRAY.length / 2)
    for (let i = 0; i < ARRAY.length; i += 2) {
        SINGLES_ARRAY[i / 2] = two16ToOne32(ARRAY[i], ARRAY[i + 1])
    }
    return SINGLES_ARRAY
}

function two16ToOne32(X: number, Y: number) {
    return (X * 2 ** 16 + Y)
}

function cumSum(ARRAY: any) {
    let acc = 0
    for (let i = 0; i < ARRAY.length; i++) {
        acc += ARRAY[i]
    }
    return acc
}

function cumMult(ARRAY: any) {
    let acc = 1n
    for (let i = 0; i < ARRAY.length; i++) {
        acc *= BigInt(ARRAY[i])
    }
    return acc
}

function elementwiseCompareSet(ARRAY_A: any, ARRAY_B: any) {
    if (ARRAY_A.length !== ARRAY_B.length) throw new Error('Arrays must be of same length')

    // Elements of Array A exist in Array B
    // If Array A does not have repeating values this ensures the two sets are equal 
    let value = 0
    let value_found = false
    let i = 0, j = 0
    for (i = 0; i < ARRAY_A.length; i++) {
        value = ARRAY_A[i]
        value_found = false
        for (j = 0; j < ARRAY_B.length; j++) {
            if (ARRAY_B[j] === value) {
                value_found = true
                break
            }
        }

        if (!value_found) return false
    }

    return true
}


document.getElementById('btn-run-10').addEventListener('click', () => {
    runAllTests(10)
})

document.getElementById('btn-run-20000').addEventListener('click', () => {
    runAllTests(20000)
})
