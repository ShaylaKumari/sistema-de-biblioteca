function generateId() {
    return Date.now().toString();
}

function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function formatDate(dateISO) {
    const date = new Date(dateISO);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}


// USERS
function getUsers() {
    try {
        const data = localStorage.getItem('library_users');
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Erro ao obter usuários:', error);
        return[];
    }
}

function saveUser(user) {
    try {
        const users = getUsers();
        const emailExists = users.some(u => u.email === user.email);
        if (emailExists) {
            throw new Error('Email já cadastrado');
        }

        const newUser = {
            id: generateId(),
            name: user.name.trim(),
            email: user.email.trim().toLowerCase()
        };

        users.push(newUser);
        localStorage.setItem('library_users', JSON.stringify(users));

        return newUser;

    } catch(error) {
        throw error;
    }
}

function updateUser(id, updatedData) {
    try {
        if (!validateEmail(updatedData.email)) {
            throw new Error('Email inválido');
        }

        const users = getUsers();
        const index = users.findIndex(u => u.id === id);

        if (index === -1) {
            throw new Error('Usuário não encontrado');
        }

        const emailExists = users.some(u => u.email === updatedData.email && u.id !== id);
        if (emailExists) {
            throw new Error('Email já cadastrado');
        }

        users[index] = {
            ...users[index],
            name: updatedData.name.trim(),
            email: updatedData.email.trim().toLowerCase()
        };

        localStorage.setItem('library_users', JSON.stringify(users));

        return users[index];

    } catch (error) {
        throw error;
    }
}

function deleteUser(id) {
    try {
        const loans = getLoans();
        const activeLoans = loans.some(aL => aL.userId === id && aL.active);

        if (activeLoans) {
            throw new Error('Não é possível excluir usuário com empréstimos ativos');
        }

        const users = getUsers();
        const filteredUsers = users.filter(u => u.id !== id);

        localStorage.setItem('library_users', JSON.stringify(filteredUsers));
    } catch (error) {
        throw error;
    }
}

function searchUserId(id) {
    const users = getUsers();
    return users.find(u => u.id === id) || null;
}


// BOOKS
function getBooks() {
    try {
        const data = localStorage.getItem('library_books');
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Erro ao obter livros:', error);
        return [];
    }
}

function saveBook(book) {
    try {
        const books = getBooks();
        const titleExists = books.some(b => b.title === book.title);
        if (titleExists) {
            throw new Error('Livro já cadastrado');
        }

        const newBook = {
            id: generateId(),
            title: book.title.trim(),
            author: book.author.trim(),
            year: parseInt(book.year),
            genre: book.genre.trim(),
            available: true
        };

        books.push(newBook);
        localStorage.setItem('library_books', JSON.stringify(books));

        return newBook;
    } catch (error) {
        throw error;
    }
}

function updateBook(id, updatedData) {
    try {
        const books = getBooks();
        const index = books.findIndex(b => b.id === id);

        if (index === -1) {
            throw new Error('Livro não encontrado');
        }

        const titleExists = books.some(b => b.title === updatedData.title && b.id !== id);
        if (titleExists) {
            throw new Error('Livro já cadastrado');
        }

        books[index] = {
            ...books[index],
            title: updatedData.title.trim(),
            author: updatedData.author.trim(),
            year: parseInt(updatedData.year),
            genre: updatedData.genre(trim)
        };

        localStorage.setItem('library_books', JSON.stringify(books));

        return books[index];
    } catch (error) {
        throw error;
    }
}

function deleteBook(id) {
    try {
        const loans = getLoans();
        const activeLoans = loans.some(aL => aL.bookId === id && aL.active);

        if (activeLoans) {
            throw new Error('Não é possível excluir livro com empréstimos ativos');
        }

        const books = getBooks();
        const filteredBooks = books.filter(b => b.id !== id);

        localStorage.setItem('library_books', JSON.stringify(filteredBooks));
    } catch (error) {
        throw error;
    }
}

function searchBookId(id) {
    const books = getBooks();
    return books.find(b => b.id === id) || null;
}

function updateBookAvailability(id, available) {
    try {
        const books = getBooks();
        const index = books.findIndex(b => b.id === id);

        if (index === -1) {
            throw new Error('Livro não encontrado')
        }

        books[index].available = available;
        localStorage.setItem('library_books', JSON.stringify(books));
    } catch (error) {
        throw error;
    }
}

function filterBooks(books) {
    switch(currentFilter) {
        case 'available':
            return books.filter(book => book.available);
        case 'borrowed':
            return books.filter(book => !book.available);
        default:
            return books;
    }
}


// LOANS
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
            userEmail: user.email,
            bookTitle: book.title,
            bookAuthor: book.author,
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