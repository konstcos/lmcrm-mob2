import {Component} from '@angular/core';
import {
    NavController,
    NavParams,
    ViewController,
    ModalController,
} from 'ionic-angular';


import {User} from '../../providers/user';
import {MainPage} from '../main/main'


/*
 Generated class for the OpenLeadOrganizer page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'profile-page',
    templateUrl: 'profile.html',
    providers: [User]
})
export class ProfilePage {

    public profileData = false;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public view: ViewController,
                public user: User) {


        this.loadData();

    }


    ionViewDidLoad() {
        // console.log('ionViewDidLoad UstomersPage');
    }


    /**
     * Загрузка данных по профилю агента
     *
     */
    loadData() {

        this.user.getAgentProfile()
            .subscribe(result => {
                    // при получении итемов

                    // переводим ответ в json
                    let data = result.json();


                    if(data.status == 'success') {

                        data.password = '';
                        data.password_confirmation = '';

                        data.data.region.path.reverse();

                        this.profileData = data.data;


                        // console.log(data);
                        console.log(data.data);
                        // console.log(this.profileData);
                        // console.log(this.profileData.length);
                    }


                }, err => {
                    // в случае ошибки

                    console.log('ERROR: ' + err);

                    // this.isLoading = false;

                    // todo выводится сообщение об ошибке (нету связи и т.д.)

                    // отключаем окно индикатора загрузки
                    // loading.dismiss();
                }
            )
    }


    /**
     * Сохранение данных
     *
     */
    saveData() {

        // console.log(this.profileData);

        this.user.saveAgentProfile(this.profileData)
            .subscribe(result => {
                    // при получении итемов

                    // переводим ответ в json
                    let data = result.json();

                    // data.password = '';
                    // data.password_confirmation = '';

                    // this.profileData = data;

                    console.log(data);

                }, err => {
                    // в случае ошибки

                    console.log('ERROR: ' + err);

                    // this.isLoading = false;

                    // todo выводится сообщение об ошибке (нету связи и т.д.)

                    // отключаем окно индикатора загрузки
                    // loading.dismiss();
                }
            );
    }


    /**
     * Возврат на главную страницу
     *
     */
    goToMainPage() {

        this.navCtrl.setRoot(MainPage);
    }


}