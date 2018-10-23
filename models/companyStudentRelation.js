//mongo db collection to store which student is registered for which company
//many to many relationship exists between students and companies,
//so this collection is used to represent the many to many relationship
var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var CompanyStudentRelationSchema=new Schema({
    company: {
        type: Schema.Types.ObjectId,
        ref: 'Company' },
    student: {
        type: Schema.Types.ObjectId,
        ref: 'Student' }
});

module.exports=mongoose.model('CompanyStudentRelation',CompanyStudentRelationSchema);