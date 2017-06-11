import {Component, Input, ViewChild} from '@angular/core';
import {NavController, NavParams, ViewController, Content, AlertController, ModalController, ToastController} from 'ionic-angular';

import {PrivateGroupPage} from '../private-group/private-group'

import {PrivateGroupAddMemberPage} from '../private-group-add-member/private-group-add-member'

import {PrivateGroup} from '../../providers/private-group';


/*
 Generated class for the Ustomers page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'private-group-search-members',
    providers: [PrivateGroup],
    templateUrl: 'private-group-search-members.html'
})
export class PrivateGroupSearchMemberPage {

    @ViewChild(Content) content: Content;
    @ViewChild('headerInput') headerInput;

    /**
     * Ключевое слово для поиска
     *
     */
    public keyword: string = '';


    /**
     * Ключ спинера
     *
     * показывать спинер или нет
     */
    public spinnerKey: boolean = false;


    /**
     * Ключ основной формы на странице
     *
     * показывать форму или нет
     */
    public searchFormKey: boolean = true;


    /**
     * Ключ поисковой формы в шапке
     *
     * показывать форму или нет
     */
    public searchHeaderKey: boolean = false;


    /**
     * Ключ поисковых результатов
     *
     * показывать или нет
     */
    public searchContentKey: boolean = false;


    /**
     * Агенты, найденные по запросу
     *
     */
    public agents: any = [];


    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public view: ViewController,
                public privateGroup: PrivateGroup,
                public alertCtrl: AlertController,
                public modalCtrl: ModalController,
                private toastCtrl: ToastController) {

        // public privateGroup: PrivateGroup

        // let subRole = this.navParams.get('subRole');


        // this.privateGroup.members()
        //     .subscribe(data => {
        //
        //         console.log('получение участников');
        //
        //         let res = data.json();
        //
        //
        //         // console.log(res);
        //
        //     }, err => {
        //
        //         console.log('Error ' + err);
        //
        //     });

        console.log('страница добавление участника в приватную группу');
    }


    ionViewDidLoad() {
        // console.log('ionViewDidLoad UstomersPage');
    }


    ionViewWillEnter() {
        // console.log('ionViewDidLoad UstomersPage');
    }


    /**
     * Искать агентов
     *
     */
    startSearch() {

        // проверка на пустое поле
        if (this.keyword.trim() == '') {
            // если поле пустое, выходим из метода
            return false;
        }

        // убиреме основную форму
        this.searchFormKey = false;

        // убираем контент (если он есть)
        this.searchContentKey = false;

        // добавление формы поиска в шипку

        // сохраняем прежнее значение формы поиска в шапке
        let searchHeaderKeyOld = this.searchHeaderKey;

        // меняем представление формы в шапке
        this.searchHeaderKey = true;

        // если меняется значение формы в шапке
        if (!searchHeaderKeyOld) {
            // пересчитываем размер контента
            this.content.resize();
        }

        // показываем спинер загрузки
        this.spinnerKey = true;


        // console.log(this.keyword);

        this.privateGroup.searchMember(this.keyword)
            .subscribe(data => {

                console.log('поиск участников');

                let res = data.json();

                // прячем индикатор загрузки
                this.spinnerKey = false;

                this.agents = res.agents;

                console.log(res);

                // показываем контент
                this.searchContentKey = true;

            }, err => {

                console.log('Error ' + err);

            });
    }


    /**
     * Подтверждение добавления пользователя
     *
     */
    addAgentConfirmation(agent) {


        // console.log(statuses);
        let modal = this.modalCtrl.create(PrivateGroupAddMemberPage, {agent: agent});

        modal.onDidDismiss(data => {

            // сценарий по результату добалвения
            if (data.status == 'success') {
                // успешно добавлени

                // todo тост успешного добавления
                let toast = this.toastCtrl.create({
                    message: 'Success added. ' + data.agent.first_name + ' ' + data.agent.last_name + ' added to you private group',
                    duration: 3000,
                    position: 'bottom'
                });

                toast.onDidDismiss(() => {
                    console.log('Dismissed toast');
                });

                toast.present();

                this.startSearch();

            } else if (data.info == 'close') {

                console.log('modal close');

            } else if (data.info == 'agent_not_added') {
                // ошибка добавления

                // todo тост об ошибке
                let toast = this.toastCtrl.create({
                    message: 'Not added. ' + data.agent.first_name + ' ' + data.agent.last_name + ' NOT added to you group',
                    duration: 3000,
                    position: 'bottom'
                });

                toast.onDidDismiss(() => {
                    console.log('Dismissed toast');
                });

                toast.present();

                this.startSearch();

            } else {
                // ошибка сервера

                // todo тост об ошибке сервера
                this.startSearch();
            }


            console.log('закрылось окно добавления участников группы');
        });

        modal.present();


        // let fullName = agent.first_name ? agent.first_name : agent.email;
        //
        // fullName += agent.last_name ? ' ' + agent.last_name : '';
        //
        // let confirmation = this.alertCtrl.create({
        //
        //     title: 'Add a member',
        //     subTitle: fullName,
        //     message: "Add <b>" + fullName + "</b> to your private group?",
        //
        //     inputs: [
        //         {
        //             name: 'revenue_share',
        //             placeholder: 'Revenue Share',
        //             type: 'number',
        //             max: 100,
        //             min: 1,
        //         },
        //     ],
        //
        //     buttons: [
        //         {
        //             text: 'Cancel',
        //             handler: data => {
        //
        //             }
        //         },
        //         {
        //             text: 'Add',
        //             handler: data => {
        //                 console.log('add member: ');
        //                 console.log(data);
        //
        //                 this.addAgent(agent);
        //             }
        //         }
        //     ]
        // });
        // confirmation.present();

    }


    /**
     * Добавить агента в группу
     *
     */
    addAgent(agent) {



        // console.log(statuses);
        let modal = this.modalCtrl.create(PrivateGroupAddMemberPage, {agent: agent});

        modal.onDidDismiss(data => {

            console.log('закрылось окно добавления участников группы');
        });

        modal.present();

        // console.log(agent);
        //
        //
        // console.log('add member');
        //
        // this.privateGroup.addMember(agent.id)
        //     .subscribe(data => {
        //
        //         let res = data.json();
        //
        //         console.log('добавление участника в группу');
        //         console.log(res);
        //
        //
        //     }, err => {
        //
        //         console.log('Error ' + err);
        //
        //     });

    }


    /**
     * Очистка поискового результата
     *
     */
    clearSearchResult() {

        // очищаем строку запроса
        this.keyword = '';

        // прячем контент
        this.searchContentKey = false;

        // если показанно окно поиска в шапку
        if (this.searchHeaderKey) {
            // наводим на него фокус
            this.headerInput.setFocus();
        }
    }


    /**
     * Закрытие модального окна
     *
     */
    close() {
        this.view.dismiss();
    }

}