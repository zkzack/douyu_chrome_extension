	'use strict'

	const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
	
	const Constant67373 = {
		YoutubeIds: ['AMX002S','陈一发儿','Aileen Almodovar'],
		TwitchIds: ['amx002s','thebs_chen'],
		TtvTargetAttr: 'data-a-target',
		TtvUserAttr: 'data-a-user'
	}

	const Util67373 = {
		injectJS: (src) => {
			let s = document.createElement('script');
			s.src = chrome.runtime.getURL(src);
			s.onload = function () {
				s.parentNode.removeChild(s);
			};
			(document.head || document.documentElement).appendChild(s);			
		},
		firstDetected: ($node) => {
			let detectedAttrName = 'data-67373-detected';
			let attr = $node.getAttribute(detectedAttrName);
			if (!attr) {
				$node.setAttribute(detectedAttrName, 1);
				return true;
			}
			return false;
		},		
		nonBlankStr: (text) => {
			return typeof text === 'string' && /\S/.test(text);
		}
	}

	const Dy67373 = {
		videoId: 'js-player-video',
		toolbarId: 'js-player-toolbar',
		danmuSide: '#js-barrage-list',
		danmuUserNameClass: 'danmu-67373-dy-user-name',
		barrageBanner: '#js-player-barrage .BarrageBanner',
		giftEffect: '#js-player-barrage .GiftEffect-box',
		enterEffect: '#js-player-asideMain .EnterEffect',
		treasure: '#js-player-asideMain .TreasureWrap',
		roomTitle: '.Title-header',
		nobles: ['游侠', '骑士', '子爵', '伯爵', '公爵', '国王', '皇帝', '超级皇帝', '幻神'],
		nameColors: ['brown', 'pink', 'yellow', 'red', 'violet'],
		msgTargets: ['content','inject'],
		tabContentClass: 'tab-67373-content',
		numInClass: (className, separator = '-') => {
			return className.slice(className.lastIndexOf(separator) + separator.length);
		},
		levelColor: (level) => {
			return `dy-level-${level < 15 ? 1 : (level < 30 ? 15 : Math.floor(level/10)*10)}`;
		},
		recordDanmu: (name, danmu, colorIndex, level = 0, nobleLevel = -1) => {
			let levelStr = level > 0 ? `<strong>[${level}]</strong>` : '';
			let timeStr = new Date().toLocaleTimeString();
			let $r = $(`
				<div>[${timeStr}]${levelStr}<span> ${name}</span>${danmu}</div>
			`).prependTo($(`#${Dy67373.tabContentClass}-${Dy67373.tabNames[1]}`));
			$r.find('span').addClass(`${Dy67373.nameColors[colorIndex]}-67373`);
			if (level > 0)
				$r.find('strong').addClass(Dy67373.levelColor(level));
			if (nobleLevel >= 3)
				$r.find('span').addClass(`bg-noble-${nobleLevel}`);
		},
		msgData: [
			{ target: 'inject' },
			{ target: 'content' }
		],
		tabNames : ['gift', 'danmu'],
		sendConfig: (config) => {
			window.postMessage(Object.assign({
				config: config
			}, Dy67373.msgData[0]), '*');
		}
	};

	const Config67373 = {};
	const Data67373 = {};