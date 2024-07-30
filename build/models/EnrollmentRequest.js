"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _mongoose = require("mongoose");
// Definición del esquema para las solicitudes de inscripción
var EnrollmentRequestSchema = new _mongoose.Schema({
  course: {
    type: _mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  student: {
    type: _mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    "enum": ['pending', 'approved', 'rejected'],
    "default": 'pending'
  },
  createdAt: {
    type: Date,
    "default": Date.now
  }
});
var _default = exports["default"] = (0, _mongoose.model)('EnrollmentRequest', EnrollmentRequestSchema);