import {Component} from '@angular/core';
import {NavController, NavParams, ViewController, ActionSheetController, ModalController} from 'ionic-angular';


import {OpenLeadOrganizerEditPage} from "../open-lead-organizer-edit/open-lead-organizer-edit";
import {OpenLeadOrganizer} from '../../providers/open-lead-organizer';
import {Organizer} from '../../providers/organizer';
import {MainPage} from '../main/main'


/*
 Generated class for the OpenLeadOrganizer page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'organizer',
    templateUrl: 'organizer.html',
    providers: [Organizer]
})
export class OrganizerPage {

    public items: any = false;

    public itemsId: any = false;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public view: ViewController,
                public actionSheetCtrl: ActionSheetController,
                public organizer: Organizer,
                public modalCtrl: ModalController) {


        // this.organizer.test();

        // this.itemsId = this.navParams.get('itemsId');
        //
        //
        this.organizer.get()
            .subscribe(result => {

                // переводим ответ в json
                let data = result.json();

                // let modal = this.modalCtrl.create(OpenLeadOrganizerPage, {items: data});
                //
                // modal.present();

                this.items = data.organizer;

                console.log(data);

            }, err => {

                console.log('ERROR: ' + err);
            });


        // console.log(this.items);
    }


    ionViewDidLoad() {
        console.log('ionViewDidLoad OpenLeadOrganizerPage');
    }


    /**
     * Создание нового итема
     *
     */
    // addItem() {
    //
    //     let type = 'reminder';
    //
    //     if(this.organizerBlocks != 'reminders'){
    //
    //         type = 'comment';
    //     }
    //
    //     let modal = this.modalCtrl.create(OpenLeadOrganizerEditPage, {type: type, openLeadId: this.itemsId});
    //
    //
    //     modal.onDidDismiss(data => {
    //
    //         this.organizer.get({ openLeadId: this.itemsId })
    //             .subscribe(result => {
    //
    //                 // переводим ответ в json
    //                 let data = result.json();
    //
    //                 // let modal = this.modalCtrl.create(OpenLeadOrganizerPage, {items: data});
    //                 //
    //                 // modal.present();
    //
    //                 this.items = data.organizer;
    //
    //                 // console.log(data);
    //
    //             }, err => {
    //
    //                 console.log('ERROR: ' + err);
    //             });
    //
    //     });
    //
    //
    //     modal.present();
    //
    // }


    /**
     * Редактирование итема
     *
     */
    // editItem(itemData) {
    //
    //     let type = 'reminder';
    //
    //     if(itemData.type != 2){
    //
    //         type = 'comment';
    //     }
    //
    //     let modal = this.modalCtrl.create(OpenLeadOrganizerEditPage, {type: type, itemData: itemData});
    //
    //
    //     modal.onDidDismiss(data => {
    //
    //         this.organizer.get({ openLeadId: this.itemsId })
    //             .subscribe(result => {
    //
    //                 // переводим ответ в json
    //                 let data = result.json();
    //
    //                 // let modal = this.modalCtrl.create(OpenLeadOrganizerPage, {items: data});
    //                 //
    //                 // modal.present();
    //
    //                 this.items = data.organizer;
    //
    //                 // console.log(data);
    //
    //             }, err => {
    //
    //                 console.log('ERROR: ' + err);
    //             });
    //
    //     });
    //
    //
    //     modal.present();
    //
    // }


    /**
     * Удаление итема
     *
     */
    // dellItem(itemData) {
    //
    //     this.organizer.dell({ organizerId: itemData.id })
    //         .subscribe(result => {
    //
    //             // переводим ответ в json
    //             let data = result.json();
    //
    //             // let modal = this.modalCtrl.create(OpenLeadOrganizerPage, {items: data});
    //             //
    //             // modal.present();
    //
    //             // this.items = data.organizer;
    //
    //             this.organizer.get({ openLeadId: this.itemsId })
    //                 .subscribe(result => {
    //
    //                     // переводим ответ в json
    //                     let data = result.json();
    //
    //                     // let modal = this.modalCtrl.create(OpenLeadOrganizerPage, {items: data});
    //                     //
    //                     // modal.present();
    //
    //                     this.items = data.organizer;
    //
    //                     // console.log(data);
    //
    //                 }, err => {
    //
    //                     console.log('ERROR: ' + err);
    //                 });
    //
    //
    //
    //             console.log(data);
    //
    //         }, err => {
    //
    //             console.log('ERROR: ' + err);
    //         });
    // }


    /**
     * Смена статуса итема
     *
     */
    // applyItem(itemData) {
    //
    //     this.organizer.apply({ organizerId: itemData.id })
    //         .subscribe(result => {
    //
    //             // переводим ответ в json
    //             let data = result.json();
    //
    //             console.log(data);
    //
    //
    //
    //
    //             this.organizer.get({ openLeadId: this.itemsId })
    //                 .subscribe(result => {
    //
    //                     // переводим ответ в json
    //                     let data = result.json();
    //
    //                     this.items = data.organizer;
    //
    //                     // console.log(data);
    //
    //                 }, err => {
    //
    //                     console.log('ERROR: ' + err);
    //                 });
    //
    //
    //
    //             console.log(data);
    //
    //         }, err => {
    //
    //             console.log('ERROR: ' + err);
    //         });
    // }


    // presentActionSheet() {
    //     let actionSheet = this.actionSheetCtrl.create({
    //         title: 'Add reminder or comment',
    //         buttons: [
    //             {
    //                 text: 'New reminder',
    //                 role: 'destructive',
    //                 icon: 'alarm',
    //                 handler: () => {
    //                     console.log('Destructive clicked');
    //                 }
    //             }, {
    //                 text: 'Comment',
    //                 icon: 'ios-paper-outline',
    //                 handler: () => {
    //                     console.log('Archive clicked');
    //                 }
    //             }, {
    //                 text: 'Cancel',
    //                 role: 'cancel',
    //                 icon: 'md-close',
    //                 handler: () => {
    //                     console.log('Cancel clicked');
    //                 }
    //             }
    //         ]
    //     });
    //     actionSheet.present();
    // }


    /**
     * Меню итема
     *
     */
    // itemActionSheet(itemData) {
    //
    //     console.log(itemData);
    //
    //     let title = '';
    //
    //     let actionSheet;
    //
    //     if (itemData.type == 2){
    //         title = itemData.date.time + ' ' + itemData.date.date;
    //
    //         actionSheet = this.actionSheetCtrl.create({
    //             title: title,
    //             buttons: [
    //                 {
    //                     text: 'Apply',
    //                     role: 'destructive',
    //                     icon: 'ios-checkbox-outline',
    //                     handler: () => {
    //                         // console.log('Destructive clicked');
    //                         this.applyItem(itemData);
    //                     }
    //                 },
    //
    //                 {
    //                     text: 'Edit',
    //                     icon: 'ios-create-outline',
    //                     handler: () => {
    //                         this.editItem(itemData);
    //                     }
    //                 },
    //
    //                 {
    //                     text: 'Dell',
    //                     icon: 'ios-close-circle-outline',
    //                     handler: () => {
    //                         this.dellItem(itemData);
    //                     }
    //                 },
    //
    //                 {
    //                     text: 'Cancel',
    //                     role: 'cancel',
    //                     icon: 'md-close',
    //                     handler: () => {
    //                         console.log('Cancel clicked');
    //                     }
    //                 }
    //             ]
    //         });
    //
    //     }else{
    //         actionSheet = this.actionSheetCtrl.create({
    //             title: title,
    //             buttons: [
    //
    //                 {
    //                     text: 'Edit',
    //                     icon: 'ios-create-outline',
    //                     handler: () => {
    //                         this.editItem(itemData);
    //                     }
    //                 },
    //
    //                 {
    //                     text: 'Dell',
    //                     icon: 'ios-close-circle-outline',
    //                     handler: () => {
    //                         this.dellItem(itemData);
    //                     }
    //                 },
    //
    //                 {
    //                     text: 'Cancel',
    //                     role: 'cancel',
    //                     icon: 'md-close',
    //                     handler: () => {
    //                         console.log('Cancel clicked');
    //                     }
    //                 }
    //             ]
    //         });
    //     }
    //
    //
    //     actionSheet.present();
    // }


    close() {
        this.navCtrl.setRoot(MainPage);
    }

}
