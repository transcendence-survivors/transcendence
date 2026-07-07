FROM minio/minio:RELEASE.2025-09-07T16-13-09Z

COPY --from=minio/mc:RELEASE.2025-08-13T08-35-41Z-cpuv1 /usr/bin/mc /usr/bin/mc
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
CMD ["server", "/data", "--console-address", ":9001"]
