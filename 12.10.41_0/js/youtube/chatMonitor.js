'use strict';

const YtChat = {
	btnParentId: 'primary-content',
	authorSelector: '#input-container #author-name',
	lottery: new Lottery('弹幕抽奖'),
	stickerSelector: '#purchase-amount-chip',
	msgSelector: '#purchase-amount',
	chatTags: ['YT-LIVE-CHAT-TEXT-MESSAGE-RENDERER', 
		'YT-LIVE-CHAT-PAID-MESSAGE-RENDERER', 
		'YT-LIVE-CHAT-PAID-STICKER-RENDERER',
		'YT-LIVE-CHAT-MEMBERSHIP-ITEM-RENDERER'],
	insertLotteryBtn: function (chatDocument) {
		let $btnParent = chatDocument.getElementById(this.btnParentId);
		let $author = chatDocument.querySelector(this.authorSelector);
		if ($btnParent && Util67373.firstDetected($btnParent) 
			&& $author && Constant67373.YoutubeIds.includes($author.innerText)
			) {
			this.lottery.insertLotteryModalBtn($btnParent);
		}
	},
	monitorChat: function ($target) {
		new MutationObserver((mutations) => {
				mutations.forEach(m => {
					m.addedNodes.forEach($node => {
						if ($node.nodeType === Node.ELEMENT_NODE) {
							//console.log($node.tagName);
							if (this.lottery.$lotteryModal && this.chatTags.includes($node.tagName)) {
								let $authorName = $node.querySelector('#author-name');
								if ($authorName)
									this.lottery.addLotteryUser($authorName.innerText);
							}
							if ($node.tagName === this.chatTags[2]) {
								this.convert($node, this.stickerSelector);
							} else if ($node.tagName === this.chatTags[1]) {
								this.convert($node, this.msgSelector);
							}
						}
					});
				});
			}).observe($target, { childList : true, subtree: true });
	},
	convert: function ($node, selector) {
		let $amount = $node.querySelector(selector);
		if ($amount && Util67373.firstDetected($amount)) {
			let currencyText = $amount.innerText;
			let currency = DefaultRates.find(c => currencyText.startsWith(c.symbol) || currencyText.startsWith(c.code));
			if (currency && Number.isFinite(currency.rate) && currency.rate > 0) {
				let matches = currencyText.replaceAll(',', '').match(/\d+\.*\d*/);
				if (matches) {
					let number = Number(matches[0]);
					if (Number.isFinite(number)) {
						let cnyText = `${currency.name}（${(number/currency.rate).toFixed(2)}元）`;
						if (selector === this.stickerSelector) {
							let $cny = document.createElement('div');
							$cny.innerText = cnyText;
							$cny.style.position = 'absolute';
							$cny.style.width = '35%';
							$cny.style.color = 'var(--yt-live-chat-paid-sticker-chip-text-color)';
							$cny.style.fontSize = '15px';
							$cny.style.fontWeight = '500';
							$amount.parentElement.parentElement.appendChild($cny);
						} else {
							$amount.innerText = `${currencyText}${cnyText}`;
						}
					}
				}
			}
		}
	}
}