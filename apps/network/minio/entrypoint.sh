#!/bin/sh
set -eu

minio "$@" &
MINIO_PID=$!

export MC_HOST_local="http://${MINIO_ROOT_USER}:${MINIO_ROOT_PASSWORD}@localhost:9000"

i=0
until mc ls local >/dev/null 2>&1; do
	i=$((i + 1))
	if [ "$i" -ge 30 ]; then
		echo "Erreur: MinIO n'a pas démarré après 30s" >&2
		exit 1
	fi
	sleep 1
done

BUCKETS="${MINIO_BUCKET_AVATARS:-avatars} ${MINIO_BUCKET_POST:-post} ${MINIO_BUCKET_CHAT:-chat}"

for bucket in $BUCKETS; do
	mc mb --ignore-existing "local/$bucket"
	mc anonymous set download "local/$bucket"
done

kill "$MINIO_PID"
wait "$MINIO_PID" 2>/dev/null || true

exec minio "$@"
