"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _mongoose = require("mongoose");
// Definir el esquema del estudiante
var estudianteSchema = new _mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  lname: {
    type: String,
    required: true
  },
  division: {
    type: _mongoose.Schema.Types.ObjectId,
    ref: 'Division',
    required: true
  },
  age: {
    type: Number,
    required: true
  }
}, {
  timestamps: true,
  versionKey: false
});

// Exportar el modelo
var _default = exports["default"] = (0, _mongoose.model)('Estudiante', estudianteSchema);