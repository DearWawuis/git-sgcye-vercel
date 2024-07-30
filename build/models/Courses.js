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
  description: {
    type: String
  },
  division: {
    type: _mongoose.Schema.Types.ObjectId,
    ref: 'Division',
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    required: true
  },
  professor: {
    type: _mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  students: [{
    type: _mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true,
  // Esto agregará createdAt y updatedAt automáticamente
  versionKey: false
});

// Exportar el modelo
var _default = exports["default"] = (0, _mongoose.model)('Course', cursoSchema);