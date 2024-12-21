const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const MONGO_URL = "mongodb://localhost:27017/stayscape";

main()
  .then(() => {
    console.log("Connected To Db");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

app.get("/", (req, res) => {
  res.send("Hii, I Am Root");
});

// Index Route
app.get("/listings", async (req, res) => {
  try {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings }); // Render the index.ejs view with all listings
  } catch (err) {
    res.status(500).send("Error retrieving listings: " + err.message);
  }
});

//New Route
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs"); // Placeholder response
});

//Show Route
app.get("/listings/:id", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/show", { listing });
});

//Create route
app.post("/listings", async (req, res) => {
  const newListing = new Listing(req.body.listing);
  await newListing.save();
  res.redirect("/listings");
});

//Edit route
app.get("/listings/:id/edit", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
});

//Update Route
app.put("/listings/:id", async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  res.redirect(`/listings/${id}`);
});

// Delete Route
app.delete("/listings/:id", async (req, res) => {
  let { id } = req.params;
  try {
    // Use the correct model and method to delete the listing
    const deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings"); // Redirect to the listings page after deleting
  } catch (err) {
    res.status(500).send("Error deleting listing: " + err.message);
  }
});
// Uncomment this to test creating a new listing
// app.get("/testListing", async (req, res) => {
//   let sampleListing = new Listing({
//     title: "My New Villa",
//     description: "By The Beach",
//     price: 1200,
//     location: "Calangute,Goa",
//     country: "India",
//   });

//   await sampleListing.save();
//   console.log("sample was Saved");
//   res.send("Successful test");
// });

app.listen(8080, () => {
  console.log("Server running on port 8080");
});
