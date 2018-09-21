#!/bin/bash

# ----------------------
# Docker Build &  Deployment Script
# ----------------------

DOCKER_IMAGE=""
DOCKER_NAME=""
DOCKER_TAG=""
DOCKER_REPOSITORY="serviceo.azurecr.io"

# Helpers
# -------

exitWithMessageOnError () {
  if [ ! $? -eq 0 ]; then
    echo "ERROR! An error has occurred during docker build & deployment."
    echo $1
    exit 1
  fi
}

message () {
    echo ">>> ${1}"
}

errorMessage () {
    echo "ERROR! ${1}"
}

# Prerequisites
# -------------

# Check if the docker directory exists
if [[ ! -d "deployment/${1}" ]]; then
    errorMessage "Docker configuration directory doesn't exist"
    exit 1
else
    DOCKER_IMAGE=${1}
fi

# Check if docker configuration file exists
if [[ ! -f "deployment/${1}/Dockerfile" ]]; then
    errorMessage "Docker configuration file doesn't exist"
    exit 1
fi

# Build process
# -------------

if [[ -n ${2} ]]; then
    DOCKER_NAME=${2}
    message "Docker image name set to '${DOCKER_NAME}'"
else
    errorMessage "Provide docker image name as second argument"
    exit 1
fi

if [[ -n ${3} ]]; then
    DOCKER_TAG=${3}
    message "Docker image tag set to '${DOCKER_TAG}'"
else
    errorMessage "Provide docker image tag as fourth argument"
    exit 1
fi

# Create build directory if it doesn't exist
if [[ ! -d "deployment/${DOCKER_IMAGE}/src" ]]; then
    mkdir deployment/${DOCKER_IMAGE}/src
else
  rm -rf deployment/${DOCKER_IMAGE}/src/*
fi

# Copy the application structure to build directory
message "Copying application to build directory..."
cp -r client deployment/${DOCKER_IMAGE}/src
cp -r email_templates deployment/${DOCKER_IMAGE}/src
cp -r build deployment/${DOCKER_IMAGE}/src
cp -r common deployment/${DOCKER_IMAGE}/src
cp -r server deployment/${DOCKER_IMAGE}/src
cp app.js deployment/${DOCKER_IMAGE}/src
cp package.json deployment/${DOCKER_IMAGE}/src

message "Building docker image..."
cd deployment/${DOCKER_IMAGE}
docker build -t ${DOCKER_NAME} .
exitWithMessageOnError "Failed to build docker image"

message "Tagging docker image..."
docker tag ${DOCKER_NAME} ${DOCKER_REPOSITORY}/${DOCKER_NAME}:${DOCKER_TAG}

message "Uploading docker image..."
docker push ${DOCKER_REPOSITORY}/${DOCKER_NAME}:${DOCKER_TAG}

rm -rf deployment/${DOCKER_IMAGE}/src

echo "Finished successfully."
