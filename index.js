'use strict';
$(function() {
    var $studentListingContainer = $('.student-listing-container').parent();
    var $studentDataContainer = $('.student-data-container').parent();
    var $studentFormContainer = $('.student-form-container').parent();
    var $studentTableBody = $('tbody');
	var $studentSelect = $('.form-control.student-age');
    $studentDataContainer.hide();
    $studentFormContainer.hide();
	var $cloneCourse  = $("input.student-course:first").parent().clone();
	$('.add-course').click(function(){
		var $thisCourse = $cloneCourse.clone();
		$thisCourse.before($(".form-group.has-error"));
		$thisCourse.find("label").html("Course " + $(".form-control.student-course").length + ":");
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
    function studentForm(student){
    	$(".course-group").remove();
    	var $studentNameSpan = $('.student-full-name').html(student.first_name+" " + student.last_name);
    	$('span.student-age').html(student.age);
    	if(student.at_university === true){
    	$('span.student-at-university').html('Yes');
    	}else $('span.student-at-university').html('No');
    	$.each(student.courses, function(index, course){
    		$('.student-data-group:last').append($("<div>").addClass("course-group")
			.append($("<b>").html("Course" + (index + 1) + ":"))
			.append($("<span>").addClass("student-course").html(course)));
		});
	}

	$('.student-listing-container').on("click", ".btn-default", function(){
		$studentListingContainer.slideUp(300, function(){
		$studentDataContainer.slideDown(300);
		});
		$.get({
		url: "https://spalah-js-students.herokuapp.com/students/" + $(this).parents("tr").data("id"),
		contentType: "aplication/json",
		dataType:"json",
		success: function (students){
			studentForm(students.data);
		}
	})
	});
	$('.student-data-container').on("click", ".btn-default:last", function(){
		$studentTableBody.empty();
		updateListnigContainer();
		$studentDataContainer.slideUp(300, function(){
		$studentListingContainer.slideDown(300);
		});
	});
	$('.student-listing-container').on("click", ".btn-success", function(){
		$studentListingContainer.slideUp(300, function(){
		$studentFormContainer.slideDown(300);
		});
	});
	$('form').on("click", ".btn-default:last", function(){
		$studentTableBody.empty();
		updateListnigContainer();
		$studentFormContainer.slideUp(300, function(){
		$studentListingContainer.slideDown(300);
		});
	});
	   for (var i = 1; i < 100; i++){
        $studentSelect.append($('<option>').html(i));
    }
	$('form').submit(function(event) {
	var $courses = [];
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
        $.post('https://spalah-js-students.herokuapp.com/students/',
                      new_student_data, function(data) {
                        if (data.errors) {
                            $('.alert-danger').fadeIn(500);
                            $.each(data.errors, function(index, error){
                                var $error_li = $('<li>').addClass('list-group-item').text(error);
                                $('ul').append($error_li);
                            });
                        } else {
							$studentTableBody.empty();
							updateListnigContainer();
							$studentFormContainer.slideUp(300, function(){
								$studentListingContainer.slideDown(300);
							});
                        }
                      });
        event.preventDefault();
    });
	$('.student-listing-container').on("click",".btn-danger", function(){
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
		event.preventDefault();
	});
	/*$('.student-listing-container').on("click",".btn-primary", function(){
		$.ajax({
			url:"https://spalah-js-students.herokuapp.com/students/" + $(this).parents("tr").data("id"),
			type: 'PUT',
			contentType: "aplication/json",
			dataType:"json",
			success: function (){
				$studentTableBody.empty();
				updateListnigContainer();
			}
			 new_student_data = {student:{
				first_name: $("input.first-name").val(),
                last_name : $("input.last-name").val(),
                age: $('select.student-age').val(),
				at_university: $("input.student-at-university").prop("checked"),
                courses: $courses
			}};
		});
		event.preventDefault();
	});*/
});