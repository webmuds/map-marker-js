// @ts-check

'use strict'

// A pattern to match: <x:roomId?trueString|falseString>
const TAG_OPENER = '<x:'
const TAG_ENDER = '>'
const TRUE_STRING_SEPARATOR = '?'
const FALSE_STRING_SEPARATOR = '|'

const MARKER_TAG_REGEXP = new RegExp(`${TAG_OPENER}([0-9]+)(?:\\${TRUE_STRING_SEPARATOR}((?:\\${FALSE_STRING_SEPARATOR}\\${FALSE_STRING_SEPARATOR}|${TAG_ENDER}${TAG_ENDER}|[^${FALSE_STRING_SEPARATOR}${TAG_ENDER}\\n\\r])*)?(?:\\${FALSE_STRING_SEPARATOR})?((?:${TAG_ENDER}${TAG_ENDER}|[^${TAG_ENDER}\\n\\r])*)?)?${TAG_ENDER}`, 'gi')
const DOUBLE_FALSE_SEP_REGEXP = new RegExp(`[${FALSE_STRING_SEPARATOR}]{2}`, 'g')
const DOUBLE_TAG_ENDER_REGEXP = new RegExp(`[${TAG_ENDER}]{2}`, 'g')

export class MapMarker {
  /**
   * @param {string} originalMap
   */
  constructor (originalMap) {
    /**
     * The original map to perform marker substitutions on.
     *
     * @type {string}
     */
    this.original = originalMap

    /**
     * The Room ID to match markers against. Can be null (no markers rendered).
     * If -1, renders all markers. Useful to see all markers at once during map creation.
     *
     * @type {?number|string}
     */
    this.roomId = null

    /**
     * The replace function, bound to this instance so it has access to the matching room ID.
     *
     * @type {function}
     */
    this.replaceFn = replaceTags.bind(this)
  }

  /**
   * Returns a rendered string of the map, with the markers properly replaced.
   *
   * @returns {string}
   */
  render () {
    // @ts-ignore - the replaceTags function has a custom signature that TS chokes on
    return this.original.replace(MARKER_TAG_REGEXP, this.replaceFn)
  }
}

/**
 * The replacer function. Will be bound to MapMarker instances
 * so they can access the roomId to match against.
 *
 * @param {string} _match - Matched string. Unused but required by String#replace.
 * @param {string} roomId - The Room ID present in the tag.
 * @param {string} trueString - The string to render if the room in the tag matches the room ID in the parser.
 * @param {string} falseString - The string to render if the room in the tag does not match the room ID in the parser.
 *
 * @this {MapMarker}
 * @returns {string}
 */
function replaceTags (_match, roomId, trueString = null, falseString = null) {
  var matched
  var roomIdToMatch = this.roomId

  if (roomIdToMatch === -1) {
    matched = true // Show all markers
  } else if (roomIdToMatch == null) {
    matched = false // Show no markers
  } else {
    matched = ('' + roomIdToMatch) === roomId
  }

  if (matched) {
    if (trueString == null) {
      trueString = 'X'
    } else {
      trueString = trueString.replace(DOUBLE_FALSE_SEP_REGEXP, FALSE_STRING_SEPARATOR).replace(DOUBLE_TAG_ENDER_REGEXP, TAG_ENDER)
    }
    return trueString
  }

  if (falseString == null) {
    falseString = ' '
  } else {
    falseString = falseString.replace(DOUBLE_TAG_ENDER_REGEXP, TAG_ENDER)
  }

  return falseString
}
