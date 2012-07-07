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
      /* ensuring instantiation */
      var instance = new library(o);
      return instance;
    }
    if ((typeof o.read_func != 'function') || (typeof o.write_func != 'function')) {
      /* needs functions to read from and to write data to. implemented by consumer. */
      throw new TypeError("'init' requires an object with read_func and write_func.");
    }

    this.o = o;

    /* initial empty store */
    this.undoarray = [];
    this.redoarray = [];

    this.init();
  };

  library.fn = library.prototype = {
    init: function () {
      if (isNaN(this.o.limit) || !this.o.limit) {
        /* snapshots of bigger texts are memory heavy, especially in browser */
        /* user can do with a smaller limit of undo/redo */
        this.o.limit = 3;
      }
      this.save();
    },

    get_array: function (t) {
      return t=='r' ? this.redoarray : this.undoarray;
    },

    /* consumer calls save when it expects to save snapshots */
    save: function (t) {
      var array = this.get_array(t);
      var data = this.o.read_func();
      if (array[array.length - 1] === data) {} else {
        if (this.o.limit === array.length) {
          /* discarding when off-limit */
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

    /* undo/redo methods. called from consumer */
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
