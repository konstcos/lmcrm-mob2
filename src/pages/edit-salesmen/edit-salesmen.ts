import {Component} from '@angular/core';
import {NavController, NavParams, Nav} from 'ionic-angular';

import {SalesmenPage} from '../salesmen/salesmen';

import {Salesmen} from '../../providers/salesmen';


/*
 Generated class for the EditSalesmen page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'page-edit-salesmen',
    providers: [Salesmen],
    templateUrl: 'edit-salesmen.html'
})
export class EditSalesmenPage {

    edit: boolean = false;

    salesmenData: any = {

        id: 0,
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        password_confirmation: '',
    };


    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public nav: Nav,
                public salesmen: Salesmen) {

        let data = this.navParams.get('salesman');

        if (data) {

            this.edit = true;

            this.salesmenData.id = data.id;

            this.salesmenData.first_name = data.surname;
            this.salesmenData.last_name = data.name;
            this.salesmenData.email = data.email;
        }

        // console.log(data);

    }

    ionViewDidLoad() {
        // console.log('ionViewDidLoad EditSalesmenPage');
    }


    /**
     * Обновление данных салесмана
     *
     */
    update() {

        if (this.salesmenData.email == '') {

            return false;
        }

        // if (this.salesmenData.password != this.salesmenData.password_confirmation) {
        //
        //     return false;
        // }
        //
        // if (this.salesmenData.password == '') {
        //
        //     return false;
        // }


        this.salesmen.updateSalesmen(this.salesmenData)
        // обработка итемов
            .subscribe(result => {
                // при получении итемов

                // переводим ответ в json
                let data = result.json();

                // console.log(data);

                this.goBack();


                // отключаем окно индикатора загрузки
                // loading.dismiss();

            }, err => {
                // в случае ошибки

                console.log('ERROR: ' + err);

                // todo выводится сообщение об ошибке (нету связи и т.д.)

                // отключаем окно индикатора загрузки
                // loading.dismiss();
            });

        // console.log(this.salesmenData);
    }


    /**
     * Сохранение нового салесмана
     *
     */
    save() {

        if (this.salesmenData.email == '') {

            return false;
        }

        if (this.salesmenData.password != this.salesmenData.password_confirmation) {

            return false;
        }

        if (this.salesmenData.password == '') {

            return false;
        }

        this.salesmen.createSalesmen(this.salesmenData)
        // обработка итемов
            .subscribe(result => {
                // при получении итемов

                // переводим ответ в json
                let data = result.json();

                // console.log(data);

                this.goBack();

                // вычесляем количество итемов
                // let itemsLength = data.length;
                //
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

        // console.log(this.salesmenData);
    }


    /**
     * Возврат на страницу салесманов
     */
    goBack() {
        this.nav.setRoot(SalesmenPage);
    }

}
