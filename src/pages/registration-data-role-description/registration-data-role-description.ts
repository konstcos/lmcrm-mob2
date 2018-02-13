import {Component} from '@angular/core';
import {NavController, ViewController, NavParams, LoadingController} from 'ionic-angular';

import {TranslateService} from 'ng2-translate/ng2-translate';

import {User} from '../../providers/user';

/*
 Generated class for the Signup page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'registration-data-role-description',
    templateUrl: 'registration-data-role-description.html'
})
export class RegistrationDataRolePageDescription {

    /**
     * id роли
     *
     */
    public roleId: number = 0;


    /**
     * Текущая роль
     *
     */
    public lang: string = '';


    /**
     * Описание роли
     *
     */
    public description: string = '';

    constructor(public translate: TranslateService,
                public navCtrl: NavController,
                public user: User,
                public viewCtrl: ViewController,
                public navParams: NavParams) {

        // public loadingCtrl: LoadingController,

        // получение данных по персональным данным
        this.roleId = this.navParams.get('roleId');

        this.lang = translate.currentLang;

        this.description = '';

        if(this.roleId != 3){
            this.getRoleDescription();
        }



        console.log('Описание ролей');
        console.log(this.roleId);
        console.log(translate.currentLang);

    }


    /**
     * Получение описания роли
     *
     */
    getRoleDescription() {

        this.user.getRoleDescription( this.roleId, this.lang )
        // подписываемся на получение результата
            .subscribe(resp => {
                // обработка результата

                // преобразование результата в json
                let res = resp.json();

                console.log(res);

                this.description = res.description;

                // this.nav.setRoot(EmailConfirmationPage);

                // loading.dismiss();

            }, (err) => {
                // this.navCtrl.push(MainPage);
                // Unable to log in
                // loading.dismiss();
            });

    }


    /**
     * Закрытие окна
     */
    goBack() {
        this.navCtrl.pop();
    }


    /**
     * Событие по кнопке возврата
     *
     */
    backButtonAction(){
        this.goBack();
    }

}