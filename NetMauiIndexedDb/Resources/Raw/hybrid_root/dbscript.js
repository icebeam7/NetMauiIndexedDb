function load_data() {
    init_database();
}

let students_table = 'Students';
let students = document.querySelector("ol");

function init_database() {
    if (!window.indexedDB) {
        HybridWebView.SendRawMessageToDotNet("Your browser doesn't support IndexedDB");
        return;
    }

    let db;
    const request = indexedDB.open('schoolDB', 1);

    request.onerror = (event) => {
        HybridWebView.SendRawMessageToDotNet("Database error: " + event.target.errorCode);
    };

    request.onsuccess = (event) => {
        db = event.target.result;

        insert_student(db, {
            name: 'John Doe',
            faculty: 'FAI'
        });

        insert_student(db, {
            name: 'Jane Doe',
            faculty: 'FAME'
        });

        show_students(db);
    };

    request.onupgradeneeded = (event) => {
        db = event.target.result;

        let store = db.createObjectStore(students_table, {
            autoIncrement: true,
            keyPath: 'id' 
        });
    };
}

function insert_student(db, student) {
    const txn = db.transaction(students_table, 'readwrite');
    const store = txn.objectStore(students_table);

    let query = store.put(student);

    query.onsuccess = function (event) {
        console.log(event);
    };

    query.onerror = function (event) {
        console.log(event.target.errorCode);
    }

    txn.oncomplete = function () {
        db.close();
    };
}

function show_students(db) {
    while (students.firstChild) {
        students.removeChild(students.firstChild);
    }

    const txn = db.transaction(students_table, 'readwrite');

    const store = txn.objectStore(students_table);
    store.openCursor().addEventListener('success', e => {
        const pointer = e.target.result;

        if (pointer) {
            const listItem = document.createElement('li');
            const h3 = document.createElement('h3');
            const pg = document.createElement('p');
            listItem.appendChild(h3);
            listItem.appendChild(pg);
            students.appendChild(listItem);

            h3.textContent = pointer.value.name;
            pg.textContent = pointer.value.faculty;
            listItem.setAttribute('data-id', pointer.value.id);

            pointer.continue();
        } else {
            if (!students.firstChild) {
                const listItem = document.createElement('li');
                listItem.textContent = 'No Students.'
                students.appendChild(listItem);
            }

            HybridWebView.SendRawMessageToDotNet("Data has been loaded");
        }
    });
}