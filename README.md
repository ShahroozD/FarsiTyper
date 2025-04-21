# FarsiTyper Modern (v1.0)

FarsiTyper is a modern JavaScript utility that allows Persian (Farsi) text typing on English keyboards. It supports dynamic character conversion, direction toggling (RTL/LTR), and real-time input enhancement on `<input>` and `<textarea>` elements with `lang="fa"`.

---

## 🚀 Features

- 🔤 Realtime Farsi keyboard emulation
- 🔁 Direction toggle: RTL ↔️ LTR
- 🌐 Language toggle button (FA / EN)
- 📱 Mobile and desktop compatible
- 🧠 Static conversion method (`convertString`) for non-DOM text processing
- 📦 Available via NPM and browser build

---

## 📦 Installation

### Option 1: NPM (Recommended for bundlers)
```bash
npm install farsityper
```

### Option 2: Browser (via `<script>` tag)
Download or include the built file:
```html
<script src="dist/farsityper.min.js"></script>
```

---

## 🛠️ Usage

### 🧬 Initialization (DOM fields)
```js
import { FarsiTyper } from 'farsityper';

window.addEventListener('DOMContentLoaded', () => {
  const farsiTyper = new FarsiTyper({
    showLangButton: true,   // Show FA/EN toggle button
    changeDir: true,        // Show RTL/LTR direction button
    patternFA: true         // Convert digits and characters fully
  });
});
```

Or in browser:
```html
<script>
  const farsiTyper = new FarsiTyper({ showLangButton: true });
</script>
```

Add `lang="fa"` or `lang="fa-ir"` to any `<input>` or `<textarea>` field to enable typing support.

```html
<input type="text" lang="fa" placeholder="Type Farsi here...">
<textarea lang="fa"></textarea>
```

---

## 🧪 Static String Conversion
You can convert any English-typed Farsi string directly without touching the DOM:

```js
import { FarsiTyper } from 'farsityper';

const input = "sghl"; // User typed this using English layout
const result = FarsiTyper.convertString(input);
console.log(result); // Output: "سلام"
```

Or in browser:
```html
<script>
  const result = FarsiTyper.convertString("sghl");
  console.log(result); // "سلام"
</script>
```

> This method does not require creating an instance of `FarsiTyper` and does **not** attach any DOM listeners.

---

## ⌨️ Keyboard Shortcut
- Press **Ctrl + Space** in an active Farsi field to toggle between FA/EN mode (works via `keydown`)

---

## 🔘 Disable Farsi Conversion for Specific Inputs
Use `nomask="true"` on any input/textarea to prevent character conversion:

```html
<input type="text" lang="fa" nomask="true" placeholder="No Farsi conversion here...">
```

---

## 📱 Mobile Support
The script automatically detects mobile devices and switches to `keyup`-based processing.

---

## 🔐 License

GPL - Free to use, modify, and distribute under the terms of the GNU General Public License.

---

## 🙌 Credits
Originally inspired by Kaveh Ahmadi's `farsityper`, now refactored and modernized.