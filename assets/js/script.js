
var taskIdCounter = 0;
var formEl = document.querySelector("#task-form");
var taskToDoEl = document.querySelector("#tasks-to-do");
var pageContentEl = document.querySelector("#page-content");
var taskInProgressEl = document.querySelector("#tasks-in-progress");
var taskCompletedEl = document.querySelector("#tasks-completed");


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

    var isEdit = formEl.hasAttribute("data-task-id");

    //has data attribute, so get task id and call function to complete edit process
    if (isEdit) {
        var taskId = formEl.getAttribute("data-task-id");
        completeEditTask(taskNameInput, taskTypeInput, taskId);
    }
    //no dara attribute, so create new object as normal
    else {
        var taskDataObj = {
            name: taskNameInput,
            type: taskTypeInput
        };
        createTaskEl(taskDataObj); //This way createEl will only get called if isEdit is false
    }  
       
}

var completeEditTask = function(taskName, taskType, taskId) {
    var taskSelected = document.querySelector(".task-item[data-task-id='"+ taskId + "']");
    
    //set new values
    taskSelected.querySelector("h3.task-name").textContent = taskName;
    taskSelected.querySelector("span.task-type").textContent = taskType;

    window.alert("Task updated!");

    //set formEl task id to stop
    formEl.removeAttribute("data-task-id");
    document.querySelector("#save-task").textContent = "Add Task";
}

var createTaskEl = function(taskDataObj) {
    //create list item
    var listItemEl = document.createElement("li");
    listItemEl.className = "task-item";

    //Create unique id for the list items
   listItemEl.setAttribute("data-task-id", taskIdCounter);

    //create div to hold task and add to list item
    var taskInfoEl = document.createElement("div");
    //give it a class name
    taskInfoEl.className = "task-info";
    //add HTML content to div
    taskInfoEl.innerHTML = "<h3 class = 'task-name'>" + taskDataObj.name + "</h3><span class = 'task-type'>" + taskDataObj.type + "</span>";

    listItemEl.appendChild(taskInfoEl);

    var taskActionsEl = createTaskActions(taskIdCounter);
    listItemEl.appendChild(taskActionsEl);
   
    //add entire list item to list
    taskToDoEl.appendChild(listItemEl);

    taskIdCounter++;

}


var createTaskActions = function (taskId) {
    var actionContainerEl = document.createElement("div");
    actionContainerEl.className = "task-actions";

    //create the edit button
    var editButtonEl = document.createElement("button");
    editButtonEl.textContent = "Edit";
    editButtonEl.className = "btn edit-btn";
    editButtonEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(editButtonEl);

    //create the delete button

    var deleteButtonEl = document.createElement("button");
    deleteButtonEl.textContent = "Delete";
    deleteButtonEl.className = "btn delete-btn";
    deleteButtonEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(deleteButtonEl);


    //create the dropdown 
    var statusSelectEl = document.createElement("select");
    statusSelectEl.className = "select-status";
    statusSelectEl.setAttribute("name", "status-change");
    statusSelectEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(statusSelectEl);

    var statusChoices = ["To Do", "In Progress", "Completed"];
        for(var i =0 ; i < statusChoices.length; i++) {
            //create option element
            var statusOptionEl = document.createElement("option");
            statusOptionEl.textContent = statusChoices[i];
            statusOptionEl.setAttribute("value", statusChoices[i]);

            //append to select
            statusSelectEl.appendChild(statusOptionEl);
        }

        return actionContainerEl;

}

//task button Handler

var taskButtonHandler = function(event) {
    var targetEl = event.target;
    //edit button was clicked
    if(targetEl.matches(".edit-btn")) {
        //get the element's task id
        var taskId = targetEl.getAttribute("data-task-id");
        editTask(taskId);
    }

    //delete button was clicked
    if(targetEl.matches(".delete-btn")) {
        //get the element's task id
        var taskId = targetEl.getAttribute("data-task-id");
        deleteTask(taskId);
    }
}

var deleteTask = function(taskId) {
    var taskSelected = document.querySelector(".task-item[data-task-id='"+ taskId + "']");
    //console.log(taskSelected);
    taskSelected.remove();
}

var editTask = function(taskId) {
    var taskSelected = document.querySelector(".task-item[data-task-id='"+ taskId + "']");
    //console.log(taskSelected);
   
    //get the content from task Name and Type
    var taskName = taskSelected.querySelector("h3.task-name").textContent;
    var taskType = taskSelected.querySelector("span.task-type").textContent;
    document.querySelector("input[name = 'task-name']").value = taskName;
    document.querySelector("select[name = 'task-type']").value = taskType;
    document.querySelector("#save-task").textContent = "Save Task";

    formEl.setAttribute("data-task-id", taskId);
}

var taskStatusChangeHandler =function(event) {
    //get taskId of the target 
    var taskId = event.target.getAttribute("data-task-id");

    //get the currently selected option's value and convert to lowercase
    var statusValue = event.target.value.toLowerCase();

    var taskSelected = document.querySelector(".task-item[data-task-id='"+ taskId + "']");

    if(statusValue === "to do"){
        tasksToDoEl.appendChild(taskSelected);
    }else if (statusValue == "in progress") {
        taskInProgressEl.appendChild(taskSelected);
    }else if (statusValue === "completed") {
        taskCompletedEl.appendChild(taskSelected);
    }
}

formEl.addEventListener("submit", taskFormHandler);
pageContentEl.addEventListener("click", taskButtonHandler);
pageContentEl.addEventListener("change", taskStatusChangeHandler);
