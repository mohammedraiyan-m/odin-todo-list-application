
// function for unique IDs
function generateUniqueId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

class Todo {
  constructor({ id, title, description, dueDate, priority, notes, completed, checklist }) {
    this.id = id || generateUniqueId();
    this.title = title;
    this.description = description;
    this.dueDate = dueDate; 
    this.priority = priority;
    this.notes = notes || '';
    this.completed = completed || false;
    this.checklist = checklist || [];
  }
}

class Project {
  constructor({ name, todos }) {
    this.name = name || 'Default';
    this.todos = todos || [];
  }

  addTodo(todo) {
    this.todos.push(todo);
  }

  deleteTodo(todoId) {
    this.todos = this.todos.filter(t => t.id !== todoId);
  }

  getTodo(todoId) {
    return this.todos.find(t => t.id === todoId);
  }
}

export { Todo, Project };