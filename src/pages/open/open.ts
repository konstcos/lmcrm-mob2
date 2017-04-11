import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';

import {User} from '../../providers/user';
import {Settings} from '../../providers/settings';
import { Storage } from '@ionic/storage';

/*
 Generated class for the Open page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'page-open',
    templateUrl: 'open.html'
})
export class OpenPage {

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public user: User,
        public settings: Settings,
        public storage: Storage) {



        // settings.load()

        // console.log('settings:');
        // console.log( settings.load() );
        // settings.load().then(data=>{
        //     console.log('settings:');
        //     console.log(data)
        // });

        storage.ready().then(() => {

            console.log('сторедж');
            console.log( storage.driver );

            // storage.set('name', 'Max');
            // storage.set('aaa', 'ddd');


            storage.keys().then(data=>{
                console.log('сторедж:');
                console.log(data);
            });

            storage.get('name').then((val) => {
                console.log('get name');
                console.log(val);
            });

            // settings.allSettings().then(data=>{
            //     console.log('settings:');
            //     console.log(data)
            // });

            // setValue
            // settings.setValue('swer', '678');
            console.log('получилось:');
            console.log( settings.settings );

            // settings.settings['swer'] = '11111111';

            // storage.keys(data=>{
            //     console.log(data);
            // });

            // aaa.subscribe(data=>{
            //     console.log(data);
            // });

            // set a key/value
            // storage.set('name', 'Max');

            // Or to get a key/value pair
            // storage.get('age').then((val) => {
            //     console.log('Your age is', val);
            // })
        });

    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad OpenPage');
        console.log( this.settings.settings );
    }


    ionViewWillEnter() {
        console.log('OpenPage View');
        console.log( this.settings.settings );
        // console.log( this.user.token );

        // this.settings.setValue('aaa', 'ssss');

        // console.log( this.settings.load() );

    }

}
