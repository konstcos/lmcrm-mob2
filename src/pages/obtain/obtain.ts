import {Component} from '@angular/core';
import {NavController, NavParams, LoadingController, ModalController} from 'ionic-angular';

import {Obtain} from '../../providers/obtain';
import {ObtainDetailPage} from "../obtain-detail/obtain-detail";


/*
 Generated class for the Obtain page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'page-obtain',
    templateUrl: 'obtain.html'
})
export class ObtainPage {

    items: any = [];

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public obtain: Obtain,
        public loadingCtrl: LoadingController,
        public modalCtrl: ModalController) {
    }

    ionViewDidLoad() {
        // console.log('ionViewDidLoad ObtainPage');
    }


    /**
     * Срабатывает когда открывается страница
     *
     */
    ionViewWillEnter() {
        // console.log('ObtainPage View');
        // console.log( this.obtain.tst );

        // загрузка новых итемов
        this.get()

    }


    /**
     * обновление контента
     *
     */
    refresh(refresher) {

        // очищаем итемы
        this.items = [];


        let filter =
            {
                sphere: '',
                mask: '',
                opened: ''
            };

        this.obtain.get({ offset: 0, filter: filter }).subscribe(res => {

            // console.log('из компонента');
            console.log( res.json() );

            let data = res.json();

            this.items = data.auctionItems;

            // If the API returned a successful response, mark the user as logged in
            // if (res.status == 'success') {
            //     this._loggedIn(res);
            // } else {
            // }

            // if (res.status == 'Ok') {
            //     this._loggedIn(res);
            //     // return { status: 'success'};
            //
            // } else if(res == 'invalid_credentials') {
            //
            //     // return { status: 'invalid', detail: 'invalid_credentials' };
            //
            // } else {
            //
            //     // return { status: 'error'};
            // }

            refresher.complete();

        }, err => {
            console.error('ERROR', err);
            refresher.complete();
        });

    }

    /**
     * Загрузка итемов открытых лидов с сервера
     *
     */
    get() {

        // очищаем итемы
        this.items = [];

        let loading = this.loadingCtrl.create({
            content: 'Receiving leads, please wait...'
        });

        loading.present();

        let filter =
            {
                sphere: '',
                mask: '',
                opened: ''
            };

        this.obtain.get({ offset: 0, filter: filter }).subscribe(res => {

            // console.log('из компонента');
            console.log( res.json() );

            let data = res.json();

            this.items = data.auctionItems;

            // If the API returned a successful response, mark the user as logged in
            // if (res.status == 'success') {
            //     this._loggedIn(res);
            // } else {
            // }

            // if (res.status == 'Ok') {
            //     this._loggedIn(res);
            //     // return { status: 'success'};
            //
            // } else if(res == 'invalid_credentials') {
            //
            //     // return { status: 'invalid', detail: 'invalid_credentials' };
            //
            // } else {
            //
            //     // return { status: 'error'};
            // }

            loading.dismiss();

        }, err => {
            console.error('ERROR', err);
            loading.dismiss();
        });
    }


    obtainDetail(item) {
        let modal = this.modalCtrl.create(ObtainDetailPage, {item: item});
        modal.present();
    }


    loadMore(infiniteScroll){

        console.log('Async operation has ended');
        // infiniteScroll.complete();

        let filter =
            {
                sphere: '',
                mask: '',
                opened: ''
            };

        this.obtain.get({ offset: 0, filter: filter }).subscribe(res => {

            // console.log('из компонента');
            console.log( res.json() );

            let data = res.json();

            console.log( data.auctionItems );

            // If the API returned a successful response, mark the user as logged in
            // if (res.status == 'success') {
            //     this._loggedIn(res);
            // } else {
            // }

            // if (res.status == 'Ok') {
            //     this._loggedIn(res);
            //     // return { status: 'success'};
            //
            // } else if(res == 'invalid_credentials') {
            //
            //     // return { status: 'invalid', detail: 'invalid_credentials' };
            //
            // } else {
            //
            //     // return { status: 'error'};
            // }

            infiniteScroll.complete();

        }, err => {
            console.error('ERROR', err);
            infiniteScroll.complete();
        });

    }

}
