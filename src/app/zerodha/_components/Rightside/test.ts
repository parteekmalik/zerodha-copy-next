const teest = [null, "sdasd", null].reduce((prev:string[], cur, i) => {
  if (cur) prev.push(cur);
  return prev;
}, []);
