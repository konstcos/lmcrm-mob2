import {Component} from '@angular/core';
import {NavController, ToastController, Nav, LoadingController, AlertController} from 'ionic-angular';

import {TranslateService} from 'ng2-translate/ng2-translate';

import {LoginPage} from '../login/login'
import {User} from '../../providers/user';

/*
 Generated class for the Signup page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'registration-data',
    templateUrl: 'registration-data.html'
})
export class RegistrationDataPage {
    // The account fields for the login form.
    // If you're using the username field with or without email, make
    // sure to add it to the type
    account: {email: string, password: string, confirmPassword: string} = {
        email: 'test@example.com',
        password: 'test',
        confirmPassword: 'test'
    };

    spheres: any = {
        '1': 'Celebration halls',
        '2': 'tet',
        '3': 'test',
        '4': 'test',
        '5': 'test1',
        '6': 'test 11.28.2016',
    };

    sphereSelected: any = [];


    opportunity: any = {

        1: true,
        2: false,
        3: false,

    };


    // Our translated text strings
    private signupErrorString: string;

    constructor(public navCtrl: NavController,
                public user: User,
                public nav: Nav,
                public toastCtrl: ToastController,
                public loadingCtrl: LoadingController,
                public alertCtrl: AlertController,
                public translateService: TranslateService) {


    }


    showSpheres() {
        let alert = this.alertCtrl.create();
        alert.setTitle('Which planets have you visited?');

        alert.addInput({
            type: 'checkbox',
            label: 'Celebration halls',
            value: '1',
            checked: true
        });

        alert.addInput({
            type: 'checkbox',
            label: 'tet',
            value: '2'
        });

        alert.addInput({
            type: 'checkbox',
            label: 'test',
            value: '3'
        });

        alert.addInput({
            type: 'checkbox',
            label: 'test',
            value: '4'
        });

        alert.addInput({
            type: 'checkbox',
            label: 'test1',
            value: '5'
        });

        alert.addInput({
            type: 'checkbox',
            label: 'test 11.28.2016',
            value: '6'
        });

        alert.addButton('Cancel');
        alert.addButton({
            text: 'Okay',
            handler: data => {
                console.log('Checkbox data:', data);
                // this.testCheckboxOpen = false;
                this.sphereSelected = data;
                console.log(this.spheres)
            }

        });
        alert.present();
    }


// <ion-select>
// <ion-option value="1">Celebration halls</ion-option>
// <ion-option value="2">tet</ion-option>
//     <ion-option value="3">test</ion-option>
//     <ion-option value="4">test</ion-option>
//     <ion-option value="5">test1</ion-option>
//     <ion-option value="6">test 11.28.2016</ion-option>
// </ion-select>

    opportunityItemClick(itemId) {

        // console.log(itemId);

        for(let oItem in this.opportunity){

            // console.log(oItem);

            this.opportunity[oItem] = oItem == itemId;

            // if(oItem == itemId){
            //
            //     this.opportunity[oItem] = true;
            //
            // }else{
            //
            //     this.opportunity[oItem] = false;
            // }

        }

    }


    goBack() {
        this.nav.setRoot(LoginPage);
    }

}
