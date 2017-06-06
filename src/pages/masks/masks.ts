import {Component} from '@angular/core';
import {NavController, NavParams, Nav} from 'ionic-angular';

import {CustomersPage} from '../customers/customers'
import {EditMaskPage} from '../edit-mask/edit-mask'

import {Customer} from '../../providers/customer';


/*
 Generated class for the Masks page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'page-masks',
    templateUrl: 'masks.html'
})
export class MasksPage {

    sphere: any;
    subRole: boolean = false;
    salesmenData: any = false;
    salesmenId: any = false;

    masks: any = [];

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public nav: Nav,
                public customer: Customer) {


        let subRole = this.navParams.get('subRole');

        if (subRole == 'salesman') {
            this.subRole = this.navParams.get('subRole');
            this.salesmenData = this.navParams.get('salesmenData');
            this.salesmenId = this.salesmenData['id'];
        }


        // console.log('masks');

        let sphereId = this.navParams.get('sphereId');

        if( sphereId ){

            // console.log('есть sphereId');

            this.customer.getSphereMasks( sphereId, this.salesmenId )

                .subscribe(result => {
                    // при получении итемов

                    // переводим ответ в json
                    this.sphere = result.json();

                    console.log(this.sphere);
                    // console.log(this.sphere.name);
                    // this.sphere = data;

                    for (let mask in this.sphere.masks) {

                        this.masks.push(this.sphere.masks[mask]);

                        // console.log(this.sphere.masks[mask]);
                    }

                    // отключаем окно индикатора загрузки
                    // loading.dismiss();

                }, err => {
                    // в случае ошибки

                    console.log('ERROR: ' + err);
                    this.nav.setRoot(CustomersPage);
                    // todo выводится сообщение об ошибке (нету связи и т.д.)

                    // отключаем окно индикатора загрузки
                    // loading.dismiss();
                });


        }else{
            console.log('НЕТ sphereId');
            this.nav.setRoot(CustomersPage);
        }

    }


    ionViewDidLoad() {
        // console.log('ionViewDidLoad MasksPage');
    }


    /**
     * Срабатывает когда открывается страница
     *
     */
    ionViewWillEnter() {

    }




    /**
     * Редактирование маски
     *
     */
    editMask(mask) {


        if( this.subRole ){

            this.nav.setRoot(EditMaskPage, { sphereId: this.sphere.id, appointment: 'editMask', sourcePage: 'masks', maskId: mask.id, subRole: 'salesman', salesmenData: this.salesmenData });

            // this.nav.setRoot(CustomersPage, {subRole: 'salesman', salesmenData: this.salesmenData});

        }else{

            this.nav.setRoot(EditMaskPage, { sphereId: this.sphere.id, appointment: 'editMask', sourcePage: 'masks', maskId: mask.id, });
        }

    }


    /**
     * Включение/выключение маски
     *
     */
    switchActive(mask) {

        // console.log(mask);

        mask.active = !mask.active;


        this.customer.switchMaskActive(mask.id)

            .subscribe(result => {
                // при получении итемов

                // переводим ответ в json
                let data = result.json();

                // console.log(data);

                if (data.status == 'true') {

                    mask.active = !mask.active;
                    mask.leads = data.leads;
                }

            }, err => {
                // в случае ошибки

                console.log('ERROR: ' + err);

                // todo выводится сообщение об ошибке (нету связи и т.д.)

                // отключаем окно индикатора загрузки
                // loading.dismiss();
            });


        // console.log(mask);
    }


    /**
     * Создание новой маски
     *
     */
    createNewMask(){
        // console.log('создаю новую маску');

        if( this.subRole ){

            this.nav.setRoot(EditMaskPage, { sphereId: this.sphere.id, appointment: 'newMask', sourcePage: 'masks', mask: this.sphere.blankMask, subRole: 'salesman', salesmenData: this.salesmenData });

        }else{

            this.nav.setRoot(EditMaskPage, { sphereId: this.sphere.id, appointment: 'newMask', sourcePage: 'masks', mask: this.sphere.blankMask });
        }

    }


    /**
     * Возврат на главную страницу управления клиентами (там где все маски)
     *
     */
    goBack() {

        if( this.subRole ){

            this.nav.setRoot(CustomersPage, {subRole: 'salesman', salesmenData: this.salesmenData});

        }else{

            this.nav.setRoot(CustomersPage);
        }

    }

}
