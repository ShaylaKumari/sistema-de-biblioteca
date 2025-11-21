function generateId() {
    return Date.now().toString();
}

function formatDate(dateISO) {
    const date = new Date(dateISO);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

// LOCALSTORAGE
function getLoans() {
    try {
        const data = localStorage.getItem('library_loans');
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Erro ao obter empréstimos:', error);
        return [];
    }
}

function registerLoan(loan) {
    try {
        const user = searchUserId(loan.userId);
        if (!user) {
            throw new Error('Usuário não encontrado');
        }

        const book = searchBookId(loan.bookId);
        if (!book) {
            throw new Error('Livro não encontrado');
        }
        if(!book.available) {
            throw new Error('Livro não disponível para empréstimo');
        }

        const loans = getLoans();

        const newLoan = {
            id: generateId(),
            userId: loan.userId,
            bookId: loan.bookId,
            userName: user.name,
            bookTitle: book.title,
            loanDate: new Date().toISOString(),
            devolutionDate: null,
            active: true
        };

        loans.push(newLoan);
        localStorage.setItem('library_loans', JSON.stringify(loans));

        updateBookAvailability(loan.bookId, false);

        return newLoan;
    } catch (error) {
        throw error;
    }
}

function registerDevolution(id) {
    try {
        const loans = getLoans();
        const index = loans.findIndex(l => l.id === id);

        if (index === -1) {
            throw new Error('Empréstimo não encontrado');
        }

        if (!loans[index].active) {
            throw new Error('Empréstimo já foi devolvido');
        }

        loans[index].devolutionDate = new Date().toISOString();
        loans[index].active = false;

        localStorage.setItem('library_loans', JSON.stringify(loans));

        updateBookAvailability(loans[index].bookId, true);

        return loans[index];
    } catch (error) {
        throw error;
    }
}

function searchLoanId(id) {
    const loans = getLoans();
    return loans.find(l => l.id === id) || null;
}

// INTERFACE
let currentFilter = 'all';

function fillSelects() {
    const users = getUsers();
    const books = getBooks();

    const selectUser = document.getElementById('userId');
    const selectBook = document.getElementById('bookId');

    selectUser.innerHTML = '<option value="">-- Selecione um usuário --</option>';
    selectBook.innerHTML = '<option value="">-- Selecione um livro --</option>';

    users.forEach(user => {
        const option = document.createElement('option');
        option.value = user.id;
        option.textContent = `${user.name} (${user.email})`;
        selectUser.appendChild(option);
    });

    const booksAvailable = books.filter(book => book.available);
    booksAvailable.forEach(book => {
        const option = document.createElement('option');
        option.value = book.id;
        option.textContent = `${book.title} - ${book.author} (${book.year})`;
        selectBook.appendChild(option);
    });

    if (booksAvailable.length === 0) {
        const option = document.createElement('option');
        option.value = '';
        option.textContent = 'Nenhum livro disponível no momento';
        option.disabled = true;
        selectBook.appendChild(option);
    }
}

function filterLoans(loans) {
    switch (currentFilter) {
        case 'assets':
            return loans.filter(l => l.active);
        case 'returned':
            return loans.filter(l => !l.active);
        default:
            return loans;
    }
}

function renderLoans() {
    const allLoans = getLoans();
    const loans = filterBooks(allLoans);
    const listLoans = document.getElementById('listLoans');
    const emptyState = document.getElementById('emptyState');
    const totalLoans = document.getElementById('totalLoans');

    totalLoans.textContent = `(${loans.length} de ${allLoans.length})`;

    if (loans.length === 0) {
        listLoans.innerHTML = '';
        emptyState.classList.add('show');

        if (currentFilter !== 'all') {
            emptyState.innerHTML = `
                <p class="empty-icon">📖</p>
                <p class="empty-text">Nenhum empréstimo encontrado com este filtro</p>
                <p class="empty-subtext">Tente alterar o filtro ou registrar novos empréstimos</p>
            `;
        } else {
            emptyState.innerHTML = `
                <p class="empty-icon">📖</p>
                <p class="empty-text">Nenhum empréstimo registrado ainda</p>
                <p class="empty-subtext">Use o formulário acima para registrar o primeiro empréstimo</p>
            `;
        }
        return;
    }

    emptyState.classList.remove('show');

    const sortedLoans = loans.sort((a, b) => 
        new Date(b.loanDate) - new Date(a.loanDate)
    );

    listLoans.innerHTML = `
        <table class="list-table">
            <thead>
                <tr>
                    <th>USUÁRIO</th>
                    <th>LIVRO</th>
                    <th>DATA EMPRÉSTIMO</th>
                    <th>DATA DEVOLUÇÃO</th>
                    <th>STATUS</th>
                    <th>AÇÕES</th>
                </tr>
            </thead>
            <tbody>
                ${
                    sortedLoans.map(loan => `
                        <tr>
                            <td>${loan.userNome}</td>
                            <td>${loan.bookTitle}</td>
                            <td>${formatDate(loan.loanDate)}</td>
                            <td>${formatDate(loan.loanDevolution)}</td>
                            <td>
                                ${loan.active 
                                    ? '<span class="status sts-borrowed">📖 Ativo</span>'
                                    : '<span class="status sts-success">✅ Devolvido</span>'
                                }
                            </td>
                            <td>
                                ${loan.active 
                                    ? `<button class="btn-confirm" onclick="confirmDevolution('${loan.id}')">
                                        ✅ Registrar Devolução
                                    </button>`
                                    : ''
                                }
                            </td>
                        </tr>
                    `).join('')
                }
            </tbody>
        </table>
    `;

}

function confirmDevolution(id) {
    const loan = searchLoanId(id);

    if (!loan) {
        console.log('Empréstimo não encontrado', 'error');
        return;
    }

    const confirmation = confirm(`Confirmar devolução do livro "${loan.bookTitle}"?`);

    if (confirmation) {
        try {
            registerDevolution(id);
            alert('Devolução registrada com sucesso!');
            renderLoans();
            fillSelects();
        } catch (error) {
            console.error(error);
        }
    }
}

function handleSubmit(event) {
    event.preventDefault();

    const userId = document.getElementById('userId').value;
    const bookId = document.getElementById('bookId').value;

    if (!userId) {
        alert('Selecione um usuário');
        return
    }

    if (!bookId) {
        alert('Selecione um livro');
        return;
    }

    const loanData = {
        userId: userId,
        bookId: bookId
    };

    try {
        registerLoan(loanData);
        alert('Empréstimo registrado com sucesso!');

        document.getElementById('formLoans').reset();

        renderLoans();
        fillSelects();
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

    renderLoans();
}

document.addEventListener('DOMContentLoaded', function() {
    fillSelects();

    renderLoans();

    const form = document.getElementById('formLoans');
    form.addEventListener('submit', handleSubmit);

    const btnFilter = document.querySelectorAll('.btn-filter');
    btnFilter.forEach(btn => {
        btn.addEventListener('click', function() {
            applyFilter(this.dataset.filter);
        });
    });
});
