import {Component} from '@angular/core';
import {
    NavController,
    NavParams,
    ViewController,
    ModalController
} from 'ionic-angular';

import {ItemDetailPage} from '../item-detail/item-detail';
import {OpenDetailPage} from '../open-detail/open-detail';
import {DepositedDetailPage} from '../deposited-detail/deposited-detail';
import {Open} from '../../providers/open';
import {Item} from '../../models/item';

@Component({
    selector: 'page-search',
    templateUrl: 'search.html'
})
export class SearchPage {

    /**
     * Текст инпута поиска
     *
     */
    public searchInput: string = '';


    /**
     * Итемы поиска
     *
     */
    public items: any = [];


    /**
     * Индикатор загрузки
     *
     */
    public isLoading: boolean = false;


    constructor(public navCtrl: NavController,
                public view: ViewController,
                public open: Open,
                public modalCtrl: ModalController,
                public navParams: NavParams) {

    }


    /**
     * Событие при вводе символов
     */
    onInput(data) {
        console.log('инпут: ');
        console.log(data);
    }


    /**
     * Отмена ввода
     */
    onCancel(data) {
        console.log('Отмена: ');
        console.log(data);
    }


    /**
     * Очистка инпута поиска
     *
     */
    clearInput() {
        this.items = [];
        this.searchInput = '';
    }


    /**
     * Очистка инпута поиска
     *
     */
    runSearch() {
        // console.log(this.searchInput);


        this.isLoading = true;

        this.open.search({keyword: this.searchInput})
        // обработка итемов
            .subscribe(result => {
                // при получении итемов

                // переводим ответ в json
                let data = result.json();

                console.log('получил поиск: ');
                console.log(data);

                this.items = data.data;

                this.isLoading = false;

            }, err => {
                // в случае ошибки

                this.isLoading = false;

                console.log('ERROR: ' + err);
            });
    }


    /**
     * Открытие подробностей по лиду
     *
     */
    openData(item) {

        if (item.type == 'open') {
            let modal = this.modalCtrl.create(OpenDetailPage, {leadId: item.id, pageFrom: 'null'});

            modal.onDidDismiss(data => {
                // console.log(data);
            });

            modal.present();

        } else {

            let modal = this.modalCtrl.create(DepositedDetailPage, {leadId: item.id, pageFrom: 'null'});

            modal.onDidDismiss(data => {
                // console.log(data);
            });

            modal.present();

            console.log('deposited');
            console.log(item);
        }

    }


    /**
     * Закрытие окна поиска
     *
     */
    close() {
        this.view.dismiss();
    }

}
