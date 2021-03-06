var formEl = document.querySelector("#task-form");
var taskToDoEl = document.querySelector("#tasks-to-do");



var taskFormHandler = function( event){

    event.preventDefault();

    var taskNameInput = document.querySelector("input[name='task-name']").value;
    var taskTypeInput = document.querySelector("select[name = 'task-type']").value;

    //check if the form input have empty strings
    if(!taskNameInput || !taskTypeInput) {
        window.alert("You need to fill out the task form to proceed!");
        return false;
    }

    formEl.reset();  //this will automatically reset the form's input feilds to empty after the user submits one task

    //package up data as an object
    var taskFormData = {
        name: taskNameInput,
        type: taskTypeInput
    };

    //send it as an argument to the createTaskEl function
    createTaskEl(taskFormData);
    
}

var createTaskEl = function(taskDataObj) {
    //create list item
    var listItemEl = document.createElement("li");
    listItemEl.className = "task-item";

    //create div to hold task and add to list item
    var taskInfoEl = document.createElement("div");
    //give it a class name
    taskInfoEl.className = "task-info";
    //add HTML content to div
    taskInfoEl.innerHTML = "<h3 class = 'task-name'>" + taskDataObj.name + "</h3><span class = 'task-type'>" + taskDataObj.type + "</span>";

    listItemEl.appendChild(taskInfoEl);
    //add entire list item to list
    taskToDoEl.appendChild(listItemEl);

}

formEl.addEventListener("submit", taskFormHandler);
