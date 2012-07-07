/* undomanager
 * https://github.com/simplyharsh/UndoManager
 *
 * by Harsh Kohli <simplyharsh@gmail.com>
 * copyright simplyharsh;
 */

var UndoManager = (function () {

  var library = function (o) {
    if (o === undefined) {
      o = {};
    }
    if (!(this instanceof library)) {
      var instance = new library(o);
      return instance;
    }
    if ((typeof o.read_func != 'function') || (typeof o.write_func != 'function')) {
      throw new TypeError("'init' requires an object with read_func and write_func.");
    }

    this.o = o;
    this.undoarray = [];
    this.redoarray = [];
    this.init();
  };

  library.fn = library.prototype = {
    init: function () {
      if (isNaN(this.o.limit) || !this.o.limit) {
        this.o.limit = 3;
      }
      this.save();
    },

    get_array: function (t) {
      return t=='r' ? this.redoarray : this.undoarray;
    },

    save: function (t) {
      var array = this.get_array(t);
      var data = this.o.read_func();
      if (array[array.length - 1] === data) {} else {
        if (this.o.limit === array.length) {
          array = array.slice(1);
          if (t == 'r') {
            this.redoarray = array;
          } else {
            this.undoarray = array;
          }
        }
        array.push(data);
      }
    },

    undo: function () {
      var array = this.get_array();
      if (array.length) {
        this.save('r');
        this.o.write_func(array.pop());
      }
    },

    redo: function () {
      var array = this.get_array('r');
      if (array.length) {
        this.save();
        this.o.write_func(array.pop());
      }
    }
  };

  return library;

})();
