import {Component} from '@angular/core';
import
{
    NavController,
    NavParams,
    ViewController,
    Events
} from 'ionic-angular';


import {User} from '../../providers/user';


/*
 Generated class for the Open page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'page-advantages',
    templateUrl: 'advantages.html'
})
export class AdvantagesPage {


    /**
     * Массив с итемами на странице
     *
     */
    items: any = [

        {
            title: 'ADVANTAGES.1.TITLE',
            description: 'ADVANTAGES.1.DESCRIPTION',
            isOpen: false,
        },

        {
            title: 'ADVANTAGES.2.TITLE',
            description: 'ADVANTAGES.2.DESCRIPTION',
            isOpen: false,
        },

        {
            title: 'ADVANTAGES.3.TITLE',
            description: 'ADVANTAGES.3.DESCRIPTION',
            isOpen: false,
        },

        {
            title: 'ADVANTAGES.4.TITLE',
            description: 'ADVANTAGES.4.DESCRIPTION',
            isOpen: false,
        },

        {
            title: 'ADVANTAGES.5.TITLE',
            description: 'ADVANTAGES.5.DESCRIPTION',
            isOpen: false,
        }

    ];


    /**
     * Индикатор загрузки
     *
     */
    public isLoading: boolean = true;


    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public view: ViewController,
                public user: User,
                public events: Events) {

    }

    ionViewDidLoad() {

    }

    ionViewWillEnter() {

    }


    /**
     * Открыть/закрыть подробное описание возможности
     *
     */
    switchDescription(item) {
        item.isOpen = !item.isOpen;
    }


    /**
     * Закрытие окна
     *
     */
    close() {
        this.view.dismiss();
    }



    /**
     * Событие по кнопке возврата
     *
     */
    backButtonAction(){
        this.close();
    }
}