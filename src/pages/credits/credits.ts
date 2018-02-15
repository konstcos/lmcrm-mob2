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
import {TranslateService} from 'ng2-translate/ng2-translate';

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


    /**
     * Номер последней оформленной заявки
     * для открытия меню по этой заявке
     *
     * в параметре может быть либо false, либо номер заявки.
     *     если false
     *         ничего не произойдет
     *     если указан номер заявки
     *         откроется меню по этой заяве
     */
    public statementNumber: any = false;


    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public nav: Nav,
                public credits: Credits,
                public actionSheetCtrl: ActionSheetController,
                public modalCtrl: ModalController,
                public loadingCtrl: LoadingController,
                public alertCtrl: AlertController,
                public translate: TranslateService) {

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

                // console.log(data);

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

                        // проверка на существование номера по которому нужно открыть меню
                        if(this.statementNumber) {
                            // если сохранен номер заявки

                            // перебираем и ищем эту заявку
                            for(let statement of this.statements) {

                                // если нашел заявку
                                if(statement.id == this.statementNumber) {
                                    // id заявки совпадает с сохраненной заявкой

                                    this.statementAction(statement);
                                    break;
                                }

                                console.log('заявка:');
                                console.log(statement);
                            }

                            // обнуляем номер заявки в компоненте
                            this.statementNumber = false;
                        }

                        // добавляем статусы
                        this.statuses = data.credits.statuses;
                        // добавляем типы
                        this.types = data.credits.types;
                        // добавляем реквезиты
                        this.requisites = data.requisites;
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

        let content = '';
        this.translate.get('credits.loading.make_withdrawal', {}).subscribe((res: string) => {
            content = res;
        });

        // показывает окно загрузки
        let loading = this.loadingCtrl.create({
            content: content
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

                    let title = '';
                    let message = '';
                    let text = '';

                    this.translate.get('credits.BankTransactionAlertSuccess.title', {}).subscribe((res: string) => {
                        title = res;
                    });

                    this.translate.get('credits.BankTransactionAlertSuccess.message', {requisites: this.requisites, amount: item.amount}).subscribe((res: string) => {
                        message = res;
                    });

                    this.translate.get('credits.BankTransactionAlertSuccess.OK', {}).subscribe((res: string) => {
                        text = res;
                    });

                    // алерт с инфо по оплате
                    let prompt = this.alertCtrl.create({
                        // title: this.trans.word('credits.BankTransactionAlertSuccess.title'),
                        title: title,
                        message: message,
                        buttons: [
                            {
                                text: text,
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

            if (data.info == 'makeReplenishment') {

                let title = '';
                let message = '';
                let ok = '';

                this.translate.get('credits.makeReplenishmentAlert.title', {}).subscribe((res: string) => {
                    title = res;
                });

                this.translate.get('credits.makeReplenishmentAlert.message', {resultId: data.data.result.id}).subscribe((res: string) => {
                    message = res;
                });

                this.translate.get('credits.makeReplenishmentAlert.OK', {}).subscribe((res: string) => {
                    ok = res;
                });

                // алерт сообщающий что заявка нормально создалась
                let alert = this.alertCtrl.create({
                    title: title,
                    message: message,
                    buttons: [
                        {
                            text: ok,
                            handler: alertData => {

                                // сохраняем id заявки
                                this.statementNumber = data.data.result.id;
                                // переходим на заявки
                                this.segment = 'statement';
                                // обновляем заявки
                                this.getStatement();
                            }
                        }
                    ]
                });
                alert.present();

                // обновляем кредитные данные
                this.getCreditsData();
                // обновляем данные транзакций
                this.getTransactions();

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

            // console.log('Закрытие окна вывода денег');
            // console.log(data);

            if (data.info == 'makeWithdrawal') {


                let title = '';
                let message = '';
                let ok = '';

                this.translate.get('credits.makeWithdrawalAlert.title', {}).subscribe((res: string) => {
                    title = res;
                });

                this.translate.get('credits.makeWithdrawalAlert.message', {resultId: data.data.result.id}).subscribe((res: string) => {
                    message = res;
                });

                this.translate.get('credits.makeWithdrawalAlert.OK', {}).subscribe((res: string) => {
                    ok = res;
                });

                // let message =
                //     `
                //         The statement was successful created under the number <b>№` + data.data.result.id + `</b>.
                //         Soon your statement will be processed.
                //     `;

                let alert = this.alertCtrl.create({
                    title: title,
                    message: message,
                    buttons: [
                        {
                            text: ok,
                            handler: alertData => {

                                // сохраняем id заявки
                                this.statementNumber = data.data.result.id;
                                // переходим на заявки
                                this.segment = 'statement';
                                // обновляем заявки
                                this.getStatement();
                            }
                        }
                    ]
                });
                alert.present();

                // обновляем кредитные данные
                this.getCreditsData();
                // обновляем данные транзакций
                this.getTransactions();

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

            let title = '';
            let deleteItem = '';
            let cancel = '';

            this.translate.get('credits.statementAction.title', {itemId: item.id}).subscribe((res: string) => {
                title = res;
            });

            this.translate.get('credits.statementAction.delete', {}).subscribe((res: string) => {
                deleteItem = res;
            });

            this.translate.get('credits.statementAction.cancel', {}).subscribe((res: string) => {
                cancel = res;
            });


            let actionSheet = this.actionSheetCtrl.create({
                title: title,
                buttons: [
                    {
                        text: deleteItem,
                        handler: () => {
                            this.cancelStatement(item);
                        }
                    },
                    {
                        text: cancel,
                        role: 'cancel',
                        handler: () => {
                            console.log('Cancel clicked');
                        }
                    }
                ]
            });

            actionSheet.present();

        } else if (item.status == 2) {

            let title = '';
            let pay_by_bank = '';
            let pay_by_credit_card = '';
            let deleteItem = '';
            let cancel = '';

            this.translate.get('credits.statementAction.title', {itemId: item.id}).subscribe((res: string) => {
                title = res;
            });

            this.translate.get('credits.statementAction.pay_by_bank', {}).subscribe((res: string) => {
                pay_by_bank = res;
            });

            this.translate.get('credits.statementAction.pay_by_credit_card', {}).subscribe((res: string) => {
                pay_by_credit_card = res;
            });

            this.translate.get('credits.statementAction.delete', {}).subscribe((res: string) => {
                deleteItem = res;
            });

            this.translate.get('credits.statementAction.cancel', {}).subscribe((res: string) => {
                cancel = res;
            });


            let actionSheet = this.actionSheetCtrl.create({
                title: title,
                buttons: [

                    {
                        text: pay_by_bank,
                        handler: () => {
                            // console.log('Bank transaction');
                            this.payByBank(item);
                        }
                    },

                    {
                        text: pay_by_credit_card,
                        handler: () => {
                            // console.log('Credit Card');
                            this.payByCreditCard(item);
                        }
                    },

                    {
                        text: deleteItem,
                        handler: () => {
                            this.cancelStatement(item);
                        }
                    },

                    {
                        text: cancel,
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

        console.log('данные итема:');
        console.log(item);

        let title = '';
        let message = '';
        let cancel = '';
        let already_paid = '';

        this.translate.get('credits.payByBankAlert.title', {}).subscribe((res: string) => {
            title = res;
        });

        this.translate.get('credits.payByBankAlert.message', {requisites: this.requisites, amount: item.amount}).subscribe((res: string) => {
            message = res;
        });

        this.translate.get('credits.payByBankAlert.cancel', {}).subscribe((res: string) => {
            cancel = res;
        });

        this.translate.get('credits.payByBankAlert.already_paid', {}).subscribe((res: string) => {
            already_paid = res;
        });

        // алерт с инфо по оплате
        let prompt = this.alertCtrl.create({
            title: title,
            message: message,
            buttons: [
                {
                    text: cancel,
                    handler: data => {
                        // console.log('Cancel clicked');
                    }
                },
                {
                    text: already_paid,
                    handler: data => {
                        // console.log('Transfer paid clicked');
                        // console.log(data);

                        this.payByBankConfirmation(item);

                    }
                }
            ]
        });

        prompt.present();
    }


    /**
     * Подтверждение оплаты банковским переводом
     *
     */
    payByBankConfirmation(item) {

        let title = 'Confirmation of payment';
        let message = 'I confirm the payment';
        let cancel_button = 'Cancel';
        let confirm_button = 'Confirm';

        this.translate.get('credits.payByBankConfirmation.title', {}).subscribe((res: string) => {
            title = res;
        });

        this.translate.get('credits.payByBankConfirmation.message', {requisites: this.requisites}).subscribe((res: string) => {
            message = res;
        });

        this.translate.get('credits.payByBankConfirmation.cancel_button', {}).subscribe((res: string) => {
            cancel_button = res;
        });

        this.translate.get('credits.payByBankConfirmation.confirm_button', {}).subscribe((res: string) => {
            confirm_button = res;
        });


        // алерт с инфо по оплате
        let prompt = this.alertCtrl.create({
            title: title,
            message: message,
            buttons: [
                {
                    text: cancel_button,
                    handler: data => {
                        // console.log('Cancel clicked');
                    }
                },
                {
                    text: confirm_button,
                    handler: data => {
                        // console.log('Transfer paid clicked');

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

            // проверка результата
            if(data.state) {
                // если были изменения по проплате
                // т.е. пользователь не просто закрыл окно,
                // а сделал проплату

                // проверка успешности проплаты
                if(data.status === 'success') {
                    // если оплата успешная
                    // помечаем что заявка успешно
                    // оплаченна
                    item.status = 4;
                }
            }



            console.log(data);
            console.log('а это итем:');
            console.log(item);

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
