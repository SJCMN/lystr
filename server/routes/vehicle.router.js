const express = require("express");
const pool = require("../modules/pool");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const {
  uploadFile,
  getFileStream,
  deleteFile,
  // upload,
} = require("../services/s3.js");
const fs = require("fs");
const util = require("util");
const unlinkFile = util.promisify(fs.unlink);

/**
 * GET route template
 */
router.get("/types", (req, res) => {
  const query = `SELECT * FROM "type";`;
  pool
    .query(query)
    .then((result) => res.send(result.rows))
    .catch((err) => {
      console.log(`Error making query ${queryText}`, err);
      res.sendStatus(500);
    });
});

router.get("/features", (req, res) => {
  const query = `SELECT * FROM "features";`;
  pool
    .query(query)
    .then((result) => res.send(result.rows))
    .catch((err) => {
      console.log(`Error making query ${queryText}`, err);
      res.sendStatus(500);
    });
});

router.post("/", (req, res) => {
  console.log(req.body);
  const {
    title,
    type,
    make,
    model,
    year,
    length,
    capacity,
    horsepower,
    street,
    city,
    state,
    zip,
    instructions,
    cabins,
    heads,
    dailyRate,
  } = req.body;
  const ownedBy = req.user.id;

  const query = `
    INSERT INTO "vehicle" ("owned_by", "type_id", "title", "make", "model", "year", "capacity", "length", "horsepower", "daily_rate", "cabins", "heads", "instructions", "street", "city", "state", "zip")
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
      RETURNING "id";
  `;

  pool
    .query(query, [
      ownedBy,
      type,
      title,
      make,
      model,
      year,
      capacity,
      length,
      horsepower,
      dailyRate,
      cabins,
      heads,
      instructions,
      street,
      city,
      state,
      zip,
    ])
    .then((result) => {
      console.log("POST at /vehicle successful");
      res.send(result.rows);
    })
    .catch((error) => {
      console.log("Error during POST to vehicle: ", error);
      res.sendStatus(500);
    });
});

router.post("/features/:vehicleId", (req, res) => {
  const { features } = req.body;
  const { vehicleId } = req.params;

  let query = `
    INSERT INTO "vehicle_features" ("vehicle_id", "feature_id")
      VALUES
  `;
  let values = [vehicleId];

  // build the query string
  for (let i = 0; i < features.length; i++) {
    // start at $2 since $1 will be used for vehicleId
    query += ` ($1, $${i + 2})`;
    // push the featureId into values
    values.push(features[i]);
    // add a comma or semi-colon depending on if we are at the last interation or not
    if (i === features.length - 1) {
      // if last iteration, add semicolon
      query += `;`;
    } else {
      // otherwise, add comma
      query += `,`;
    }
  }
  pool
    .query(query, values)
    .then((result) => {
      console.log("POST at /vehicle/features successful");
      res.sendStatus(201);
    })
    .catch((error) => {
      console.log("Error during POST to vehicle_features: ", error);
      res.sendStatus(500);
    });
});

router.post("/availability/:vehicleId", (req, res) => {
  const { availability } = req.body;
  const { vehicleId } = req.params;

  let query = `
    INSERT INTO "availability" ("vehicle_id", "date_available")
      VALUES
  `;
  let values = [vehicleId];

  // build the query string
  for (let i = 0; i < availability.length; i++) {
    // start at $2 since $1 will be used for vehicleId
    query += ` ($1, $${i + 2})`;
    // push the featureId into values
    values.push(availability[i]);
    // add a comma or semi-colon depending on if we are at the last interation or not
    if (i === availability.length - 1) {
      // if last iteration, add semicolon
      query += `;`;
    } else {
      // otherwise, add comma
      query += `,`;
    }
  }
  pool
    .query(query, values)
    .then((result) => {
      console.log("POST at /vehicle/availability successful");
      res.sendStatus(201);
    })
    .catch((error) => {
      console.log("Error during POST to availability: ", error);
      res.sendStatus(500);
    });
});

router.post("/photos/:vehicleId", upload.array("photos"), async (req, res) => {
  console.log("req.files:", req.files);
  const photos = req.files;
  const { vehicleId } = req.params;

  let imagePaths = [];

  // loop over the photos and upload them to S3
  for (const photo of photos) {
    // capture the photo's Key sent back from S3
    const result = await uploadFile(photo);
    imagePaths.push(`/vehicle/photos/${result.Key}`);
    // remove them from server
    await unlinkFile(photo.path);
  }
  let queryText = `INSERT INTO "photos" ("vehicle_id", "image_path") VALUES`;

  let values = [vehicleId];

  // build the query string
  for (let i = 0; i < imagePaths.length; i++) {
    // start at $2 since $1 will be used for vehicleId
    queryText += ` ($1, $${i + 2})`;
    // push the imagePath to values array for query
    values.push(imagePaths[i]);
    // add a comma or semi-colon depending on if we are at the last interation or not
    if (i === imagePaths.length - 1) {
      // if last iteration, add semicolon
      queryText += `;`;
    } else {
      // otherwise, add comma
      queryText += `,`;
    }
  }

  pool
    .query(queryText, values)
    .then((result) => {
      console.log("POST at /vehicle/photos successful");
      res.sendStatus(201);
    })
    .catch((err) => {
      console.log(`Error uploading/posting to "photos":`, err);
      res.sendStatus(500);
    });
});

// /**
//  * POST route template
//  */
// router.post("/", (req, res) => {
//   // POST route code here
// });

module.exports = router;
