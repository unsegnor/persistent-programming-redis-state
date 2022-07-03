const { v4: uuidv4 } = require('uuid');

module.exports = function() {
    return Object.freeze({
        getNew
    })

    async function getNew(){
        return uuidv4()
    }
}