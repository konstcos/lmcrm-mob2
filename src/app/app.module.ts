import {NgModule, ErrorHandler} from '@angular/core';
import {Http} from '@angular/http';
import {IonicApp, IonicModule, IonicErrorHandler} from 'ionic-angular';
import {Storage, IonicStorageModule} from '@ionic/storage';

import {MyApp} from './app.component';

import {CardsPage} from '../pages/cards/cards';
import {ContentPage} from '../pages/content/content';
import {LoginPage} from '../pages/login/login';
import {MapPage} from '../pages/map/map';
import {SignupPage} from '../pages/signup/signup';
import {TabsPage} from '../pages/tabs/tabs';
import {TutorialPage} from '../pages/tutorial/tutorial';


import {MainPage} from '../pages/main/main';

import {AddLeadPage} from '../pages/add-lead/add-lead';

import {ObtainPage} from '../pages/obtain/obtain';
import {ObtainDetailPage} from "../pages/obtain-detail/obtain-detail";

import {DepositedPage} from '../pages/deposited/deposited';
import {DepositedDetailPage} from "../pages/deposited-detail/deposited-detail";

import {OpenPage} from '../pages/open/open';
import {OpenDetailPage} from '../pages/open-detail/open-detail'

import {CustomersPage} from '../pages/customers/customers';
import {MasksPage} from '../pages/masks/masks';
import {EditMaskPage} from '../pages/edit-mask/edit-mask';

import {StatisticsPage} from '../pages/statistics/statistics';

import {OpenLeadStatusesPage} from '../pages/open-lead-statuses/open-lead-statuses';

import {OpenLeadOrganizerPage} from '../pages/open-lead-organizer/open-lead-organizer';

import {SalesmenPage} from '../pages/salesmen/salesmen'
import {EditSalesmenPage} from '../pages/edit-salesmen/edit-salesmen'


import {WelcomePage} from '../pages/welcome/welcome';
import {ListMasterPage} from '../pages/list-master/list-master';
import {ItemCreatePage} from '../pages/item-create/item-create';
import {ItemDetailPage} from '../pages/item-detail/item-detail';
import {MenuPage} from '../pages/menu/menu';
import {SettingsPage} from '../pages/settings/settings';
import {SearchPage} from '../pages/search/search';

import {User} from '../providers/user';
import {Api} from '../providers/api';
import {Settings} from '../providers/settings';
import {Customer} from '../providers/customer';
import {OpenLeadOrganizer} from '../providers/open-lead-organizer';
import {Items} from '../mocks/providers/items';

import {TranslateModule, TranslateLoader, TranslateStaticLoader} from 'ng2-translate/ng2-translate';

import {Obtain} from "../providers/obtain";
import {Deposited} from "../providers/deposited";
import {Open} from "../providers/open";


// The translate loader needs to know where to load i18n files
// in Ionic's static asset pipeline.
export function createTranslateLoader(http: Http) {
    return new TranslateStaticLoader(http, './assets/i18n', '.json');
}

export function provideSettings(storage: Storage) {
    /**
     * The Settings provider takes a set of default settings for your app.
     *
     * You can add new settings options at any time. Once the settings are saved,
     * these values will not overwrite the saved values (this can be done manually if desired).
     */

    // очистка стореджа
    // storage.clear();

    return new Settings(storage, {

        // линки приложения
        url: {
            // базовый путь (домен и базовый path)
            base: 'http://lmcrm.cos/api',
            // рабочие роуты
            path: {

                // авторизация
                auth: {
                    login: 'login', // залогинивание
                },

                // лиды по аукциону
                obtain: {
                    get: 'get' // получение лидов агента с аукциона
                }

            }
        },
    });
}


/**
 * The Pages array lists all of the pages we want to use in our app.
 * We then take these pages and inject them into our NgModule so Angular
 * can find them. As you add and remove pages, make sure to keep this list up to date.
 */
let pages = [
    MyApp,
    CardsPage,
    ContentPage,
    LoginPage,
    MapPage,
    SignupPage,
    TabsPage,
    TutorialPage,
    WelcomePage,
    ListMasterPage,
    ItemDetailPage,
    ItemCreatePage,
    MenuPage,
    SettingsPage,
    SearchPage,

    MainPage,

    AddLeadPage,

    ObtainPage,
    ObtainDetailPage,

    DepositedPage,
    DepositedDetailPage,

    OpenPage,
    OpenDetailPage,

    CustomersPage,
    MasksPage,
    EditMaskPage,

    OpenLeadStatusesPage,

    OpenLeadOrganizerPage,

    SalesmenPage,
    EditSalesmenPage,
    StatisticsPage
];

export function declarations() {
    return pages;
}

export function entryComponents() {
    return pages;
}

export function providers() {
    return [
        User,
        Api,
        Items,
        Obtain,
        Deposited,
        Open,
        Customer,
        OpenLeadOrganizer,

        {provide: Settings, useFactory: provideSettings, deps: [Storage]},
        // Keep this to enable Ionic's runtime error handling during development
        {provide: ErrorHandler, useClass: IonicErrorHandler}
    ];
}

@NgModule({
    declarations: declarations(),
    imports: [
        IonicModule.forRoot(MyApp, {
            // tabsPlacement: "top"
        }),


        IonicStorageModule.forRoot(),
        TranslateModule.forRoot({
            provide: TranslateLoader,
            useFactory: (createTranslateLoader),
            deps: [Http]
        })
    ],
    bootstrap: [IonicApp],
    entryComponents: entryComponents(),
    providers: providers()
})
export class AppModule {
}
