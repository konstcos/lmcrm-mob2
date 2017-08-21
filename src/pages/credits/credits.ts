import {Component} from '@angular/core';
import {
    NavController,
    NavParams,
    Nav,
    AlertController,
    ActionSheetController,
    LoadingController,
    ModalController
} from 'ionic-angular';

// главная страница
import {MainPage} from '../main/main'
import {CreditReplenishmentPage} from '../credit-replenishment/credit-replenishment'
import {CreditWithdrawalPage} from '../credit-withdrawal/credit-withdrawal'
import {CreditCardPaymentPage} from '../credit-card-payment/credit-card-payment'

import {Credits} from '../../providers/credits'


/*
 Generated class for the Credits page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'page-credits',
    providers: [Credits],
    templateUrl: 'credits.html'
})
export class CreditsPage {

    /**
     * Итемы кредитной истории
     *
     */
    public items: any = [];

    /**
     * Статусы кредитной истории
     *
     */
    public statuses: any = [];


    /**
     * Вывод спинера загрузки
     *
     */
    public isLoading: boolean = false;


    /**
     * Описание типов кредитной истории
     *
     */
    public types: any = [];

    /**
     * Реквезиты на оплату
     *
     */
    public requisites: any = false;


    /**
     * Сумма на счету агента
     *
     */
    public walletAmount = 0;


    /**
     * Включен/выключен фильтр транзакций
     *
     */
    public isTransactionFilterOn: boolean = false;


    /**
     * Включен/выключен фильтр заявок
     *
     */
    public isStatementsFilterOn: boolean = false;


    /**
     * Сегмент страницы
     *
     */
    public segment = 'info';


    /**
     * Переменная с транзакциями
     *
     */
    public transactions: any = [];


    /**
     * Переменная с заявками
     *
     */
    public statements: any = [];


    /**
     * Есть еще транзакции на сервере или нет
     *
     */
    public isThereStillTransactionItems: boolean = true;


    /**
     * Есть еще заявки на сервере или нет
     *
     */
    public isThereStillStatements: boolean = true;


    /**
     * Отсутствие транзакций
     *
     */
    public noTransactions: boolean = false;


    /**
     * Отсутствие Заявок
     *
     */
    public noStatements: boolean = false;


    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public nav: Nav,
                public credits: Credits,
                public actionSheetCtrl: ActionSheetController,
                public modalCtrl: ModalController,
                public loadingCtrl: LoadingController,
                public alertCtrl: AlertController) {

        // this.get();
        this.getCreditsData();
    }


    ionViewDidLoad() {
        console.log('ionViewDidLoad CreditsPage');
    }


    /**
     * Обновление данных на странице
     *
     */
    refresh(refresher) {

        // проверить активную страницу
        if (this.segment == 'info') {
            // если общая информация

            this.getCreditsData(refresher);

        } else if (this.segment == 'transactions') {
            // если транзакции

            this.getTransactions(refresher);

        } else if (this.segment == 'statement') {
            // если заявки

            this.getStatement(refresher);
            // refresher.complete();

        } else {

            refresher.complete();
        }
    }


    /**
     * Получение данных по заявкам
     *
     */
    getStatement(refresher: any = false, itemClear: boolean = true) {

        // если есть указание на очистку итемов
        if (itemClear) {

            // обнулить все итемы
            this.statements = [];
        }


        // если загрузка идет не по рефрешу или инфинити
        // показывается индикатор общей загрузки
        if (!refresher) {
            this.isLoading = true;
        }


        // включаем переменную наличия итемов
        this.noStatements = false;

        // получаем количество уже загруженных итемов
        let offset = this.statements.length;

        this.credits.getStatements({offset: offset})
            .subscribe(result => {
                // при получении итемов

                // переводим ответ в json
                let data = result.json();

                console.log(data);

                if (data.status == 'success') {

                    // сценарий обработки результата
                    if (data.credits.requestsPayments.length == 0 && this.statements.length == 0) {
                        // если итемов не получанно и общее количество итемов равняется 0

                        // проверка включенного фильтра
                        if (this.isStatementsFilterOn) {
                            // если фильтр включен

                            // todo блок отсутствия итемов по фильтру
                            // this.noNotificationByFilter = true;

                        } else {
                            // если фильтр выключен

                            // показываем блок отсутствия итемов
                            this.noStatements = true;
                        }

                    } else if (data.credits.requestsPayments.length == 0 && this.statements.length != 0) {
                        // если итемы не получены, но в целом, в системе итемы уже есть

                        // помечаем что на сервере больше нет итемов
                        this.isThereStillStatements = false;

                    } else {
                        // итемы полученны

                        // добавляем итемы к существующим
                        this.statements = this.statements.concat(data.credits.requestsPayments);

                        this.statuses = data.credits.statuses;
                        this.types = data.credits.types;

                        this.requisites = data.requisites;
                    }


                    // this.items = data.credits.requestsPayments;
                    // this.statuses = data.credits.statuses;
                    // this.types = data.credits.types;
                    //
                    // this.requisites = data.requisites;

                } else {

                    console.log('error');
                }


                // если спинер включен - выключить
                if (this.isLoading) {
                    this.isLoading = false;
                }

                // если было обновление страницы
                if (refresher) {
                    // отключаем окно индикатора загрузки
                    refresher.complete();
                }

            }, err => {
                // в случае ошибки

                console.log('ERROR: ' + err);

                // если спинер включен - выключить
                if (this.isLoading) {
                    this.isLoading = false;
                }

                // если было обновление страницы
                if (refresher) {
                    // отключаем окно индикатора загрузки
                    refresher.complete();
                }

                this.statements = [];

                this.noStatements = true;
            });

    }


    /**
     * Вывод диалога по созданию запроса на ввод средств
     *
     */
    showReplenishmentDialog() {
        let prompt = this.alertCtrl.create({
            title: 'Replenishment',
            message: "Enter the amount to enter into the system",
            inputs: [
                {
                    name: 'amount',
                    placeholder: '0'
                },
            ],
            buttons: [
                {
                    text: 'Cancel',
                    handler: data => {
                        // console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Replenishment',
                    handler: data => {
                        // console.log('Saved clicked');
                        // console.log(data);

                        this.credits.createReplenishment({amount: data.amount})
                            .subscribe(result => {
                                // при получении итемов

                                // переводим ответ в json
                                let resData = result.json();

                                console.log(resData);

                                if (resData.status == 'success') {

                                    this.navCtrl.setRoot(this.navCtrl.getActive().component);

                                } else {

                                    this.navCtrl.setRoot(this.navCtrl.getActive().component);
                                }

                                // отключаем окно индикатора загрузки
                                // loading.dismiss();

                            }, err => {
                                // в случае ошибки

                                console.log('ERROR: ' + err);

                                // todo выводится сообщение об ошибке (нету связи и т.д.)

                                // отключаем окно индикатора загрузки
                                // loading.dismiss();
                            });

                    }
                }
            ]
        });

        prompt.present();
    }


    /**
     * Оплата запроса
     *
     */
    payReplenishmentBankTransaction(item) {

        // показывает окно загрузки
        let loading = this.loadingCtrl.create({
            content: 'Make withdrawal, please wait...'
        });
        loading.present();

        this.credits.payReplenishmentBankTransaction({item_id: item.id})
            .subscribe(result => {
                // при получении итемов

                // переводим ответ в json
                let data = result.json();

                console.log(data);

                if (data.status == 'success') {

                    this.getCreditsData();
                    this.getTransactions();
                    this.getStatement();

                    // алерт с инфо по оплате
                    let prompt = this.alertCtrl.create({
                        title: 'Payment confirmed',
                        message: "After processing the payment by the administration, the money will be credited to your wallet in the system",
                        buttons: [
                            {
                                text: 'Ok',
                                handler: data => {
                                    // console.log('Transfer paid clicked');
                                }
                            }
                        ]
                    });

                    prompt.present();

                } else {

                }

                // отключаем окно индикатора загрузки
                loading.dismiss();

            }, err => {
                // в случае ошибки

                console.log('ERROR: ' + err);

                // todo выводится сообщение об ошибке (нету связи и т.д.)

                // отключаем окно индикатора загрузки
                loading.dismiss();
            });
    }


    /**
     * Открытие модального окна на ввод денег
     *
     */
    openReplenishment() {

        let modal = this.modalCtrl.create(CreditReplenishmentPage, {});

        modal.onDidDismiss(data => {

            console.log('Закрытие окна ввода денег');
            console.log(data);

            if (data.info == 'makeReplenishment') {

                let message =
                    `                   
                        The statement was successful created under the number <b>№` + data.data.result.id + `</b>. 
                        To continue, pay the statement and mark it.
                    `;

                let alert = this.alertCtrl.create({
                    title: 'Replenishment',
                    message: message,
                    buttons: ['Ok']
                });
                alert.present();

                this.getCreditsData();
                this.getTransactions();
                this.getStatement();

            } else if (data.info == 'errorReplenishment') {

                console.log('error');

            } else {

            }

        });

        modal.present();
    }


    /**
     * Открытие модального окна на вывод денег
     *
     */
    openWithdrawal() {

        let modal = this.modalCtrl.create(CreditWithdrawalPage, {});

        modal.onDidDismiss(data => {

            console.log('Закрытие окна вывода денег');
            console.log(data);

            if (data.info == 'makeWithdrawal') {

                let message =
                    `                   
                        The statement was successful created under the number <b>№` + data.data.result.id + `</b>. 
                        Soon your statement will be processed.
                    `;

                let alert = this.alertCtrl.create({
                    title: 'Withdrawal',
                    message: message,
                    buttons: ['Ok']
                });
                alert.present();

                this.getCreditsData();
                this.getTransactions();
                this.getStatement();

            } else if (data.info == 'errorWithdrawal') {

                console.log('error');

            } else {

            }

        });

        modal.present();
    }


    /**
     * Событие по изменении сегмента
     */
    segmentChanged() {

        if (this.segment == 'transactions') {

            // если транзакций нет, подгружаем их
            if (this.transactions.length == 0) {
                // подгрузка транзакция
                this.getTransactions();
            }

        } else if (this.segment == 'statement') {

            // если заявок нет, подгружаем их
            if (this.statements.length == 0) {
                // подгрузка заявок
                this.getStatement();
            }
        }


        console.log('state changed: ' + this.segment);
        return false;
    }


    /**
     * Получение данных по финансам пользователя
     *
     */
    getCreditsData(refresher: any = false) {

        this.credits.getCreditsData({})
            .subscribe(result => {
                // при получении итемов

                // переводим ответ в json
                let data = result.json();

                console.log(data);

                if (data.status == 'success') {

                    this.walletAmount = data.walletAmount;

                } else {

                }


                // если было обновление страницы
                if (refresher) {
                    // отключаем окно индикатора загрузки
                    refresher.complete();
                }

            }, err => {
                // в случае ошибки

                console.log('ERROR: ' + err);

                // todo выводится сообщение об ошибке (нету связи и т.д.)

                // если было обновление страницы
                if (refresher) {
                    // отключаем окно индикатора загрузки
                    refresher.complete();
                }
            });

    }


    /**
     * Получение денежных транзакций пользователя
     *
     */
    getTransactions(refresher: any = false, itemClear: boolean = true) {

        // если есть указание на очистку итемов
        if (itemClear) {

            // обнулить все итемы
            this.transactions = [];
        }


        // если загрузка идет не по рефрешу или инфинити
        // показывается индикатор общей загрузки
        if (!refresher) {
            this.isLoading = true;
        }


        // включаем переменную наличия итемов
        this.noTransactions = false;

        // получаем количество уже загруженных итемов
        let offset = this.transactions.length;

        this.credits.getTransactions({offset: offset})
            .subscribe(result => {
                // при получении итемов

                // переводим ответ в json
                let data = result.json();

                console.log(data);

                if (data.status == 'success') {

                    // сценарий обработки результата
                    if (data.transactions.length == 0 && this.transactions.length == 0) {
                        // если итемов не получанно и общее количество итемов равняется 0

                        // проверка включенного фильтра
                        if (this.isTransactionFilterOn) {
                            // если фильтр включен

                            // todo блок отсутствия итемов по фильтру
                            // this.noNotificationByFilter = true;

                        } else {
                            // если фильтр выключен

                            // показываем блок отсутствия итемов
                            this.noTransactions = true;
                        }

                    } else if (data.transactions.length == 0 && this.transactions.length != 0) {
                        // если итемы не получены, но в целом, в системе итемы уже есть

                        // помечаем что на сервере больше нет итемов
                        this.isThereStillTransactionItems = false;

                    } else {
                        // итемы полученны

                        // добавляем итемы к существующим
                        this.transactions = this.transactions.concat(data.transactions);
                    }

                } else {

                    console.log('error');
                }


                // если спинер включен - выключить
                if (this.isLoading) {
                    this.isLoading = false;
                }

                // если было обновление страницы
                if (refresher) {
                    // отключаем окно индикатора загрузки
                    refresher.complete();
                }

            }, err => {
                // в случае ошибки

                console.log('ERROR: ' + err);

                // если спинер включен - выключить
                if (this.isLoading) {
                    this.isLoading = false;
                }

                // если было обновление страницы
                if (refresher) {
                    // отключаем окно индикатора загрузки
                    refresher.complete();
                }

                this.transactions = [];

                this.noTransactions = true;

            });

    }


    /**
     * Подгрузка итемов
     *
     */
    loadMore(infinityScroll) {

        // проверить активную страницу
        if (this.segment == 'transactions') {
            // если оповещения

            this.getTransactions(infinityScroll, false);

        } else if (this.segment == 'statement') {
            // если сообщения

            this.getStatement(infinityScroll, false);
        }
    }


    /**
     * Включение/выключение инфинити
     *
     */
    isLastPageReached(): boolean {

        // проверить активную страницу
        if (this.segment == 'transactions') {
            // если транзакции

            return this.transactions.length != 0 && this.isThereStillTransactionItems;

        } else if (this.segment == 'statement') {
            // если заявки

            return this.statements.length != 0 && this.isThereStillStatements;
        }
    }


    /**
     * Меню работы с заявкой
     *
     */
    statementAction(item) {


        if (item.status == 1) {

            let actionSheet = this.actionSheetCtrl.create({
                title: 'Statement № ' + item.id,
                buttons: [
                    {
                        text: 'Delete',
                        handler: () => {
                            this.cancelStatement(item);
                        }
                    },
                    {
                        text: 'Cancel',
                        role: 'cancel',
                        handler: () => {
                            console.log('Cancel clicked');
                        }
                    }
                ]
            });

            actionSheet.present();

        } else if (item.status == 2) {

            let actionSheet = this.actionSheetCtrl.create({
                title: 'Statement № ' + item.id,
                buttons: [

                    {
                        text: 'Pay by bank',
                        handler: () => {
                            // console.log('Bank transaction');
                            this.payByBank(item);
                        }
                    },

                    {
                        text: 'Pay by Credit Card',
                        handler: () => {
                            // console.log('Credit Card');
                            this.payByCreditCard(item);
                        }
                    },

                    {
                        text: 'Delete',
                        handler: () => {
                            this.cancelStatement(item);
                        }
                    },

                    {
                        text: 'Cancel',
                        role: 'cancel',
                        handler: () => {
                            console.log('Cancel clicked');
                        }
                    }
                ]
            });

            actionSheet.present();

        } else {

        }

    }


    /**
     * Оплата банковским переводом
     *
     */
    payByBank(item) {

        // todo алерт с инфо по оплате
        let prompt = this.alertCtrl.create({
            title: 'Pay by bank',
            message: "For payment via bank transfer, transfer money to the details listed below, then click on the 'Already paid' button " + this.requisites,
            buttons: [
                {
                    text: 'Cancel',
                    handler: data => {
                        // console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Already paid',
                    handler: data => {
                        // console.log('Transfer paid clicked');
                        // console.log(data);

                        this.payByBankConfirmation(item);

                    }
                }
            ]
        });

        prompt.present();


        console.log('Bank transaction 111');
    }


    /**
     * Подтверждение оплаты банковским переводом
     *
     */
    payByBankConfirmation(item) {

        // алерт с инфо по оплате
        let prompt = this.alertCtrl.create({
            title: 'Confirmation of payment',
            message: "I confirm the payment",
            buttons: [
                {
                    text: 'Cancel',
                    handler: data => {
                        // console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Confirm',
                    handler: data => {
                        console.log('Transfer paid clicked');

                        this.payReplenishmentBankTransaction(item);
                    }
                }
            ]
        });

        prompt.present();
    }


    /**
     * Оплата через кредитную карту
     *
     */
    payByCreditCard(item) {

        let modal = this.modalCtrl.create(CreditCardPaymentPage, {item: item});

        modal.onDidDismiss(data => {

            console.log('Закрытие окна вывода денег');
            console.log(data);

            // if (data.info == 'makeWithdrawal') {
            //
            //     let message =
            //         `
            //             The statement was successful created under the number <b>№` + data.data.result.id + `</b>.
            //             Soon your statement will be processed.
            //         `;
            //
            //     let alert = this.alertCtrl.create({
            //         title: 'Withdrawal',
            //         message: message,
            //         buttons: ['Ok']
            //     });
            //     alert.present();
            //
            //     this.getCreditsData();
            //     this.getTransactions();
            //     this.getStatement();
            //
            // } else if (data.info == 'errorWithdrawal') {
            //
            //     console.log('error');
            //
            // } else {
            //
            // }

        });

        modal.present();


        // показывает окно загрузки
        // let loading = this.loadingCtrl.create({
        //     content: 'Make withdrawal, please wait...'
        // });
        // loading.present();
        //
        // this.credits.creditCardPayment({item_id: item.id})
        // // this.credits.getDetailCreditCardPayment({item_id: item.id})
        //     .subscribe(result => {
        //         // при получении итемов
        //
        //         // переводим ответ в json
        //         let data = result.json();
        //
        //         console.log(data);
        //
        //         // отключаем окно индикатора загрузки
        //         loading.dismiss();
        //
        //     }, err => {
        //         // в случае ошибки
        //
        //         console.log('ERROR: ' + err);
        //
        //         // todo выводится сообщение об ошибке (нету связи и т.д.)
        //
        //         // отключаем окно индикатора загрузки
        //         loading.dismiss();
        //     });
    }


    /**
     * Отмена заявки на вывод денег
     *
     */
    cancelStatement(item) {

        this.credits.cancelStatement({statement_id: item.id})
            .subscribe(result => {
                // при получении итемов

                // переводим ответ в json
                let data = result.json();

                console.log(data);

                // if (data.status == 'success') {
                //
                //     this.navCtrl.setRoot(this.navCtrl.getActive().component);
                //
                // } else {
                //
                //     this.navCtrl.setRoot(this.navCtrl.getActive().component);
                // }

                // отключаем окно индикатора загрузки
                // loading.dismiss();

            }, err => {
                // в случае ошибки

                console.log('ERROR: ' + err);

                // todo выводится сообщение об ошибке (нету связи и т.д.)

                // отключаем окно индикатора загрузки
                // loading.dismiss();
            });

    }


    /**
     * Возврат назад
     *
     */
    goBack() {

        this.nav.setRoot(MainPage);
    }
}
