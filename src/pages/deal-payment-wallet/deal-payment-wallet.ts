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

import {Open} from '../../providers/open';


/*
 Generated class for the OpenLeadStatuses page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'deal-payment-wallet',
    templateUrl: 'deal-payment-wallet.html'
})
export class DealPaymentWalletPage {

    /**
     * id открытого лида
     *
     */
    public openLeadId: any;

    /**
     * Данные по кошельку
     *
     */
    public dealData: any = false;

    /**
     * Спинер загрузки
     *
     */
    public isLoading: boolean = false;

    /**
     * Показывать/непоказывать контент
     *
     */
    public isContent: boolean = false;


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
        this.openLeadId = this.navParams.get('openLeadId');

        this.getPaymentData();
    }


    ionViewDidLoad() {
        // console.log('ionViewDidLoad OpenLeadStatusesPage');
    }


    /**
     * Получение данных по платежу за сделку
     *
     */
    getPaymentData() {

        // console.log(this.openLeadId);

        this.isLoading = true;
        this.isContent = false;

        this.open.paymentDealWalletData({openLeadId: this.openLeadId})

            .subscribe(result => {
                // при получении итемов

                // переводим ответ в json
                let data = result.json();

                console.log(data);

                this.dealData = data.dealData;

                this.isLoading = false;
                this.isContent = true;

            }, err => {
                // в случае ошибки

                console.log('ERROR: ' + err);

                this.isLoading = false;
                this.isContent = true;

                // todo выводится сообщение об ошибке (нету связи и т.д.)

                // отключаем окно индикатора загрузки
                // loading.dismiss();
            });


    }


    /**
     * Алерт подтверждения платежа
     *
     */
    confirmPayment() {

        let title = 'Confirm payment';
        let message = 'Please confirm the payment';
        let cancel_button = 'Cancel';
        let pay_button = 'Make';

        this.translate.get('open_lead_deal_system_wallet_payment.confirmPayment.title', {}).subscribe((res: string) => {
            title = res;
        });

        this.translate.get('open_lead_deal_system_wallet_payment.confirmPayment.message', {}).subscribe((res: string) => {
            message = res;
        });

        this.translate.get('open_lead_deal_system_wallet_payment.confirmPayment.cancel_button', {}).subscribe((res: string) => {
            cancel_button = res;
        });

        this.translate.get('open_lead_deal_system_wallet_payment.confirmPayment.pay_button', {}).subscribe((res: string) => {
            pay_button = res;
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
                    text: pay_button,
                    handler: data => {
                        // console.log('Pay clicked');
                        this.makePayment();
                    }
                }
            ]
        });
        prompt.present();

    }


    /**
     * Выполнить платеж по сделке
     *
     */
    makePayment() {

        console.log('make payment');

        let loader = this.loadingCtrl.create({
            content: "Payment, please wait...",
        });
        loader.present();

        this.open.paymentDealWalletMake({openLeadId: this.openLeadId})

            .subscribe(result => {
                // при получении итемов

                // переводим ответ в json
                let data = result.json();

                console.log(data);

                // this.dealData = data.dealData;

                if (data.status == 'success') {
                    // если успешный платеж

                    this.close('success');

                } else {
                    // если ошибка в платеже
                    this.close('fail');

                }

                // this.isLoading = false;
                // this.isContent = true;
                loader.dismiss();

            }, err => {
                // в случае ошибки

                console.log('ERROR: ' + err);

                // this.isLoading = false;
                // this.isContent = true;

                // todo выводится сообщение об ошибке (нету связи и т.д.)

                // отключаем окно индикатора загрузки
                loader.dismiss();

                this.close('fail');
            });

    }


    /**
     * Закрытие страницы
     *
     */
    close(status = 'no_status') {

        this.view.dismiss({status: status});
    }

}