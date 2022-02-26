// @ts-check

'use strict'

// A pattern to match: <x:markId?trueString|falseString>
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
     * The original map to perform mark substitutions on.
     *
     * @type {string}
     */
    this.original = originalMap

    /**
     * The mark ID to match mark tags against.
     * In MUD maps, this is usually a Room VNUM/Id.
     * If false or null, all falseStrings (no marks) will be rendered.
     * If true, all trueStrings will be rendered (useful for map building).
     *
     * @type {?boolean|number|string}
     */
    this.markId = null

    /**
     * The replace function, bound to this instance so it has access to the matching mark ID.
     *
     * @type {function}
     */
    this.replaceFn = replaceTags.bind(this)
  }

  /**
   * Returns a rendered string of the map, with the marker tags properly replaced.
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
 * so they can access the markId to match against.
 *
 * @param {string} _match - Matched string. Unused but required by String#replace.
 * @param {string} markId - The mark ID set in the tag.
 * @param {string} trueString - The string to render if the mark ID in the tag matches the mark ID in the parser.
 * @param {string} falseString - The string to render if the mark ID in the tag does not match the mark ID in the parser.
 *
 * @this {MapMarker}
 * @returns {string}
 */
function replaceTags (_match, markId, trueString = null, falseString = null) {
  var matched
  var markIdToMatch = this.markId

  if (markIdToMatch === true) {
    matched = true // Show all marks
  } else if (markIdToMatch === false || markIdToMatch == null) {
    matched = false // Show no marks
  } else {
    matched = ('' + markIdToMatch) === markId
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
