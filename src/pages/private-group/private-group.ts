import {Component} from '@angular/core';
import {
    ModalController,
    NavController,
    NavParams,
    Nav,
    ActionSheetController,
    AlertController,
    ItemSliding
} from 'ionic-angular';
// import {MenuPage} from '../menu/menu';

import {MainPage} from '../main/main'
import {PrivateGroupAddMemberPage} from '../private-group-add-member/private-group-add-member'
import {PrivateGroupSearchMemberPage} from '../private-group-search-members/private-group-search-members'

import {PrivateGroup} from '../../providers/private-group';


/*
 Generated class for the Ustomers page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'private-group',
    providers: [PrivateGroup],
    templateUrl: 'private-group.html'
})
export class PrivateGroupPage {


    /**
     * Участники группы агента
     *
     */
    public members: any = [];


    /**
     * Участники присутствуют
     *
     */
    public existsMembers: boolean = false;


    /**
     * Нет участников
     *
     */
    public noMembers: boolean = false;


    constructor(public modalCtrl: ModalController,
                public navCtrl: NavController,
                public navParams: NavParams,
                public nav: Nav,
                public privateGroup: PrivateGroup,
                public actionSheetCtrl: ActionSheetController,
                public alertCtrl: AlertController) {

        // public privateGroup: PrivateGroup,


        // let subRole = this.navParams.get('subRole');
        //
        // if (subRole == 'salesman') {
        //     this.subRole = this.navParams.get('subRole');
        //     this.salesmenData = this.navParams.get('salesmenData');
        // }

        // console.log(this.subRole);

        // получение всех участников группы
        this.getMembers();

        // this.privateGroup.members()
        //     .subscribe(data => {
        //
        //         console.log('получение участников');
        //
        //         let res = data.json();
        //
        //         // console.log(res.members['active']);
        //         // console.log(res.members['waiting']);
        //         // console.log(res.members['rejected']);
        //
        //         console.log(res);
        //
        //         this.members = [];
        //         this.existsMembers = false;
        //         this.noMembers = false;
        //
        //         if (res.members['active'].length != 0 || res.members['waiting'].length != 0 || res.members['rejected'].length != 0) {
        //
        //             this.members = res.members;
        //
        //             this.existsMembers = true;
        //
        //         } else {
        //
        //             this.noMembers = true;
        //         }
        //
        //
        //         // console.log(res);
        //
        //     }, err => {
        //
        //         console.log('Error ' + err);
        //
        //     });

        console.log('страница приватной группы');
    }


    ionViewDidLoad() {
        // console.log('ionViewDidLoad UstomersPage');
    }


    ionViewWillEnter() {
        // console.log('ionViewDidLoad UstomersPage');
    }


    /**
     * Действия по участнику группы
     *
     */
    memberAction(member, slidingItem: ItemSliding) {


        let title = member.surname + ' ' + member.name;

        let actionSheet = this.actionSheetCtrl.create({
            title: title,
            buttons: [
                {
                    text: 'Delete',
                    handler: () => {
                        this.memberDeleteConfirmation(member, slidingItem);
                        console.log('Delete clicked');
                    }
                }, {
                    text: 'Cancel',
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
     * Поиск нового участника в группу
     *
     * переход на страницу поиска участников в группу
     */
    searchMember() {

        // console.log(statuses);
        let modal = this.modalCtrl.create(PrivateGroupSearchMemberPage, {});

        modal.onDidDismiss(data => {

            this.getMembers();
            console.log('закрылось окно добавления участников группы');
        });

        modal.present();
    }


    /**
     * Получение всех участников группы
     *
     */
    getMembers() {

        this.existsMembers = false;
        this.noMembers = false;

        this.privateGroup.members()
            .subscribe(data => {

                console.log('получение участников');

                let res = data.json();

                // console.log(res.members['active']);
                // console.log(res.members['waiting']);
                // console.log(res.members['rejected']);

                console.log(res);

                this.members = [];
                this.existsMembers = false;
                this.noMembers = false;

                if (res.members['active'].length != 0 || res.members['waiting'].length != 0 || res.members['rejected'].length != 0) {

                    this.members = res.members;

                    this.existsMembers = true;

                } else {

                    this.noMembers = true;
                }


                // console.log(res);

            }, err => {

                console.log('Error ' + err);

            });
    }


    /**
     * Удаление участника из группы
     *
     */
    removeMember(member) {

        console.log('remove member');
        console.log(member);


        this.privateGroup.removeMember(member.uid)
            .subscribe(data => {

                let res = data.json();

                console.log('удаление участника группы');
                console.log(res);

                if (res.status == 'success') {
                    this.getMembers();
                }

            }, err => {

                console.log('Error ' + err);

            });
    }


    /**
     * Подтверждение на удаление пользователя
     *
     */
    memberDeleteConfirmation(member, slidingItem: ItemSliding) {

        if (slidingItem) {
            slidingItem.close();
        }

        let prompt = this.alertCtrl.create({
            // title: member.name + ' ' + member.surname,
            title: 'Delete member',
            message: "Agent <b>" + member.name + " " + member.surname + "</b> will be removed from your private group",

            buttons: [
                {
                    text: 'Cancel',
                    handler: data => {

                    }
                },
                {
                    text: 'Delete',
                    handler: data => {
                        console.log('Delete member: ');
                        console.log(data);
                        console.log(member);

                        this.removeMember(member);
                    }
                }
            ]
        });
        prompt.present();
    }


    /**
     * Возврат на главную страницу
     *
     */
    goToMainPage() {

        this.nav.setRoot(MainPage);
    }

}