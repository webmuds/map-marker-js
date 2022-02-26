# @webmuds/map-marker

[![build](https://github.com/webmuds/map-marker-js/actions/workflows/node.js.yml/badge.svg)](https://github.com/webmuds/map-marker-js/actions/workflows/node.js.yml) [![Total alerts](https://img.shields.io/lgtm/alerts/g/webmuds/map-marker-js.svg)](https://lgtm.com/projects/g/webmuds/map-marker-js/alerts/) [![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/webmuds/map-marker-js.svg)](https://lgtm.com/projects/g/webmuds/map-marker-js/context:javascript)

Marker tag support for ASCII maps.

## Usage

```js
// Suppose you have a map of 3 rooms and want to place a X
// depending on the room the character's in
// Raw map: [ ]-[ ]-[ ]
var map = '[<x:1>]-[<x:2>]-[<x:3>]'

var marker = new MapMarker(map)

// No current room set
marker.render() // <== [ ]-[ ]-[ ]

marker.markId = 1
marker.render() // <== [X]-[ ]-[ ]

marker.markId = 2
marker.render() // <== [ ]-[X]-[ ]

marker.markId = 3
marker.render() // <== [ ]-[ ]-[X]
```

## Tag Format

The tag format follows the following signature:

```
<x:markId[?trueString[|falseString]]>
```

Where:

* `markId` is a number or string to match against the marker's markId. Can also be a boolean (see Special Values section).
* `trueString` (optional) is the string to render when the position matches. Default is `X`.
* `falseString` (optional) is the string to render when the position does not match. Default is a space.

Examples:

* `<x:123>` - will render an `X` at that position if the marker's `markId` equals `123`, otherwise renders an empty space.
* `<x:123?You are here>` - same as above, but renders `You are here` at the position.
* `<x:123?Yes|No>` - renders `Yes` if position matches, and `No` otherwise.

### Special Characters

`>` and `|` are special characters that are part of the tag structure. 

If you want to render `>` in either `trueString` or `falseString`, or `|` in `trueString` only `[1]`, double them up.

Examples:

* `<x:123?>>>` - will render a single `>` if position matches.
* `<x:123?||>` - will render a single `|` if position matches.
* `<x:123?|||>>>` - will render a single `|` if position matches, and a single `>` if position does not match.

`[1]` Note: `|` in `falseString` does not need to be doubled up.

## Special Values for `markId`

`markId` has two special values:

* `null` - use this value to render only `falseString` values.
  * This is the equivalent of rendering a map without marks.
```js
marker.markId = null
marker.render() // <== [ ]-[ ]-[ ]
```

* `-1` - use this value to render `trueString` values at all positions.
  * This is the equivalent of rendering a map with all marks visible, useful during map building.
```js
marker.markId = -1
marker.render() // <== [X]-[X]-[X]
```

## License

MIT
