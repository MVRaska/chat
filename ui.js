class chatUI {
    constructor(list) {
        this.list = list;
    }

    set list(list) {
        this._list = list;
    }

    get list() {
        return this._list;
    }

    formatDate(date) {
        // .padStart() function to add 0 in front of single-digit numbers, works only with strings

        const currentDate = new Date();
        const currentDay = currentDate.getDate();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        const createdAt = date.created_at.toDate();
        const messageDay = createdAt.getDate();
        const messageMonth = createdAt.getMonth();
        const messageYear = createdAt.getFullYear();

        let messageHour = createdAt.getHours();
        let messageMinute = createdAt.getMinutes();

        let formattedDate;

        if (messageDay === currentDay && messageMonth === currentMonth && messageYear === currentYear) {
            messageHour = messageHour < 10 ? `0${messageHour}` : messageHour;
            messageMinute = messageMinute < 10 ? `0${messageMinute}` : messageMinute;

            formattedDate = `${messageHour}:${messageMinute}`;
        } else {
            const formattedMessageDay = messageDay < 10 ? `0${messageDay}` : messageDay;
            const formattedMessageMonth = messageMonth < 9 ? `0${messageMonth + 1}` : messageMonth + 1;
            const formattedMessageYear = messageYear;

            messageHour = messageHour < 10 ? `0${messageHour}` : messageHour;
            messageMinute = messageMinute < 10 ? `0${messageMinute}` : messageMinute;

            formattedDate = `${formattedMessageDay}.${formattedMessageMonth}.${formattedMessageYear} - ${messageHour}:${messageMinute}`;
        }

        return formattedDate;
    }

    templateLI(data, userName) {
        const li = document.createElement('li');
        if (data.message !== '') {
            li.innerHTML = `${data.username}: ${data.message} <br> ${this.formatDate(data)}`;
            li.classList.add(data.username);

            const img = document.createElement('img');
            img.src = 'kanta.png';
            img.setAttribute('id', data.id);
            li.appendChild(img);

            if (data.username === userName) {
                li.classList.add('active');
            }
        }
        return li;
    }

    deleteUl() {
        this.list.innerHTML = '';
    }
}

export { chatUI };
