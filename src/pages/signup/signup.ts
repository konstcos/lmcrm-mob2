import {Component} from '@angular/core';
import {NavController, ToastController, Nav, LoadingController} from 'ionic-angular';

import {TranslateService} from 'ng2-translate/ng2-translate';

import {LoginPage} from '../login/login'
import {RegistrationDataPage} from '../registration-data/registration-data'
import {User} from '../../providers/user';

/*
 Generated class for the Signup page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'page-signup',
    templateUrl: 'signup.html'
})
export class SignupPage {
    // The account fields for the login form.
    // If you're using the username field with or without email, make
    // sure to add it to the type
    account: {email: string, password: string, confirmPassword: string} = {
        email: 'test@example.com',
        password: 'test',
        confirmPassword: 'test'
    };

    confirmationCode: string = '';

    waitConfirmation: boolean = false;

    // Our translated text strings
    private signupErrorString: string;

    constructor(public navCtrl: NavController,
                public user: User,
                public nav: Nav,
                public toastCtrl: ToastController,
                public loadingCtrl: LoadingController,
                public translateService: TranslateService) {


        let confirmatio = localStorage.getItem('waitConfirmation');

        if(confirmatio == 'true'){
            this.waitConfirmation = true;
        }


        this.translateService.get('SIGNUP_ERROR').subscribe((value) => {
            this.signupErrorString = value;
        })
    }

    // doSignup() {
    //     // Attempt to login in through our User service
    //     this.user.signup(this.account).subscribe((resp) => {
    //         this.navCtrl.push(MainPage);
    //     }, (err) => {
    //
    //         this.navCtrl.push(MainPage); // TODO: Remove this when you add your signup endpoint
    //
    //         // Unable to sign up
    //         let toast = this.toastCtrl.create({
    //             message: this.signupErrorString,
    //             duration: 3000,
    //             position: 'top'
    //         });
    //         toast.present();
    //     });
    // }

    goBack() {
        this.nav.setRoot(LoginPage);
    }


    doRegistration() {

        // инициация окна загрузки
        let loading = this.loadingCtrl.create({
            content: 'Registration, please wait...'
        });

        // показ окна загрузки
        loading.present();


        setTimeout(()=>{

            localStorage.setItem('waitConfirmation', 'true');

            this.waitConfirmation = true;



            loading.dismiss();

        }, 1000);

    }


    newRegistration() {

        localStorage.setItem('waitConfirmation', 'false');

        this.waitConfirmation = false;
    }


    doConfirmation() {

        this.nav.setRoot(RegistrationDataPage);

    }

}
