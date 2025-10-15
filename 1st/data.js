// nodejs > 1st > data.js, module 기능. : 다른 js에서 참조가능한 객체,함수를 지정해서 export할수있음, 살짝 접근제한자 조상님같은개념인듯
const studentsAry = [
  { sno: 100, sname: "람썬", score: 80 },
  { sno: 200, sname: "람w쥐", score: 57 },
  { sno: 300, sname: "썬!더쥐", score: 77 },
  { sno: 400, sname: "쥐g쥐", score: 92 },
];

const sum = (a, b) => a + b;

const PI = 3.14;

const getStudentInfo = () => {
  return ["rmaG", "TETO-Nam", "e-GenNam", "TT"];
};
let jsonString = `
[{"id":1,"first_name":"Jerald","last_name":"Mazella","email":"jmazella0@deviantart.com","gender":"Male","salary":4338},
{"id":2,"first_name":"Marlie","last_name":"Aldersley","email":"maldersley1@cpanel.net","gender":"Female","salary":9141},
{"id":3,"first_name":"Ulrike","last_name":"Callis","email":"ucallis2@examiner.com","gender":"Female","salary":6176},
{"id":4,"first_name":"Bel","last_name":"Andreassen","email":"bandreassen3@utexas.edu","gender":"Female","salary":5005},
{"id":5,"first_name":"Cathyleen","last_name":"Garham","email":"cgarham4@washingtonpost.com","gender":"Female","salary":3886},
{"id":6,"first_name":"Walton","last_name":"Wisedale","email":"wwisedale5@si.edu","gender":"Male","salary":3158},
{"id":7,"first_name":"Dacy","last_name":"Spurden","email":"dspurden6@mysql.com","gender":"Female","salary":8878},
{"id":8,"first_name":"Luise","last_name":"Quittonden","email":"lquittonden7@last.fm","gender":"Female","salary":7218},
{"id":9,"first_name":"Corty","last_name":"McArte","email":"cmcarte8@spiegel.de","gender":"Male","salary":9568},
{"id":10,"first_name":"Rory","last_name":"Ilewicz","email":"rilewicz9@google.com","gender":"Female","salary":8379},
{"id":11,"first_name":"Susannah","last_name":"Rafferty","email":"sraffertya@pinterest.com","gender":"Female","salary":9589},
{"id":12,"first_name":"Duane","last_name":"Demangeon","email":"ddemangeonb@hubpages.com","gender":"Male","salary":5016},
{"id":13,"first_name":"Kermie","last_name":"Cockett","email":"kcockettc@reuters.com","gender":"Male","salary":9961},
{"id":14,"first_name":"Aluin","last_name":"Robertsson","email":"arobertssond@eventbrite.com","gender":"Male","salary":4688},
{"id":15,"first_name":"Franz","last_name":"Delagua","email":"fdelaguae@sun.com","gender":"Male","salary":4515}]
`;
export { studentsAry, sum, PI, getStudentInfo, jsonString };
