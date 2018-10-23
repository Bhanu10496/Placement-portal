const route = require('express').Router();
const data = require('../data');
const winston=require('winston');
var path=require("path");

//adding timestamp to winston (logging library)
winston.remove(winston.transports.Console);
winston.add(winston.transports.Console, {'timestamp':true});

//redirecting to companies page
route.get('/',function(req,res){
    res.redirect('/static/html/companies.html');
})

//route to register a company
route.post('/registerCompany',function(req,res,next){
    data.registerCompany(req.body).then(function(doc){
            winston.log('info','Company registered successfully');
            res.redirect('/companies');
    })
    .catch(function(err){
        winston.log('error',err);
        res.status('409').send('error');
    });
})

//route to unregister a company
route.post('/unregisterCompany',function(req,res,next){

    //removing the company from the companies database
    data.unregisterCompany(req.body.companyId).exec(function(err){
        if(err){
            next(err);
        }
        else{

            //unregistering all the students that had registered for this company
            data.removeRelationCompany(req.body.companyId).exec(function(err){
                    if(err){
                        next(err);
                    }
                    else{
                        winston.log('info','Successfully unregistered company');
                        res.redirect('companies');
                    }
            })
        }
    });
})

//route to register a student for a company
route.post('/registerStudent',function(req,res,next){

    //checking if the student to be registered is present in the students database
    data.getStudentIdByRollNo(req.body.rollNo).exec(function(err,doc){
        if(doc==null){
            winston.log('warn','student not present in the database');
            res.status('404').send('not found');
        }
        else{
            var studentId=doc._id;

            //checking if the student is already registered for the company
            data.findRelation(req.cookies.companyId,doc._id).exec(function(err,doc){
                if(doc!=null){
                     winston.log('warn','student already registered for the company');
                     res.status('409').send("present");
                }
                else{
                     data.registerStudent(req.cookies.companyId,studentId)
                     .then(function(doc){
                             winston.log('info','Student registered successfully');
                             res.redirect('/students');
                     })
                     .catch(next);
                }
            })
        }


    })
})

route.post('/registerStudent2',function(req,res,next){

    //checking if the student to be registered is present in the students database
    data.getStudentIdByRollNo(req.body.rollNo).exec(function(err,doc){
        if(doc==null){
            winston.log('warn','student not present in the database');
            res.status('404').send('not found');
        }
        else{
            var studentId=doc._id;

            //checking if the student is already registered for the company
            data.findRelation(req.body.companyId,doc._id).exec(function(err,doc){
                if(doc!=null){
                     winston.log('warn','student already registered for the company');
                     res.status('409').send("present");
                }
                else{
                     data.registerStudent(req.body.companyId,studentId)
                     .then(function(doc){
                             winston.log('info','Student registered successfully');
                             res.redirect('/students');
                     })
                     .catch(next);
                }
            })
        }


    })
})

//route to remove a student from the student database
route.post('/removeStudent',function(req,res,next){

//removing student from the student database
    data.removeStudent(req.body.studentId).exec(function(err){
        if(err)
            next(err);
        else{

            //unregistering the student from all the companies it had registered for previously
            data.removeRelationStudent(req.body.studentId).exec(function(err){
                    if(err)
                        next(err);
                    else{
                        winston.log('info','Student removed successfully');
                        res.redirect('allStudents');
                    }
            })
        }
    });
})

//route to unregister a student from a company
route.post('/unregisterStudent',function(req,res,next){
        data.unregisterStudent(req.cookies.companyId,req.body.studentId)
        .exec(function(err){
            if(err)
                next(err)
            else{
                winston.log('info','Student unregistered successfully');
                res.redirect('students');
            }
        })
})

route.post('/unregisterStudent2',function(req,res,next){
        data.unregisterStudent(req.body.companyId,req.body.studentId)
        .exec(function(err){
            if(err)
                next(err)
            else{
                winston.log('info','Student unregistered successfully');
                res.redirect('students');
            }
        })
})

//route to add a student to the students database
route.post('/addStudent',function(req,res,next){
    data.addStudent(req.body).then(function(doc){
        winston.log('info','Student added successfully');
        res.redirect('allStudents');
    }).catch(function(err){
        winston.log('error','Student cant be added to database')
        res.status('409').send('error');
    });
})

//route to get all the companies
route.get('/companies',function(req,res,next){
    data.getCompanies().exec(function(err,docs){
        if(err)
            next(err)
        else{
            winston.log('info','Sending all companies');
            res.send(docs);
        }
    })
})

//route to get all the students
route.get('/allStudents',function(req,res,next){
    data.getAllStudents().exec(function(err,docs){
        if(err)
            next(err)
        else{
            winston.log('info','Sending all students');
            res.send(docs);
        }
    })
})

//route to handle all the students registered for a specific company
route.get('/renderStudents/:companyId',function(req,res){
    res.cookie('companyId' ,req.params.companyId)
    .redirect('/static/html/students.html');
})

//route to get all the students registered for a specific company
route.get('/students',function(req,res,next){
    data.getStudentsByCompany(req.cookies.companyId)
    .exec(function(err,docs){
        if(err)
            next(err)
        else{
            winston.log('info','Sending company specific students');
            res.send(docs);
        }
        //now we can use like docs[0].student.name
    })
})

route.get('/students/:companyId',function(req,res,next){
    data.getStudentsByCompany(req.params.companyId)
    .exec(function(err,docs){
        if(err)
            next(err)
        else{
            winston.log('info','Sending company specific students ');
            res.send(docs);
        }
        //now we can use like docs[0].student.name
    })
})

//route to get a student by its id
route.get('/student/:id',function(req,res,next){
    data.getStudentById(req.params.id)
    .exec(function(err,doc){
        if(err)
            next(err)
        else{
            winston.log('info','Sending student by id');
            res.send(doc);
        }
    })
})

//route to edit a student
route.post('/editStudent',function(req,res,next){
    data.editStudent(req.body).exec(function(err,doc){
        if(err){
             winston.log('error','Cant edit student');
             res.status('409').send('error');
        }
        else{
            winston.log('info','Student edited successfully '+req.body.name);
            res.redirect('allStudents');
        }
    })
})

//route to edit a company
route.post('/editCompany',function(req,res,next){
    data.editCompany(req.body).exec(function(err,doc){
        if(err){
             winston.log('error','Cant edit company');
             res.status('409').send('error');
        }
        else{
            winston.log('info','Company edited successfully '+req.body.name);
            res.redirect('companies');
        }
    })
})

//route to send the current selected company
route.get('/currentCompany',function(req,res,next){
    data.getCompanyById(req.cookies.companyId).exec(function(err,doc){
        if(err)
            next(err)
        else{
            winston.log('info','Sending current company');
            res.send(doc.name);
        }
    })
})

module.exports=route;