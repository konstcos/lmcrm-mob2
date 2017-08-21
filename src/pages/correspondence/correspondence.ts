import {Component, ViewChild} from '@angular/core';
import {
    NavController,
    LoadingController,
    MenuController,
    ModalController,
    Content,
    ViewController,
    NavParams
} from 'ionic-angular';

import {TranslateService} from 'ng2-translate/ng2-translate';

import {LoginPage} from '../login/login'
import {MainPage} from '../main/main'
import {OpenLeadOrganizerPage} from '../open-lead-organizer/open-lead-organizer'

import {MessagesFilterPage} from '../messages-filter/messages-filter'

import {User} from '../../providers/user';
import {Notification} from '../../providers/notification';
import {menuManager} from "../../providers/menuManager";

/*
 Generated class for the Signup page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'correspondence',
    templateUrl: 'correspondence.html',
    providers: [menuManager]
})
export class CorrespondencePage {

    @ViewChild(Content) content: Content;


    /**
     * Данные переписки
     *
     */
    public correspondence: any = false;


    /**
     * id переписки
     *
     */
    public messageSubjectId: any = false;


    /**
     * id открытого лида
     *
     */
    public openLeadId: any = false;


    /**
     * Вводимое сообщение
     *
     */
    public messageInput: string = '';

    constructor(public navCtrl: NavController,
                public user: User,
                public notification: Notification,
                public navParams: NavParams,
                public loadingCtrl: LoadingController,
                public translateService: TranslateService,
                public menuCtrl: MenuController,
                public view: ViewController,
                public modalCtrl: ModalController) {

        // получение id переписки
        let messageSubject = navParams.get('messageSubjectId');
        let openLeadId = navParams.get('openLeadId');

        console.log('Данные переписки: ');
        console.log(messageSubject);

        // проверка наличия id переписки
        if (messageSubject) {

            // сохранение id переписки в моделе
            this.messageSubjectId = messageSubject.id;

            // console.log('id переписки:');
            // console.log(this.messageSubjectId);

            this.get();

        } else if (openLeadId) {

            this.openLeadId = openLeadId;

            this.get();

        } else {

            // todo ошибка при получении id переписки
        }

    }


    /**
     * Получение данных по переписке
     *
     */
    get() {

        // получаем количество уже загруженных итемов
        // let offset = this.messages.length;

        // console.log('Отправка данных по сделке:');
        // console.log(this.messageSubjectId);
        // console.log(this.openLeadId);

        // возвращает promise с итемами
        return this.notification.getCorrespondence({messageId: this.messageSubjectId, openLeadId: this.openLeadId})
        // подписываемся на результат
            .subscribe(result => {

                // преобразование результата в json
                let res = result.json();

                if(res.status == 'success'){

                    this.correspondence = res.сorrespondence;

                    console.log(this.correspondence);

                    setTimeout(() => {
                        this.content.scrollToBottom(300);
                    }, 100);


                    if(res.сorrespondence.length != 0){
                        this.messageSubjectId = res.сorrespondence[0].message_subject_id;
                    }
                }




            }, err => {

                // todo если спинер включен - включить

                console.log('Error ' + err);
            });
    }


    /**
     * Отправка сообщения
     *
     */
    sendMessage() {

        // возвращает promise с итемами
        return this.notification.sendMessage({messageId: this.messageSubjectId, messageText: this.messageInput, openLeadId: this.openLeadId})
        // подписываемся на результат
            .subscribe(result => {

                // преобразование результата в json
                let res = result.json();

                if (res.status == 'success') {

                    this.correspondence.push(res.message);

                    setTimeout(() => {
                        this.content.scrollToBottom(300);
                    }, 100);
                }

                this.messageInput = '';

                console.log(res);

            }, err => {

                // todo если спинер включен - включить

                console.log('Error ' + err);
            });

        // console.log(this.messageInput);
    }


    /**
     * Обновление сообщений на странице
     *
     */
    messagesReload() {

        this.correspondence = [];
        this.get();
    }


    /**
     * Закрытие страницы
     *
     */
    close() {

        this.view.dismiss();
    }

}

