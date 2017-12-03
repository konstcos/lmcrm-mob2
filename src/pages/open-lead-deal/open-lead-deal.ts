import {Component} from '@angular/core';
import {
    NavController,
    NavParams,
    ViewController,
    ModalController,
    AlertController,
    ToastController,
    LoadingController,
    ActionSheetController
} from 'ionic-angular';
import {TranslateService} from 'ng2-translate/ng2-translate';


import {CorrespondencePage} from '../correspondence/correspondence'
import {DealPaymentCardPage} from '../deal-payment-card/deal-payment-card'
import {DealPaymentWalletPage} from '../deal-payment-wallet/deal-payment-wallet'
import {DealPaymentManuallyPage} from '../deal-payment-manually/deal-payment-manually'

import {Open} from '../../providers/open';


/*
 Generated class for the OpenLeadStatuses page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'page-open-lead-deal',
    templateUrl: 'open-lead-deal.html'
})
export class OpenLeadDealPage {

    public item: any;
    public statuses: any;


    /**
     * Данные по сделкам
     *
     */
    public deal: any = false;


    /**
     * Файлы на отправку на сервер
     *
     */
    public files: any = 'пока пусто';
    public fSize: any = 0;


    /**
     * Сегмент страницы
     *
     */
    public segment = 'info';


    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public open: Open,
                private alertCtrl: AlertController,
                public modalCtrl: ModalController,
                public toastCtrl: ToastController,
                public loadingCtrl: LoadingController,
                public actionSheetCtrl: ActionSheetController,
                public view: ViewController,
                public translate: TranslateService) {

        // получение id итема
        this.item = this.navParams.get('item');

        // загрузка данных по сделке
        this.getDealData();
    }


    ionViewDidLoad() {
        // console.log('ionViewDidLoad OpenLeadStatusesPage');
    }


    /**
     * Получение данных по сделке
     *
     */
    getDealData() {

        this.open.getDealData({openLeadId: this.item.id})
            .subscribe(result => {
                // при получении итемов

                // переводим ответ в json
                let data = result.json();

                console.log(data);

                if (data.status == 'success') {

                    // this.newStatus = data.status_info;
                    // this.close(data.status_info);


                    this.deal = data.deal;

                    console.log('Данные по сделкам');
                    console.log(this.deal);


                } else {
                    // this.close();

                    console.log('Ошибка запроса');

                }

            }, err => {
                // в случае ошибки

                console.log('ERROR: ' + err);
            });
    }


    /**
     * Открытие переписки по сделке
     *
     */
    openCorrespondence() {

        // созадние модального окна переписки
        let modal = this.modalCtrl.create(CorrespondencePage, {openLeadId: this.item.id});

        // событие по закрытию модального окна
        modal.onDidDismiss(data => {

            console.log(data);
        });

        // открытие модального окна
        modal.present();
    }


    /**
     * Оплата сделки с кошелька
     *
     */
    paymentWithWallet() {

        // открытие модального окна по закрытию сделки
        let modal = this.modalCtrl.create(DealPaymentWalletPage, {openLeadId: this.item.id});

        // событие по закрытию модального окна
        modal.onDidDismiss(data => {

            // console.log(data);

            if (data.status == 'success') {
                // при успешной ошплате

                let title = 'Payment successful';
                let message = 'Payment passed successfully';
                let ok_button = 'OK';

                this.translate.get('open_lead_deal.paymentWithWallet.success.title', {}).subscribe((res: string) => {
                    title = res;
                });

                this.translate.get('open_lead_deal.paymentWithWallet.success.message', {}).subscribe((res: string) => {
                    message = res;
                });

                this.translate.get('open_lead_deal.paymentWithWallet.success.OK', {}).subscribe((res: string) => {
                    ok_button = res;
                });


                // алерт об успешной проплате
                let alert = this.alertCtrl.create({
                    title: title,
                    subTitle: message,
                    buttons: [ok_button]
                });
                alert.present();

                // обновление страницы
                this.getDealData();

            } else if (data.status == 'fail') {
                // при неудаче

                let title = 'Payment fail';
                let message = 'An error occurred while making the payment';
                let ok_button = 'OK';

                this.translate.get('open_lead_deal.paymentWithWallet.fail.title', {}).subscribe((res: string) => {
                    title = res;
                });

                this.translate.get('open_lead_deal.paymentWithWallet.fail.message', {}).subscribe((res: string) => {
                    message = res;
                });

                this.translate.get('open_lead_deal.paymentWithWallet.fail.OK', {}).subscribe((res: string) => {
                    ok_button = res;
                });

                // алерт о неудаче
                let alert = this.alertCtrl.create({
                    title: title,
                    subTitle: message,
                    buttons: [ok_button]
                });
                alert.present();

                // обновление страницы
                this.getDealData();
            }

        });

        // открытие модального окна
        modal.present();
    }


    /**
     * Оплата сделки с кредитной карты
     *
     */
    paymentWithCard() {

        // созадние модального окна переписки
        let modal = this.modalCtrl.create(DealPaymentCardPage, {openLeadId: this.item.id});

        // событие по закрытию модального окна
        modal.onDidDismiss(data => {

            console.log(data);
            // обновление страницы
            this.getDealData();

        });

        // открытие модального окна
        modal.present();
    }


    /**
     * Оплата вручную, через банковский перевод
     *
     */
    manuallyPayment() {

        // созадние модального окна переписки
        let modal = this.modalCtrl.create(DealPaymentManuallyPage, {openLeadId: this.item.id});

        // событие по закрытию модального окна
        modal.onDidDismiss(data => {

            if (data.status == 'success') {
                // при успешной ошплате

                let title = 'Payment successful';
                let message = 'Payment passed successfully';
                let ok_button = 'OK';

                this.translate.get('open_lead_deal.manuallyPayment.success.title', {}).subscribe((res: string) => {
                    title = res;
                });

                this.translate.get('open_lead_deal.manuallyPayment.success.message', {}).subscribe((res: string) => {
                    message = res;
                });

                this.translate.get('open_lead_deal.manuallyPayment.success.OK', {}).subscribe((res: string) => {
                    ok_button = res;
                });

                // алерт об успешной проплате
                let alert = this.alertCtrl.create({
                    title: title,
                    subTitle: message,
                    buttons: [ok_button]
                });
                alert.present();

                // обновление страницы
                this.getDealData();

            }

            console.log(data);
        });

        // открытие модального окна
        modal.present();
    }


    /**
     * Доп. информация по элементам сделки
     *
     */
    showInfo(info) {

        // console.log(info);

        let title = '';
        let message = '';
        let ok_button = 'OK';

        this.translate.get('open_lead_deal.manuallyPayment.success.OK', {}).subscribe((res: string) => {
            ok_button = res;
        });

        if (info == 1) {

            title = 'Price';
            message = 'The amount for which the deal is closed';


            this.translate.get('open_lead_deal.showInfo.price.title', {}).subscribe((res: string) => {
                title = res;
            });

            this.translate.get('open_lead_deal.showInfo.price.message', {}).subscribe((res: string) => {
                message = res;
            });

        } else if (info == 2) {

            title = 'Share of the system';
            message = 'Part of the amount of the deal you need to pay to the system';

            this.translate.get('open_lead_deal.showInfo.share.title', {}).subscribe((res: string) => {
                title = res;
            });

            this.translate.get('open_lead_deal.showInfo.share.message', {}).subscribe((res: string) => {
                message = res;
            });

        } else if (info == 3) {

            title = 'Date';
            message = 'Date when the deal was closed';

            this.translate.get('open_lead_deal.showInfo.date.title', {}).subscribe((res: string) => {
                title = res;
            });

            this.translate.get('open_lead_deal.showInfo.date.message', {}).subscribe((res: string) => {
                message = res;
            });

        } else if (info == 4) {

            title = 'Status';
            message = 'Deal status';

            this.translate.get('open_lead_deal.showInfo.status.title', {}).subscribe((res: string) => {
                title = res;
            });

            this.translate.get('open_lead_deal.showInfo.status.message', {}).subscribe((res: string) => {
                message = res;
            });

        }


        let alert = this.alertCtrl.create({
            title: title,
            message: message,
            buttons: [ok_button]
        });
        alert.present();
    }


    /**
     * Событие по изменении сегмента
     */
    segmentChanged() {

        return false;
    }


    /**
     * Открытие окна выбора файла для отправки на сервер
     *
     */
    sendFiles() {

        // выборка элемента инпута файла
        let fileElem = document.getElementById("fileElem");

        // если элемент выбран
        if (fileElem) {
            // открываем окно выбора файла
            fileElem.click();
        }
    }


    /**
     * Отправка файла на сервер
     * событие по изменению инпута файла
     *
     */
    onChange(data) {

        let target = data.target || data.srcElement;
        let file = target.files;

        if (file) {

            let nBytes = file[0].size;

            let sOutput = '';


            // ["KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"]

            for (let aMultiples = ["Kb", "Mb", "Gb", "Tb", "Pb", "Eb", "Zb", "Yb"], nMultiple = 0, nApprox = nBytes / 1024; nApprox > 1; nApprox /= 1024, nMultiple++) {
                // sOutput = nApprox.toFixed(3) + " " + aMultiples[nMultiple] + " (" + nBytes + " bytes)";
                sOutput = nApprox.toFixed(0) + " " + aMultiples[nMultiple];
                // sOutput = nApprox.toFixed(3) + " " + aMultiples[nMultiple];
            }

            // если размер меньше двух мегабайт, отменяем загрузку
            if (file[0].size > 2000000) {

                // выбираем размер
                this.fSize = sOutput;

                // алерт о том что размер файла превышает допустимые размеры
                let alert = this.alertCtrl.create({
                    title: 'Cannot upload file',
                    message: 'The file size should not exceed <b>2 Mb</b>. Size of the selected file <b>' + sOutput + '</b>',
                    buttons: ['Ok']
                });
                alert.present();

                return false;
            }


            // показывает окно загрузки
            let loading = this.loadingCtrl.create({
                content: 'File is uploading, please wait...'
            });
            loading.present();

            // размер файла
            this.fSize = sOutput;

            let files: FileList = file;
            const formData = new FormData();
            for (let i = 0; i < files.length; i++) {
                formData.append('file', files[i]);
            }

            // добавление в данные id лида
            formData.append('open_lead_id', this.deal.open_lead_id);

            // отправка файлов на сервер
            this.open.uploadFile(formData)
                .subscribe(result => {
                    // при получении итемов

                    // переводим ответ в json
                    let data = result.json();

                    // console.log('Порядок: ');
                    console.log(data);

                    if (data.status == 'success') {

                        this.deal.files = data.files;

                        // console.log(this.files);

                        let toast = this.toastCtrl.create({
                            message: 'File successfully uploaded',
                            duration: 2000,
                            position: 'bottom'
                        });
                        toast.present();


                    } else if (data.status == 'fail') {

                        if (data.info == 'the_file_already_exists') {

                            let toast = this.toastCtrl.create({
                                message: 'This file already exists',
                                duration: 2000,
                                position: 'bottom'
                            });
                            toast.present();

                        } else {

                            let toast = this.toastCtrl.create({
                                message: 'Error uploading file',
                                duration: 2000,
                                position: 'bottom'
                            });
                            toast.present();
                        }


                    } else {

                        let toast = this.toastCtrl.create({
                            message: 'Error uploading file',
                            duration: 2000,
                            position: 'bottom'
                        });
                        toast.present();

                    }


                    loading.dismiss();


                }, err => {
                    // в случае ошибки

                    console.log('Ошибка: ');
                    // alert('ошибка в получении файла');
                    console.log('ERROR: ' + err);

                    loading.dismiss();

                    let toast = this.toastCtrl.create({
                        message: 'Error uploading file',
                        duration: 2000,
                        position: 'bottom'
                    });
                    toast.present();

                });
        }
    }


    /**
     * Удаление файла
     * открытие алерта на подтверждение удаления файла
     *
     */
    deleteFile(file) {

        let alert = this.alertCtrl.create({
            title: 'Delete file',
            message: 'Are you sure you want to delete the file ' + file.name + '?',
            cssClass: 'deal_file_delete_confirmation',
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                },
                {
                    text: 'Delete',
                    handler: () => {
                        this.deleteFileOnServer(file);
                        // console.log('dell clicked');
                    }
                }
            ]
        });
        alert.present();
    }


    /**
     * Удаление файла на сервере
     *
     */
    deleteFileOnServer(file) {
        console.log('Удаление файла на сервере');
        console.log(file);

        // показывает окно загрузки
        let loading = this.loadingCtrl.create({
            content: 'File is deleting, please wait...'
        });
        loading.present();

        // удаление файла на сервере
        this.open.deleteFile({fileId: file.id})
            .subscribe(result => {
                // при получении ответа

                // переводим ответ в json
                let data = result.json();

                console.log(data);

                if (data.status == 'success') {

                    this.deal.files = data.files;
                }


                loading.dismiss();

            }, err => {
                // в случае ошибки

                console.log('Ошибка: ');
                // alert('ошибка в получении файла');
                console.log('ERROR: ' + err);

                loading.dismiss();
            });


    }


    /**
     * Открыть меню проплаты
     *
     */
    makePaymentActionSheet() {

        let title = 'Select payment system for a completed deal';
        let from_credit_card = 'From credit card';
        let manual_payment = 'Manual payment';
        let from_system_wallet = 'From system wallet';
        let cancel_button = 'Cancel';

        this.translate.get('open_lead_deal.makePaymentActionSheet.title', {}).subscribe((res: string) => {
            title = res;
        });

        this.translate.get('open_lead_deal.makePaymentActionSheet.from_credit_card', {}).subscribe((res: string) => {
            from_credit_card = res;
        });

        this.translate.get('open_lead_deal.makePaymentActionSheet.manual_payment', {}).subscribe((res: string) => {
            manual_payment = res;
        });

        this.translate.get('open_lead_deal.makePaymentActionSheet.from_system_wallet', {}).subscribe((res: string) => {
            from_system_wallet = res;
        });

        this.translate.get('open_lead_deal.makePaymentActionSheet.cancel_button', {}).subscribe((res: string) => {
            cancel_button = res;
        });


        let actionSheet = this.actionSheetCtrl.create({
            title: title,
            cssClass: 'action_open_lead_deal_title',
            buttons: [

                {
                    text: from_credit_card,
                    // icon: 'md-card',
                    cssClass: 'action_open_lead_deal',
                    handler: () => {
                        this.paymentWithCard();
                        console.log('From credit card');
                    }
                },

                {
                    text: manual_payment,
                    // icon: 'md-hand',
                    cssClass: 'action_open_lead_deal',
                    handler: () => {
                        this.manuallyPayment();
                        console.log('Manual payment');
                    }
                },

                {
                    text: from_system_wallet,
                    // icon: 'md-radio-button-on',
                    cssClass: 'action_open_lead_deal',
                    handler: () => {
                        this.paymentWithWallet();
                        console.log('From system wallet');
                    }
                },

                {
                    text: cancel_button,
                    // icon: 'md-close',
                    cssClass: 'action_open_lead_deal',
                    role: 'cancel',
                }
            ]
        });

        actionSheet.present();

    }


    /**
     * Диалоговое окно на внесение нового платежа
     *
     */
    receivedNextPaymentData() {

        let title = 'Make next payment';
        let message = 'Enter the amount of the next payment';
        let input_name = 'amount';
        let cancel_button = 'Cancel';
        let make_button = 'Make';

        this.translate.get('open_lead_deal.receivedNextPaymentData.title', {}).subscribe((res: string) => {
            title = res;
        });

        this.translate.get('open_lead_deal.receivedNextPaymentData.message', {}).subscribe((res: string) => {
            message = res;
        });

        this.translate.get('open_lead_deal.receivedNextPaymentData.input_name', {}).subscribe((res: string) => {
            input_name = res;
        });

        this.translate.get('open_lead_deal.receivedNextPaymentData.cancel_button', {}).subscribe((res: string) => {
            cancel_button = res;
        });

        this.translate.get('open_lead_deal.receivedNextPaymentData.make_button', {}).subscribe((res: string) => {
            make_button = res;
        });


        let prompt = this.alertCtrl.create({
            title: title,
            message: message,
            inputs: [
                {
                    name: input_name,
                    placeholder: '0',
                    type: 'number',
                },
            ],
            buttons: [
                {
                    text: cancel_button,
                    handler: data => {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: make_button,
                    handler: data => {

                        if (data.amount.trim() == '' || data.amount == 0) {

                            return false;

                        } else if (data.amount < 1000) {

                            this.insufficientNextPayment(data.amount);
                            return false;
                        }

                        // добавить платеж
                        // console.log(data.amount);

                        this.makeNextPayment(data.amount);
                    }
                }
            ]
        });
        prompt.present();

    }


    /**
     * Создание следующего платежа по сделке
     *
     */
    makeNextPayment(amount) {

        // console.log('makeNextPayment');

        this.open.dealNextPayment({open_lead_id: this.deal.open_lead_id, amount: amount})

            .subscribe(result => {
                // при получении итемов

                // переводим ответ в json
                let data = result.json();

                console.log(data);

                if (data.status == 'success') {

                    let toast = this.toastCtrl.create({
                        message: 'Statement successfully created',
                        duration: 3000,
                        position: 'bottom'
                    });
                    toast.present();

                    // обновление данных по сделке
                    this.getDealData();

                } else {

                    if (data.info == 'outstanding_payments') {

                        let alert = this.alertCtrl.create({
                            title: 'Payment fail',
                            subTitle: 'You still have outstanding payments',
                            buttons: ['OK']
                        });
                        alert.present();

                    }


                }

                // this.dealData = data.dealData;
                //
                // this.isLoading = false;
                // this.isContent = true;

            }, err => {
                // в случае ошибки

                console.log('ERROR: ' + err);

                // this.isLoading = false;
                // this.isContent = true;

                // todo выводится сообщение об ошибке (нету связи и т.д.)

                // отключаем окно индикатора загрузки
                // loading.dismiss();
            });


    }


    /**
     * Подтверждение закрытия сделки
     *
     */
    closeFewPaymentDealConfirmation() {

        let title = 'Completed';
        let message = 'Are you sure you want to end the deal?';
        let cancel_button = 'Cancel';
        let completed_button = 'Completed';

        this.translate.get('open_lead_deal.closeFewPaymentDealConfirmation.title', {}).subscribe((res: string) => {
            title = res;
        });

        this.translate.get('open_lead_deal.closeFewPaymentDealConfirmation.message', {}).subscribe((res: string) => {
            message = res;
        });

        this.translate.get('open_lead_deal.closeFewPaymentDealConfirmation.cancel_button', {}).subscribe((res: string) => {
            cancel_button = res;
        });

        this.translate.get('open_lead_deal.closeFewPaymentDealConfirmation.completed_button', {}).subscribe((res: string) => {
            completed_button = res;
        });

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
                    text: completed_button,
                    handler: data => {
                        // console.log('Saved clicked');
                        this.closeFewPaymentDeal();
                    }
                }
            ]
        });
        prompt.present();

    }


    /**
     * Завершение сделки
     *
     */
    closeFewPaymentDeal() {

        this.open.closeFewPaymentDeal({open_lead_id: this.deal.open_lead_id})

            .subscribe(result => {
                // при получении итемов

                // переводим ответ в json
                let data = result.json();

                console.log(data);

                if (data.status == 'success') {
                    // обновление данных по сделке
                    this.getDealData();
                }

                // this.dealData = data.dealData;
                //
                // this.isLoading = false;
                // this.isContent = true;

            }, err => {
                // в случае ошибки

                console.log('ERROR: ' + err);

                // todo выводится сообщение об ошибке (нету связи и т.д.)

                // отключаем окно индикатора загрузки
                // loading.dismiss();
            });

    }


    /**
     * Алерт о недостаточной сумме следующего платежа
     *
     */
    insufficientNextPayment(amount) {

        let title = 'Wrong amount';
        let message = 'The minimum amount is &#8362;1000, you entered &#8362;' + amount;
        let ok_button = 'OK';

        this.translate.get('open_lead_deal.insufficientNextPayment.title', {}).subscribe((res: string) => {
            title = res;
        });

        this.translate.get('open_lead_deal.insufficientNextPayment.message', {amount: amount}).subscribe((res: string) => {
            message = res;
        });

        this.translate.get('open_lead_deal.insufficientNextPayment.ok_button', {}).subscribe((res: string) => {
            ok_button = res;
        });

        let alert = this.alertCtrl.create({
            title: title,
            subTitle: message,
            buttons: [
                {
                    text: ok_button,
                    handler: data => {

                    }
                }
            ]
        });
        alert.present();
    }


    /**
     * Закрытие страницы
     *
     */
    close(stat = false) {

        this.view.dismiss({status: stat});
    }

}
