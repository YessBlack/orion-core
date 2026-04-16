/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("_pb_users_auth_")

  // add field
  collection.fields.addAt(13, new Field({
    "hidden": false,
    "id": "select3534419636",
    "maxSelect": 1,
    "name": "apiAccessLevel",
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

  // remove field
  collection.fields.removeById("select3534419636")

  return app.save(collection)
})
