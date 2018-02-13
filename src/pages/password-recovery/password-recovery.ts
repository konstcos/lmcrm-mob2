import {Component} from '@angular/core';
import {NavController, Nav, ToastController, ViewController, LoadingController, Events} from 'ionic-angular';

import {TranslateService} from 'ng2-translate/ng2-translate';

import {LoginPage} from '../login/login'
import {RegistrationDataPage} from '../registration-data/registration-data'
import {User} from '../../providers/user';
import {CrashManager} from '../../providers/crash_manager';


/*
 Generated class for the Signup page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'password-recovery',
    templateUrl: 'password-recovery.html'
})
export class PasswordRecovery {


    /**
     * Сообщение об ошибке
     *
     */
    public error: boolean = false;


    /**
     * Меил на востановление пароля
     *
     */
    public email: string = '';


    constructor(public navCtrl: NavController,
                public user: User,
                public nav: Nav,
                public view: ViewController,
                public toastCtrl: ToastController,
                public loadingCtrl: LoadingController,
                public translateService: TranslateService,
                public crash: CrashManager,
                public events: Events) {


        // let confirmatio = localStorage.getItem('waitConfirmation');
    }


    /**
     * Фокус на поле ввода мэила
     *
     */
    onFocus() {

        this.error = false;
    }

    /**
     * Потеря фокуса с поля ввода мэила
     *
     */
    onBlur() {

        this.error = false;
    }


    /**
     * Валидация мэила
     *
     */
    mailValicate() {

    }


    /**
     * Отправить ссылку восстановления пароля
     *
     */
    sendPasswordResetLink(){


        // // инициация окна загрузки
        // let loading = this.loadingCtrl.create({
        //     content: 'Please wait...'
        // });
        //
        // // показ окна загрузки
        // loading.present();
        //
        // loading.dismiss();

        this.user.sendForgotPassword({email: this.email})
            .subscribe(result => {
                // If the API returned a successful response, mark the user as logged in

                let data = result.json();

                console.log(data);



                // console.log(res);
                // if (res.status == 'success') {
                //     this._loggedIn(res);
                // }

                // if (res.status == 'Ok') {
                //     this._loggedIn(res);
                // }

            }, err => {

                this.crash.responseHandler(err);


                // console.error('ERROR', err);
                // alert('ERROR: ' + err);

            });



    }


    /**
     * Возврат на страницу логина
     *
     */
    goBack() {
        // переходим на страницу логина
        // this.view.dismiss();
        this.nav.setRoot(LoginPage);

    }

}
