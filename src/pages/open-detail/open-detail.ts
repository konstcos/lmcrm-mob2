import {Component} from '@angular/core';
import {NavController, NavParams, ViewController, ModalController, Events} from 'ionic-angular';
import {OpenLeadStatusesPage} from "../open-lead-statuses/open-lead-statuses";
import {OpenLeadOrganizerPage} from "../open-lead-organizer/open-lead-organizer";
import {TranslateService} from 'ng2-translate/ng2-translate';
import {Open} from '../../providers/open';

import { CallNumber } from '@ionic-native/call-number';

/*
 Generated class for the OpenDetail page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'page-open-detail',
    templateUrl: 'open-detail.html',
    providers: [Open, CallNumber]
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


    /**
     * Роли пользователя
     *
     */
    public roles: any = {
        role: 'any',
        subRole: 'any',
    };

    constructor(public navCtrl: NavController,
                public view: ViewController,
                public navParams: NavParams,
                public modalCtrl: ModalController,
                public events: Events,
                public open: Open,
                public translate: TranslateService,
                private callNumber: CallNumber) {

        // получение id открытого лида
        let itemId = navParams.get('itemId');

        this.roles = navParams.get('roles');

        // console.log('Итем открытого лида');
        // console.log(itemId);

        // проверка наличия данных
        if (itemId) {
            // если итем есть

            this.loadData(itemId);

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
            }
        }

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
                this.roles.role = data.roles.role;
                this.roles.subRole = data.roles.subRole;


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
     * Окно органайзера
     *
     */
    openLeadOrganizer() {

        // console.log(this.item.id);

        let modal = this.modalCtrl.create(OpenLeadOrganizerPage, {itemsId: this.item.id});

        modal.present();


        // this.organizer.get({ openLeadId: item.id })
        //     .subscribe(result => {
        //
        //         // переводим ответ в json
        //         let data = result.json();
        //
        //         let modal = this.modalCtrl.create(OpenLeadOrganizerPage, {items: data});
        //
        //         modal.present();
        //
        //         console.log(data);
        //
        //     }, err => {
        //
        //         // в случае ошибки
        //
        //         console.log('ERROR: ' + err);
        //
        //         // todo выводится сообщение об ошибке (нету связи и т.д.)
        //
        //         // отключаем окно индикатора загрузки
        //         // infiniteScroll.complete();
        //
        //     });


    }


    /**
     * Сделать телефонный звонок
     *
     */
    makeCall(item) {
        // console.log(item.lead.phone.phone);

        this.callNumber.callNumber(item.lead.phone.phone, true)
            .then(() => console.log('Launched dialer!'))
            .catch(() => console.log('Error launching dialer'));
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
