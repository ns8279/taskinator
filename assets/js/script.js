
var taskIdCounter = 0;
var formEl = document.querySelector("#task-form");
var taskToDoEl = document.querySelector("#tasks-to-do");
var pageContentEl = document.querySelector("#page-content");
var taskInProgressEl = document.querySelector("#tasks-in-progress");
var taskCompletedEl = document.querySelector("#tasks-completed");
var tasks = [];


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
            type: taskTypeInput,
            status: "to do"
        };
        createTaskEl(taskDataObj); //This way createEl will only get called if isEdit is false
    }  
       
}

var completeEditTask = function(taskName, taskType, taskId) {
    var taskSelected = document.querySelector(".task-item[data-task-id='"+ taskId + "']");
    
    //set new values
    taskSelected.querySelector("h3.task-name").textContent = taskName;
    taskSelected.querySelector("span.task-type").textContent = taskType;

    //loop through tasks array and task object with new content
    for (var i =0; i <tasks.length; i++){
        if(tasks[i] === parseInt(taskId)){
            tasks[i].name = taskName;
            tasks[i].type = taskType;
        }
    }

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
   listItemEl.setAttribute("draggable", "true");

    //create div to hold task and add to list item
    var taskInfoEl = document.createElement("div");
    //give it a class name
    taskInfoEl.className = "task-info";
    //add HTML content to div
    taskInfoEl.innerHTML = "<h3 class = 'task-name'>" + taskDataObj.name + "</h3><span class = 'task-type'>" + taskDataObj.type + "</span>";

    listItemEl.appendChild(taskInfoEl);

    taskDataObj.id = taskIdCounter;
    tasks.push(taskDataObj);

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

    //create a new array to hold updated list of tasks
    var updatedTaskArr = [];

    //loop through current tasks
    for (var i =0; i< tasks.length; i++){
        //if tasks[i] is not equal to the taskId lets keep that task and push it into the new array
        if(tasks[i].id !== parseInt(taskId)){
            updatedTaskArr.push(tasks[i]);
        }
    }

    //reassign the tasks array to updated tasks array
    tasks = updatedTaskArr;


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

    //update task's in task array
    for (var i = 0; i< tasks.length; i++){
        if(tasks[i].id === parseInt(taskId)){
            tasks[i].status = statusValue;
        }
    }
}

var dragStartHandler = function(event) {
    var taskId = event.target.getAttribute ("data-task-id");
    event.dataTransfer.setData("text/plain", taskId);
    var getId = event.dataTransfer.getData("getId:", getId, typeof getId);
}

var dropZoneDragHandler = function(event){
    //console.log("Dragover Event Target:" , event.target);
    var taskListEl = event.target.closest(".task-list");
    if (taskListEl) {
        event.preventDefault(); 
        taskListEl.setAttribute("style", "background: rgba(68,233, 255, 0.7); border-style:dashed;");
       // console.dir(taskListEl);
    }
   
}

var dropTaskHandler = function(event){
    var id = event.dataTransfer.getData("text/plain");
    //console.log("Drop Traget event:", event.target, event.dataTrasfer, id);
    var draggableElement = document.querySelector("[data-task-id='" + id + "']");
    //console.log(draggableElement);
    //console.dir(draggableElement);
    var dropZoneEl = event.target.closest(".task-list");
    var statusType = dropZoneEl.id;
    //console.log(statusType);
    //console.dir(dropZoneEl);

    //set status of task based on dropeZoneId
    var statusSelectEl = draggableElement.querySelector("select[name='status-change']");
    if (statusType === "task-to-do") {
        statusSelectEl.selectedIndex = 0;
    }
    else if (statusType === "tasks-in-progress"){
        statusSelectEl.selectedIndex = 1;
    }
    else if (statusType === "tasks-completed") {
        statusSelectEl.selectedIndex = 2;
    }
    dropZoneEl.appendChild(draggableElement);

    dropZoneEl.removeAttribute("style");

    //loop through tasks array to find and update the updated task status
    for (var i =0; i <tasks.length; i++){
        if(tasks[i] === parseInt(taskId)){
            tasks[i].status = statusSelectEl.value.toLowerCase();
        }
    }


}

var dragLeaveHandler = function(event) {
    var taskListEl = event.target.closest(".task-list");
    if (taskListEl) {
        taskListEl.removeAttribute("style");
    }
}

formEl.addEventListener("submit", taskFormHandler);
pageContentEl.addEventListener("click", taskButtonHandler);
pageContentEl.addEventListener("change", taskStatusChangeHandler);
pageContentEl.addEventListener("dragstart", dragStartHandler);
pageContentEl.addEventListener("drop", dropTaskHandler);
pageContentEl.addEventListener("dragover", dropZoneDragHandler);
pageContentEl.addEventListener("dragleave", dragLeaveHandler);
