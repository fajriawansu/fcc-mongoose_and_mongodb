require("dotenv").config();

//1. Install and Set Up Mongoose
//Add mongodb and mongoose to the project’s package.json --> npm install both of them
let uri =
  "mongodb+srv://user1:" +
  process.env.PW +
  "@cluster0.yumiu.mongodb.net/db1?retryWrites=true&w=majority";
//When you are done, connect to the database using the following syntax:
//mongoose.connect(<Your URI>, { useNewUrlParser: true, useUnifiedTopology: true });
let mongoose = require("mongoose");
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

//2. Create a Model - CRUD I
//Create a person schema called personSchema having this prototype:
// - Person Prototype -
// --------------------
// name : string [required]
// age :  number
// favoriteFoods : array of strings (*)
// Use the Mongoose basic schema types. If you want you can also add more fields,
//use simple validators like required or unique, and set default values. See the Mongoose docs.
//solution:

let peopleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: Number,
  favoriteFoods: [String]
});

let Person = mongoose.model("Person", peopleSchema);
//coba uncomment di bawah ini, lalu jalankan terminal dan tulis: node myApp.js
// let dave = new Person({
//   name: "Dave",
//   age: 22,
//   favoriteFoods: ["Pizza", "Chips"]
// });
// console.log(dave);

//3. Create and Save a Record of a Model
//Within the createAndSavePerson function, create a document instance using the Person model constructor you built before.
//Pass to the constructor an object having the fields name, age, and favoriteFoods. Their types must conform to the ones
//in the personSchema. Then, call the method document.save() on the returned document instance.
//Pass to it a callback using the Node convention. This is a common pattern;
//all the following CRUD methods take a callback function like this as the last argument.

// /* Example */

// // ...
// person.save(function(err, data) {
//   //   ...do your stuff here...
// });

const createAndSavePerson = done => {
  let fajriawan = new Person({
    name: "Fajriawan",
    age: 22,
    favoriteFoods: ["Pizza", "Bengbeng"]
  });
  fajriawan.save((error, data) => {
    if (error) {
      console.log(error);
    } else {
      done(null, data);
    }
  });
  //done(null /*, data*/);
};

//4. Create Many Records with model.create()
//Sometimes you need to create many instances of your models,
//e.g. when seeding a database with initial data. Model.create()
//takes an array of objects like [{name: 'John', ...}, {...}, ...] as the first argument, and saves them all in the db.

//Modify the createManyPeople function to create many people using Model.create() with the argument arrayOfPeople.
//biar bisa jalan comment out dulu nomor 3

let arrayOfPeople = [
  { name: "Dimas", age: 23, favoriteFoods: ["Del Taco"] },
  { name: "Ucok", age: 21, favoriteFoods: ["roast chicken"] },
  { name: "Yasuo", age: 24, favoriteFoods: ["wine"] }
];

const createManyPeople = (arrayOfPeople, done) => {
  Person.create(arrayOfPeople, (error, createdPeople) => {
    if (error) {
      console.log(error);
    } else {
      done(null, createdPeople);
    }
  });

  //done(null /*, data*/);
};

//Use model.find() to Search Your Database
//In its simplest usage, Model.find() accepts a query document (a JSON object) as the first argument, then a callback.
//It returns an array of matches. It supports an extremely wide range of search options. Read more in the docs.

//Modify the findPeopleByName function to find all the people having a given name, using Model.find() -> [Person]
//Use the function argument personName as the search key.

//ini contoh, coba aja jalanin node myApp.js, nanti akan otomatis tampilin db sesuai input
// Person.find({name: "Kris", age: 42}, (error, data) => {
//   if (error) {
//     console.log(error);
//   } else {
//     console.log(data);
//   }
// });
//nah ini jawabannya untuk no5
const findPeopleByName = (personName, done) => {
  Person.find({ name: personName }, (error, arrayOfResults) => {
    if (error) {
      console.log(error);
    } else {
      done(null, arrayOfResults);
    }
  });

  //done(null /*, data*/);
};

//6. Use model.findOne() to Return a Single Matching Document from Your Database
//Model.findOne() behaves like Model.find(), but it returns only one document (not an array),
//even if there are multiple items. It is especially useful when searching by properties that you have declared as unique.
//intinya, kalau match banyak, yang ditampilin cuma array index 0 aja. atau yang paling atas di db
//ini contoh, coba jalanin di terminal

Person.findOne({ favoriteFoods: { $all: ["prawns"] } }, (error, data) => {
  if (error) {
    console.log(error);
  } else {
    console.log(data);
  }
});

const findOneByFood = (food, done) => {
  Person.findOne({ favoriteFoods: { $all: [food] } }, (error, data) => {
    if (error) {
      console.log(error);
    } else {
      done(null, data);
    }
  });
  //done(null /*, data*/);
};

//7. Use model.findById() to Search Your Database By _id
//When saving a document, MongoDB automatically adds the field _id, and set it to a unique alphanumeric key.
//Searching by _id is an extremely frequent operation, so Mongoose provides a dedicated method for it.
//Modify the findPersonById to find the only person having a given _id,
//using Model.findById() -> Person. Use the function argument personId as the search key.

