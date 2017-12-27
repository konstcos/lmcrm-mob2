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
    selector: 'page-wallet',
    templateUrl: 'wallet.html'
})
export class WalletPage {


    /**
     * Массив с данными по кошельку
     *
     */
    public wallet: any = {
        buyed: 0,
        earned: 0,
        overdraft: 0,
        wasted: 0
    };


    /**
     * Блок с описанием итема кошелька
     *
     */
    public walletDescription: any = {
        buyed: false,
        earned: false,
        overdraft: false,
        wasted: false
    };


    /**
     * Индикатор загрузки
     *
     */
    public role: boolean = true;


    /**
     * Индикатор загрузки
     *
     */
    public isLoading: boolean = true;


    /**
     * Блок с данными
     *
     */
    public dataBlock: boolean = false;


    /**
     * Блок с ошибкой
     *
     */
    public errorBlock: boolean = false;


    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public view: ViewController,
                public user: User,
                public events: Events) {

        // получение данных по кошельку агента
        this.getWalletData();
    }

    ionViewDidLoad() {

    }

    ionViewWillEnter() {

    }


    /**
     * Загрузка данных кошелька
     *
     */
    getWalletData() {

        this.dataBlock = false;
        this.errorBlock = false;
        this.isLoading = true;

        this.user.getWalletData()
            .subscribe(result => {

                // переводим ответ в json
                let data = result.json();

                console.log('полученные данные по кошельку: ');
                console.log(data);

                if(data.status == 'success') {

                    this.wallet.buyed = data.wallet.buyed;
                    this.wallet.earned = data.wallet.earned;
                    this.wallet.overdraft = data.wallet.overdraft;
                    this.wallet.wasted = data.wallet.wasted;

                    this.isLoading = false;
                    this.dataBlock = true;

                } else {

                    this.isLoading = false;
                    this.errorBlock = true;
                }

            }, err => {

                this.isLoading = false;
                this.errorBlock = true;
                console.log('ERROR: ' + err);
            });

    }


    /**
     * Показать/спрятать описание итема кошелька
     *
     */
    switchDesctiption(item) {

        this.walletDescription[item] = !this.walletDescription[item];
    }


    /**
     * Закрытие окна
     *
     */
    close() {
        this.view.dismiss();
    }
}