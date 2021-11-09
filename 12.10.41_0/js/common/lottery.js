class Lottery {
    constructor (lotteryName = '抽奖') {
        this.lotteryName = lotteryName;
        this.lotteryUsers = [];
        this.LotteryModal = new Modal();
        this.$lotteryModal;
        this.$lotteryAnimation;
        this.$lotteryTitle;
    }

    insertLotteryModalBtn ($parent, needInit = true) {
        let self = this;
        needInit && self.initLottery();
        let $btn = self.LotteryModal.insertModalBtn($parent, self.lotteryName);
        if ($btn) {
            $btn.onclick = () => self.LotteryModal.modalToggle();
        }
        return $btn;
    }

    initLottery () {
        if (this.$lotteryModal) {
            this.clearLotteryUsers();
        } else {
            let self = this;
            let borderClass = 'lottery-67373-border';
            let animationClass = 'lottery-67373-animation';
            let winnerClass = 'lottery-67373-winner';
            let lotteryHtml = `
                <div class="lottery-67373-container">
                    <div class="${borderClass} top"></div>
                    <div class="${borderClass} right"></div>
                    <div class="${borderClass} bottom"></div>
                    <div class="${borderClass} left"></div>
                    <ul class="${animationClass}"></ul>
                </div>`;
            let btnHtml = `<button class="btn-67373 btn-67373-outline">开始${self.lotteryName}</button>`;
            self.$lotteryModal = self.LotteryModal.initModal(self.lotteryName, lotteryHtml, btnHtml);
            self.$lotteryAnimation = self.$lotteryModal.querySelector(`ul.${animationClass}`);
            self.$lotteryTitle = self.$lotteryModal.querySelector('.modal-67373-title');
            self.$lotteryModal.querySelector('.modal-67373-footer>button').onclick = function () {
                if (self.lotteryUsers.length) {
                    let $btn = this;
                    $btn.disabled = true;
                    let lastWinner = self.$lotteryAnimation.querySelector(`.${winnerClass}`);
                    if (lastWinner) {
                        lastWinner.classList.remove(winnerClass);
                    }
                    let winner = Math.floor(Math.random()*self.lotteryUsers.length);
                    let duration = 300 + (winner >= 200 ? 10000 : winner*50);
                    let easing = duration < 1500 ? 'linear' : (duration < 5000 ? 'ease' : 'ease-in-out');
                    self.$lotteryAnimation.animate(
                        [
                            {marginTop: "72px"}, 
                            {marginTop: `${72-winner*24}px`}
                        ],
                        { 
                            duration: duration,
                            fill: 'forwards',
                            easing: easing
                        }
                        ).onfinish = function() {
                            self.$lotteryAnimation.children[winner].classList.add(winnerClass);
                            $btn.disabled = false;
                        };
                }
            };
        }        
    }

    addLotteryUser (name) {
        if (!this.lotteryUsers.includes(name)) {
            this.lotteryUsers.push(name);
            this.insertUserToAnimation(name);
            this.$lotteryTitle.innerText = `共有${this.lotteryUsers.length}名观众参与${this.lotteryName}`;
        }
    }

    insertUserToAnimation (name) {
        let item = document.createElement('li');
        item.className = 'flex-67373-center';
        item.innerText = name;
        this.$lotteryAnimation.appendChild(item);        
    }

    clearLotteryUsers () {
        this.lotteryUsers.length = 0;
        this.$lotteryAnimation.animate([{marginTop: "72px"}],{fill: 'forwards'});
        this.$lotteryAnimation.innerHTML = '';
        this.$lotteryTitle.innerText = `共有0名观众参与${this.lotteryName}`;
    }

    reloadLotteryUsers (names) {
        this.clearLotteryUsers();
        if (Array.isArray(names)) {
            this.lotteryUsers = names.slice();
            names.forEach(name => this.insertUserToAnimation(name));
            this.$lotteryTitle.innerText = `共有${names.length}名观众参与${this.lotteryName}`;
        }
    }
}