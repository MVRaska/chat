class chatUI {
    constructor(l) {
        this.list = l;
    }

    set list(l) {
        this._list = l;
    }

    get list() {
        return this._list;
    }

    formatDate(date) {

        //.padStart() funkcija za dodavanje 0 ispred jednocifrenog broja, radi samo sa stringovima
    
        let datum = new Date();
        let dan = datum.getDate();
        let mesec = datum.getMonth();
        let godina = datum.getFullYear();
    
        let created_at = date.created_at.toDate();
        let danPoruke = created_at.getDate();
        let mesecPoruke = created_at.getMonth();
        let godinaPoruke = created_at.getFullYear();
    
        let satPoruke = created_at.getHours();
        let minutPoruke = created_at.getMinutes();
    
        let datumPoruke;
    
        if(danPoruke == dan && mesecPoruke == mesec && godinaPoruke == godina) {
            satPoruke = satPoruke < 10 ? `0${satPoruke}` : satPoruke;
            minutPoruke = minutPoruke < 10 ? `0${minutPoruke}` : minutPoruke;
            
            datumPoruke = `${satPoruke}:${minutPoruke}`;
        } else {
            danPoruke = danPoruke < 10 ? `0${danPoruke}` : danPoruke;
            mesecPoruke = mesecPoruke < 9 ? `0${mesecPoruke + 1}` : mesecPoruke + 1;
            godinaPoruke = godinaPoruke;
    
            satPoruke = satPoruke < 10 ? `0${satPoruke}` : satPoruke;
            minutPoruke = minutPoruke < 10 ? `0${minutPoruke}` : minutPoruke;
            
            datumPoruke = `${danPoruke}.${mesecPoruke}.${godinaPoruke} - ${satPoruke}:${minutPoruke}`;
        }
        return datumPoruke;
    }

    templateLI(data, userName) {
        let li = document.createElement('li');
        if(data.message != '') {
            li.innerHTML = `${data.username}: ${data.message} <br> ${this.formatDate(data)}`;
            li.classList.add(data.username);

            let img = document.createElement('img');
            img.src = 'kanta.png';
            img.setAttribute('id', data.id);
            li.appendChild(img);

            if(data.username == userName) {
                li.classList.add('aktivno');
            }
        }
        return li;
    }

    deleteUl() {
        this.list.innerHTML = '';
    }
}

export {chatUI};