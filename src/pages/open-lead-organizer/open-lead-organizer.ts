import {Component} from '@angular/core';
import {NavController, NavParams, ViewController, ActionSheetController} from 'ionic-angular';

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

    public items: any;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public view: ViewController,
                public actionSheetCtrl: ActionSheetController) {


        let data = this.navParams.get('items');

        this.items = data.organizer;

        console.log(this.items);

    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad OpenLeadOrganizerPage');
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
                },{
                    text: 'Comment',
                    icon: 'ios-paper-outline',
                    handler: () => {
                        console.log('Archive clicked');
                    }
                },{
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


    close() {
        this.view.dismiss();
    }

}
