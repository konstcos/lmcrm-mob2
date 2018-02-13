import {Component} from '@angular/core';
import {NavController, ViewController, NavParams, AlertController, LoadingController} from 'ionic-angular';

// главная страница
import {MainPage} from '../main/main'

import {Credits} from '../../providers/credits'
import {SafeResourceUrl, DomSanitizer} from '@angular/platform-browser';


/*
 Generated class for the Credits page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'credit-card-payment',
    providers: [Credits],
    templateUrl: 'credit-card-payment.html'
})
export class CreditCardPaymentPage {


    /**
     * Данные итема
     *
     */
    public item: any = false;


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
        surname: '',
        email: '',
        phone: '',
        amount: 0,
    };


    /**
     * Данные по ошибкам ввода
     *
     */
    public errors: any = {
        name: false,
        surname: false,
        phone: false,
        email: false,
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
                public view: ViewController,
                public credits: Credits,
                private domSanitizer: DomSanitizer,
                public loadingCtrl: LoadingController,
                public alertCtrl: AlertController) {

        // получение id итема
        this.item = this.navParams.get('item');

        // получение данных по выводу денег
        this.getCreditCardData();
    }


    ionViewDidLoad() {
        // console.log('ionViewDidLoad CreditsPage');
    }


    /**
     * Получить данные по кредитной карте
     *
     */
    getCreditCardData() {

        // this.credits.creditCardPayment({item_id: item.id})
        // this.credits.getDetailCreditCardPayment({item_id: item.id})

        this.isLoading = true;

        this.dataBlock = false;

        this.credits.getDetailCreditCardPayment({item_id: this.item.id})
            .subscribe(result => {
                // при получении итемов

                // переводим ответ в json
                let data = result.json();

                console.log(data);

                if (data.status == 'success') {

                    // todo данные пользователя по карте

                    this.data = {
                        name: data.info.user.first_name,
                        surname: data.info.user.last_name,
                        email: data.info.user.email,
                        phone: data.info.requestPayment.initiator.phone,
                        amount: data.info.requestPayment.amount,
                    };

                    console.log(this.data);

                } else {

                    console.log('error');
                }

                this.isLoading = false;
                this.dataBlock = true;


            }, err => {
                // в случае ошибки

                console.log('ERROR: ' + err);

                this.isLoading = false;
                this.dataBlock = true;
            });
    }


    /**
     *
     *
     */
    phoneFocus() {

    }


    /**
     * Валидация телефона
     *
     */
    phoneValidate() {
        // Проверка на пустое поле
        if (this.data.phone == '') {
            this.errors.phone = true;
            return false;
        }

        // Проверка длины должно быть не меньше 9 и не больше 10
        // if (this.data.phone.length < 9 || this.data.phone.length > 10) {
        //     this.errors.phone = true;
        //     return false;
        // }

        // Проверка по регулярке
        let reg = /^\+?(972|0)(\-)?0?(([23489]{1}\d{7})|[5]{1}\d{8})$/;
        if (!reg.test(this.data.phone)) {
            this.errors.phone = true;
            return false;
        }

        this.errors.phone = false;
        return true;
    }

    /**
     * Проверка поля с телефонным номером при вводе нового символа
     *
     */
    phoneChange(event) {

        console.log('сработал чендж телефона');
        console.log(event);

        // сохраняем старые данные
        // let oldData = this.data.phone;

            setTimeout(() => {
                    this.data.phone = event.replace(/\D+/g,"");
                }
                , 0);


        console.log(this.data.phone);

        // let passportValue = this.personalData.passport.replace(/\D+/g,"");



        // проверка на максимальную длину номера телефона
        // if (event.length > 10) {
        //
        //     // возвращаем старые данные
        //     setTimeout(() => {
        //             this.data.phone = oldData;
        //         }
        //         , 0);
        //
        //     return false;
        // }


        // перебираем все символы новых данных
        // for (let item = 0; item < event.length; item++) {
        //
        //     console.log('перебор всей строки');
        //
        //     // если символ из новых данных не равняется символу в старых данных
        //     // (выбор нового введенного символа)
        //     if (event[item] != this.data.phone[item]) {
        //
        //         console.log('первый if');
        //
        //         // проверка нового символа на integer
        //         if (!Number(event[item]) && event[item] != '0') {
        //             // если новый символ не цифра
        //
        //             console.log('второй if');
        //
        //             // возвращаем старые данные
        //             setTimeout(() => {
        //
        //                     console.log('сработал таймаут');
        //
        //                     this.data.phone = oldData;
        //                 }
        //                 , 0);
        //         }
        //
        //         // выходим из цикла
        //         break;
        //     }
        // }
    }

    /**
     * Подтверждение данных на вывод
     *
     */
    confirmPayment() {

        // обнуляем все ошибки
        this.errors.name = false;
        this.errors.surname = false;
        this.errors.email = false;
        this.errors.phone = false;
        this.errors.amount = false;


        if (this.data.name.trim() == '') {
            this.errors.name = true;
            return false;
        }

        if (this.data.surname.trim() == '') {
            this.errors.surname = true;
            return false;
        }

        if (this.data.email.trim() == '') {
            this.errors.mail = true;
            return false;
        }

        if (this.data.phone.trim() == '') {
            this.errors.phone = true;
            return false;
        }

        if (this.data.amount <= 0) {
            this.errors.amount = true;
            return false;
        }

        if (!this.phoneValidate()) {
            return false;
        }

        // показывает окно загрузки
        let loading = this.loadingCtrl.create({
            content: 'Please wait...'
        });

        loading.present();


        let request = {
            item_id: this.item.id,
            name: this.data.name,
            surname: this.data.surname,
            email: this.data.email,
            phone: this.data.phone,
            amount: this.data.amount,
        };


        this.credits.creditCardPayment(request)
            .subscribe(result => {
                // при получении итемов

                // переводим ответ в json
                let data = result.json();

                console.log(data);

                if (data.status == 'success') {

                    // this.data = {
                    //     name: data.info.user.last_name + ' ' + data.info.user.first_name,
                    //     mail: data.info.user.email,
                    //     phone: data.info.requestPayment.initiator.phone,
                    //     amount: data.info.requestPayment.amount,
                    // };
                    //
                    // console.log(this.data);

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


    webPage() {

        return this.domSanitizer.bypassSecurityTrustResourceUrl(this.invoiceUrl);
    }


    /**
     * Сохранить заявку на вывод денег
     *
     */
    makeWithdrawal() {

        // показывает окно загрузки
        let loading = this.loadingCtrl.create({
            content: 'Make withdrawal, please wait...'
        });
        loading.present();


        let data = {
            withdrawal: this.data.amount,
            company: this.data.company,
            bank: this.data.bank,
            branch_number: this.data.branch_number,
            invoice_number: this.data.invoice_number,
        };


        this.credits.createWithdrawal(data)
            .subscribe(result => {
                // при получении итемов

                // переводим ответ в json
                let resData = result.json();

                console.log(resData);

                // отключаем окно индикатора загрузки
                loading.dismiss();

                if (resData.status == 'success') {

                    this.goBack({status: 'success', info: 'makeWithdrawal', data: resData.result})

                } else if (resData.info == 'low_balance') {


                    // In your account 40 dollars. You can not withdraw more than this.

                    let message = 'In your wallet <b>&#8362; ' + resData.balance + '</b>. You can not withdraw more than this.';

                    let alert = this.alertCtrl.create({
                        title: 'Insufficient balance',
                        message: message,
                        buttons: [
                            {
                                text: 'Ok',
                                handler: () => {
                                    console.log('Ok clicked');
                                }
                            }
                        ]
                    });
                    alert.present();

                } else {

                    this.goBack({status: 'success', info: 'errorWithdrawal'})
                }


            }, err => {
                // в случае ошибки

                console.log('ERROR: ' + err);

                // todo выводится сообщение об ошибке (нету связи и т.д.)

                // отключаем окно индикатора загрузки
                loading.dismiss();

                // this.goBack({status: 'success', info: 'errorReplenishment'})
            });


    }


    /**
     * Возврат назад
     *
     */
    goBack(data: any = {status: 'success', info: false}) {
        this.view.dismiss(data);
    }
}
