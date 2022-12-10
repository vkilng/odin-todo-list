import { app } from "./ApplicationLogic";

const displayFilteredTasks = (filter) => {
    const containerArray = app.getContainer().getContainerArray();
    const contentDiv = document.querySelector('.main-content');
    contentDiv.textContent = '';
    const filteredTasksContainer = document.createElement('div');
    filteredTasksContainer.classList.add('filtered-tasks-container');
    contentDiv.appendChild(filteredTasksContainer);
    filteredTasksContainer.textContent = '';
    containerArray.forEach((projectObj) => {
        const todoList = projectObj.getTodoList();
        todoList.forEach((todoObj,index) => {
            if (filter === 'today') {
                if (todoObj.getDueDate() === new Date().toDateString()) displayTodo(filter,projectObj,index);
            }
            if (filter === 'high') {
                if (todoObj.getPriority() === 'high') displayTodo(filter,projectObj,index);
            }
        })
    })
}
//displayFilteredTasks();

const displayTodo = (filter ,project, todoIndex) => {
    const filteredTasksContainer = document.querySelector('.filtered-tasks-container');
    const todoObj = project.getTodoList()[todoIndex];
    const todoDiv = document.createElement('div');
    todoDiv.classList.add('todo');
    if (todoObj.isActive()) todoDiv.classList.add('active');
    else todoDiv.classList.add('completed');
    filteredTasksContainer.insertAdjacentElement('afterbegin',todoDiv);
    const leftDiv = document.createElement('div');
    todoDiv.appendChild(leftDiv);
    const tickIcon = document.createElement('i');
    tickIcon.classList.add('material-symbols-rounded');
    tickIcon.innerHTML = '&#xe86c';
    leftDiv.appendChild(tickIcon);
    //Set task to completed event
    if (todoObj.isActive()) {tickIcon.addEventListener('click',() => {
        project.setTodoToCompleted(todoIndex);
        todoDiv.classList.remove('active');
        todoDiv.classList.add('completed');
        displayFilteredTasks(filter);
        return;
    })}
    const todoTitleDiv = document.createElement('div');
    todoTitleDiv.textContent = todoObj.getTitle();
    leftDiv.appendChild(todoTitleDiv);
    //Clicking on the title will trigger editTodo function
    if (todoObj.isActive()) {todoTitleDiv.addEventListener('click',() => {
        const editTodoPopUp = document.querySelector('.edit-todo-popup');
        if (editTodoPopUp) editTodoPopUp.remove();
        editTodo(todoObj);
    })}
    if (todoObj.getPriority() !== 'none' && todoObj.isActive()) {
        const priorityFlagDiv = document.createElement('div');
        priorityFlagDiv.classList.add('priority-flag');
        priorityFlagDiv.textContent = todoObj.getPriority();
        if (todoObj.getPriority() === 'low') priorityFlagDiv.classList.add('low');
        if (todoObj.getPriority() === 'high') priorityFlagDiv.classList.add('high');
        leftDiv.appendChild(priorityFlagDiv);
    }
    const rightDiv = document.createElement('div');
    todoDiv.appendChild(rightDiv);
    const dueDateDiv = document.createElement('div');
    dueDateDiv.textContent = todoObj.getDueDate();
    rightDiv.appendChild(dueDateDiv);
    const deleteTodoIcon = document.createElement('i');
    deleteTodoIcon.classList.add('material-symbols-rounded');
    deleteTodoIcon.innerHTML = '&#xe872';
    rightDiv.appendChild(deleteTodoIcon);
    deleteTodoIcon.addEventListener('click',() => {
        project.removeTodo(todoObj.isActive(),todoIndex);
        displayFilteredTasks(filter);
        return;
    })
}

export default displayFilteredTasks;