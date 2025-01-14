import Decimal from 'decimal.js';

export function sumByKey<T>(list: T[], key: keyof T) {
  return list.reduce((total, item) => total.plus(new Decimal(item[key] as number)), new Decimal(0)).toNumber();
}
