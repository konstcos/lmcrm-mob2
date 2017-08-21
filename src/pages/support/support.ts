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


/*
 Generated class for the Open page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'page-support',
    templateUrl: 'support.html'
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
                public events: Events) {

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

                // console.log('полученные данные по только что открытому лиду: ');
                // console.log(data);


                this.items = data.support;

                this.isLoading = false;

                console.log(this.items);

            }, err => {

                this.isLoading = false;
                console.log('ERROR: ' + err);
            });

    }


    /**
     * Закрытие окна
     *
     */
    close() {
        this.view.dismiss();
    }
}