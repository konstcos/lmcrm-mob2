import {Component} from '@angular/core';
import {
    NavController,
    NavParams,
    ViewController,
    ModalController,
    LoadingController
} from 'ionic-angular';

import {OpenLeadStatusesDealPage} from '../open-lead-statuses-deal/open-lead-statuses-deal';

import {Open} from '../../providers/open';

/*
 Generated class for the OpenLeadStatuses page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'page-open-lead-statuses',
    templateUrl: 'open-lead-statuses.html'
})
export class OpenLeadStatusesPage {

    public item: any;
    public statuses: any;
    public newStatus: any;


    /**
     * id выбранного статуса
     *
     */
    public checkedStatus: any = false;


    /**
     * данные выбранного статуса
     *
     */
    public checkedStatusData: any = false;


    /**
     * Блок статусов
     *
     */
    public statusBlock: boolean = true;


    /**
     * Блок с дополнительными данными по сделке
     *
     */
    public dealBlock: boolean = false;


    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public open: Open,
                public modalCtrl: ModalController,
                public loadingCtrl: LoadingController,
                public view: ViewController) {


        this.item = this.navParams.get('item');

        this.newStatus = this.item.status_info;

        this.statuses = this.item.statuses;
        // item.statuses

        console.log(this.item);

        // console.log(this.statuses);

    }

    ionViewDidLoad() {
        // console.log('ionViewDidLoad OpenLeadStatusesPage');
    }


    /**
     * Выбор другого статуса
     *
     */
    check(status) {

        if (status.lock) {
            return false;
        }


        if (status.checked) {

            status.checked = false;
            this.checkedStatus = false;
            this.checkedStatusData = false;

        } else {

            // console.log(this.statuses);

            for (let type in this.statuses) {

                for (let stat of this.statuses[type]) {

                    if (stat.id == status.id) {

                        stat.checked = true;
                        this.checkedStatus = status.id;
                        this.checkedStatusData = status;

                    } else {

                        stat.checked = false;
                    }

                }
            }

        }
    }


    /**
     * Применение выбранного статуса
     *
     */
    applyStatus() {

        console.log('утверждение выбранного статуса, данные:');
        console.log(this.checkedStatusData);

        if (this.checkedStatusData.type == 5) {

            let modal = this.modalCtrl.create(OpenLeadStatusesDealPage, {status: this.checkedStatusData});

            modal.onDidDismiss(data => {

                if (data.status) {

                    this.changeStatus(data.price, data.comment);
                    console.log('данные: ');
                    console.log(data);

                } else {

                    console.log('нету статуса');
                }

            });

            modal.present();

        } else {

            this.changeStatus();
        }
    }


    /**
     * Изменение статуса на сервере
     *
     */
    changeStatus(price: any = false, comments: string = '') {

        // показывает окно загрузки
        let loading = this.loadingCtrl.create({
            content: 'Changing status, please wait...'
        });
        loading.present();

        this.open.changeStatus({openedLeadId: this.item.id, status: this.checkedStatus, price: price, comments: comments})
            .subscribe(result => {
                // при получении итемов

                // переводим ответ в json
                let data = result.json();

                console.log('сделка закрылась нормально: ');
                console.log(data);

                console.log('цена за сделку');
                console.log(price);

                if (data.status == 'success') {

                    this.newStatus = data.status_info;
                    this.close(data.status_info, price);

                } else {
                    this.close();
                }

                loading.dismiss();

            }, err => {
                // в случае ошибки

                loading.dismiss();
                console.log('ERROR: ' + err);

                // todo выводится сообщение об ошибке (нету связи и т.д.)

            });
    }


    /**
     * Возврат к статусам
     *
     */
    backToStatuses() {
        this.statusBlock = true;
        this.dealBlock = false;
    }


    /**
     * Закрытие страницы
     *
     */
    close(stat = false, price = false) {
        // доработать

        console.log('закрываю окно с прайсом:');
        console.log(price);

        for (let type in this.statuses) {

            for (let stat of this.statuses[type]) {

                stat.checked = false;
            }
        }

        if (!stat) {
            stat = this.newStatus;
        }


        console.log('из close');
        console.log(stat);

        this.view.dismiss({status: stat, dealPrice: price});
    }


    popPage() {
        this.navCtrl.pop();
    }

}
