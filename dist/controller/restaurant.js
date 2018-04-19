'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _restaurant = require('../model/restaurant');

var _restaurant2 = _interopRequireDefault(_restaurant);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
  var config = _ref.config,
      db = _ref.db;

  var api = (0, _express.Router)();

  // '/v1/restaurant/add'
  api.post('/add', function (req, res) {
    var newRest = new _restaurant2.default();
    newRest.name = req.body.name;

    newRest.save(function (err) {
      if (err) {
        res.send(err);
      }
      res.json({ message: 'Restaurant saved successfully' });
    });
  });

  // '/v1/restaurant/' -- Get all Restaurants
  api.get('/', function (req, res) {
    _restaurant2.default.find({}, function (err, restaurants) {
      if (err) {
        res.send(err);
      }
      res.json(restaurants);
    });
  });

  // '/v1/restaurant/:id' -- Get Restaurant By Id
  api.get('/:id', function (req, res) {
    _restaurant2.default.findById(req.params.id, function (err, restaurant) {
      if (err) {
        res.send(err);
      }
      res.json(restaurant);
    });
  });

  return api;
};
//# sourceMappingURL=restaurant.js.map