const input = document.getElementById('place-input');
const notesList = document.getElementById('notes-list');
const themeToggle = document.getElementById('theme-toggle');

let notes = JSON.parse(localStorage.getItem('geoNotes')) || [];

// Функция отрисовки
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

// Добавление новой записи
function addNote(type) {
    const text = input.value.trim();
    if (!text) return;

    notes.push({ text, type });
    input.value = '';
    saveAndRender();
}

function deleteNote(index) {
    notes.splice(index, 1);
    saveAndRender();
}

function saveAndRender() {
    localStorage.setItem('geoNotes', JSON.stringify(notes));
    renderNotes();
}

// Слушатели событий
document.getElementById('add-planned').onclick = () => addNote('planned');
document.getElementById('add-visited').onclick = () => addNote('visited');

// Фильтрация
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.onclick = (e) => {
        document.querySelector('.filter-btn.active').classList.remove('active');
        e.target.classList.add('active');
        renderNotes(e.target.dataset.filter);
    };
});

// Смена темы
themeToggle.onclick = () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
};

// Первый запуск
renderNotes();