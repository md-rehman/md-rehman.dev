#!/bin/bash

# 1. Check if the commit is on the main branch OR if it's an active Pull Request
if [[ "$VERCEL_GIT_COMMIT_REF" == "main" || -n "$VERCEL_GIT_PULL_REQUEST_ID" ]]; then
  
  echo "Commit is on main or an active PR. Checking for relevant changes..."
  
  # 2. Use turbo-ignore to automatically check if the current app or its dependencies have changed
  # turbo-ignore reads the monorepo graph and returns:
  # - exit code 1 if changes ARE found (Vercel builds)
  # - exit code 0 if NO changes are found (Vercel cancels)
  npx turbo-ignore
  
  # Forward the exact exit code from turbo-ignore to Vercel
  exit $?

else
  
  echo "Not on main branch and not an active PR. Skipping build."
  # 3. Not main, not a PR -> cancel the build
  exit 0

fi
