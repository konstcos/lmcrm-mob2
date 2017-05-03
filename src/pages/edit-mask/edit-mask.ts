import {Component} from '@angular/core';
import {NavController, NavParams, Nav, ToastController} from 'ionic-angular';

import {MasksPage} from '../masks/masks';

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

    maskId: number;
    sphereId: number;
    mask: any;

    subRole: boolean = false;
    salesmenData: any = false;
    salesmenId: any = false;

    newMask: boolean = false;

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


        this.sphereId = this.navParams.get('sphereId');
        this.maskId = this.navParams.get('maskId');

        let blankMask = this.navParams.get('mask');


        if (this.maskId) {

            this.getMaskData();

        } else if (blankMask) {

            this.newMask = true;
            this.prepareMask(blankMask);

        } else {

            this.goBack();
        }

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


        for (let filter of mask.filter) {

            for (let option of filter.options) {

                option.value = option.value == 'true';
            }
        }

        this.mask = mask;
    }


    /**
     * Сохранить маску
     *
     */
    save() {

        // console.log( this.mask );

        if(this.mask.name == ''){

            let toast = this.toast.create({
                message: 'enter the name',
                duration: 3000,
                position: 'bottom'
            });
            toast.present();

            return false;
        }

        this.customer.saveMask(this.mask, this.newMask, this.salesmenId)

            .subscribe(result => {
                // при получении итемов

                // переводим ответ в json
                let data = result.json();

                if (data.status == 'true') {

                    this.mask = data.maskData;

                    console.log(data);

                    // this.nav.setRoot(MasksPage, {sphereId: this.sphereId});

                    if( this.subRole ){

                        this.nav.setRoot(MasksPage, {sphereId: this.sphereId, subRole: 'salesman', salesmenData: this.salesmenData});

                    }else{

                        this.nav.setRoot(MasksPage, {sphereId: this.sphereId});
                    }

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

                if( this.subRole ){

                    this.nav.setRoot(MasksPage, {sphereId: this.sphereId, subRole: 'salesman', salesmenData: this.salesmenData});

                }else{

                    this.nav.setRoot(MasksPage, {sphereId: this.sphereId});
                }


                // переводим ответ в json
                // let data = result.json();
                //
                // if (data.status == 'true') {
                //
                //     // this.mask = data.maskData;
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

        if( this.subRole ){

            this.nav.setRoot(MasksPage, {sphereId: this.sphereId, subRole: 'salesman', salesmenData: this.salesmenData});

        }else{

            this.nav.setRoot(MasksPage, {sphereId: this.sphereId});
        }

    }

}
