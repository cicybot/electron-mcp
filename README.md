# electron-headless

    docker build -t electron .

    docker rm -f electron

    docker run --name electron  -t -p 3456:3456  -v ./assets:/home/electron/.config/electron-headless electron /data 
    
    docker run -it electron bash

    docker restart electron
    
