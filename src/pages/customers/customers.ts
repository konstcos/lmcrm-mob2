import {Component} from '@angular/core';
import {NavController, NavParams, Nav} from 'ionic-angular';
// import {MenuPage} from '../menu/menu';

import {MainPage} from '../main/main'
import {MasksPage} from '../masks/masks'

import {Customer} from '../../providers/customer';


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


    spheres: any = [];

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public nav: Nav,
                public customer: Customer) {
    }


    /**
     * Срабатывает когда открывается страница
     *
     */
    ionViewWillEnter() {

        // загрузка новых итемов
        // this.loadItems();

        this.customer.getSpheres()

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

    goToMainPage() {
        this.nav.setRoot(MainPage);
    }

    ionViewDidLoad() {
        // console.log('ionViewDidLoad UstomersPage');
    }

    /**
     * Показать все маски сферы
     *
     */
    openSphere(sphere) {

        this.nav.setRoot(MasksPage, { sphereId: sphere.id });


        // this.customer.getSphereMasks( sphere.id )
        //
        //     .subscribe(result => {
        //         // при получении итемов
        //
        //         // переводим ответ в json
        //         let data = result.json();
        //
        //         // console.log(data);
        //
        //         // this.spheres = data;
        //
        //         this.nav.setRoot(MasksPage, { sphere: data });
        //
        //
        //     }, err => {
        //         // в случае ошибки
        //
        //         console.log('ERROR: ' + err);
        //
        //         // todo выводится сообщение об ошибке (нету связи и т.д.)
        //
        //         // отключаем окно индикатора загрузки
        //         // loading.dismiss();
        //     });

    }

}
