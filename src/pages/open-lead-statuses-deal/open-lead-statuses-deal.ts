import {Component} from '@angular/core';
import {
    NavController,
    NavParams,
    ViewController,
    ModalController
} from 'ionic-angular';

import {Open} from '../../providers/open';


/*
 Generated class for the OpenLeadStatuses page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'open-lead-statuses-deal',
    templateUrl: 'open-lead-statuses-deal.html'
})
export class OpenLeadStatusesDealPage {


    /**
     * Данные выбранного статуса
     *
     */
    public status: any;


    /**
     * Процент от сделки
     *
     */
    public price: any = '';


    /**
     * Низкий баланс
     *
     * при низком балансе выводится
     * сообщение что баланс низкий
     */
    public lowPrice: boolean = false;


    /**
     * Комментарий
     *
     */
    public comment: string = '';


    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public open: Open,
                public modalCtrl: ModalController,
                public view: ViewController) {


        this.status = this.navParams.get('status');


        console.log(this.status);

        // this.newStatus = this.item.status_info;
        //
        // this.statuses = this.item.statuses;
        // // item.statuses
        //
        // console.log(this.item);

        // console.log('выбор сделок');

    }

    ionViewDidLoad() {
        // console.log('ionViewDidLoad OpenLeadStatusesPage');
    }


    /**
     * Применение выбранного статуса
     *
     */
    applyStatus() {

        // this.open.changeStatus({openedLeadId: this.item.id, status: this.checkedStatus})
        //     .subscribe(result => {
        //         // при получении итемов
        //
        //         // переводим ответ в json
        //         let data = result.json();
        //
        //         console.log(data);
        //
        //         if (data.status == 'success') {
        //
        //             this.newStatus = data.status_info;
        //             this.close(data.status_info);
        //
        //         } else {
        //             this.close();
        //         }
        //
        //
        //     }, err => {
        //         // в случае ошибки
        //
        //         console.log('ERROR: ' + err);
        //
        //         // todo выводится сообщение об ошибке (нету связи и т.д.)
        //
        //     });
    }


    /**
     * Событие по фокусу на поле прайса
     *
     */
    priceOnFocus() {
        // убираем ошибку
        this.lowPrice = false;
    }


    /**
     * Закрытие сделки
     *
     */
    closeDeal() {

        // преобразовываем значение в число
        let price = Number(this.price);

        // проверка размера баланса
        if(price < 2000){
            // если баланс меньше 2000
            this.lowPrice = true;
            return false;
        }

        // закрытие окна и закрытие сделки
        this.view.dismiss({status: true, price: this.price, comment: this.comment});
    }


    /**
     * Закрытие страницы
     *
     */
    close(stat = false) {
        // todo доработать

        this.view.dismiss({status: stat});
    }


}
