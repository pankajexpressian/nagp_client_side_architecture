import getCrossOriginWorkerURL from 'crossoriginworker'

export const createWorker=async (url)=>{
    console.log('url - '+ url);
    const localUrl=await getCrossOriginWorkerURL(url);
    console.log('local url - '+ localUrl);
    return new Worker(localUrl);
}