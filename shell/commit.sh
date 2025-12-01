#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
COMMIT_MESSAGE="${*:-}"

if [[ -z "${COMMIT_MESSAGE}" ]]; then
  echo "Commit message required" >&2
  exit 1
fi

INPUTS_DIR="${ROOT_DIR}/inputs"

if [[ ! -d "${INPUTS_DIR}" ]]; then
  echo "Inputs submodule not found at ${INPUTS_DIR}" >&2
  exit 1
fi

cd "${INPUTS_DIR}"

INPUTS_BRANCH="$(git rev-parse --abbrev-ref HEAD)"
if [[ "${INPUTS_BRANCH}" == "HEAD" ]]; then
  echo "Inputs submodule is in a detached HEAD state; please check out a branch before committing." >&2
  exit 1
fi

git add .
if git diff --cached --quiet; then
  echo "No changes to commit in inputs; skipping inputs commit and push."
else
  HUSKY=0 git commit -m "[inputs] ${COMMIT_MESSAGE}"
  HUSKY=0 git push
fi

cd "${ROOT_DIR}"

MAIN_BRANCH="$(git rev-parse --abbrev-ref HEAD)"
if [[ "${MAIN_BRANCH}" == "HEAD" ]]; then
  echo "Main repo is in a detached HEAD state; please check out a branch before committing." >&2
  exit 1
fi

git add .
if git diff --cached --quiet; then
  echo "No changes to commit in main repo; skipping main commit and push."
else
  HUSKY=0 git commit -m "${COMMIT_MESSAGE}"
  HUSKY=0 git push
fi
