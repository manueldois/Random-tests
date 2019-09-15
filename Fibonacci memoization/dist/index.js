console.log("STARTING FIBONACCI TEST")

let result = 0
const X = 30
const FibbMap = new Map()

main()
function main(){
    console.log(`\n\nCalculating fibonacci of ${X} WITHOUT memoization... `)
    console.log(normalFibb)
    console.time(`normalFibb(${X})`)
    result = normalFibb(X)
    console.timeEnd(`normalFibb(${X})`)
    console.log("Done. Result: " + result)

    console.log(`\n\nCalculating fibonacci of ${X} WITH memoization... `)
    console.log(memoizationFibb)
    console.time(`memoizationFibb(${X})`)
    result = memoizationFibb(X)
    console.timeEnd(`memoizationFibb(${X})`)
    console.log("Done. Result: " + result)
    console.log("Memoized fibonacci keys: ", FibbMap.size)
}

function normalFibb(x){
    if(x <= 1) return x
    return normalFibb(x-1) + normalFibb(x-2)
}

function memoizationFibb(x){
    if(x <= 1) return x
    if(FibbMap.has(x)) return FibbMap.get(x)
    let result = memoizationFibb(x-1) + memoizationFibb(x-2)
    FibbMap.set(x, result)
    return result
}