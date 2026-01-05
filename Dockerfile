FROM cicybot/xvfb-electron:1.0.1

# Expose Express port
EXPOSE 3000

COPY --chmod=755 ./entry.sh /entry.sh

ENTRYPOINT ["/entry.sh"]
