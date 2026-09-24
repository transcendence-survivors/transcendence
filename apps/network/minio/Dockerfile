FROM alpine:3.22 AS mc

RUN apk add --no-cache wget \
    && wget -O /mc \
       https://dl.min.io/aistor/mc/release/linux-amd64/mc \
    && chmod +x /mc

FROM pgsty/minio:latest


COPY --from=mc /mc /usr/bin/mc

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]

CMD ["server", "/data", "--console-address", ":9001"]