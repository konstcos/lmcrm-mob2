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
import {SafeResourceUrl, DomSanitizer} from '@angular/platform-browser';
import {TranslateService} from 'ng2-translate/ng2-translate';

import {CorrespondencePage} from '../correspondence/correspondence'

import {Open} from '../../providers/open';


/*
 Generated class for the OpenLeadStatuses page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'deal-payment-card',
    templateUrl: 'deal-payment-card.html'
})
export class DealPaymentCardPage {

    /**
     * Данные итема
     *
     */
    public item: any = false;


    /**
     * id открытого лида
     *
     */
    public openLeadId: any = false;


    /**
     * Блок с данными
     *
     */
    public dataBlock: boolean = false;


    /**
     * Ссылка на получение данных по инвойсу
     *
     */
    public invoiceUrl: any = false;


    /**
     * Блок с данными с сайта кредитов
     *
     */
    public creditBlock: boolean = false;


    /**
     * Данные по вводу денег
     *
     */
    public data: any = {
        name: '',
        email: '',
        phone: '',
        amount: 0,
    };


    /**
     * Данные по ошибкам ввода
     *
     */
    public errors: any = {
        bank: false,
        branch_number: false,
        company: false,
        invoice_number: false,
    };


    /**
     * Вывод спинера загрузки
     *
     */
    public isLoading: boolean = false;


    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public open: Open,
                private alertCtrl: AlertController,
                private domSanitizer: DomSanitizer,
                public modalCtrl: ModalController,
                public toastCtrl: ToastController,
                public loadingCtrl: LoadingController,
                public actionSheetCtrl: ActionSheetController,
                public view: ViewController,
                public translate: TranslateService) {

        // получение id итема
        this.openLeadId = this.navParams.get('openLeadId');

        // получение данных по выводу денег
        this.getCreditCardData();

    }


    ionViewDidLoad() {
        // console.log('ionViewDidLoad OpenLeadStatusesPage');
    }


    /**
     * Получить данные по кредитной карте
     *
     */
    getCreditCardData() {

        // показываем спинер загрузки
        this.isLoading = true;

        // показываем блок с данными
        this.dataBlock = false;

        // загружаем данные с сервера
        this.open.getDataForCreditCardTransaction({openLeadId: this.openLeadId})
            .subscribe(result => {
                // при получении данных

                // переводим ответ в json
                let data = result.json();

                // проверка статуса ответа
                if (data.status == 'success') {
                    // если все нормально

                    // заполняем данные в блоке
                    this.data = {
                        name: data.dealData.surname + ' ' + data.dealData.name,
                        email: data.dealData.email,
                        phone: data.dealData.phone,
                        amount: data.dealData.amount,
                    };

                    // убираем спинер
                    this.isLoading = false;
                    // показываем блок с данными
                    this.dataBlock = true;

                } else {

                    // убираем спинер
                    this.isLoading = false;

                    console.log('error');
                }

            }, err => {
                // в случае ошибки

                console.log('ERROR: ' + err);

                this.isLoading = false;
                this.dataBlock = true;
            });
    }


    /**
     * Подтверждение данных по оплате
     *
     */
    confirmPayment() {

        // обнуляем все ошибки
        this.errors.name = false;
        this.errors.email = false;
        this.errors.phone = false;
        this.errors.amount = false;


        if(this.data.name.trim() == ''){
            this.errors.name = true;
            return false
        }

        if(this.data.email.trim() == ''){
            this.errors.mail = true;
            return false
        }

        if(this.data.phone.trim() == ''){
            this.errors.phone = true;
            return false
        }

        if(this.data.amount <= 0){
            this.errors.amount = true;
            return false
        }


        // показывает окно загрузки
        let loading = this.loadingCtrl.create({
            content: 'Please wait...'
        });
        loading.present();

        let request = {
            openLeadId: this.openLeadId,
            name: this.data.name,
            email: this.data.email,
            phone: this.data.phone,
            amount: this.data.amount,
        };

        this.open.makeCreditCardTransaction(request)
            .subscribe(result => {
                // при получении итемов

                // переводим ответ в json
                let data = result.json();

                console.log(data);

                if (data.status == 'success') {


                    // this.invoiceUrl = data.info.ClearingRedirectUrl;
                    this.invoiceUrl = data.info;

                    // console.log(this.invoiceUrl);

                } else {

                    console.log('error');
                }

                loading.dismiss();

                this.dataBlock = false;
                this.creditBlock = true;

            }, err => {
                // в случае ошибки

                console.log('ERROR: ' + err);

                loading.dismiss();

                this.dataBlock = false;
                this.creditBlock = false;
            });
    }


    webPage(){

        return this.domSanitizer.bypassSecurityTrustResourceUrl(this.invoiceUrl);
    }


    /**
     * Закрытие страницы
     *
     */
    close() {

        this.view.dismiss();
    }

}