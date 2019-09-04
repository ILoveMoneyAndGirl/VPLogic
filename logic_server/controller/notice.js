
const NoticesModel = require("../models").Notices

class Notice {

    constructor() {
        // super()
    }

    async  getOneNotice(name){

   		return await NoticesModel.findOne({enable:true})
     }
}

module.exports = new Notice();
