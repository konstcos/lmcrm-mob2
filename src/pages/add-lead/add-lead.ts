import {Component} from '@angular/core';
import {NavController, NavParams, Events} from 'ionic-angular';


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
        }

    };

    lead: any = {
        name: '',
        phone: '',
        comment: '',
        sphere: false,
        member: false,
        type: '0',
    };

    spheres: any = false;

    members: any = false;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public user: User,
                public deposited: Deposited,
                public events: Events) {

        this.getSpheres();

    }


    /**
     * Получение сфер пользователя
     *
     */
    getSpheres() {

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

                        this.lead.sphere = data.spheres[0].id;
                    }
                }

                // вычесляем количество итемов
                // let itemsLength = data.length;

                // // обработка итемов
                // if (itemsLength != 0) {
                //     // если больше нуля
                //
                //     // console.log(data.auctionItems);
                //
                //     // добавляем полученные итемы на страницу
                //     this.items = data;
                //
                // } else {
                //     // если итемов нет
                //
                //     // todo показываем оповещение что итемов нет
                //
                // }

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
            // console.log('error 1')

        } else if (this.lead.phone.length < 9 || this.lead.phone.length > 10) {

            this.errors.phone.empty = false;
            this.errors.phone.notEnough = true;
            // console.log('error 2')

        } else {

            this.errors.phone.empty = false;
            this.errors.phone.notEnough = false;
            // console.log('success 1')
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
     * Добавление лида в систему
     *
     */
    addLead() {

        if (this.lead.phone == '') {
            console.log('нету телефона');
            this.errors.phone.empty = true;
            return false;
        }

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

        // console.log(this.lead);

        this.deposited.add(this.lead)
        // обработка итемов
            .subscribe(result => {
                // при получении итемов

                // переводим ответ в json
                let data = result.json();

                // console.log(data);

                this.events.publish("lead:new_added");


                this.goBackPop();

                // if (data.status == 'success') {
                //
                //     if (data.spheres.length > 0) {
                //
                //         this.spheres = data.spheres;
                //
                //         this.lead.sphere = data.spheres[0].id;
                //     }
                // }

                // вычесляем количество итемов
                // let itemsLength = data.length;

                // // обработка итемов
                // if (itemsLength != 0) {
                //     // если больше нуля
                //
                //     // console.log(data.auctionItems);
                //
                //     // добавляем полученные итемы на страницу
                //     this.items = data;
                //
                // } else {
                //     // если итемов нет
                //
                //     // todo показываем оповещение что итемов нет
                //
                // }

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
