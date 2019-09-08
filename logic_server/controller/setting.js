

let config = require('../config/config');

class Setting {
    constructor() {
        // super()
    }


    set(msg,next){
        config=JSON.parse(msg.config)
        next(config)
    }


   	 get(msg,next){
      next(config)
    }

}

module.exports = new Setting();