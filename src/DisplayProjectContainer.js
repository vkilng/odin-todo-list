import { app } from "./ApplicationLogic";
import updateTasksContainerDisplay from "./DisplayTaskContainer";

const updateProjectContainerDisplay = () => {
    const containerArray = app.getContainer().getContainerArray();
    const contentDiv = document.querySelector('.main-content');

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

export default updateProjectContainerDisplay;