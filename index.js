'use strict';

// определяю все нужные элементы на странице
const refs = {
    daysValueField: document.querySelector('[data-value=days]'),
    hoursValueField: document.querySelector('[data-value=hours]'),
    minsValueField: document.querySelector('[data-value=mins]'),
    secsValueField: document.querySelector('[data-value=secs]'),
};


class CountdownTimer {
    constructor({ selector, targetDate, onTick }) {
        this.intervalId = null;
        this.isActive = false;
        this.selector = selector;
        this.targetDate = targetDate;
        this.onTick = onTick;

        this.init();
    }

    // инициализирую оставшееся время
    init() {
        const zeroTime = this.getTimeComponents(this.targetDate.getTime() - Date.now());
        this.onTick(zeroTime);
    }

    // переводит UNIX-время в дни-часы-минуты-секунды 
    getTimeComponents(time) {
        const days = this.parDays(Math.floor(time / (1000 * 60 * 60 * 24)));
        const hours = this.par(Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
        const mins = this.par(Math.floor((time % (1000 * 60 * 60)) / (1000 * 60)));
        const secs = this.par(Math.floor((time % (1000 * 60)) / 1000));

        return { days, hours, mins, secs };
    }

    // добавляет ноль к количеству оставшихся минут, часов и секунд, если их меньше, чем 10
    par(value) {
        return String(value).padStart(2, '0');
    }

    // добавляет ноль к количеству оставшихся дней, если их меньше чем 10
    parDays(value) {
        const newDateValue = String(value).padStart(3, "0");
        if (newDateValue[0] === '0') {
            return newDateValue.slice(1)
        }
        return newDateValue;
    }

    // запуск отсчёта времени к дате с this.targetDate
    startTimer() {
        if (this.isActive) {
            return;
        }

        this.isActive = true;  
        this.intervalId = setInterval(() => {
            const currentTime = Date.now();
            const deltaTime = this.targetDate.getTime() - currentTime;
            const time = this.getTimeComponents(deltaTime);
            this.onTick(time);
        }, 1000);

    }
}


// создаю экземпляр класса, указываю его id в разметке, нужную дату и функцию для выбора нужных элементов в разметке
const timer = new CountdownTimer({selector: '#timer-1', targetDate: new Date('Jan 1, 2021'), onTick: updateTimeFields });
timer.startTimer.call(timer);

// функция, которая будет передаваться в setInterval и обновлять данные в html
function updateTimeFields({ days, hours, mins, secs }) {
    refs.daysValueField.textContent = days;
    refs.hoursValueField.textContent = hours;
    refs.minsValueField.textContent = mins;
    refs.secsValueField.textContent = secs;
}