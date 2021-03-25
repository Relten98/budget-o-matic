
// Create a new db request for a "budget" database.
const request = indexedDB.open(`budget`, 2);

// This is what shall use to store out shiznit
let dbObjectStoreName = `pending`;

// This is a request for updating information. I recall this is the one that has been giving me the most amount of grief as well.
request.onupgradeneeded = event => {
    const db = request.result;
    if (!db.dbObjectStoreName.contains(dbObjectStoreName)) {
        db.createObjectStore(dbObjectStoreName, { autoIncrement: true });
    }
};

// ERRORS
request.onerror = event => console.error(event);

// Saves records
function saveRecord(record) {
    const db = request.result;

    // Storage vars
    let localstorage = transaction.objectStore(dbObjectStoreName);
    let transaction = db.transaction([dbObjectStoreName], `readwrite`);

    // add record to your store with add method.
    localstorage.add(record);
}

function checkDB() {
    const db = request.result;

    // Storage vars
    let localstorage = transaction.objectStore(dbObjectStoreName);
    let transaction = db.transaction([dbObjectStoreName], `readwrite`);
    // get all records from store and set to a variable
    const getAll = localstorage.getAll();

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
                   let localstorage = transaction.objectStore(dbObjectStoreName);
                   let transaction = db.transaction([dbObjectStoreName], `readwrite`);
                    localstorage.clear();
                });
        }
    };
}

// This just checks the database.
request.onsuccess = event => {
    // Will read from the DB if the website is not online, like a gigabrain should.
    if (navigator.onLine) {
        checkDB();
    }
};

// listens for the app coming back online
window.addEventListener(`online`, checkDatabase);