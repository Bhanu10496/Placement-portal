//mongo db collection to store companies
//name is made as unique
var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var CompanySchema=new Schema({
    name: {
        type: String,
        unique: true
    },
    position: String,
    package: Number,
    location: String
});

module.exports=mongoose.model('Company',CompanySchema);