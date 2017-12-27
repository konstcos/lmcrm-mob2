import {Component} from '@angular/core';
import {
    NavController,
    NavParams,
    ViewController,
    ActionSheetController,
    ModalController,
    MenuController
} from 'ionic-angular';
import {TranslateService} from 'ng2-translate/ng2-translate';


import {OpenLeadOrganizerEditPage} from "../open-lead-organizer-edit/open-lead-organizer-edit";
import {OpenLeadOrganizer} from '../../providers/open-lead-organizer';


/*
 Generated class for the OpenLeadOrganizer page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'page-open-lead-organizer',
    templateUrl: 'open-lead-organizer.html'
})
export class OpenLeadOrganizerPage {


    /**
     * Данные по итемам
     *
     */
    public items: any = false;


    /**
     * id итемов
     *
     */
    public itemsId: any = false;


    /**
     * Идентификатор реминдера
     *
     */
    public reminderId: any = false;


    /**
     * Данные фильтра
     *
     */
    public filter: any = {
        state: []
    };


    /**
     * Данные рабочего фильтра
     *
     */
    public filterApplied: any = {
        state: []
    };


    /**
     * Индикатор загрузки
     *
     */
    public isLoading: any = false;


    /**
     * Данные лида (имя и фамилия
     */
    public leadData: any = {
        name: '',
        surname: '',
    };


    /**
     * Включен фильтр или выключен
     *
     */
    public isFilterOn: boolean = false;


    /**
     * Состояние итемов
     *
     * просроченный, завершенный, в ожидании
     *
     */
    public allStates: any = [
        {id: 1, name: 'open_lead_organizer.filter.state.pending', status: false},
        {id: 2, name: 'open_lead_organizer.filter.state.overdue', status: false},
        {id: 3, name: 'open_lead_organizer.filter.state.done', status: false},
    ];


    public organizerBlocks: String = 'reminders';

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public view: ViewController,
                public actionSheetCtrl: ActionSheetController,
                public organizer: OpenLeadOrganizer,
                public modalCtrl: ModalController,
                public menuCtrl: MenuController,
                public translate: TranslateService) {


        let filter = localStorage.getItem('openLeadOrganizerFilter');

        if (filter) {

            this.filterApplied = JSON.parse(filter);
            this.filter = JSON.parse(filter);

            this.filterRecount();
        }


        this.itemsId = this.navParams.get('itemsId');

        if (!this.itemsId) {
            this.reminderId = this.navParams.get('reminderId');
        }


        this.loadOrganizerItems();

        console.log(this.items);
    }


    ionViewDidLoad() {
        console.log('ionViewDidLoad OpenLeadOrganizerPage');

        this.menuCtrl.enable(true, 'open_lead_organizer_filter');
    }


    /**
     * Выбор статуса
     *
     */
    selectState(selectedState) {

        // перебираем все статусы
        for (let state in this.allStates) {

            if (this.allStates[state]['id'] == selectedState['id'] && this.allStates[state]['status']) {

                this.allStates[state]['status'] = false;
                // this.filter.leadStatus = 0;

                let stateData = [];
                this.filter.state.forEach(function (typeId, key) {

                    if (typeId != selectedState['id']) {
                        stateData.push(typeId);
                    }

                    // console.log('перечисляю фильтр');
                    // console.log(mask['id']);
                    // console.log(maskId);
                });

                this.filter.state = stateData;

                break;
            }


            if (this.allStates[state]['id'] == selectedState['id']) {
                this.allStates[state]['status'] = true;

                this.filter.state.push(selectedState['id']);
            }

        }

    }


    /**
     * Очистка состояния фильтра
     *
     */
    clearStateFilter() {

        // перебираем все состояния итемов
        for (let stateId in this.allStates) {

            this.allStates[stateId]['status'] = false;
        }

        this.filter.state = [];
    }


    /**
     * Применить фильтр
     *
     */
    filterApply() {
        // сохранение примененного фильтра из рабочего в примененный
        for (let filterData in this.filterApplied) {

            switch (filterData) {

                case 'state':

                    this.filterApplied['state'] = JSON.parse(JSON.stringify(this.filter['state']));
                    break;

            }
        }

        // сохранение фильтра в локалсторедже
        localStorage.setItem('openLeadOrganizerFilter', JSON.stringify(this.filterApplied));

        // пересчет фильтра
        this.filterRecount();

        // обновление итемов на странице с сервера
        this.loadOrganizerItems()
    }


    /**
     * Обнуление фильтра
     *
     */
    filterReset() {

        // обнуление рабочих данных
        this.filter = {
            state: []
        };

        // обнулние примененных данных
        this.filterApplied = {
            state: []
        };

        // сохранение в локалсторедже
        localStorage.setItem('openLeadOrganizerFilter', JSON.stringify(this.filterApplied));

        // пересчет данных по фильтру
        this.filterRecount();

        // обновление итемов на странице с сервера
        this.loadOrganizerItems()

    }


    /**
     * Пересчет данных по фильтру
     *
     */
    filterRecount() {

        // выключение фильтра
        this.isFilterOn = false;

        // пересчет выбранных состояний итемов
        for (let state in this.allStates) {

            this.allStates[state]['status'] = false;

            this.filter['state'].forEach(selectedState => {

                if (this.allStates[state]['id'] == selectedState) {

                    this.isFilterOn = true;

                    this.allStates[state]['status'] = true;
                }
            });
        }

        console.log(this.isFilterOn);
    }


    /**
     * Переключение меню
     *
     */
    menuToggle() {

        this.whenFilterMenuClose();

        if (this.organizerBlocks == 'reminders') {
            this.menuCtrl.toggle('right');
        }
    }


    /**
     * Закрытие меню
     *
     */
    whenFilterMenuClose() {
        // сохранение примененного фильтра из рабочего в примененный
        for (let filterData in this.filterApplied) {

            switch (filterData) {

                case 'state':
                    // this.filterApplied['state'] = JSON.parse(JSON.stringify(this.filter['state']));

                    this.filter['state'] = JSON.parse(JSON.stringify(this.filterApplied['state']));
                    break;

            }
        }

        console.log('срабатывает когда меню закрывается: ');

        console.log(this.filter['state']);

        // сохранение фильтра в локалсторедже
        localStorage.setItem('openLeadOrganizerFilter', JSON.stringify(this.filterApplied));

        // пересчет фильтра
        this.filterRecount();
    }


    /**
     * Создание нового итема
     *
     */
    addItem() {

        let type = 'reminder';

        if (this.organizerBlocks != 'reminders') {

            type = 'comment';
        }

        let modal = this.modalCtrl.create(OpenLeadOrganizerEditPage, {type: type, openLeadId: this.itemsId});


        modal.onDidDismiss(data => {

            this.organizer.get({openLeadId: this.itemsId})
                .subscribe(result => {

                    // переводим ответ в json
                    let data = result.json();

                    // let modal = this.modalCtrl.create(OpenLeadOrganizerPage, {items: data});
                    //
                    // modal.present();

                    this.items = data.organizer;

                    // console.log(data);

                }, err => {

                    console.log('ERROR: ' + err);
                });

        });


        modal.present();

    }


    /**
     * Редактирование итема
     *
     */
    editItem(itemData) {

        let type = 'reminder';

        if (itemData.type != 2) {

            type = 'comment';
        }

        let modal = this.modalCtrl.create(OpenLeadOrganizerEditPage, {type: type, itemData: itemData});


        modal.onDidDismiss(data => {

            this.organizer.get({openLeadId: this.itemsId})
                .subscribe(result => {

                    // переводим ответ в json
                    let data = result.json();

                    // let modal = this.modalCtrl.create(OpenLeadOrganizerPage, {items: data});
                    //
                    // modal.present();

                    // this.items = data.organizer;

                    this.loadOrganizerItems();


                    // console.log(data);

                }, err => {

                    console.log('ERROR: ' + err);
                });

        });


        modal.present();

    }


    /**
     * Удаление итема
     *
     */
    dellItem(itemData) {

        this.organizer.dell({organizerId: itemData.id})
            .subscribe(result => {

                // переводим ответ в json
                let data = result.json();

                // let modal = this.modalCtrl.create(OpenLeadOrganizerPage, {items: data});
                //
                // modal.present();

                // this.items = data.organizer;

                this.organizer.get({openLeadId: this.itemsId})
                    .subscribe(result => {

                        // переводим ответ в json
                        let data = result.json();

                        // let modal = this.modalCtrl.create(OpenLeadOrganizerPage, {items: data});
                        //
                        // modal.present();

                        // this.items = data.organizer;

                        this.loadOrganizerItems();

                        // console.log(data);

                    }, err => {

                        console.log('ERROR: ' + err);
                    });


                console.log(data);

            }, err => {

                console.log('ERROR: ' + err);
            });
    }


    /**
     * Смена статуса итема
     *
     */
    applyItem(itemData) {

        let status;

        if (itemData.status != 'done') {

            status = 'apply';

        } else {

            status = 'notApply';
        }

        this.organizer.apply({organizerId: itemData.id, status: status})
            .subscribe(result => {

                // переводим ответ в json
                let data = result.json();

                console.log(data);


                this.organizer.get({openLeadId: this.itemsId})
                    .subscribe(result => {

                        // переводим ответ в json
                        let data = result.json();

                        // this.items = data.organizer;

                        this.loadOrganizerItems();

                        // console.log(data);

                    }, err => {

                        console.log('ERROR: ' + err);
                    });


                console.log(data);

            }, err => {

                console.log('ERROR: ' + err);
            });
    }


    presentActionSheet() {
        let actionSheet = this.actionSheetCtrl.create({
            title: 'Add reminder or comment',
            buttons: [
                {
                    text: 'New reminder',
                    role: 'destructive',
                    icon: 'alarm',
                    handler: () => {
                        console.log('Destructive clicked');
                    }
                }, {
                    text: 'Comment',
                    icon: 'ios-paper-outline',
                    handler: () => {
                        console.log('Archive clicked');
                    }
                }, {
                    text: 'Cancel',
                    role: 'cancel',
                    icon: 'md-close',
                    handler: () => {
                        console.log('Cancel clicked');
                    }
                }
            ]
        });
        actionSheet.present();
    }


    /**
     * Загрузка данных органайзера
     *
     */
    loadOrganizerItems() {

        this.isLoading = true;

        let data = {};

        if (this.itemsId) {

            data['openLeadId'] = this.itemsId;

        } else {

            data['reminderId'] = this.reminderId
        }

        data['filter'] = this.filterApplied;

        // console.log(this.itemsId);
        console.log('reminder: ');
        console.log(data);

        // data = {
        //     openLeadId: this.itemsId,
        //     filter: this.filterApplied
        // };

        this.organizer.get(data)
            .subscribe(result => {

                // переводим ответ в json
                let data = result.json();

                console.log(data);

                this.leadData = {
                    name: data.leadData.name,
                    surname: data.leadData.surname,
                };

                // let modal = this.modalCtrl.create(OpenLeadOrganizerPage, {items: data});
                //
                // modal.present();

                this.itemsId = data.openLead.id;

                this.items = data.organizer;

                this.isLoading = false;

                // console.log(data);

            }, err => {

                this.isLoading = false;
                console.log('ERROR: ' + err);
            });
    }


    /**
     * Меню итема
     *
     */
    itemActionSheet(itemData) {

        console.log(itemData);

        let title = '';

        let actionSheet;

        let apply = 'Apply';
        let edit = 'Edit';
        let dell = 'Dell';
        let cancel = 'Cancel';

        this.translate.get('open_lead_organizer.actionSheet.apply', {}).subscribe((res: string) => {
            apply = res;
        });

        this.translate.get('open_lead_organizer.actionSheet.edit', {}).subscribe((res: string) => {
            edit = res;
        });

        this.translate.get('open_lead_organizer.actionSheet.dell', {}).subscribe((res: string) => {
            dell = res;
        });

        this.translate.get('open_lead_organizer.actionSheet.cancel', {}).subscribe((res: string) => {
            cancel = res;
        });


        if (itemData.type == 2) {
            title = itemData.date.time + ' ' + itemData.date.date;

            actionSheet = this.actionSheetCtrl.create({
                title: title,
                buttons: [
                    {
                        text: apply,
                        role: 'destructive',
                        icon: 'ios-checkbox-outline',
                        handler: () => {
                            // console.log('Destructive clicked');
                            this.applyItem(itemData);
                        }
                    },

                    {
                        text: edit,
                        icon: 'ios-create-outline',
                        handler: () => {
                            this.editItem(itemData);
                        }
                    },

                    {
                        text: dell,
                        icon: 'ios-close-circle-outline',
                        handler: () => {
                            this.dellItem(itemData);
                        }
                    },

                    {
                        text: cancel,
                        role: 'cancel',
                        icon: 'md-close',
                        handler: () => {
                            console.log('Cancel clicked');
                        }
                    }
                ]
            });

        } else {
            actionSheet = this.actionSheetCtrl.create({
                title: title,
                buttons: [

                    {
                        text: edit,
                        icon: 'ios-create-outline',
                        handler: () => {
                            this.editItem(itemData);
                        }
                    },

                    {
                        text: dell,
                        icon: 'ios-close-circle-outline',
                        handler: () => {
                            this.dellItem(itemData);
                        }
                    },

                    {
                        text: cancel,
                        role: 'cancel',
                        icon: 'md-close',
                        handler: () => {
                            console.log('Cancel clicked');
                        }
                    }
                ]
            });
        }


        actionSheet.present();
    }


    /**
     * Закрытие окна
     *
     */
    close() {

        this.menuCtrl.enable(true, 'main_menu');

        this.view.dismiss({
            state: 'cancel',
        });
    }

}
