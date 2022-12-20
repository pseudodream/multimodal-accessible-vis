// catVal: optional
// catVar: group by category, optional
const value = (data, variables, num, ...catVals) => {
  const cats = variables.filter((v) => v.type === "categorical");

  const filtered = data.filter((d) => {
    // console.log(d, catVals.every(catVal=>cats.some(c=>catVal.toLowerCase()===d[c.field].toLowerCase())));
    return catVals.every((catVal) =>
      cats.some(
        (c) => catVal.toLowerCase() === d[c.field].toString().toLowerCase()
      )
    );
  });
  // console.log(num, catVals.map(catVal=>catVal.toLowerCase()), data.filter(d => cats.every(c=>d[c.field])), filtered, cats);
  if (filtered.length > 1) {
    console.error("multiple items found in a value lookup command."); //TODO: we can forward this message to the user
    return undefined;
  }
  if (filtered.length === 0) {
    console.error("no matching value found!");
    return undefined;
  }

  //console.log(filtered[0][num])

  return filtered[0][num];
};

export default value;
