
import { tokens } from "./theme";





export const mockTransactions = [
  {
    txId: "01e4dsa",
    user: "johndoe",
    date: "2021-09-01",
    cost: "43.95",
  },
  {
    txId: "0315dsaa",
    user: "jackdower",
    date: "2022-04-01",
    cost: "133.45",
  },
  {
    txId: "01e4dsa",
    user: "aberdohnny",
    date: "2021-09-01",
    cost: "43.95",
  },
  {
    txId: "51034szv",
    user: "goodmanave",
    date: "2022-11-05",
    cost: "200.95",
  },
  {
    txId: "0a123sb",
    user: "stevebower",
    date: "2022-11-02",
    cost: "13.55",
  },
  {
    txId: "01e4dsa",
    user: "aberdohnny",
    date: "2021-09-01",
    cost: "43.95",
  },
  {
    txId: "120s51a",
    user: "wootzifer",
    date: "2019-04-15",
    cost: "24.20",
  },
  {
    txId: "0315dsaa",
    user: "jackdower",
    date: "2022-04-01",
    cost: "133.45",
  },
];

export const mockBarData = [
  {
    status: "Active",
    Male: 137,
    MaleColor: "hsl(229, 70%, 50%)",
    Female: 96,
    FemaleColor: "hsl(296, 70%, 50%)",
  },
  {
    status: "Onleave",
    Male: 55,
    MaleColor: "hsl(307, 70%, 50%)",
    Female: 28,
    FemaleColor: "hsl(111, 70%, 50%)",
  },
  {
    status: "Probit",
    Male: 109,
    MaleColor: "hsl(72, 70%, 50%)",
    Female: 23,
    FemaleColor: "hsl(96, 70%, 50%)",
  },
  {
    status: "Terminate",
    Male: 133,
    MaleColor: "hsl(257, 70%, 50%)",
    Female: 52,
    FemaleColor: "hsl(326, 70%, 50%)",
  },
];

export const mockPieData = [
  {
    id: "Young (13-19)",
    label: "Young (13-19)",
    value: 81,  // percentage of employees in this age group
    color: "hsl(197, 70%, 50%)", // choose an appropriate color
  },
  {
    id: "Adult (20-39)",
    label: "Adult (20-39)",
    value: 9,
    color: "hsl(34, 70%, 50%)",
  },
  {
    id: "Old (60 and above)",
    label: "Old (60 and above)",
    value: 4,
    color: "hsl(104, 70%, 50%)",
  },
  {
    id: "Middle-Age (40-59)",
    label: "Middle-Age (40-59)",
    value: 8,
    color: "hsl(56, 70%, 50%)",
  },
 
];





export const mockLineData = [
  {
    id: "total",
    color: tokens("dark").greenAccent[500],
    data: [
      { x: "2005", y: 101 },
      { x: "2006", y: 75 },
      { x: "2007", y: 36 },
      { x: "2008", y: 216 },
      { x: "2009", y: 35 },
      { x: "2010", y: 236 },
      { x: "2011", y: 88 },
      { x: "2012", y: 232 },
      { x: "2013", y: 281 },
      { x: "2014", y: 1 },
      { x: "2015", y: 35 },
      { x: "2016", y: 14 },
    ],
  },
  {
    id: "male",
    color: tokens("dark").blueAccent[300],
    data: [
      { x: "2005", y: 212 },
      { x: "2006", y: 190 },
      { x: "2007", y: 270 },
      { x: "2008", y: 9 },  // Adjusted from repeated 2009
      { x: "2009", y: 75 }, // Unique year
      { x: "2010", y: 175 },
      { x: "2011", y: 33 },
      { x: "2012", y: 189 },
      { x: "2013", y: 97 },
      { x: "2014", y: 87 },
      { x: "2015", y: 299 },
      { x: "2016", y: 251 },
    ],
  },
  {
    id: "female",
    color: tokens("dark").redAccent[200],
    data: [
      { x: "2005", y: 211 },
      { x: "2006", y: 152 },
      { x: "2007", y: 189 },
      { x: "2008", y: 191 },
      { x: "2009", y: 136 },
      { x: "2010", y: 91 },
      { x: "2011", y: 190 },
      { x: "2012", y: 152 },
      { x: "2013", y: 8 },
      { x: "2014", y: 197 },
      { x: "2015", y: 107 },
      { x: "2016", y: 170 },
    ],
  },
];



