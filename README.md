# MiniMail

A mail client, just for me.

## Features

- viewing mail folders
- viewing mails

## Local Setup

For convenience, a docker-compose file is provided to run greenmail (mock mail server) and roundcube (an actually good email client):

- `Start Dependencies`
- Open http://localhost:3001/ in your browser to see roundcube

To start the actual application:

- `Start Dev`
- Open http://localhost:3000/ in your browser to see the app

## Config

<!-- TODO document config -->

`npx web-push generate-vapid-keys`

```js
const config = {
  runtimeConfig: {
    webPushPrivateKey: "",
    public: {
      clerkPubKey: "",
      jazzApiKey: "",
      jazzServerUrl: "wss://cloud.jazz.tools",
      onesignalAppId: "",
      webPushPublicKey: "",
    },
  },
};
```

### Recommended IDE settings

- for better viewing its recommended to configure file nesting for .types.ts into .ts

## Licence

MIT License
