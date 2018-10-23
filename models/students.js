//mongo db collection to store students
//rollNo is made as unique
var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var StudentSchema=new Schema({
    name: String,
    department: String,
    rollNo: {
        type: Number,
        unique: true,
    },
    cgpa: Number
});

module.exports=mongoose.model('Student',StudentSchema);