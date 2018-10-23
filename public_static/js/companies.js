$(function(){
    window.validate=function(){
        var name=$("#name").val();
        var position=$("#position").val();
        var package=$("#package").val();
        var location=$("#location").val();

        //sanitizing the input fields by removing whitespaces
        name=validator.trim(name);
        position=validator.trim(position);
        package=validator.trim(package);
        location=validator.trim(location);

        //doing validation checks on input fields
        if(name=="")
            alert("name cant be empty");
        else if(position=="")
            alert("position cant be empty");
        else if(package=="")
            alert("package cant be empty");
        else if(location=="")
            alert("location cant be empty");
        else if(validator.isFloat(package)==false)
            alert('Package should be a float')
        else{
            //making a post request to register the company
            $.post('/registerCompany',
                 {name: name,
                  position: position,
                  package: package,
                  location: location})
            .done(function(result){
                            refreshCompanies(result);
                  })
            .fail(function(xhr,status,error){
                 alert('Error registering the company, make sure company name is unique');
            })
        }
    }

//function to refresh the list of companies
    function refreshCompanies(companies) {
         $('#companies').html('');
         for (var company of companies) {

var newCompany=$('<li style="margin-right: 20px" class="row alert alert-warning alert-dismissible fade show" role="alert">' +
                    '<div class="col-md-3">'+company.name+'</div>'+
                 '<div class="col-md-3">'+company.position+'</div>'+
                 '<div class="col-md-3">'+company.package+'</div>'+
                 '<div class="col-md-3">'+company.location +'<button id="'+company._id+'" class="register btn-xs btn-success " style="float: right">Register student</button></div>'+
                    ' <button id="'+company._id+'" type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></li>');
            newCompany.appendTo('#companies');
         }
    }

//showing the list of students registered for the selected company
    $('#companies').on('click','.register',function () {
        window.open('/renderStudents/'+$(this).attr('id'),'_self');
    });

//unregistering a company
    $('#companies').on('click','.close',function () {
        $.post('/unregisterCompany',
            {companyId: $(this).attr('id')},
            function(result){
                    if(result=='error')
                        alert('error')
                    else
                        refreshCompanies(result);
            })
    });

//getting the list of all the companies
    $.get('/companies', function (companies) {
            console.log('refreshing companies');
            refreshCompanies(companies);
         }
    );
})