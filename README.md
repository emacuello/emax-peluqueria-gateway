# Microservicios de Emax Peluqueria ✂️

Este proyecto es una extensión del turnero que realicé para el M2 del Bootcamp de Henry. Es mi primera aplicación que realizo siguiendo la arquitectura de microservicios. Pueden haber fallos y cosas que no sean correctas, pero esto recién es el comienzo. ¡Espero que sea de su agrado!

![Emax Peluqueria](https://res.cloudinary.com/dxrjz4ycj/image/upload/f_auto,q_auto/gl9wkwfgrhplhoyb8cl5)

## Descripción

El proyecto está completamente bajo el entorno de Node.js. Se usaron los frameworks de NestJs y Express.js. Emax Peluquería es una aplicación en la cual se puede reservar un turno en un negocio con infinita disponibilidad, siempre y cuando sea en el horario laboral que indica el negocio. También, en su página se pueden comprar artículos específicos del negocio. Todo esto es observable en un dashboard de usuario donde se encuentra tu historial de pagos, inclusive.

### Microservicios

1. **[API Gateway](https://github.com/emacuello/emax-peluqueria-gateway)**: Punto de entrada al backend, recibe las solicitudes del cliente y se encarga de repartir las tareas a los diferentes microservicios. A su vez, cuando se trata del pago, de usuarios de Google, y para la subida de imágenes de perfil de usuario, es este servidor el encargado de hacerlo.
2. **[Microservicio de Auth, Users y Appointments](https://github.com/emacuello/emaxpeluqueria)**: Se encarga de registrar a los nuevos usuarios en la base de datos encriptando sus contraseñas con Bcrypt, verificar sus credenciales y emitir sus respectivos JWT, crear, modificar y eliminar turnos para los usuarios.
3. **[Microservicio de Products](https://github.com/emacuello/shop-emaxpeluqueria)**: El microservicio de productos es el encargado de crear, eliminar y modificar los productos para el Ecommerce de la aplicación.
4. **[Microservicio de Emails](https://github.com/emacuello/mailms)**: El microservicio de correos electrónicos es el encargado de enviar emails cuando un usuario se registra, crea un turno, cancela un turno y realiza una compra exitosa.
5. **[Microservicio de AccessTokens](https://github.com/emacuello/apioauthtoken)**: Este microservicio se encarga de la creación del AccessToken necesario para que el microservicio de correos electrónicos funcione correctamente.

## Diagrama

![Diagrama de microservicios](https://res.cloudinary.com/dxrjz4ycj/image/upload/f_auto,q_auto/ypf5twyrewahtu3frvbf)

# API GATEWAY

## Config de Api Gateway

Para probar el Api Gateway es necesario crear un `.env` en la raíz del proyecto que tengan estos valores:

- HOST_REDIS = host
- PORT_REDIS = 1234
- PASSWORD_REDIS = 1234abc
- USER_URL = www.google.com //Microservicio de usuarios
- PRODUCTS_URL = www.google.com
- PORT = 1234
- CLOUDINARY_CLOUD_NAME = abc
- CLOUDINARY_API_SECRET = abc123
- CLOUDINARY_API_KEY = 1234
- STRIPE_SECRET = abc123
- INTERNAL_API_SUCESS = www.google.com
- INTERNAL_API_CANCEL = www.google.com
- API_DOLAR = https://dolarapi.com/v1/dolares/tarjeta //Esta es la api que yo use para el tipo de cambio de mi pais, pero puedes usar la que quieras
- CANCEL_URL = www.google.com
- SUCESS_URL = www.google.com
- GOOGLE_CLIENT_ID = 123abc
- GOOGLE_CLIENT_SECRET = abc123
- CALLBACK_URL = www.google.com
- GOOGLE_REDIRECT_FRONT = www.google.com
- LOGIN_URL = www.google.com
- HEADERS_TOKEN = 123abc //Un token especial para que el uno de los MS pueda procesar solo las peticiones del ApiGateway
- SESSION_SECRET = 123abc
- SECRET_KEY = 123abc
- DATABASE_URL = www.database.com

## Descripción

**[Documentación Swagger](https://api-emax-peluqueria.vercel.app/api)**

El Api Gateway está construido en NestJS y Typescript, se comunica directamente con 3 de los 4 microservicios, lo hace mediante peticiones HTTP y publicando eventos en Redis, además, también cuenta con un modulo de Payment que es el encargado de procesar los pagos del Ecommerce, además de comunicarse con los distintos microservicios y almacenar la información de los pagos, también se encarga del procesamiento de la autenticación con Google y de emitir los tokens para estos usuarios. El proceso de pago se realiza mediante Stripe. Al ser el punto de comunicación con el frontend, se encarga de todas las validaciones de los datos entrantes con ClassValidator y ClassTransformer, también tiene implementado rate limit en algunas rutas para evitar el abuso en las peticiones no deseadas, además se encarga de subir las imagenes de perfil de los usuario usando Cloudinary sus datos son alojados en una base de datos PostgreSQL en conjunto con TypeORM. El Api Gateway se encuentra alojado en Vercel y su base de datos se aloja en Supabase.

## Instalación

```bash
$ npm install
```

## Correr la aplicación

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Contáctame

- Autor - [Victor Emanuel Cuello](https://github.com/emacuello)
- Portafolio - [https://emacuello-portafolio.vercel.app/](https://emacuello-portafolio.vercel.app/)
- Linkedin - [in/vcuellojrs](https://www.linkedin.com/in/vcuellojrs/)
