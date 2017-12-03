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
import {TranslateService} from 'ng2-translate/ng2-translate';

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
                public alertCtrl: AlertController,
                public translate: TranslateService) {

        // получение всех участников группы
        this.getMembers();
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

        let text = {
            "delete": "Delete",
            "cancel": "Cancel"
        };

        this.translate.get('private_group.member_action', {}).subscribe((res: string) => {

            text['delete'] = res['delete'];
            text['cancel'] = res['cancel'];
        });

        let title = member.surname + ' ' + member.name;

        let actionSheet = this.actionSheetCtrl.create({
            title: title,
            buttons: [
                {
                    text: text['delete'],
                    handler: () => {
                        this.memberDeleteConfirmation(member, slidingItem);
                        console.log('Delete clicked');
                    }
                }, {
                    text: text['cancel'],
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

        let text = {
            "will_be_removed": "will be removed from your private group",
            "delete": "Delete",
            "cancel": "Cancel"
        };

        this.translate.get('private_group.member_delete_confirmation', {}).subscribe((res: string) => {

            text['will_be_removed'] = res['will_be_removed'];
            text['delete'] = res['delete'];
            text['cancel'] = res['cancel'];
        });

        if (slidingItem) {
            slidingItem.close();
        }

        let prompt = this.alertCtrl.create({
            // title: member.name + ' ' + member.surname,
            title: 'Delete member',
            message: "<b>" + member.name + " " + member.surname + "</b> " + text['will_be_removed'],

            buttons: [
                {
                    text: text['cancel'],
                    handler: data => {

                    }
                },
                {
                    text: text['delete'],
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