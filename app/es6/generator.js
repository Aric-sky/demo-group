'use strict';

let chef = function* (foods){
  for(let i =0; i <foods.length; i++){
    yield foods[i];
  }
}

let arr = chef(['pipi', 'xixi']);

console.log(arr.next())





