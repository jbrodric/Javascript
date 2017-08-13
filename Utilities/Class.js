/**
 * Class.js
 * Description: a module of utilities for creating classes
 * Author: John Brodrick
 * Date: 8/13/2017
 * Namespace: JohnBrodrick.Utilities.Class (will add this symbol to global ns if not present)
 * Dependencies: Module.js
 *
 * Notes: Some of the following code is from the book JavaScript: The Definitive Guide,
 * 5th Edition, by David Flanagan. Copyright 2006 O'Reilly Media, Inc.
 * (ISBN: 0596101996). https://resources.oreilly.com/examples/9780596101992/tree/master
 */

// Ensure the module utility has been loaded.  Obviously we can't use it's require utility if it
// hasn't been loaded yet
if (!JohnBrodrick || !JohnBrodrick.Utilities || !JohnBrodrick.Utilities.Module 
	|| typeof JohnBrodrick.Utilities.Module != "object" ||
	!JohnBrodrick.Utilities.Module.NAME)
    throw new Error("Module utility has not been loaded");

// Further check name and version of the module utility to ensure it is appropriate
// No need to import symbols here, we will just use the fully qualified names of the methods
JohnBrodrick.Utilities.Module.require('Module', .1);

// Create our namespace
JohnBrodrick.Utilities.Module.createNamespace('JohnBrodrick.Utilities.Class', 1);

// This is the list of public symbols that we export from this namespace.
JohnBrodrick.Utilities.Class.EXPORT = ['extend', 'borrowMethods', 'GenericToString', 'GenericEquals'];

// These are other symbols we are willing to export.
JohnBrodrick.Utilities.Class.EXPORT_OK = [];

/**
 *	Extend - used to setup an inheritance hierarchy
 *  Usage: extend(Child Constructor Fn, Parent Constructor fn)
 */
JohnBrodrick.Utilities.Class.extend = function(Child, Parent)
{
	Child.prototype = JohnBrodrick.Utilities.Class.inherit(Parent.prototype);
	Child.prototype.constructor = Child;
	Child.parent = Parent.prototype;
}

/**
 *  Inherit - helper function for extend above.
 */
JohnBrodrick.Utilities.Class.inherit = function(proto)
{
	function F() {}
	F.prototype = proto;
	return new F();
}

// Borrow methods from one class for use by another.
// The arguments should be the constructor functions for the classes
// Methods of built-in types such as Object, Array, Date and RegExp are
// not enumerable and cannot be borrowed with this method.
JohnBrodrick.Utilities.Class.borrowMethods = function(borrowFrom, addTo) {
    var from = borrowFrom.prototype;  // prototype object to borrow from
    var to = addTo.prototype;         // prototype object to extend

    for(m in from) {  // Loop through all properties of the prototye
        if (typeof from[m] != "function") continue; // ignore nonfunctions
        to[m] = from[m];  // borrow the method
    }
}

// This class isn't good for much on its own. But it does define a
// generic toString() method that may be of interest to other classes.
JohnBrodrick.Utilities.Class.GenericToString = function() {}
JohnBrodrick.Utilities.Class.GenericToString.prototype.toString = function() {
    var props = [];
    for(var name in this) {
        if (!this.hasOwnProperty(name)) continue;
        var value = this[name];
        var s = name + ":" 
        switch(typeof value) {
        case 'function':
            s += "function";
            break;
        case 'object':
            if (value instanceof Array) s += "array"
            else s += value.toString();
            break;
        default:
            s += String(value);
            break;
        }
        props.push(s);
    }
    return "{" + props.join(", ") + "}";
}

// This mixin class defines an equals() method that can compare
// simple objects for equality.
JohnBrodrick.Utilities.Class.GenericEquals = function() {}
JohnBrodrick.Utilities.Class.GenericEquals.prototype.equals = function(that) {
    if (this == that) return true;
    
    // this and that are equal only if this has all the properties of 
    // that and doesn't have any additional properties
    // Note that we don't do deep comparison.  Property values
    // must be === to each other.  So properties that refer to objects
    // must refer to the same object, not objects that are equals()
    var propsInThat = 0;
    for(var name in that) {
        propsInThat++;
        if (this[name] !== that[name]) return false;
    }

    // Now make sure that this object doesn't have additional props
    var propsInThis = 0;
    for(name in this) propsInThis++;
    
    // If this has additional properties then they are not equal
    if (propsInThis != propsInThat) return false;

    // The two objects appear to be equal.
    return true;
}
