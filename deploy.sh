#!/usr/bin/env bash
set -eux

declare TOPIC='allEmail'

# Create the topic if not exists
gcloud pubsub topics describe ${TOPIC} > /dev/null || {
    gcloud pubsub topics create ${TOPIC}
}

# Deploy the function
gcloud functions deploy publishEmailDataOnSendgridInboundParse \
    --runtime nodejs12 \
    --trigger-http \
    --set-env-vars TOPIC=${TOPIC}
