import Listing from "../models/Listing.model.js"
import createError from "../utils/error.js"

export const createListing = async (req, res, next) => {
  try {
    const listing = await Listing.create(req.body)
    return res.status(201).json(listing)
  } catch (error) {
    next(error)
  }
}

// deleteListing function
export const deleteListing = async (req, res, next) => {
  // check if listing exists
  const listing = await Listing.findById(req.params.id)

  if (!listing) {
    return next(createError(404, "Listing not found"))
  }
  // check if user is authorized to delete listing
  if (listing.userRef !== req.user.userId) {
    return next(
      createError(401, "You are not authorized to delete this listing")
    )
  }
  try {
    // delete the listing
    await Listing.findByIdAndDelete(req.params.id)
    return res.status(200).json({ message: "Listing deleted" })
  } catch (error) {
    next(error)
  }
}

// updateListing function
export const updateListing = async (req, res, next) => {
  // check if the user is authorized to update the listing
  const listing = await Listing.findById(req.params.id)

  // check if listing exists
  if (!listing) {
    return next(createError(404, "Listing not found"))
  }

  if (listing.userRef !== req.user.userId) {
    return next(
      createError(401, "You are not authorized to update this listing")
    )
  }

  try {
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    )
    return res.status(200).json(updatedListing)
  } catch (error) {
    next(createError(400, error.message))
  }
}

// getListing function
export const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.listingId)
    return res.status(200).json(listing)
  } catch (error) {
    next(createError(404, "Listing not found"))
  }
}
