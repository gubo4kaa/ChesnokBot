setInterval(() => {//Ежедневная очистка списков
    resetArr()
}, 86400000);
const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const _ = require('lodash');
const token = '2060417710:AAEsehwBSypT3EFe44qH6OPBrZmKLBm-_BI';//токен
//Клавиатуры
const key_back = [//Клава главного меню
    [
        {
            text: `\ud83c\udf78Меню`,
        },
        {
            text: '\ud83d\udce3 Акции',
        },
    ],
    [
        {
            text: '\ud83d\udd67 Бронь',
        },
        {
            text: '\ud83c\udfae Игра',
        },
    ],
    [
        {
            text: '\ud83d\udde3 Оставить отзыв',
        },
    ],
];
const key_review = [//клава отзыва
    [
        {
            text: '\ud83d\ude21'
        },
        {
            text: '\ud83d\ude12'
        },
        {
            text: '\ud83d\ude10'
        }, 
        {
            text: '\ud83d\ude0a'
        },
        {
            text: '\u2764\ufe0f'
        },   
    ],
    [
        {text: `Назад`}
    ],
];
const key_game = [[//Клава рулетки
    {
        text: 'Крутить рулетку'
    }],
    [{
        text: 'Назад'
    }]
];
const key_admin = [//Клава админа
   
    [
        {
            text: 'Колл. Юзеров',
        },
        {
            text: 'Отзывы',
        },
        {
            text: 'Статистика оценок',
        },
    ],
    [
        {
            text: 'Статист. игр'
        },
        {
            text: 'Игры'
        },
    ],
    [
        {
            text: 'Рулетка вкл/выкл',
        },
        {
            text: 'Admin Exit',
        },
    ], 
];

//запись в файл
function readData() {
    let jsonObj = fs.readFileSync('users.json')
    arrUsers = JSON.parse(jsonObj);
}

function saveData(a) {
    if (arrUsers.includes(a.chat.id) === false) {
        arrUsers.push(a.chat.id)
        let usersJson = JSON.stringify(arrUsers)
        fs.writeFile('users.json', usersJson,function(){})
        console.log(arrUsers)
    }
    
}

function readStatisticSmileGame() {
    let jsonObjSmile = fs.readFileSync('statisticSmaile.json')
    arrReviewNamber = JSON.parse(jsonObjSmile);
}

function saveStatisticSmileGame() {
    let StatisticSmileGameJson = JSON.stringify(arrReviewNamber)
    fs.writeFile('statisticSmaile.json', StatisticSmileGameJson,function(){})
}

function readReview() {
    let jsonObjreview = fs.readFileSync('review.json')
    arrTextreview = JSON.parse(jsonObjreview);
}
function saveReview() {
    let reviewJson = JSON.stringify(arrTextreview)
    fs.writeFile('review.json', reviewJson,function(){})
}
function arrReviev10(a) {
    for(i = 1;i <= 9; i++) {
        a.push(arrTextreview[arrTextreview.length - i])
    }
    
}

//Все списки и переменные
let arrUsers = [];//Список юзеров бота
let arrTodayUseersReview = [];//Юзеры которые сегодня оставили отзыв*
let arrTextreview = [];//Список текстов
let arrTextreviewLast = [];//Список поледних 10 отзывов
let gameUsersPresent = {};// Объект игравших сегдня челов*
let gameCaunterToday = 0;//Счётчик игравших сегодня людей
let gameCaunter = 0;//Счётчик игр за всё время
let gameCaunterBingoToday = 0;//Колличество призов за сегодня
let gameCaunterBingo = 0;//Колличество призов за всё время
let arrPresent = [];// Выигранные призы
let arrTunglerReview = [];// Список для переключателя ревью
let arrReviewNamber = [0,0,0,0,0]//Список Колличества отзывов по смайликам
let gameOn = true;//Выключатель рулетки
let gameTungler = [];
let arrAdmin = [];//Список айдишников Админов




// }); // Сохранение в файл


//отзывы



