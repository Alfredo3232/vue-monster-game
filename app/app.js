function getRandomValue(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

// disabled because we have Vue available through a CDN in our HTML page
// eslint-disable-next-line no-undef
const app = Vue.createApp({
    data() {
        return {
            playerHealth: 100,
            monsterHealth: 100,
            currentRound: 0,
            specialActions: 0,
            winner: null,
            logMessages: []
        };
    },
    computed: {
        monsterBarStyles() {
            if (this.monsterHealth < 0) {
                return { width: "0%" };
            }
            return { width: this.monsterHealth + "%" };
        },
        playerBarStyles() {
            if (this.playerHealth < 0) {
                return { width: "0%" };
            }
            return { width: this.playerHealth + "%" };
        },
        mayUseSpecialAttack() {
            if (this.specialActions < 1) {
                return true;
            }
            return false;
        }
    },
    watch: {
        playerHealth(value) {
            if (value <= 0 && this.monsterHealth <= 0) {
                this.winner = "draw";
            } else if (value <= 0) {
                this.winner = "monster";
            }
        },
        monsterHealth(value) {
            if (value <= 0 && this.playerHealth <= 0) {
                this.winner = "draw";
            } else if (value <= 0) {
                this.winner = "player";
            }
        },
        currentRound(value) {
            if (value % 3 !== 0) {
                this.specialActions++;
            }
        }
    },
    methods: {
        startGame() {
            this.playerHealth = 100;
            this.monsterHealth = 100;

            this.winner = null;
            this.logMessages = [];

            this.currentRound = 0;
            this.specialActions = 0;
        },
        attackMonster() {
            this.currentRound++;

            const attackValue = getRandomValue(5, 12);
            this.monsterHealth -= attackValue;

            this.addLogMessage("Player", "Attack", attackValue);
            this.attackPlayer();
        },
        attackPlayer() {
            const attackValue = getRandomValue(8, 15);
            this.playerHealth -= attackValue;

            this.addLogMessage("Monster", "Attack", attackValue);
        },
        specialAttackMonster() {
            const attackValue = getRandomValue(10, 25);
            this.monsterHealth -= attackValue;

            this.addLogMessage("Player", "Special Attack", attackValue);
            this.attackPlayer();
            this.specialActions--;
        },
        healPlayer() {
            const healValue = getRandomValue(8, 20);
            if (this.playerHealth + healValue > 100) {
                this.playerHealth = 100;
            } else {
                this.playerHealth += healValue;
            }

            this.addLogMessage("Player", "Heals", healValue);
            this.attackPlayer();
        },
        surrender() {
            this.winner = "monster";
        },
        addLogMessage(who, what, value) {
            this.logMessages.unshift({
                actionBy: who,
                actionType: what,
                actionValue: value
            });

        }
    }
});

app.mount("#game");