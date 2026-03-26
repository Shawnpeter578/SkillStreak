// Data: Python Quests Map
const quests = [
    {
        id: 1,
        title: "Hello World",
        desc: "The beginning of every hacker's journey. Print 'Hello World' to the console.",
        code: `___("Hello World")`,
        options: ["echo", "print", "console.log", "printf"],
        correct: 1, // index of "print"
        reward: 10,
        completed: false
    },
    {
        id: 2,
        title: "Variable Assignment",
        desc: "Store the number 42 in a variable named `answer`.",
        code: `answer ___ 42`,
        options: ["==", ":=", "=", "->"],
        correct: 2,
        reward: 15,
        completed: false
    },
    {
        id: 3,
        title: "Conditional Logic",
        desc: "Check if gems are greater than 0.",
        code: `___ gems > 0:\n    print("You are rich!")`,
        options: ["if", "when", "check", "while"],
        correct: 0,
        reward: 20,
        completed: false
    },
    {
        id: 4,
        title: "The For Loop",
        desc: "Loop exactly 5 times.",
        code: `for i in range(___):\n    print(i)`,
        options: ["1, 5", "5", "0 to 5", "item"],
        correct: 1,
        reward: 25,
        completed: false
    },
    {
        id: 5,
        title: "Defining Functions",
        desc: "Define a function named `hack_mainframe`.",
        code: `___ hack_mainframe():\n    return "Access Granted"`,
        options: ["func", "function", "def", "let"],
        correct: 2,
        reward: 50,
        completed: false
    }
];

// Mock Leaderboard Data
const leaderboardData = [
    { id: '1', name: 'GuidoVanR', score: 1450, avatar: 'Milo' },
    { id: '2', name: 'CodeNinja', score: 1200, avatar: 'Max' },
    { id: 'user', name: 'Player One', score: 0, avatar: 'Programmer' },
    { id: '4', name: 'NoobMaster69', score: 50, avatar: 'Oscar' }
];

// App State
let state = {
    streak: parseInt(localStorage.getItem('streak')) || 0,
    gems: parseInt(localStorage.getItem('gems')) || 100,
    xp: parseInt(localStorage.getItem('xp')) || 0,
    activeQuestIndex: parseInt(localStorage.getItem('activeQuest')) || 0,
    selectedOptionIndex: null
};

// DOM Elements
const els = {
    streakCount: document.getElementById('streak-count'),
    gemCount: document.getElementById('gem-count'),
    navQuests: document.getElementById('nav-quests'),
    navLeaderboard: document.getElementById('nav-leaderboard'),
    navProfile: document.getElementById('nav-profile'),
    views: document.querySelectorAll('.view'),
    pathContainer: document.getElementById('path-container'),
    leaderboardList: document.getElementById('leaderboard-list'),
    
    // Modal
    modal: document.getElementById('challenge-modal'),
    closeModal: document.getElementById('close-modal'),
    cTitle: document.getElementById('challenge-title'),
    cDesc: document.getElementById('challenge-desc'),
    cCode: document.getElementById('challenge-code'),
    cOptions: document.getElementById('challenge-options'),
    submitBtn: document.getElementById('submit-answer'),
    rewardAmount: document.getElementById('reward-amount'),
    modalProgress: document.getElementById('modal-progress'),

    // Feedback
    feedbackOverlay: document.getElementById('feedback-overlay'),
    feedbackPanel: document.getElementById('feedback-panel'),
    feedbackTitle: document.getElementById('feedback-title'),
    feedbackMsg: document.getElementById('feedback-msg'),
    feedbackBtn: document.getElementById('feedback-btn'),
    
    // Profile
    profileXp: document.getElementById('profile-xp'),
    profileMaxStreak: document.getElementById('profile-max-streak'),
    profileGems: document.getElementById('profile-gems')
};

// Initialization
function init() {
    updateTopBar();
    renderPath();
    setupNavigation();
    setupModalEvents();
    renderLeaderboard();
    updateProfileStats();
}

// Update TopBar / Stats
function updateTopBar() {
    els.streakCount.textContent = state.streak;
    els.gemCount.textContent = state.gems;
    els.profileXp.textContent = state.xp;
    els.profileMaxStreak.textContent = state.streak;
    els.profileGems.textContent = state.gems;
    els.streakCount.parentElement.classList.add('pulse');
    setTimeout(() => els.streakCount.parentElement.classList.remove('pulse'), 300);
}

// Save State
function saveState() {
    localStorage.setItem('streak', state.streak);
    localStorage.setItem('gems', state.gems);
    localStorage.setItem('xp', state.xp);
    localStorage.setItem('activeQuest', state.activeQuestIndex);
}

// Navigation Logic
function setupNavigation() {
    const navButtons = [els.navQuests, els.navLeaderboard, els.navProfile];
    
    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update Active Nav
            navButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Hide all views
            els.views.forEach(v => v.classList.add('hidden'));

            // Show selected view
            if(btn.id === 'nav-quests') document.getElementById('view-quests').classList.remove('hidden');
            if(btn.id === 'nav-leaderboard') {
                document.getElementById('view-leaderboard').classList.remove('hidden');
                renderLeaderboard();
            }
            if(btn.id === 'nav-profile') {
                document.getElementById('view-profile').classList.remove('hidden');
                updateProfileStats();
            }
        });
    });
}

