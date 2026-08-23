// Конфигурация
const CLIENT_ID = '1464524362005741720'; // Твой Client ID
const REDIRECT_URI = 'https://redwsss.github.io/mysite/dashboard.html';
const API_URL = 'http://localhost:3000'; // API бота на ПК

// Проверка авторизации
function checkAuth() {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    
    if (code) {
        // Обмен кода на токен
        exchangeCode(code);
    } else {
        const token = localStorage.getItem('discord_token');
        if (token) {
            loadUserData(token);
        }
    }
}

// Вход через Discord
function login() {
    const authUrl = `https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=identify%20guilds`;
    window.location.href = authUrl;
}

// Обмен кода на токен
async function exchangeCode(code) {
    try {
        const response = await fetch(`${API_URL}/auth/token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code })
        });
        
        const data = await response.json();
        localStorage.setItem('discord_token', data.access_token);
        loadUserData(data.access_token);
    } catch (error) {
        console.error('Ошибка авторизации:', error);
    }
}

// Загрузка данных пользователя
async function loadUserData(token) {
    try {
        const response = await fetch('https://discord.com/api/users/@me', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        const user = await response.json();
        
        document.getElementById('avatar').src = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`;
        document.getElementById('username').textContent = user.username;
        
        // Загрузка данных из базы
        loadDatabaseInfo(user.id);
    } catch (error) {
        console.error('Ошибка:', error);
    }
}

// Загрузка из базы данных
async function loadDatabaseInfo(discordId) {
    try {
        const response = await fetch(`${API_URL}/api/user/${discordId}`);
        const data = await response.json();
        
        if (data) {
            document.getElementById('status').textContent = `Статус: ${data.verified ? '✅ Верифицирован' : '❌ Не верифицирован'}`;
            document.getElementById('status').className = data.verified ? 'verified' : 'not-verified';
            document.getElementById('rank').textContent = `Ранг: ${data.rank}`;
            document.getElementById('balance').textContent = `Баланс: $${data.money}`;
        }
    } catch (error) {
        console.error('Ошибка загрузки данных:', error);
    }
}

// Верификация
async function verify() {
    const token = localStorage.getItem('discord_token');
    if (!token) return;
    
    try {
        const response = await fetch(`${API_URL}/api/verify`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        
        alert('✅ Верификация успешна!');
        location.reload();
    } catch (error) {
        alert('❌ Ошибка верификации');
    }
}

// Выход
function logout() {
    localStorage.removeItem('discord_token');
    window.location.href = 'index.html';
}

// Инициализация
if (document.getElementById('loginBtn')) {
    document.getElementById('loginBtn').addEventListener('click', login);
}

if (document.getElementById('verifyBtn')) {
    document.getElementById('verifyBtn').addEventListener('click', verify);
}

if (document.getElementById('logoutBtn')) {
    document.getElementById('logoutBtn').addEventListener('click', logout);
}

if (window.location.pathname.includes('dashboard')) {
    checkAuth();
}
