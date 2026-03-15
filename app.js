// State Management
let todos = JSON.parse(localStorage.getItem('todos')) || [];
let history = JSON.parse(localStorage.getItem('taskHistory')) || [];
let currentEditId = null;

// DOM Elements
const authView = document.getElementById('authView');
const taskView = document.getElementById('taskView');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const toRegister = document.getElementById('toRegister');
const toLogin = document.getElementById('toLogin');
const logoutBtn = document.getElementById('logoutBtn');

// Auth Inputs
const loginEmailInput = document.getElementById('loginEmail');
const loginPassInput = document.getElementById('loginPassword');
const regUserInput = document.getElementById('regUsername');
const regEmailInput = document.getElementById('regEmail');
const regPassInput = document.getElementById('regPassword');

const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');

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

// History Elements
const historyModal = document.getElementById('historyModal');
const historyContent = document.getElementById('historyContent');
const showHistoryBtn = document.getElementById('showHistory');
const closeHistoryBtn = document.getElementById('closeHistory');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme') || 'dark-mode';
    document.body.className = savedTheme;
    updateThemeIcon();
    renderTasks();
    createStars();
    
    // Check if logged in (placeholder)
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        showView('task');
    } else {
        showView('auth');
    }
});

function showView(view) {
    if (view === 'task') {
        authView.classList.add('hidden');
        taskView.classList.remove('hidden');
    } else {
        authView.classList.remove('hidden');
        taskView.classList.add('hidden');
    }
}

// View Toggles
toRegister.addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.classList.add('hidden');
    registerForm.classList.remove('hidden');
});

toLogin.addEventListener('click', (e) => {
    e.preventDefault();
    registerForm.classList.add('hidden');
    loginForm.classList.remove('hidden');
});

logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('currentUser');
    showView('auth');
});

// Auth Handlers
loginBtn.addEventListener('click', async () => {
    const email = loginEmailInput.value.trim();
    const pass = loginPassInput.value.trim();
    if (!email || !pass) return alert('Please fill in all fields');
    
    // MySQL integration will go here
    console.log('Logging in:', email);
    // Placeholder login
    localStorage.setItem('currentUser', JSON.stringify({ email }));
    showView('task');
});

registerBtn.addEventListener('click', async () => {
    const user = regUserInput.value.trim();
    const email = regEmailInput.value.trim();
    const pass = regPassInput.value.trim();
    if (!user || !email || !pass) return alert('Please fill in all fields');
    
    // MySQL integration will go here
    console.log('Registering:', user, email);
    alert('Registration successful! (Placeholder)');
    loginForm.classList.remove('hidden');
    registerForm.classList.add('hidden');
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
        completed: false,
        createdAt: new Date().toISOString()
    };
    todos.unshift(todo);
    addToHistory(todo.id, 'created', text);
    saveAndRender();
}

function toggleTodo(id) {
    todos = todos.map(todo => {
        if (todo.id === id) {
            const newStatus = !todo.completed;
            addToHistory(id, newStatus ? 'completed' : 'updated', todo.text);
            return { ...todo, completed: newStatus };
        }
        return todo;
    });
    saveAndRender();
}

function deleteTodo(id) {
    const todo = todos.find(t => t.id === id);
    if (todo) addToHistory(id, 'deleted', todo.text);
    
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

// History Logic
function addToHistory(taskId, action, text) {
    const entry = {
        id: Date.now(),
        taskId,
        action,
        text,
        timestamp: new Date().toISOString()
    };
    history.unshift(entry);
    localStorage.setItem('taskHistory', JSON.stringify(history));
}

showHistoryBtn.addEventListener('click', () => {
    renderHistory();
    historyModal.classList.add('active');
});

closeHistoryBtn.addEventListener('click', () => {
    historyModal.classList.remove('active');
});

function renderHistory() {
    historyContent.innerHTML = '';
    if (history.length === 0) {
        historyContent.innerHTML = '<p class="toggle-text">No history yet.</p>';
        return;
    }

    history.forEach(entry => {
        const div = document.createElement('div');
        div.className = 'history-item';
        const date = new Date(entry.timestamp).toLocaleString();
        div.innerHTML = `
            <div>
                <span class="history-action action-${entry.action}">${entry.action}</span>: 
                <span class="history-text">${escapeHtml(entry.text)}</span>
            </div>
            <span class="history-time">${date}</span>
        `;
        historyContent.innerHTML += div.outerHTML;
    });
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
            <div class="todo-text">
                <span>${escapeHtml(todo.text)}</span>
                <span class="task-date">${new Date(todo.createdAt || todo.id).toLocaleString()}</span>
            </div>
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
