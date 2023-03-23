# Desafio técnico
Desafio gerado em NestJS. 
#### Ferramentas usados
Docker, Redis, Sql, Mysql.

#### Conclusões
- Foi usado uma arquitetura em camadas para alguns casos.
- As transações estão em filas, pois alem de garantir entrega, foi pensado em evitar duplicidades e na esperiencia do usuário.
- Usei o Orm Squelize para facilitar o desenvolvimento, mas como melhoria usar um adaptador seria uma boa ideia.
- Não tive tempo para os testes unitários, mas seria interessanteter um coverage alto.
- Como fiz o serviço apenas olhando em transações, algumas validações ficaram de fora, pois precisaria pensar em outro serviço fora do contexto.
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

<div align="center">
    <img src="https://user-images.githubusercontent.com/35983284/226993907-1432e37e-9e78-4fb1-9cf1-a947e059d1e8.png" width="200px" />
</div>

#### Fluxos
Segua abaixo o fluxo de filas e requests do projeto.

- ### Saldo

<div>
    <img src="https://user-images.githubusercontent.com/35983284/226993909-300fc903-bf80-4b97-a3e3-5f4ca496136e.jpg" height="150px" />
</div>

- ### Deposito

<div>
    <img src="https://user-images.githubusercontent.com/35983284/226993879-00c132ff-c0b4-44d6-a87b-d44908928834.jpg" height="150px" />
</div>
<div>
    <img src="https://user-images.githubusercontent.com/35983284/226993870-4b706fe3-f799-4a20-b594-8b2c029bb263.jpg" height="150px" />
</div>

- ### Cancelamento

<div>
    <img src="https://user-images.githubusercontent.com/35983284/226993887-ccd5a259-45e9-4d00-ad55-349e9052ad23.jpg" height="150px" />
</div>
<div>
    <img src="https://user-images.githubusercontent.com/35983284/226993881-5371523a-34ab-44d8-a2ae-5c3f11b41e55.jpg" height="150px" />
</div>

- ### Compras

<div>
    <img src="https://user-images.githubusercontent.com/35983284/226993893-3b6486e6-36d3-411e-b262-8e40fd69b9a4.jpg" height="150px" />
</div>
<div>
    <img src="https://user-images.githubusercontent.com/35983284/226993890-97f7815b-e8a3-4a38-b974-ce9680376ed9.jpg" height="150px" />
</div>

- ### Estorno

<div>
    <img src="https://user-images.githubusercontent.com/35983284/226993898-aadc484e-167d-4a8b-8af7-83330d36ed01.jpg" height="150px" />
</div>
<div>
    <img src="https://user-images.githubusercontent.com/35983284/226993895-03d4585f-4d6f-4402-b10e-30860c97acaf.jpg" height="150px" />
</div>

- ### Extrato

<div>
    <img src="https://user-images.githubusercontent.com/35983284/226993903-dba17e97-65bc-41b5-a472-230b8475c937.jpg" height="150px" />
</div>

- ### Saque

<div>
    <img src="https://user-images.githubusercontent.com/35983284/226993912-14b8aac0-f3fc-4fc7-8318-8339c602e2a1.jpg" height="150px" />
</div>
<div>
    <img src="https://user-images.githubusercontent.com/35983284/226993910-bb62feef-fb9a-4ec3-90ce-8def8e53efe9.jpg" height="150px" />
</div>
