
const URLListModel = require("../models").URLList

class Notice {

    constructor() {
        // super()
    }

    async  getOneNotice(name){

   		return await URLListModel.findOne({enable:true})
     }
}

module.exports = new Notice();
