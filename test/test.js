const expect = require('expect')
const acts = require('../index')

describe('Testing AC TimeConverter', function () {
  let ts = '00:00:03'
  let seconds = 3
  let start = '00:00:04'
  let end = '00:00:09'
  let duration = 5

  it('Convert timestamp to seconds', function(done) {
    let test = acts.secondsFromTimestamp(ts)
    expect(test).toEqual(seconds)
    return done()
  })

  it('Convert seconds to timestamp', function(done) {
    let test = acts.timestampFromSeconds(seconds)
    expect(test).toEqual(ts)
    return done()
  })

  it('Calculate duration from timestamps', function(done) {
    let test = acts.duration(start, end)
    expect(test).toEqual(duration)
    return done()
  })
})
