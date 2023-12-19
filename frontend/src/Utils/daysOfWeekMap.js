export function booleanArrayToBitNumber(boolArray) {
  let bitNumber = 0;

  for (let i = 0; i < boolArray.length; i++) {
    if (boolArray[i]) {
      bitNumber |= 1 << i;
    }
  }

  return bitNumber;
}

export function arrayToEnglishList(arr) {
  if (arr.length === 0) {
    return "";
  } else if (arr.length === 1) {
    return arr[0];
  } else if (arr.length === 2) {
    return `${arr[0]} and ${arr[1]}`;
  } else {
    const lastItem = arr.pop();
    const list = arr.join(", ");
    return `${list}, and ${lastItem}`;
  }
}
