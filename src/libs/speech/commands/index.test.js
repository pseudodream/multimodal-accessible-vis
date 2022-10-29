import tutorial from "charts/tutorial.json";
import barchart from "charts/barchart.json";
import linechart from "charts/linechart.json";
import scatterplot from "charts/scatterplot.json";
import map from "charts/map.json";
import * as d3 from "d3";

import { processCommand } from "./index.js";
// ====================================================================//
// ========================  category lookup ==========================//
// ====================================================================//
test("speech category lookup", () => {
  const element = document.createElement("div");
  let data, formatter, variables, answer, voiceText, response;

  // tutorial chart
  data = tutorial.data.values;
  formatter = d3.format(",.0f");
  variables = [
    {
      field: "country",
      type: "categorical",
      title: "Country",
      label: "country",
      encoding: "vertical axis",
    },
    {
      field: "continent",
      type: "categorical",
      title: "Continent",
      label: "continent",
      encoding: "color legend",
    },
    {
      field: "cases",
      type: "numerical",
      title: "Covid-19 cases",
      label: "case",
      encoding: "horizontal axis",
    },
  ];
  answer = "United States";
  voiceText = "Which country has the maximum value?";
  response = processCommand(voiceText, data, {
    variables,
    title: tutorial.title,
    description: tutorial.description,
    responseEl: element,
    formatters: { cases: formatter },
  }); //

  expect(response.includes(answer)).toBe(true);

  answer = "Netherlands";
  voiceText = "Which country has the minimum value?";
  response = processCommand(voiceText, data, {
    variables,
    title: tutorial.title,
    description: tutorial.description,
    responseEl: element,
    formatters: { cases: formatter },
  }); //

  expect(response.includes(answer)).toBe(true);

  answer = "Netherlands";
  voiceText = "Which country has the minimum case in Europe?";
  response = processCommand(voiceText, data, {
    variables,
    title: tutorial.title,
    description: tutorial.description,
    responseEl: element,
    formatters: { cases: formatter },
  }); //

  expect(response.includes(answer)).toBe(true);

  answer = "India";
  voiceText = "Which country has the maximum case in Asia?";
  response = processCommand(voiceText, data, {
    variables,
    title: tutorial.title,
    description: tutorial.description,
    responseEl: element,
    formatters: { cases: formatter },
  }); //

  const groups = d3.rollup(
    data,
    (group) => d3.sum(group, (d) => d["cases"]),
    (d) => d["continent"]
  );

  const maximum = d3.greatest(groups, ([, agg]) => agg);
  answer = maximum[0];
    
  voiceText = "Which continent has the maximum total case?";
  response = processCommand(voiceText, data, {
    variables,
    title: tutorial.title,
    description: tutorial.description,
    responseEl: element,
    formatters: { cases: formatter },
  }); //

  expect(response.includes(answer)).toBe(true);

  // bar chart
  data = barchart.data.values;
  formatter = d3.format(",.0f");
  variables = [
    {
      field: "month",
      type: "categorical",
      label: "month",
      encoding: "horizontal axis",
    },
    {
      field: "weather",
      type: "categorical",
      label: "weather",
      encoding: "color legend",
    },
    {
      field: "count",
      type: "numerical",
      label: "count",
      encoding: "vertical axis",
    },
  ];

  answer = d3.greatest(
    d3.rollup(
      data,
      (v) => d3.mean(v, (d) => d.count),
      (d) => d.weather
    ),
    ([, mean]) => mean
  );

  voiceText = "Which weather type has the maximum count?";

  response = processCommand(voiceText, data, {
    variables,
    title: tutorial.title,
    description: tutorial.description,
    responseEl: element,
    formatters: { cases: formatter },
  });

  expect(response.includes(answer[0])).toBe(true);

  answer = d3.least(
    d3.rollup(
      data.filter((d) => d.weather === "sun"),
      (v) => d3.mean(v, (d) => d.count),
      (d) => d.month
    ),
    ([, mean]) => mean
  );
  voiceText = "Which month has the minimum sunny days?";
  // console.log(
  //   "filtered",
  //   data.filter((d) => d.weather === "sun")
  // );
  response = processCommand(voiceText, data, {
    variables,
    title: tutorial.title,
    description: tutorial.description,
    responseEl: element,
    formatters: { cases: formatter },
  });
  // console.log("answer---------------", answer);
  expect(response.includes(answer[0])).toBe(true);

  answer = d3.greatest(
    d3.rollup(
      data.filter((d) => d.weather === "rain"),
      (v) => d3.mean(v, (d) => d.count),
      (d) => d.month
    ),
    ([, mean]) => mean
  );
  voiceText = "Which month has the most amount of rain?";
  // console.log(
  //   "filtered",
  //   data.filter((d) => d.weather === "sun")
  // );
  response = processCommand(voiceText, data, {
    variables,
    title: tutorial.title,
    description: tutorial.description,
    responseEl: element,
    formatters: { cases: formatter },
  });
  //   console.log("answer---------------", answer);
  expect(response.includes(answer[0])).toBe(true);

  answer = d3.least(d3.rollup(
    data,
    (group) => d3.median(group, (d) => d["count"]),
    (d) => d["weather"]
  ), ([, agg]) => agg);;
    
  voiceText = "Which weather type has the least median count?";
  response = processCommand(voiceText, data, {
    variables,
    title: tutorial.title,
    description: tutorial.description,
    responseEl: element,
    formatters: { cases: formatter },
  }); //
  expect(response.includes(answer[0])).toBe(true);

  // line chart
  data = linechart.data.values;
  formatter = d3.format("$,.2f");
  variables = [
    {
      field: "Company",
      type: "categorical",
      label: "company",
      encoding: "colored lines",
    },
    {
      field: "Year",
      type: "categorical",
      label: "year",
      encoding: "horizontal axis",
    },
    {
      field: "Price",
      type: "numerical",
      label: "price",
      encoding: "vertical axis",
    },
  ];
  answer = "Microsoft";
  voiceText = "Which company as the minimum average price?";
  response = processCommand(voiceText, data, {
    variables,
    title: tutorial.title,
    description: tutorial.description,
    responseEl: element,
    formatters: { Price: formatter },
  }); //
  expect(response.includes(answer)).toBe(true);

  answer = "IBM";
  voiceText = "Which company as the maximum price in 2002?";
  response = processCommand(voiceText, data, {
    variables,
    title: tutorial.title,
    description: tutorial.description,
    responseEl: element,
    formatters: { Price: formatter },
  }); //
  expect(response.includes(answer)).toBe(true);
  
  answer = d3.least(d3.rollup(
    data,
    (group) => d3.median(group, (d) => d["Price"]),
    (d) => d["Company"]
  ), ([, agg]) => agg);;
    
  voiceText = "Which company has the lowest median price?";
  response = processCommand(voiceText, data, {
    variables,
    title: tutorial.title,
    description: tutorial.description,
    responseEl: element,
    formatters: { cases: formatter },
  }); //
  expect(response.includes(answer[0])).toBe(true);

  // scatter plot
  data = scatterplot.data.values;
  const formatIncome = d3.format("$,.0f");
  const formatExpectancy = (d) => `${d3.format(".1f")(d)} years`;
  variables = [
    {
      field: "country",
      type: "categorical",
      label: "country",
      encoding: "circle dot",
    },
    {
      field: "region",
      type: "categorical",
      label: "region",
      encoding: "color",
    },
    {
      field: "life_expectancy",
      type: "numerical",
      label: "life expectancy",
      encoding: "horizontal axis",
    },
    {
      field: "income",
      type: "numerical",
      label: "income",
      encoding: "vertical axis",
    },
  ];
  answer = "Luxembourg";
  voiceText = "which country has the highest income?";
  response = processCommand(voiceText, data, {
    variables,
    title: tutorial.title,
    description: tutorial.description,
    responseEl: element,
    formatters: { income: formatIncome, life_expectancy: formatExpectancy },
  }); //
  expect(response.includes(answer)).toBe(true);

  answer = "America";
  voiceText = "Which region has the lowest life expectancy?";
  response = processCommand(voiceText, data, {
    variables,
    title: tutorial.title,
    description: tutorial.description,
    responseEl: element,
    formatters: { income: formatIncome, life_expectancy: formatExpectancy },
  }); //
  expect(response.includes(answer)).toBe(true);
 
  answer = d3.least(d3.rollup(
    data,
    (group) => d3.mean(group, (d) => d["life_expectancy"]),
    (d) => d["region"]
  ), ([, agg]) => agg);;
  
  voiceText = "Which region has the lowest average life expectancy?";
  response = processCommand(voiceText, data, {
    variables,
    title: tutorial.title,
    description: tutorial.description,
    responseEl: element,
    formatters: { cases: formatter },
  }); //
  expect(response.includes(answer[0])).toBe(true);

  // map
  data = map.data.values;
  formatter = (d) => d3.format(".2%")(d / 100);
  variables = [
    {
      field: "state",
      type: "categorical",
      label: "state",
      encoding: "geoshape",
    },
    {
      field: "vaccination_rate",
      type: "numerical",
      label: "vaccination rate",
      encoding: "color",
    },
  ];
  answer = "Wyoming";
  voiceText = "which state has the minimum rate?";
  response = processCommand(voiceText, data, {
    variables,
    title: tutorial.title,
    description: tutorial.description,
    responseEl: element,
    formatters: { vaccination_rate: formatter },
  }); //
  expect(response.includes(answer)).toBe(true);

  answer = "Rhode Island";
  voiceText = "Which state has the highest vaccination rate?";
  response = processCommand(voiceText, data, {
    variables,
    title: tutorial.title,
    description: tutorial.description,
    responseEl: element,
    formatters: { vaccination_rate: formatter },
  }); //
  expect(response.includes(answer)).toBe(true);


   
  answer = d3.least(d3.rollup(
    data,
    (group) => d3.mean(group, (d) => d["vaccination_rate"]),
    (d) => d["state"]
  ), ([, agg]) => agg);;
  
  voiceText = "Which state has the lowest average vaccination rate?";
  response = processCommand(voiceText, data, {
    variables,
    title: tutorial.title,
    description: tutorial.description,
    responseEl: element,
    formatters: { cases: formatter },
  }); //
  expect(response.includes(answer[0])).toBe(true);
});

