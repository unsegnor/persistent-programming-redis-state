module.exports = function({databaseId}){
    var redis = require('redis')
    var client = redis.createClient({db: databaseId})

    return Object.freeze({
        set,
        get,
        quit,
        deleteAll
    })

    async function deleteAll(){
        return new Promise(function(resolve){
            client.sendCommand('FLUSHDB', function(){
                resolve()
            })
        })
    }

    function quit(){
        client.quit()
    }

    async function set(id, value){
        return new Promise(function(resolve){
            if(Array.isArray(value)){
                client.sendCommand('rpush', [id, ...value], function(){
                    resolve()
                })
            }else{
                client.set(id, value, function(){
                    resolve()
                })
            }
        })
    }

    async function get(id){
        return new Promise(async function(resolve){
            var valueType = await getTypeOf(id)
            if(valueType == 'list'){
                client.sendCommand('lrange', [id, 0, -1], function(err, result){
                    resolve(result)
                })
            }else{
                client.get(id, function(err, result){
                    resolve(result)
                })
            }
        })
    }

    async function getTypeOf(id){
        return new Promise(function(resolve, reject){
            client.sendCommand('TYPE', [id] , function(err, result){
                resolve(result)
            })
        })
    }
}