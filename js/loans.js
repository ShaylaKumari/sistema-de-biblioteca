// INTERFACE
let currentFilter = 'all';

function fillSelects() {
    const users = getUsers();
    const books = getBooks();

    const selectUser = document.getElementById('userId');
    const selectBook = document.getElementById('bookId');

    selectUser.innerHTML = '<option value="">-- Selecione um usuário --</option>';
    selectBook.innerHTML = '<option value="">-- Selecione um livro --</option>';

    const booksAvailable = books.filter(book => book.available);

    const sortedUsers = users.sort((a, b) => a.name.localeCompare(b.name));
    const sortedBooks = booksAvailable.sort((a, b) => a.title.localeCompare(b.title));

    sortedUsers.forEach(user => {
        const option = document.createElement('option');
        option.value = user.id;
        option.textContent = `${user.name} (${user.email})`;
        selectUser.appendChild(option);
    });

    sortedBooks.forEach(book => {
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
    const loans = filterLoans(allLoans);
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
                            <td>${loan.userName}<br><small>${loan.userEmail}</small></td>
                            <td id="bold">${loan.bookTitle}<br><small>${loan.bookAuthor}</small></td>
                            <td>${formatDate(loan.loanDate)}</td>
                            <td>
                                ${loan.devolutionDate ? `${formatDate(loan.devolutionDate)}` : '-'}
                            </td>
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
        showNotification('❌ Empréstimo não encontrado', 'error');
        return;
    }

    const confirmation = confirm(`Confirmar devolução do livro "${loan.bookTitle}"?`);

    if (confirmation) {
        try {
            registerDevolution(id);
            showNotification('✅ Devolução registrada com sucesso!', 'success');
            renderLoans();
            fillSelects();
        } catch (error) {
            showNotification(error.message, 'error');
        }
    }
}

function handleSubmit(event) {
    event.preventDefault();

    const userId = document.getElementById('userId').value;
    const bookId = document.getElementById('bookId').value;

    const loanData = {
        userId: userId,
        bookId: bookId
    };

    try {
        registerLoan(loanData);
        showNotification('✅ Empréstimo registrado com sucesso!', 'success');

        document.getElementById('formLoans').reset();

        renderLoans();
        fillSelects();
    } catch (error) {
        showNotification(error.message, 'error');
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
