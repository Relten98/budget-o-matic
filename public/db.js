'use strict'

console.log('DB has been located!');

const pendingObjectstorage = `pending`;

const handoff = indexedDB.open(`budget`, 2);

handoff.onupgradeneeded = event => {
    let database = handoff.result;

    if (!database.objectStoreNames.contains(pendingObjectstorage)) {
        database.createObjectstore(pendingObjectstorage, { autoIncrement: true });
    }
};
handoff.onsuccess = event => {
    console.log(`Successful ${event.type}!`);

    if (navigator.onLine) {
        checkDatabase();
    }
}

handoff.onerror = event => console.error(event);

function checkDatabase() {
    const db = handoff.result;

    // open a transaction on your pending db
    let transaction = db.transaction([pendingObjectstorage], `readwrite`);

    // access your pending object store
    let store = transaction.objectStore(pendingObjectstorage);

    // get all records from store and set to a variable
    const getAll = store.getAll();

    getAll.onsuccess = () => {
        if (getAll.result.length > 0) {
            fetch(`/api/transaction/bulk`, {
                method: `POST`,
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: `application/json, text/plain, */*`,
                    "Content-Type": `application/json`
                }
            })
                .then(response => response.json())
                .then(() => {
                    // if successful, open a transaction on your pending db
                    transaction = db.transaction([pendingObjectstorage], `readwrite`);

                    // access your pending object store
                    store = transaction.objectStore(pendingObjectstorage);

                    // clear all items in your store
                    store.clear();
                });
        }
    };
}

// eslint-disable-next-line no-unused-vars
function saveRecord(record) {
    let db = handoff.result;

    // Creates a transaction on the pending db with readwrite access
    let transaction = db.transaction([pendingObjectstorage], `readwrite`);

    // Access the object store
    let store = transaction.objectStore(pendingObjectstorage);

    // Add record to your store with add method.
    store.add(record);
}

// listen for app coming back online
window.addEventListener(`online`, checkDatabase);