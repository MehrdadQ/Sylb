export function debounce(func: (...args: any[]) => void, wait: number, immediate: boolean) {
	let timeout: NodeJS.Timeout | null;

	return function(this: any, ...args: any[]) {
		const context = this;

		const later = function() {
			timeout = null;
			if (!immediate) {
				func.apply(context, args);
			}
		};

		const callNow = immediate && !timeout;
		clearTimeout(timeout!);
		timeout = setTimeout(later, wait);

		if (callNow) {
			func.apply(context, args);
		}
	};
}

const courseEmojis = {
  CSC: "💻",
  BIO: "🧬",
  MAT: "📐",
  HIS: "📜",
  PSY: "🧠",
  ECO: "💰",
  ENG: "📚",
  POL: "🏛️",
  CHM: "🧪",
  ANT: "🌐",
  RSM: "💼",
  AER: "✈️",
  ARC: "🏛️",
  FAH: "🎨",
  MDS: "🎥",
  BCH: "⚗️",
  WDW: "🔒",
  WPL: "🏫",
  CHE: "🔬",
  MIE: "🔧",
  BME: "⚕️",
  ECE: "🔌",
  CIV: "🏗️",
  APS: "🔬",
  ESC: "🛰️",
  ENV: "🌿",
  CIN: "🎬",
  MGT: "💼",
  GGR: "🗺️",
  ESS: "🌋",
  CHL: "⚕️",
  CDN: "🍁",
  NMC: "🕌",
  INF: "📚",
  UNI: "🗞️",
  SPA: "🇪🇸",
  FRE: "🇫🇷",
  LGG: "🇰🇷",
  LIN: "🗣️",
  GER: "🇩🇪",
  ITA: "🇮🇹",
  FSL: "🇫🇷",
  GRK: "🇬🇷",
  LAW: "⚖️",
  MGM: "💼",
  TMU: "🎵",
  VPM: "🎵",
  MUZ: "🎵",
  PHL: "🤔",
  KPE: "🏋️",
  PHY: "🌌",
  RLG: "🛐",
  SOC: "👥",
  STA: "📈",
  DRM: "🎭",
  WGS: "👩",
};

export const getCourseEmoji = (code: string | undefined) => {
  const defaultEmoji = "📚";
  if (!code) return defaultEmoji;
  return code in courseEmojis ? courseEmojis[code as keyof typeof courseEmojis] : defaultEmoji;
}


export const timeAgo = (date: Date | number | null): string => {
  if (!date) {
    return '';
  }
  const now = new Date().getTime();
  const time = new Date(date).getTime();
  const diff = now - time;

  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const month = 30 * day;

  if (diff < minute) {
    return `Submitted just now`;
  } else if (diff < hour) {
    const minutesAgo = Math.floor(diff / minute);
    return `Submitted ${minutesAgo} minute${minutesAgo > 1 ? 's' : ''} ago`;
  } else if (diff < day) {
    const hoursAgo = Math.floor(diff / hour);
    return `Submitted ${hoursAgo} hour${hoursAgo > 1 ? 's' : ''} ago`;
  } else if (diff < month) {
    const daysAgo = Math.floor(diff / day);
    return `Submitted ${daysAgo} day${daysAgo > 1 ? 's' : ''} ago`;
  } else {
    const monthsAgo = Math.floor(diff / month);
    return `Submitted ${monthsAgo} month${monthsAgo > 1 ? 's' : ''} ago`;
  }
};