FROM cicybot/xvfb-electron:1.0.1
# v 1.0,1
# Expose Express port
EXPOSE 3456

COPY --chmod=755 ./entry.sh /entry.sh

COPY ./electron/package.json /data/package.json
RUN npm install -d

COPY ./electron/main.js /data/main.js
COPY ./electron/cron.js /data/cron.js
COPY ./electron/run.sh /data/run.sh

ENTRYPOINT ["/entry.sh"]
