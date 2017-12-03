import {Component} from '@angular/core';
import {NavController, ViewController, LoadingController, NavParams} from 'ionic-angular';

import {TranslateService} from 'ng2-translate/ng2-translate';

import {LoginPage} from '../login/login'
import {User} from '../../providers/user';

/*
 Generated class for the Signup page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'registration-data-operation-mode',
    templateUrl: 'registration-data-operation-mode.html'
})
export class RegistrationDataOperatingModePage {


    /**
     * Массив с итемами сфер на странице
     *
     */
    items: any = [
        {id:3, status: false, name: 'Only receipt of leads'},
        {id:2, status: false, name: 'Only entering leads'},
        {id:1, status: false, name: 'All functions'},
    ];

    /**
     * Выбранная специализация
     *
     */
    selectedMode: any = 0;


    constructor(public navCtrl: NavController,
                public user: User,
                public viewCtrl: ViewController,
                public loadingCtrl: LoadingController,
                public navParams: NavParams,
                public translate: TranslateService) {

        let selectedMode = this.navParams.get('leadBuyerOperationMode');

        this.translate.get('operating_mode', {}).subscribe((res: string) => {
            this.items[0]['name'] = res['only_receipt_of_leads'];
            this.items[1]['name'] = res['only_entering_leads'];
            this.items[2]['name'] = res['all_functions'];
        });

        // console.log(selectedMode);

        this.selectedMode = selectedMode ? selectedMode : 0;

        // console.log('Режими работы лидбайера');
        // console.log( this.navParams.get('spheres') );
    }


    /**
     * Получение сфер
     *
     */
    // getSpheres() {
    //
    //     // console.log('getSpheres');
    //
    //     // инициация окна загрузки
    //     let loading = this.loadingCtrl.create({
    //         content: 'Loading spheres...'
    //     });
    //
    //     // запрос на получении данных сферы
    //     this.user.getAllSystemSpheres()
    //     // обработка итемов
    //         .subscribe(result => {
    //             // при получении итемов
    //
    //             // переводим ответ в json
    //             let data = result.json();
    //
    //             console.log('получил все сферы с сервера');
    //             console.log(data);
    //
    //             // сценарий в зависимости от наличия данных сфер
    //             if (this.selectedSpheres.length == 0) {
    //                 // если нет сохраненных сфер
    //
    //                 let spheres = data.spheres;
    //
    //                 // перебираем все сферы
    //                 for (let sphere in spheres) {
    //                     // добавляем статус false
    //                     spheres[sphere].status = false;
    //                 }
    //
    //                 this.items = spheres;
    //
    //             } else {
    //                 // если уже есть сохраненные сферы
    //
    //                 let spheres = data.spheres;
    //
    //                 // перебираем все сферы
    //                 for (let sphere in spheres) {
    //
    //
    //                     spheres[sphere].status = false;
    //
    //                     // перебираем все сохраненные сферы
    //                     for (let selected in this.selectedSpheres) {
    //
    //                         if (spheres[sphere].id == this.selectedSpheres[selected]) {
    //                             // добавляем статус true
    //                             spheres[sphere].status = true;
    //                             spheres[sphere].defoult = true;
    //                         }
    //                     }
    //                 }
    //
    //                 this.items = spheres;
    //             }
    //
    //
    //             // отключаем окно индикатора загрузки
    //             loading.dismiss();
    //
    //         }, err => {
    //             // в случае ошибки
    //
    //             console.log('ERROR: ' + err);
    //
    //             // todo выводится сообщение об ошибке (нету связи и т.д.)
    //
    //             // отключаем окно индикатора загрузки
    //             loading.dismiss();
    //         });
    //
    // }


    /**
     * Выбрать или убрать режим
     *
     */
    selectMode(item) {

        // console.log(item);

        // if(item.defoult){
        //     item.defoult = false;
        //     return false;
        // }

        // проверка id итема
        if(this.selectedMode == item.id) {
            // если этот итем уже выбран

            // снимаем отметку о выборе
            this.selectedMode = false;

            // переводим все значения статусов итемов в false
            for (let mode of this.items) {
                mode.status = false;
            }

            // console.log(this.items);


        } else {
            // если итем не выбран

            // console.log('sssw');

            // запоминаем id итема как выбранные
            this.selectedMode = item.id;

            // перебираем все итемы

            // при соответствии ставим статусу true
            for (let mode of this.items) {



                if(mode.id == item.id){
                    mode.status = true;
                } else {
                    mode.status = false;
                }

                console.log(mode.id + ' -> ' +item.id);
                console.log(mode);
            }

            // при несоответствии ставим статусу false

        }

        // console.log(this.items);










        // let added = false;
        //
        // let newItems = [];
        //
        // for ( let sphere in this.selectedSpheres){
        //
        //     if( item.id != this.selectedSpheres[sphere]){
        //
        //         newItems.push(this.selectedSpheres[sphere])
        //
        //     }else{
        //
        //         added = true;
        //     }
        // }
        //
        // if(!added){
        //     newItems.push(item.id)
        // }
        //
        // this.selectedSpheres = newItems;
        //
        // console.log('выбрал сферу');
        // console.log(this.selectedSpheres);

        // this.selectedSpheres;

    }


    ionViewDidLoad() {
        // console.log('ionViewDidLoad registration data spheres');
    }


    goBack() {
        this.viewCtrl.dismiss({leadBuyerOperationMode: this.selectedMode});
    }

}