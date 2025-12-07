export class GameTimer {
    constructor(scene) {
        this.scene = scene;
        this.startTime = 0;
        this.currentTime = 0;
        this.isRunning = false;
        this.gameEndTime = null;

        this.timerText = scene.add.text(
            scene.cameras.main.width / 2,
            30,
            '00:00',
            {
                fontSize: '40px',
                fontFamily: 'Arial',
                color: '#ffffff',
                stroke: '#000000',
                strokeThickness: 6,
                fontStyle: 'bold'
            }
        ).setOrigin(0.5).setScrollFactor(0).setDepth(1000);

        this.spawnEvents = [];
        this.triggeredEvents = new Set();
    }

    start() {
        this.startTime = this.scene.time.now;
        this.isRunning = true;
    }

    pause() {
        this.isRunning = false;
    }

    resume() {
        this.isRunning = true;
    }

    setEndGameTime(seconds) {
        this.gameEndTime = seconds;
    }

    update() {
        if (!this.isRunning) return;

        const elapsed = this.scene.time.now - this.startTime;
        this.currentTime = Math.floor(elapsed / 1000);

        if (this.gameEndTime != null && this.currentTime >= this.gameEndTime) {
            this.onGameEnd();
            return;
        }

        this.updateDisplay();

        this.checkSpawnEvents();
    }

    updateDisplay() {
        const minutes = Math.floor(this.currentTime / 60);
        const seconds = this.currentTime % 60;
        this.timerText.setText(
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        );
    }

    addSpawnEvent(timeInSeconds, callback, repeat = false) {
        const event = {
            id: `event_${Date.now()}_${Math.random()}`,
            time: timeInSeconds,
            callback: callback,
            repeat: repeat,
            interval: timeInSeconds,
            lastTriggered: 0,
            active: true
        };
        this.spawnEvents.push(event);
        return event.id;
    }

    removeSpawnEvent(eventId) {
        const index = this.spawnEvents.findIndex(e => e.id == eventId);
        if (index != -1) {
            this.spawnEvents.splice(index, 1);
            return true;
        }
        return false;
    }

    removeSpawnEventsWhere(filterFn) {
        this.spawnEvents = this.spawnEvents.filter(event => !filterFn(event));
    }

    deactivateSpawnEvent(eventId) {
        const event = this.spawnEvents.find(e => e.id == eventId);
        if (event) {
            event.active = false;
            return true;
        }
        return false;
    }

    activateSpawnEvent(eventId) {
        const event = this.spawnEvents.find(e => e.id == eventId);
        if (event) {
            event.active = true;
            return true;
        }
        return false;
    }

    checkSpawnEvents() {
        this.spawnEvents.forEach((event, index) => {
            if (!event.active) return;

            if (event.repeat) {
                if (this.currentTime >= event.interval && this.currentTime - event.lastTriggered >= event.interval) {
                    event.callback(this.currentTime);
                    event.lastTriggered = this.currentTime;
                }
            } else {
                const eventKey = `event_${index}_${event.time}`;
                if (this.currentTime >= event.time && !this.triggeredEvents.has(eventKey)) {
                    event.callback(this.currentTime);
                    this.triggeredEvents.add(eventKey);
                }
            }
        });
    }

    onGameEnd() {
        this.pause();
        console.log(`game ended at ${this.getFormattedTime()}`);

        this.scene.events.emit('gameEnd', this.currentTime);
    }

    getTime() {
        return this.currentTime;
    }

    getFormattedTime() {
        const minutes = Math.floor(this.currentTime / 60);
        const seconds = this.currentTime % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
}