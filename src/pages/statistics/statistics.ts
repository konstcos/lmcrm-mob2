import {Component, ViewChild} from '@angular/core';
import {NavController, NavParams, Nav, Content, ActionSheetController} from 'ionic-angular';

import {MainPage} from '../main/main'
import {Statistic} from '../../providers/statistic'

/*
 Generated class for the Statistics page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'page-statistics',
    providers: [Statistic],
    templateUrl: 'statistics.html'
})
export class StatisticsPage {


    @ViewChild(Content) content: Content;

    /**
     * Переменная со сферам
     *
     */
    spheres: any = false;

    /**
     * Переменная с текущей сферой
     *
     */
    currentSphere: any = false;

    /**
     * Существует сфера или нет
     *
     */
    sphereExist: any = false;

    /**
     * Переменная со статистикой
     *
     */
    statisticData: any = false;

    /**
     * Блок с датой
     *
     */
    datePeriod: any = '4';

    /**
     * Начальная дата ститистики
     *
     */
    dateFrom: any;

    /**
     * Конечная дата статистики
     *
     */
    dateTo: any;

    /**
     * Блок с периодом
     *
     */
    periodBlock: boolean = false;


    /**
     * Блоки статистики
     *
     */
    statisticBlocks: string = 'leads';


    /**
     * Данные по временным периодом
     *
     */
    datePeriodData: any = [

        {id: 0, name: 'Today'},
        {id: 1, name: 'Yesterday'},
        {id: 2, name: 'This week'},
        {id: 3, name: 'Previous week'},
        {id: 4, name: 'This month'},
        {id: 5, name: 'Previous month'},
        {id: 6, name: 'Custom Range'},

    ];

// <ion-option value="0">Today</ion-option>
// <ion-option value="1">Yesterday</ion-option>
// <ion-option value="2">This week</ion-option>
// <ion-option value="3">Previous week</ion-option>
// <ion-option value="4">This month</ion-option>
// <ion-option value="5">Previous month</ion-option>
// <ion-option value="6">Custom Range</ion-option>



    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public nav: Nav,
                public statistic: Statistic,
                public actionSheetCtrl: ActionSheetController) {


        // установка текущей даты (сегодняшнего дня)
        // this.dateFrom = this.dateTo = new Date().toISOString();

        let currMonsDate = new Date();
        let currMonsYear = currMonsDate.getFullYear();
        let currMons = currMonsDate.getMonth();
        this.dateFrom = new Date(currMonsYear, currMons, 2).toISOString();
        this.dateTo = new Date().toISOString();

        this.get();
    }


    ionViewDidLoad() {
        // console.log('ionViewDidLoad StatisticsPage');
    }


    /**
     * Загрузка статистики с сервера
     *
     */
    get() {

        // this.dateFrom
        // this.dateTo

        let rawDateFrom = new Date(this.dateFrom);
        let timeFrom = rawDateFrom.getFullYear() + '-' + (rawDateFrom.getMonth()+1) + '-' + (rawDateFrom.getDate()-1);

        let rawDateTo = new Date(this.dateTo);
        let timeTo = rawDateTo.getFullYear() + '-' + (rawDateTo.getMonth()+1) + '-' + (rawDateTo.getDate()-1);



        // получение итемов с сервера
        this.statistic.get({sphere_id: this.currentSphere, timeFrom: timeFrom, timeTo: timeTo})
        // обработка итемов
            .subscribe(result => {
                // при получении итемов

                // переводим ответ в json
                let data = result.json();

                console.log(data);

                if (data.status == 'success') {

                    this.spheres = data.spheres;
                    this.currentSphere = data.statistic.sphere.id;

                    this.statisticData = data.statistic;

                    this.sphereExist = true;

                } else {

                }


                this.content.resize();

                // вычесляем количество итемов
                // let itemsLength = data.leads.length;

                // обработка итемов
                // if (itemsLength != 0) {
                //     // если больше нуля
                //
                //     // добавляем полученные итемы на страницу
                //     this.items = data.leads;
                //
                // } else {
                //     // если итемов нет
                //
                //     // todo показываем оповещение что итемов нет
                //
                // }

                // отключаем окно индикатора загрузки
                // loading.dismiss();

            }, err => {
                // в случае ошибки

                console.log('ERROR: ' + err);

                // todo выводится сообщение об ошибке (нету связи и т.д.)

                // отключаем окно индикатора загрузки
                // loading.dismiss();
            });

    }


    /**
     * Событие на смену временного промежутка
     *
     */
    datePeriodChange() {

        this.periodBlock = false;

        switch (this.datePeriod) {

            case '0':
                this.dateFrom = new Date().toISOString();
                this.dateTo = new Date().toISOString();
                this.get();
                break;

            case '1':
                let date = new Date();
                date.setDate(date.getDate() - 1);
                this.dateFrom = date.toISOString();
                this.dateTo = date.toISOString();
                this.get();
                break;

            case '2':
                let curr = new Date(); // get current date

                let currDay = curr.getDay();

                let currDiff = curr.getDate() - currDay + (currDay == 0 ? -6 : 1);

                this.dateFrom = new Date(curr.setDate(currDiff)).toISOString();
                this.dateTo = new Date().toISOString();
                this.get();
                break;

            case '3':
                let beforeOneWeek = new Date(new Date().getTime() - 60 * 60 * 24 * 7 * 1000);
                let day = beforeOneWeek.getDay();
                let diffToMonday = beforeOneWeek.getDate() - day + (day === 0 ? -6 : 1);
                let lastMonday = new Date(beforeOneWeek.setDate(diffToMonday));
                let lastSunday = new Date(beforeOneWeek.setDate(diffToMonday + 6));

                this.dateFrom = lastMonday.toISOString();
                this.dateTo = lastSunday.toISOString();
                this.get();
                break;

            case '4':
                let currMonsDate = new Date();
                let currMonsYear = currMonsDate.getFullYear();
                let currMons = currMonsDate.getMonth();
                this.dateFrom = new Date(currMonsYear, currMons, 2).toISOString();
                this.dateTo = new Date().toISOString();
                this.get();
                break;

            case '5':
                let lastMonsDate = new Date();
                let lastMonsYear = lastMonsDate.getFullYear();
                let lastMons = lastMonsDate.getMonth() - 1;
                this.dateFrom = new Date(lastMonsYear, lastMons, 2).toISOString();
                this.dateTo = new Date(lastMonsYear, lastMons + 1, 1).toISOString();
                this.get();
                break;

            case '6':
                this.periodBlock = true;
                break;
        }

        this.content.resize();
    }


    /**
     * Событие на смену даты
     *
     */
    dataChange() {
        console.log(this.dateFrom);
    }

    /**
     * Событие на смену сферы
     *
     */
    sphereChange() {

        this.get();

    }

    /**
     * Смена начальной даты
     *
     */
    dateFromChange() {

        if(this.dateFrom > this.dateTo){

            this.dateTo = this.dateFrom;
        }

        this.get();

        // console.log(this.dateFrom);
    }

    /**
     * Смена конечной даты
     *
     */
    dateToChange() {

        if(this.dateFrom > this.dateTo){

            this.dateFrom = this.dateTo;
        }

        this.get();

    }

    /**
     * Возврат назад
     *
     */
    goBack() {

        this.nav.setRoot(MainPage);
    }


}
