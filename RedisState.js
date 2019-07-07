const RedisConnector = require('./RedisConnector')

module.exports = function({databaseId}){

    var redisConnector = RedisConnector({databaseId})

    return Object.freeze({
        store,
        load,
        register,
        isRegistered,
        quit,
        deleteAll
    })

    async function deleteAll(){
        return redisConnector.deleteAll()
    }

    async function quit(){
        redisConnector.quit()
    }

    async function store({id, attribute, value, type}){
        var setValuePromise = set(getValueIdFor(id, attribute), value)
        var setTypePromise = set(getTypeIdFor(id, attribute), type)

        await Promise.all([setValuePromise, setTypePromise])
    }

    async function set(id, value){
        return redisConnector.set(id, value)
    }

    async function load({id, attribute}){
        var getValuePromise = get(getValueIdFor(id, attribute)) 
        var getTypePromise = get(getTypeIdFor(id, attribute))

        var value, type

        [value, type] = await Promise.all([getValuePromise, getTypePromise])

        return {
            value: value || undefined,
            type: type || undefined
        }
    }

    async function get(id){
        return redisConnector.get(id)
    }

    function composeId(id1, id2){
        return `${id1.length}${id1}${id2.length}${id2}`
    }

    function getValueIdFor(id, attribute){
        return `${composeId(id, attribute)}.VALUE`
    }

    function getTypeIdFor(id, attribute){
        return `${composeId(id, attribute)}.TYPE`
    }

    async function register(id){
        return set(`${id}.REGISTERED`, 'true')
    }

    async function isRegistered(id){
        var registeredValue = await get(`${id}.REGISTERED`)
        return registeredValue === 'true'
    }
}