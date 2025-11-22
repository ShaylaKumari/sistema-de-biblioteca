# 📚 Sistema de Biblioteca

O foco deste projeto foi aplicar, na prática, os conceitos estudados no Módulo I — Lógica de Programação, utilizando JavaScript para construir todas as regras de negócio, validações e controles do sistema.

## 📋 Funcionalidades

### 🏠 Página Inicial
- Índices dinâmicos de:
  - Total de usuários
  - Total de livros
  - Livros disponíveis
  - Empréstimos ativos
- Acesso rápido para:
  - Tela de usuários
  - Tela de livros
  - Tela de empréstimos
 
### 👤 Gerenciamento de Usuários
- Validação de campos obrigatórios
- Validação de formato de email
- Impedimento de email duplicado
- Edição com todas as validações
- Opção de cancelar edição
- Cadastro com:
  - Nome completo
  - Email
  - Id gerado dinamicamente
- Bloqueio de exclusão caso o usuário possua empréstimo ativo
- Exclusão de usuários
- Contador dinâmico
- Listagem de usuários

### 📚 Gerenciamento de Livros
- Validação de campos obrigatórios
- Validação de ano (permitido apenas entre 1000 e 2100)
- Impedimento de título duplicado
- Edição com todas as validações
- Opção de cancelar edição
- Cadastro com:
  - Título
  - Autor
  - Ano
  - Gênero
  - Id gerado dinamicamente (oculto para o usuário)
- Bloqueio de exclusão caso o livro possua empréstimo ativo
- Exclusão de livros
- Contador dinâmico
- Listagem de livros
- Filtro por status (disponível/emprestado)

### 📖 Gerenciamento de Empréstimos
- Validação de campos obrigatórios
- Registro com:
  - Usuário
  - Livro disponível
- Histórico de empréstimo com:
  - Usuário (nome e email)
  - Livro (título e autor)
  - Data de empréstimo
  - Data de devolução
  - Status (ativo/devolvido)
  - Botão de devolução (exibido apenas quando o status é 'ativo')
- Atualização imediata de:
  - Status do empréstimo
  - Disponibilidade do livro
- Contador dinâmico
- Filtro por status (ativo/devolvido)

## 💾 Persistência de Dados
Todo o sistema utiliza LocalStorage como mecanismo de armazenamento, sem necessidade de banco de dados ou servidor.

 ### Chaves utilizadas:
   - library_users
   - library_books
   - library_loans

## 🛠️ Tecnologias Utilizadas
  - HTML5
  - CSS (design não responsivo pois o foco do projeto são as funcionalidades)
  - JavaScript
  - Todas as variáveis e funções foram nomeadas em inglês, seguindo boas práticas.

## 🌐 Acesse o projeto
🔗 Link para o projeto hospedado: [Sistema de Biblioteca](https://shaylakumari.github.io/sistema-de-biblioteca/index.html)

## 👩‍💻 Desenvolvido por
[**Ananda Shayla Soares Kumari**](https://shaylakumari.github.io/Portfolio/#home)  
*Projeto criado para a disciplina de Lógica de Programação.*
