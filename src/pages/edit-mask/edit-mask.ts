import {Component} from '@angular/core';
import {NavController, NavParams, Nav, ToastController} from 'ionic-angular';

import {MasksPage} from '../masks/masks';
import {CustomersPage} from '../customers/customers'


import {Customer} from '../../providers/customer';

/*
 Generated class for the EditMask page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'page-edit-mask',
    templateUrl: 'edit-mask.html'
})
export class EditMaskPage {


    /**
     * id маски которая редактируется/создается
     *
     */
    public maskId: number;


    /**
     * Идентификатор сферы
     *
     */
    public sphereId: number;


    /**
     * Готовая маска на представление во вьюшке
     *
     */
    public mask: any;


    /**
     * Дополнительная роль пользователя
     *
     */
    public subRole: boolean = false;


    /**
     * Дополнительные данные по продавцу
     *
     */
    public salesmenData: any = false;


    /**
     * Идентификатор продавца
     *
     */
    public salesmenId: any = false;


    /**
     * Шаблон пустой маски
     *
     */
    public blankMask: any = false;


    /**
     * Пометка это новая маски или редактирование уже существующей
     *
     */
    public newMask: boolean = false;


    /**
     * Страница-источник, с которой перешли на редактирование/создание маски
     *
     * нужно для возврата на страницу с которой
     * перешли на маски (страница масок и страница всех сфер)
     */
    public sourcePage: string = 'masks';


    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public nav: Nav,
                public toast: ToastController,
                public customer: Customer) {


        let subRole = this.navParams.get('subRole');


        if (subRole == 'salesman') {
            this.subRole = this.navParams.get('subRole');
            this.salesmenData = this.navParams.get('salesmenData');
            this.salesmenId = this.salesmenData['id'];
        }


        // получение id сферы
        this.sphereId = this.navParams.get('sphereId');


        // получение страницы-источника
        let sourcePage = this.navParams.get('sourcePage');


        // если страница переданна
        if(sourcePage){
            // сохраняем ее в моделе
            this.sourcePage = sourcePage;
        }


        // назначение (новая маска 'newMask' или редактирование 'editMask')
        let appointment = this.navParams.get('appointment');


        // сценарий в зависимости от назначения (новая маска, редактирование)
        if (appointment == 'newMask') {
            // новая маска

            // помечаем что это новая маска
            this.newMask = true;

            // попытка получить шаблон из переданных данных
            this.blankMask = this.navParams.get('mask');

            // проверка наличия шаблона
            if (!this.blankMask) {
                // если шаблон не передан

                // подгружаем шаблон с сервера
                console.log('blank data');
                this.getMaskTemplate();

            } else {
                // если шаблон уже есть

                // создаем дынные новой маски
                this.prepareMask(this.blankMask);
            }

        } else if (appointment == 'editMask') {
            // редактирование маски

            // попытка получения id маски из предыдущего компонента
            this.maskId = this.navParams.get('maskId');

            // если id маски нет
            if (!this.maskId) {
                // возвращаемся назад
                this.goBack();
            }

            // подгружаем данные маски
            this.getMaskData();

        } else {
            // нету назначения

            // возвращаемся назад
            this.goBack();
        }


        // console.log(blankMask);

        // if (this.maskId) {
        //
        //     this.getMaskData();
        //
        // } else if (this.blankMask) {
        //
        //     this.newMask = true;
        //     this.prepareMask(this.blankMask);
        //
        // } else {
        //
        //     this.goBack();
        // }

        // console.log(this.maskId);


    }

    /**
     * Действия после загрузки страницы
     *
     */
    ionViewDidLoad() {
        // console.log('ionViewDidLoad EditMaskPage');
    }


    /**
     * Получение данных маски с сервера
     *
     */
    getMaskTemplate() {

        console.log('start get blank');

        this.customer.getSphereMasksTemplate(this.sphereId)

            .subscribe(result => {
                // при получении итемов

                console.log('blank recive');

                // переводим ответ в json
                let data = result.json();

                console.log(data);

                this.blankMask = data.data;

                // создаем дынные новой маски
                this.prepareMask(this.blankMask);

                // if (data.status == 'true') {
                //
                //     this.prepareMask(data.maskData);
                //
                // }

            }, err => {
                // в случае ошибки

                console.log('ERROR: ' + err);

                // todo выводится сообщение об ошибке (нету связи и т.д.)

                // отключаем окно индикатора загрузки
                // loading.dismiss();
            });
    }


    /**
     * Получение данных маски с сервера
     *
     */
    getMaskData() {

        this.customer.editMask(this.maskId)

            .subscribe(result => {
                // при получении итемов

                // переводим ответ в json
                let data = result.json();


                if (data.status == 'true') {

                    this.prepareMask(data.maskData);

                }

            }, err => {
                // в случае ошибки

                console.log('ERROR: ' + err);

                // todo выводится сообщение об ошибке (нету связи и т.д.)

                // отключаем окно индикатора загрузки
                // loading.dismiss();
            });
    }


    /**
     * Подготовка маски к работе
     *
     */
    prepareMask(mask) {

        console.log(mask);

        for (let filter of mask.filter) {

            for (let option of filter.options) {

                option.value = option.value == 'true';
                option.error = false;
            }
        }

        this.mask = mask;
    }


    /**
     * Сохранить маску
     *
     */
    save() {

        // проверка наличия имени маски
        if (this.mask.name == '') {

            let toast = this.toast.create({
                message: 'enter the name',
                duration: 3000,
                position: 'bottom'
            });
            toast.present();

            return false;
        }


        let filtersErrors = false;

        // проверка чтобы в каждом блоке была хотябы одна отметка
        for(let filter in this.mask.filter){
            // перебираем все фильтры

            let error = true;

            for(let option in this.mask.filter[filter].options){

                // если заполнена хоть одна опция - убираем ошибку
                if(this.mask.filter[filter].options[option].value){
                    error = false;
                }

                // console.log(this.mask.filter[filter].options[option]);

            }

            this.mask.filter[filter].error = error;

            if(error){
                filtersErrors = true;
            }
        }


        if(filtersErrors){

            let toast = this.toast.create({
                message: 'Each filter must have at least one option',
                duration: 3000,
                position: 'bottom'
            });
            toast.present();

            return false;
        }


        // запрос на сохранение маски
        this.customer.saveMask(this.mask, this.newMask, this.salesmenId)

            .subscribe(result => {
                // при получении итемов

                // переводим ответ в json
                let data = result.json();

                if (data.status == 'true') {

                    this.mask = data.maskData;

                    console.log(data);

                    // this.nav.setRoot(MasksPage, {sphereId: this.sphereId});


                    this.goBack();

                    // if (this.subRole) {
                    //
                    //     this.nav.setRoot(MasksPage, {
                    //         sphereId: this.sphereId,
                    //         subRole: 'salesman',
                    //         salesmenData: this.salesmenData
                    //     });
                    //
                    // } else {
                    //
                    //     this.nav.setRoot(MasksPage, {sphereId: this.sphereId});
                    // }

                }

            }, err => {
                // в случае ошибки

                console.log('ERROR: ' + err);

                // todo выводится сообщение об ошибке (нету связи и т.д.)

                // отключаем окно индикатора загрузки
                // loading.dismiss();
            });

    }


    /**
     * Удалить маску
     *
     */
    delete() {

        this.customer.deleteMask(this.mask.id, this.salesmenId)

            .subscribe(result => {
                // при получении итемов


                this.goBack();


                // if (this.subRole) {
                //
                //     this.nav.setRoot(MasksPage, {
                //         sphereId: this.sphereId,
                //         subRole: 'salesman',
                //         salesmenData: this.salesmenData
                //     });
                //
                // } else {
                //
                //     this.nav.setRoot(MasksPage, {sphereId: this.sphereId});
                // }


            }, err => {
                // в случае ошибки

                console.log('ERROR: ' + err);

                // todo выводится сообщение об ошибке (нету связи и т.д.)

                // отключаем окно индикатора загрузки
                // loading.dismiss();
            });

    }


    /**
     * Возврат на главную страницу управления клиентами (там где все маски)
     *
     */
    goBack() {

        let sourcePage: any = false;

        if(this.sourcePage == 'customer'){

            sourcePage = CustomersPage;

        }else{

            sourcePage = MasksPage;
        }

        // сценарий в зависимости от дополнительной роли
        if (this.subRole) {

            this.nav.setRoot(sourcePage, {
                sphereId: this.sphereId,
                subRole: 'salesman',
                salesmenData: this.salesmenData
            });

        } else {

            this.nav.setRoot(sourcePage, {sphereId: this.sphereId});
        }

    }

}
