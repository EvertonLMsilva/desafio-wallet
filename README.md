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

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running docker-compose
docker compose up --force-recreate

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
