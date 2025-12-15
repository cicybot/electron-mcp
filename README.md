# electron-headless

    docker run -it -v ./src:/data cicybot/xvfb-electron bash

    xvfb-run electron --no-sandbox --disable-gpu --disable-features=UseDBus --log-level=3 --version
    xvfb-run electron --no-sandbox --disable-gpu --disable-features=UseDBus --log-level=3 . 
