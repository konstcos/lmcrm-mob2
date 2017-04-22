import {Component} from '@angular/core';
import {NavController, NavParams, Nav, ActionSheetController} from 'ionic-angular';
import {MainPage} from '../main/main'
import {Salesmen} from '../../providers/salesmen';
// страница для фильтрования лидов
import {CustomersPage} from '../customers/customers';


/*
 Generated class for the Salesmen page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'page-salesmen',
    providers: [Salesmen],
    templateUrl: 'salesmen.html'
})
export class SalesmenPage {

    items: any;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public nav: Nav,
                public salesmen: Salesmen,
                public actionSheetCtrl: ActionSheetController) {

        this.salesmen.getSalesmen()
        // обработка итемов
            .subscribe(result => {
                // при получении итемов

                // переводим ответ в json
                let data = result.json();

                // console.log(data);

                // вычесляем количество итемов
                let itemsLength = data.length;

                // обработка итемов
                if (itemsLength != 0) {
                    // если больше нуля

                    // console.log(data.auctionItems);

                    // добавляем полученные итемы на страницу
                    this.items = data;

                } else {
                    // если итемов нет

                    // todo показываем оповещение что итемов нет

                }

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

    ionViewDidLoad() {
        // console.log('ionViewDidLoad SalesmenPage');
    }


    action(item) {


        // {{ item.name }} {{ item.surname }}

        let actionSheet = this.actionSheetCtrl.create({
            title: item.name + ' ' + item.surname,
            buttons: [
                {
                    text: 'Login',
                    icon: 'md-log-in',
                    handler: () => {
                        console.log('Destructive clicked');
                    }
                },{
                    text: 'Masks',
                    icon: 'md-list',
                    handler: () => {
                        // переход на страницу
                        this.nav.setRoot(CustomersPage, { subRole: 'salesman' });
                    }
                },{
                    text: 'Permissions',
                    icon: 'md-lock',
                    handler: () => {
                        console.log('Archive clicked');
                    }
                },{
                    text: 'Edit',
                    icon: 'ios-create',
                    handler: () => {
                        console.log('Archive clicked');
                    }
                },{
                    text: 'Statistic',
                    icon: 'md-stats',
                    handler: () => {
                        console.log('Archive clicked');
                    }
                },{
                    text: 'Cancel',
                    icon: 'md-close',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked');
                    }
                }
            ]
        });
        actionSheet.present();
    }


    /**
     * Возврат на главную страницу
     *
     */
    goToMainPage() {
        this.nav.setRoot(MainPage);
    }

}
