import {Component} from '@angular/core';
import {
    NavController,
    NavParams,
    ViewController,
    ModalController,
} from 'ionic-angular';


import {User} from '../../providers/user';


/*
 Generated class for the OpenLeadOrganizer page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'profile_edit_lead_buyer_operating_mode_page',
    templateUrl: 'profile_edit_lead_buyer_operating_mode.html',
    providers: [User]
})
export class ProfileEditLeadBuyerOperatingModePage {

    public profileData = false;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public view: ViewController,
                public user: User) {

    }


    /**
     * Закрытие окна
     *
     */
    close() {
        // закрытие модального окна
        this.view.dismiss('ok');
    }

}