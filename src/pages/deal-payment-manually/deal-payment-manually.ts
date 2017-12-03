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

import {Credits} from '../../providers/credits';
import {Open} from '../../providers/open';


/*
    Оплата сделки через прямую банковскую транзакцию
 */
@Component({
    providers: [Credits, Open],
    selector: 'deal-payment-manually',
    templateUrl: 'deal-payment-manually.html'
})
export class DealPaymentManuallyPage {


    /**
     * id открытого лида по которому будет идти платеж
     *
     */
    public openLeadId: any;


    /**
     * Реквизиты полученные с сервера
     *
     */
    public requisites: any = false;


    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public open: Open,
                public credits: Credits,
                private alertCtrl: AlertController,
                public modalCtrl: ModalController,
                public toastCtrl: ToastController,
                public loadingCtrl: LoadingController,
                public actionSheetCtrl: ActionSheetController,
                public view: ViewController,
                public translate: TranslateService) {

        // получение id открытого лида
        this.openLeadId = this.navParams.get('openLeadId');

        // получение реквизитов для оплаты с сервера
        this.getRequisites();
    }


    ionViewDidLoad() {
        // console.log('ionViewDidLoad');
    }


    /**
     * Реквизиты по оплате
     * получение с сервера
     *
     */
    getRequisites() {

        this.credits.getRequisites()
            .subscribe(result => {
                // при получении итемов

                // переводим ответ в json
                let data = result.json();

                // console.log('Реквизиты с сервера:');
                console.log(data);

                this.requisites = data.requisites;

            }, err => {
                // в случае ошибки

                console.log('ERROR: ' + err);


            });

    }


    /**
     * Алерт подтверждения платежа
     *
     */
    confirmPayment() {

        let title = 'Payment confirmation';
        let message = 'You confirm that you transferred the required amount to the specified account';
        let cancel_button = 'Cancel';
        let confirm_button = 'Confirm';

        this.translate.get('open_lead_deal_manual_payment.confirmPayment.title', {}).subscribe((res: string) => {
            title = res;
        });

        this.translate.get('open_lead_deal_manual_payment.confirmPayment.message', {}).subscribe((res: string) => {
            message = res;
        });

        this.translate.get('open_lead_deal_manual_payment.confirmPayment.cancel_button', {}).subscribe((res: string) => {
            cancel_button = res;
        });

        this.translate.get('open_lead_deal_manual_payment.confirmPayment.confirm_button', {}).subscribe((res: string) => {
            confirm_button = res;
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
                    text: confirm_button,
                    handler: data => {
                        // console.log('Saved clicked');
                        this.paymentDealBankTransaction();
                    }
                }
            ]
        });
        prompt.present();
    }


    /**
     * Оплата сделки через банковский перевод
     *
     */
    paymentDealBankTransaction() {

        this.open.paymentDealBankTransaction({open_lead_id: this.openLeadId})

            .subscribe(result => {
                // при получении итемов

                // переводим ответ в json
                let data = result.json();

                console.log(data);

                if (data.status == 'success') {
                    // обновление данных по сделке
                    this.close('success');
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
     * Закрытие страницы
     *
     */
    close(status = 'no_status') {

        this.view.dismiss({status: status});
    }

}