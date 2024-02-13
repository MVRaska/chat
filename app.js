import {Chatroom} from './chat.js';
import {chatUI} from './ui.js';

const ul = document.querySelector('ul');

let chatUI1 = new chatUI(ul);

let inputColor = document.getElementById('picker');
let btnColor = document.getElementById('color');

let inputPoruka = document.getElementById('textPoruka');
let btnSend = document.getElementById('send');

let inputUserName = document.getElementById('textUserName');
let btnUpdate = document.getElementById('update');

let spans = document.querySelectorAll('span');

let pAktivniKorisnik = document.querySelector('p');


let noviUsername = 'anonymus';
if(localStorage.getItem('username')) {
    noviUsername = JSON.parse(localStorage.getItem('username'));
}

if(localStorage.getItem('color')) {
    let boja = JSON.parse(localStorage.getItem('color'));
    document.body.style.background = boja;
    inputColor.value = boja;
}

let room = '#general';
if(localStorage.getItem('soba')) {
    room = JSON.parse(localStorage.getItem('soba'));
    spans.forEach(span => {
        span.style.background = 'blueviolet';
        spans.forEach(span => {
            if(span.textContent == room) {
                span.style.background = 'rgb(96, 4, 182)';
            }
        }); 
    });
}

let chatroom = new Chatroom(room, noviUsername);

pAktivniKorisnik.innerHTML = noviUsername;

chatroom.getChats(data => {  
    chatUI1.list.appendChild(chatUI1.templateLI(data, chatroom.userName));
});

spans.forEach(span => {

    span.addEventListener('click', () => {
        chatUI1.deleteUl();
        spans.forEach(otherSpan => {
            otherSpan.style.background = 'blueviolet';
        });

        span.style.background = 'rgb(96, 4, 182)';

        localStorage.setItem('soba', JSON.stringify(span.textContent));

        chatroom.room = span.textContent;
        chatroom.getChats(data => {  
            chatUI1.list.appendChild(chatUI1.templateLI(data, chatroom.userName));
        });
    });
});


btnSend.addEventListener('click', e => {
    e.preventDefault();

    if(inputPoruka.value.trim() != '') {
        chatroom.addChat(inputPoruka.value);
    }
    
    inputPoruka.value = ''; //ili  inputPoruka.reset();  na formi resetuje sva polja 
});


btnUpdate.addEventListener('click', e => {
    e.preventDefault();
    chatroom.userName = inputUserName.value;

    localStorage.setItem('username', JSON.stringify(inputUserName.value));
    
    chatroom.aktivniKorisnik(inputUserName.value);

    chatUI1.deleteUl();
    pAktivniKorisnik.innerHTML = inputUserName.value;
    chatroom.getChats(data => {  
        chatUI1.list.appendChild(chatUI1.templateLI(data, chatroom.userName));
    });

    inputUserName.value = '';
});

btnColor.addEventListener('click', e => {
    e.preventDefault();
    console.log('oboji');
    document.body.style.background = inputColor.value;

    localStorage.setItem('color', JSON.stringify(inputColor.value));
});

ul.addEventListener('click', async e => {
    if(e.target.tagName == 'IMG') {
        let liDelete = e.target.parentNode;
        let docId = e.target.id;
        console.log('ID dokumenta:', docId);

        if(liDelete.class == chatroom.userName) {
            chatroom.deleteMsgDB(docId);
        }

        ul.removeChild(liDelete);
    }
});

db.collection('chats').onSnapshot(change => {console.log(change);})