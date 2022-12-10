import { app } from './ApplicationLogic';
import updateProjectContainerDisplay from './DisplayProjectContainer';
import displayFilteredTasks from './DisplayFilteredTasks';

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

    const sidebarModule = (() => {
        const links = document.querySelectorAll('.sidebar li');
        const defocusAll = () => {
            for (let i=0; i<3 ;i++) {
                links[i].classList.remove('focused');
            }
        }
        const focusLi = (element) => {
            element.classList.add('focused');
        }
        links[0].addEventListener('click',(e) => {
            defocusAll();
            updateProjectContainerDisplay();
            focusLi(e.target);
        })
        links[1].addEventListener('click',(e) => {
            defocusAll();
            displayFilteredTasks('today')
            focusLi(e.target);
        });
        links[2].addEventListener('click',(e) => {
            defocusAll();
            displayFilteredTasks('high')
            focusLi(e.target);
        });
        //Initial Render
        focusLi(links[0]);
    })();

    //Initial Render
    updateProjectContainerDisplay();

})();