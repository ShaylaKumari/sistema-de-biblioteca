// INTERFACE
let userEditingId = null;

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
        <table class="list-table">
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