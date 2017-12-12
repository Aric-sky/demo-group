'use strict';


let stu1 = 'lilei';
let stu2 = 'hmm';
//1、模板字符串

// let sentence1 = '今天'+stu1+'和'+stu2+'是一起来上学的';
// let sentence2 = `今天${stu1}和${stu2}是一起来上学的`;

// console.log(sentence1);

//2、标签函数
// let sentence = members`今天${stu1}和${stu2}又是一起来上学的`;
// function members(string, ...value){ //标签函数
// 	console.log(string);
// 	console.log(value);
// }

//3、字符串方法 startsWith/endsWith/includes
let data = 'abcdefg';
console.log(data.startsWith('a'));
console.log(data.endsWith('a'));
console.log(data.includes('a'));