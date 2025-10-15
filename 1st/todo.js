// nodejs > 1st > todo.js
import { jsonString } from "./data.js";

// console.table(JSON.parse(jsonString));
// console.log(JSON.parse(jsonString));
// reduce 출력: Female fn + ln => id, fullName, email, salary

// {
//   id: 1,
//   first_name: 'Jerald',
//   last_name: 'Mazella',
//   email: 'jmazella0@deviantart.com',
//   gender: 'Male',
//   salary: 4338
// }
const femaleAry = (acc, elem, idx, ary) => {
  // console.log(`acc: ${acc}, elem: ${elem.gender}`);
  if (elem.gender == "Female") {
    acc.push(elem);
  }
  return acc;
};
const maleAry = (acc, elem, idx, ary) => {
  // console.log(`acc: ${acc}, elem: ${elem.gender}`);
  if (elem.gender != "Female") {
    acc.push(elem);
  }
  return acc;
};
let resultAry = JSON.parse(jsonString).reduce(femaleAry, []);

let gg = resultAry.map((item) => {
  // console.log("이게바로 item: ", item);
  let { id, first_name: fullName, email, salary } = item;
  fullName = item.first_name + item.last_name;
  return { id, fullName, email, salary };
});
console.table(gg);

resultAry = JSON.parse(jsonString).reduce(maleAry, []);
gg = resultAry.map((item) => {
  let { id, first_name: fullName, email, salary } = item;
  fullName = item.first_name + item.last_name;
  return { id, fullName, email, salary };
});
console.table(gg);

// Female
console.clear();
let rary = JSON.parse(jsonString).reduce(
  (acc, { id, first_name, last_name, email, gender, salary }) => {
    if (gender === "Female") {
      acc.push({ id, fullName: first_name + " " + last_name, email, salary });
    }
    return acc;
  },
  []
);
console.table(rary);

console.log(`\n 뭔데씨발그래서대체 \n`);
rary = JSON.parse(jsonString).reduce((acc, elem) => {
  const key = elem["gender"];
  if (!acc[key]) {
    acc[key] = [];
  }
  acc[key].push(elem.first_name);
  return acc;
}, {});
console.table(rary);