const findPersonById = (personId, done) => {
  Person.findById(personId, (error, data) => {
    if (error) {
      console.log(error);
    } else {
      done(null, data);
    }
  });
  //done(null /*, data*/);
};

//8. Perform Classic Updates by Running Find, Edit, then Save
//Modify the findEditThenSave function to find a person by _id (use any of the above methods)
//with the parameter personId as search key. Add "hamburger" to the list of the person's favoriteFoods (you can use Array.push()).
//Then - inside the find callback - save() the updated Person.

//Note: This may be tricky, if in your Schema, you declared favoriteFoods as an Array,
//without specifying the type (i.e. [String]). In that case, favoriteFoods defaults to Mixed type,
//and you have to manually mark it as edited using document.markModified('edited-field').

const findEditThenSave = (personId, done) => {
  const foodToAdd = "hamburger";

  // .findById() method to find a person by _id with the parameter personId as search key.
  Person.findById(personId, (error, result) => {
    if (error) return console.log(error);

    // Array.push() method to add "hamburger" to the list of the person's favoriteFoods
    result.favoriteFoods.push(foodToAdd);

    // and inside the find callback - save() the updated Person.
    result.save((error, updatedPerson) => {
      if (error) return console.log(error);
      done(null, updatedPerson);
    });
  });

  //done(null /*, data*/);
};

//9. Perform New Updates on a Document Using model.findOneAndUpdate()
//Recent versions of Mongoose have methods to simplify documents updating.
//Some more advanced features (i.e. pre/post hooks, validation) behave differently with this approach,
//so the classic method is still useful in many situations. findByIdAndUpdate() can be used when searching by id.

//Modify the findAndUpdate function to find a person by Name and set the person's age to 20.
//Use the function parameter personName as the search key.

//Note: You should return the updated document. To do that, you need to pass the options document { new: true }
//as the 3rd argument to findOneAndUpdate(). By default, these methods return the unmodified object.

//findOneAndUpdate uses ( conditions , update , options , callback ) as arguments.

const findAndUpdate = (personName, done) => {
  const ageToSet = 20;
  Person.findOneAndUpdate(
    { name: personName },
    { age: ageToSet },
    { new: true },
    (error, updatedDocument) => {
      if (error) return console.log(error);
      done(null, updatedDocument);
    }
  );
  //done(null /*, data*/);
};

//10. Delete One Document Using model.findByIdAndRemove
//findByIdAndRemove and findOneAndRemove are like the previous update methods.
//They pass the removed document to the db. As usual, use the function argument personId as the search key.

//Modify the removeById function to delete one person by the person's _id.
//You should use one of the methods findByIdAndRemove() or findOneAndRemove().

const removeById = (personId, done) => {
  Person.findByIdAndRemove(personId, (error, removeDocument) => {
    if (error) return console.log(error);
    done(null, removeDocument);
  });

  //done(null /*, data*/);
};

//11.Delete Many Documents with model.remove()
//Model.remove() is useful to delete all the documents matching given criteria.

//Modify the removeManyPeople function to delete all the people whose name is within the variable nameToRemove,
//using Model.remove(). Pass it to a query document with the name field set, and a callback.

//Note: The Model.remove() doesn’t return the deleted document, but a JSON object containing the outcome of the operation,
//and the number of items affected. Don’t forget to pass it to the done() callback, since we use it in tests.

const removeManyPeople = done => {
  const nameToRemove = "Mary";

  Person.remove({ name: nameToRemove }, (error, removeSuccess) => {
    if (error) return console.log(error);
    done(null, removeSuccess);
  });
  //done(null /*, data*/);
};

//12.Chain Search Query Helpers to Narrow Search Results


const queryChain = done => {
  const foodToSearch = "burrito";
  
  Person.find({ favoriteFoods: {$all: [foodToSearch]}}) //mencari semua favoriteFoods yang ada burrito
  .sort({ name: 'asc' }) //hasil pencariannya diurutkan berdasarkan nama: sort ascending
  .limit(2) //cuma menampilkan 2 data/dokumen pertama
  .select({ age: 0 }) //menyembunyikan age, karena 0 maka hide, kalau 1 dia nampilin
  .exec((error, filteredResults) => { //setelah di eksekusi, apa yang ingin dilakukan?
    if(error) return console.log(error);
    done(null, filteredResults)
  });
  //done(null /*, data*/);
};

/** **Well Done !!**
/* You completed these challenges, let's go celebrate !
 */

//----- **DO NOT EDIT BELOW THIS LINE** ----------------------------------

exports.PersonModel = Person;
exports.createAndSavePerson = createAndSavePerson;
exports.findPeopleByName = findPeopleByName;
exports.findOneByFood = findOneByFood;
exports.findPersonById = findPersonById;
exports.findEditThenSave = findEditThenSave;
exports.findAndUpdate = findAndUpdate;
exports.createManyPeople = createManyPeople;
exports.removeById = removeById;
exports.removeManyPeople = removeManyPeople;
exports.queryChain = queryChain;
