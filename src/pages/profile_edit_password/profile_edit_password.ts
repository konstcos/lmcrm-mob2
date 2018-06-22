import {Component} from '@angular/core';
import {
    LoadingController,
    NavController,
    NavParams,
    ViewController,
} from 'ionic-angular';


import {User} from '../../providers/user';


/*
 Generated class for the OpenLeadOrganizer page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'profile_edit_password_page',
    templateUrl: 'profile_edit_password.html',
    providers: [User]
})
export class ProfileEditPasswordPage {


    /**
     * Данные
     *
     */
    public data: any = {
        password: '',
        password_confirmation: '',
    };

    /**
     * Состояние полей (ошибки, либо нормально)
     *
     *
     */
    private state = {

        /**
         *     0 пустое значение (ничего не выводить)
         *     1 успешный ввод, ошибок нет
         *     2 пустое поле пароля
         *     3 короткий пароль
         */
        password: 0,

        /**
         *     0 пустое значение (ничего не выводить)
         *     1 успешный ввод, ошибок нет
         *     2 подтверждение не соответствует паролю
         *     3 короткий пароль
         */
        password_confirmation: 0,
    };


    /**
     * Области с данными на странице
     *
     */
    public sections: any = {
        // область со спинером загрузки
        loading: false,
        // область с данными
        data: true,
        // вывод ошибки
        error: false
    };


    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public view: ViewController,
                public loadingCtrl: LoadingController,
                public user: User) {

    }


    /**
     * Переключение областей на странице
     *
     * три области на странице:
     *     loading - область со спинером загрузки, показывается во время загрузки
     *     data - область с данными, показывается когда данные успешно загруженны
     */
    section(sectionName: any = false) {

        // закрываются все разделы
        this.closeAllSections();

        switch (sectionName) {

            case 'loading':
                // область со спинером загрузки
                this.sections.loading = true;
                break;

            case 'data':
                // область основных данных
                this.sections.data = true;
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
     * Валидация пароля
     *
     */
    passwordValidate() {

        // убираем ошибку
        this.state.password = 0;

        if (this.data.password_confirmation != '') {
            this.passwordConfirmValidate();
        }

        // проверка на заполнение поля
        if (this.data.password == '') {
            // пустое поле пароля
            this.state.password = 0;
            this.state.password_confirmation = 0;
            this.data.password_confirmation = '';
            return false;
        }

        // длина пароля
        if (this.data.password.length < 5) {
            // если поле меньше определенного количества (5)
            this.state.password = 3;
            return false;
        }


        // помечаем что ввод успешен
        this.state.password = 1;
        if (this.data.password_confirmation != '') {
            this.passwordConfirmValidate();
        }

        // успешная валидация пароля
        return true;
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
        this.state.password_confirmation = 0;

        // проверка подтверждения пароля
        if (this.state.password != 1) {
            // подтверждение не соответствует паролю
            this.state.password_confirmation = 2;
            return false;
        }

        // проверка на заполнение поля
        if (this.data.password_confirmation == '') {
            // пустое поле подтверждения пароля
            this.state.password_confirmation = 2;
            return false;
        }

        // проверка подтверждения пароля
        if (this.data.password_confirmation != this.data.password) {
            // подтверждение не соответствует паролю
            this.state.password_confirmation = 2;
            return false;
        }

        // помечаем что ввод успешен
        this.state.password_confirmation = 1;

        // успешная валидация
        return true;
    }


    /**
     * Валидация подтверждения пароля
     *
     */
    passwordConfirmFocus() {
        // убираем ошибку
        this.state.password_confirmation = 0;
    }



    /**
     * Сохранение основных данных о агенте
     *
     */
    saveData() {

        // todo валидация данных

        let loading = this.loadingCtrl.create({
        });

        loading.present();

        this.user.changePasswordThroughProfile(this.data)
            .subscribe(result => {
                    // при получении итемов

                    // переводим ответ в json
                    let data = result.json();

                    // обработка ответа
                    if (data.status == 'success') {
                        // ответ получе нормально

                        // закрытие модального окна
                        // с передачей данных родительскому
                        this.close('data_saved');

                    } else {
                        // ошибка в ответе

                        // вывод блока с ошибкой
                        this.section('error');
                    }

                    loading.dismiss();

                }, err => {
                    // в случае ошибки

                    loading.dismiss();

                    // вывод блока с ошибкой
                    this.section('error');

                    console.log('ERROR: ' + err);
                }
            );
    }



    /**
     * Включение/отключение кнопки Save
     *
     */
    isSaveDisabled(): boolean {

        // при включенной страние ошибки
        // OFF (выключаем кнопку)
        if (this.sections.error)
            return true;

        // если валидация пароля не пройденна
        // OFF (выключаем кнопку)
        if (this.state.password !== 1)
            return true;

        // если валидация подтверждения пароля не пройденна
        // OFF (выключаем кнопку)
        if (this.state.password_confirmation !== 1)
            return true;

        // если все валидации пройденны успешно
        // ON (включаем кнопку)
        return false;
    }


    /**
     * Закрытие окна
     *
     * по умолчанию - только закрытие
     * может быть еще передача данных
     */
    close(state: string = 'only_close') {

        // возвращаемый параметр
        let returnedData = {
            state: state,
        };

        // закрытие модального окна
        this.view.dismiss(returnedData);
    }

}