export const parsePrice = (price: string | undefined) => {
  if (price === undefined) return 0.0;
  // const Fprice = parseFloat(price);
  // const pointOnePer = String(Fprice);
  // let count = 1;
  // let index = 0;
  // for (; index < pointOnePer.length; index++) {
  //   if (pointOnePer[index] === ".") break;
  // }
  // index++;
  // for (; index < pointOnePer.length; index++) {
  //   if (pointOnePer[index] !== "0") break;
  //   count++;
  // }
  // count += 4;
  // return Number(parseFloat(price).toFixed(Math.max(2, count)));
  return Number(price);
};
export function searchAndSort(searchTerm: string, array: string[]): string[] {
  return array
    .filter((item) => item.includes(searchTerm.toUpperCase()))
    .sort((a, b) => a.localeCompare(b))
    .slice(0, 20);
}