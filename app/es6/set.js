'use strict';

let desserts = new Set('abcd');

desserts.add('e');
desserts.add('f');

console.log(desserts);
console.log(desserts.size)
console.log(desserts.has('f'));

desserts.delete('e');
console.log(desserts);

desserts.forEach(desserts => {
  console.log(desserts)
});

desserts.clear();
console.log(desserts)