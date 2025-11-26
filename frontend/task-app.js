// Task Manager Application
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';

// DOM Elements
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const filterBtns = document.querySelectorAll('.filter-btn');


// Initialize app
function init() {
    renderTasks();
    updateStats();
}

// Add new task
function addTask() {
    debugger;
    const text = taskInput.value.trim();
    if (text === '') {
        alert('Please enter a task!');
        return;
    }

     // Prevent duplicate tasks (case-insensitive)
    const exists = tasks.some(t => t.text.toLowerCase() === text.toLowerCase());
    if (exists) {
        alert('This task already exists!');
        return;
    }
    
    const task = {
        id: Date.now(),
        text: text,
        completed: false,
        createdAt: new Date().toISOString()
    };
    
    tasks.push(task);
    saveTasks();
    taskInput.value = '';
    renderTasks();
    updateStats();
}

// Save tasks to localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Render tasks based on current filter
function renderTasks() {
    let filteredTasks = tasks;
    
    if (currentFilter === 'active') {
        filteredTasks = tasks.filter(task => !task.completed);
    } else if (currentFilter === 'completed') {
        filteredTasks = tasks.filter(task => task.completed);
    }
    
    taskList.innerHTML = '';
    
    filteredTasks.forEach(task => {
        const li = document.createElement('li');
        li.className = 'task-item';
        li.innerHTML = `
            <input type="checkbox" ${task.completed ? 'checked' : ''} 
                   onchange="toggleTask(${task.id})">
            <span class="${task.completed ? 'completed' : ''}">${task.text}</span>
            <button class="edit-btn" onclick="editTask(${task.id})">Edit</button>
            <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
        `;
        taskList.appendChild(li);
    });
}

// Toggle task completion
function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    task.completed = !task.completed;
    saveTasks();
    renderTasks();
    updateStats();
}

// Delete task
function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
    renderTasks();
    updateStats();
}

// Handle filter button clicks
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove 'active' class from all
        filterBtns.forEach(b => b.classList.remove('active'));

        // Add active class to clicked button
        btn.classList.add('active');

        // Set current filter
        currentFilter = btn.dataset.filter;

        // Re-render tasks based on selected filter
        renderTasks();
    });
});

// Update task statistics
function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;

    document.getElementById('totalTasks').textContent = `${total} tasks`;
    document.getElementById('completedTasks').textContent = `${completed} completed`;
}

// Edit existing task
function editTask(id) {
    const task = tasks.find(t => t.id === id);
    const newText = prompt("Edit task:", task.text);

    // If user clicks Cancel or leaves blank, do nothing
    if (newText === null || newText.trim() === "") return;

    task.text = newText.trim();
    saveTasks();
    renderTasks();
    updateStats();
}

// Start the application
window.onload = init;
