// DOM Elements
const newGoalBtn = document.getElementById('new-goal-btn');
const goalModal = document.getElementById('goal-modal');
const closeBtn = document.querySelector('.close');
const goalForm = document.getElementById('goal-form');
const goalsList = document.getElementById('goals-list');
const activeGoalsCount = document.getElementById('active-goals-count');
const completionRate = document.getElementById('completion-rate');

// Sample goals data
let goals = JSON.parse(localStorage.getItem('goals')) || [];

// Event Listeners
newGoalBtn.addEventListener('click', () => {
    goalModal.style.display = 'flex';
});

closeBtn.addEventListener('click', () => {
    goalModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === goalModal) {
        goalModal.style.display = 'none';
    }
});

goalForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const title = document.getElementById('goal-title').value;
    const description = document.getElementById('goal-description').value;
    
    const newGoal = {
        id: Date.now(),
        title,
        description,
        createdAt: new Date().toISOString(),
        completed: false
    };
    
    goals.push(newGoal);
    saveGoals();
    renderGoals();
    
    // Reset form and close modal
    goalForm.reset();
    goalModal.style.display = 'none';
});

// Functions
function saveGoals() {
    localStorage.setItem('goals', JSON.stringify(goals));
    updateStats();
}

function renderGoals() {
    goalsList.innerHTML = '';
    
    goals.forEach(goal => {
        const goalCard = document.createElement('div');
        goalCard.className = 'goal-card';
        goalCard.innerHTML = `
            <h3>${goal.title}</h3>
            <p>${goal.description || 'No description'}</p>
            <div class="goal-actions">
                <button onclick="toggleGoalCompletion(${goal.id})">
                    ${goal.completed ? '✓ Completed' : 'Mark Complete'}
                </button>
                <button onclick="deleteGoal(${goal.id})">Delete</button>
            </div>
        `;
        goalsList.appendChild(goalCard);
    });
}

function toggleGoalCompletion(id) {
    goals = goals.map(goal => {
        if (goal.id === id) {
            return { ...goal, completed: !goal.completed };
        }
        return goal;
    });
    saveGoals();
    renderGoals();
}

function deleteGoal(id) {
    goals = goals.filter(goal => goal.id !== id);
    saveGoals();
    renderGoals();
}

function updateStats() {
    activeGoalsCount.textContent = goals.length;
    
    if (goals.length > 0) {
        const completedCount = goals.filter(g => g.completed).length;
        const rate = Math.round((completedCount / goals.length) * 100);
        completionRate.textContent = `${rate}%`;
    } else {
        completionRate.textContent = '0%';
    }
}

// Initialize
renderGoals();
updateStats();