// =================================================================//
// ========================  value lookup ==========================//
// =================================================================//
test("speech value lookup", () => {
  const element = document.createElement("div");
  let data, formatter, variables, answer, voiceText, response;

  // tutorial chart
  data = tutorial.data.values;
  formatter = d3.format(",.0f");
  variables = [
    {
      field: "country",
      type: "categorical",
      title: "Country",
      label: "country",
      encoding: "vertical axis",
    },
    {
      field: "continent",
      type: "categorical",
      title: "Continent",
      label: "continent",
      encoding: "color legend",
    },
    {
      field: "cases",
      type: "numerical",
      title: "Covid-19 cases",
      label: "case",
      encoding: "horizontal axis",
    },
  ];
  answer = formatter(data.find((d) => d.country === "United States").cases);
  voiceText = "what is the case value of the United States?";
  response = processCommand(voiceText, data, {
    variables,
    title: tutorial.title,
    description: tutorial.description,
    responseEl: element,
    formatters: { cases: formatter },
  }); //
  expect(response.includes(answer)).toBe(true);

  // bar chart
  data = barchart.data.values;
  formatter = d3.format(",.0f");
  variables = [
    {
      field: "month",
      type: "categorical",
      label: "month",
      encoding: "horizontal axis",
    },
    {
      field: "weather",
      type: "categorical",
      label: "weather",
      encoding: "color legend",
    },
    {
      field: "count",
      type: "numerical",
      label: "count",
      encoding: "vertical axis",
    },
  ];

  answer = "76";
  voiceText = "What is the count of sun in June?";

  response = processCommand(voiceText, data, {
    variables,
    title: tutorial.title,
    description: tutorial.description,
    responseEl: element,
    formatters: { cases: formatter },
  });

  expect(response.includes(answer)).toBe(true);

  answer = "73";
  voiceText = "How many rainy days are there in December?";

  response = processCommand(voiceText, data, {
    variables,
    title: tutorial.title,
    description: tutorial.description,
    responseEl: element,
    formatters: { cases: formatter },
  });
  expect(response.includes(answer)).toBe(true);

  // linechart
  data = linechart.data.values;
  formatter = d3.format("$,.2f");
  variables = [
    {
      field: "Company",
      type: "categorical",
      label: "company",
      encoding: "colored lines",
    },
    {
      field: "Year",
      type: "categorical",
      label: "year",
      encoding: "horizontal axis",
    },
    {
      field: "Price",
      type: "numerical",
      label: "price",
      encoding: "vertical axis",
    },
  ];
  answer = formatter(
    data
      .filter((d) => d.Company === "Apple")
      .reduce((acc, cur) => parseFloat(cur.Price) + acc, 0)
  );
  voiceText = "What is the total stock price of apple?";
  response = processCommand(voiceText, data, {
    variables,
    title: tutorial.title,
    description: tutorial.description,
    responseEl: element,
    formatters: { Price: formatter },
  }); //
  expect(response.includes(answer)).toBe(true);

  // scatter plot
  data = scatterplot.data.values;
  const formatIncome = d3.format("$,.0f");
  const formatExpectancy = (d) => `${d3.format(".1f")(d)} years`;
  variables = [
    {
      field: "country",
      type: "categorical",
      label: "country",
      encoding: "circle dot",
    },
    {
      field: "region",
      type: "categorical",
      label: "region",
      encoding: "color",
    },
    {
      field: "life_expectancy",
      type: "numerical",
      label: "life expectancy",
      encoding: "horizontal axis",
    },
    {
      field: "income",
      type: "numerical",
      label: "income",
      encoding: "vertical axis",
    },
  ];
  answer = "80.6";
  voiceText = "What is the life expectancy of Korea?";
  response = processCommand(voiceText, data, {
    variables,
    title: tutorial.title,
    description: tutorial.description,
    responseEl: element,
    formatters: { income: formatIncome, life_expectancy: formatExpectancy },
  }); //
  expect(response.includes(answer)).toBe(true);

  answer = "52,118";
  voiceText = "What is the income of United States?";
  response = processCommand(voiceText, data, {
    variables,
    title: tutorial.title,
    description: tutorial.description,
    responseEl: element,
    formatters: { income: formatIncome, life_expectancy: formatExpectancy },
  }); //
  expect(response.includes(answer)).toBe(true);

  // map
  data = map.data.values;
  formatter = (d) => d3.format(".2%")(d / 100);
  variables = [
    {
      field: "state",
      type: "categorical",
      label: "state",
      encoding: "geoshape",
    },
    {
      field: "vaccination_rate",
      type: "numerical",
      label: "vaccination rate",
      encoding: "color",
    },
  ];
  answer = "80.08";
  voiceText = "what is the vaccination rate of Massachusetts?";
  response = processCommand(voiceText, data, {
    variables,
    title: tutorial.title,
    description: tutorial.description,
    responseEl: element,
    formatters: { vaccination_rate: formatter },
  }); //
  expect(response.includes(answer)).toBe(true);

  answer = " 72.88";
  voiceText = "What is the value of California?";
  response = processCommand(voiceText, data, {
    variables,
    title: tutorial.title,
    description: tutorial.description,
    responseEl: element,
    formatters: { vaccination_rate: formatter },
  }); //
  expect(response.includes(answer)).toBe(true);
});
// ================================================================//
// ========================  sum/average ==========================//
// ================================================================//
test("speech sum/average", () => {
  const element = document.createElement("div");
  let data, formatter, variables, answer, voiceText, response;

  // tutorial chart
  data = tutorial.data.values;
  formatter = d3.format(",.0f");
  variables = [
    {
      field: "country",
      type: "categorical",
      title: "Country",
      label: "country",
      encoding: "vertical axis",
    },
    {
      field: "continent",
      type: "categorical",
      title: "Continent",
      label: "continent",
      encoding: "color legend",
    },
    {
      field: "cases",
      type: "numerical",
      title: "Covid-19 cases",
      label: "case",
      encoding: "horizontal axis",
    },
  ];
  answer = "86,900,000";
  voiceText = "what is the maximum case?";
  response = processCommand(voiceText, data, {
    variables,
    title: tutorial.title,
    description: tutorial.description,
    responseEl: element,
    formatters: { cases: formatter },
  }); //

  expect(response.includes(answer)).toBe(true);

  answer = formatter(
    data
      .filter((d) => d.continent === "America")
      .map((d) => d.cases)
      .reduce((acc, cur) => cur + acc, 0)
  );

  voiceText = "what is the total case in America?";
  response = processCommand(voiceText, data, {
    variables,
    title: tutorial.title,
    description: tutorial.description,
    responseEl: element,
    formatters: { cases: formatter },
  }); //

  expect(response.includes(answer)).toBe(true);

  answer = formatter(
    d3.mean(
      data.filter((d) => d.continent === "Asia"),
      (d) => d.cases
    )
  );
  voiceText = "what is the average case in Asia?";
  response = processCommand(voiceText, data, {
    variables,
    title: tutorial.title,
    description: tutorial.description,
    responseEl: element,
    formatters: { cases: formatter },
  }); //

  expect(response.includes(answer)).toBe(true);

  // bar chart
  data = barchart.data.values;
  formatter = d3.format(",.0f");
  variables = [
    {
      field: "month",
      type: "categorical",
      label: "month",
      encoding: "horizontal axis",
    },
    {
      field: "weather",
      type: "categorical",
      label: "weather",
      encoding: "color legend",
    },
    {
      field: "count",
      type: "numerical",
      label: "count",
      encoding: "vertical axis",
    },
  ];

  answer = formatter(
    d3.mean(
      data.filter((d) => d.weather === "snow"),
      (d) => d.count
    )
  );

  voiceText = "what is the average days of snow?";

  response = processCommand(voiceText, data, {
    variables,
    title: tutorial.title,
    description: tutorial.description,
    responseEl: element,
    formatters: { cases: formatter },
  });

  expect(response.includes(answer[0])).toBe(true);

  answer = formatter(
    d3.min(
      data.filter((d) => d.month === "August"),
      (d) => d.count
    )
  );

  voiceText = "what is the lowest count in August?";

  response = processCommand(voiceText, data, {
    variables,
    title: tutorial.title,
    description: tutorial.description,
    responseEl: element,
    formatters: { cases: formatter },
  });

  expect(response.includes(answer[0])).toBe(true);

  answer = formatter(
    d3.sum(
      data.filter((d) => d.month === "fog"),
      (d) => d.count
    )
  );

  voiceText = "What is the total count of foggy days?";

  response = processCommand(voiceText, data, {
    variables,
    title: tutorial.title,
    description: tutorial.description,
    responseEl: element,
    formatters: { cases: formatter },
  });

  expect(response.includes(answer[0])).toBe(true);

  // linechart
  data = linechart.data.values;
  formatter = d3.format("$,.2f");
  variables = [
    {
      field: "Company",
      type: "categorical",
      label: "company",
      encoding: "colored lines",
    },
    {
      field: "Year",
      type: "categorical",
      label: "year",
      encoding: "horizontal axis",
    },
    {
      field: "Price",
      type: "numerical",
      label: "price",
      encoding: "vertical axis",
    },
  ];
  answer = formatter(
    d3.sum(
      data.filter((d) => d.Company === "Apple"),
      (d) => d.Price
    )
  );
  voiceText = "What is the total stock price of apple?";
  response = processCommand(voiceText, data, {
    variables,
    title: tutorial.title,
    description: tutorial.description,
    responseEl: element,
    formatters: { Price: formatter },
  }); //
  expect(response.includes(answer)).toBe(true);

  answer = formatter(
    d3.mean(
      data.filter((d) => d.Company === "Microsoft"),
      (d) => d.Price
    )
  );
  voiceText = "What is the average stock price of Microsoft?";
  response = processCommand(voiceText, data, {
    variables,
    title: tutorial.title,
    description: tutorial.description,
    responseEl: element,
    formatters: { Price: formatter },
  }); //
  expect(response.includes(answer)).toBe(true);

  // scatter plot
  data = scatterplot.data.values;
  const formatIncome = d3.format("$,.0f");
  const formatExpectancy = (d) => `${d3.format(".1f")(d)} years`;
  variables = [
    {
      field: "country",
      type: "categorical",
      label: "country",
      encoding: "circle dot",
    },
    {
      field: "region",
      type: "categorical",
      label: "region",
      encoding: "color",
    },
    {
      field: "life_expectancy",
      type: "numerical",
      label: "life expectancy",
      encoding: "horizontal axis",
    },
    {
      field: "income",
      type: "numerical",
      label: "income",
      encoding: "vertical axis",
    },
  ];
  answer = formatExpectancy(d3.mean(data, (d) => d.life_expectancy));
  voiceText = "What is the average life expectancy?";
  response = processCommand(voiceText, data, {
    variables,
    title: scatterplot.title,
    description: scatterplot.description,
    responseEl: element,
    formatters: { income: formatIncome, life_expectancy: formatExpectancy },
  }); //
  expect(response.includes(answer)).toBe(true);

  answer = formatIncome(
    d3.min(
      data.filter((d) => d.region === "Asia"),
      (d) => d.income
    )
  );
  voiceText = "What is the lowest income in Asia?";
  response = processCommand(voiceText, data, {
    variables,
    title: tutorial.title,
    description: tutorial.description,
    responseEl: element,
    formatters: { income: formatIncome, life_expectancy: formatExpectancy },
  }); //
  expect(response.includes(answer)).toBe(true);

  // map
  data = map.data.values;
  formatter = (d) => d3.format(".2%")(d / 100);
  variables = [
    {
      field: "state",
      type: "categorical",
      label: "state",
      encoding: "geoshape",
    },
    {
      field: "vaccination_rate",
      type: "numerical",
      label: "vaccination rate",
      encoding: "color",
    },
  ];
  answer = formatter(d3.mean(data, (d) => d.vaccination_rate));
  voiceText = "what is the average vaccination rate?";
  response = processCommand(voiceText, data, {
    variables,
    title: tutorial.title,
    description: tutorial.description,
    responseEl: element,
    formatters: { vaccination_rate: formatter },
  }); //
  expect(response.includes(answer)).toBe(true);

  answer = formatter(d3.min(data, (d) => d.vaccination_rate));
  voiceText = "what is the lowest vaccination rate?";
  response = processCommand(voiceText, data, {
    variables,
    title: tutorial.title,
    description: tutorial.description,
    responseEl: element,
    formatters: { vaccination_rate: formatter },
  }); //
  expect(response.includes(answer)).toBe(true);
});
