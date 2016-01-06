# ReevooPing: JavaScript Client

`reevoo-ping.js` is a JavaScript client that allows events to be sent to Reevoo. This is fed into our Analytics tools for analysis.

[**The User Guide**](docs/user_guide.md) details how to set up ReevooPing with custom implementations.

## Development

Grab [NVM](https://github.com/creationix/nvm) and go:

```sh
nvm install
nvm exec npm install
```

You should be ready to go! Check by running the tests:

```sh
nvm exec npm test
```

### :zap: :zap: DEV MODE :zap: :zap:

Run this to :zap: :zap: **ENTER DEV MODE:** :zap: :zap: 
```sh
nvm exec npm run watch
```

In Dev Mode:

- A server will be started to the demo server at [http://localhost:8080](http://localhost:8080). This will live reload on `lib` changes.
- The specs will be run on every `lib` or `spec` change.
- Webpack will bundle on every `lib` change.

For more information on the tasks you can do, check out [package.json](package.json).

#### Troubleshooting
Sometimes when running Dev Mode, you can encounter:

```
> webpack -d --watch
events.js:141
throw er; // Unhandled 'error' event
      ^

Error: listen EADDRINUSE 127.0.0.1:8080
...
```

The test server isn't very good at shutting itself down correctly. Use `killall node` to get rid of any stray Node.JS instances and restart Dev Mode.

### Creating New Events

1. Tell Snowplow about the event. To do this, add your event to the [Reevoo Event Dictionary](https://github.com/snowplow-proservices/reevoo-event-dictionary). (Instructions are in the README there.)
2. Add the event and specs to this repository.
3. [Update the version number](https://github.com/reevoo/reevoo-ping.js/blob/master/package.json) in accordance with [Semantic Versioning](http://semver.org/). (Hint: A new event is likely to be a *minor* version bump.) [Tag the commit.](https://github.com/reevoo/reevoo-ping.js/releases)

## Building 

Ready to go? Then build for production!

```sh
nvm exec npm run build:prod
```

This will build a production-ready file and place it in the `dist` folder. (Do not commit this!)

## Deployment

TODO: Write deployment instructions!
