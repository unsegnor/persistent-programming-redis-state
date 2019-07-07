const statePort = require('persistent-programming/domain/StatePort')
const RedisState = require('./RedisState')

describe('RedisState', function(){
    beforeEach(function(){
        this.adapter = RedisState({
            databaseId: 15
        })
    })

    afterEach(function(){
        this.adapter.deleteAll()
        this.adapter.quit()
    })

    statePort()
})