const projectContainer = () => {
    let _container = [];
    const todo = (title, description, dueDate, priority) => {
        let _title = title;
        let _description = description;
        const _dueDate = dueDate;
        const _priority = priority;

        const getTitle = () => _title;
        const getDueDate = () => _dueDate;
        const getPriority = () => _priority;
        const editTodo = (editedTitle, editedDescription) => {
            _title = editedTitle;
            _description = editedDescription;
        }

        return {getTitle, getDueDate, getPriority, editTodo}
    }
    const project = (projectName) => {
        let _projectName = projectName;
        let _activeTodos = [];
        let _completedTodos = [];

        const addTodo = (title, description = 'Hehe', dueDate = '23rd Jan 2023', priority = 0) => {
            _activeTodos.push(todo(title,description,dueDate,priority));
        }
        const setTodoToCompleted = (index) => {
            _completedTodos.push(_activeTodos[index]);
            _activeTodos.splice(index,1);
        }
        const removeTodo = (isActive, index) => {
            if (isActive) _activeTodos.splice(index,1);
            else _completedTodos.splice(index,1);
        }
        const getActiveTodoList = () => _activeTodos;
        const getCompletedTodoList = () => _completedTodos;
        const getTodoList = () => _activeTodos.concat(_completedTodos);
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
    container.addProject('Dummy Project One adipiscing elit');
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
            projectContainerDiv.appendChild(cardDiv);
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
                ul.appendChild(li);
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
            const rightHeaderDiv = document.createElement('div');
            projectHeaderDiv.appendChild(rightHeaderDiv);
            rightHeaderDiv.insertAdjacentHTML('beforeend','<i class="material-symbols-rounded">&#xe16c</i>Delete this project');
            rightHeaderDiv.addEventListener('dblclick',() => {
                app.getContainer().removeProject(projectIndex);
                updateProjectContainerDisplay();
                return;
            })
        })();
        const addTodoList = (() => {
            const todoListDiv = document.createElement('div');
            todoListDiv.classList.add('todo-list');
            tasksContainerDiv.appendChild(todoListDiv);
            const todoContainerArray = project.getTodoList();
            todoContainerArray.forEach(todoObj => {
                const todoDiv = document.createElement('div');
                todoDiv.classList.add('todo');
                todoListDiv.appendChild(todoDiv);
                const leftDiv = document.createElement('div');
                todoDiv.appendChild(leftDiv);
                const tickIcon = document.createElement('i');
                tickIcon.classList.add('material-symbols-rounded');
                tickIcon.innerHTML = '&#xe86c';
                leftDiv.appendChild(tickIcon);
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
            })
        })();
    }

    //Initial Render
    //updateProjectContainerDisplay();
    updateTasksContainerDisplay(0);
})

screenController();