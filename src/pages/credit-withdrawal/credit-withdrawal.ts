// credit-withdrawal
import {Component} from '@angular/core';
import {NavController, ViewController, NavParams, AlertController, LoadingController} from 'ionic-angular';

// главная страница
import {MainPage} from '../main/main'

import {Credits} from '../../providers/credits'


/*
 Generated class for the Credits page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'credit-withdrawal',
    providers: [Credits],
    templateUrl: 'credit-withdrawal.html'
})
export class CreditWithdrawalPage {


    /**
     * Данные по выводу денег
     *
     */
    public data: any = {
        amount: 0,
        bank: '',
        branch_number: '',
        company: '',
        invoice_number: '',
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
                public view: ViewController,
                public credits: Credits,
                public loadingCtrl: LoadingController,
                public alertCtrl: AlertController) {

        // this.get();
        // получение данных по выводу денег
        this.getWithdrawalData();
    }


    ionViewDidLoad() {
        console.log('ionViewDidLoad CreditsPage');
    }


    /**
     * Получить данные по выводу средств из системы
     *
     */
    getWithdrawalData() {

        this.isLoading = true;

        this.credits.getWithdrawalData()
            .subscribe(result => {
                // при получении итемов

                // переводим ответ в json
                let data = result.json();

                console.log(data);

                if (data.status == 'success') {

                    this.data = {
                        amount: 0,
                        bank: data.withdrawal.bank,
                        branch_number: data.withdrawal.branch_number,
                        company: data.withdrawal.company,
                        invoice_number: data.withdrawal.invoice_number,
                    };

                    console.log(this.data);

                } else {

                    console.log('error');
                }

                this.isLoading = false;

            }, err => {
                // в случае ошибки

                console.log('ERROR: ' + err);

                this.isLoading = false;
            });
    }





    /**
     * Подтверждение заявки на вывод денег
     *
     */
    confirmWithdrawal() {

        // обнуляем все ошибки
        this.errors.bank = false;
        this.errors.branch_number = false;
        this.errors.company = false;
        this.errors.invoice_number = false;

        if(this.data.bank.trim() == ''){
            this.errors.bank = true;
            return false
        }

        if(this.data.branch_number.trim() == ''){
            this.errors.branch_number = true;
            return false
        }

        if(this.data.company.trim() == ''){
            this.errors.company = true;
            return false
        }

        if(this.data.invoice_number.trim() == ''){
            this.errors.invoice_number = true;
            return false
        }


        if (this.data.amount < 2000) {

            let message = 'The minimum amount for withdrawal is <b>&#8362; 2000</b>. You have entered <b>&#8362; ' + this.data.amount + '</b>.';

            let alert = this.alertCtrl.create({
                title: 'Error',
                message: message,
                buttons: [
                    {
                        text: 'Ok',
                        handler: () => {
                            // this.makeReplenishment();
                            console.log('Ok clicked');
                        }
                    }
                ]
            });
            alert.present();

            return false;
        }


        let alert = this.alertCtrl.create({
            title: 'Confirmation',
            message: 'Will be created a statement for output <b>&#8362; ' + this.data.amount + '</b> from yor wallet in the system.',
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Ok',
                    handler: () => {
                        this.makeWithdrawal();
                        console.log('Ok clicked');
                    }
                }
            ]
        });
        alert.present();

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

                } else if(resData.info == 'low_balance') {


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
