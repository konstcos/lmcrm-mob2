import {Component} from '@angular/core';
import {ViewController, Events} from 'ionic-angular';


@Component({
    selector: 'page-main-popover',
    templateUrl: 'main-popover.html'
})
export class MainPopoverPage {


    /**
     * Конструктор класса
     *
     */
    constructor(public viewCtrl: ViewController,
                public events: Events) {


    }


    /**
     * Отметить все входящие как просмотренные
     *
     */
    markAllIncomingAsViewed(){
        this.viewCtrl.dismiss({action: 'markAllIncomingAsViewed'});
    }



    /**
     * Закрытие окна
     *
     */
    close() {
        this.viewCtrl.dismiss({action: 'none'});
    }

}