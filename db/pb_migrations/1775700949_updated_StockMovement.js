/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3471998555")

  // update collection data
  unmarshal({
    "name": "stock_movements"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3471998555")

  // update collection data
  unmarshal({
    "name": "StockMovement"
  }, collection)

  return app.save(collection)
})
