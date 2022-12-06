const projectContainer = () => {
    let _container = [];
    const todo = (title, description, dueDate, priority) => {
        let _title = title;
        let _description = description;
        const _dueDate = dueDate;
        const _priority = priority;
        let _isActive = true;

        const getTitle = () => _title;
        const getDueDate = () => _dueDate;
        const getPriority = () => _priority;
        const editTodo = (editedTitle, editedDescription) => {
            _title = editedTitle;
            _description = editedDescription;
        }
        const setToCompleted = () => { _isActive = false };
        const isActive = () => _isActive;

        return {getTitle, getDueDate, getPriority, editTodo, setToCompleted, isActive}
    }
    const project = (projectName) => {
        let _projectName = projectName;
        let _activeTodos = [];
        let _completedTodos = [];

        const addTodo = (title, description = 'Hehe', dueDate = '23rd Jan 2023', priority = 0) => {
            _activeTodos.push(todo(title,description,dueDate,priority));
        }
        const setTodoToCompleted = (indexInCombinedTodoList) => {
            const indexInActiveList = indexInCombinedTodoList - _completedTodos.length; 
            _activeTodos[indexInActiveList].setToCompleted();
            _completedTodos.push(_activeTodos[indexInActiveList]);
            _activeTodos.splice(indexInActiveList,1);
        }
        const removeTodo = (isActive, indexInCombinedList) => {
            const indexInActiveList = indexInCombinedList - _completedTodos.length;
            if (isActive) _activeTodos.splice(indexInActiveList,1);
            else _completedTodos.splice(indexInCombinedList,1);
        }
        const getActiveTodoList = () => _activeTodos;
        const getCompletedTodoList = () => _completedTodos;
        const getTodoList = () => _completedTodos.concat(_activeTodos);
        const getProjectName = () => _projectName;
        const editProjectName = (newProjectName) => { _projectName = newProjectName };

        return {addTodo, setTodoToCompleted, removeTodo,
            getActiveTodoList, getCompletedTodoList, getTodoList, getProjectName, editProjectName};
    }

    const getContainerArray = () => _container;
    const addProject = (projectName) => { _container.push(project(projectName)) };
    const removeProject = (index) => { _container.splice(index,1) };
    const getProjectTodos = (index) => _container[index].getTodoList();

    return {getContainerArray, addProject, removeProject, getProjectTodos};
}

const appController = () => {
    const container = projectContainer();
    const containerArray = container.getContainerArray();
    //Initialize dummy Project
    container.addProject('Dummy Project One');
    containerArray[0].addTodo('Lorem ipsum','dolor sit amet');
    containerArray[0].addTodo('consectetur adipiscing elit','Donec egestas tincidunt ultrices');
    containerArray[0].addTodo('Curabitur lobortis','quam sed imperdiet hendrerit');
    containerArray[0].addTodo('Etiam id diam nunc','Integer vitae magna ac tellus vestibulum elementum.');
    containerArray[0].addTodo('Nam tristique orci si','amet nibh suscipit maximus');
    containerArray[0].addTodo('Curabitur lobortis','quam sed imperdiet hendrerit');
    container.addProject('Dummy Project Two');

    const getContainer = () => container;

    return {getContainer};
}

const screenController = (() => {
    const app = appController();
    const containerArray = app.getContainer().getContainerArray();
    const contentDiv = document.querySelector('.main-content');

    const updateProjectContainerDisplay = () => {
        contentDiv.textContent = '';
        const projectContainerDiv  = document.createElement('div');
        projectContainerDiv.classList.add('project-container');
        contentDiv.appendChild(projectContainerDiv);

        containerArray.forEach((projectObj,index) => {
            const cardDiv = document.createElement('div');
            cardDiv.classList.add('card');
            cardDiv.dataset.projectIndex = index;
            projectContainerDiv.insertAdjacentElement('afterbegin',cardDiv);
            cardDiv.addEventListener('click',() => updateTasksContainerDisplay(index));
            const cardTitleDiv = document.createElement('div');
            cardTitleDiv.textContent = projectObj.getProjectName();
            cardDiv.appendChild(cardTitleDiv);
            const ul = document.createElement('ul');
            cardDiv.appendChild(ul);
            
            const todoList = projectObj.getTodoList();
            todoList.forEach(todoObj => {
                const li = document.createElement('li');
                li.textContent = todoObj.getTitle();
                if (!todoObj.isActive()) {
                    li.style.textDecorationLine = 'line-through';
                    li.style.color = 'grey';
                }
                ul.insertAdjacentElement('afterbegin',li);
            })
        })
    }

    const addProjectFunction = (() => {
        const toggleAddProjectPopUp = () => document.querySelector('.add-project-popup').classList.toggle('show');
        const addProjectIcon =  document.querySelector('.header .addIcon');
        const addProjectIconClickHandler = () => {
            document.querySelector('.add-project-popup form').reset();
            const iconHex = addProjectIcon.textContent.charCodeAt(0).toString(16);
            addProjectIcon.innerHTML = (iconHex === 'e5c9')?'&#xe147':'&#xe5c9';
            toggleAddProjectPopUp();
        }
        addProjectIcon.addEventListener('click',e => addProjectIconClickHandler());
        document.querySelector('.add-project-popup form').addEventListener('submit',e => {
            e.preventDefault();
            const projectName = document.querySelector('.add-project-popup form p input').value;
            //console.log(newProjectName);
            app.getContainer().addProject(projectName);
            updateProjectContainerDisplay();
            addProjectIconClickHandler();
        })
    })();

    const updateTasksContainerDisplay = (projectIndex) => {
        contentDiv.textContent = '';
        const project = containerArray[projectIndex];
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
            editProjectNameIcon.classList.add('material-symbols-sharp');
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
            addTodoButton.insertAdjacentHTML('beforeend','<i class="material-symbols-sharp">&#xe147</i>Add Todo');
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
            const todoDescriptionInput = document.createElement('input');
            todoDescriptionInput.setAttribute('type','text');
            todoDescriptionInput.setAttribute('placeholder','Description');
            addTodoForm.appendChild(todoDescriptionInput);
            const todoDueDateInput = document.createElement('input');
            todoDueDateInput.setAttribute('type','date');
            todoDueDateInput.setAttribute('max','2027-12-31');
            addTodoForm.appendChild(todoDueDateInput);
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
                    project.addTodo(todoTitleInput.value, todoDescriptionInput.value, todoDueDateInput.value);
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
                    tickIcon.style.pointerEvents = 'none';
                    updateTodoListDisplay();
                    return;
                })}
                const todoTitleDiv = document.createElement('div');
                todoTitleDiv.textContent = todoObj.getTitle();
                leftDiv.appendChild(todoTitleDiv);
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
    }

    const sideBarAllProjectsButton = document.querySelector('.sidebar ul:nth-of-type(1) li:nth-of-type(1)');
    sideBarAllProjectsButton.addEventListener('click',() => updateProjectContainerDisplay());

    //Initial Render
    //updateProjectContainerDisplay();
    updateTasksContainerDisplay(0);
})

screenController();