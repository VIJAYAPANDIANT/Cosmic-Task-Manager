// State Management
let todos = JSON.parse(localStorage.getItem('todos')) || [];
let currentEditId = null;

// DOM Elements
const todoForm = document.getElementById('todoForm');
const todoInput = document.getElementById('todoInput');
const todoList = document.getElementById('todoList');
const taskCount = document.getElementById('taskCount');
const themeToggle = document.getElementById('themeToggle');
const clearCompleted = document.getElementById('clearCompleted');
const editModal = document.getElementById('editModal');
const editInput = document.getElementById('editInput');
const saveEditBtn = document.getElementById('saveEdit');
const cancelEditBtn = document.getElementById('cancelEdit');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme') || 'dark-mode';
    document.body.className = savedTheme;
    updateThemeIcon();
    renderTasks();
    createStars();
});

function createStars() {
    generateStars('starsContainer', 150, 2);
    generateStars('starsContainerSlow', 100, 1.5);
}

function generateStars(containerId, count, maxSize) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    for (let i = 0; i < count; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        
        const size = Math.random() * maxSize;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        
        star.style.top = `${Math.random() * 100}%`;
        star.style.left = `${Math.random() * 100}%`;
        
        star.style.setProperty('--duration', `${Math.random() * 3 + 2}s`);
        star.style.animationDelay = `${Math.random() * 5}s`;
        
        container.appendChild(star);
    }
}

// Theme Toggle
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    document.body.classList.toggle('dark-mode');
    const theme = document.body.classList.contains('light-mode') ? 'light-mode' : 'dark-mode';
    localStorage.setItem('theme', theme);
    updateThemeIcon();
});

function updateThemeIcon() {
    const icon = themeToggle.querySelector('i');
    if (document.body.classList.contains('light-mode')) {
        icon.className = 'fas fa-moon';
    } else {
        icon.className = 'fas fa-sun';
    }
}

// CRUD Operations
todoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = todoInput.value.trim();
    if (text) {
        addTodo(text);
        todoInput.value = '';
    }
});

function addTodo(text) {
    const todo = {
        id: Date.now(),
        text: text,
        completed: false
    };
    todos.unshift(todo);
    saveAndRender();
}

function toggleTodo(id) {
    todos = todos.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    saveAndRender();
}

function deleteTodo(id) {
    const item = document.querySelector(`[data-id="${id}"]`);
    item.style.transform = 'translateX(50px)';
    item.style.opacity = '0';
    
    setTimeout(() => {
        todos = todos.filter(todo => todo.id !== id);
        saveAndRender();
    }, 300);
}

function editTodo(id) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        currentEditId = id;
        editInput.value = todo.text;
        editModal.classList.add('active');
        editInput.focus();
    }
}

// Modal Actions
saveEditBtn.addEventListener('click', () => {
    const newText = editInput.value.trim();
    if (newText && currentEditId) {
        todos = todos.map(todo => 
            todo.id === currentEditId ? { ...todo, text: newText } : todo
        );
        closeModal();
        saveAndRender();
    }
});

cancelEditBtn.addEventListener('click', closeModal);

function closeModal() {
    editModal.classList.remove('active');
    currentEditId = null;
}

clearCompleted.addEventListener('click', () => {
    todos = todos.filter(todo => !todo.completed);
    saveAndRender();
});

// Helper Functions
function saveAndRender() {
    localStorage.setItem('todos', JSON.stringify(todos));
    renderTasks();
}

function renderTasks() {
    todoList.innerHTML = '';
    
    todos.forEach(todo => {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        li.setAttribute('data-id', todo.id);
        
        li.innerHTML = `
            <div class="checkbox" onclick="toggleTodo(${todo.id})"></div>
            <span class="todo-text">${escapeHtml(todo.text)}</span>
            <div class="item-actions">
                <button class="action-btn edit-btn" onclick="editTodo(${todo.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn delete-btn" onclick="deleteTodo(${todo.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        todoList.appendChild(li);
    });
    
    updateStats();
}

function updateStats() {
    const activeTasks = todos.filter(t => !t.completed).length;
    taskCount.textContent = `${activeTasks} task${activeTasks === 1 ? '' : 's'} left`;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Global functions for onclick attributes
window.toggleTodo = toggleTodo;
window.deleteTodo = deleteTodo;
window.editTodo = editTodo;
