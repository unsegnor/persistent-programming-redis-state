const statePort = require('persistent-programming/domain/State.port')
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
