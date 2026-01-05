# electron-headless

    cd electron 
    nom install
    npm install -g electron

    docker build -t electron .

    docker rm -f electron

    docker run --name electron -it -p 3456:3456 -v ./electron:/data -v ./assets:/home/electron/.config/electron-headless electron bash

    docker rm -f electron
    docker run --name electron -p 3456:3456 -v ./electron:/data -v ./assets:/home/electron/.config/electron-headless electron

    docker restart electron
    
