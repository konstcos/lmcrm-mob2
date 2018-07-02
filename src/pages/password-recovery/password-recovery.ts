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


    /**
     * Состояние мэила
     *
     */
    public emailState: number = 0;


    /**
     * Области с данными на странице
     *
     */
    public sections: any = {
        // область со спинером загрузки
        loading: false,
        // область с вводом мэила
        email: true,
        // страница с подтверждением (ввода кода подтверждения)
        confirmation: false,
        // ввод нового пароля
        credentials: false,
        // успешная смена пароля
        success: false,
        // блок с ошибками
        error: false
    };


    /**
     * Код подтверждения мэила
     *
     * для проверки принадлежности мэила
     * конкретному пользователю
     */
    public emailConfirmationCode: string = '';


    /**
     * Новый пароль
     *
     * данные нового пароля и его подтверждение
     */
    public credentials: any = {
        password: '',
        confirmPassword: ''
    };


    /**
     * Состояние пароля
     */
    public statePassword: any = {
        password: 0,
        confirmPassword: 0
    };


    /**
     * Ошибка кода подтверждения
     *
     */
    public emailConfirmationError: any = {
        empty: false,
        wrong: false,
    };


    /**
     * Код подтверждения пароля
     *
     * типа как токен
     */
    public passwordConfirmationCode: string = '';


    constructor(public navCtrl: NavController,
                public user: User,
                public nav: Nav,
                public view: ViewController,
                public toastCtrl: ToastController,
                public loadingCtrl: LoadingController,
                public translateService: TranslateService,
                public crash: CrashManager,
                public events: Events) {


        // очищаем токен подтверждения пароля
        this.passwordConfirmationCode = '';

        // let confirmatio = localStorage.getItem('waitConfirmation');
    }


    /**
     * Переключение областей на странице
     *
     * три области на странице:
     *     loading - область со спинером загрузки, показывается во время загрузки
     *     email - область ввода почтового адреса для подтверждения
     *     confirmation - ввод кода полученного по мэилу, для подтверждения мэила
     *     credentials - ввод логина и нового пароля
     *     auction - подтверждение отправки лида на аукцион
     *     error - область с ошибками, появляется во время ошибки загрузки
     */
    section(sectionName: any = false) {

        // закрываются все разделы
        this.closeAllSections();

        switch (sectionName) {

            case 'loading':
                // область со спинером загрузки
                this.sections.loading = true;
                break;

            case 'email':
                // область основных данных
                this.sections.email = true;
                break;

            case 'confirmation':
                // область подтверждения мэила
                this.sections.confirmation = true;
                break;

            case 'credentials':
                // область подтверждения мэила
                this.sections.credentials = true;
                break;

            case 'success':
                // сообщение об успешном смене пароля
                this.sections.success = true;
                break;

            case 'error':
                // вывод ошибки
                this.sections.error = true;
                break;

            default:
                // alert('wrong area name');
                break;
        }
    }


    /**
     * Закрывает все области
     *
     */
    closeAllSections() {
        // закрытие всех областей
        for (let section in this.sections) {
            // перебираем все области
            // закрываем их
            this.sections[section] = false;
        }
    }


    /**
     * Фокус на поле ввода мэила
     *
     */
    onFocus() {

        this.error = false;
    }

    /**
     * Событие при фокусе на поле инпута
     *
     */
    onBlur(event) {

        this.error = false;
        // console.log(this.confirmationCode.length);
    }

    /**
     * Валидация имени
     *
     */
    nameValidate() {

        // убираем ошибку
        this.emailState = 0;

        // проверка на заполнение поля
        if (this.email == '') {
            // пустой адрес
            this.emailState = 2;
            return false;
        }

        // адрес не валидный
        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,100})+$/.test(this.email.trim())) {
            // невалидный мэил
            this.emailState = 3;
            return false;
        }

        // помечаем что ввод успешен
        this.emailState = 1;
        return true;
    }


    /**
     * Убираем сообщение об ошибке имени при фокусе
     *
     */
    nameFocus() {
        // убираем ошибку
        this.emailState = 0;
    }


    /**
     * Потеря фокуса с поля ввода кода подтверждения мэила
     *
     */
    emailConfirmationOnFocus() {
        this.emailConfirmationError.empty = false;
        this.emailConfirmationError.wrong = false;
    }


    /**
     * Событие при изменении поля ввода кода подтверждения мэила
     *
     */
    emailConfirmationOnChange(event) {

        // убираем буквы из кода (только цифри)
        this.emailConfirmationCode = this.emailConfirmationCode.replace(/\D+/g, "");

        // проверка длины кода
        if (this.emailConfirmationCode.length > 5) {
            // если код больше 5, лишнее убираем
            this.emailConfirmationCode = this.emailConfirmationCode.substr(0, 5);
        }
    }


    /**
     * Валидация пароля
     *
     */
    passwordValidate() {

        // убираем ошибку
        this.statePassword.password = 0;

        if (this.credentials.confirmPassword != '') {
            this.passwordConfirmValidate();
        }

        // проверка на заполнение поля
        if (this.credentials.password == '') {
            // пустое поле пароля
            this.statePassword.password = 2;
            return false;
        }

        // длина пароля
        if (this.credentials.password.length < 5) {
            // если поле меньше определенного количества (5)
            this.statePassword.password = 3;
            return false;
        }


        // помечаем что ввод успешен
        this.statePassword.password = 1;
        if (this.credentials.confirmPassword != '') {
            this.passwordConfirmValidate();
        }

        // успешная валидация
        return true;
    }


    /**
     * Убираем сообщение об ошибке пароля при фокусе
     *
     */
    passwordFocus() {
        // убираем ошибку
        this.statePassword.password = 0;
    }


    /**
     * Валидация подтверждения пароля
     *
     */
    passwordConfirmValidate() {

        // убираем ошибку
        this.statePassword.confirmPassword = 0;

        // проверка подтверждения пароля
        if (this.statePassword.password != 1) {
            // подтверждение не соответствует паролю
            this.statePassword.confirmPassword = 3;
            return false;
        }

        // проверка на заполнение поля
        if (this.credentials.confirmPassword == '') {
            // пустое поле подтверждения пароля
            this.statePassword.confirmPassword = 2;
            return false;
        }

        // проверка подтверждения пароля
        if (this.credentials.confirmPassword != this.credentials.password) {
            // подтверждение не соответствует паролю
            this.statePassword.confirmPassword = 3;
            return false;
        }

        // помечаем что ввод успешен
        this.statePassword.confirmPassword = 1;
        return true;
        // console.log('Валидация подтверждение пароля');
    }


    /**
     * Валидация подтверждения пароля
     *
     */
    passwordConfirmFocus() {
        // убираем ошибку
        this.statePassword.confirmPassword = 0;
    }


    /**
     * Отправить ссылку восстановления пароля
     *
     */
    sendPasswordResetLink() {

        console.log(this.email);

        // todo валидация мэила
        // $validator = this.emailValidate();

        // todo проверка валидации
        // if (!$validator) {
        // если валидация не прошла
        // выходим из метода
        //     return false;
        // }

        // спинер загрузке
        this.section('loading');

        // запрос на получение данных
        this.user.sendForgotPassword({email: this.email})
            .subscribe(result => {
                // успешное получение ответов

                // преобразовываем ответ в json
                let data = result.json();

                // проверка статуса ответа
                if (data.status === 'success') {
                    // если ответ получен успешно

                    console.log('получил все хорошо');
                    console.log(data);

                    // переход на поле подтверждения пароля
                    this.section('confirmation');

                } else {
                    // ошибка при ответе

                    // выводится страница с ошибкой
                    this.section('error');
                }

            }, err => {
                // при ошибке

                // выводим страницы с ошибкой
                this.section('error');

                // this.crash.responseHandler(err);
            });


    }


    /**
     * Отправить код подтверждения мэила
     *
     */
    sendEmailConfirmation() {

        // если код не введен
        if (this.emailConfirmationCode.length == 0) {
            // выходим из метод
            return false;
        }

        // очищаем ошибку по коду подтверждения
        this.emailConfirmationError.wrong = false;

        // todo получение миэла из localStorage


        // спинер загрузке
        this.section('loading');

        // запрос на получение данных для ввода нового пароля
        this.user.forgotPasswordEmailConfirmation({email: this.email, confirmation: this.emailConfirmationCode})
            .subscribe(result => {
                // успешное получение ответов

                // преобразовываем ответ в json
                let data = result.json();

                // проверка статуса ответа
                if (data.status === 'success') {
                    // если ответ получен успешно

                    // сохраняем токен подтверждения пароля
                    this.passwordConfirmationCode = data.code;

                    // переход на поле подтверждения пароля
                    this.section('credentials');

                } else {
                    // ошибка при ответе
                    // отображение ошибки кода подтверждения
                    this.section('confirmation');
                    this.emailConfirmationError.wrong = true;
                }

            }, err => {
                // при ошибке

                // выводим страницы с ошибкой
                this.section('error');
                // this.crash.responseHandler(err);
            });
    }


    /**
     * Сохранение нового пароля
     *
     */
    saveNewPassword() {

        // сохраняем токен подтверждения пароля
        // this.passwordConfirmationCode = data.code;

        if(!this.passwordValidate()) {
            return false;
        }

        if(!this.passwordConfirmValidate()) {
            return false;
        }

        // спинер загрузке
        this.section('loading');

        // запрос на получение данных для ввода нового пароля
        this.user.saveNewPassword({
            email: this.email,
            password: this.credentials.password,
            confirmation: this.passwordConfirmationCode
        })
            .subscribe(result => {
                // успешное получение ответов

                // преобразовываем ответ в json
                let data = result.json();

                // проверка статуса ответа
                if (data.status === 'success') {
                    // если ответ получен успешно

                    // сохраняем токен подтверждения пароля
                    // this.passwordConfirmationCode = data.code;

                    // переход на поле подтверждения пароля
                    this.section('success');

                } else {
                    // ошибка при ответе
                    // отображение ошибки кода подтверждения

                    // очистка данных
                    this.email = '';
                    this.credentials.password = '';
                    this.credentials.confirmPassword = '';
                    this.passwordConfirmationCode = '';
                    this.emailState = 0;

                    this.section('error');
                }

            }, err => {
                // при ошибке

                // очистка данных
                this.email = '';
                this.credentials.password = '';
                this.credentials.confirmPassword = '';
                this.passwordConfirmationCode = '';
                this.emailState = 0;

                // выводим страницы с ошибкой
                this.section('error');
                // this.crash.responseHandler(err);
            });


    }


    /**
     * Переход к странице ввода миэла
     *
     */
    goToEmail() {
        this.section('email');
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
