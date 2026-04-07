/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("_pb_users_auth_")

  // remove field
  collection.fields.removeById("url2323052248")

  // add field
  collection.fields.addAt(12, new Field({
    "hidden": false,
    "id": "bool2323052248",
    "name": "isActive",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("_pb_users_auth_")

  // add field
  collection.fields.addAt(12, new Field({
    "exceptDomains": [],
    "hidden": false,
    "id": "url2323052248",
    "name": "isActive",
    "onlyDomains": [],
    "presentable": false,
    "required": false,
    "system": false,
    "type": "url"
  }))

  // remove field
  collection.fields.removeById("bool2323052248")

  return app.save(collection)
})
