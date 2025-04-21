// FarsiType Modernized Version
// Author: Refactored from legacy script
// License: GPL

class FarsiType {

  static farsiKey = [
    32, 33, 34, 35, 36, 37, 1548, 1711, 41, 40, 215, 43, 1608, 45, 46, 47,
    48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 1705, 44, 61, 46, 1567,
    64, 1616, 1584, 125, 1609, 1615, 1609, 1604, 1570, 247, 1600, 1548, 47, 8217, 1583, 215,
    1563, 1614, 1569, 1613, 1601, 8216, 123, 1611, 1618, 1573, 126, 1580, 1688, 1670, 94, 95,
    1662, 1588, 1584, 1586, 1740, 1579, 1576, 1604, 1575, 1607, 1578, 1606, 1605, 1574, 1583, 1582,
    1581, 1590, 1602, 1587, 1601, 1593, 1585, 1589, 1591, 1594, 1592, 60, 124, 62, 1617
  ];

  static enNUM = [48, 49, 50, 51, 52, 53, 54, 55, 56, 57];

  static convertString(text) {
    return Array.from(text).map(char => {
      const code = char.charCodeAt(0);
      if (code < 128 && FarsiType.farsiKey[code - 32] !== undefined) {
        return String.fromCharCode(FarsiType.farsiKey[code - 32]);
      }
      return char;
    }).join('');
  }


  constructor(config = {}) {
    this.farsiKey = FarsiType.farsiKey;
    this.enNUM = FarsiType.enNUM;
    this.Type = true;
    this.counter = 0;
    this.ShowChangeLangButton = config.showLangButton || false;
    this.ChangeDir = config.changeDir || false;
    this.patternFA = config.patternFA ?? true;

    this.init();
  }

  init() {
    const inputs = [...document.querySelectorAll('input[type="text"], input[type="tel"], input[type="number"]')];
    const textareas = [...document.querySelectorAll('textarea')];
    const fields = inputs.concat(textareas);

    fields.forEach((field) => {
      const lang = field.lang.toLowerCase();
      if (lang === 'fa' || lang === 'fa-ir') {
        this.counter++;
        this.attachHandlers(field, this.counter);
      }
    });
  }

  attachHandlers(el, index) {
    if (this.ShowChangeLangButton) {
      const langBtn = document.createElement('button');
      langBtn.textContent = 'FA';
      langBtn.style.cssText = 'margin:2px; padding:2px; font-size:12px';
      langBtn.addEventListener('click', () => this.toggleLang(el, langBtn));
      el.insertAdjacentElement('afterend', langBtn);
    }

    if (this.ChangeDir) {
      const dirBtn = document.createElement('button');
      dirBtn.textContent = 'RTL';
      dirBtn.style.cssText = 'margin:2px; padding:2px; font-size:12px';
      dirBtn.addEventListener('click', () => this.toggleDirection(el, dirBtn));
      el.insertAdjacentElement('afterend', dirBtn);
    }

    el.dataset.farsi = true;
    el.style.direction = 'rtl';
    el.style.textAlign = 'right';

    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      el.addEventListener('keyup', (e) => this.handleMobileInput(e, el));
    } else {
      el.addEventListener('keydown', (e) => this.handleKeydown(e, el)); // for shortcut
      el.addEventListener('keypress', (e) => this.handleKeypress(e, el));
    }
  }

  toggleLang(el, btn) {
    const isFarsi = el.dataset.farsi === 'true';
    el.dataset.farsi = (!isFarsi).toString();
    btn.textContent = isFarsi ? 'EN' : 'FA';
    el.style.direction = isFarsi ? 'ltr' : 'rtl';
    el.style.textAlign = isFarsi ? 'left' : 'right';
    el.focus();
  }

  toggleDirection(el, btn) {
    const current = el.style.direction;
    const newDir = current === 'rtl' ? 'ltr' : 'rtl';
    el.style.direction = newDir;
    el.style.textAlign = newDir === 'rtl' ? 'right' : 'left';
    btn.textContent = newDir.toUpperCase();
    el.focus();
  }

  handleKeydown(e, el) {
    if (e.ctrlKey && e.code === 'Space') {
      e.preventDefault();
      const isFarsi = el.dataset.farsi === 'true';
      el.dataset.farsi = (!isFarsi).toString();
      el.style.direction = isFarsi ? 'ltr' : 'rtl';
      el.style.textAlign = isFarsi ? 'left' : 'right';
      el.focus();
    }
  }

  handleKeypress(e, el) {
    if (!this.Type || 
          el.dataset.farsi !== 'true' || 
          el.getAttribute('nomask') === 'true'
       ) return;

    const key = e.keyCode || e.which;
    if (e.ctrlKey && key === 32) {
      e.preventDefault();
      return;
    }

    if (key < 128) {
      let mappedKey = this.farsiKey[key - 32];
      if (mappedKey !== undefined) {
        e.preventDefault();
        this.insertChar(el, String.fromCharCode(mappedKey));
      }
    }
  }

  handleMobileInput(e, el) {
    if (!this.Type || 
          el.dataset.farsi !== 'true' || 
          el.getAttribute('nomask') === 'true'
       ) return;

    const cursorPos = el.selectionStart - 1;
    const char = el.value[cursorPos];
    if (!char) return;

    const code = char.charCodeAt(0);
    let mappedKey = this.farsiKey[code - 32];
    if (mappedKey !== undefined) {
      el.value = el.value.substring(0, cursorPos) + String.fromCharCode(mappedKey) + el.value.substring(cursorPos + 1);
      this.setCursor(el, cursorPos + 1);
    }
  }

  insertChar(el, char) {
    const start = el.selectionStart;
    const end = el.selectionEnd;
    el.value = el.value.substring(0, start) + char + el.value.substring(end);
    this.setCursor(el, start + char.length);
  }

  setCursor(el, pos) {
    el.setSelectionRange(pos, pos);
    el.focus();
  }

}

// Export for bundlers (ESM/CommonJS)
export { FarsiType };

// Export for browsers (global `window.FarsiType`)
if (typeof window !== 'undefined') {
  window.FarsiType = FarsiType;
}