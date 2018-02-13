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

    /**
     * Итем открытого лида
     *
     */
    public item: any;

    /**
     * Статусы открытого лида
     *
     */
    // public statuses: any;
    public statuses: any = {
        bad: false,
        uncertain: false,
        process: false,
        refuseniks: false,
        deals: false,
    };

    /**
     * Новый статус по открытому лиду
     *
     */
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

        if(this.item) {
            this.getOpenLeadStatuses();
        }


        this.newStatus = this.item.status_info;

        // this.statuses = this.item.statuses;
        // item.statuses

        console.log(this.item);
        console.log(this.newStatus);
        console.log(this.item.statuses);

        // console.log(this.statuses);

    }

    ionViewDidLoad() {
        // console.log('ionViewDidLoad OpenLeadStatusesPage');
    }


    /**
     * Получение статусов по открытому лиду
     * todo
     */
    getOpenLeadStatuses() {

        // показывает окно загрузки
        let loading = this.loadingCtrl.create({
            content: 'get statuses, please wait...'
        });
        loading.present();

        // запрос на получение статусов с сервера
        this.open.getOpenLeadStatuses({openedLeadId: this.item.id})
            .subscribe(result => {
                // при получении итемов

                // переводим ответ в json
                let data = result.json();

                if(data.status === 'success') {

                    console.log('Статусы получил нормально');
                    console.log(data.openLeadStatuses);

                    for (let i in data.openLeadStatuses) {

                        switch (data.openLeadStatuses[i]['type']) {

                            case 1:
                                this.statuses.process = data.openLeadStatuses[i]['statuses'];
                                break;

                            case 2:
                                this.statuses.uncertain = data.openLeadStatuses[i]['statuses'];
                                break;

                            case 3:
                                this.statuses.refuseniks = data.openLeadStatuses[i]['statuses'];
                                break;

                            case 4:
                                this.statuses.bad = data.openLeadStatuses[i]['statuses'];
                                break;

                            case 5:
                                this.statuses.deals = data.openLeadStatuses[i]['statuses'];
                                break;

                        }
                    }

                } else {

                    console.log('ошибка при получении статусов')
                }


                // console.log('цена за сделку');
                // console.log(price);
                //
                // if (data.status == 'success') {
                //
                //     this.newStatus = data.status_info;
                //     this.close(data.status_info, price);
                //
                // } else {
                //     this.close();
                // }

                loading.dismiss();

            }, err => {
                // в случае ошибки

                loading.dismiss();
                console.log('ERROR: ' + err);

                // todo выводится сообщение об ошибке (нету связи и т.д.)

            });


    }


    /**
     * Выбор другого статуса
     *
     */
    check(status) {

        // проверка на заблокированный статус
        if (status.lock) {
            // если статус заблокирован
            // выходим
            return false;
        }


        // проверка статуса
        if (status.checked) {
            // если статус отмечен

            // проверка текущего статуса
            if(status.id == this.item.status) {
                // если это текущий статус
                // выходим из метода
                return false;
            }

            // очищаем текущий статус
            status.checked = false;
            this.checkedStatus = false;
            this.checkedStatusData = false;

            // возвращаем уже сохраненный статус
            for (let type in this.statuses) {

                for (let stat of this.statuses[type]) {

                    if (stat.id === this.item.status) {

                        stat.lock = false;
                        stat.checked = true;
                        this.checkedStatus = stat.id;
                        this.checkedStatusData = stat;
                    }
                }
            }

        } else {

            for (let type in this.statuses) {

                for (let stat of this.statuses[type]) {

                    if (stat.id === status.id) {

                        stat.checked = true;
                        this.checkedStatus = status.id;
                        this.checkedStatusData = status;

                    } else {

                        stat.checked = false;

                        if(stat.id === this.item.status) {
                            stat.lock = true;
                        }

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
