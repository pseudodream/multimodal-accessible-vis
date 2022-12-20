//some hardcoded answers to certain questions

export default function others(keyword, options, data) {
  let response = null;

  //manually define answers for each graph given some key word
  if (
    options.title ===
    "Count of days of different weather types in Seattle from 2012 to 2015"
  ) {
    switch (keyword) {
      case "axis":
        response =
          "The x-axis represents month, the y-axis represents count of days";
        break;
      case "trend":
        response =
          "The number of sunny days increase from Janauary to July, and it decreases from July to December";
        break;
      default:
        console.log("this should not happen");
    }
  } else if (
    options.title ===
    "Covid-19 Cases by country and continent as of June 27, 2022"
  ) {
    response =
      "The y-axis represents countries, the x-axis represents number of cases";
  } else if (options.title === "Stock prices of 5 Tech Companies over Time") {
  } else if (
    options.title ===
    "Life expectancy and Income of 38 OECD countries in different regions"
  ) {
  } else if (options.title === "Vaccination rate by State") {
  } else {
    response = "This should not happen";
  }

  return response;
}
