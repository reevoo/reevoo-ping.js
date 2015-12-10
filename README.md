# Reevoo Ping: JavaScript Client

`reevoo-ping.js` is a JavaScript client that allows events to be sent to Reevoo. This is fed into our Analytics tools for analysis.

## Client Usage

<!-- Ping! I choose you! -->
<script type="text/javascript" src="reevoo-ping.js"></script>
<script type="text/javascript">
  // When you want to use it...
  reevooPing.trackPageView();
</script>

The tracking events you can use are all defined in [lib/reevoo-ping.js](lib/reevoo-ping.js).

## Development

Get the right version of Node using [NVM](https://github.com/creationix/nvm), then install the dependencies:

```sh
nvm install
nvm exec npm install
```

You should be ready to go! Check by running the tests:

```sh
nvm exec npm test
```

Run this to **ENTER DEV MODE:**
```sh
nvm exec npm run watch
```

In Dev Mode:
- A server will be started to the demo server at [http://localhost:8080](http://localhost:8080). This will live reload on `lib` changes.
- The specs will be run on every `lib` or `spec` change.
- Webpack will bundle on every `lib` change.

For more information on the tasks you can do, check out [package.json](package.json).

## Deployment

TODO: Write deployment instructions!
