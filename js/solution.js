/**
 * @author ethanleenz@gmail.com (Ethan Lee)
 * Solution to ProWorkflow's test
 */

/**
 * Simple application with jQuery
 */

'use strict';
$(document).ready(function () {
//    var PROJECT_URL = "http://dev.proworkflow.com/test/projects.json";
//    var PROJECT_CATEGORY = "http://dev.proworkflow.com/test/projects.json";

    //use the local copy due to cross domain issue
    /**
     * @const {string} data URLs
     */
    var PROJECT_URL = 'data/projects.json';
    var PROJECT_CATEGORY = 'data/projectcat.json';

    /**
     * @const {string} success status
     */
    var SUCCESS = 'success';

    var projects, projectcat;

    var $projListDiv = $('div#project-list');
    var $tblRows = $('table#project-detail>tbody>tr');

    //1. Use JQuery to do AJAX POST/GET to fetch a JSON data from the URLs below:
    $.when(
        $.getJSON(PROJECT_URL)
            .fail(function (jqXHR, textStatus, errorThrown) {
                $projListDiv.append('<p class="error">Error when getting data from ' + PROJECT_URL + ' ' + jqXHR.status + ' ' + textStatus + ' ' + errorThrown + '</p>');
            }),
        $.getJSON(PROJECT_CATEGORY)
            .fail(function (jqXHR, textStatus, errorThrown) {
                $projListDiv.append('<p class="error">Error when getting data from ' + PROJECT_CATEGORY + ' ' + jqXHR.status + ' ' + textStatus + ' ' + errorThrown + '</p>');
            }))
        //2. store the JSON data in objects
        .done(function (data1, data2) {
            if (data1[1] === SUCCESS && data2[1] === SUCCESS) {
                projects = data1[0];
                projectcat = data2[0];
                if (projects && projectcat) {
                    var $ulElem;
                    // 3. List all the projects grouped by project categories. Use the JSON data from projectcat.json file to loop the categories and then loop the projects.json data to lookup the projects under that category. Only display the project title in the list of projects
                    for (var i = 0; i < projectcat.jobcategory.length; i++) {
                        //insert ul element for each category
                        $ulElem = $(document.createElement('ul'));
                        for (var j = 0; j < projects.job.length; j++) {
                            if (projects.job[j].PROJECTCATID === projectcat.jobcategory[i].ID) {
                                //add li element to the created ul
                                projects.job[j].TITLE = projectcat.jobcategory[i].TITLE;//JSON data in two files is joined in projects.job[j] object
                                var liElem = document.createElement('li');
                                $(liElem).attr('id',projects.job[j].JOBID);
                                $(liElem).text(projects.job[j].JOBTITLE);
                                //use IIFE to bind the current obj to callback functions
//                                $(liElem).click((function (projectObj) {
//                                    return function () {
//                                        //solution to test4. Bind a click function on the project title and display the project details in a separate DIV once the title is clicked.
//                                        updateDetails($tblRows, projectObj);
//                                    }
//                                })(projects.job[j]));
                                $ulElem.append(liElem);
                            }
                        }
                        if ($ulElem.children().length !== 0) {
                            //only insert a category if there are projects under it
                            $projListDiv.append('<h3>' + projectcat.jobcategory[i].TITLE) + '</h3>';
                            $projListDiv.append($ulElem);
                        }
                    }
                    //bind a click event on the parent div
                    $('#project-list').click((function(projects){
                        return function(event){
                            if($(event.target).is('li')){
                                var curObj;
                                var curObjId = $(event.target).attr('id');
                                for(var i=0; i<projects.job.length; i++){
                                    if(projects.job[i].JOBID===curObjId){
                                        curObj = projects.job[i];
                                        break;
                                    }
                                }
                                if(curObj) {
                                    updateDetails($tblRows, curObj)
                                }
                            }
                        }
                    })(projects));
                } else {
                    $projListDiv.append('<p class="error">Data is not complete!</p>');
                }
            } else {
                $projListDiv.append('<p class="error">Error getting data. status code: ' + data1[1] + ' ' + data2[1] + ' </p>');
            }
        });
});


/**
 *  Update the details of the project in the table element
 *  @param $tblRows {jQuery object} the rows of project detail table
 *  @param curObj {object} the project object that is clicked
 */
function updateDetails($tblRows, curObj) {
    $tblRows.children('td#jobNumber').text(curObj.JOBNUMBER ? curObj.JOBNUMBER : 'N/A');
    $tblRows.children('td#companyName').text(curObj.COMPANYNAME ? curObj.COMPANYNAME : 'N/A');
    $tblRows.children('td#contactName').text(curObj.CONTACTNAME ? curObj.CONTACTNAME : 'N/A');
    $tblRows.children('td#jobPriority').text(curObj.JOBPRIORITY ? curObj.JOBPRIORITY : 'N/A');
    $tblRows.children('td#startDate').text(curObj.STARTDATE ? curObj.STARTDATE : 'N/A');
    $tblRows.children('td#dueDate').text(curObj.DUEDATE ? curObj.DUEDATE : 'N/A');
}
