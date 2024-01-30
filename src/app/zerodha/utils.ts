export const parsePrice = (price: string | undefined) => {
  if (price === undefined) return 0.0;
  const Fprice = parseFloat(price);
  const pointOnePer = String(Fprice / 10000);
  let count = 1;
  let index = 0;
  for (; index < pointOnePer.length; index++) {
    if (pointOnePer[index] === ".") break;
  }
  index++;
  for (; index < pointOnePer.length; index++) {
    if (pointOnePer[index] !== "0") break;
    count++;
  }
  return Number(parseFloat(price).toFixed(Math.max(2, count)));
};
