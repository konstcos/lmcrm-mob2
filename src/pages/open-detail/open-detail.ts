import {Component} from '@angular/core';
import {NavController, NavParams, ViewController, ModalController, Events} from 'ionic-angular';
import {OpenLeadStatusesPage} from "../open-lead-statuses/open-lead-statuses";

import {Open} from '../../providers/open';

/*
 Generated class for the OpenDetail page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'page-open-detail',
    templateUrl: 'open-detail.html',
    providers: [Open]
})
export class OpenDetailPage {


    /**
     * Данные итема
     *
     */
    public item: any = false;


    /**
     * Переход со страницы obtain
     *
     */
    public fromObtain: any = false;


    /**
     * Индикатор загрузки
     *
     */
    public isLoading: boolean = true;


    constructor(public navCtrl: NavController,
                public view: ViewController,
                public navParams: NavParams,
                public modalCtrl: ModalController,
                public events: Events,
                public open: Open) {

        // получение данных итема
        let item = navParams.get('item');

        // console.log(item);

        // проверка наличия данных
        if (item) {
            // если итем есть

            this.item = item;

            this.isLoading = false;

        } else {
            // если итема нет

            let pageFrom = navParams.get('pageFrom');

            if (pageFrom != 'organizer') {

                this.fromObtain = true;
            }

            let openLeadId = navParams.get('openLeadId');

            // проверка наличия id открытого лида
            if (openLeadId) {
                // если есть

                // подгрузка итемов с сервера
                this.loadData(openLeadId);

            } else {
                // если нет

                // попытка найти id лида
                let leadId = navParams.get('leadId');

                // подгрузка итемов с сервера
                this.loadDataByLeadId(leadId);

                console.log('id лида через страницу поиска: ');
                console.log(leadId);


            }

        }

        // todo если итема нет
        // todo выборка id лида
        // todo подгрузить итем с сервера
        // console.log('этот итем: ');
        // console.log(this.item);
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad OpenDetailPage');
    }


    /**
     * Окно смены статуса итема
     *
     */
    changeStatus(item) {
        // this.navCtrl.push(OpenLeadStatusesPage);

        console.log('итем: ');
        console.log(item);

        let modal = this.modalCtrl.create(OpenLeadStatusesPage, {item: item});

        modal.onDidDismiss(data => {


            if (data.status) {
                item.status_info = data.status;
                item.status = data.status.id;

                for (let type in this.item.statuses) {

                    for (let stat of this.item.statuses[type]) {

                        if (stat.id == data.status.id) {

                            stat.checked = false;
                            stat.lock = true;

                        } else {

                            stat.checked = false;
                        }

                    }
                }
            }


            console.log(item);
            console.log(data);
        });

        modal.present();
    }


    /**
     * Подгрузки итемов открытого лида
     *
     */
    loadData(openLeadId) {

        // console.log('Начало: Получение данных итема открытого лида');

        this.open.loadOpenLeadData(openLeadId)
            .subscribe(result => {

                // переводим ответ в json
                let data = result.json();

                // console.log('полученные данные по только что открытому лиду: ');
                // console.log(data);

                this.item = data.openLead;

                this.isLoading = false;

                // console.log(data);

            }, err => {

                this.isLoading = false;
                console.log('ERROR: ' + err);
            });

    }


    /**
     * Подгрузки итемов открытого лида
     *
     */
    loadDataByLeadId(leadId) {

        console.log('Начало: Получение данных итема открытого лида');


        this.open.loadOpenLeadDataByLeadId(leadId)
            .subscribe(result => {

                // переводим ответ в json
                let data = result.json();


                console.log('полученные данные по только что открытому лиду: ');
                console.log(data);

                this.item = data.openLead;

                this.isLoading = false;

                // console.log(data);

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

        if (this.fromObtain) {

            this.events.publish('goTo:open');
        }

        this.view.dismiss();
    }

}
