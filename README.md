# Radio Browser

Este projeto é um desafio de front-end para avaliar habilidades em estruturação e autonomia na construção de aplicações escaláveis utilizando as tecnologias propostas. O Radio Browser foi desenvolvido para resgatar a experiência nostálgica das rádios tradicionais, permitindo que os usuários desfrutem e relembram os tempos antigos.

## Case

Com o passar dos anos, muitas pessoas sentem falta da experiência única de ouvir rádio. Pensando nisso, o desafio consistiu em criar uma aplicação que consumisse uma API de rádios, proporcionando uma interface para que os usuários possam:

- **Pesquisar rádios**
- **Adicionar rádios aos favoritos**
- **Editar informações das rádios favoritas**
- **Dar play e pause nas rádios**

Além disso, as rádios favoritas são salvas no _local storage_, garantindo a persistência dos dados.

## Funcionalidades

- **Pesquisa de Rádios:** Encontre rádios de acordo com seus critérios.
- **Favoritar:** Marque suas rádios preferidas para acesso rápido.
- **Edição:** Altere informações das rádios favoritas.
- **Player:** Controle a reprodução (play/pause) das rádios.

## Tecnologias Utilizadas

- **React Vite:** Estrutura base da aplicação.
- **TypeScript:** Tipagem estática para um código mais robusto.
- **Tailwind CSS:** Estilização rápida e customizável.
- **Ky:** Cliente HTTP para consumo de API.
- **Docker:** Ambiente containerizado (arquivo `docker-compose.yml` incluso no repositório).
- **Local Storage:** Armazenamento local para persistir os favoritos.

## Como Executar o Projeto

### Executando com Docker

O repositório já contém o arquivo `docker-compose.yml`. Para rodar o projeto via Docker, basta executar:

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/jeanpj12/frontend-radio-browser.git
   ```
2. **Navegue até a pasta do projeto:**
   ```bash
   cd frontend-radio-browser
   ```
3. **Inicie os containers com Docker Compose:**
   ```bash
   docker compose up -d
   ```
4. **Acesse a aplicação:**
   Abra seu navegador e acesse [http://localhost:8080](http://localhost:8080).

### Executando Localmente

Para rodar a aplicação sem Docker, siga os passos abaixo:

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/jeanpj12/frontend-radio-browser.git
   ```
2. **Instale as dependências:**
   ```bash
   cd frontend-radio-browser
   npm install
   ```
3. **Para desenvolvimento:**
   ```bash
   npm run dev
   ```
4. **Para produção:**
   ```bash
   npm run build
   ```
   Após o build, você pode fazer o deploy em serviços como a [Vercel](https://vercel.com/).

## Links Úteis

- **Projeto no Ar:** [Radio Browser](https://frontend-radio-browser-beta.vercel.app/)
- **Repositório GitHub:** [frontend-radio-browser](https://github.com/jeanpj12/frontend-radio-browser)
- **Challenge by Coodesh:** Este projeto foi desenvolvido como um challenge by Coodesh.

## Considerações Finais

Este projeto foi criado para demonstrar habilidades em front-end, com foco em uso eficiente de tecnologias modernas. Sinta-se à vontade para explorar o código, contribuir com melhorias ou simplesmente curtir essa viagem nostálgica pelo mundo das rádios!
