# Goomer Menu API

API RESTful desenvolvida em Node.js com TypeScript e Express para gerenciar produtos, promoções e o cardápio de um restaurante, como parte de um desafio técnico.

## 🚀 Tecnologias Utilizadas

| Ferramenta | Descrição |
| :--- | :--- |
| `Node.js` | Ambiente de execução do JavaScript no servidor |
| `TypeScript` | Linguagem de programação superset de JavaScript, utilizada em todo o projeto |
| `Express` | Framework web minimalista para Node.js, utilizado para construir os endpoints da API |
| `PostgreSQL` | Banco de dados relacional SQL utilizado para persistência dos dados |
| `Sequelize` | ORM utilizado para gerenciar as *migrations* do banco de dados |
| `Docker` | Utilizado para containerizar o ambiente de banco de dados PostgreSQL |
| `npm` | Gerenciador de pacotes do Node.js |
| `ts-node-dev` | Dependência que observa as atualizações nos arquivos TypeScript para rodar o servidor automaticamente |
| `dotenv` | Dependência para carregar e proteger dados sensíveis de variáveis de ambiente |
| `Jest` | Framework de testes utilizado para os testes unitários e de integração da API |
| `Supertest` | Biblioteca para testar endpoints HTTP em conjunto com o Jest |
| `Thunder Client`| Interface gráfica utilizada para realizar e visualizar as requisições HTTP durante o desenvolvimento |
| `Swagger` | Framework para gerar a documentação interativa dos endpoints da API (`/api-docs`) |

## ✨ Funcionalidades

* CRUD completo de Produtos (com controle de visibilidade);
* CRUD completo de Promoções (com validação de dias da semana e horários);
* Validação de horários de promoção em intervalos de 15 minutos;
* Endpoint de Cardápio (`/menu`) que retorna produtos visíveis e aplica promoções ativas no momento da consulta;
* Documentação da API via Swagger em `/api-docs`;

## ⚙️ Pré-requisitos

Antes de começar, você precisará ter as seguintes ferramentas instaladas em sua máquina:
* [Node.js](https://nodejs.org/en/) (versão 18.x ou superior recomendada)
* [Docker Desktop](https://www.docker.com/products/docker-desktop/)

## 🔧 Configuração do Ambiente

1.  ### Clone o repositório:
    ```bash
    git clone https://github.com/mellyssamnds/goomer-menu-api
    cd goomer-menu-api
    ```

2.  ### Instale as dependências:
    ```bash
    npm install
    ```

3.  ### Variáveis de Ambiente:
    * Crie uma cópia do arquivo de exemplo `.env.example` e renomeie-a para `.env`.
    ```bash
    # No Windows (cmd):
    copy .env.example .env

    # No Linux/Mac/Git Bash:
    cp .env.example .env
    ```
        ```.env
        # Configuração para rodar a API LOCALMENTE conectando ao DB no Docker
        DB_HOST=127.0.0.1
        DB_PORT=5433
        DB_NAME=name_db
        DB_USER=user
        DB_PASS=password

        # Porta da API
        PORT=3000
        ```

## ▶️ Rodando o Projeto

Você precisa de dois terminais abertos na raiz do projeto.

**Terminal 1: Banco de Dados (Docker)**

1.  ### Suba o container do PostgreSQL:
    ```bash
    docker compose up -d db
    ```
    *Aguarde alguns segundos para a instância do banco de dados inicializar completamente.*

2.  ### Execute as migrations para criar as tabelas:
    ```bash
    npm run migrate
    ```

**Terminal 2: Aplicação (Localmente)**

1.  ### Inicie a API em modo de desenvolvimento (com hot-reload):
    ```bash
    npm run dev
    ```

**Acesso:**
* A API estará disponível em `http://localhost:3000`.
* A documentação do Swagger está em `http://localhost:3000/api-docs`.

## 🧪 Rodando os Testes

Para executar os testes automatizados, use o comando:
```bash
npm run test
```

## 🚧 Desafios e Problemas Encontrados

* Conciliar as credenciais entre o docker-compose.yml, o config.json e o .env exigiu atenção para evitar erros de autenticação. A solução foi padronizar as credenciais no docker-compose.yml e no config.json para as migrations, e usar o .env corretamente para a conexão da aplicação local.

* Lidar com a conversão de DECIMAL (retornado como string) para number nos testes e na lógica de negócio.

* Corrigir a incompatibilidade entre ENUM do PostgreSQL e text na consulta do cardápio (operator does not exist: text = enum...), exigindo o uso de TRIM e ::text[] na query.

* O desafio técnico exigia não usar o query builder do ORM, apenas SQL puro, demandando cuidado extra com sintaxe, injeção de parâmetros e tipagem.

* Garantir o uso correto de bind (parâmetros posicionais) em vez de replacements no Sequelize ao lidar com arrays (como days_of_week), para evitar o erro malformed array literal.

* Gestão das Migrations: A necessidade de reverter migrações na ordem inversa (undo promotions antes de undo products) quando há chaves estrangeiras, e a importância de destruir o volume (docker compose down -v) para garantir um estado limpo após erros.

* Configuração do Swagger com JSDoc: Enfrentei erros como YAMLSemanticError (chaves duplicadas) e TypeError: Cannot convert undefined/null devido à forma como as definições (tags, schemas) foram distribuídas e aos caminhos (apis) no swaggerConfig.ts. A solução foi centralizar todas as definições no swaggerConfig.ts e usar path.resolve para os caminhos dos arquivos de rotas.

* Manter coesão entre camadas (routes, services, repositories) e evitar duplicação de lógica entre SQL e validações da API.






