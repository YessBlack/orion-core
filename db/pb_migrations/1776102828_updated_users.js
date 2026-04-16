/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("_pb_users_auth_")

  // update field
  collection.fields.addAt(9, new Field({
    "hidden": false,
    "id": "select770559087",
    "maxSelect": 1,
    "name": "permissions",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "NONE",
      "READ",
      "WRITE",
      "ADMIN"
    ]
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("_pb_users_auth_")

  // update field
  collection.fields.addAt(9, new Field({
    "hidden": false,
    "id": "select770559087",
    "maxSelect": 1,
    "name": "permissions",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "NONE",
      "READ",
      "WRITE",
      "FULL"
    ]
  }))

  return app.save(collection)
})
