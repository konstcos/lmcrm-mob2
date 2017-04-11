import {Component} from '@angular/core';
import {NavController, ToastController, Nav, LoadingController} from 'ionic-angular';

import {TranslateService} from 'ng2-translate/ng2-translate';

import {MainPage} from '../main/main';
import {User} from '../../providers/user';
// import {MenuPage} from "../menu/menu";


@Component({
    selector: 'page-login',
    templateUrl: 'login.html'
})
export class LoginPage {
    // The account fields for the login form.
    // If you're using the username field with or without email, make
    // sure to add it to the type
    account: {email: string, password: string} = {
        email: 'test@example.com',
        password: 'test'
    };

    // Our translated text strings
    private loginErrorString: string;

    constructor(public navCtrl: NavController,
                public user: User,
                public toastCtrl: ToastController,
                public translateService: TranslateService,
                public nav: Nav,
                public loadingCtrl: LoadingController) {

        this.translateService.get('LOGIN_ERROR').subscribe((value) => {
            this.loginErrorString = value;
        })
    }

    // Attempt to login in through our User service
    doLogin() {

        let loading = this.loadingCtrl.create({
            content: 'Login, please wait...'
        });

        loading.present();

        this.user.login(this.account).subscribe(resp => {

            // alert( JSON.stringify(resp) );

            // console.log('doLogin');
            // console.log(resp.json());

            // this.navCtrl.push(MainPage);

            let res = resp.json();

            if (res.status == 'Ok') {
                // return { status: 'success'};
                // console.log('doLogin');
                // console.log('Ok');

                // this.nav.setRoot(MenuPage);
                this.nav.setRoot(MainPage);

            } else if(res == 'invalid_credentials') {

                // console.log('doLogin');
                // console.log('invalid_credentials');
                // this.nav.setRoot(MenuPage);

                let toast = this.toastCtrl.create({
                    message: 'invalid login or password, please try again',
                    duration: 5000,
                    position: 'bottom'
                });
                toast.present();

            } else {

                // return { status: 'error'};
            }



            loading.dismiss();


        }, (err) => {
            // this.navCtrl.push(MainPage);
            // Unable to log in
            let toast = this.toastCtrl.create({
                message: this.loginErrorString,
                duration: 3000,
                position: 'top'
            });
            toast.present();
            loading.dismiss();
        });


    }
}
