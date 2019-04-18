// Matches "/echo [whatever]"
bot.onText(/\/curse/, (msg, match) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message

  const chatId = msg.chat.id
  // const resp = match[1] // the captured "whatever"

  // send back the matched "whatever" to the chat
  bot.sendMessage(chatId, 'Выберите валюту:', {
  	reply_markup: {
  		inline_keyboard: [
  			[
  				{
  					text: '€ EUR',
  					callback_data: 'EUR'
  				},
  				{
  					text: '₽ RUR',
  					callback_data: 'RUR'
  				},
  				{
  					text: '$ USD',
  					callback_data: 'USD'
  				},
  				{
  					text: '₿ BTC',
  					callback_data: 'BTC'
  				}
  			]
  		]
  	}
  })
})

bot.on('callback_query', query => {
  	const id = query.message.chat.id
  	const currency = query.data

  	request('https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5', function (error, response, body) {
  		const data = JSON.parse(body)
  		const result = data.filter(item => item.ccy === currency)[0]
  		const resultText = `
			*${result.ccy} => ${result.base_ccy}:*

			Покупка: _${result.buy}_
			Продажа: _${result.sale}_
  		`

  		console.log(result)

  		bot.sendMessage(id, resultText, { parse_mode: 'Markdown' })
  })
})

// Listen for any kind of message. There are different kinds of
// messages.
// bot.on('message', (msg) => {
//   const chatId = msg.chat.id

//   // send a message to the chat acknowledging receipt of their message
//   bot.sendMessage(chatId, 'Received your message')
// })