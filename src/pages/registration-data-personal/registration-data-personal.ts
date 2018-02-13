import {Component} from '@angular/core';
import {NavController, ViewController, NavParams, LoadingController} from 'ionic-angular';

import {TranslateService} from 'ng2-translate/ng2-translate';

import {User} from '../../providers/user';

/*
 Generated class for the Signup page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'registration-data-personal',
    templateUrl: 'registration-data-personal.html'
})
export class RegistrationDataPersonalPage {


    /**
     * Персональные данные пользователя
     *
     */
    public personalData: any = {
        firstName: '',
        lastName: '',
        company: '',
        // phone: '',
        passport: '',
        address: '',
        region: 1
    };


    /**
     * Состояние поля
     *
     * коды ошибок
     *   1 - дефолтное состояние
     *   2 - успешный ввод
     *   3 - ошибка
     *
     */
    public state: any = {
        firstName: 1,
        lastName: 1,
        company: 1,
        // phone: 1,
        passport: 1,
        address: 1,
        region: 1,
    };


    /**
     * Выбранные регионы
     *
     */
    public selectRegions: any = [];


    /**
     * Региноны
     *
     */
    public regions: any = [];


    /**
     * Статус
     *
     * коды:
     *   false - заполнение НЕ завершено
     *   true  - заполнение завершено
     *
     */
    public status: boolean = false;


    /**
     * Ошибки по телефону
     *
     * коды ошибок
     *    0 - нет ошибок
     *    1 - пустое поле (должно быть заполненное)
     *    2 - недостаточное количество чисел в номере телефона
     *
     */
    public phoneErrors: any = 0;


    constructor(public navCtrl: NavController,
                public user: User,
                public viewCtrl: ViewController,
                public navParams: NavParams) {

        // public loadingCtrl: LoadingController,

        // получение данных по персональным данным
        this.personalData = this.navParams.get('personal');

        // сделать валидацию имени если поле не пустое
        if (this.personalData.firstName != '') {
            this.firstNameValidate();
        }

        // сделать валидацию фамилии если поле не пустое
        if (this.personalData.lastName != '') {
            this.lastNameValidate();
        }

        // сделать валидацию названия компании если поле не пустое
        if (this.personalData.company != '') {
            this.companyNameValidate();
        }

        // сделать валидацию улицы
        if (this.personalData.address != '') {
            this.addressValidate();
        }

        // сделать валидацию паспорта
        if (this.personalData.passport != '') {
            this.passportValidate();
        }

        // сделать валидацию телефонного номера если поле не пустое
        // if (this.personalData.phone != '') {
        //     this.phoneValidate();
        // }

        this.switchRegion(1);

    }


    ionViewDidLoad() {
        // console.log('ionViewDidLoad registration data spheres');
    }


    /**
     * Фокус на имени
     *
     */
    firstNameFocus() {
        this.state.firstName = 0;
    }


    /**
     * Фокус на фамилии
     *
     */
    lastNameFocus() {
        this.state.lastName = 0;
    }


    /**
     * Фокус на имени кампании
     *
     */
    companyNameFocus() {
        this.state.company = 0;
    }


    /**
     * Фокус на поле с адрессом
     *
     */
    addressFocus() {
        this.state.address = 0;
    }


    /**
     * Фокус на поле с паспортом
     *
     */
    passportFocus() {
        this.state.passport = 0;
    }


    /**
     * Валидация имени
     *
     */
    firstNameValidate() {
        this.state.firstName = this.personalData.firstName == '' ? 3 : 2;
    }


    /**
     * Валидация имени
     *
     */
    lastNameValidate() {
        this.state.lastName = this.personalData.lastName == '' ? 3 : 2;
    }


    /**
     * Валидация имени компании
     *
     */
    companyNameValidate() {
        this.state.company = this.personalData.company == '' ? 3 : 2;
    }


    /**
     * Валидация улицы компании
     *
     */
    addressValidate() {
        this.state.address = this.personalData.address == '' ? 3 : 2;
    }


    /**
     * Валидация номера паспорта
     *
     */
    passportValidate() {

        // убираем все буквы в номере
        let passportValue = this.personalData.passport.replace(/\D+/g,"");

        // добавление нулей в начало номера, если номер меньше 9
        if(passportValue.length < 9  && passportValue!=0) {
            // считаем сколько нулей нужно добавить
            let count_zero = 9 - Number(passportValue.length);
            // цикл добавления нулей
            for (let i = 0; i < count_zero; i++) {
                // добавление нулей
                passportValue = '0' + passportValue;
            }
        }

        this.personalData.passport = passportValue;

        // валидация номера паспорта
        let passportValue_validate = this.passportNumberValidator(passportValue);

        if(passportValue_validate) {

            this.state.passport = 2;

        } else {

            this.state.passport = 3;
        }
    }


    /**
     * Основной метод валидации паспорта
     *
     */
    passportNumberValidator(num) {

        if (num.length == 8) num = "0" + num;
        let tot = 0;
        let tz: any = String(num);

        for (let i = 0; i < 8; i++) {
            let x: any = (((i % 2) + 1) * tz.charAt(i));
            if (x > 9) {
                x = x.toString();
                x = parseInt(x.charAt(0)) + parseInt(x.charAt(1))
            }
            tot += x;
        }

        if ((tot + parseInt(tz.charAt(8))) % 10 == 0) {
            return num;
        } else {

            return false;
        }
    }


    /**
     * Валидация телефонного номера
     *
     */
    phoneValidate() {

        if (this.personalData.phone == '') {

            this.state.phone = 3;
            this.phoneErrors = 1;
            // console.log('error 1')

        } else if (this.personalData.phone.length < 9 || this.personalData.phone.length > 10) {

            this.state.phone = 3;
            this.phoneErrors = 2;
            // console.log('error 2')

        } else {

            this.state.phone = 2;
            this.phoneErrors = 0;
            // console.log('success 1')
        }
    }


    /**
     * Проверка поля с телефонным номером при вводе нового символа
     *
     */
    phoneChange(event) {

        // сохраняем старые данные
        let oldData = this.personalData.phone;

        // проверка на максимальную длину номера телефона
        if (event.length > 10) {

            // возвращаем старые данные
            setTimeout(() => {
                    this.personalData.phone = oldData;
                }
                , 0);

            return false;
        }


        // перебираем все символы новых данных
        for (let item = 0; item < event.length; item++) {

            // если символ из новых данных не равняется символу в старых данных
            // (выбор нового введенного символа)
            if (event[item] != this.personalData.phone[item]) {

                // проверка нового символа на integer
                if (!Number(event[item]) && event[item] != '0') {
                    // если новый символ не цифра

                    // возвращаем старые данные
                    setTimeout(() => {
                            this.personalData.phone = oldData;
                        }
                        , 0);
                }

                // выходим из цикла
                break;
            }
        }
    }


    /**
     * Переключить регион
     *
     */
    switchRegion(region) {

        let regionId;

        if (region != 1) {

            this.selectRegions.push(region);

            regionId = region.id;

            this.personalData.region = regionId;

        } else {

            regionId = 1;

            this.personalData.region = regionId;
        }


        console.log(this.selectRegions);

        this.user.getRegions(regionId)
        // подписываемся на получение результата
            .subscribe(resp => {
                // обработка результата

                // преобразование результата в json
                let res = resp.json();

                console.log(res);


                this.regions = res.regions;

                // this.description = res.description;

                // this.nav.setRoot(EmailConfirmationPage);

                // loading.dismiss();

            }, (err) => {
                // this.navCtrl.push(MainPage);
                // Unable to log in
                // loading.dismiss();
            });

        console.log('region');
    }


    /**
     * Очистка регионов
     *
     */
    clearRegions() {
        this.selectRegions = [];
        this.personalData.region = 1;
        this.switchRegion(1);
    }


    /**
     * Удаление региона
     *
     */
    dellRegion(region) {

        // console.log('регионы');

        // console.log(this.selectRegions);

        let newRegions = [];

        let regionIndex: any;

        for (regionIndex in this.selectRegions) {

            if (region.id == this.selectRegions[regionIndex].id) {

                if (regionIndex == '0') {

                    this.personalData.region = 1;

                    this.selectRegions = [];
                    this.switchRegion(1);
                    break;

                } else {

                    console.log('конец');

                    // console.log(newRegions);
                    // console.log(this.selectRegions[regionIndex]);
                    // console.log(this.selectRegions[regionIndex-1]);

                    this.personalData.region = this.selectRegions[regionIndex - 1].id;

                    this.switchRegion(this.selectRegions[regionIndex - 1]);
                    this.selectRegions = newRegions;
                    break;

                }

            } else {

                newRegions.push(this.selectRegions[regionIndex]);
            }

            // console.log(this.selectRegions[regionIndex]);
        }


        // this.regions.forEach((region, key) => {
        //
        // });

        // console.log(region);
    }


    /**
     * Проверка статуса
     *
     */
    checkStatus() {

        // с телефоном
        // this.status = (this.state.firstName == 2) && (this.state.lastName == 2) && (this.state.company == 2) && (this.state.phone == 2) && (this.state.address == 2) && (this.state.passport == 2);

        // без телефона
        this.status = (this.state.firstName == 2) && (this.state.lastName == 2) && (this.state.company == 2) && (this.state.address == 2) && (this.state.passport == 2);
    }


    /**
     * Закрытие модального окна
     *
     */
    goBack() {

        this.checkStatus();

        this.viewCtrl.dismiss({personal: this.personalData, status: this.status});
    }



    /**
     * Событие по кнопке возврата
     *
     */
    backButtonAction(){
        this.goBack();
    }

}