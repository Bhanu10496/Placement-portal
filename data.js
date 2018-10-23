var Student=require('./models/students.js');
var Company=require('./models/companies.js');
var CompanyStudentRelation=require('./models/companyStudentRelation.js');

function registerCompany(company){
    return Company.create({
        name: company.name,
        position: company.position,
        package: company.package,
        location: company.location
    });
}

function unregisterCompany(companyId){
    return Company.remove({_id: companyId});
}

function removeRelationCompany(companyId){
    return CompanyStudentRelation.remove({company: companyId});
}

function registerStudent(companyId,studentId){
    return CompanyStudentRelation.create({
        company: companyId,
        student: studentId
    });
}

function unregisterStudent(companyId,studentId){
    return CompanyStudentRelation.remove({company: companyId, student: studentId});
}

function removeStudent(studentId){
    return Student.remove({_id: studentId});
}

function removeRelationStudent(studentId){
    return CompanyStudentRelation.remove({student: studentId});
}

function addStudent(student){
    return Student.create({
        name: student.name,
        department: student.department,
        rollNo: student.rollNo,
        cgpa: student.cgpa
    });
}

function getCompanies(){
    return Company.find({});
}

function getAllStudents(){
    return Student.find({});
}

function getStudentsByCompany(id){
    return CompanyStudentRelation.find({company: id}).populate('student');
}

function getStudentIdByRollNo(rollNo){
    return Student.findOne({rollNo: rollNo});
}

function findRelation(companyId,studentId){
    return CompanyStudentRelation.findOne({company: companyId,student: studentId});
}

function getStudentById(studentId){
    return Student.findById(studentId);
}

function getCompanyById(companyId){
    return Company.findById(companyId);
}

function editStudent(student){
    return Student.findByIdAndUpdate(student.id,
                                     {
                                        name: student.name,
                                        department: student.department,
                                        rollNo: student.rollNo,
                                        cgpa: student.cgpa
                                     });
}

function editCompany(company){
    return Company.findByIdAndUpdate(company._id,
                                     {
                                        name: company.name,
                                        department: company.position,
                                        rollNo: company.package,
                                        cgpa: company.location
                                     });
}

//in case of returned promise, instead of err,doc...then(doc),catch(err) should be used
module.exports={                        //all return an err as first argument
    registerCompany,                    //returns promise with created doc
    unregisterCompany,                  //returns query with nothing
    removeRelationCompany,              //returns query with nothing
    registerStudent,                    //returns promise with created doc
    unregisterStudent,                  //returns query with nothing
    removeStudent,                      //returns query with nothing
    removeRelationStudent,              //returns query with nothing
    addStudent,                         //returns promise with created doc
    getCompanies,                       //returns query with an array of docs
    getAllStudents,                     //returns query with an array of docs
    getStudentsByCompany,               //returns query with array of docs
    getStudentIdByRollNo,               //returns query with found doc
    findRelation,                       //returns query with found doc
    getStudentById,                     //returns query with found doc
    getCompanyById,                     //returns query with found doc
    editStudent,                         //returns query with found doc
    editCompany                         //returns query with found doc
}