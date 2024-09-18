// 摩斯密碼對應表
const morseCodeMap = {
  'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.', 
  'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
  'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.', 
  'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-', 
  'Y': '-.--', 'Z': '--..', '1': '.----', '2': '..---', '3': '...--', 
  '4': '....-', '5': '.....', '6': '-....', '7': '--...', '8': '---..', 
  '9': '----.', '0': '-----', ' ': ' / '
};

const reverseMorseCodeMap = Object.fromEntries(
  Object.entries(morseCodeMap).map(([letter, morse]) => [morse, letter])
);

// 文字轉換成摩斯密碼
function textToMorse(text) {
  return text.toUpperCase().split('').map(char => morseCodeMap[char] || '').join(' ');
}

// 摩斯密碼轉換成文字
function morseToText(morse) {
  return morse.split(' ').map(code => reverseMorseCodeMap[code] || '').join('');
}

// 播放摩斯密碼
function playMorse(morse) {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.type = 'sine';  // 使用正弦波
  oscillator.frequency.setValueAtTime(600, audioContext.currentTime);  // 設定頻率 (600 Hz)
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  oscillator.start();

  let index = 0;
  let timeOffset = audioContext.currentTime;

  function playNext() {
      if (index >= morse.length) {
          oscillator.stop(timeOffset);  // 停止聲音
          return;
      }

      const symbol = morse[index];
      if (symbol === '.') {
          gainNode.gain.setValueAtTime(1, timeOffset); // 短聲
          timeOffset += 0.1;  // 100ms for dot
      } else if (symbol === '-') {
          gainNode.gain.setValueAtTime(1, timeOffset); // 長聲
          timeOffset += 0.3;  // 300ms for dash
      } else if (symbol === ' ') {
          gainNode.gain.setValueAtTime(0, timeOffset);  // 空白，靜音
          timeOffset += 0.2;  // 200ms 空格
      } else if (symbol === '/') {
          gainNode.gain.setValueAtTime(0, timeOffset);  // 單詞之間的間隔，靜音
          timeOffset += 0.7;  // 700ms 單詞間隔
      }

      gainNode.gain.setValueAtTime(0, timeOffset);  // 結束聲音
      timeOffset += 0.1;  // 每個符號之間有 100ms 的靜音

      index++;
      playNext();
  }

  playNext();
}

// 綁定按鈕事件
document.getElementById('textToMorse').addEventListener('click', () => {
  const inputText = document.getElementById('inputText').value;
  document.getElementById('morseCode').value = textToMorse(inputText);
});

document.getElementById('morseToText').addEventListener('click', () => {
  const morseCode = document.getElementById('morseCode').value;
  document.getElementById('inputText').value = morseToText(morseCode);
});

document.getElementById('playMorse').addEventListener('click', () => {
  const morseCode = document.getElementById('morseCode').value;
  playMorse(morseCode);
});