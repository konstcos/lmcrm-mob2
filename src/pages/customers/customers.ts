import {Component} from '@angular/core';
import {NavController, NavParams, Nav} from 'ionic-angular';
// import {MenuPage} from '../menu/menu';

import {MainPage} from '../main/main'
import {MasksPage} from '../masks/masks'

import {Customer} from '../../providers/customer';
import {SalesmenPage} from '../salesmen/salesmen';
import {EditMaskPage} from '../edit-mask/edit-mask'


/*
 Generated class for the Ustomers page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'page-customers',
    templateUrl: 'customers.html'
})
export class CustomersPage {


    subRole: boolean = false;
    salesmenData: any = false;
    spheres: any = [];


    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public nav: Nav,
                public customer: Customer) {

        let subRole = this.navParams.get('subRole');

        if (subRole == 'salesman') {
            this.subRole = this.navParams.get('subRole');
            this.salesmenData = this.navParams.get('salesmenData');
        }

        // console.log(this.subRole);
    }


    /**
     * Срабатывает когда открывается страница
     *
     */
    ionViewWillEnter() {

        // загрузка новых итемов
        // this.loadItems();

        let salesmenId = false;

        if (this.subRole) {
            salesmenId = this.salesmenData.id;
        }

        this.customer.getSpheres({salesman: salesmenId})

            .subscribe(result => {
                // при получении итемов

                // переводим ответ в json
                let data = result.json();

                // console.log(data);

                this.spheres = data;

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
     * Возврат на главную страницу
     *
     */
    goToMainPage() {

        if (this.subRole) {

            this.nav.setRoot(SalesmenPage);

        } else {

            this.nav.setRoot(MainPage);
        }

    }


    ionViewDidLoad() {
        // console.log('ionViewDidLoad UstomersPage');
    }

    /**
     * Показать все маски сферы
     *
     */
    openSphere(sphere) {

        if( this.subRole ){

            this.nav.setRoot(MasksPage, {sphereId: sphere.id, subRole: 'salesman', salesmenData: this.salesmenData});

        }else{

            this.nav.setRoot(MasksPage, {sphereId: sphere.id});
        }

    }


    /**
     * Создание новой маски
     *
     */
    createNewMask(sphereId){
        // console.log('создаю новую маску');

        if( this.subRole ){

            this.nav.setRoot(EditMaskPage, { sphereId: sphereId, appointment: 'newMask', sourcePage: 'customer', subRole: 'salesman', salesmenData: this.salesmenData });

        }else{

            this.nav.setRoot(EditMaskPage, { sphereId: sphereId, appointment: 'newMask', sourcePage: 'customer',});
        }

    }

}
