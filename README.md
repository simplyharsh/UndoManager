UndoManager
===========

A simple UndoManager, that keeps snapshot of texts


```javascript
/* node test */
var options = {
  read_func: function() {
    console.log('manager reading data');
    return 'data1';
  },
  write_func: function(data){
    console.log('manager settings data', data);
  }
};

var a = UndoManager(options);

console.log();
console.log(a);
a.undo();
console.log(a);
a.undo();
console.log(a);
a.redo();
console.log(a);
a.redo();
console.log(a);
```
