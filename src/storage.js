
import { Todo, Project } from './classes.js';

function saveToLocalStorage(projects) {
  localStorage.setItem('todoProjects', JSON.stringify(projects));
}

function loadFromLocalStorage() {
  const data = localStorage.getItem('todoProjects');
  if (data) {
    try {
      const parsed = JSON.parse(data);
      return parsed.map(proj => {
        const project = new Project({ name: proj.name });
        project.todos = proj.todos.map(td => new Todo(td));
        return project;
      });
    } catch (e) {
      console.error('Error parsing localStorage data', e);
      return null;
    }
  }
  return null;
}

export { saveToLocalStorage, loadFromLocalStorage };