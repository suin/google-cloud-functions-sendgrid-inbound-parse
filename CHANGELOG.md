# [2.0.0](https://github.com/suin/google-cloud-functions-sendgrid-inbound-parse/compare/v1.0.0...v2.0.0) (2020-07-24)


### Code Refactoring

* 💡 use @suin/event-data for Pub/Sub publishment ([8adb300](https://github.com/suin/google-cloud-functions-sendgrid-inbound-parse/commit/8adb3001970c89092bf2937c4ba613db9a475cb6))


### BREAKING CHANGES

* 🧨 The event payload is no longer compatible. The `email` property was
deleted and the `data` property was added.

# 1.0.0 (2020-07-23)


### Features

* 🎸 implement it! ([a15031d](https://github.com/suin/google-cloud-functions-sendgrid-inbound-parse/commit/a15031d41efaca56f1cad7a6f5565496a92f7d40))
