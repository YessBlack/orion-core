/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3660498186")

  // update field
  collection.fields.addAt(2, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text4282629972",
    "max": 0,
    "min": 0,
    "name": "refreshTokenHash",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": true,
    "system": false,
    "type": "text"
  }))

  // update field
  collection.fields.addAt(3, new Field({
    "hidden": false,
    "id": "date730627375",
    "max": "",
    "min": "",
    "name": "expiresAt",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "date"
  }))

  collection.indexes = [
    "CREATE UNIQUE INDEX idx_sessions_refresh_hash_unique ON sessions (refreshTokenHash)","CREATE INDEX idx_sessions_user_revoked_expires ON sessions (userId, revokedAt, expiresAt)"
  ]

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3660498186")

  // update field
  collection.fields.addAt(2, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text4282629972",
    "max": 0,
    "min": 0,
    "name": "refreshTokenHash",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // update field
  collection.fields.addAt(3, new Field({
    "hidden": false,
    "id": "date730627375",
    "max": "",
    "min": "",
    "name": "expiresAt",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "date"
  }))

  collection.indexes = []

  return app.save(collection)
})
