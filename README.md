# Passenger api enviroment

Project is based on these technologies:

- ForrestJS - https://forrestjs.github.io/
- Docker - https://hub.docker.com/
- Javascript/Node.js
- PostgresSQL

Additional stack for terminal: 
- HumbleCli - https://github.com/marcopeg/humble-cli
- Make - ["Install with `homebrew`"]
- Yarn - ["Install with `homebrew`"]


## Run app in DEV

Run postgres:

    make dev-pg
    
Run mongo:
    
    make dev-mongo
    
Run webapp:

    make dev-webapp

Run workers:

    make dev-workers

## Requirements

Create your enviroment variables in `.env.local` files. They are needed to run the project.

You will find examples in `*.env` files