'use strict';
$(function() {
    var $studentListingContainer = $('.student-listing-container').parent();
    var $studentDataContainer = $('.student-data-container').parent();
    var $studentFormContainer = $('.student-form-container').parent();
    var $studentTableBody = $('tbody');
    $studentDataContainer.hide();
    $studentFormContainer.hide();
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
        return $('<tr>').attr("id", student.id).append($firstNameTd, $lastNameTd, $actionsTd);
    }
    $studentTableBody.empty();
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
    function studentForm(student){
    	$(".course-group").remove();
    	var $studentNameSpan = $('.student-full-name').html(student.first_name+" " + student.last_name);
    	$('.student-age').html(student.age);
    	if(student.at_university === true){
    	$('.student-at-university').html('Yes');
    	}else $('.student-at-university').html('No');
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
		url: "https://spalah-js-students.herokuapp.com/students/" + $(this).parents("tr").attr("id"),
		contentType: "aplication/json",
		dataType:"json",
		success: function (students){
			studentForm(students.data);
		}
	})
	});
	$('.student-data-container').on("click", ".btn-default:last", function(){
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
		$studentFormContainer.slideUp(300, function(){
		$studentListingContainer.slideDown(300);
		});
	});
});