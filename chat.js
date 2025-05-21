/* Create a 'chats' collection in Firestore containing the following fields:
documentID (auto increment) – Message ID assigned automatically
message (string) – The content of the message
username (string) – The username of the person who sent the message
room (string) – The room where the message was posted
created_at (timestamp) – Date and time the message was created
Connect the database (the created collection) with your project
*/

class Chatroom {
    constructor(room, userName) {
        this.room = room;
        this.userName = userName;
        this.chats = db.collection('chats');
        this.unsub = false;
    }

    set room(r) {
        this._room = r;
        if (this.unsub) {
            this.unsub();
        }
    }

    set userName(un) {
        if (un.length > 2 && un.length < 10 && un.trim() !== '') {
            this._userName = un;
        } else {
            alert('Invalid username input');
        }
    }

    get room() {
        return this._room;
    }

    get userName() {
        return this._userName;
    }

    async addChat(message) {
        // Create a document to be added to the database
        try {
            const chatDoc = {
                message: message,
                username: this.userName,
                room: this.room,
                created_at: new Date()
            };

            const response = await this.chats.add(chatDoc); // Save the document in the database

            chatDoc.id = response.id;
            console.log(response.id);

            return { id: response.id, reference: response }; // Returns a promise that can be chained with then() and catch()
        } catch (err) {
            console.error('An error occurred:', err);
        }
    }

    getChats(callback) {
        // Listen to documents in the current room and track added ones
        this.unsub = this.chats
            .where('room', '==', this.room)
            .orderBy('created_at')
            .onSnapshot(snapshot => {
                snapshot.docChanges().forEach(change => {
                    if (change.type === 'added') {
                        const docData = change.doc.data();
                        docData.id = change.doc.id;
                        callback(docData);
                    }
                });
            });
    }

    showActiveUser(user) {
        // Display a message in a new div tag notifying the username change
        const userDiv = document.createElement('div');
        userDiv.innerHTML = `Username has been changed to "<span style='font-weight: bold;'>${user}</span>"`;
        document.body.appendChild(userDiv);
        setTimeout(() => {
            document.body.removeChild(userDiv);
        }, 3000);
    }

    deleteMsgDB(id) {
        // Delete a document from the database by clicking the delete icon
        this.chats.doc(id)
            .delete()
            .then(() => {
                console.log('Document successfully deleted from the database');
            })
            .catch(e => {
                console.error(`Error while deleting the document from the database: ${e}`);
            });
    }
}

export { Chatroom };



