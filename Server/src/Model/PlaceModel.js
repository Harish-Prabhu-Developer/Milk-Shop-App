import mongoose from "mongoose";

// Route subdocument schema
const RouteSchema = new mongoose.Schema({
  "Route type": {
    type: String,
    enum: ["ROUTE 1", "ROUTE 2", "ROUTE 3", "ADDITIONAL"],
    default: "ROUTE 1",

  },
  "Branch Name": {
    type: String,
  },
});

// Place schema
const PlaceSchema = new mongoose.Schema(
  {
    RouteGroup: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["COMPANY VEHICLE", "PRIVATE VEHICLE", "CUSTOMER VEHICLE"],
      default: "COMPANY VEHICLE",
    },
    location: {
      type: String,
      required: true,
    },
    distance: {
      type: String, // keep as string since frontend expects "99km"
    },
    Route: [RouteSchema],
  },
  { timestamps: true }
);

const PlaceModel = mongoose.model("Place", PlaceSchema);
export default PlaceModel;
