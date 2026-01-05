// const electron= require('electron')
// console.log(electron)
// let test = localStorage.getItem("test")
// if(!test){
//     localStorage.setItem("test",location.href)
//     test = localStorage.getItem("test")
// }
// console.log("current url",test)
//
// function getProcessInfo(){
//     const ses = session.fromPartition("persist:default")
//     const StoragePath = ses.getStoragePath();
//     const protocol = ses.protocol
//
//     const {defaultApp,platform,arch,pid,env,argv,execPath,versions} = process
//     const getCPUUsage = process.getCPUUsage()
//     const getHeapStatistics = process.getHeapStatistics()
//     const getBlinkMemoryInfo = process.getBlinkMemoryInfo()
//     const getProcessMemoryInfo = process.getProcessMemoryInfo()
//     const getSystemMemoryInfo = process.getSystemMemoryInfo()
//     const getSystemVersion = process.getSystemVersion()
//     return {
//         StoragePath,protocol,
//         processId:pid,
//         is64Bit: arch === 'x64' || arch === 'arm64',
//         platform,
//         versions,
//         defaultApp,
//         else:{
//             env,argv,execPath,
//             CPUUsage:getCPUUsage,
//             HeapStatistics:getHeapStatistics,
//             BlinkMemoryInfo:getBlinkMemoryInfo,
//             ProcessMemoryInfo:getProcessMemoryInfo,
//             SystemMemoryInfo:getSystemMemoryInfo,
//             SystemVersion:getSystemVersion
//         }
//     }
// }
// console.log(JSON.stringify(getProcessInfo()))
