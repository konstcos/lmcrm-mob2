import {Component, ViewChild} from '@angular/core';
import {Platform, Nav, Config} from 'ionic-angular';
import {StatusBar} from 'ionic-native';

import {Settings} from '../providers/providers';

// import { FirstRunPage } from '../pages/pages';
// import { CardsPage } from '../pages/cards/cards';
// import { ContentPage } from '../pages/content/content';
import {LoginPage} from '../pages/login/login';
// import { MapPage } from '../pages/map/map';
// import { SignupPage } from '../pages/signup/signup';
// import { TabsPage } from '../pages/tabs/tabs';
// import { TutorialPage } from '../pages/tutorial/tutorial';
// import { WelcomePage } from '../pages/welcome/welcome';
// import { ListMasterPage } from '../pages/list-master/list-master';
// import { MenuPage } from '../pages/menu/menu';
// import { SettingsPage } from '../pages/settings/settings';
// import { SearchPage } from '../pages/search/search';

// import {MainPage} from '../pages/main/main';
//
// import {ObtainPage} from '../pages/obtain/obtain';
// import {DepositedPage} from '../pages/deposited/deposited';
// import {OpenPage} from '../pages/open/open';
//
//
// import {CustomersPage} from '../pages/customers/customers';


import {TranslateService} from 'ng2-translate/ng2-translate';

@Component({
    template: `<ion-nav #content [root]="rootPage" ></ion-nav>`
})
export class MyApp {
    // rootPage = FirstRunPage;
    rootPage = LoginPage;
    // rootPage = MainPage;
    //
    @ViewChild(Nav) nav: Nav;
    //
    // pages: any[] = [
    //   { title: 'Tutorial', component: TutorialPage },
    //   // { title: 'Welcome', component: WelcomePage },
    //   { title: 'Tabs', component: TabsPage },
    //   { title: 'Cards', component: CardsPage },
    //   { title: 'Content', component: ContentPage },
    //   { title: 'Login', component: LoginPage },
    //   { title: 'Signup', component: SignupPage },
    //   { title: 'Map', component: MapPage },
    //   { title: 'Master Detail', component: ListMasterPage },
    //   { title: 'Menu', component: MenuPage },
    //   { title: 'Settings', component: SettingsPage },
    //   { title: 'Search', component: SearchPage }
    // ]

    constructor(translate: TranslateService, platform: Platform, settings: Settings, config: Config) {
        // Set the default language for translation strings, and the current language.
        translate.setDefaultLang('en');
        translate.use('en');

        settings.load();

        translate.get(['BACK_BUTTON_TEXT']).subscribe(values => {
            config.set('ios', 'backButtonText', values.BACK_BUTTON_TEXT);
        });

        platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            StatusBar.styleDefault();
            // Splashscreen.hide();
        });
    }

}