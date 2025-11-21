function CalculateDataHome() {
    const users = getUsers();
    const totalUsers = document.getElementById('totalUsers');
    totalUsers.textContent = users.length;

    const allBooks = getBooks();
    const totalBooks = document.getElementById('totalBooks');
    totalBooks.textContent = allBooks.length;

    const booksAvailable = allBooks.filter(book => book.available);
    const totalBooksAvailable = document.getElementById('booksAvailable');
    totalBooksAvailable.textContent = booksAvailable.length;

    const allLoans = getLoans();
    const activeLoans = allLoans.filter(loan => loan.active);
    const totalActiveLoans = document.getElementById('activeLoans');
    totalActiveLoans.textContent = activeLoans.length;
}

CalculateDataHome();

