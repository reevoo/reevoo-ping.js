# ReevooPing

<!---
This document is intended to be client-friendly.

It is aimed at a technical implementor with knowledge of JavaScript,
but not necessarily aware of Reevoo's suite of products.
-->

`reevoo-ping.js` is a JavaScript client that allows events to be sent to Reevoo. This is fed into our Analytics tools for analysis.

## Using ReevooPing with ReevooMark

ReevooMark bundles ReevooPing by default and takes care of a number of events around badges and review display. No special configuration is needed.

## Using ReevooPing on Pages

ReevooPing works on its own: this is handy for custom Reevoo implementations.

To get started, add the following to any page you want to use ReevooPing on:

```html
<!-- Ping! I choose you! -->
<script type="text/javascript" src="reevoo-ping.js"></script>
<script type="text/javascript">
  // Set it up (once per page)...
  reevooPing = new ReevooPing.Client({
    trkref: 'REV',
  });

  // Ready to receive events, for example...
  reevooPing.page.viewed();
</script>
```

## Integrating ReevooPing into other JavaScript

ReevooPing is available as an NPM package:

```bash
npm install --save reevoo-ping.js
```

You can use it as an ES6 module once installed:

```js
import ReevooPing from 'reevoo-ping.js';

// Set it up (once per library)...
const reevooPing = new ReevooPing.Client({
  trkref: 'REV',
});

// Ready to receive events, for example...
reevooPing.page.viewed();
```

## Events

Except when used with ReevooMark, **ReevooPing does not detect events** - it is up to you, the implementor, to decide when to fire events.

When an event occurs, you should call one of the ReevooPing event functions:

### Page Events
Page events require no arguments.

- `reevooPing.page.viewed()` when you want to track a page being viewed.
- `reevooPing.page.heartbeat()` to continuously send ping events at regular intervals.

### Badge Events
Badge events require an object as an argument with the following fields:

- `badge_name`, required. 
- `badge_type`, required.
- `trkref`, optional (defaults to the trkref used to initialise ReevooPing).

The events are:

- `reevooPing.badge.rendered(opts)` when a badge has been requested and displayed. Requires a `hit_type` field as part of `opts`, which must be one of the [VALID_HIT_TYPES](../lib/events/badge.js).
- `reevooPing.badge.seen(opts)` when a badge enters the browser's viewport.

## Troubleshooting

- ReevooPing sends events to https://skynet.reevoo.com; make sure your page's security policy allows this.
