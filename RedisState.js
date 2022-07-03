const RedisConnector = require('./RedisConnector')

module.exports = function({databaseId}){

    var redisConnector = RedisConnector({databaseId})

    return Object.freeze({
        store,
        load,
        register,
        isRegistered,
        getProperties,
        close,
        deleteAll
    })

    async function deleteAll(){
        return redisConnector.deleteAll()
    }

    async function close(){
        redisConnector.quit()
    }

    async function store({id, property, value, type}){
        var setValuePromise = set(getValueIdFor(id, property), value)
        var setTypePromise = set(getTypeIdFor(id, property), type)
        var addPropertyPromise = addProperty(id, property)

        await Promise.all([setValuePromise, setTypePromise, addPropertyPromise])
    }

    async function addProperty(id, property){
        var propertiesIdentifier = `${id}.PROPERTIES`
        var properties = (await get(propertiesIdentifier)) || []
        properties.push(property)
        return set(propertiesIdentifier, properties)
    }

    async function set(id, value){
        return redisConnector.set(id, value)
    }

    async function load({id, property}){
        var getValuePromise = get(getValueIdFor(id, property)) 
        var getTypePromise = get(getTypeIdFor(id, property))

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

    function getValueIdFor(id, property){
        return `${composeId(id, property)}.VALUE`
    }

    function getTypeIdFor(id, property){
        return `${composeId(id, property)}.TYPE`
    }

    async function register(id){
        return set(`${id}.REGISTERED`, 'true')
    }

    async function isRegistered(id){
        var registeredValue = await get(`${id}.REGISTERED`)
        return registeredValue === 'true'
    }

    async function getProperties({id}){
        return (await get(`${id}.PROPERTIES`)) || []
    }
}
