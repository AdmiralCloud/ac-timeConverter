
const ts = function() {
  /***
   *
   * Calculate a timestamp from a given time
   *
   * @param time
   * @param options
   * @returns {string}
   */
  const calculateTimestampFromSeconds = function(time, options) {
    options = options || {}
    // takes in seconds and return formatted according to options
    // options.format = "webvtt" : 00:00:12,000 LAST: Three ASCII digits, representing the thousandths of a second seconds-frac as a base ten integer.
    // options.format = "ssa": 00:00:00.00 h:mm:ss.cc (centisec).

    const hours = parseInt(time / 3600) % 24
    const minutes = parseInt(time / 60) % 60
    const seconds = parseInt(time % 60)
    const centiSeconds = Math.round((time - seconds) * 100)
    const thousandSeconds = Math.round((time - seconds) * 1000)

    let result = (hours < 10
      ? '0' + hours
      : hours) + ':' + (minutes < 10
        ? '0' + minutes
        : minutes) + ':' + (seconds < 10
        ? '0' + seconds
        : seconds)
    if (options.format === 'webvtt') {
      result += ',' + (thousandSeconds < 10
        ? '00' + thousandSeconds
        : (thousandSeconds < 100
          ? '0' + thousandSeconds
          : thousandSeconds))
    }
    if (options.format === 'ssa') {
      // hours is 0: not 00:, centisecs must be 00 not 0
      result += '.' + (centiSeconds < 10
        ? '0' + centiSeconds
        : centiSeconds)
      result = result.substr(1)
    }
    return result
  }

  /**
   * Ingests a timestamp (HH:MM:SS) and converts it to seconds
   *
   * @param timestamp
   * @param options.delimiter - defaults to :
   * @param options.frameDelimiter - defaults to ;
   */
  const calculateSecondsFromTimestamp = function(timestamp, options) {
    options = options || {}

    const delimiter = options.delimiter || ':'
    const frameDelimiter = options.frameDelimiter || ';'
    const frameRate = options.frameRate || 25

    const regex = '(\\d{2})' + delimiter + '(\\d{2})' + delimiter + '(\\d{2})' + '(' + frameDelimiter + '(\\d{1,3}))?'
    const re = new RegExp(regex)
    const match = timestamp.match(re)

    if (!match) return ({ message: 'formatInvalid' })

    const hours = parseInt(match[1]) || 0
    const minutes = parseInt(match[2]) || 0
    const seconds = parseInt(match[3]) || 0

    let frames
    if (match[5]) {
      frames = parseInt(match[5])
      if (frames > frameRate) return ({ message: 'framesHigherThanFrameRate' })
      frames = frames / frameRate
    }

    let total = hours * 3600 + minutes * 60 + seconds
    if (frames) total += frames
    return total
  }

  /**
   * Ingests timestamps and returns the duration in seconds
   *
   * @param start (STRING|NUMBER) timestamp (e.g. 00:00:10) or seconds (e.g. 3.45)
   * @param end (STRING|NUMBER) timestamp (e.g. 00:00:10) or seconds (e.g. 3.45)
   * @param options
   */
  const duration = function(start, end, options) {
    if (typeof start === 'string') {
      start = calculateSecondsFromTimestamp(start, options)
    }
    if (typeof end === 'string') {
      end = calculateSecondsFromTimestamp(end, options)
    }
    if (start >= end) return { 'message': 'endBeforeStart' }

    return end - start
  }

  return {
    secondsFromTimestamp: calculateSecondsFromTimestamp,
    timestampFromSeconds: calculateTimestampFromSeconds,
    duration: duration
  }
}

module.exports = ts()
