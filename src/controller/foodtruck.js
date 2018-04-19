import { Router } from 'express';
import FoodTruck from '../model/foodtruck';
import Review from '../model/review';
import { authenticate } from '../middleware/authMiddleware';

export default({ config, db }) => {
  let api = Router();

  // '/v1/foodtruck/add'
  api.post('/add', authenticate, (req, res) => {
    let newfood = new FoodTruck();
    newfood.name = req.body.name;
    newfood.foodtype = req.body.foodtype;
    newfood.avgcost = req.body.avgcost;
    newfood.geometry.coordinates = req.body.geometry.coordinates;
    newfood.save(function(err) {
      if (err) {
        res.send(err);
      }
      res.json({ message: 'FoodTruck saved successfully' });
    });
  });

  // '/v1/foodtruck/' -- Get all Restaurants
  api.get('/', (req, res) => {
    FoodTruck.find({}, (err, foodtrucks) => {
      if (err) {
        res.send(err);
      }
      res.json(foodtrucks);
    });
  });

  // '/v1/foodtruck/:id' -- Get Restaurant By Id
  api.get('/:id', (req, res) => {
    FoodTruck.findById(req.params.id, (err, foodtruck) => {
      if (err) {
        res.send(err);
      }
      res.json(foodtruck);
    });
  });

  // '/v1/foodtruck/:id' -- Update
  api.put('/:id',authenticate, (req, res) => {
    FoodTruck.findById(req.params.id, (err,foodtruck) => {
      if(err){
        res.send(err);
      }
      foodtruck.name = req.body.name;
      foodtruck.foodtype = req.body.foodtype;
      foodtruck.avgcost = req.body.avgcost;
      foodtruck.geometry.coordinates = req.body.geometry.coordinates;
      foodtruck.save(function(err) {
        if (err) {
          res.send(err);
        }
        res.json({ message: 'FoodTruck Updated successfully' });
      });
    });
  });

  // '/v1/foodtruck/:id' -- Delete
  api.delete('/:id', authenticate, (req, res) => {
    FoodTruck.remove({
      _id: req.params.id
    }, (err) => {
      if (err) {
        res.send(err);
      }
      Review.find({foodtruck: req.params.id}).remove((err, reviews) => {
        if(err){
          res.send(err);
        }
          res.json({ message: 'FoodTruck Removed successfully' });
      });
    });
  });

  //Add Review for specefic foodtruck id
  //'v1/foodtruck/reviews/add/:id'
  api.post('/reviews/add/:id', authenticate, (req, res) => {
    FoodTruck.findById(req.params.id, (err,foodtruck) => {
      if(err || !foodtruck){
        if(!foodtruck)
          res.send({});
        else
          res.send(err);
      } else {
      let newReview = new Review();
      newReview.title = req.body.title;
      newReview.text = req.body.text;
      newReview.foodtruck = foodtruck._id;
      newReview.save(function(err1, review) {
        if (err1) {
          res.send(err);
        }
        foodtruck.reviews.push(review);
        foodtruck.save(function(err2) {
          if (err2) {
            res.send(err);
          }
          res.json({ message: 'FoodTruck Review saved successfully' });
        });
      });
    }
    });
  });

  //Get All reviews for a specific FoodTruck
  api.get('/reviews/:id', (req, res) => {
    Review.find({foodtruck: req.params.id}, (err, reviews) => {
      if(err){
        res.send(err);
      }
      res.json(reviews);
    });
  });

// Get foodtruck by type ‘/v1/foodtruck/foodtype/:foodtype’.
  api.get('/foodtype/:type', (req, res) => {
    FoodTruck.find({foodtype: req.params.type}, (err, foodtrucks) => {
      if (err) {
        res.send(err);
      }
      res.json(foodtrucks);
    });
  });

  return api;
}
