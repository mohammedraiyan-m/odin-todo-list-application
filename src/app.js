
import { Todo, Project } from './classes.js';
import { saveToLocalStorage, loadFromLocalStorage } from './storage.js';

export function init() {
  window.appState = {
    projects: [],
    currentProjectIndex: 0,
  };

  // DOM Elements
  const projectListEl = document.getElementById('project-list');
  const currentProjectNameEl = document.getElementById('current-project-name');
  const todoListEl = document.getElementById('todo-list');
  const createProjectBtn = document.getElementById('create-project-btn');
  const addTodoBtn = document.getElementById('add-todo-btn');

  const todoModal = document.getElementById('todo-modal');
  const todoForm = document.getElementById('todo-form');
  const modalTitle = document.getElementById('modal-title');
  const cancelBtn = document.getElementById('cancel-btn');

  const todoIdInput = document.getElementById('todo-id');
  const todoTitleInput = document.getElementById('todo-title');
  const todoDescriptionInput = document.getElementById('todo-description');
  const todoDueDateInput = document.getElementById('todo-dueDate');
  const todoPriorityInput = document.getElementById('todo-priority');
  const todoNotesInput = document.getElementById('todo-notes');

  // Initialize Projects
  const loadedProjects = loadFromLocalStorage();
  if (loadedProjects) {
    appState.projects = loadedProjects;
  } else {
    const defaultProject = new Project({ name: 'Default' });
    appState.projects = [defaultProject];
    saveToLocalStorage(appState.projects);
  }

  // Render functions
  function renderProjects() {
    projectListEl.innerHTML = '';
    appState.projects.forEach((project, index) => {
      const li = document.createElement('li');
      li.textContent = project.name;
      li.dataset.index = index;
      if (index === appState.currentProjectIndex) {
        li.style.fontWeight = 'bold';
      }
      li.addEventListener('click', () => {
        appState.currentProjectIndex = index;
        renderProjects();
        renderTodos();
      });
      projectListEl.appendChild(li);
    });
    updateCurrentProjectName();
  }

  function updateCurrentProjectName() {
    const currentProject = appState.projects[appState.currentProjectIndex];
    currentProjectNameEl.textContent = currentProject.name;
  }

  // display todos item
  function renderTodos() {
    todoListEl.innerHTML = '';
    const currentProject = appState.projects[appState.currentProjectIndex];
    currentProject.todos.forEach(todo => {
      const div = document.createElement('div');
      div.className = 'todo-item ' + todo.priority;
      div.innerHTML = `
        <strong>${todo.title}</strong> - Due: ${todo.dueDate || 'No date'}
        <button data-id="${todo.id}" class="edit-btn">Edit</button>
        <button data-id="${todo.id}" class="delete-btn">Delete</button>
      `;
      if (todo.completed) {
        div.style.textDecoration = 'line-through';
      }

      // Event listeners
      div.querySelector('.edit-btn').addEventListener('click', () => {
        openTodoModal('Edit Todo', todo);
      });
      div.querySelector('.delete-btn').addEventListener('click', () => {
        deleteTodo(todo.id);
      });
      div.addEventListener('click', (e) => {
        if (e.target.tagName !== 'BUTTON') {
          toggleTodoComplete(todo.id);
        }
      });

      todoListEl.appendChild(div);
    });
  }

  // Todo functions
  function addTodo(todoData) {
    const currentProject = appState.projects[appState.currentProjectIndex];
    const newTodo = new Todo(todoData);
    currentProject.addTodo(newTodo);
    saveToLocalStorage(appState.projects);
    renderTodos();
  }

  function updateTodo(todoId, updatedData) {
    const currentProject = appState.projects[appState.currentProjectIndex];
    const todo = currentProject.getTodo(todoId);
    if (todo) {
      Object.assign(todo, updatedData);
      saveToLocalStorage(appState.projects);
      renderTodos();
    }
  }

  function deleteTodo(todoId) {
    const currentProject = appState.projects[appState.currentProjectIndex];
    currentProject.deleteTodo(todoId);
    saveToLocalStorage(appState.projects);
    renderTodos();
  }

  function toggleTodoComplete(todoId) {
    const currentProject = appState.projects[appState.currentProjectIndex];
    const todo = currentProject.getTodo(todoId);
    if (todo) {
      todo.completed = !todo.completed;
      saveToLocalStorage(appState.projects);
      renderTodos();
    }
  }

  // Modal functions
  function openTodoModal(title, todo = null) {
    modalTitle.textContent = title;
    if (todo) {
      todoIdInput.value = todo.id;
      todoTitleInput.value = todo.title;
      todoDescriptionInput.value = todo.description;
      todoDueDateInput.value = todo.dueDate;
      todoPriorityInput.value = todo.priority;
      todoNotesInput.value = todo.notes;
    } else {
      todoForm.reset();
      todoIdInput.value = '';
    }
    todoModal.classList.remove('hidden');
  }

  function closeTodoModal() {
    todoModal.classList.add('hidden');
  }

  // Event Listeners
  document.getElementById('create-project-btn').addEventListener('click', () => {
    const projectName = prompt('Enter project name:');
    if (projectName) {
      const newProject = new Project({ name: projectName });
      appState.projects.push(newProject);
      appState.currentProjectIndex = appState.projects.length - 1;
      saveToLocalStorage(appState.projects);
      renderProjects();
      renderTodos();
    }
  });

  addTodoBtn.addEventListener('click', () => {
    openTodoModal('Add Todo');
  });

  cancelBtn.addEventListener('click', () => {
    closeTodoModal();
  });

  todoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const todoData = {
      id: todoIdInput.value || undefined,
      title: todoTitleInput.value,
      description: todoDescriptionInput.value,
      dueDate: todoDueDateInput.value,
      priority: todoPriorityInput.value,
      notes: todoNotesInput.value,
    };
    if (todoData.id) {
      updateTodo(todoData.id, todoData);
    } else {
      addTodo(todoData);
    }
    closeTodoModal();
  });

  renderProjects();
  renderTodos();
}