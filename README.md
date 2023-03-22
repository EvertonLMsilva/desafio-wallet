# Desafio técnico
Desafio gerado em NestJS. 
#### Ferramentas usados
Docker, Redis, Sql, Mysql.

#### Conclusões
- Foi usado uma arquitetura em camadas para alguns casos.
- As transações estão em filas, pois alem de garantir entrega, foi pensado em evitar duplicidades e na esperiencia do usuário.
- Usei o Orm Squelize para facilitar o desenvolvimento, mas como melhoria usar um adaptador seria uma boa ideia.
- Não tive tempo para os testes unitários, mas seria interessanteter um coverage alto.
- O projeto esta em docker e para facilitar a configuração, configurei o docker-composer para levanter todos container.

## Instalação

#### Docker
Instale em sua máquina o [Docker](https://desktop.docker.com/win/main/amd64/Docker%20Desktop%20Installer.exe?utm_source=docker&utm_medium=webreferral&utm_campaign=dd-smartbutton&utm_location=module) e em seguida rode este comando.
```bash
$ docker compose up
```
Para levantar os container do docker exeto a aplicação, sendo assim, você poderá desenvolver e ver em tempo real suas atualizações.
```bash
$ docker compose up db redis
```
após instale o [nodejs](https://nodejs.org/dist/v18.15.0/node-v18.15.0-x64.msi).
Certifique que tenha o arquivo ```.env``` e ```.env.dev``` na raiz do projeto

- No arquivo .env.example, você precisa apenas adicionar um login e senha para as variaveis ```DATABASE_USER```, ```DATABASE_PASSWORD``` e criar uma copia para ```.env``` para os containers e ```.env.dev``` para rodar local.


```bash
$ npm install
$ npm run start:dev
```

#### Migrations e seeds

Após configurar o docker com seus containers, você precisa acessar o MySql e rodar as migrations e seeds.

Para agilizar use o [MySQL Workbench](https://dev.mysql.com/downloads/workbench/), assim poderá configurar a conexão e testar, apos podera user sql para criar as tabelas e seeds.

- Path das migration
```./docks/migrations```

--img--