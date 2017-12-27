import {Component} from '@angular/core';
import {NavController, NavParams, Events, AlertController} from 'ionic-angular';


/**
 * Провайдеры
 */

// модель пользователя
import {User} from "../../providers/user";
import {Deposited} from "../../providers/deposited";


/*
 Generated class for the AddLead page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'page-add-lead',
    templateUrl: 'add-lead.html'
})
export class AddLeadPage {

    public errors: any = {

        phone: {
            empty: false,
            notEnough: false
        },
        name: {
            empty: false,
            notEnough: false
        }
    };


    /**
     * Данные лида
     *
     */
    lead: any = {
        name: '',
        phone: '',
        comment: '',
        sphere: false,
        member: false,

        type: '0',
    };


    /**
     * Сферы для добаления лидов
     *
     */
    spheres: any = false;


    /**
     * Участники группы
     *
     */
    members: any = false;


    /**
     * Области с данными на странице
     *
     */
    public area: any = {
        // область со спинером загрузки
        spinnerLoading: true,
        // область основных данных
        mainData: false,
        // область с оповещением об успешном добавлении лида
        success: false,
        // область с оповещением об успешном добавлении лида в приватную группу
        successPrivate: false,
        // область с ошибкой добавления лида
        fail: false,
        // вывод ошибки
        error: false
    };


    /**
     * Переменная с сообщением об ошибке
     *
     */
    public errorMessage: string = '';


    /**
     * Разрешение кнопки добавления лида
     *
     */
    public addButtonRights: boolean = false;


    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public user: User,
                public deposited: Deposited,
                public alertCtrl: AlertController,
                public events: Events) {

        this.getSpheres();

    }


    /**
     * Переключение областей на странице
     *
     * три области на странице:
     *     loading - область со спинером загрузки, показывается во время загрузки
     *     data - область с данными, показывается когда данные успешно загруженны
     *     error - область с ошибками, появляется во время ошибки загрузки
     */
    areaSwitch(areaName: any = false) {

        // закрываются все разделы
        this.closeAllAreas();

        switch (areaName) {

            case 'loading':
                // область со спинером загрузки
                this.area.spinnerLoading = true;
                break;

            case 'data':
                // область основных данных
                this.area.mainData = true;
                // кнопка отправки лида в систему
                this.addButtonRights = true;
                break;

            case 'success':
                // вывод ошибки
                this.area.success = true;
                break;

            case 'successPrivate':
                // вывод ошибки
                this.area.successPrivate = true;
                break;

            case 'fail':
                // вывод ошибки
                this.area.fail = true;
                break;

            case 'error':
                // вывод ошибки
                this.area.error = true;
                break;

            default:
                alert('wrong area name');
                break;
        }
    }


    /**
     * Закрывает все области
     *
     */
    closeAllAreas() {
        // выключаем кнопку открытия
        this.addButtonRights = false;
        // закрытие всех областей
        for (let area in this.area) {
            // перебираем все области
            // закрываем их
            this.area[area] = false;
        }
    }


    /**
     * Получение сфер пользователя
     *
     */
    getSpheres() {

        // включаем спинер
        this.areaSwitch('loading');

        this.user.getSpheres()
        // обработка итемов
            .subscribe(result => {
                // при получении итемов

                // переводим ответ в json
                let data = result.json();

                // console.log(data);

                if (data.status == 'success') {

                    if (data.spheres.length > 0) {

                        this.spheres = data.spheres;

                        console.log(this.spheres);

                        this.lead.sphere = data.spheres[0].id;
                    }

                    // выводим область данных
                    this.areaSwitch('data');

                } else {

                    // выводим ошибку
                    this.areaSwitch('error');
                }

                console.log(data);

            }, err => {
                // в случае ошибки

                // выводим ошибку
                this.areaSwitch('error');

                console.log('ERROR: ' + err);
            });

    }


    /**
     * Действие на изменение типа вносимого лида
     *
     */
    typeChange() {

        // console.log('тип')
        // this.events.publish("lead:new_added");


        if (this.lead.type == '2') {

            // console.log('load group')

            this.loadGroupMembers();

        } else {

            this.lead.member = false;
            this.members = [];
        }
    }


    /**
     * Загрузка пользователей группы пользователя
     *
     */
    loadGroupMembers() {


        this.user.getGroupMembers()
        // обработка итемов
            .subscribe(result => {
                // при получении итемов

                // переводим ответ в json
                let data = result.json();

                console.log(data);

                if (data.status == 'success') {

                    if (data.members.length > 0) {

                        this.members = data.members;

                        this.lead.member = true;
                    }
                }

                // отключаем окно индикатора загрузки
                // loading.dismiss();

            }, err => {
                // в случае ошибки

                console.log('ERROR: ' + err);

                // todo выводится сообщение об ошибке (нету связи и т.д.)

                // отключаем окно индикатора загрузки
                // loading.dismiss();
            });


    }


    /**
     * Валидация телефона когда убирается фокус с поля
     *
     */
    phoneValidate() {

        if (this.lead.phone == '') {

            this.errors.phone.empty = true;
            this.errors.phone.notEnough = false;

            return false;

        } else if (this.lead.phone.length < 9 || this.lead.phone.length > 10) {

            this.errors.phone.empty = false;
            this.errors.phone.notEnough = true;

            return false;

        } else {

            this.errors.phone.empty = false;
            this.errors.phone.notEnough = false;

            return true;
        }

    }

    /**
     * Проверка поля с телефонным номером при вводе нового символа
     *
     */
    phoneChange(event) {

        // сохраняем старые данные
        let oldData = this.lead.phone;

        // проверка на максимальную длину номера телефона
        if (event.length > 10) {

            // возвращаем старые данные
            setTimeout(() => {
                    this.lead.phone = oldData;
                }
                , 0);

            return false;
        }


        // перебираем все символы новых данных
        for (let item = 0; item < event.length; item++) {

            // если символ из новых данных не равняется символу в старых данных
            // (выбор нового введенного символа)
            if (event[item] != this.lead.phone[item]) {

                // проверка нового символа на integer
                if (!Number(event[item]) && event[item] != '0') {
                    // если новый символ не цифра

                    // возвращаем старые данные
                    setTimeout(() => {
                            this.lead.phone = oldData;
                        }
                        , 0);
                }

                // выходим из цикла
                break;
            }
        }
    }


    /**
     * Метод изменения времени
     *
     */
    nameValidate() {

        // обнуляем данные по ошибкам имени
        this.errors.name.notEnough = false;
        this.errors.name.empty = false;

        // проверка наличия имени
        if(this.lead.name.length == 0){
            // сообщаем что это обязательное поле
            this.errors.name.empty = true;
            return false;
        }

        // проверка чтобы имя не было короче 2 символов
        if(this.lead.name.length < 2){
            // сообщаем что имя не должно быть меньше двух символов
            this.errors.name.notEnough = true;
            return false;
        }

        return true;
    }


    /**
     * Добавление лида в систему
     *
     */
    addLead() {

        // if (this.lead.phone == '') {
        //     this.errors.phone.empty = true;
        //     return false;
        // }

        // валидация телефона
        let phoneValidate = this.phoneValidate();
        // валидация имени
        let nameValidate = this.nameValidate();

        if(!phoneValidate) return false;
        if(!nameValidate) return false;

        // если есть участники группы
        if (this.lead.member) {

            this.lead.member = [];

            for (let member of this.members) {

                if (member.value) {
                    this.lead.member.push(member.id);
                }
            }

            // console.log(this.members);
        }

        // включаем спинер
        this.areaSwitch('loading');

        this.deposited.add(this.lead)
        // обработка итемов
            .subscribe(result => {
                // при получении итемов

                // переводим ответ в json
                let data = result.json();

                // this.goBackPop();

                console.log(data);

                if (data.status == 'success') {

                    // публикуем событие что лид нормально созадался
                    this.events.publish("lead:new_added");

                    if (this.lead.type == '2') {

                        this.areaSwitch('successPrivate');

                    } else {

                        this.areaSwitch('success');
                    }




                } else if(data.status == 'fail') {

                    this.errorMessage = data.message;
                    this.areaSwitch('fail');

                } else {
                    this.areaSwitch('error');
                }

            }, err => {
                // в случае ошибки

                console.log('ERROR: ' + err);

                this.areaSwitch('error');

                // отключаем окно индикатора загрузки
                // loading.dismiss();
            });

    }


    ionViewDidLoad() {
        // console.log('ionViewDidLoad AddLeadPage');
    }


    /**
     * Срабатывает когда открывается страница
     *
     */
    ionViewWillEnter() {

    }


    /**
     * Закрытие окна
     *
     */
    goBackPop() {

        this.navCtrl.pop();

    }

}
