# electron-headless

    docker build -t electron .
    docker run -td -p 3456:3456  -v ./src:/data -v ./assets:/home/electron/.config/electron-headless --name electron electron
    docker restart electron
    
     