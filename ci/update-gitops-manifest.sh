#!/usr/bin/env bash
set -euo pipefail

if [ "$#" -lt 7 ]; then
  echo "Usage: $0 <repo_dir> <manifest_path> <dockerhub_namespace> <image_tag> <expenses_image> <analytics_image> <frontend_image>" >&2
  exit 1
fi

REPO_DIR="$1"
MANIFEST_PATH="$2"
DOCKERHUB_NAMESPACE="$3"
IMAGE_TAG="$4"
EXPENSES_IMAGE="$5"
ANALYTICS_IMAGE="$6"
FRONTEND_IMAGE="$7"

FILE_PATH="${REPO_DIR}/${MANIFEST_PATH}"

if [ ! -f "${FILE_PATH}" ]; then
  echo "GitOps manifest not found: ${FILE_PATH}" >&2
  exit 1
fi

update_image_block() {
  local image_name="$1"
  local full_image="docker.io/${DOCKERHUB_NAMESPACE}/${image_name}"

  sed -E -i "/name:[[:space:]]*${image_name}[[:space:]]*$/{
    n
    s#^[[:space:]]*newName:[[:space:]]*.*#    newName: ${full_image}#
    n
    s#^[[:space:]]*newTag:[[:space:]]*.*#    newTag: \"${IMAGE_TAG}\"#
  }" "${FILE_PATH}"
}

update_image_block "${EXPENSES_IMAGE}"
update_image_block "${ANALYTICS_IMAGE}"
update_image_block "${FRONTEND_IMAGE}"

echo "GitOps manifest updated: ${FILE_PATH}"
