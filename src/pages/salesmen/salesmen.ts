import {Component} from '@angular/core';
import {NavController, NavParams, Nav, ActionSheetController, AlertController} from 'ionic-angular';
import {MainPage} from '../main/main'
import {Salesmen} from '../../providers/salesmen';
// страница для фильтрования лидов
import {CustomersPage} from '../customers/customers';
import {EditSalesmenPage} from '../edit-salesmen/edit-salesmen';
import {ObtainPage} from '../obtain/obtain';

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
    permission_alert: boolean = false;

    permission_item: any = false;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public nav: Nav,
                public salesmen: Salesmen,
                public actionSheetCtrl: ActionSheetController,
                public alertCtrl: AlertController) {

        this.salesmen.getSalesmen()
        // обработка итемов
            .subscribe(result => {
                // при получении итемов

                // переводим ответ в json
                let data = result.json();

                console.log(data);

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


    /**
     * Вход агента под салесманом
     *
     */
    loginToSalesmen(item) {
        // console.log('login to salesmen');

        this.nav.setRoot(ObtainPage, { salesmen: item })
    }


    /**
     * Переход на страницу создания салесмана
     *
     */
    createSalesmen() {
        this.nav.setRoot(EditSalesmenPage);
    }


    /**
     * переход на страницу подбора клиентов (сферы с масками)
     *
     */
    goToCustomersPage(item) {
        this.nav.setRoot(CustomersPage, {subRole: 'salesman', salesmenData: item});
    }


    /**
     * Открытие алерта с пермиссиями
     *
     */
    permissionAlertOpen(item) {

        this.permission_item = item;
        this.permission_alert = true;
    }


    /**
     * Закрытие алерта с пермиссиями
     *
     */
    permissionAlertClose() {

        this.permission_alert = false;
        this.permission_item = false;

    }

    changePermissionItem(permissionItem) {
        // permissionItem = !permissionItem;

        this.permission_item.permissions[permissionItem] = !this.permission_item.permissions[permissionItem];

    }


    /**
     * Сохранение прав салесмана
     *
     */
    applyPermissionItem() {

        this.salesmen.сhangeSalesmenPermissions(this.permission_item.id, this.permission_item.permissions)
        // обработка данных
            .subscribe(result => {
                // при получении итемов

                // переводим ответ в json
                let data = result.json();

                console.log(data);

                if (data.status == true) {

                    for (let item of this.items) {


                        // console.log('середина');
                        // console.log(item);

                        if (item.id == this.permission_item.id) {

                            // console.log('тут');
                            // console.log(item);

                            item.permissions = data.permissions;
                            item.banned_at = data.banned_at;
                        }

                    }


                    this.permissionAlertClose();

                } else {

                    this.permissionAlertClose();
                }

                // вычесляем количество итемов
                // let itemsLength = data.length;

                // обработка итемов
                // if (itemsLength != 0) {
                //     // если больше нуля
                //
                //     // console.log(data.auctionItems);
                //
                //     // добавляем полученные итемы на страницу
                //     this.items = data;
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

        console.log(this.permission_item);
    }

    permissions(item) {


        let permiss = this.alertCtrl.create({
            title: item.name + ' ' + item.surname,
            message: `
            <div class="permiss_alert_row"> 
                <ion-toggle></ion-toggle>
                <span class="permiss_alert_label">одни</span>
            </div>
            
            <div> 
                <span><ion-toggle [(ngModel)]="item.permissions.create_leads"></ion-toggle></span>
                <span class="permiss_alert_label">одни</span>
            </div>
            
            <div> 
                <span>1</span>
                <span class="permiss_alert_label">одни</span>
            </div>

                `,
            buttons: [
                {
                    text: 'Cancel',
                    handler: () => {
                        console.log('Disagree clicked');
                    }
                },
                {
                    text: 'Apply',
                    handler: () => {
                        console.log('Agree clicked');
                    }
                }
            ]
        });
        permiss.present();
    }


    /**
     * открыть панель кнопок
     *
     */
    action(item) {


        // {{ item.name }} {{ item.surname }}

        let actionSheet = this.actionSheetCtrl.create({
            title: item.name + ' ' + item.surname,
            buttons: [
                {
                    text: 'Login',
                    icon: 'md-log-in',
                    handler: () => {
                        // console.log('Destructive clicked');
                        this.loginToSalesmen(item);
                        // console.log('aaa:');
                        // console.log(item);
                    }
                }, {
                    text: 'Customers filters',
                    icon: 'md-list',
                    handler: () => {
                        // переход на страницу
                        // this.nav.setRoot(CustomersPage, {subRole: 'salesman'});
                        this.goToCustomersPage(item);
                    }
                }, {
                    text: 'Permissions',
                    icon: 'md-lock',
                    handler: () => {
                        // console.log('Archive clicked');
                        // this.permissions(item);

                        this.permissionAlertOpen(item);
                    }
                }, {
                    text: 'Edit',
                    icon: 'ios-create',
                    handler: () => {

                        this.nav.setRoot(EditSalesmenPage, {salesman: item});

                        // console.log('Archive clicked');
                    }
                },
                // {
                //     text: 'Statistic',
                //     icon: 'md-stats',
                //     handler: () => {
                //         console.log('Archive clicked');
                //     }
                // },
                {
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
