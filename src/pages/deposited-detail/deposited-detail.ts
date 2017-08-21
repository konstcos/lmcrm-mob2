import {Component} from '@angular/core';
import {
    NavController,
    NavParams,
    ViewController
} from 'ionic-angular';

import {Deposited} from '../../providers/deposited';

/*
 Generated class for the DepositedDetail page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'page-deposited-detail',
    templateUrl: 'deposited-detail.html'
})
export class DepositedDetailPage {


    /**
     * Данные итема
     *
     */
    item: any;


    /**
     * Индикатор загрузки
     *
     */
    public isLoading: boolean = true;


    constructor(public navCtrl: NavController,
                public view: ViewController,
                public navParams: NavParams,
                public deposited: Deposited) {

        let item = navParams.get('item');

        // проверка наличия данных
        if (item) {
            // если итем есть

            this.item = navParams.get('item');
            this.isLoading = false;

        } else {

            let leadId = navParams.get('leadId');

            this.leadData(leadId);

        }


        // console.log(this.item);
    }


    ionViewDidLoad() {
        console.log('ionViewDidLoad DepositedDetailPage');
    }


    /**
     *
     *
     */
    leadData(leadId) {

        console.log(leadId);
        this.isLoading = false;

        this.deposited.getDepositedDetail({leadId: leadId})
            .subscribe(result => {

                // переводим ответ в json
                let data = result.json();


                console.log('полученные данные по только что открытому лиду: ');
                console.log(data);

                this.item = data.deposited;

                this.isLoading = false;

                // console.log(data);

            }, err => {

                this.isLoading = false;
                console.log('ERROR: ' + err);
            });


    }


    close() {
        this.view.dismiss();
    }

}
