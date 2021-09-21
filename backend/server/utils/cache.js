const flatCache = require('flat-cache')
let cache = flatCache.load('productsCache');

let flatCacheMiddleware = (req,res, next) => {
    let key =  '__express__' + req.originalUrl || req.url
    let cacheContent = cache.getKey(key);
    if( cacheContent){
        res.send( cacheContent );
    } else {
        res.sendResponse = res.send
        res.send = (body) => {
            cache.setKey(key,body);
            cache.save();
            res.sendResponse(body)
        }
        next()
    }
};
module.exports = flatCacheMiddleware