import {Component} from '@angular/core';
import
{
    NavController,
    NavParams,
    LoadingController,
    ModalController,
    ViewController,
    Events
} from 'ionic-angular';


import {OpenLeadOrganizer} from '../../providers/open-lead-organizer';
import {User} from '../../providers/user';
import { CallNumber } from '@ionic-native/call-number';

/*
 Generated class for the Open page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'page-support',
    templateUrl: 'support.html',
    providers: [CallNumber]
})
export class SupportPage {


    /**
     * Массив с итемами на странице
     *
     */
    items: any = [];


    /**
     * Индикатор загрузки
     *
     */
    public isLoading: boolean = true;


    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public view: ViewController,
                public user: User,
                public events: Events,
                private callNumber: CallNumber) {

        this.getSupportData();
    }

    ionViewDidLoad() {

    }

    ionViewWillEnter() {

    }


    /**
     * Загрузка данных по поддержке
     *
     */
    getSupportData() {

        this.isLoading = true;

        this.user.getSupport()
            .subscribe(result => {

                // переводим ответ в json
                let data = result.json();

                this.items = data.support;

                this.isLoading = false;

            }, err => {

                this.isLoading = false;
                console.log('ERROR: ' + err);
            });

    }


    /**
     * Сделать телефонный звонок
     *
     */
    makeCall(item) {
        console.log(item.phone);

        this.callNumber.callNumber(item.phone, true)
            .then(() => console.log('Launched dialer!'))
            .catch(() => console.log('Error launching dialer'));
    }


    /**
     * Закрытие окна
     *
     */
    close() {
        this.view.dismiss();
    }


    /**
     * Событие по кнопке возврата
     *
     */
    backButtonAction(){
        this.close();
    }
}