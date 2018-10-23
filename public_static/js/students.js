$(function(){
    window.validate=function(){
        var rollNo=$('#rollNo').val();

        //sanitizing the input field by removing whitespaces
        rollNo=validator.trim(rollNo);

        //doing validation checks on the input field
        if(rollNo=="")
            alert("Roll no field cant be empty");
        else if(validator.isInt(rollNo,{min:1})==false)
            alert('Roll no should be an integer greater than 0');
        else{
            //making a post request to register the student for the company
            $.post('/registerStudent',{rollNo: rollNo})
            .done(function(result){
                        refreshStudents(result);
                    })
            .fail(function(xhr,status,err){
                if(xhr.responseText=='not found')
                    alert('Student not present in database, Add the student in the "All Students" section');
                else if(xhr.responseText=='present')
                    alert('Student already registered for the company');
            })
        }
    }

//function to refresh the list of students
    function refreshStudents(docs) {
         $('#students').html('');
         for (var doc of docs) {
         var newStudent= $('<li style="margin-right: 20px" class="row alert alert-warning alert-dismissible fade show" role="alert">' +
                            '<div class="col-md-3">'+doc.student.rollNo+'</div>'+
                            '<div class="col-md-3">'+doc.student.name+'</div>'+
                            '<div class="col-md-3">'+doc.student.department+'</div>'+
                            '<div class="col-md-3">'+doc.student.cgpa +'</div>'+
                            '<button id="'+doc.student._id+'" type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>'+
                            '</li>');
         newStudent.appendTo('#students');
         }
    }

//getting the current selected company name
    $.get('/currentCompany',function(name){
        console.log('changing name');
        $('#heading').text(name+ ' students');
    })

//unregistering a student from a company
    $('#students').on('click','.close',function () {
        $.post('/unregisterStudent',
            {studentId: $(this).attr('id')},
            function(docs){
                    refreshAllStudents(docs);
            })
    });

//get all the students for the selected company
    $.get('/students', function (docs) {
            console.log('refreshing students');
            refreshStudents(docs);
         }
    );
})