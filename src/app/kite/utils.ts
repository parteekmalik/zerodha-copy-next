export const calStep = (value: number) => {
  // Default to 1 if FormData.decimal is not defined or invalid
  const decimal = value - 1;

  try {
    // Ensure decimal is a valid number
    if (isNaN(decimal) || decimal < 1) {
      throw new Error(`Invalid decimal value -> ${decimal}`);
    }
    return Number(`0.${"0".repeat(decimal)}1`);
  } catch (err) {
    console.error("Error in calculating step:", err, value);
    return 1; // Fallback value
  }
};
export function searchAndSort(searchTerm: string, array: string[], notInclude: string[]): string[] {
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
    rankinglist = [...rankinglist, ...(ranking[Number(key)]?.split(" ") ?? []).sort()];
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
    if (diff === "up") {
      return "text-greenApp";
    } else if (diff === "down") {
      return "text-redApp";
    } else {
      return "";
    }
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
export const modifyNumber = (s: string | number | undefined, toFixed?: number, isPositiveSign?: boolean) => {
  if (typeof s === "string") s = Number(s);
  else if (!s) s = 0;

  // Format with toFixed to ensure decimal places
  let formattedNumber = s.toFixed(toFixed ?? 2);

  // If the number is positive, add a "+" sign in front
  if (Number(s) > 0 && isPositiveSign) formattedNumber = "+" + formattedNumber;

  return formattedNumber;
};
