// INTERFACE
let bookEditingId = null;
let currentFilter = 'all';

function renderBooks() {
    const allBooks = getBooks();
    const books = filterBooks(allBooks);
    const listBooks = document.getElementById('listBooks');
    const emptyState = document.getElementById('emptyState');
    const totalBooks = document.getElementById('totalBooks');

    totalBooks.textContent = `(${books.length} de ${allBooks.length})`;

    if (books.length === 0) {
        listBooks.innerHTML = '';
        emptyState.classList.add('show');

        if (currentFilter !== 'all') {
            emptyState.innerHTML = `
                <p class="empty-icon">📚</p>
                <p class="empty-text">Nenhum livro encontrado com este filtro</p>
                <p class="empty-subtext">Tente alterar o filtro ou cadastrar novos livros</p>
            `;
        } else {
            emptyState.innerHTML = `
                <p class="empty-icon">📚</p>
                <p class="empty-text">Nenhum livro cadastrado ainda</p>
                <p class="empty-subtext">Use o formulário acima para cadastrar o primeiro livro</p>
            `;
        }
        return;
    }

    emptyState.classList.remove('show');

    const sortedBooks = books.sort((a, b) => a.title.localeCompare(b.title));

    listBooks.innerHTML = `
        <table class="list-table">
            <thead>
                <tr>
                    <th>TÍTULO</th>
                    <th>AUTOR</th>
                    <th>ANO</th>
                    <th>GÊNERO</th>
                    <th>STATUS</th>
                    <th>AÇÕES</th>
                </tr>
            </thead>
            <tbody>
                ${
                    sortedBooks.map(book => `
                        <tr>
                            <td>${book.title}</td>
                            <td>${book.author}</td>
                            <td>${book.year}</td>
                            <td>${book.genre}</td>
                            <td>
                                ${book.available 
                                    ? '<span class="status sts-success">✅ Disponível</span>'
                                    : '<span class="status sts-borrowed">📖 Emprestado</span>'
                                }
                            </td>
                            <td>
                                <button class="btn-edit" onclick="editBook('${book.id}')">
                                    ✏️ Editar
                                </button>
                                <button class="btn-delete" onclick="confirmBookDeletion('${book.id}')">
                                    🗑️ Excluir
                                </button>
                            </td>
                        </tr>
                    `).join('')
                }
            </tbody>
        </table>
    `;

}

function clearForm() {
    document.getElementById('formBook').reset();
    bookEditingId = null;
    document.getElementById('btnSubmit').innerHTML = '➕ Cadastrar Livro';
}

function editBook(id) {
    const book = searchBookId(id);

    if (!book) {
        console.log('Livro não encontrado', 'error');
        return;
    }

    document.getElementById('title').value = book.title;
    document.getElementById('author').value = book.author;
    document.getElementById('year').value = book.year;
    document.getElementById('genre').value = book.genre;

    bookEditingId = id;
    document.getElementById('btnSubmit').innerHTML = '💾 Atualizar Livro'
    document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });
}

function confirmBookDeletion(id) {
    const book = searchBookId(id);

    if (!book) {
        console.log('Livro não encontrado', 'error');
        return
    }

    const confirmation = confirm(`Tem certeza que deseja excluir o livro "${book.title}"?`);

    if (confirmation) {
        try {
            deleteBook(id);
            alert('Livro excluído com sucesso!');
            renderBooks();

            if (bookEditingId === id) {
                clearForm();
            }
        } catch (error) {
            console.error(error);
        }
    }
}

function handleSubmit(event) {
    event.preventDefault();

    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const year = document.getElementById('year').value;
    const genre = document.getElementById('genre').value;

    const bookData = {
        title: title,
        author: author,
        year: year,
        genre: genre
    };

    try {
        if (bookEditingId) {
            updateBook(bookEditingId, bookData);
            alert('Livro atualizado com sucesso!');
        } else {
            saveBook(bookData);
            alert('Livro cadastrado com sucesso!');
        }

        clearForm();
        renderBooks();
    } catch (error) {
        console.error(error);
    }
}

function applyFilter(filter) {
    currentFilter = filter;

    const btnFilter = document.querySelectorAll('.btn-filter');
    btnFilter.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.filter === filter) {
            btn.classList.add('active');
        }
    });

    renderBooks();
}

document.addEventListener('DOMContentLoaded', function() {
    renderBooks();

    const form = document.getElementById('formBook');
    form.addEventListener('submit', handleSubmit);

    const btnFilter = document.querySelectorAll('.btn-filter');
    btnFilter.forEach(btn => {
        btn.addEventListener('click', function() {
            applyFilter(this.dataset.filter);
        });
    });
});