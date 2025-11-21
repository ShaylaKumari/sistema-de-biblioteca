let userEditingId = null;

function generateId() {
    return Date.now().toString();
}

function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// LOCALSTORAGE
function getUsers() {
    try {
        const dados = localStorage.getItem('library_users');
        return dados ? JSON.parse(dados) : [];
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

// INTERFACE
function renderUsers() {
    const users = getUsers();
    const listUsers = document.getElementById('listUsers');
    const emptyState = document.getElementById('emptyState');
    const totalUsers = document.getElementById('totalUsers');

    totalUsers.textContent = users.length;

    if (users.length === 0) {
        listUsers.innerHTML = '';
        emptyState.classList.add('show');
        return;
    }

    emptyState.classList.remove('show');

    const sortedUsers = users.sort((a, b) => a.name.localeCompare(b.name));

    listUsers.innerHTML = `
        <table class="users-table">
            <thead>
                <tr>
                    <th>NOME</th>
                    <th>EMAIL</th>
                    <th>ID</th>
                    <th>AÇÕES</th>
                </tr>
            </thead>
            <tbody>
                ${
                    sortedUsers.map(user => `
                        <tr>
                            <td>${user.name}</td>
                            <td>${user.email}</td>
                            <td>${user.id}</td>
                            <td>
                                <button class="btn-edit" onclick="editUser('${user.id}')">
                                    ✏️ Editar
                                </button>
                                <button class="btn-delete" onclick="confirmUserDeletion('${user.id}')">
                                    🗑️ Excluir
                                </button>
                            </td>
                        </tr>
                    `).join('')
                }
            </tbody>
        </table>
    `;

};

function clearForm() {
    document.getElementById('formUser').reset();
    userEditingId = null;
    document.getElementById('btnSubmit').innerHTML = '➕ Cadastrar Usuário';
}

function editUser(id) {
    const user = searchUserId(id);

    if(!user) {
        console.log('Usuário não encontrado', 'error');
        return;
    }

    document.getElementById('name').value = user.name;
    document.getElementById('email').value = user.email;

    userEditingId = id;
    document.getElementById('btnSubmit').innerHTML = '💾 Atualizar Usuário';
    document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });
}

function confirmUserDeletion(id) {
    const user = searchUserId(id);

    if(!user) {
        console.log('Usuário não encontrado', 'error');
        return;
    }

    const confirmation = confirm(`Tem certeza que deseja excluir o usuário "${user.name}"?`);

    if (confirmation) {
        try {
            deleteUser(id);
            alert('Usuário excluído com sucesso!');
            renderUsers();

            if (userEditingId === id) {
                clearForm();
            }
        } catch (error) {
            console.error(error);
        }
    }
}

function handleSubmit(event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;

    const userData = {
        name: name,
        email: email
    };

    try {
        if (userEditingId) {
            updateUser(userEditingId, userData);
            alert('Usuário atualizado com sucesso!');
        } else {
            saveUser(userData);
            alert('Usuário cadastrado com sucesso!');
        }

        clearForm();
        renderUsers();
    } catch (error) {
        console.error(error);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    renderUsers();

    const form = document.getElementById('formUser');
    form.addEventListener('submit', handleSubmit);
});