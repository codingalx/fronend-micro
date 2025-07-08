#!/bin/bash

# Define the new tag (e.g., "latest" or any other tag)
new_tag="latest"

# Get the list of images from the docker-compose.yml
images=$(docker-compose config | grep image: | awk '{print $2}')

# Tag each image
for image in $images; do
    # Tag the image
    docker tag "$image" "${image%:*}:$new_tag"
    echo "Tagged $image as ${image%:*}:$new_tag"
done