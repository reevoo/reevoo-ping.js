# Reevoo Ping: JavaScript Client

`reevoo-ping.js` is a JavaScript client that allows events to be sent to Reevoo. This is fed into our Analytics tools for analysis.

## Client Usage

<!-- Ping! I choose you! -->
<script type="text/javascript" src="reevoo-ping.js"></script>
<script type="text/javascript">
  // When you want to use it...
  reevooPing.page.viewed();
</script>

## Events

When an event occurs, you should call one of the reevooPing event functions.

### Page Events
Page events require no arguments.

- `reevooPing.page.viewed()` when you want to track a page being viewed.
- `reevooPing.page.heartbeat()` to send ping events at regular intervals.

### Badge Events
Badge events require an object as an argument with the following fields:

- `badge_name`, required. 
- `badge_type`, required.
- `trkref`, optional (defaults to the trkref used to initialise ReevooPing).

The events are:

- `reevooPing.badge.rendered(opts)` when a badge has been requested and displayed. Requires a `hit_type` field as part of `opts`, which must be one of the [VALID_HIT_TYPES](lib/events/badge.js).
- `reevooPing.badge.seen(opts)` when a badge enters the browser's viewport.

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
