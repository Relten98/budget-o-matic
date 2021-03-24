// Create a new db request for a "budget" database.
const request = indexedDB.open(`budget`, 2);

// This is what shall use to store out shiznit
const ObjectStoreName = `pending`;

// This is a request for updating information. I recall this is the one that has been giving me the most amount of grief as well.
request.onupgradeneeded = event => {
    const db = request.result;
    if (!db.objectStoreNames.contains(ObjectStoreName)) {
        db.createObjectStore(ObjectStoreName, { autoIncrement: true });
    }
};

// ERRORS
request.onerror = event => console.error(event);

function checkDatabase() {
    const db = request.result;
    let transaction = db.transaction([ObjectStoreName], `readwrite`);
    let storage = transaction.objectStore(ObjectStoreName);

    // get all records from store and set to a variable
    const getAll = storage.getAll();

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
                    transaction = db.transaction([ObjectStoreName], `readwrite`);

                    // access your pending object store
                    storage = transaction.objectStore(ObjectStoreName);

                    // clear all items in your store
                    storage.clear();
                });
        }
    };
}

// This just checks the database.
request.onsuccess = event => {
    // Will read from the DB if the website is not online, like a gigabrain should.
    if (navigator.onLine) {
        checkDatabase();
    }
};

// Saves records
function saveRecord(record) {
    const db = request.result;
    const storage = transaction.objectStore(ObjectStoreName);
    const transaction = db.transaction([ObjectStoreName], `readwrite`);

    // add record to your store with add method.
    storage.add(record);
}

// listens for the app coming back online
window.addEventListener(`online`, checkDatabase);