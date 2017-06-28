import {Component} from '@angular/core';
import {NavController, NavParams, ViewController, ModalController} from 'ionic-angular';
import {OpenLeadStatusesPage} from "../open-lead-statuses/open-lead-statuses";


/*
 Generated class for the OpenDetail page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'page-open-detail',
    templateUrl: 'open-detail.html'
})
export class OpenDetailPage {

    item: any;

    constructor(public navCtrl: NavController,
                public view: ViewController,
                public navParams: NavParams,
                public modalCtrl: ModalController) {

        this.item = navParams.get('item')
        // console.log(this.item);
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad OpenDetailPage');
    }

    changeStatus(item) {
        // this.navCtrl.push(OpenLeadStatusesPage);

        console.log('итем: ');
        console.log(item);

        let modal = this.modalCtrl.create(OpenLeadStatusesPage, { item: item });

        modal.onDidDismiss(data => {



            if(data.status) {
                item.status_info = data.status;
                item.status = data.status.id;

                for (let type in this.item.statuses) {

                    for (let stat of this.item.statuses[type]) {

                        if (stat.id == data.status.id) {

                            stat.checked = false;
                            stat.lock = true;

                        } else {

                            stat.checked = false;
                        }

                    }
                }
            }



            console.log(item);
            console.log(data);
        });

        modal.present();
    }

    close() {
        this.view.dismiss();
    }

}
