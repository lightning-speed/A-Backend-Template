migrate((db) => {
  const collection = new Collection({
    "id": "bkbj82g623mxhic",
    "created": "2023-03-10 15:01:35.695Z",
    "updated": "2023-03-10 15:01:35.695Z",
    "name": "usr",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "73ktlsvi",
        "name": "username",
        "type": "text",
        "required": false,
        "unique": true,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "0hamediu",
        "name": "email",
        "type": "email",
        "required": false,
        "unique": true,
        "options": {
          "exceptDomains": null,
          "onlyDomains": null
        }
      },
      {
        "system": false,
        "id": "2uez3wrw",
        "name": "passwordHash",
        "type": "text",
        "required": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      }
    ],
    "listRule": "",
    "viewRule": "",
    "createRule": "",
    "updateRule": "",
    "deleteRule": "",
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("bkbj82g623mxhic");

  return dao.deleteCollection(collection);
})
