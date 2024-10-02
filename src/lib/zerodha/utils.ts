export function sumByKey<T>(list: T[], key: keyof T): number {
  return list.reduce((total, item) => total + Number(item[key]), 0);
}
