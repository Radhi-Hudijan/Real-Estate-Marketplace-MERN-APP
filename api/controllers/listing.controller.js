import Listing from "../models/Listing.model.js"

export const createListing = async (req, res, next) => {
  try {
    const listing = await Listing.create(req.body)
    return res.status(201).json(listing)
  } catch (error) {
    next(error)
  }
}

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
