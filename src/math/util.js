export const buildBasicData = (data) => {
  return data.map(el => {
    return el['y'];
  });
}

export const buildClosesData = (data) => {
  return data.map(el => {
    return el['y'][3];
  });
}
