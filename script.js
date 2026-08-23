// Конфигурация
const CLIENT_ID = '1464524362005741720';
const REDIRECT_URI = 'https://redwsss.github.io/mysite/dashboard.html';

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
        } else {
            document.getElementById('username').textContent = 'Не авторизован';
            document.getElementById('status').textContent = 'Войдите через Discord';
        }
    }
}

// Вход через Discord
function login() {
    const authUrl = `https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=token&scope=identify`;
    window.location.href = authUrl;
}

// Обмен кода на токен (не нужен при response_type=token)
async function exchangeCode(code) {
    // Этот метод не используется при response_type=token
    loadUserData(code);
}

// Загрузка данных пользователя из Discord API
async function loadUserData(token) {
    try {
        const response = await fetch('https://discord.com/api/users/@me', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!response.ok) {
            throw new Error('Ошибка авторизации');
        }
        
        const user = await response.json();
        
        // Отображаем данные
        document.getElementById('username').textContent = user.username;
        document.getElementById('avatar').src = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=128`;
        document.getElementById('status').textContent = `✅ Авторизован как ${user.username}`;
        document.getElementById('rank').textContent = `Discord ID: ${user.id}`;
        document.getElementById('balance').textContent = 'Верификация через сайт пока недоступна';
        
    } catch (error) {
        console.error('Ошибка:', error);
        document.getElementById('username').textContent = 'Ошибка загрузки';
        document.getElementById('status').textContent = 'Токен недействителен. Войдите заново.';
        localStorage.removeItem('discord_token');
    }
}

// Верификация (заглушка)
function verify() {
    alert('Верификация через Discord бота. Напишите !верифицировать в Discord');
}

// Выход
function logout() {
    localStorage.removeItem('discord_token');
    window.location.href = 'index.html';
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('loginBtn')) {
        document.getElementById('loginBtn').addEventListener('click', login);
    }
    
    if (document.getElementById('verifyBtn')) {
        document.getElementById('verifyBtn').addEventListener('click', verify);
    }
    
    if (document.getElementById('logoutBtn')) {
        document.getElementById('logoutBtn').addEventListener('click', logout);
    }
    
    // Проверяем авторизацию на dashboard
    if (window.location.pathname.includes('dashboard')) {
        checkAuth();
    }
});

// Проверка hash для token
window.addEventListener('load', () => {
    if (window.location.hash) {
        const hash = window.location.hash.substring(1);
        const params = new URLSearchParams(hash);
        const token = params.get('access_token');
        
        if (token) {
            localStorage.setItem('discord_token', token);
            loadUserData(token);
            // Очищаем URL
            window.location.hash = '';
        }
    }
});
