$(function(){

    var studentId;
    window.validate=function(){
        var name=$("#name").val();
        var department=$("#department").val();
        var rollNo=$("#rollNo").val();
        var cgpa=$("#cgpa").val();

        //sanitizing the input fields by removing whitespaces
        name=validator.trim(name);
        department=validator.trim(department);
        rollNo=validator.trim(rollNo);
        cgpa=validator.trim(cgpa);

        //doing validation checks on the input fields
        if(name=="")
            alert("name cant be empty");
        else if(department=="")
            alert("department cant be empty");
        else if(rollNo=="")
            alert("rollNo cant be empty");
        else if(cgpa=="")
            alert("cgpa cant be empty");
        else if(validator.isInt(rollNo,{min:1})==false)
            alert('Roll no should be an integer greater than 0');
        else if(validator.isFloat(cgpa,{min:0,max:10})==false)
            alert('CGPA should be a float between 0-10');
        else if(validator.isAlpha(department)==false)
            alert('Department should contain only letters')
        else if(validator.isAlpha(name)==false)
            alert('Name should contain only letters')
        else{
            //making a post request to add a student in the database
            $.post('/addStudent',
                 {name: name,
                  department: department,
                  rollNo: rollNo,
                  cgpa: cgpa})
            .done(function(result){
                refreshAllStudents(result);
            })
            .fail(function(xhr,status,error){
                  alert('Error adding the student, make sure roll no. is unique');
            })
        }

    }

//function to refresh the list of all students
    function refreshAllStudents(allStudents) {
         $('#allStudents').html('');
         for (var student of allStudents) {
         var newStudent = $('<li style="margin-right: 20px" class="row alert alert-warning alert-dismissible fade show" role="alert">' +
                 '<div class="col-md-3">'+student.rollNo+'</div>'+
                 '<div class="col-md-3">'+student.name+'</div>'+
                 '<div class="col-md-3">'+student.department+'</div>'+
                 '<div class="col-md-3">'+student.cgpa +'<button eid="'+student._id+'" type="button" class="edit btn-success" style="float: right">Edit</button></div>'+
                 ' <button id="'+student._id+'" type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>'+
                 '</li>');
         newStudent.appendTo('#allStudents');
         }
    }

//removing a student from the database
    $('#allStudents').on('click','.close',function () {
        $.post('/removeStudent',
            {studentId: $(this).attr('id')},
            function(allStudents){
                    refreshAllStudents(allStudents);
            })
    });

//this opens up the editbox with prefilled data
    $('#allStudents').on('click','.edit',function () {
            studentId=$(this).attr('eid');
        $.get('/student/'+$(this).attr('eid'),function(doc){
            $('#ename').val(doc.name);
            $('#edepartment').val(doc.department);
            $('#erollNo').val(doc.rollNo);
            $('#ecgpa').val(doc.cgpa);
            var ele=document.getElementById('edit');
            if(ele.style.display=='none')
                ele.style.display='block';
        })
    });

//this is used to edit the student in the database
    window.edit=function(){
       var student={
             id: studentId,
             name: $('#ename').val(),
             department: $('#edepartment').val(),
             rollNo: $('#erollNo').val(),
             cgpa: $('#ecgpa').val()
       };
       $.post('/editStudent',student)
       .done(function(result){
            refreshAllStudents(result);
            $("#edit").fadeToggle();
       })
       .fail(function(xhr,status,error){
            alert('Cant update student, make sure roll no. is unique')
            $("#edit").fadeToggle();
       })
    }

//clicking the cancel button in the editbox is handled here
    window.cancel=function(){
       $("#edit").fadeToggle();
    }

//get all the students
    $.get('/allStudents', function (allStudents) {
            refreshAllStudents(allStudents);
         }
    );
})