# API + SPA de Resenha – Desenvolvimento Front-End

Esse projeto é uma aplicação web desenvolvida para gerenciar usuários, livros e resenhas, com autenticação de usuários via **JWT**. 
O front-End (React + Vite) consome uma API REST (Node.js + Express) separada, seguindo a arquitetura **(SPA+API)**

A aplicação implementa um fluxo mínimo: **registrar -> autenticar -> acessar área autenticada -> encerrar sessão**, além de um CRUD completo para usuários e para dois recursos do sistema **(Livros e Resenhas)**

---

## Arquitetura

- **Front-End:** React + Vite: Interface, rotas, formulários, validações de UX e consumo da API.
- **Back-End:** Regras, autenticação JWT, validação de dados com AJV e persistência no banco. 

---

## Diagrama

```text
[React (SPA)] --> [API Node/Express] --> [MySQL]
```

---

## Funcionalidades

-**Autenticação:**
    Cadastro de usuário;
    Login (retorna o JWT);
    Rotas protegidas;
    Logout (remove token e usuário da sessão no front-end)

-**Usuários (CRUD):**
    Listar usuários;
    Cadastrar usuários;
    Editar usuário;
    Excluir usuário.

-**Livros (CRUD):** 
    Listar;
    Detalhar;
    Criar;
    Editar;
    Excluir.

--**Resenhas (CRUD):** 
    Listar;
    Criar.
    Editar;
    Excluir. 

---

## Organização do Projeto

Estrutura principal de pastas/arquivos:

```text
public/            

src/
    auth/           
        AuthContext.jsx
        useAuth.js
        useAuthFetch.jsx

    components/  
        livros/    
        resenhas/ 
        shared/
        usuarios/

    pages/
        livros/
        resenhas/
        usuarios/
    
    App.jsx
    Layout.jsx
    Perfil.jsx
    Start.jsx

    routes/

    main.jsx

.env.example
eslint.config.js
index.css
package.json      
README.md
vite.config.js
```

---

## Instalação e Execução

-**BACK-END:**
Clonar ou baixar o repositório. (https://github.com/mdrmarcela/API---Resenha---Desenvolvimento-Back-End)

Dentro da pasta do projeto, instalar as dependências:

```text
npm install
```

Certificar-se de que o MySQL está rodando e o banco resenhas_db existe.

Iniciar a aplicação em modo desenvolvimento:

```text
npm run dev
# ou
npx nodemon
```

A API ficará disponível em (por padrão):
http://localhost:3000

-**FRONT-END:**
Clonar ou baixar este repositório.

Dentro da pasta do projeto, instalar as dependências:

```text
npm install
```

Iniciar a aplicação em modo desenvolvimento:

```text
npm run dev
```

O Front-End ficará disponível em:
http://localhost:5173


---

## Autenticação e Fluxo de Uso

A API utiliza JWT (JSON Web Token) para proteger as rotas.
Fluxo básico:

1. Cadastro de usuário;

2. Login para obter um token JWT;

3. Acessar a área autentica:
    Criar livro;
    Listar livro;
    Ver detalhes do livro;
    Criar/editar/excluir resenha;

4. Logout.

---

## Rotas principais

### Usuários
- `POST /usuarios` – cadastro de usuário 
- `POST /usuarios/login` – login e geração de JWT 
- `GET /usuarios` – lista usuários 
- `PUT /usuario/:id` – atualizar usuário
- `DELETE /usuario/:id` – remover usuário


### Livros (Recurso A)
- `GET /livros` – lista todos
- `GET /livros/:id` – detalhes
- `POST /livros` – criar 
- `PUT /livros/:id` – atualizar 
- `DELETE /livros/:id` – remover  

### Resenhas (Recurso B aninhado)
- `GET /resenha` – lista resenhas do livro
- `GET /resenha/:id` – busca por id
- `POST /resenha` – criar resenhas para livro 
- `PUT /resenha/:id` – atualizar resenha 
- `DELETE /resenha/:id` – remover resenha 

---

### Validação
Os dados de entrada são validados no servidor com Ajv, evitando envio de campos extras e garantindo tipos e obrigatoriedades conforme os schemas definidos. 

---
