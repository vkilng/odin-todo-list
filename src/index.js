import { app } from './ApplicationLogic';
import updateProjectContainerDisplay from './DisplayProjectContainer';
//import updateTasksContainerDisplay from './DisplayTaskContainer';//for testing purposes

const screenController = (() => {
    const enableAddProjectFunction = (() => {
        const toggleAddProjectPopUp = () => document.querySelector('.add-project-popup').classList.toggle('show');
        const _addProjectIcon =  document.querySelector('.header .addIcon');
        const addProjectIconClickHandler = () => {
            document.querySelector('.add-project-popup form').reset();
            const iconHex = _addProjectIcon.textContent.charCodeAt(0).toString(16);
            _addProjectIcon.innerHTML = (iconHex === 'e5c9')?'&#xe147':'&#xe5c9';
            toggleAddProjectPopUp();
        }
        _addProjectIcon.addEventListener('click',e => addProjectIconClickHandler());
        document.querySelector('.add-project-popup form').addEventListener('submit',e => {
            e.preventDefault();
            const projectName = document.querySelector('.add-project-popup form p input').value;
            //console.log(newProjectName);
            app.getContainer().addProject(projectName);
            updateProjectContainerDisplay();
            addProjectIconClickHandler();
        })
    })();

    const sideBarAllProjectsButton = document.querySelector('.sidebar ul:nth-of-type(1) li:nth-of-type(1)');
    sideBarAllProjectsButton.addEventListener('click',() => updateProjectContainerDisplay());

    //Initial Render
    updateProjectContainerDisplay();
    //updateTasksContainerDisplay(0);

})();