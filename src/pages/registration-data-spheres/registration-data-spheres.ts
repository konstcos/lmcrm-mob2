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
    selector: 'registration-data-spheres',
    templateUrl: 'registration-data-spheres.html'
})
export class RegistrationDataSpheresPage {


    /**
     * Массив с итемами сфер на странице
     *
     */
    items: any = [];

    /**
     * Массив с выбранными сферами
     *
     */
    selectedSpheres: any = [];


    constructor(public navCtrl: NavController,
                public user: User,
                public viewCtrl: ViewController,
                public loadingCtrl: LoadingController,
                public navParams: NavParams,) {


        this.selectedSpheres = this.navParams.get('spheres');

        console.log('сферы полученныи из окна настроек');
        console.log( this.navParams.get('spheres') );


        // spheres

        // получение сфер
        this.getSpheres();
    }


    /**
     * Получение сфер
     *
     */
    getSpheres() {

        // console.log('getSpheres');

        // инициация окна загрузки
        let loading = this.loadingCtrl.create({
            content: 'Loading spheres...'
        });

        // запрос на получении данных сферы
        this.user.getAllSystemSpheres()
        // обработка итемов
            .subscribe(result => {
                // при получении итемов

                // переводим ответ в json
                let data = result.json();

                console.log('получил все сферы с сервера');
                console.log(data);

                // сценарий в зависимости от наличия данных сфер
                if (this.selectedSpheres.length == 0) {
                    // если нет сохраненных сфер

                    let spheres = data.spheres;

                    // перебираем все сферы 
                    for (let sphere in spheres) {
                        // добавляем статус false
                        spheres[sphere].status = false;
                    }

                    this.items = spheres;

                } else {
                    // если уже есть сохраненные сферы

                    let spheres = data.spheres;

                    // перебираем все сферы 
                    for (let sphere in spheres) {


                        spheres[sphere].status = false;

                        // перебираем все сохраненные сферы 
                        for (let selected in this.selectedSpheres) {

                            if (spheres[sphere].id == this.selectedSpheres[selected]) {
                                // добавляем статус true
                                spheres[sphere].status = true;
                                spheres[sphere].defoult = true;
                            }
                        }
                    }

                    this.items = spheres;
                }


                // отключаем окно индикатора загрузки
                loading.dismiss();

            }, err => {
                // в случае ошибки

                console.log('ERROR: ' + err);

                // todo выводится сообщение об ошибке (нету связи и т.д.)

                // отключаем окно индикатора загрузки
                loading.dismiss();
            });

    }


    /**
     * Выбрать или убрать сферу
     *
     */
    selectSphere(item) {


        if(item.defoult){
            item.defoult = false;
            return false;
        }


        let added = false;

        let newItems = [];

        for ( let sphere in this.selectedSpheres){

            if( item.id != this.selectedSpheres[sphere]){

                newItems.push(this.selectedSpheres[sphere])

            }else{

                added = true;
            }
        }

        if(!added){
            newItems.push(item.id)
        }

        this.selectedSpheres = newItems;

        console.log('выбрал сферу');
        console.log(this.selectedSpheres);

        // this.selectedSpheres;

    }


    ionViewDidLoad() {
        // console.log('ionViewDidLoad registration data spheres');
    }


    goBack() {
        this.viewCtrl.dismiss(this.selectedSpheres);
    }

    // openModal() {
    //     let m =  this.modalCtrl.create(LoginPage);
    //     m.present()
    // }

}