function reviewFuncNamber(a) {
    readStatisticSmileGame()
    if (arrTodayUseersReview.includes(a.chat.id) === false) {
        saveData(a)
        
        
    }
    switch (a.text) {
        case '\ud83d\ude21':
            arrReviewNamber[0] +=1;
            saveStatisticSmileGame()
            break
        case '\ud83d\ude12':
            arrReviewNamber[1] +=1;
            saveStatisticSmileGame()
            break
        case '\ud83d\ude10':
            arrReviewNamber[2] +=1;
            saveStatisticSmileGame()
            break
        case '\ud83d\ude0a':
            arrReviewNamber[3] +=1;
            saveStatisticSmileGame()
            break
        case '\u2764\ufe0f':
            arrReviewNamber[4] +=1;
            saveStatisticSmileGame()
            break
   }
   arrTunglerReview.push(a.chat.id)
   bot.sendMessage (a.chat.id , `Напишите почему вы поставили именно такую оценку`,{
    parse_mode: 'Markdown',
    reply_markup: {
        remove_keyboard: true
    }
    })
   console.log(arrTodayUseersReview)
   arrTunglerReview.push(a.chat.id);
}
let review_tungler = false;
let review_tungler_anonim = false;
//Рандомайзер


function deleteUsers(array,userId) {
    const index = array.indexOf(userId);
    if (index > -1) {
    array.splice(index, 1);
    }
}


function randomGame(a)  {
    if (arrTodayUseersReview.includes(a.chat.id) === false) {
        saveData(a)
    }
    let user_name = a.from.id; 
    
    let randomNamberGame = Math.floor(Math.random() * 100);
    let randomNamberGameVin = Math.floor(Math.random() * 100);
    if (randomNamberGameVin >=1 && randomNamberGameVin <=70) {
        
        bot.sendMessage(a.chat.id, `Звук крутящейся рулетки...`)
        
        setTimeout(() => {
            bot.sendMessage(a.chat.id, `Звучание трещётки умолкает...`)
        }, 1000);
        setTimeout(() => {
            bot.sendMessage(a.chat.id, `...`)
        }, 2000);
        setTimeout(() => {
            if (gameUsersPresent[user_name] === 'на сегодня только хорошее настроение') {
                bot.sendMessage(a.chat.id, `Вы выграли ${gameUsersPresent[user_name]}`)
            } else {
                bot.sendMessage(a.chat.id, `Вы выграли ${gameUsersPresent[user_name]}\nКод выйгрыша: ${a.chat.id}`)
                gameCaunterBingoToday ++
                gameCaunterBingo ++
            }
           
        }, 3000);
        if (randomNamberGame >=0 && randomNamberGame <=10) {
            let present = 'Авторский чай 700мл'
            arrPresent.push(present)
            gameUsersPresent[user_name] = present
        }else if (randomNamberGame >=11 && randomNamberGame <= 20) {
            let present = 'Мерч'
            arrPresent.push(present)
            gameUsersPresent[user_name] = present
        } else if (randomNamberGame >=21 && randomNamberGame <= 24) {
            let present = 'Бокал вина'
            arrPresent.push(present)
            gameUsersPresent[user_name] = present
        } else if (randomNamberGame >=25 && randomNamberGame <= 29) {
            let present = 'Виски с колой'
            arrPresent.push(present)
            gameUsersPresent[user_name] = present
        } else if (randomNamberGame >=30 && randomNamberGame <= 35) {
            let present = 'Лимонад 500мл'
            arrPresent.push(present)
            gameUsersPresent[user_name] = present
        } else if (randomNamberGame >=36 && randomNamberGame <= 40) {
            let present = 'Виски с колой или Бутылку пива'
            arrPresent.push(present)
            gameUsersPresent[user_name] = present
        } else if (randomNamberGame >=41 && randomNamberGame <= 45) {
            let present = 'Скидка на кальян 20%'
            arrPresent.push(present)
            gameUsersPresent[user_name] = present
        } else if (randomNamberGame >=46 && randomNamberGame <= 47) {
            let present = 'Скидка на кальян 50%'
            arrPresent.push(present)
            gameUsersPresent[user_name] = present
        } else if (randomNamberGame >=48 && randomNamberGame <= 58) {
            let present = 'Дополнительная наклейка чесночка'
            arrPresent.push(present)
            gameUsersPresent[user_name] = present
        } else if (randomNamberGame === undefined) {
            let present = 'на сегодня только хорошее настроение'
            gameUsersPresent[user_name] = present
        } else {
            let present = 'на сегодня только хорошее настроение'
            gameUsersPresent[user_name] = present
        } 
        gameCaunterToday = gameCaunterToday + 1;
        gameCaunter = gameCaunter + 1
        
    } else {
        bot.sendMessage(a.chat.id, `Звук крутящейся рулетки...`)
        setTimeout(() => {
            bot.sendMessage(a.chat.id, `Звучание трещётки умолкает...`)
        }, 1000);
        setTimeout(() => {
            bot.sendMessage(a.chat.id, `...`)
        }, 2000);
        setTimeout(() => {
            bot.sendMessage(a.chat.id, `Вы выграли ${gameUsersPresent[user_name]}`)
        }, 3000);
        let present = 'на сегодня только хорошее настроение'
        gameUsersPresent[user_name] = present
    }
    gameCaunterToday = gameCaunterToday + 1;
    gameCaunter = gameCaunter + 1
      
}

