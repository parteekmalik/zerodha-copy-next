export const parsePrice = (price: string | undefined) => {
  if (price === undefined) return 0;
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
export function searchAndSort(
  searchTerm: string,
  array: string[],
  notInclude: string[],
): string[] {
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
    rankinglist = [
      ...rankinglist,
      ...(ranking[Number(key)]?.split(" ") ?? []).sort(),
    ];
  });
  rankinglist = rankinglist.filter((item) => !notInclude.includes(item));
  return rankinglist.slice(0, 20);
}
export function listToRecord<T>(list: T[], key: keyof T): Record<string, T> {
  return list.reduce(
    (record, item) => {
      const keyValue = item[key];
      if (keyValue !== undefined) {
        record[String(keyValue)] = item;
      }
      return record;
    },
    {} as Record<string, T>,
  );
}
export const getColor = (diff: number | string | boolean) => {
  if (typeof diff === "string") {
    if (diff === "completed") {
      diff = 1;
    } else if (diff === "cancelled") {
      diff = -1;
    } else if (diff.endsWith("%")) diff = diff.split("%")[0] ?? "";
  } else if (typeof diff === "boolean") diff = diff ? 1 : -1;
  diff = Number(diff);
  if (diff > 0) {
    return "text-greenApp";
  } else if (diff < 0) {
    return "text-redApp";
  } else {
    return "";
  }
};

export function formatDate(date: Date): string {
  const pad = (num: number) => (num < 10 ? "0" : "") + num;

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1); // Months are zero-based
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
export const modifyNumber = (
  s: string | number | undefined,
  toFixed?: number,
  isPositiveSign?: boolean,
) => {
  if (typeof s === "string") s = Number(s);
  else if (!s) s = 0;

  // Format with toFixed to ensure decimal places
  let formattedNumber = s.toFixed(toFixed ?? 2);

  // If the number is positive, add a "+" sign in front
  if (Number(s) > 0 && isPositiveSign) formattedNumber = "+" + formattedNumber;

  return formattedNumber;
};