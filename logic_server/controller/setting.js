

let config = require('../config/config');

class Setting {
    constructor() {
        // super()
    }


    set(msg,next){
        config=msg.config
        next(config)
    }


   	 get(msg,next){
    console.log(config)

      next(config)
    }

}

module.exports = new Setting();