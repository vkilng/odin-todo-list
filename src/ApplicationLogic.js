const projectContainer = () => {
    let _container = [];
    const todo = (title, description, dueDate, priority) => {
        let _title = title;
        let _description = description;
        let _dueDate = dueDate;
        const _priority = priority;
        let _isActive = true;

        const getTitle = () => _title;
        const getDescription = () => _description;
        const getDueDate = () => _dueDate;
        const getPriority = () => _priority;
        const editTodo = (editedTitle, editedDescription, _editedDueDate) => {
            _title = editedTitle;
            _description = editedDescription;
            _dueDate = _editedDueDate;
        }
        const setToCompleted = () => { _isActive = false };
        const isActive = () => _isActive;

        return {getTitle, getDescription, getDueDate, getPriority, editTodo, setToCompleted, isActive}
    }
    const project = (projectName) => {
        let _projectName = projectName;
        let _activeTodos = [];
        let _completedTodos = [];

        const addTodo = (title, description = 'Hehe', dueDate = new Date().toDateString(), priority = 0) => {
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
    containerArray[0].addTodo('consectetur adipiscing elit boia aisbcqo cqoc qoic oq dc qasc oa sox qo cqo','Donec egestas tincidunt ultrices');
    containerArray[0].addTodo('Curabitur lobortis','quam sed imperdiet hendrerit');
    containerArray[0].addTodo('Etiam id diam nunc','Integer vitae magna ac tellus vestibulum elementum.');
    containerArray[0].addTodo('Nam tristique orci si','amet nibh suscipit maximus');
    containerArray[0].addTodo('Curabitur lobortis','quam sed imperdiet hendrerit');
    container.addProject('Dummy Project Two');

    const getContainer = () => container;

    return {getContainer};
}

const app = appController();

export {app};