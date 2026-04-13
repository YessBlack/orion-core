/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("_pb_users_auth_")

  // remove field
  collection.fields.removeById("select770559087")

  // add field
  collection.fields.addAt(11, new Field({
    "hidden": false,
    "id": "select1466534506",
    "maxSelect": 1,
    "name": "role",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "ADMIN",
      "SELLER",
      "WAREHOUSE"
    ]
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("_pb_users_auth_")

  // add field
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

  // remove field
  collection.fields.removeById("select1466534506")

  return app.save(collection)
})
