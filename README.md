# naonow-frontend

## Getting Started

Prepare/config a new environment variable .env file at the root of project, with the following contents:

```console
REACT_APP_FEEDBACK_URL=  
REACT_APP_SERVER_URL=
REACT_APP_STRIPE_KEY=  
REACT_APP_VIMEO_AUTH_TOKEN=  
```

## Development Principles

See [/docs/responsive-redesign-policy.md](docs/responsive-redesign-policy.md)

## Install packages

Download and install app dependencies.

```console
yarn
```

## Start Development

This is a cra (create-react-app) package.  
Please connect `REACT_APP_SERVER_URL` to your [backend API services](https://github.com/naonow-tutoring/naonow-frontend).  
To immediately start developing, use command `yarn start` to launch app in development mode, with HMR (Hot Module Replacement).

```console

yarn start

```

## Build Production Ready

Environment variables are typically set prior to building production.  
*Please note development mode pulls environment variables from the set .env file.  
Completed optimized production build output directory `/build`.

```console

yarn build

```
