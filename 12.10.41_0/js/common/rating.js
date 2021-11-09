class Rating {
    constructor () {
        this.initiated = false;
        this.ConfirmModal = new Modal();
        this.$confirmModal;
        this.start = false;
        this.$input;
        this.RatingModal = new Modal();
        this.$ratingModal;
        this.totalScore = 0;
        this.ratingUsers = [];
        this.ratingVotes = [
            { text: "1+", count: 0 },
            { text: "2+", count: 0 },
            { text: "3+", count: 0 },
            { text: "4+", count: 0 },
            { text: "5+", count: 0 },
            { text: "6+", count: 0 },
            { text: "7+", count: 0 },
            { text: "8+", count: 0 },
            { text: "9+", count: 0 },
            { text: "10", count: 0 }
        ];
        this.$filmName;
        this.$score;
        this.$star;
        this.$rater;
        this.$stopBtn;
    }

    insertRatingModalBtn ($parent) {
        let self = this;
        self.initConfirmModal();
        self.initRatingModal();
        let $btn = self.RatingModal.insertModalBtn($parent, '评分');
        if ($btn) {
            $btn.style.marginLeft = '.75rem';
            $btn.onclick = () => {
                let modal = this.initiated ? self.RatingModal : self.ConfirmModal;
                modal.modalToggle();
            };
        }
        return $btn;
    }

    initConfirmModal () {
        if (this.$confirmModal) {
            this.clearConfirmModal();
        } else {
            let self = this;
            let filmNameHtml = `
                <div class="flex-67373-center" style="width: 90%; margin: 1rem auto;">
                    <input class="form-67373-control" placeholder="请输入电影名称" maxlength="50"/>
                </div>`;
            let btnHtml = `
                <button class="btn-67373 btn-67373-gold">确定</button>
                <button class="btn-67373" style="margin-left: 3rem">取消</button>`;
            self.$confirmModal = self.ConfirmModal.initModal('评分发起确认', filmNameHtml, btnHtml);
            self.$input = self.$confirmModal.querySelector('input');
            let $confirmBtn = self.$confirmModal.querySelector('button.btn-67373-gold');
            $confirmBtn.onclick = function () {
                self.initiated = true;
                self.start = true;            
                self.$filmName.innerText = Util67373.nonBlankStr(self.$input.value) ? self.$input.value : '418094影评';
                self.clearRating();
                self.$confirmModal.style.display = "none";
                self.$ratingModal.style.display = "block";
            };
            $confirmBtn.nextElementSibling.onclick = function () {
                self.$confirmModal.style.display = "none";
            };
        }
    }

    clearConfirmModal () {
        this.initiated = false;
        this.start = false;
        this.$input.value = '';
    }

    initRatingModal () {
        if (this.$ratingModal) {
            this.clearRating();
        } else {
            let self = this;
            let votesHtml = '';
            for (let i=self.ratingVotes.length-1;i>=0;i--) {
                votesHtml+=`
                    <div class="rating-67373-vote-row">
                        <div class="flex-67373-center" style="width: 10%">${self.ratingVotes[i].text}</div>
                        <div class="flex-67373" style="width: 90%">
                            <div class="rating-67373-vote-rectangle"></div>
                            <div class="flex-67373-center" style="width: 20%">0.0%</div>
                        </div>
                    </div>`;
            }
            let ratingHtml = `
                <div class="flex-67373-center">
                    <div class="flex-67373-center" style="width: 25%">
                        <div><span class="rating-67373-score">0.0</span><span>/10</span></div>
                    </div>
                    <div class="flex-67373-vertical" style="width: 45%">
                        <div class="rating-67373-star">
                            <div class="rating-67373-star-top" style="width: 0%"><span>★</span><span>★</span><span>★</span><span>★</span><span>★</span></div>
                            <div class="rating-67373-star-bottom"><span>★</span><span>★</span><span>★</span><span>★</span><span>★</span></div>
                        </div>
                        <div class="rating-67373-rater dy-noble-1">共有0人评分</div>
                    </div>
                </div>
                <div class="flex-67373-vertical"><div class="rating-67373-divider"></div>${votesHtml}</div>`;
            let btnHtml = `<button class="btn-67373 btn-67373-gold">重新开始</button>
                            <button class="btn-67373" style="margin-left: 3rem">停止评分</button>`;
            self.$ratingModal = self.RatingModal.initModal('', ratingHtml, btnHtml);
            self.$filmName = self.$ratingModal.querySelector('.modal-67373-title');
            self.$score = self.$ratingModal.querySelector('span.rating-67373-score');
            self.$star = self.$ratingModal.querySelector('div.rating-67373-star-top');
            self.$rater = self.$ratingModal.querySelector('div.rating-67373-rater');
            let voteRows = self.$ratingModal.querySelectorAll('div.rating-67373-vote-row');
            voteRows.forEach($row => {
                let vote = self.ratingVotes.find(v => v.text === $row.firstElementChild.innerText);
                vote.$rectangle = $row.querySelector('div.rating-67373-vote-rectangle');
            });
            let $restart = self.$ratingModal.querySelector('button.btn-67373-gold');
            $restart.onclick = function () {
                self.$ratingModal.style.display = "none";
                self.$confirmModal.style.display = "block";
            };
            self.$stopBtn = $restart.nextElementSibling;
            self.$stopBtn.onclick = function () {
                self.start = false;
                self.$stopBtn.disabled = true;
            };
        }
    }

    addRating (name, scoreStr) {
        if (!this.ratingUsers.includes(name)) {
            let score = Number(scoreStr);
            if (Number.isFinite(score) && score >= 1 && score <= 10) {
                this.totalScore += score;
                this.ratingUsers.push(name);
                let total = this.ratingUsers.length;
                let avg = this.totalScore / total;
                this.$score.innerText = avg.toFixed(1);
                this.$star.style.width = `${10*avg}%`;
                this.$rater.innerText = `共有${total}人评分`;
                this.ratingVotes[Math.trunc(score) - 1].count += 1;
                this.ratingVotes.forEach(v => {
                    let rate = v.count/total;
                    v.$rectangle.style.width = `${80*rate}%`;
                    v.$rectangle.nextElementSibling.innerText = `${(100*rate).toFixed(1)}%`;
                });
            }
        }
    }

    clearRating () {
        this.totalScore = 0;
        this.ratingUsers.length = 0;
        this.$score.innerText = '0.0';
        this.$star.style.width = '0%';
        this.$rater.innerText = '共有0人评分';
        this.ratingVotes.forEach(v => {
            v.count = 0
            v.$rectangle.style.width = '0%';
            v.$rectangle.nextElementSibling.innerText = '0.0%';
        });
        this.$stopBtn.disabled = false;
    }
}