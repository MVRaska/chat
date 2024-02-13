// Napraviti chats kolekciju u Firestore, koja će sadržati sledeća polja:
// documentID (auto increment) – ID poruke koji se automatski dodeljuje
// message (string) – Tekst poruke
// usrename (string) – Korisničko ime korisnika koji je napisao poruku
// room (string) – Soba u kojoj je kreirana poruka
// created_at (timestamp) – Datum i vreme kreiranja poruke
// Povezati (konektovati) bazu podataka (kreiranu kolekciju) sa svojim projektom


class Chatroom {
    constructor(room, userName) {
        this.room = room;
        this.userName = userName;
        this.chats = db.collection('chats');
        this.unsub = false;
    }

    set room(r) {
        this._room = r;
        if(this.unsub) {
            this.unsub();
        }
    }
    set userName(un) {
        if(un.length > 2 && un.length < 10 && un.trim() != '') {
            this._userName = un;
        } else {
            alert('Pogresno uneto korisnicko ime');
        }   
    }

    get room() {
        return this._room;
    }
    get userName() {
        return this._userName;
    }

    async addChat(mess) {
        // kreiranje dokumenta koji zelimo da dodamo u bazu

        try {
            let docChat = {
                message: mess,
                username: this.userName,
                room: this.room,
                created_at: new Date()
            };

            let response = await this.chats.add(docChat);   //pamti dokument u bazi

            docChat.id = response.id;
            console.log(response.id);

            return { id: response.id, referenca: response};   //vraca promise na koji moze da se doda then() i catch()
        }
        catch {
            console.error('Doslo je do greske', err);
        } 
    }

    getChats(callback) {
        // pozivanje dokumenta iz iste sobe iz baze i pracenje dodatih dokumenata
        this.unsub = this.chats
        .where('room', '==', this.room)
        .orderBy('created_at')
        .onSnapshot(snapShot => {
            snapShot.docChanges().forEach(change => {
                if(change.type == 'added') {
                    let docData = change.doc.data();
                    docData.id = change.doc.id;
                    callback(docData);
                }
            });
        });
    }

    aktivniKorisnik(aktivan) {
        // ispis u novom div tagu - obavestenje da je promenjen username
        let divKorisnickoIme = document.createElement('div');
        divKorisnickoIme.innerHTML = `Korisnicko ime je promenjeno u "<span style='font-weight: bold;'>${aktivan}</span>"`;
        document.body.appendChild(divKorisnickoIme);
        setTimeout(() => {
            document.body.removeChild(divKorisnickoIme);
        }, 3000);
    } 

    deleteMsgDB(id) {
        // brisanje dokumenta iz baze klikom na kanticu
        this.chats.doc(id)
        .delete()
        .then(() => {
            console.log('Dokument uspesno izbrisan iz baze podataka');
        })
        .catch(e => {
            console.log(e => {
                console.log(`Greska prilikom brisanja dokumenta u bazi podataka: ${e}`);
            });
        })
    }
}

export {Chatroom};


