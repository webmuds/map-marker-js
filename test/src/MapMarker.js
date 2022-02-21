// @ts-check

'use strict'

import { expect } from '@dimensionalpocket/development'
import { MapMarker } from '../../src/MapMarker.js'

describe('MapMarker', function () {
  context('when custom strings are not present', function () {
    before(function () {
      this.parser = new MapMarker('[<x:1>]-[<x:2>]-[<x:3>]')
    })

    context('when room ID matches a marker', function () {
      it('renders the marker in the correct position', function () {
        this.parser.roomId = 1
        expect(this.parser.render()).to.eq('[X]-[ ]-[ ]')
        this.parser.roomId = 2
        expect(this.parser.render()).to.eq('[ ]-[X]-[ ]')
        this.parser.roomId = 3
        expect(this.parser.render()).to.eq('[ ]-[ ]-[X]')
      })
    })

    context('when room ID is -1', function () {
      it('shows all markers at once', function () {
        this.parser.roomId = -1
        expect(this.parser.render()).to.eq('[X]-[X]-[X]')
      })
    })

    context('when room ID is null', function () {
      it('shows no markers', function () {
        this.parser.roomId = null
        expect(this.parser.render()).to.eq('[ ]-[ ]-[ ]')
      })
    })
  })

  context('when string for matching is present', function () {
    before(function () {
      this.parser = new MapMarker('[<x:1?You>]-[<x:2?Are>]-[<x:3?Here>]')
    })

    context('when room ID matches a marker', function () {
      it('renders the marker in the correct position', function () {
        this.parser.roomId = 1
        expect(this.parser.render()).to.eq('[You]-[ ]-[ ]')
        this.parser.roomId = 2
        expect(this.parser.render()).to.eq('[ ]-[Are]-[ ]')
        this.parser.roomId = 3
        expect(this.parser.render()).to.eq('[ ]-[ ]-[Here]')
      })
    })

    context('when room ID is -1', function () {
      it('shows all markers at once', function () {
        this.parser.roomId = -1
        expect(this.parser.render()).to.eq('[You]-[Are]-[Here]')
      })
    })

    context('when room ID is null', function () {
      it('shows no markers', function () {
        this.parser.roomId = null
        expect(this.parser.render()).to.eq('[ ]-[ ]-[ ]')
      })
    })
  })

  context('when both string for matching and non-matching is present', function () {
    before(function () {
      this.parser = new MapMarker('[<x:1?Yes|No>]-[<x:2?Yes|No>]-[<x:3?Yes|No>]')
    })

    context('when room ID matches a marker', function () {
      it('renders the marker in the correct position', function () {
        this.parser.roomId = 1
        expect(this.parser.render()).to.eq('[Yes]-[No]-[No]')
        this.parser.roomId = 2
        expect(this.parser.render()).to.eq('[No]-[Yes]-[No]')
        this.parser.roomId = 3
        expect(this.parser.render()).to.eq('[No]-[No]-[Yes]')
      })
    })

    context('when room ID is -1', function () {
      it('shows all markers at once', function () {
        this.parser.roomId = -1
        expect(this.parser.render()).to.eq('[Yes]-[Yes]-[Yes]')
      })
    })

    context('when room ID is null', function () {
      it('shows unmatching markers', function () {
        this.parser.roomId = null
        expect(this.parser.render()).to.eq('[No]-[No]-[No]')
      })
    })
  })

  context('multiline', function () {
    before(function () {
      //     [1]
      //      |
      // [2]-[3]-[4]
      //      |
      //     [5]
      this.parser = new MapMarker('    [<x:1>]\n     |\n[<x:2>]-[<x:3>]-[<x:4>]\n     |\n    [<x:5>]')
    })

    context('when room ID matches a marker', function () {
      it('renders the marker in the correct position', function () {
        this.parser.roomId = 3
        expect(this.parser.render()).to.eq('    [ ]\n     |\n[ ]-[X]-[ ]\n     |\n    [ ]')
      })
    })

    context('when room ID is -1', function () {
      it('shows all markers at once', function () {
        this.parser.roomId = -1
        expect(this.parser.render()).to.eq('    [X]\n     |\n[X]-[X]-[X]\n     |\n    [X]')
      })
    })

    context('when room ID is null', function () {
      it('shows no markers', function () {
        this.parser.roomId = null
        expect(this.parser.render()).to.eq('    [ ]\n     |\n[ ]-[ ]-[ ]\n     |\n    [ ]')
      })
    })
  })

  context('special characters', function () {
    context('|| in trueString', function () {
      context('once', function () {
        it('converts to |', function () {
          var parser = new MapMarker('[<x:1?||>]-[<x:2?||X >]-[<x:3? X||>]-[<x:4? X||X >]')
          parser.roomId = -1
          expect(parser.render()).to.eq('[|]-[|X ]-[ X|]-[ X|X ]')
        })
      })

      context('multiple times', function () {
        it('converts all occurrences to |', function () {
          var parser = new MapMarker('[<x:1?||X||X >]-[<x:2? X||X||>]-[<x:3?||X||X||>]-[<x:4?X||X||X>]')
          parser.roomId = -1
          expect(parser.render()).to.eq('[|X|X ]-[ X|X|]-[|X|X|]-[X|X|X]')
        })
      })
    })

    context('>> in trueString', function () {
      context('once', function () {
        it('converts to >', function () {
          var parser = new MapMarker('[<x:1?>>>]-[<x:2?>>X >]-[<x:3? X>>>]-[<x:4? X>>X >]')
          parser.roomId = -1
          expect(parser.render()).to.eq('[>]-[>X ]-[ X>]-[ X>X ]')
        })
      })

      context('multiple times', function () {
        it('converts all occurrences to >', function () {
          var parser = new MapMarker('[<x:1?>>X>>X >]-[<x:2? X>>X>>>]-[<x:3?>>X>>X>>>]-[<x:4?X>>X>>X>]')
          parser.roomId = -1
          expect(parser.render()).to.eq('[>X>X ]-[ X>X>]-[>X>X>]-[X>X>X]')
        })
      })
    })

    context('>> in falseString', function () {
      context('once', function () {
        it('converts to >', function () {
          var parser = new MapMarker('[<x:1?X|>>>]-[<x:2?X|>>N >]-[<x:3?X| N>>>]-[<x:4?X| N>>N >]')
          parser.roomId = null
          expect(parser.render()).to.eq('[>]-[>N ]-[ N>]-[ N>N ]')
        })
      })

      context('multiple times', function () {
        it('converts all occurrences to >', function () {
          var parser = new MapMarker('[<x:1?X|>>N>>N >]-[<x:2?X| N>>N>>>]-[<x:3?X|>>N>>N>>>]-[<x:4?X|N>>N>>N>]')
          parser.roomId = null
          expect(parser.render()).to.eq('[>N>N ]-[ N>N>]-[>N>N>]-[N>N>N]')
        })
      })
    })
  })
})
