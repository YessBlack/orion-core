/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("_pb_users_auth_")

  // update collection data
  unmarshal({
    "listRule": "@request.auth.id != \"\" && @request.auth.isActive = true",
    "updateRule": "id = @request.auth.id || (@request.auth.role = \"ADMIN\" && @request.auth.isActive = true)"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("_pb_users_auth_")

  // update collection data
  unmarshal({
    "listRule": "@request.auth.id != \"\"",
    "updateRule": "id = @request.auth.id || @request.auth.role = \"ADMIN\""
  }, collection)

  return app.save(collection)
})
