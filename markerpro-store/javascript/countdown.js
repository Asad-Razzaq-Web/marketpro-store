class UniversalCountdown {
    constructor() {
        this.init();
    }

    init() {
        // Targets any container using the master initialization attribute
        const timers = document.querySelectorAll('[data-countdown-target]');
        
        timers.forEach(timer => {
            const targetDateStr = timer.getAttribute('data-countdown-target');
            if (!targetDateStr) return;

            const targetTime = new Date(targetDateStr).getTime();
            if (isNaN(targetTime)) return;

            // Run structural updates instantly
            this.updateTimer(timer, targetTime);

            const interval = setInterval(() => {
                const isActive = this.updateTimer(timer, targetTime);
                if (!isActive) {
                    clearInterval(interval);
                    timer.classList.add('countdown-expired');
                }
            }, 1000);
        });
    }

    updateTimer(container, targetTime) {
        const now = new Date().getTime();
        const difference = targetTime - now;

        if (difference <= 0) {
            this.setZero(container);
            return false;
        }

        const time = {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((difference % (1000 * 60)) / 1000)
        };

        // Inject calculations only where data attributes are present
        this.updateElement(container, 'data-cd-days', time.days);
        this.updateElement(container, 'data-cd-hours', time.hours);
        this.updateElement(container, 'data-cd-minutes', time.minutes);
        this.updateElement(container, 'data-cd-seconds', time.seconds);
        
        return true;
    }

    updateElement(parent, attribute, value) {
        const element = parent.querySelector(`[${attribute}]`);
        if (!element) return;
        
        // Pad numbers with a leading zero if they drop below 10 (e.g., 05 Hours)
        const formattedValue = value < 10 ? `0${value}` : value;
        
        if (element.textContent !== String(formattedValue)) {
            element.textContent = formattedValue;
        }
    }

    setZero(container) {
        ['days', 'hours', 'minutes', 'seconds'].forEach(unit => {
            const element = container.querySelector(`[data-cd-${unit}]`);
            if (element) element.textContent = '00';
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new UniversalCountdown();
});
