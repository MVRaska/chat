import { Chatroom } from './chat.js';
import { chatUI } from './ui.js';

const ul = document.querySelector('ul');

let chatUI1 = new chatUI(ul);

let inputColor = document.getElementById('picker');
let btnColor = document.getElementById('color');

let inputMessage = document.getElementById('textMessage');
let btnSend = document.getElementById('send');

let inputUserName = document.getElementById('textUserName');
let btnUpdate = document.getElementById('update');

let spans = document.querySelectorAll('span');

let pActiveUser = document.querySelector('p');

let newUsername = 'anonymous';
if (localStorage.getItem('username')) {
    newUsername = JSON.parse(localStorage.getItem('username'));
}

if (localStorage.getItem('color')) {
    let color = JSON.parse(localStorage.getItem('color'));
    document.body.style.background = color;
    inputColor.value = color;
}

let room = '#general';
if (localStorage.getItem('room')) {
    room = JSON.parse(localStorage.getItem('room'));
    spans.forEach(span => {
        span.style.background = 'blueviolet';
        spans.forEach(span => {
            if (span.textContent == room) {
                span.style.background = 'rgb(96, 4, 182)';
            }
        });
    });
}

let chatroom = new Chatroom(room, newUsername);

pActiveUser.innerHTML = newUsername;

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

        localStorage.setItem('room', JSON.stringify(span.textContent));

        chatroom.room = span.textContent;
        chatroom.getChats(data => {
            chatUI1.list.appendChild(chatUI1.templateLI(data, chatroom.userName));
        });
    });
});

btnSend.addEventListener('click', e => {
    e.preventDefault();

    if (inputMessage.value.trim() != '') {
        chatroom.addChat(inputMessage.value);
    }

    inputMessage.value = ''; // or inputMessage.reset(); will reset all fields in the form
});

btnUpdate.addEventListener('click', e => {
    e.preventDefault();
    chatroom.userName = inputUserName.value;

    localStorage.setItem('username', JSON.stringify(inputUserName.value));

    chatroom.activeUser(inputUserName.value);

    chatUI1.deleteUl();
    pActiveUser.innerHTML = inputUserName.value;
    chatroom.getChats(data => {
        chatUI1.list.appendChild(chatUI1.templateLI(data, chatroom.userName));
    });

    inputUserName.value = '';
});

btnColor.addEventListener('click', e => {
    e.preventDefault();
    console.log('coloring');
    document.body.style.background = inputColor.value;

    localStorage.setItem('color', JSON.stringify(inputColor.value));
});

ul.addEventListener('click', async e => {
    if (e.target.tagName == 'IMG') {
        let liDelete = e.target.parentNode;
        let docId = e.target.id;
        console.log('Document ID:', docId);

        if (liDelete.class == chatroom.userName) {
            chatroom.deleteMsgDB(docId);
        }

        ul.removeChild(liDelete);
    }
});

db.collection('chats').onSnapshot(change => { console.log(change); })