//Рассылка
const usersMailId = []

//включаем бота
const bot = new TelegramBot(token, {
    polling: true
});

bot.on('message', async (msg) => { //Превью сообщение и клавиатура
    readData(msg)
    const chatId = msg.chat.id; 
    
    if (review_tungler === true){
        console.log('я в кейсе с отзывом')
        switch(msg.text) {
            case '\ud83d\ude21':    
                reviewFuncNamber(msg)
                
                break
            case '\ud83d\ude12':
                reviewFuncNamber(msg)
                
                break
            case '\ud83d\ude10':
                reviewFuncNamber(msg)
                
                break
            case '\ud83d\ude0a':
                reviewFuncNamber(msg)
                
                break
            case '\u2764\ufe0f':
                reviewFuncNamber(msg)
                
                break    
        }
        review_tungler = false
    } else if (arrTunglerReview.includes(msg.chat.id)){
        console.log('Анонимный отзыв')
        readReview()
        arrTodayUseersReview.push(msg.chat.id)
        arrTextreview.push(msg.text)
        saveReview()
        deleteUsers(arrTunglerReview,chatId)
        bot.sendMessage (chatId , `Cпасибо за отзыв, \nПриятного отдыха!`,{
            parse_mode: 'Markdown',
            reply_markup: {
                keyboard: key_back
            }
        })
        deleteUsers(arrTunglerReview,chatId)
    } else if (arrAdmin.includes(msg.chat.id)){
        //Админ
        switch(msg.text) {
            case 'Admin Exit':
                bot.sendMessage(chatId, 'Ты вышел из админки)\nЗаходи ещё',
                    {reply_markup: {
                        keyboard: key_back
                    }}
                )
                deleteUsers(arrAdmin,chatId)
                break
               
            case 'Колл. Юзеров':
                bot.sendMessage(chatId, `Колл. Юзеров Бота: ${arrUsers.length}`,
                    {reply_markup: {
                        keyboard: key_admin
                    }}
                )
                break
            case 'Статист. игр':
                bot.sendMessage(chatId, `Колл. игр за сегодня: ${gameCaunterToday}\nКолл. игр за всё время: ${gameCaunter}\nКолл. призов за всё время: ${gameCaunterBingo}\nКолл. призов за всё время: ${gameCaunterBingoToday}`,
                    {reply_markup: {
                        keyboard: key_admin
                    }}
                )
                break
            case 'Игры':
                console.log(gameUsersPresent)
                bot.sendMessage(chatId, `Юзеры и их призы за сегодня ${JSON.stringify(gameUsersPresent)}`,
                    {reply_markup: {
                        keyboard: key_admin
                    }}
                )
                break
            case 'Отзывы':
                bot.sendDocument(chatId,'./review.json')
                arrReviev10(arrTextreviewLast)
                
                bot.sendMessage(chatId, `Последние 10 отзывов: ${arrTextreviewLast}`,
                    {reply_markup: {
                        keyboard: key_admin
                    }}
                )
                arrTextreviewLast.length = 0
                
                break
            case 'Статистика оценок':
                readStatisticSmileGame()
                bot.sendMessage(chatId, `Список оценок\n \ud83d\ude21 - ${arrReviewNamber[0]}\n \ud83d\ude12 - ${arrReviewNamber[1]}\n \ud83d\ude10 - ${arrReviewNamber[2]}\n \ud83d\ude0a - ${arrReviewNamber[3]}\n \u2764\ufe0f - ${arrReviewNamber[4]}`,
                    {reply_markup: {
                        keyboard: key_admin
                    }}
                )
                
                break
            case 'Рулетка вкл/выкл':
                if (gameOn === true) {
                    gameOn = false
                    bot.sendMessage(chatId, 'Рулетка ВЫКЛлючена',
                        {reply_markup: {
                            keyboard: key_admin
                        }}
                    )
                } else if (gameOn === false){
                    gameOn = true
                    bot.sendMessage(chatId, 'Рулетка ВКЛлючена',
                        {reply_markup: {
                            keyboard: key_admin
                        }}
                    )
                }
                break
            }
        //Админка конец
    } else {
        switch(msg.text) {  
            case '234':
                bot.sendMessage(chatId, 'Добро пожаловать в панель админа',
                    {reply_markup: {
                        keyboard: key_admin
                    }}
                )
                arrAdmin.push(msg.chat.id)
                break
            case '\ud83c\udf78Меню':
                console.log('gh')
                await bot.sendPhoto(
                    msg.chat.id, './menu_img/bar.jpg'
                );
                await bot.sendPhoto(
                    msg.chat.id, './menu_img/tea.jpg'
                );
                await bot.sendPhoto(
                    msg.chat.id, './menu_img/lemon.jpg',
                );
                review_tungler_anonim = false
                review_tungler = false
                break
            case '\ud83d\udd67 Бронь':
                console.log('бронь')
                await bot.sendPhoto(
                    msg.chat.id, './menu_img/chesnokShema.jpg'
                );
                await bot.sendMessage(chatId, `Столик можете забронировать по номеру \nТел. +7(836) 230-83-48`)
                review_tungler_anonim = false
                review_tungler = false
                break  
            case '\ud83d\udce3 Акции':
                console.log('Акции')
                await bot.sendPhoto(
                    msg.chat.id, './menu_img/recom.jpg'
                );
                await bot.sendMessage(chatId, `С 12:00 До 16:00 кальян 500 р.\n\nВ день рождения СКИДКА на кальяны 20%\n\nКОМБО\n\tКальян + 2 бокала вина - 1000 р.\n\tКальян + 3 бутылки пива - 1000 р`)
                review_tungler_anonim = false
                review_tungler = false
                break
            case '\ud83c\udfae Игра':
                if (gameOn === true) {
                    if (msg.from.id in gameUsersPresent) {
                        bot.sendMessage(chatId, `Вы уже играли сегодня`)
                          
                    } else {
                        bot.sendMessage(chatId, `Вы можете попытать удачу в розыгрыше призов от\nChesnok 2.0\n*после заказа кальяна`,{
                            reply_markup: {
                                keyboard: key_game
                            }
                        }) 
                        gameTungler.push(chatId)
                    }
                } else {
                    bot.sendMessage(chatId, `У нас закончились призы в инвентаре((\nВ ближайшее время я начну опять крутиться как не в себя!!!`)
                }
                
                review_tungler_anonim = false
                review_tungler = false
                break
            case 'Крутить рулетку':
                if (gameOn === true) {
                    if (gameTungler.includes(msg.chat.id)) {
                        randomGame(msg)
                        deleteUsers(gameTungler,msg.chat.id)
                    } else {
                        bot.sendMessage(chatId, `Вы уже играли сегодня`)
                    }
                } else {
                    bot.sendMessage(chatId, `У нас закончились призы в инвентаре((\nВ ближайшее время я начну опять крутиться как не в себя!!!`)
                }
                break
            case '\ud83d\udde3 Оставить отзыв':
                if(arrTodayUseersReview.includes(msg.chat.id)) {
                    bot.sendMessage (chatId , `Сегодня вы уже оставляли отзыв`,{
                        parse_mode: 'Markdown',
                        reply_markup: {
                            keyboard: key_back
                        }
                    })
                } else {
                    bot.sendMessage (chatId , `Можете дать оценку или же оставить пожелания, нам будет очень приятно!\n Хорошего отдыха!`,{
                        parse_mode: 'Markdown',
                        reply_markup: {
                            keyboard: key_review
                        }
                    })
                    review_tungler_anonim = false
                    review_tungler = true 
                }
                break
            default: 
            bot.sendMessage (chatId , `Доброго времени суток, вы находитесь в Телеграм Боте кальянной \n*Chesnok 2.0*`,{
                parse_mode: 'Markdown',
                reply_markup: {
                    keyboard: key_back
                }
            })
            review_tungler = false
        }       
    }   
});


function resetArr() {//Функция очистки списков
    gameCaunterBingoToday = 0;
    gameCaunterToday = 0;
    arrTodayUseersReview.length = 0;
    var props = Object.getOwnPropertyNames(gameUsersPresent);
    for (var i = 0; i < props.length; i++) {
        delete gameUsersPresent[props[i]];
    }
    console.log(`Я обновился`)
}



