import {Component} from '@angular/core';
import {NavController, ToastController, Nav, LoadingController} from 'ionic-angular';

import {TranslateService} from 'ng2-translate/ng2-translate';

import {LoginPage} from '../login/login'
import {RegistrationDataPage} from '../registration-data/registration-data'
import {User} from '../../providers/user';

/*
 Generated class for the Signup page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'email-confirmation',
    templateUrl: 'email-confirmation.html'
})
export class EmailConfirmationPage {

    /**
     * Код подтверждения
     *
     */
    public confirmationCode: string = '';


    /**
     * Сообщение об ошибке
     *
     */
    public error: boolean = false;

    constructor(public navCtrl: NavController,
                public user: User,
                public nav: Nav,
                public toastCtrl: ToastController,
                public loadingCtrl: LoadingController,
                public translateService: TranslateService) {


        // let confirmatio = localStorage.getItem('waitConfirmation');
    }


    /**
     * Событие при фокусе на поле инпута
     *
     */
    onFocus(event) {

        this.error = false;
        // console.log(this.confirmationCode.length);
    }


    /**
     * Событие при изменении поля инпута
     *
     */
    onChange(event) {

        this.confirmationCode = this.confirmationCode.replace(/\D+/g,"");

        if(this.confirmationCode.length > 5) {

            this.confirmationCode = this.confirmationCode.substr(0,5);
        }
    }


    /**
     *  Подтверждение мэила
     *
     */
    confirm() {

        // проверка на заполнение поля
        if (this.confirmationCode.trim().length < 5) {
            // если поле пустое - выходим из метода
            return false;
        }

        // инициация окна загрузки
        let loading = this.loadingCtrl.create({
            content: 'Please wait...'
        });

        // показ окна загрузки
        loading.present();

        // todo удалить
        console.log('confirmation');

        // отправка запроса на подтверждение кода
        this.user.activate(this.confirmationCode.trim())
        // ожидание ответа сервера
            .subscribe(resp => {

                // преобразование ответа в json
                let res = resp.json();

                console.log('activate');
                console.log(res);

                // обработка ответа сервера
                if (res.status == 'success') {
                    // при успешной активации

                    // todo переходим на страницу заполнения данных
                    this.nav.setRoot(RegistrationDataPage);

                } else {
                    // при ошибке активации

                    this.error = true;

                    // сообщаем об ошибке активации
                    console.log('неверный код подтверждения');

                    // return { status: 'error'};
                }

                loading.dismiss();

            }, err => {
                console.error('ERROR', err);
                loading.dismiss();
            });
    }



    /**
     *  Повторная отправка мэила
     *
     */
    resendActivationCode() {


        // todo удалить
        console.log('resendActivationCode');

        // отправка запроса на подтверждение кода
        this.user.resendActivationCode()
        // ожидание ответа сервера
            .subscribe(resp => {

                // преобразование ответа в json
                let res = resp.json();

                // console.log('resendActivationCode');
                // console.log(res);

            }, err => {
                console.error('ERROR', err);
            });
    }




    doRegistration() {

        // инициация окна загрузки
        let loading = this.loadingCtrl.create({
            content: 'Registration, please wait...'
        });

        // показ окна загрузки
        // loading.present();


        // console.log(this.account);


        // account: {email: string, password: string, confirmPassword: string} = {
        //     email: 'test@example.com',
        //     password: 'test',
        //     confirmPassword:

        // this.user.registrationStepOne({email: this.account.email, password: this.account.password})
        //     .subscribe(result => {
        //         // If the API returned a successful response, mark the user as logged in
        //
        //         let data = result.json();
        //
        //         console.log(data);
        //         // console.log(res);
        //         // if (res.status == 'success') {
        //         //     this._loggedIn(res);
        //         // }
        //
        //         // if (res.status == 'Ok') {
        //         //     this._loggedIn(res);
        //         // }
        //
        //
        //     }, err => {
        //         console.error('ERROR', err);
        //         // alert('ERROR: ' + err);
        //
        //     });


    }


    /**
     * Возврат на страницу логина
     *
     */
    goBack() {
        // метод разлогинивания
        this.user.logout();
        // переходим на страницу логина
        this.nav.setRoot(LoginPage);
    }

}
