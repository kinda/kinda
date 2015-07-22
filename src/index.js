'use strict';

let KindaClass = {
  _name: 'KindaClass',

  constructor() {},

  extend(name, version, constructor) {
    if (typeof name !== 'string') {
      constructor = version;
      version = name;
      name = 'Sub' + this._name;
    }

    if (typeof version !== 'string') {
      constructor = version;
      version = undefined;
    }

    let parent = this;
    let child = {
      _name: name,
      _version: version
    };

    // Copy class properties
    let keys = Object.getOwnPropertyNames(parent);
    for (let key of keys) {
      if (key.startsWith('_')) continue; // Don't copy property starting with a '_'
      let descriptor = Object.getOwnPropertyDescriptor(parent, key);
      Object.defineProperty(child, key, descriptor);
    }

    child.constructor = function() {
      this.include(parent);
      if (!constructor) return;
      if (typeof constructor === 'function') {
        constructor.call(this);
      } else {
        let constructorKeys = Object.getOwnPropertyNames(constructor);
        for (let key of constructorKeys) {
          let descriptor = Object.getOwnPropertyDescriptor(constructor, key);
          Object.defineProperty(this, key, descriptor);
        }
      }
    };

    return child;
  },

  get name() {
    return this._name;
  },

  get version() {
    return this._version;
  },

  get prototype() {
    if (!this._prototype) {
      this._prototype = this.constructPrototype();
    }
    return this._prototype;
  },

  instantiate() {
    return Object.create(this.prototype);
  },

  isClassOf(instance) {
    return !!(instance && instance.isInstanceOf && instance.isInstanceOf(this));
  },

  isKindaClass: true,

  constructPrototype() {
    let currentClass = this; // eslint-disable-line consistent-this
    let superclasses = [];

    let prototype = {
      get class() {
        return currentClass;
      },

      get superclasses() {
        return superclasses;
      },

      get prototype() {
        return prototype;
      },

      include(other) {
        // if (superclasses.indexOf(other) !== -1) return this;
        let isAlreadyIncluded = superclasses.some(klass => {
          return klass.name === other.name;
        });
        if (isAlreadyIncluded) return this;
        other.constructor.call(this);
        superclasses.push(other);
        return this;
      },

      isInstanceOf(klass) {
        // return klass === currentClass || superclasses.indexOf(klass) !== -1;
        if (currentClass.name === klass.name) return true;
        return superclasses.some(superclass => superclass.name === klass.name);
      }
    };

    this.constructor.call(prototype);

    return prototype;
  }
};

module.exports = KindaClass;
