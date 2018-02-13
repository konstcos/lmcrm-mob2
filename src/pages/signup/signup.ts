import {Component} from '@angular/core';
import {NavController, ToastController, Nav, LoadingController} from 'ionic-angular';

import {TranslateService} from 'ng2-translate/ng2-translate';

import {LoginPage} from '../login/login'
import {RegistrationDataPage} from '../registration-data/registration-data'
import {EmailConfirmationPage} from '../email-confirmation/email-confirmation'
import {User} from '../../providers/user';

/*
 Generated class for the Signup page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'page-signup',
    templateUrl: 'signup.html'
})
export class SignupPage {

    /**
     * Данные регистрации
     *
     */
    public account: {email: string, password: string, confirmPassword: string} = {
        email: '',
        password: '',
        confirmPassword: ''
    };


    /**
     * Состояние введенных данных
     *
     *
     * name
     *   0 - нету ввода
     *   1 - успешный ввод
     *   2 - поле пустое
     *   3 - невалидный мэил
     *   4 - такой адрес уже есть
     *
     * password
     *   0 - нету ввода
     *   1 - успешный ввод
     *   2 - поле пустое
     *   3 - недостаточное количество символов в пароле
     *
     * confirmPassword
     *   0 - нету ввода
     *   1 - успешный ввод
     *   2 - поле пустое
     *   3 - пароль не соответствует подтверждению
     *
     */
    public state: any = {
        name: 0,
        password: 0,
        confirmPassword: 0
    };


    constructor(public navCtrl: NavController,
                public user: User,
                public nav: Nav,
                public toastCtrl: ToastController,
                public loadingCtrl: LoadingController,
                public translateService: TranslateService) {

    }


    /**
     * Валидация имени
     *
     */
    nameValidate() {

        // убираем ошибку
        this.state.name = 0;

        // проверка на заполнение поля
        if (this.account.email == '') {
            // пустой адрес
            this.state.name = 2;
            return false;
        }

        // адрес не валидный
        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,100})+$/.test(this.account.email.trim())) {
            // невалидный мэил
            this.state.name = 3;
            return false;
        }

        // todo такой адрес уже есть

        // помечаем что ввод успешен
        this.state.name = 1;
        return true;

        // console.log('Валидация имени');
    }


    /**
     * Убираем сообщение об ошибке имени при фокусе
     *
     */
    nameFocus() {
        // убираем ошибку
        this.state.name = 0;
    }


    /**
     * Валидация пароля
     *
     */
    passwordValidate() {

        // убираем ошибку
        this.state.password = 0;

        // todo проверка на заполнение поля
        if (this.account.password == '') {
            // пустое поле пароля
            this.state.password = 2;
            return false;
        }

        // todo длина пароля
        if (this.account.password.length < 5) {
            // если поле меньше определенного количества (5)
            this.state.password = 3;
            return false;
        }


        // помечаем что ввод успешен
        this.state.password = 1;
        return true;

        // console.log('Валидация пароля');
    }


    /**
     * Убираем сообщение об ошибке пароля при фокусе
     *
     */
    passwordFocus() {
        // убираем ошибку
        this.state.password = 0;
    }


    /**
     * Валидация подтверждения пароля
     *
     */
    passwordConfirmValidate() {

        // убираем ошибку
        this.state.confirmPassword = 0;

        // todo проверка на заполнение поля
        if (this.account.confirmPassword == '') {
            // пустое поле подтверждения пароля
            this.state.confirmPassword = 2;
            return true;
        }

        // todo проверка подтверждения пароля
        if (this.account.confirmPassword != this.account.password) {
            // подтверждение не соответствует паролю
            this.state.confirmPassword = 3;
            return true;
        }

        // помечаем что ввод успешен
        this.state.confirmPassword = 1;
        return true;
        // console.log('Валидация подтверждение пароля');
    }


    /**
     * Валидация подтверждения пароля
     *
     */
    passwordConfirmFocus() {
        // убираем ошибку
        this.state.confirmPassword = 0;
    }


    /**
     * Возврат на страницу логина
     *
     */
    goBack() {
        this.nav.setRoot(LoginPage);
    }


    /**
     * Процесс регистрации
     *
     */
    doRegistration() {


        // проверка на наличия емила
        if (this.account.email.trim() == '') {
            // пустой мэил
            this.state.name = 3;
            return false;
        }

        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,100})+$/.test(this.account.email.trim())) {
            // невалидный мэил
            this.state.name = 3;
            return false;
        }

        // проверка на наличия пароля
        if (this.account.password.trim() == '') {
            // пустое поле пароля
            this.state.password = 2;
            return false;
        }


        // проверка на подтверждение пароля
        if (this.account.password != this.account.confirmPassword) {
            return false;
        }


        // инициация окна загрузки
        let loading = this.loadingCtrl.create({
            content: 'Registration, please wait...'
        });

        // показ окна загрузки
        loading.present();


        // регистрация
        this.user.registrationStepOne({email: this.account.email, password: this.account.password})
            .subscribe(result => {
                // If the API returned a successful response, mark the user as logged in

                let data = result.json();

                console.log(data);

                // результат регистрации
                if (data.status == 'success') {
                    // регистрация успешна

                    // отправка запроса на залогинивание
                    this.user.login(this.account)
                    // подписываемся на получение результата
                        .subscribe(resp => {
                            // обработка результата

                            // преобразование результата в json
                            let res = resp.json();

                            this.nav.setRoot(EmailConfirmationPage);

                            loading.dismiss();

                        }, (err) => {
                            // this.navCtrl.push(MainPage);
                            // Unable to log in
                            loading.dismiss();
                        });

                } else {
                    // регистрация отменена

                    // если такой адрес уже существует
                    if(data.data == 'email_exists'){

                        // обнуляем пароль
                        this.account.password = '';

                        // обнуляем подтверждение пароля
                        this.account.confirmPassword = '';

                        // обнуляем ошибки
                        this.state = {
                            name: 4,
                            password: 0,
                            confirmPassword: 0
                        };
                    }


                    loading.dismiss();
                }

                // if (res.status == 'Ok') {
                //     this._loggedIn(res);
                // }

                // loading.dismiss();

            }, err => {
                console.error('ERROR', err);
                // alert('ERROR: ' + err);
                loading.dismiss();
            });

        // setTimeout(()=>{
        //
        //     localStorage.setItem('waitConfirmation', 'true');
        //
        //     this.waitConfirmation = true;
        //
        //
        //
        //     loading.dismiss();
        //
        // }, 1000);

    }


    /**
     * Событие по кнопке возврата
     *
     */
    backButtonAction(){
        this.goBack();
    }
}
