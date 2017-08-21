import {Component} from '@angular/core';
import {NavController, ViewController, NavParams, LoadingController} from 'ionic-angular';

import {RegistrationDataRolePageDescription} from '../registration-data-role-description/registration-data-role-description';

import {TranslateService} from 'ng2-translate/ng2-translate';

import {User} from '../../providers/user';

/*
 Generated class for the Signup page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'registration-data-role',
    templateUrl: 'registration-data-role.html'
})
export class RegistrationDataRolePage {


    /**
     * Выбранная агентом роль
     *
     * коды:
     *   1 - лидбайер
     *   2 - диалмейкер
     *
     */
    public role: number = 0;


    /**
     * Возможности ролей
     *
     */
    public roleFeatures: any = {

        paymentSystem: [
            {description: 'roleFeatures.FEATURE_1', leadbuyer: true, dealmaker: true },
            {description: 'roleFeatures.FEATURE_2', leadbuyer: true, dealmaker: true },
            {description: 'roleFeatures.FEATURE_3', leadbuyer: true, dealmaker: false },
            {description: 'roleFeatures.FEATURE_4', leadbuyer: false, dealmaker: true },
            {description: 'roleFeatures.FEATURE_5', leadbuyer: true, dealmaker: false },
            {description: 'roleFeatures.FEATURE_6', leadbuyer: true, dealmaker: false },
            {description: 'roleFeatures.FEATURE_7', leadbuyer: true, dealmaker: false },
        ],

        workWithClients: [
            {description: 'roleFeatures.FEATURE_8', leadbuyer: true, dealmaker: true },
            {description: 'roleFeatures.FEATURE_9', leadbuyer: true, dealmaker: true },
            {description: 'roleFeatures.FEATURE_10', leadbuyer: true, dealmaker: false },
            {description: 'roleFeatures.FEATURE_11', leadbuyer: true, dealmaker: false },
            {description: 'roleFeatures.FEATURE_12', leadbuyer: true, dealmaker: true },
        ]
    };


    constructor(public translate: TranslateService,
                public navCtrl: NavController,
                public user: User,
                public viewCtrl: ViewController,
                public navParams: NavParams) {

        // public loadingCtrl: LoadingController,

        // получение данных по персональным данным
        let currentRole = this.navParams.get('role');

        if (currentRole != 0) {
            this.role = currentRole;
        }

        console.log('переданные данные');
        console.log(currentRole);

        console.log('модальное окно ролей');
        console.log(this.role);

        // текущий используемый язык
        console.log(translate.currentLang);
    }


    ionViewDidLoad() {
        // console.log('ionViewDidLoad registration data spheres');
    }


    /**
     * Выбор роли
     *
     */
    selectRole(roleNum) {

        if (this.role == roleNum) {

            this.role = 0;

        } else {

            this.role = roleNum;
        }

    }


    /**
     * Подробное описание роли
     *
     */
    roleDescription(roleId) {
        this.navCtrl.push(RegistrationDataRolePageDescription, {roleId: roleId});
    }


    /**
     * Страница с сравнением ролей
     *
     */
    roleComparison() {
        this.navCtrl.push(RegistrationDataRolePageDescription, {roleId: 3});
    }


    /**
     * Закрытие модального окна
     *
     */
    goBack() {

        this.viewCtrl.dismiss({role: this.role});
    }

}

