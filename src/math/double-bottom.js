export const isDoubleBottom = (data) => {
  // TODO - distance between both bottoms should be a factor
  const RANGE = 4;

  if (data.length < RANGE) {
    return false;
  }

  // Access backward 4 places.
  const lowOne = data[data.length - RANGE]['y'][3];
  const mid = data[data.length - RANGE + 1]['y'][3];
  const lowTwo = data[data.length - RANGE + 2]['y'][3];
  const high = data[data.length - RANGE + 3]['y'][3];

  /*
  First, check if basic structure of W is there
  Then, check if thresholds are met
  */
  if (
    isBasicW(high, lowOne, lowTwo, mid)
    && areThresholdsMet(lowOne, lowTwo, mid)
  ) {
    return true;
  }

  return false;
}

function isBasicW(high, lowOne, lowTwo, mid) {
  return (
    high >= mid
    && lowTwo >= lowOne
    && mid > lowTwo
  );
}

function areThresholdsMet(lowOne, lowTwo, mid) {
  return (
    isBottomDiffThresholdMet(lowOne, lowTwo)
    && isMidpointThresholdMet(mid, lowOne)
  );
}

function isBottomDiffThresholdMet(lowOne, lowTwo) {
  const BOTTOM_DIFF_THRESHOLD_HIGH = 0.0007
  const BOTTOM_DIFF_THRESHOLD_LOW = 0;

  const pctDiff = (lowTwo - lowOne) / lowOne;

  return pctDiff >= BOTTOM_DIFF_THRESHOLD_LOW && pctDiff <= BOTTOM_DIFF_THRESHOLD_HIGH;
}

function isMidpointThresholdMet(mid, lowOne) {
  const MIDPOINT_THRESHOLD_HIGH = 0.002;
  const MIDPOINT_THRESHOLD_LOW = 0.001;

  const pctDiff = (mid - lowOne) / lowOne;

  return pctDiff >= MIDPOINT_THRESHOLD_LOW && pctDiff <= MIDPOINT_THRESHOLD_HIGH;
}
