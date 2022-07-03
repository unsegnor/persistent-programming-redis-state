const repositoryTests = require('persistent-programming/tests/repositoryTests.js')
const RedisRepository = require('./index.js')

describe('RedisRepository', function(){
    beforeEach(function(){
        this.CreateRepository = function(args){
            return RedisRepository({
                idGenerator: (args && args.idGenerator) || undefined,
                databaseId: 15
            })
        }
    })

    repositoryTests()

})