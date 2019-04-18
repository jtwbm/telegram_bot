const TelegramBot = require('node-telegram-bot-api')
const request = require('request')

// replace the value below with the Telegram token you receive from @BotFather
const token = '823135240:AAH6VwxWwkbis_jVT1idWRGAnywfc8RyOXs'

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true })

let answers = {}; // здесь будут записываться ответы в формате chatID: [word, assication]

let gameState = 0; // статус игры, 0 - игра не запущена, 1 - игра запущена

let wordIndex = 0;

bot.onText(/\/go/, (msg, match) => {

  const chatId = msg.chat.id;

  const welcomeText = `Мамин Креативщик начинает игру в ассоциации. Ты готов?`;

  bot.sendMessage(chatId, welcomeText, {
     reply_markup: {
      inline_keyboard: [
        [
          {
            text: 'Готов!',
            callback_data: 'yes'
          },
          {
            text: 'Не',
            callback_data: 'no'
          }
        ]
      ]
    }
  });
});

bot.onText(/\/stop/, (msg, match) => {

  const chatId = msg.chat.id;

  const byeText = gameState === 1 ? 'ок' : 'Игра и так не запущена, ты чего';

  gameState = 0;

  bot.sendMessage(chatId, byeText);
});

bot.on('callback_query', query => {
    const id = query.message.chat.id
    const iDo = query.data
    const words = getWords();

    if(iDo === 'yes') {
      bot.sendMessage(id, 'Тогда погнали! Твое первое слово:')
      bot.sendMessage(id, words[wordIndex])
      gameState = 1;
    } else {
      bot.sendMessage(id, getRules(), { parse_mode: 'Markdown' });
      gameState = 0;
    }
})

bot.on('message', (msg) => {
  const chatId = msg.chat.id;

  if(gameState == 1 && msg.text != '/stop') {
    answers[chatId] = [getWords()[wordIndex], msg.text];
    ++wordIndex;
    bot.sendMessage(chatId, getWords()[wordIndex])
  }
})

function getWords() {
  if(this.currentIndex === undefined) {
    this.currentIndex = 0;
  }
  return ['год', 'человек', 'время', 'дело', 'жизнь', 'день', 'рука', 'работа'];
}

function getRules() {
  return `*Ассоциация* - интеллектуальная игpа в  слова для двух команд по два человека. Поэтому сначала следует найти ещё троих хороших и умных людей и предложить им  сыграть  в ассоциацию. Если они  не  умеют, то читайте краткое описание правил. https://ma-vijaya.livejournal.com/207075.html`;
}