// controllers/placeController.js
import PlaceModel from "../Model/PlaceModel.js";

// ✅ Create new Place
export const createPlace = async (req, res) => {
  try {
    const { RouteGroup, type, location, distance, Route } = req.body;

    const newPlace = new PlaceModel({
      RouteGroup,
      type,
      location,
      distance,
      Route,
    });

    await newPlace.save();
    res.status(201).json({msg: "Place created successfully", place: newPlace});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get all Places
export const getPlaces = async (req, res) => {
  try {
    const places = await PlaceModel.find();
    res.status(200).json(places);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get Place by ID
export const getPlaceById = async (req, res) => {
  try {
    const place = await PlaceModel.findById(req.params.id);
    if (!place) return res.status(404).json({ msg: "Place not found" });
    res.status(200).json(place);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Update Place
export const updatePlace = async (req, res) => {
  try {
    const place = await PlaceModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!place) return res.status(404).json({ msg: "Place not found" });
    res.status(200).json({msg: "Place updated successfully", place});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Delete Place
export const deletePlace = async (req, res) => {
  try {
    const place = await PlaceModel.findByIdAndDelete(req.params.id);
    if (!place) return res.status(404).json({ msg: "Place not found" });
    res.status(200).json({ msg: "Place deleted successfully",place });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Add Route to Place
export const addRoute = async (req, res) => {
  try {
    const { placeId } = req.params; // Place ID
    const { "Route type": routeType, "Branch Name": branchName } = req.body;

    const place = await PlaceModel.findById(placeId);
    if (!place) return res.status(404).json({ msg: "Place not found" });

    place.Route.push({
      "Route type": routeType,
      "Branch Name": branchName,
    });

    await place.save();
    res.status(200).json({msg: "Route added successfully", place});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Update Route in Place
export const updateRoute = async (req, res) => {
  try {
    const { placeId, routeId } = req.params;
    const { "Route type": routeType, "Branch Name": branchName } = req.body;

    const place = await PlaceModel.findById(placeId);
    if (!place) return res.status(404).json({ msg: "Place not found" });

    const route = place.Route.id(routeId);
    if (!route) return res.status(404).json({ msg: "Route not found" });

    if (routeType) route["Route type"] = routeType;
    if (branchName) route["Branch Name"] = branchName;

    await place.save();
    res.status(200).json({msg: "Route updated successfully", place});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Remove Route from Place
export const removeRoute = async (req, res) => {
  try {
    const { placeId, routeId } = req.params;

    const place = await PlaceModel.findById(placeId);
    if (!place) return res.status(404).json({ msg: "Place not found" });

    place.Route.pull({ _id: routeId }); // <-- remove by _id
    await place.save();

    res.status(200).json({ msg: "Route removed successfully", place });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
