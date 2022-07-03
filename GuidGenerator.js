const { v4: uuidv4 } = require('uuid');

module.exports = function() {
    let currentId = 0
    
    return Object.freeze({
        getNew
    })

    async function getNew(){
        return uuidv4()
    }
}