# electron-headless


    docker build -t my-electron .

    docker run --network=host -p 3000:3000  -v ./src:/data my-electron
    docker run -d --network=host -p 3000:3000  -v ./src:/data my-electron
    docker run --network=host -p 3000:3000  -v ./src:/data my-electron -v
    docker run -it --network=host -p 3000:3000  -v ./src:/data my-electron bash