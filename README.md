# Generador de parejas

Este proyecto lo utilizamos en las clases masivas para generar parejas de forma aleatoria en las sesiones y que los estudiantes hagan pair programming.

# Requisitos

Para este proyecto necesitas tener instalado lo siguiente:

* Node.js
* MongoDB (o puedes crear una cuenta en MongoLab)
* Redis

## Configuración

Para configurar este proyecto de forma local sigue estas instrucciones:

1. Clona el proyecto de Git:
    ````
    $ git clone
    ````
2. Instala las dependencias con NPM:
    ````
    $ npm install
    ````
3. Crea una aplicación de OAuth en Github y crea un archivo `.env` con las credenciales:
    ````
    OAUTH_CLIENT_ID=...
    OAUTH_CLIENT_SECRET=...
    ````
4. Ejecuta el proyecto con el siguiente comando:
    ````
    $ npm run dev:start
    ````

Para ver la aplicación en acción lo primero que debes crear es la sesión en [MongoDB](https://www.mongodb.com/):

```
$ mongo
> use pairing
> db.sessions.create({ name: "Prueba", open: true })
```

**Nota:** Asegúrate que siempre haya máximo una sesión abierta (`open` en `true`).

Ahora entra a la sesión desde el navegador (`http://localhost:3000/`) con dos usuarios de Github diferentes (cada uno en una ventana diferente). Acá deberás autenticarte con Github.

Ejecuta el script que genera las parejas con el siguiente comando:

```
$ node scripts/pairing.js
```

Para detener el script ejecuta `Ctr+C` o elimina la llave en Redis:

```
$ redis-cli
> DEL pairing:running
```

Para ejecutar las pruebas automatizadas utiliza este comando:

```
$ npm test
```

Las pruebas del sistema se ejecutan con un comando a parte porque son lentas:

```
$ npm run test:system
```

# Tecnologías

Este proyecto está construído con las siguientes tecnologías:

* [Node.js](https://nodejs.org/en/) para el backend.
* [Express](https://expressjs.com/) es una librería de [Node.js](https://nodejs.org/en/) para crear el API.
* [Socket.io](https://socket.io/) es una librería para Web Sockets (tiempo real).
* [MongoDB](https://www.mongodb.com/) es la base de datos principal.
* [Redis](https://redis.io/) es una base de datos no estructurada que utilizamos para [Socket.io](https://socket.io/) y controlar el script que crea las parejas.
* [React](https://reactjs.org/) es un framework para el front-end.
* [JWT (JSON Web Tokens)](https://jwt.io/) para almacenar información del usuario en el front.
* [Webpack](https://webpack.js.org/) para generar los archivos JS y CSS finales.
* [Jest](https://jestjs.io/) para las pruebas automatizadas.
* [Enzyme](https://airbnb.io/enzyme/) para las pruebas de los componentes de React.
* [Puppeteer](https://pptr.dev/) para las pruebas de sistema.