// Render the Quest Path map
function renderPath() {
    els.pathContainer.innerHTML = '';
    
    quests.forEach((q, i) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'node-wrapper';

        const node = document.createElement('button');
        node.className = 'path-node';
        
        // Determine state
        if (i < state.activeQuestIndex) {
            node.classList.add('completed');
            node.innerHTML = `★ <span class="tooltip">${q.title} (Done)</span>`;
        } else if (i === state.activeQuestIndex) {
            node.classList.add('active');
            node.innerHTML = `🐍 <span class="tooltip">${q.title}</span>`;
            node.addEventListener('click', () => openChallenge(q));
        } else {
            node.classList.add('locked');
            node.innerHTML = `🔒 <span class="tooltip">Locked</span>`;
        }

        wrapper.appendChild(node);
        els.pathContainer.appendChild(wrapper);
    });
}

// Open Challenge Modal
function openChallenge(quest) {
    state.selectedOptionIndex = null;
    els.submitBtn.disabled = true;

    els.cTitle.textContent = \`Mission: \${quest.title}\`;
    els.cDesc.textContent = quest.desc;
    els.cCode.textContent = quest.code;
    els.rewardAmount.textContent = quest.reward;
    
    // Progress relative to total quests
    const progressPerc = (state.activeQuestIndex / quests.length) * 100;
    els.modalProgress.style.width = \`\${progressPerc}%\`;

    // Render options
    els.cOptions.innerHTML = '';
    quest.options.forEach((opt, index) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.textContent = opt;
        btn.addEventListener('click', () => {
            // Deselect others
            document.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            state.selectedOptionIndex = index;
            els.submitBtn.disabled = false;
        });
        els.cOptions.appendChild(btn);
    });

    els.modal.classList.remove('hidden');
}

// Modal Events setup
function setupModalEvents() {
    els.closeModal.addEventListener('click', () => {
        els.modal.classList.add('hidden');
    });

    els.submitBtn.addEventListener('click', () => {
        checkAnswer();
    });
}

// Validation logic and Dopamine triggers
function checkAnswer() {
    const currentQuest = quests[state.activeQuestIndex];
    if (state.selectedOptionIndex === currentQuest.correct) {
        // Correct Action
        showFeedback(true, currentQuest);
    } else {
        // Incorrect Action (Loss Aversion)
        showFeedback(false, currentQuest);
    }
}

// Show animated bottom popup
function showFeedback(isSuccess, quest) {
    els.modal.classList.add('hidden'); // Hide modal to focus on feedback
    els.feedbackOverlay.classList.remove('hidden');
    els.feedbackPanel.className = 'feedback-panel'; // Reset classes
    
    if (isSuccess) {
        // Trigger specific CSS state
        els.feedbackPanel.classList.add('success');
        els.feedbackTitle.textContent = "Spectacular! 🎉";
        els.feedbackMsg.textContent = \`You earned \${quest.reward} gems and increased your streak!\`;
        els.feedbackBtn.textContent = "Continue";
        
        // State updates
        state.gems += quest.reward;
        state.xp += quest.reward * 10;
        state.streak += 1;
        state.activeQuestIndex += 1;
        
        // Sound could go here
        
        els.feedbackBtn.onclick = () => {
            els.feedbackOverlay.classList.add('hidden');
            saveState();
            updateTopBar();
            renderPath();
        };
    } else {
        // Trigger Error CSS state
        els.feedbackPanel.classList.add('error');
        els.feedbackTitle.textContent = "Incorrect 💔";
        els.feedbackMsg.textContent = "You lost 5 gems. Don't give up!";
        els.feedbackBtn.textContent = "Try Again";
        
        // Loss Aversion mechanics
        state.gems = Math.max(0, state.gems - 5);
        if(state.streak > 0) {
            // Streak protection warning could be added here
            state.streak = 0; 
            els.feedbackMsg.textContent += " And your streak was broken!";
        }
        
        els.feedbackBtn.onclick = () => {
            els.feedbackOverlay.classList.add('hidden');
            saveState();
            updateTopBar();
            openChallenge(quest); // Re-open same challenge
        };
    }
}

// Leaderboard implementation
function renderLeaderboard() {
    // Update current user score in mock data
    const userEntry = leaderboardData.find(u => u.id === 'user');
    if (userEntry) {
        userEntry.score = state.xp;
    }

    // Sort descending
    leaderboardData.sort((a, b) => b.score - a.score);

    els.leaderboardList.innerHTML = '';
    leaderboardData.forEach((user, index) => {
        const li = document.createElement('li');
        li.className = 'lb-item';
        if(user.id === 'user') li.classList.add('current-user');

        li.innerHTML = \`
            <div class="lb-rank">#\${index + 1}</div>
            <div class="lb-user">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=\${user.avatar}" class="lb-avatar" alt="\${user.name}">
                <span>\${user.name}</span>
            </div>
            <div class="lb-score">\${user.score} XP</div>
        \`;
        els.leaderboardList.appendChild(li);
    });
}

function updateProfileStats() {
    els.profileXp.textContent = state.xp;
    // Assuming current streak is max streak for this demo
    els.profileMaxStreak.textContent = state.streak;
    els.profileGems.textContent = state.gems;
}

// Start App
document.addEventListener('DOMContentLoaded', init);
