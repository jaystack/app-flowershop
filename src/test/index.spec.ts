import 'mocha'
import * as assert from 'assert'

import system from '../app/system'

describe('System', () => {
  it('starts', (done) => {
    system.start().then(resources => {
      assert.ok(resources)
      done()
    }).catch(err => done(err))
  })
})