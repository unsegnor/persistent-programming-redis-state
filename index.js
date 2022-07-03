const State = require('./RedisState')
const ObjectRepository = require('persistent-programming/domain/ObjectRepository')
const ObjectFactory = require('persistent-programming/domain/StatefulObject.factory')
const IdGenerator = require('./GuidGenerator.js')

module.exports = function(dependencies) {
    let state = State({databaseId: dependencies.databaseId})
    let repository = ObjectRepository({
        factory: ObjectFactory(),
        idGenerator: (dependencies && dependencies.idGenerator) || IdGenerator(),
        state})

    return Object.freeze({
        getNew,
        get,
        getRoot,
        close
    })

    async function getNew(){
        return repository.getNew()
    }

    async function get(id){
        return repository.get(id)
    }

    async function getRoot(id){
        return repository.getRoot(id)
    }

    async function close(){
        await state.close()
    }
}