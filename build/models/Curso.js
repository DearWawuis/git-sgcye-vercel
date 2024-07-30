"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _mongoose = require("mongoose");
// Definir el esquema del curso
var cursoSchema = new _mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  category: {
    type: _mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  }
}, {
  timestamps: true,
  versionKey: false
});

// Exportar el modelo
var _default = exports["default"] = (0, _mongoose.model)('Curso', cursoSchema);