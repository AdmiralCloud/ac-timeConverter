# AC TimeConverter
This little helper converts timestamps to seconds and vice versa. Use it for transcoding or display purposes of videos and other media files.

## Usage
const acts = require('ac-timeConverter')

### Convert seconds to timestamp
```
let timeStamp = acts.timestampFromSeconds(300)
// -> 00:00:05
```

### Convert timestamp to seconds
```
let seconds = acts.secondsFromTimestamp('00:00:06')
// -> 6
```

### Duration between timestamps
```
let duration = acts.duration('00:00:03', '00:00:06')
// -> 3
```
