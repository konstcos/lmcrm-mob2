import {Component, ViewChild} from '@angular/core';
import {NavController, Nav} from 'ionic-angular';

import {ContentPage} from '../content/content';

import {LoginPage} from '../login/login';
import {SignupPage} from '../signup/signup';
import {MainPage} from "../main/main";

import {CustomersPage} from '../customers/customers';
import {User} from "../../providers/user";


/*
 Generated class for the Menu page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'page-menu',
    templateUrl: 'menu.html'
})
export class MenuPage {
    // A reference to the ion-nav in our component
    // @ViewChild(Nav) nav: Nav;

    // nav: Nav;

    // rootPage: any = MainPage;

    // contentPage: CustomersPage;

    pages: Array<{title: string, component: any}>;

    constructor(public navCtrl: NavController, public nav: Nav, public user: User) {
        // used for an example of ngFor and navigation
        this.pages = [
            {title: 'Customers', component: CustomersPage},
            // { title: 'Sign in', component: LoginPage },
            // { title: 'Signup', component: SignupPage }
        ];
    }

    ionViewDidLoad() {
        // console.log('Hello MenuPage Page');
    }

    openPage(page) {
        // Reset the content nav to have just this page
        // we wouldn't want the back button to show in this scenario
        this.nav.setRoot(page.component);
        //  this.navCtrl.push(page.component);
    }

    logout(){
        this.user.logout();
        this.nav.setRoot(LoginPage);
    }
}
