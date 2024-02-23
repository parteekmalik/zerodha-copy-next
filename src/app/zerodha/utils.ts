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
  searchTerm = searchTerm.toUpperCase();
  const ranking: Record<number, string> = {};
  let rankinglist: string[] = [];
  array.filter((item) => {
    for (let i = 0; i < item.length - searchTerm.length; i++) {
      if (item.slice(i, i + searchTerm.length) === searchTerm) {
        if (ranking[i]) ranking[i] += " " + item;
        else ranking[i] = item;
        return item;
      }
    }
  });
  Object.keys(ranking).map((key) => {
    rankinglist = [...rankinglist, ...(ranking[Number(key)]?.split(" ") ?? [])];
  });
  return rankinglist.slice(0, 20);
}
