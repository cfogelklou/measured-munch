export const isDebug = true;

export class ThingAverager {
  polls: number = 0;
  numPollsPerPrint: number;
  average = 0;
  name: string;

  constructor(name: string, numPollsPerPrint?: number) {
    this.name = name;
    this.numPollsPerPrint = numPollsPerPrint ? numPollsPerPrint : 256;
  }

  ping = (value: number) => {
    if (!isDebug) {
      return;
    }
    this.average = this.average * 0.99 + value * 0.01;
    this.polls++;
    if (this.polls >= this.numPollsPerPrint) {
      dbg.log(this.name + ':' + this.average);
      this.polls = 0;
    }
  };
}

/**
 * A profiler utility for recording and averaging elapsed times between start and ping events.
 *
 * This class uses a ThingAverager to accumulate and report time intervals, allowing for
 * diagnostic performance monitoring when running in debugging mode.
 *
 * @remarks
 * - The profiler only records times if the debug flag is enabled.
 * - It uses the current timestamp (via Date.now()) if no explicit time is provided.
 */
export class StartStopTimeProfiler {
  previousTime = 0;
  thingAverager: ThingAverager;

  constructor(name: string, numPollsPerPrint?: number) {
    this.thingAverager = new ThingAverager(name, numPollsPerPrint);
  }

  /**
   * Initiates the debugging process by setting the internal previous time.
   *
   * If debugging is disabled (i.e., `isDebug` is falsy), the method returns immediately.
   * Otherwise, it records the current time, using the provided `_currentTime` if available,
   * or the current timestamp as returned by `Date.now()` if not.
   *
   * @param _currentTime - An optional parameter representing the current timestamp in milliseconds.
   *
   * @example
   * // Using the current system time:
   * start();
   *
   * @example
   * // Using a specific timestamp:
   * start(1625097600000);
   */
  start = (_currentTime?: number) => {
    if (!isDebug) {
      return;
    }
    this.previousTime = _currentTime ? _currentTime : Date.now();
  };

  /**
   * Executes a debugging ping by calculating the time difference since the last ping and
   * updating the averaged elapsed time.
   *
   * This method is active only if debugging is enabled (i.e. when isDebug is true). It
   * determines the current time, computes the delta from the previous time (if
   * available), and delegates the delta to thingAverager.ping. The current time is
   * then stored as the previous time for future invocations.
   *
   * @param _currentTime - An optional timestamp to override the automatic retrieval of
   * the current time using Date.now().
   */
  ping = (_currentTime?: number) => {
    if (!isDebug) {
      return;
    }
    const currentTime = _currentTime ? _currentTime : Date.now();
    if (this.previousTime) {
      const deltaTime = currentTime - this.previousTime;
      this.thingAverager.ping(deltaTime);
    }
    this.previousTime = currentTime;
  };
}

/* tslint:disable:no-console no-empty*/
export const dbg = {
  log(_message?: any, ..._optionalParams: any[]) {
    if (isDebug) {
      if (_optionalParams && _optionalParams.length) {
        console.log(_message, JSON.stringify(_optionalParams, null, 2));
      } else {
        console.log(_message);
      }
    }
  },
  logObj(_message?: any, ..._optionalParams: any[]) {
    if (isDebug) {
      if (_optionalParams && _optionalParams.length) {
        console.log(_message, _optionalParams);
      } else {
        console.log(_message);
      }
    }
  },
  warn(_message?: any, ..._optionalParams: any[]) {
    if (_optionalParams && _optionalParams.length) {
      console.log(_message, JSON.stringify(_optionalParams, null, 2));
    } else {
      console.log(_message);
    }
  },
  err(_message?: any, ..._optionalParams: any[]) {
    if (_optionalParams && _optionalParams.length) {
      console.log(_message, JSON.stringify(_optionalParams, null, 2));
    } else {
      console.log(_message);
    }
  },
  ignore(_message?: any, ..._optionalParams: any[]): void {},
};

export const PrintObjectAlphabetally = (obj: any) => {
  const map = new Map<string, string>();

  // Inject all fields from _en.translations into the map and then create a new object
  // with alphabetical entries
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      map.set(key, obj[key] as string);
    }
  }

  // Alphabetize the map
  const alphabetical: any = Object.fromEntries(
    [...map.entries()].sort((a, b) => a[0].localeCompare(b[0])),
  );

  const str1 = JSON.stringify(alphabetical, null, 2);

  // Replace '  "' with '  '
  const str2 = str1.replace(/ {2}"/g, '  ');
  // Replace '":' with ':'
  const str3 = str2.replace(/":/g, ':');
  console.log(str3);
};
/* tslint:enable:no-console no-empty*/
