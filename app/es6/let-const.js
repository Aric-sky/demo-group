"use strict";

//let 的作用域在其定义的块级作用域内部
if (true) {
	var wds = 123;
	// let wds = 123;

}

console.log(wds);





// const 声明常量,限制给常量分配值的动作，不针对常量的值

//1
// const flower = '菊花';
// console.log(flower);


// flower = '百合';

//2
// const flower = [];
// flower.push('item1');
// flower.push('item2');
// console.log(flower);

