
//Find all objects has property: Symbol.iterator
const buildInObjs = [
    "Array",
    "AsyncFunction",
    "Atomics",
    "BigInt",
    "BigInt64Array",
    "BigUint64Array",
    "Boolean",
    "DataView",
    "Date",
    "Error",
    "EvalError",
    "FinalizationRegistry",
    "Float32Array",
    "Float64Array",
    "Function",
    "Generator",
    "GeneratorFunction",
    "Infinity",
    "Int16Array",
    "Int32Array",
    "Int8Array",
    "InternalError",
    "Intl",
    "JSON",
    "Map",
    "Math",
    "NaN",
    "Number",
    "Object",
    "Promise",
    "Proxy",
    "RangeError",
    "ReferenceError",
    "Reflect",
    "RegExp",
    "Set",
    "SharedArrayBuffer",
    "String",
    "Symbol",
    "SyntaxError",
    "TypeError",
    "TypedArray",
    "URIError",
    "Uint16Array",
    "Uint32Array",
    "Uint8Array",
    "Uint8ClampedArray",
    "WeakMap",
    "WeakRef",
    "WeakSet",
    "WebAssembly",
    "decodeURI",//function,
    "decodeURIComponent",//function,
    "encodeURI",//function,
    "encodeURIComponent",//function,
    "escape",//function,
    "eval",//function,
    "globalThis",
    "isFinite",//function,
    "isNaN",//function,
    "null",
    "parseFloat",//function,
    "parseInt",//function,
    "undefined",
    "unescape",//function,
    "uneval",//function
];
const content = document.getElementById('content')
for (const objName of buildInObjs) {
    try {
        if(window[objName] && window[objName].prototype && window[objName].prototype[Symbol.iterator]){
            console.log(objName,window[objName].prototype,window[objName].prototype[Symbol.iterator])
            content.innerHTML+=`${objName}<br/>`
            // const obj = new window[objName](1,2,3)
            // console.log(obj)
            // for (const iterator of obj) {
            //     console.log(iterator)
            // }
        }
        
    } catch (error) {
        console.log(error)
    }
    
}
let myArr = new Array(1,2,122,4,5)
for(let item of myArr){console.log(item)}
let myMap = new Map([
    [1, 'one'],
    [2, 'two'],
    [3, 'three'],
  ])
  for(let item of myMap){console.log(item)}
  const set1 = new Set([1, 2, 3, 4, 5]);
  for(let item of set1){console.log(item)}

