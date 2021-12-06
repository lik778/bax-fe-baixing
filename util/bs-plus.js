export function diffDifrent (arr1, arr2) {
  const arr3 = [...arr1, ...arr2]
  console.log(arr3)
  return arr3.filter(a => (
    !arr1.includes(a) || !arr2.includes(a)
  ))
}
