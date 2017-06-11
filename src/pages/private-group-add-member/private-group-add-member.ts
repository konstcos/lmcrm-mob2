import {Component, ViewChild} from '@angular/core';
import {NavController, NavParams, ViewController, Content, LoadingController} from 'ionic-angular';

import {PrivateGroupPage} from '../private-group/private-group'

import {PrivateGroup} from '../../providers/private-group';


/*
 Generated class for the Ustomers page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'private-group-add-member',
    providers: [PrivateGroup],
    templateUrl: 'private-group-add-member.html'
})
export class PrivateGroupAddMemberPage {

    @ViewChild(Content) content: Content;


    /**
     * Доля агента от сделки
     *
     */
    public revenueShare: number = 0;


    /**
     * Агенты, найденные по запросу
     *
     */
    public agent: any = false;


    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public view: ViewController,
                public privateGroup: PrivateGroup,
                public loadingCtrl: LoadingController) {


        this.agent = this.navParams.get('agent');

        // console.log(this.agent);

        console.log('страница добавление участника в приватную группу');
    }


    ionViewDidLoad() {
        // console.log('ionViewDidLoad UstomersPage');
    }


    ionViewWillEnter() {
        // console.log('ionViewDidLoad UstomersPage');
    }


    /**
     * Добавить агента в группу
     *
     */
    addAgent() {

        if ( this.revenueShare == 0 || this.revenueShare > 100 ) {
            return false;
        }

        let loading = this.loadingCtrl.create({
            content: 'Please wait...'
        });

        loading.present();


        this.privateGroup.addMember(this.agent.id, this.revenueShare)
            .subscribe(data => {

                // console.log('получение участников');

                let res = data.json();

                console.log(res);

                loading.dismiss();

                if (res.status == 'success') {

                    this.view.dismiss({status: 'success', info: 'agent_added', agent: this.agent});

                } else {

                    this.view.dismiss({status: 'fail', info: 'agent_not_added', agent: this.agent});
                }


            }, err => {

                console.log('Error ' + err);
                this.view.dismiss({status: 'fail', info: 'server_error'});
                loading.dismiss();
            });
    }


    /**
     * Закрытие модального окна
     *
     */
    close() {
        this.view.dismiss({status: 'fail', info: 'close'});
    }

}