const input = document.getElementById('place-input');
const notesList = document.getElementById('notes-list');
const themeToggle = document.getElementById('theme-toggle');
const suggestionList = document.getElementById('autocomplete-list');
const btnPlanned = document.getElementById('add-planned');
const btnVisited = document.getElementById('add-visited');

// База данных разрешенных мест (можно расширять бесконечно)
const locationsDB = [
    "Алматы, Казахстан", "Астана, Казахстан", "Шымкент, Казахстан",
    "Токио, Япония", "Киото, Япония", "Нью-Йорк, США", 
    "Лондон, Великобритания", "Париж, Франция", "Берлин, Германия", 
    "Мюнхен, Германия", "Рим, Италия", "Сеул, Южная Корея", 
    "Барселона, Испания", "Прага, Чехия", "Стамбул, Турция"
];

let notes = JSON.parse(localStorage.getItem('geoNotes')) || [];

// Управление доступностью кнопок
function toggleButtons(isValid) {
    btnPlanned.disabled = !isValid;
    btnVisited.disabled = !isValid;
}

// Отслеживание ввода текста
input.addEventListener('input', () => {
    const value = input.value.trim().toLowerCase();
    suggestionList.innerHTML = '';
    
    if (!value) {
        suggestionList.style.display = 'none';
        toggleButtons(false);
        return;
    }

    // Фильтруем базу данных совпадений
    const matches = locationsDB.filter(loc => loc.toLowerCase().includes(value));

    if (matches.length > 0) {
        suggestionList.style.display = 'block';
        matches.forEach(match => {
            const div = document.createElement('div');
            div.className = 'suggestion-item';
            div.textContent = match;
            
            // Клик по подсказке
            div.onclick = () => {
                input.value = match;
                suggestionList.style.display = 'none';
                toggleButtons(true); // Разрешаем добавление
            };
            suggestionList.appendChild(div);
        });
    } else {
        suggestionList.style.display = 'none';
    }

    // Проверяем, ввёл ли пользователь точное имя из базы вручную
    const exactMatch = locationsDB.some(loc => loc.toLowerCase() === input.value.trim().toLowerCase());
    toggleButtons(exactMatch);
});

// Закрытие списка при клике вне его
document.addEventListener('click', (e) => {
    if (e.target !== input) {
        suggestionList.style.display = 'none';
    }
});

// Добавление новой записи
function addNote(type) {
    const text = input.value.trim();
    if (!text) return;

    notes.push({ text, type });
    input.value = '';
    toggleButtons(false); // Снова блокируем кнопки
    saveAndRender();
}

// Отрендерить заметки
function renderNotes(filter = 'all') {
    notesList.innerHTML = '';
    const filtered = notes.filter(n => filter === 'all' || n.type === filter);

    filtered.forEach((note, index) => {
        const card = document.createElement('div');
        card.className = `note-card ${note.type}`;
        card.innerHTML = `
            <span>${note.text}</span>
            <button onclick="deleteNote(${index})" class="delete-btn">Удалить</button>
        `;
        notesList.appendChild(card);
    });
}

function deleteNote(index) {
    notes.splice(index, 1);
    saveAndRender();
}

function saveAndRender() {
    localStorage.setItem('geoNotes', JSON.stringify(notes));
    renderNotes();
}

document.getElementById('add-planned').onclick = () => addNote('planned');
document.getElementById('add-visited').onclick = () => addNote('visited');

document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.onclick = (e) => {
        document.querySelector('.filter-btn.active').classList.remove('active');
        e.target.classList.add('active');
        renderNotes(e.target.dataset.filter);
    };
});

themeToggle.onclick = () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
};

renderNotes();
