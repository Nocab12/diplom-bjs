'use stict'

class Profile {   // Класс пользователя
    constructor({username, name: {firstName, lastName}, password}) {
        this.username = username;
        this.name = {firstName, lastName};
        this.password = password;
    }

    createUser(callback) {    // Добавление нового пользователя
        return ApiConnector.createUser({
            username: this.username,
            name: this.name,
            password: this.password,
        },
        (err, data) => {
            console.log(`Creating user ${this.username}`);
            callback(err, data);
        });
    }

    authorize(callback) { // Авторизация пользователя
        return ApiConnector.performLogin({
            username: this.username,
            password: this.password,
        },
        (err, data) => {
            console.log(`Authorizing user ${this.username}`);
            callback(err, data);
        });
    }

    addMoney({ currency, amount }, callback) {  // Добавление денег в личный кошелек
        return ApiConnector.addMoney({ currency, amount }, (err, data) => {
            console.log(`Adding ${amount} of ${currency} to ${this.username}`);
            callback(err, data);
        });
    }

    convertMoney({ fromCurrency, targetCurrency, targetAmount }, callback) { // Конвертация валют
        return ApiConnector.convertMoney({fromCurrency: 'EUR', targetCurrency: 'NETCOIN', targetAmount}, (err, data) => {
            console.log(`Converting ${fromCurrency} to ${targetAmount} ${targetCurrency}`);
            callback(err, data);
        });
    }

    transferMoney({to, amount}, callback) { // Перевод денег другому пользователю.
        return ApiConnector.transferMoney({to, amount}, (err, data) => {
            console.log(`Transfering ${amount} of Netcoins to ${to}`);
            callback(err, data);
        });
    }
};

function getStocks(callback) { 
    return ApiConnector.getStocks((err, data) => {
        console.log(`Getting stocks info`);
        callback(err, data[data.length - 1]); 
    });
};

 //const stocksInfo = getStocks(callback);



// Вторая чать задачи:
function main() {

    getStocks((err, data) => { // получаем текущий курс между валютами
        if(err) {
            console.error('Error during getting stocks');
        } else {
            const stocksInfo = data;

            const Ivan = new Profile({
                username: 'ivan',
                name: { firstName: 'Ivan', lastName: 'Ivanov' },
                password: 'ivan12',
                });
                
            const Denis = new Profile({
                username: 'denis',
                name: {firstName: 'Denis', lastName: 'Berezin'},
                password: 'nocab12',
                });   

                Ivan.createUser((err, data) => { // Создали пользователя Ivan Ivanov
                    if(err) {
                        console.error(`Error during creating Ivan Ivanov`);
                    } else {
                        console.log(`Ivan Ivanov is created!`);

                        Denis.createUser((err, data) => { // Создали пользователя Denis Berezin
                            if(err) {
                                console.error(`Error during creating Denis Berezin`);
                            } else {
                                console.log(`Denis Berezin is created!`);

                        Ivan.authorize((err, data) => {
                          if(err) {
                             console.error(`Error during authorizing Ivan Ivanov`);
                          } else {
                              console.log(`Ivan Ivanov is authorized!`);
                            
                         Ivan.addMoney({ currency: 'EUR', amount: 500000 }, (err, data) => {
                             if (err) {
                                    console.error('Error during adding money to Ivan Ivanov');
                                    console.log(err);
                                    } else {
                                        console.log(`Added 500000 euros to Ivan`);
                                        const targetAmount = stocksInfo['EUR_NETCOIN'] * 500000;
                                    
                                Ivan.convertMoney({fromCurrency: 'EUR', targetCurrency: 'NETCOIN', targetAmount}, (err, data) => {
                                 if(err) {
                                     console.error('Error during converting money');
                                     console.log(err);
                                 } else {
                                     console.log(`Converted to coins`, data);
                                    
                                   Ivan.transferMoney({to: Denis.username, amount: targetAmount,}, (err, data) => {
                                        if(err) {
                                           console.error('Error during transfer money');
                                           console.log(err);
                                        } else {
                                           console.log(`Denis Berezin has got ${targetAmount} NETCOINS`);
                                       }

                                    });
                                }});
                            }});
                        }});
                    }});

            }});  
                
    }});  
}

main();