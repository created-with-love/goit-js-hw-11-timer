'use strict';

class CountdownTimer {
    constructor({ selector, targetDate}) {
        this.intervalId = null;
        this.isActive = false;
        this.selector = selector;
        this.targetDate = targetDate;
        this.onTick = this.updateTimeFields;
        this.daysValueField = document.querySelector(`${this.selector} [data-value=days]`);
        this.hoursValueField = document.querySelector(`${this.selector} [data-value=hours]`);
        this.minsValueField = document.querySelector(`${this.selector} [data-value=mins]`);
        this.secsValueField = document.querySelector(`${this.selector} [data-value=secs]`);

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

    // функция, которая будет передаваться в setInterval и обновлять данные в html
    updateTimeFields({ days, hours, mins, secs }) {
        this.daysValueField.textContent = days;
        this.hoursValueField.textContent = hours;
        this.minsValueField.textContent = mins;
        this.secsValueField.textContent = secs;
    }
}


// создаю экземпляр класса, указываю его id в разметке, нужную дату и функцию для выбора нужных элементов в разметке
const timer = new CountdownTimer({selector: '#timer-1', targetDate: new Date('Jan 1, 2021')});
timer.startTimer.call(timer);
