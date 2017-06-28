import {Component} from '@angular/core';
import {NavController, NavParams, ViewController} from 'ionic-angular';

import {Open} from '../../providers/open';


/*
 Generated class for the OpenLeadStatuses page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'page-open-lead-deal',
    templateUrl: 'open-lead-deal.html'
})
export class OpenLeadDealPage {

    public item: any;
    public statuses: any;
    public newStatus: any;

    public checkedStatus: any = false;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public open: Open,
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

        } else {

            // console.log(this.statuses);

            for (let type in this.statuses) {

                for (let stat of this.statuses[type]) {

                    if (stat.id == status.id) {

                        stat.checked = true;
                        this.checkedStatus = status.id;

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

        this.open.changeStatus({ openedLeadId: this.item.id, status: this.checkedStatus })
            .subscribe(result => {
                // при получении итемов

                // переводим ответ в json
                let data = result.json();

                console.log(data);

                if(data.status == 'success'){

                    this.newStatus = data.status_info;
                    this.close(data.status_info);

                }else{
                    this.close();
                }
                // вычесляем количество итемов
                // let itemsLength = data.openedLeads.length;

                // // обработка итемов
                // if (itemsLength != 0) {
                //     // если больше нуля
                //
                //     // добавляем полученные итемы на страницу
                //     this.items = data.openedLeads;
                //
                // } else {
                //     // если итемов нет
                //
                //     // todo сообщаем что итемов нет
                //
                // }

                // отключаем окно индикатора загрузки
                // refresher.complete();

            }, err => {
                // в случае ошибки

                console.log('ERROR: ' + err);

                // todo выводится сообщение об ошибке (нету связи и т.д.)

                // отключаем окно индикатора загрузки
                // refresher.complete();
            });
    }


    /**
     * Закрытие страницы
     *
     */
    close( stat=false ) {
        // todo доработать

        // for (let type in this.statuses) {
        //
        //     for (let stat of this.statuses[type]) {
        //
        //         stat.checked = false;
        //     }
        // }
        //
        // if(!stat){
        //     stat = this.newStatus;
        // }
        //
        //
        // console.log('из close');
        // console.log(stat);

        this.view.dismiss({status: stat});
    }


    popPage() {
        this.navCtrl.pop();
    }

}
