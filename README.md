# @suin/google-could-functions-sendgrid-inbound-parse

This package is a backend for [SendGrid Inbound Parse]. It runs on Google Cloud Platform Functions.

[sendgrid inbound parse]: https://sendgrid.com/docs/for-developers/parsing-email/setting-up-the-inbound-parse-webhook/

## Architecture

![](https://i.imgur.com/vw4CpGm.jpg)

1. The GCP function `publishEmailDataOnSendgridInboundParse` is invoked by SendGrid Inbound Parse.
2. It parses the form data that was posted by SendGrid.
3. It transforms the form data into the [EmailData](https://github.com/suin/email-data) object.
4. It publishes the `EmailData` to GCP Pub/Sub topic `allEmail`.

## Setting Up

### Setting Up The Inbound Parse Webhook

Before using this package, please read [the SendGrid's official document](https://sendgrid.com/docs/for-developers/parsing-email/setting-up-the-inbound-parse-webhook/) to set up the SendGrid Inbound Parse.

### Deploying The Stacks To Your GCP

The [deploy.sh](./deploy.sh) a script that deploys this package to your Google Cloud Platform. The script performs these two operations:

1. Create a new Pub/Sub topic to publish the email data which is posted by the SendGrid Inbound Parse Webhook.
2. Deploy a new function. This function processes the form data which is posted by the SendGrid Inbound Parse Webhook, transforms the form data into an event payload, and publishes the event to the topic which was created by the operation above.

By default, the topic name is `allEmail`. If you would like to change it, please edit the `deploy.sh`.

To deploy these stacks, please run the following command:

```bash
./deploy.sh
```

### Configuring The SendGrid Inbound Parse

Once the deployment success, go back to the SendGrid console and add the inbound parse webhook URL.

![](https://i.imgur.com/UMQC40t.png)

As this function expects raw email data, you have to enable the raw option in the SendGrid console:

## Test Drive

After you have finished the setting up above, confirm the system works well.

At first, to make it possible to receive and read the messages that the function publishes, create a new subscription on the topic:

```bash
gcloud pubsub subscriptions create --topic allEmail testDrive
# If you have customized the topic name, please change the `allEmail` above.
```

At next, send a test email to the email address which the SendGrid Inbound Parse receives.

Then receive the message using the `testDrive` subscription:

```bash
gcloud pubsub subscriptions pull testDrive \
    --format="flattened(ackId,message.messageId,message.publishTime,message.attributes,message.data.decode(base64).encode(utf-8))" \
    --limit=10 \
    --auto-ack
```

If the system works without any problems, you will see some messages.

Finally, delete the `testDrive` subscription:

```bash
gcloud pubsub subscriptions delete testDrive
```
