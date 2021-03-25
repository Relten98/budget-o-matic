// Our storage.
request.onsuccess = event => {
    console.log(`Success! ${event.type}`);
    // check if app is online before reading from db
    if (navigator.onLine) {
        checkDatabase();
    }
};

request.onerror = event => console.error(event);

function checkDatabase() {

    const db = request.result;

    let transaction = db.transaction([pendingObjectStoreName], `readwrite`);

    let storage = transaction.objectStore(pendingObjectStoreName);

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
            }
            )
                .then(response => response.json())
                .then(() => {
                    // if successful, open a transaction on your pending db
                    transaction = db.transaction([pendingObjectStoreName], `readwrite`);

                    // access your pending object store
                    storage = transaction.objectStore(pendingObjectStoreName);

                    // clear all items in your store
                    storage.clear();
                }
                );
        }
    }
};

function saveRecord(record) {
    const db = request.result;

    const storage = transaction.objectStore(pendingObjectStoreName);


    const transaction = db.transaction([pendingObjectStoreName], `readwrite`);
    // add record to your store with add method.
    storage.add(record);
};

// listen for app coming back online
window.addEventListener(`online`, checkDatabase);