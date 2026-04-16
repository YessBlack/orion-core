/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
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
      "FULL"
    ]
  }))

  // add field
  collection.fields.addAt(10, new Field({
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

  // add field
  collection.fields.addAt(11, new Field({
    "hidden": false,
    "id": "bool2241418015",
    "name": "isDefault",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

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

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("_pb_users_auth_")

  // remove field
  collection.fields.removeById("select770559087")

  // remove field
  collection.fields.removeById("select1466534506")

  // remove field
  collection.fields.removeById("bool2241418015")

  // remove field
  collection.fields.removeById("url2323052248")

  return app.save(collection)
})
