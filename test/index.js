// @ts-check

'use strict'

import { expect } from '@dimensionalpocket/development'
import MapMarker from '../index.js'
import { MapMarker as MapMarkerFromSrc } from '../src/MapMarker.js'

describe('main require', function () {
  it('loads MapMarker from /src', function () {
    expect(MapMarker).to.equal(MapMarkerFromSrc)
  })
})
