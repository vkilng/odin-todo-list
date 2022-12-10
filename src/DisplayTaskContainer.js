import { app } from './ApplicationLogic';
import updateProjectContainerDisplay from './DisplayProjectContainer';
import { format } from 'date-fns';

const updateTasksContainerDisplay = (projectIndex) => {
    const contentDiv = document.querySelector('.main-content');
    contentDiv.textContent = '';
    const project = app.getContainer().getContainerArray()[projectIndex];
    const tasksContainerDiv = document.createElement('div');
    tasksContainerDiv.classList.add('tasks-container');
    contentDiv.appendChild(tasksContainerDiv);

    const addProjectHeader = (() => {
        const projectHeaderDiv = document.createElement('div');
        projectHeaderDiv.classList.add('project-header');
        tasksContainerDiv.appendChild(projectHeaderDiv);
        const leftHeaderDiv = document.createElement('div');
        leftHeaderDiv.classList.add('left-project-header');
        projectHeaderDiv.appendChild(leftHeaderDiv);
        const goBackToProjectContainerIcon = document.createElement('i');
        goBackToProjectContainerIcon.classList.add('material-symbols-rounded');
        goBackToProjectContainerIcon.innerHTML = '&#xe5c4';
        leftHeaderDiv.appendChild(goBackToProjectContainerIcon);
        goBackToProjectContainerIcon.addEventListener('click',()=>updateProjectContainerDisplay());
        const projectTitleDiv = document.createElement('div');
        projectTitleDiv.textContent = project.getProjectName();
        leftHeaderDiv.appendChild(projectTitleDiv);
        const editProjectNameIcon = document.createElement('i');
        editProjectNameIcon.classList.add('material-symbols-rounded');
        editProjectNameIcon.innerHTML = '&#xe3c9';
        leftHeaderDiv.appendChild(editProjectNameIcon);
        editProjectNameIcon.addEventListener('click',() => {
            editProjectNameIcon.style.pointerEvents = 'none';
            projectTitleDiv.contentEditable = true;
            projectTitleDiv.focus();
            document.addEventListener('keydown',e => {
                if (e.key === 'Enter') {
                    projectTitleDiv.contentEditable = false;
                    project.editProjectName(projectTitleDiv.textContent);
                    editProjectNameIcon.style.pointerEvents = 'auto';
                    return;
                }
            })
            return;
        })
        const middleHeaderDiv = document.createElement('div');
        middleHeaderDiv.classList.add('middle-project-header');
        projectHeaderDiv.appendChild(middleHeaderDiv);
        const addTodoButton = document.createElement('div');
        middleHeaderDiv.appendChild(addTodoButton);
        addTodoButton.insertAdjacentHTML('beforeend','<i class="material-symbols-rounded">&#xe147</i>Add Todo');
        //Add Todo Form DOM code
        const addTodoPopUp = document.createElement('div');
        addTodoPopUp.classList.add('add-todo-popup');
        middleHeaderDiv.appendChild(addTodoPopUp);
        const addTodoForm = document.createElement('form');
        addTodoPopUp.appendChild(addTodoForm);
        const todoTitleInput = document.createElement('input');
        todoTitleInput.setAttribute('type','text');
        todoTitleInput.setAttribute('placeholder','Title');
        todoTitleInput.setAttribute('required','true');
        addTodoForm.appendChild(todoTitleInput);
        todoTitleInput.focus();
        const todoDescriptionInput = document.createElement('input');
        todoDescriptionInput.setAttribute('type','text');
        todoDescriptionInput.setAttribute('placeholder','Description');
        addTodoForm.appendChild(todoDescriptionInput);
        const todoDueDateInput = document.createElement('input');
        todoDueDateInput.setAttribute('type','date');
        todoDueDateInput.setAttribute('min',format(new Date(),'yyyy-LL-dd'));
        todoDueDateInput.setAttribute('value',format((new Date()),'yyyy-LL-dd'));
        addTodoForm.appendChild(todoDueDateInput);
        const todoPriorityDiv = document.createElement('div');
        addTodoForm.appendChild(todoPriorityDiv);
        const todoPrioritySelect = document.createElement('select');
        todoPriorityDiv.appendChild(todoPrioritySelect);
        todoPrioritySelect.insertAdjacentHTML('beforebegin','<span>Priority:</span>');
        todoPrioritySelect.insertAdjacentHTML('beforeend','<option value="none">None</option>');
        todoPrioritySelect.insertAdjacentHTML('beforeend','<option value="low">Low</option>');
        todoPrioritySelect.insertAdjacentHTML('beforeend','<option value="high">High</option>');
        addTodoForm.insertAdjacentHTML('beforeend',"<p><input type='submit' value='Submit' /></p>");
        const addTodoFunction = (() => {
            const toggleAddTodoPopUp = () => {
                addTodoPopUp.classList.toggle('show');
                const addTodoIcon = document.querySelector('.middle-project-header i');
                const iconHex = addTodoIcon.textContent.charCodeAt(0).toString(16);
                addTodoIcon.innerHTML = (iconHex === 'e5c9')?'&#xe147':'&#xe5c9';
            };
            addTodoButton.addEventListener('click',() => {
                toggleAddTodoPopUp();
                return;
            })
            addTodoForm.addEventListener('submit',(e) => {
                e.preventDefault();
                let formattedDate;
                if (todoDueDateInput.value === '') {formattedDate = new Date().toDateString()}
                else {formattedDate = new Date(todoDueDateInput.value).toDateString()};
                project.addTodo(todoTitleInput.value, todoDescriptionInput.value,
                    formattedDate, todoPrioritySelect.value);
                updateTodoListDisplay();
                addTodoForm.reset();
                toggleAddTodoPopUp();
                return;
            })
        })();

        const addTodoIcon = document.createElement('i');
        const rightHeaderDiv = document.createElement('div');
        rightHeaderDiv.classList.add('right-project-header');
        projectHeaderDiv.appendChild(rightHeaderDiv);
        rightHeaderDiv.insertAdjacentHTML('beforeend','<i class="material-symbols-rounded">&#xe16c</i>Delete this project');
        rightHeaderDiv.addEventListener('dblclick',() => {
            app.getContainer().removeProject(projectIndex);
            updateProjectContainerDisplay();
            return;
        })
    })();

    const todoListDiv = document.createElement('div');
    todoListDiv.classList.add('todo-list');
    tasksContainerDiv.appendChild(todoListDiv);

    const updateTodoListDisplay = () => {
        todoListDiv.textContent = '';
        const todoContainerArray = project.getTodoList();

        todoContainerArray.forEach((todoObj,todoIndex) => {
            const todoDiv = document.createElement('div');
            todoDiv.classList.add('todo');
            if (todoObj.isActive()) todoDiv.classList.add('active');
            else todoDiv.classList.add('completed');
            todoListDiv.insertAdjacentElement('afterbegin',todoDiv);
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
                updateTodoListDisplay();
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
                updateTodoListDisplay();
                return;
            })
        })
    }
    updateTodoListDisplay();

    const editTodo = (todoObj) => {
        const editTodoPopUp = document.createElement('div');
        editTodoPopUp.classList.add('edit-todo-popup');
        tasksContainerDiv.appendChild(editTodoPopUp);
        const editTodoForm = document.createElement('span');
        editTodoPopUp.appendChild(editTodoForm);
        const todoTitleDiv = document.createElement('div');
        todoTitleDiv.textContent = todoObj.getTitle();
        todoTitleDiv.contentEditable = true;
        editTodoForm.appendChild(todoTitleDiv);
        const todoDescriptionDiv = document.createElement('div');
        todoDescriptionDiv.contentEditable = true;
        todoDescriptionDiv.textContent = todoObj.getDescription();
        editTodoForm.appendChild(todoDescriptionDiv);
        const todoDueDateInput = document.createElement('input');
        todoDueDateInput.setAttribute('type','date');
        todoDueDateInput.setAttribute('min',format(new Date(),'yyyy-LL-dd'));
        todoDueDateInput.setAttribute('value',format(new Date(todoObj.getDueDate()),'yyyy-LL-dd'));
        //todoDueDateInput.setAttribute('value','2022-12-09');
        editTodoForm.appendChild(todoDueDateInput);
        const todoPriorityDiv = document.createElement('div');
        editTodoForm.appendChild(todoPriorityDiv);
        const todoPrioritySelect = document.createElement('select');
        todoPriorityDiv.appendChild(todoPrioritySelect);
        todoPrioritySelect.insertAdjacentHTML('beforebegin','<span>Priority:</span>');
        let attr = {'none': '', 'low':'', 'high':''};
        attr[todoObj.getPriority()] = 'selected';
        todoPrioritySelect.insertAdjacentHTML('beforeend',`<option value="none" ${attr.none}>None</option>`);
        todoPrioritySelect.insertAdjacentHTML('beforeend',`<option value="low" ${attr.low}>Low</option>`);
        todoPrioritySelect.insertAdjacentHTML('beforeend',`<option value="high" ${attr.high}>High</option>`);

        const closeEditTodoPopUpIcon = document.createElement('i');
        closeEditTodoPopUpIcon.classList.add('material-symbols-rounded');
        closeEditTodoPopUpIcon.innerHTML = '&#xe5cd';
        editTodoPopUp.appendChild(closeEditTodoPopUpIcon);
        
        closeEditTodoPopUpIcon.addEventListener('click',() => {
            if (todoTitleDiv.textContent === '') return;
            const formattedDate = new Date(todoDueDateInput.value).toDateString();
            todoObj.editTodo(todoTitleDiv.textContent, todoDescriptionDiv.textContent,
                formattedDate, todoPrioritySelect.value);
            updateTodoListDisplay();
            editTodoPopUp.remove();
            return;
        })
    }
}

export default updateTasksContainerDisplay;