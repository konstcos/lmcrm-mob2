import {Component} from '@angular/core';
import {NavController, NavParams, ViewController, AlertController} from 'ionic-angular';

import {OpenLeadStatusesPage} from "../open-lead-statuses/open-lead-statuses";


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
                public alertCtrl: AlertController) {

        this.item = navParams.get('item')

    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad ObtainDetailPage');
    }


    /**
     * Информация о дате
     *
     */
    dateInfo() {
        let alert = this.alertCtrl.create({
            // title: 'New Friend!',
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
        let alert = this.alertCtrl.create();
        alert.setTitle('Open Lead');

        alert.addInput({
            type: 'radio',
            label: 'Open One',
            value: 'One',
            checked: true
        });

        if(item.openLeadOther == "false"){
            alert.addInput({
                type: 'radio',
                label: 'Open All',
                value: 'All',
            });
        }


        alert.addButton('Cancel');
        alert.addButton({
            text: 'OK',
            handler: data => {
                // this.testRadioOpen = false;
                // this.testRadioResult = data;

                console.log(data);
                console.log(item);

                this.openLead( item.id, item.mask.maskId, data );

            }
        });
        alert.present();
    }


    /**
     * Открытие лида
     *
     */
    openLead( lead_id, mask_id, amount ) {
        // alert('1')

        // let data = { lead_id: lead_id, mask_id: mask_id, amount: amount };

        // console.log(data)

        this.obtain.openLead({ lead_id: lead_id, mask_id: mask_id, amount: amount })
            .subscribe(result => {
                // при получении итемов

                // переводим ответ в json
                let data = result.json();

                // обработка итемов
                if (data.status == 'true') {
                    // если лид нормлаьно открылся

                    // добавляем полученные итемы на страницу
                    // this.items = this.items.concat( data.auctionItems );
                    console.log('открылся');
                    console.log(data);

                } else {
                    // если итемов нет

                    if( data.data == 'There is open leads no status' ){
                        let alert = this.alertCtrl.create({
                            title: 'Can not open Lead',
                            subTitle: `
                                You have a Lead with no status. To open the next one, put the status already open.
                                    `,
                            buttons: ['OK']
                        });
                        alert.present();                    }

                    // console.log('какая то хрень');
                    console.log("Error: ");
                    console.log(data);

                    // помечаем что итемы закончились и больше не вызываем эту функцию
                    // this.isThereStillItems = false;
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
