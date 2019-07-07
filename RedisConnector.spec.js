const {expect} = require('chai')
const RedisConnector = require('./RedisConnector')
const redis = require('redis')

describe('Redis Connector', function(){
    var client, connector

    async function deleteAll(){
        return new Promise(function(resolve){
            client.sendCommand('FLUSHDB', function(){
                resolve()
            })
        })
    }

    async function getTypeOf(id){
        return new Promise(function(resolve, reject){
            client.sendCommand('TYPE', [id] , function(err, result){
                resolve(result)
            })
        })
    }

    beforeEach(function(){
        client = redis.createClient({db: 15})
        connector = RedisConnector({
            databaseId: 15
        })
    })

    afterEach(async function(){
        await deleteAll()
        client.quit()
        connector.quit()
    })

    describe('Set', function(){
        it('must store a value as a list when it is an array', async function(){
            await connector.set('id', ['a', 'b', 'c'])
            var valueType = await getTypeOf('id')

            expect(valueType).to.equal('list')
        })

        it('must store a value as a string when it is a string', async function(){
            await connector.set('id', 'a')
            var valueType = await getTypeOf('id')

            expect(valueType).to.equal('string')
        })
    })

    describe('get', function(){
        it('must retrieve the value as an array when it is a list', async function(){
            await connector.set('id', ['a', 'b', 'c'])
            var value = await connector.get('id')

            expect(value).to.be.an('array')
            expect(value).to.contain('a')
            expect(value).to.contain('b')
            expect(value).to.contain('c')
        })

        it('must retrieve the value as a string when it is a string', async function(){
            await connector.set('id', 'a')
            var value = await connector.get('id')
            expect(value).to.equal('a')
        })
    })
})