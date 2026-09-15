FROM quay.io/minio/mc:RELEASE.2024-11-21T17-21-54Z AS mc-stage
FROM quay.io/minio/minio:RELEASE.2024-11-07T00-52-20Z

COPY --from=mc-stage /usr/bin/mc /usr/bin/mc
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
CMD ["server", "/data", "--console-address", ":9001"]