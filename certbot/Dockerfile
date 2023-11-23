FROM certbot/certbot

ENTRYPOINT ["/bin/sh", "-c", "trap : TERM INT; (while true; do sleep 1000; done) & wait"]