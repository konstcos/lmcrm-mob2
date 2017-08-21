import {Component} from '@angular/core';
import {NavController, NavParams, ViewController, AlertController, ModalController} from 'ionic-angular';

import {OpenLeadStatusesPage} from "../open-lead-statuses/open-lead-statuses";
import {OpenDetailPage} from '../open-detail/open-detail'


import {Obtain} from '../../providers/obtain';

/*
 Generated class for the ObtainDetail page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'page-obtain-detail',
    templateUrl: 'obtain-detail.html'
})
export class ObtainDetailPage {

    item: any;

    constructor(public navCtrl: NavController,
                public view: ViewController,
                public obtain: Obtain,
                public navParams: NavParams,
                public modalCtrl: ModalController,
                public alertCtrl: AlertController) {

        this.item = navParams.get('item');

        // console.log(this.item);
    }

    ionViewDidLoad() {
        // console.log('ionViewDidLoad ObtainDetailPage');
    }


    /**
     * Информация о дате
     *
     */
    dateInfo() {
        let alert = this.alertCtrl.create({

            subTitle: `
                    <div class="alert_title">added to system</div>
                    <div class="alert_content">When the Lead was processed and added to the system</div>
                
                    <div class="alert_title">added to you auction</div>
                    <div class="alert_content">When the Lead was added to you auction</div>
                `,
            buttons: ['OK']
        });
        alert.present();
    }


    /**
     * Подтверждение открытия лида
     *
     */
    confirmOpen(item) {

        if (item.openLead == "true" && item.openLeadOther == "true") {
            this.close();
        }

        let alert = this.alertCtrl.create();
        alert.setTitle('Open Lead');

        if (item.openLead == "false") {
            alert.addInput({
                type: 'radio',
                label: 'Open One',
                value: 'One',
                checked: true
            });
        }

        if (item.openLeadOther == "false") {
            alert.addInput({
                type: 'radio',
                label: 'Open All',
                value: 'All',
                checked: item.openLead == "true"
            });
        }


        alert.setCssClass('obtain_detail_alert_confirm');

        alert.addButton('Cancel');
        alert.addButton({
            text: 'OK',
            handler: data => {
                // this.testRadioOpen = false;
                // this.testRadioResult = data;

                // console.log(data);
                // console.log(item);

                this.openLead(item.id, item.mask.maskId, data);

            }
        });
        alert.present();
    }


    /**
     * Открытие лида
     *
     */
    openLead(lead_id, mask_id, amount) {

        this.obtain.openLead({lead_id: lead_id, mask_id: mask_id, amount: amount})
            .subscribe(result => {
                // обработка результата открытия лида

                // переводим ответ в json
                let data = result.json();

                // обработка результата
                if (data.status == 'true') {
                    // если лид нормлаьно открылся

                    // открытие модального окна с данными по открытому лиду
                    this.openLeadData(data.openLead.id);

                } else {
                    // ошибка в открытии лида

                    if (data.data == 'There is open leads no status') {

                        let alert = this.alertCtrl.create({
                            title: 'Cannot open the Lead',
                            subTitle: `
                                You have a Lead with no status. To open the next one, put the status already open.
                                    `,
                            buttons: ['OK']
                        });
                        alert.present();

                    } else if (data.data == 'Low balance') {

                        let alert = this.alertCtrl.create({
                            title: 'Cannot open the Lead',
                            subTitle: `
                                Not enough money in your account to open the lead. Replenish your cash account to open the lead
                                    `,
                            buttons: ['OK']
                        });
                        alert.present();

                    } else if (data.data == 'Already open') {

                        let alert = this.alertCtrl.create({
                            title: 'Lead already open',
                            subTitle: `
                                You already open this lead. Close the lead details window and refresh the list of incoming leads
                                    `,
                            buttons: ['OK']
                        });
                        alert.present();

                    } else if (data.data == 'Lead withdrawn from auction') {

                        let alert = this.alertCtrl.create({
                            title: 'Lead withdrawn from auction',
                            subTitle: `
                                This lead withdrawn from auction. Close the lead details window and refresh the list of incoming leads
                                    `,
                            buttons: ['OK']
                        });
                        alert.present();

                    }

                }

                // отключаем окно индикатора загрузки
                // infiniteScroll.complete();

            }, err => {
                // в случае ошибки

                console.log('ERROR: ' + err);

                // todo выводится сообщение об ошибке (нету связи и т.д.)

                // отключаем окно индикатора загрузки
                // infiniteScroll.complete();
            });

    }


    /**
     * Окно с данными по открытому лиду
     *
     */
    openLeadData(openLeadId: number) {


        // модальное окно со статусами
        let modal = this.modalCtrl.create(OpenDetailPage, {openLeadId: openLeadId});

        // modal.onDidDismiss(data => {
        //
        //     console.log(data);
        //
        //     this.loadNotifications();
        // });

        modal.present();

        this.close();

        console.log('открытие данных по лиду при открытии лида');
    }


    /**
     * Закрытие страницы
     *
     */
    close() {
        this.view.dismiss();
    }


    popPage() {

        this.navCtrl.pop();
    }

}
