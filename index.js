'use strict';
$(function() {
    var $studentListingContainer = $('.student-listing-container').parent();
    var $studentDataContainer = $('.student-data-container').parent();
    var $studentFormContainer = $('.student-form-container').parent();
    var $studentTableBody = $('tbody');
    var $studentSelect = $('.form-control.student-age');
	var $alertSuccess = $(".student-listing-container .alert-success");
	var $alertUpdate = $(".student-data-container .alert-success");
	var $listError = $(".alert-danger");
	$listError.hide();
	$alertSuccess.hide();
	$alertUpdate.hide();
    $studentDataContainer.hide();
    $studentFormContainer.hide();
    var $cloneCourse  = $("input.student-course:first").parent().clone();
    var checkedEdit = false;
    var $studentId = "";
    var $checkedShow = false;
	for (var i = 1; i < 100; i++){
        $studentSelect.append($('<option>').html(i));
    }
	
	function clearForm(){
        $("form input").val('');
        $("form select").val("");
		for (var i = $('input.student-course').length; i > 1; i--){
			$('input.student-course').eq(i).parent().remove();
		}		
	}
	$('list-group-item:first').hide();
    $('.add-course').click(function(){
        var $thisCourse = $cloneCourse.clone();
        $thisCourse.insertBefore($(".form-group.has-error"));
        $thisCourse.find("label").html("Course " + $(".form-control.student-course").length + ":");
        event.preventDefault();
    });
// Удаление курса
    $("form").on("click", ".remove-course", function(){
        if($('input.student-course').length < 3){
            event.preventDefault();
            return;
        }else{
            $(this).parent().remove();
             $('input.student-course').parent().find("label").each(function (index){
                $(this).html('Course ' + (index + 1) + ":");
            });
        }
         event.preventDefault();
    });

    function studentRowView(student) {
        var $firstNameTd = $('<td>').html(student.first_name);
        var $lastNameTd = $('<td>').html(student.last_name);
        var $studentShowAnchor = $('<a>').html('Show').addClass('btn btn-default')
                                                                 .attr('href', '#');
        var $studentEditAnchor = $('<a>').html('Edit').addClass('btn btn-primary')
                                                                 .attr('href', '#');
        var $studentDeleteAnchor = $('<a>').html('Delete').addClass('btn btn-danger')
                                                                 .attr('href', '#');
        var $actionsTd = $('<td>').append($studentShowAnchor, $studentEditAnchor, $studentDeleteAnchor);
        return $('<tr>').data("id", student.id).append($firstNameTd, $lastNameTd, $actionsTd);
    }
    $studentTableBody.empty();
    function updateListnigContainer(){
        $.get({
            url: 'https://spalah-js-students.herokuapp.com/students',
            contentType: "application/json",
            dataType: 'json',
            success: function(students) {
                $.each(students.data, function(index, student) {
                    $studentTableBody.append(studentRowView(student));
                });
            }
        });
    }
        updateListnigContainer();
		
    function studentForm(){
       $.get({
        url: "https://spalah-js-students.herokuapp.com/students/" + $studentId,
            contentType: "aplication/json",
            dataType:"json",
            success: function (students){
				$(".course-group").remove();
				var $studentNameSpan = $('.student-full-name').html(students.data.first_name+" " + 	students.data.last_name);
				$('span.student-age').html(students.data.age);
				if(students.data.at_university === true){
					$('span.student-at-university').html('Yes');
				}else $('span.student-at-university').html('No');
				$.each(students.data.courses, function(index, course){
					$('.student-data-group:last').append($("<div>").addClass("course-group")
					.append($("<b>").html("Course" + (index + 1) + ":"))
					.append($("<span>").addClass("student-course").html(course)));
        });
           }
      })		
    }
// Кнопка Show
    $('.student-listing-container').on("click", ".btn-default", function(){
            $checkedShow = true;
            $studentId = $(this).parents("tr").data("id");
            $studentListingContainer.slideUp(300, function(){
            $studentDataContainer.slideDown(300);
            });
			studentForm();
    });
    $('.student-data-container').on("click", ".btn-default:last", function(){
		$studentId = "";
		checkedEdit = false;		
        $studentTableBody.empty();
        updateListnigContainer();
        $checkedShow = false;
        $studentDataContainer.slideUp(300, function(){
        $studentListingContainer.slideDown(300);
        });
    });
		// Кнопка Add-student
    $('.student-listing-container').on("click", ".btn-success", function(){
        $studentListingContainer.slideUp(300, function(){
        $studentFormContainer.slideDown(300);
        });
		clearForm();
		$listError.hide();
    });
	
    $('form').on("click", "a.btn-default", function(){
        $studentTableBody.empty();
        updateListnigContainer();
        $studentFormContainer.slideUp(300, function(){
        $studentListingContainer.slideDown(300);
        });
		clearForm();
		$('form .form-control').css('box-shadow', 'none');
		$listError.hide();
		
    });

	// Сабмит обработчик
    $('form').submit(function(event) {
        var $courses = [];
        var editProof;

        $('input.student-course').each(function (index){
            $courses.push($(this).val());
        })      
        var new_student_data = {student:{
                first_name: $("input.first-name").val(),
                last_name : $("input.last-name").val(),
                age: $('select.student-age').val(),
                at_university: $("input.student-at-university").prop("checked"),
                courses: $courses
                }};
                if(checkedEdit){
                    editProof = "PUT";
                }else{ 
                    editProof = "POST";
                }
             $.ajax({
                url:"https://spalah-js-students.herokuapp.com/students/" + $studentId,
                data: new_student_data,
                type: editProof,
                dataType:"json",
                success: function (data){
					$('.list-group-item').remove();
                    if (data.errors) {
                        $('.alert-danger').fadeIn(500);
                        $.each(data.errors, function(index, error){
                             var $error_li = $('<li>').addClass('list-group-item').text(error);
                             $('ul').append($error_li);
                        });
                    }else{
                        if(checkedEdit){   
							studentForm();
							$checkedShow = true;
							$studentFormContainer.slideUp(300, function(){
								$studentDataContainer.slideDown(300,function(){
									$alertUpdate.fadeIn(600).delay(2000).fadeOut(600);
								});
                            });
                        }else{ 						
                            $studentTableBody.empty();
                            updateListnigContainer();
                            $studentFormContainer.slideUp(300, function(){
                                $studentListingContainer.slideDown(300, function(){
									$alertSuccess.fadeIn(600).delay(2000).fadeOut(600);
								});
                            });
                         }
                    }

                },
            });
		$('form .form-control').css('box-shadow', 'none');	
        event.preventDefault();
    });
	// Кнопка Delete
    $('.student-listing-container').on("click",".btn-danger", function(){
       var questDelete =  confirm("Вы действително хотите удалить сутдента?");
       if (questDelete){
            $.ajax({
                url:"https://spalah-js-students.herokuapp.com/students/" + $(this).parents("tr").data("id"),
                type: 'DELETE',
                contentType: "aplication/json",
                dataType:"json",
                success: function (){
                    $studentTableBody.empty();
                    updateListnigContainer();
                }
            });
        }   
        event.preventDefault();
    });
	// Кнопка Edit
    $(document).on("click",".btn-primary", function(event){
		checkedEdit = true;
        if (!$checkedShow){
             $studentId = $(this).parents("tr").data("id");
             $studentListingContainer.slideUp(300, function(){
                 $studentFormContainer.slideDown(300);
             });
        }else{
            $studentDataContainer.slideUp(300, function(){
                 $studentFormContainer.slideDown(300);
             });
        } 
		
            $.get({
            url: "https://spalah-js-students.herokuapp.com/students/" + $studentId,
            contentType: "aplication/json",
            dataType:"json",
            success: function (students){
				for (var i = 0; i < students.data.courses.length - 2; i++){
					var $thisCourse = $cloneCourse.clone();
					$thisCourse.insertBefore($(".form-group.has-error"));
					$thisCourse.find("label").html("Course " + $(".form-control.student-course").length + ":");					
				}					
				$.each(students.data, function (student,indsex){
					$('input.first-name').val(students.data.first_name);
					$('input.last-name').val(students.data.last_name);
					$('form select').val(students.data.age);
					$("input.student-at-university").prop('checked', students.data.at_university);				
					$("input.student-course").each (function(index){
						$(this).val(students.data.courses[index]);
					});
             })
            }
        })

        event.preventDefault();
    });
			// Проверка на Ошибки при вводе
		function checkInputName(){
			if($(this).val().length < 3 || !/^[A-Z][a-z]*$/.test($(this).val())){
				$(this).css("box-shadow", "0 0 5px rgba(255, 0, 0, 1)");
			}else{
				$(this).css("box-shadow", "0 0 5px rgba(0, 255, 0, 1)");
			} 	
		}			
			
		$(".first-name").keyup(checkInputName);
		$(".last-name").keyup(checkInputName);
		
		// Проверка курсов
		$("form").on("keyup", "input.student-course", function(){
			if($(this).val().length < 3 || !/^[A-Za-z\s]*$/.test($(this).val())){
				$(this).css("box-shadow", "0 0 5px rgba(255, 0, 0, 1)");
			}else{
				$(this).css("box-shadow", "0 0 5px rgba(0, 255, 0, 1)");
			} 				
		})
		$("select.student-age").change(function(){
			if (!($(this).val() >= 1) && !($(this).val() <= 99)){
				$(this).css("box-shadow", "0 0 5px rgba(255, 0, 0, 1)");
			}else{
				$(this).css("box-shadow", "0 0 5px rgba(0, 255, 0, 1)");
			}
			//if ()
		})
});