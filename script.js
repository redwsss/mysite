// Конфигурация
const CLIENT_ID = '1464524362005741720';
const REDIRECT_URI = 'https://redwsss.github.io/mysite/dashboard.html';
const API_URL = 'http://localhost:3000'; // Это не работает с GitHub Pages!

// Проверка авторизации
function checkAuth() {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    
    if (code) {
        exchangeCode(code);
    } else {
        const token = localStorage.getItem('discord_token');
        if (token) {
            loadUserData(token);
        }
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
        document.getElementById('status').textContent = `ID: ${user.id}`;
        document.getElementById('rank').textContent = 'Авторизован через Discord';
        
    } catch (error) {
        console.error('Ошибка:', error);
        document.getElementById('username').textContent = 'Ошибка загрузки';
    }
}
