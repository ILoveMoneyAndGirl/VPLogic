

let config = require('../config/config');

class Setting {
    constructor() {
        // super()
    }


    set(msg,data,next){
       config=msg.config
        data.data=""
        data.status=200
        next(data)
    }


   	 get(msg,data,next){
        data.data=config
        data.status=200
        next(data)
    }

}

module.exports = new Setting();