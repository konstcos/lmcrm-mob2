import {Component} from '@angular/core';
import {NavController, NavParams, ViewController, ActionSheetController} from 'ionic-angular';

import {OpenLeadOrganizer} from '../../providers/open-lead-organizer';


/*
 Generated class for the OpenLeadOrganizer page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'page-open-lead-organizer-edit',
    templateUrl: 'open-lead-organizer-edit.html'
})
export class OpenLeadOrganizerEditPage {

    public type = 'comment';
    public itemData: any = false;

    public nowDate: any = false;
    public nowTime: any = '00:00';

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public view: ViewController,
                public organizer: OpenLeadOrganizer,
                public actionSheetCtrl: ActionSheetController) {

        this.type = this.navParams.get('type');
        this.itemData = this.navParams.get('itemData');



        // console.log(this.itemData);

        if(!this.itemData){

            let date = new Date();

            let dTime = date.toISOString().split('T');
            let time = dTime[1].split(':');

            // console.log(date.toISOString().split('T'));
            // console.log(date.getTime());

            this.itemData = {};

            this.itemData.id = 0;
            this.itemData.open_lead_id = this.navParams.get('openLeadId');
            this.itemData.text = '';
            this.itemData.dateDate = dTime[0];
            this.itemData.dateTime = time[0] + ':' + time[1];
            this.itemData.type = this.type == 'comment' ? 1 : 2;
        }


        this.nowDate = new Date().toISOString();

        // let dateFormated = this.itemData.date.date;

        // dateFormated = dateFormated.split(' ');

        // console.log(dateFormated);

        // console.log(this.itemData);
    }


    ionViewDidLoad() {
        console.log('ionViewDidLoad OpenLeadOrganizerPageEdit');
    }


    /**
     * Сохранение итема по органайзеру
     *
     */
    save() {

        // console.log(this.itemData);
        // console.log(this.nowDate);


        let dataToUpdate = {
            organizerId: this.itemData.id,
            openLeadId: this.itemData.open_lead_id,
            comment: this.itemData.text,
            date: this.itemData.dateDate,
            time: this.itemData.dateTime,
            type: this.itemData.type,
        };

        console.log(dataToUpdate);

        // обновление данных
        this.organizer.update(dataToUpdate)
            .subscribe(result => {

                // переводим ответ в json
                let data = result.json();

                // console.log(data);

                this.view.dismiss();


            }, err => {

                console.log('ERROR: ' + err);
            });
    }


    /**
     * Смена даты
     * выставляем минимальное время при смене сегодняшней даты
     *
     */
    dateChange() {



    }


    close() {
        this.view.dismiss();
    }

}
