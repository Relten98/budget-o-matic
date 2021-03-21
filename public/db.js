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