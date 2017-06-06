import {Component} from '@angular/core';
import {
    NavController,
    ToastController,
    Nav,
    LoadingController,
    AlertController,
    ModalController,
    NavParams
} from 'ionic-angular';

import {TranslateService} from 'ng2-translate/ng2-translate';

import {LoginPage} from '../login/login'
import {MainPage} from '../main/main';
import {User} from '../../providers/user';

/*
 Generated class for the Signup page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'registration-waiting-confirmation',
    templateUrl: 'registration-waiting-confirmation.html'
})
export class RegistrationWaitingConfirmation {


    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public user: User,
                public nav: Nav,
                public toastCtrl: ToastController,
                public loadingCtrl: LoadingController,
                public alertCtrl: AlertController,
                public translateService: TranslateService,
                public modalCtrl: ModalController) {

    }


    checkConfirmation() {


        console.log('Проверка подтверждения');

        this.user.confirmationCheck()
            .subscribe(result => {
                // If the API returned a successful response, mark the user as logged in

                let data = result.json();

                console.log(data);

                if (data.status == 'success') {

                    this.nav.setRoot(MainPage);

                }else{

                    let toast = this.toastCtrl.create({
                        message: 'confirmation is waiting',
                        duration: 3000,
                        position: 'bottom'
                    });
                    toast.present();

                }

                // if (res.status == 'Ok') {
                //     this._loggedIn(res);
                // }

                // loading.dismiss();

            }, err => {
                console.error('ERROR', err);
                // alert('ERROR: ' + err);
                // loading.dismiss();
            });


        // переход на главную страницу пользователя
        // this.nav.setRoot(MainPage);

    }


    /**
     * Возврат на страницу логина
     *
     */
    goBack() {
        // метод разлогинивания
        this.user.logout();
        // возврат на страницу логина
        this.nav.setRoot(LoginPage);
    }

}

