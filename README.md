🐾 Agenda Veterinária: Sistema Full-Stack

Visão Geral

Este projeto é uma aplicação de gestão para clínicas veterinárias, permitindo o cadastro e gerenciamento de pets e o agendamento/acompanhamento de consultas.

🌟 Tecnologias

Área

Tecnologia

Descrição

Frontend

React

Biblioteca JavaScript para construção da interface de usuário.

Styling

Tailwind CSS

Framework CSS utilitário para design responsivo e rápido.

Build Tool

Vite

Ferramenta de construção e servidor de desenvolvimento para o frontend.

Backend

Node.js / Express

Ambiente de execução e framework para o servidor API REST.

ORM

Sequelize

Object-Relational Mapper (ORM) para interação simplificada com o banco de dados.

Banco de Dados

MySQL

Banco de dados relacional (configurável via sequelize.js).

🚀 Estrutura de Arquivos (Monorepo)

O projeto está organizado em duas áreas principais: o servidor (backend) e a aplicação cliente (src).

/agenda-veterinaria
├── /backend                    # Servidor Node.js/Express
│   ├── /config                 # Configuração do Sequelize
│   ├── /controllers            # Lógica de negócio (CRUD)
│   ├── /models                 # Definição dos modelos de dados (Pet, Consulta)
│   ├── /routes                 # Definição dos endpoints da API
│   ├── package.json            # Dependências do Backend (Express, Sequelize)
│   └── server.js               # Arquivo principal que inicia o servidor
├── /src                        # Código-fonte do React/Frontend (Vite)
│   ├── App.jsx                 # Componente principal da aplicação
│   └── main.jsx                # Ponto de entrada do React
├── index.html                  # HTML principal (Vite)
├── package.json                # Dependências do Frontend (React, Tailwind)
└── README.md                   # Este arquivo




🛠️ Configuração e Instalação

Siga os dois passos abaixo para configurar e iniciar o projeto completo (Backend e Frontend).

Pré-requisitos

Node.js (versão LTS 18+ recomendada)

Um servidor MySQL rodando.

Passo 1: Configuração e Inicialização do Backend

O servidor Node.js/Express deve ser iniciado primeiro, pois o Frontend depende dele.

Navegue para o diretório do backend:

cd backend




Instale as dependências do servidor:

npm install




Configuração do Banco de Dados:

Crie um banco de dados vazio no MySQL (ex: agenda_vet).

Edite o arquivo config/sequelize.js com suas credenciais (host, porta, usuário, senha, nome do banco).

Inicie o Servidor:
O server.js é responsável por conectar ao banco e iniciar o Express.

# Para desenvolvimento (com Nodemon para restart automático)
npm run dev 

# Para produção (ambiente estável)
npm start 




O servidor da API estará disponível em http://localhost:3000.

Passo 2: Inicialização do Frontend (React)

O frontend é um projeto Vite separado.

Volte para a pasta raiz do projeto e instale as dependências do Frontend:

cd .. # Volta para a pasta raiz /agenda-veterinaria
npm install




Inicie a Aplicação React:

npm run dev 




A aplicação será aberta no seu navegador, geralmente em http://localhost:5173.

⚙️ Endpoints da API (Backend)

Todos os endpoints estão prefixados com /api/.

Pets (/api/pets)

Método

Rota

Descrição

Controlador

GET

/api/pets

Lista todos os pets cadastrados. Suporta ?busca=termo para filtro.

petController.getAllPets

GET

/api/pets/:id

Busca um pet específico por ID.

petController.getPetById

POST

/api/pets

Cadastra um novo pet.

petController.createPet

PUT

/api/pets/:id

Atualiza os dados de um pet.

petController.updatePet

DELETE

/api/pets/:id

Deleta um pet e suas consultas associadas.

petController.deletePet

Consultas (/api/consultas)

Método

Rota

Descrição

Controlador

GET

/api/consultas

Lista todas as consultas (inclui dados do Pet).

consultaController.getAllConsultas

GET

/api/consultas/search?termo=

Busca consultas por Vet, Pet ou Dono.

consultaController.getConsultasBySearch

GET

/api/consultas/:id

Busca uma consulta por ID.

consultaController.getConsultaById

POST

/api/consultas

Agenda uma nova consulta.

consultaController.createConsulta

PUT

/api/consultas/:id

Atualiza uma consulta existente.

consultaController.updateConsulta

DELETE

/api/consultas/:id

Deleta uma consulta.

consultaController.deleteConsulta

🗺️ Roadmap e Pontos de Melhoria

Esta seção lista áreas para desenvolvimento futuro e melhorias arquiteturais que aumentarão a manutenibilidade e escalabilidade do projeto.

1. Refatoração do Frontend e Modularização (Prioridade Alta)

O código do React está centralizado no arquivo App.jsx, onde as três principais "telas" da aplicação (Listagem, Cadastro de Pet e Cadastro de Consulta) estão acopladas. Isso prejudica a manutenção, o reuso de código e a legibilidade.

Melhoria: Aplicar o princípio de componentes do React, separando a UI, formulários e lógica de apresentação em módulos independentes e reutilizáveis.

Ação: Criar uma pasta /src/components para isolar componentes como PetForm, ConsultaTable, Navbar e a lógica de navegação.

2. Validação de Dados Mais Robusta

Atualmente, a validação de dados é mínima ou inexistente no backend.

Melhoria: Implementar validação de schema (e.g., usando Joi ou Express-validator) nas rotas do Express para garantir que os dados recebidos estejam corretos antes de serem passados ao Sequelize.

Ação: Adicionar middleware de validação para as rotas POST e PUT.

3. Implementação de Migrations no Backend

O Sequelize está usando sequelize.sync(), que não é ideal para ambientes de produção.

Melhoria: Mudar o fluxo de inicialização do banco de dados para usar Migrations.

Ação: Adicionar sequelize-cli e criar arquivos de migration para a criação e alteração das tabelas.

4. Gestão de Estado Global

O gerenciamento de estado entre as telas do React (menu principal, formulários, listas) pode se tornar complexo à medida que o projeto cresce.

Melhoria: Avaliar a necessidade de uma biblioteca de gerenciamento de estado (e.g., Redux, Zustand) ou usar o Context API do React de forma mais estruturada para a comunicação entre componentes.

🤝 Contribuição

Contribuições são bem-vindas! Se você deseja melhorar o código, corrigir bugs ou adicionar novos recursos, siga estas etapas:

Faça um Fork do projeto.

Crie uma nova branch (git checkout -b feature/nova-funcionalidade).

Faça suas alterações e commit.

Faça Push para a sua branch (git push origin feature/nova-funcionalidade).

Abra um Pull Request.

Licença: Este projeto está sob a licença ISC.
