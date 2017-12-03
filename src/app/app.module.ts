import {NgModule, ErrorHandler} from '@angular/core';
import {Http} from '@angular/http';
import {IonicApp, IonicModule, IonicErrorHandler} from 'ionic-angular';
import {Storage, IonicStorageModule} from '@ionic/storage';

// import { FCM } from '@ionic-native';

import {Push, PushObject, PushOptions} from "@ionic-native/push";
import { Badge } from '@ionic-native/badge';
import { File } from '@ionic-native/file';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
// import { FCM } from '@ionic-native/fcm';


import {MyApp} from './app.component';

import {CardsPage} from '../pages/cards/cards';
import {ContentPage} from '../pages/content/content';
import {LoginPage} from '../pages/login/login';
import {MapPage} from '../pages/map/map';
import {SignupPage} from '../pages/signup/signup';
import {TabsPage} from '../pages/tabs/tabs';
import {TutorialPage} from '../pages/tutorial/tutorial';
import {MainPopoverPage} from '../pages/main-popover/main-popover';


import {MainPage} from '../pages/main/main';

import {CreditsPage} from '../pages/credits/credits';
import {CreditReplenishmentPage} from '../pages/credit-replenishment/credit-replenishment';
import {CreditWithdrawalPage} from '../pages/credit-withdrawal/credit-withdrawal';
import {CreditCardPaymentPage} from '../pages/credit-card-payment/credit-card-payment';

import {AddLeadPage} from '../pages/add-lead/add-lead';

import {ObtainPage} from '../pages/obtain/obtain';
import {ObtainDetailPage} from "../pages/obtain-detail/obtain-detail";

import {DepositedPage} from '../pages/deposited/deposited';
import {OpenLeadStatusesDealPage} from '../pages/open-lead-statuses-deal/open-lead-statuses-deal';
import {DepositedDetailPage} from "../pages/deposited-detail/deposited-detail";

import {OpenPage} from '../pages/open/open';
import {OpenDetailPage} from '../pages/open-detail/open-detail'
import {OpenLeadDealPage} from '../pages/open-lead-deal/open-lead-deal'
import {DealPaymentWalletPage} from '../pages/deal-payment-wallet/deal-payment-wallet'
import {DealPaymentCardPage} from '../pages/deal-payment-card/deal-payment-card'
import {DealPaymentManuallyPage} from '../pages/deal-payment-manually/deal-payment-manually'

import {CustomersPage} from '../pages/customers/customers';
import {MasksPage} from '../pages/masks/masks';
import {EditMaskPage} from '../pages/edit-mask/edit-mask';

import {OpenLeadOrganizerEditPage} from '../pages/open-lead-organizer-edit/open-lead-organizer-edit';

import {StatisticsPage} from '../pages/statistics/statistics';

import {MessagesPage} from '../pages/messages/messages';
import {CorrespondencePage} from '../pages/correspondence/correspondence';
import {MessagesFilterPage} from '../pages/messages-filter/messages-filter';

import {OpenLeadStatusesPage} from '../pages/open-lead-statuses/open-lead-statuses';

import {OpenLeadOrganizerPage} from '../pages/open-lead-organizer/open-lead-organizer';
import {OrganizerPage} from '../pages/organizer/organizer';
import {AdvantagesPage} from '../pages/advantages/advantages';

import {SalesmenPage} from '../pages/salesmen/salesmen'
import {EditSalesmenPage} from '../pages/edit-salesmen/edit-salesmen'
import {RegistrationDataPage} from '../pages/registration-data/registration-data'
import {RegistrationDataSpheresPage} from '../pages/registration-data-spheres/registration-data-spheres'
import {RegistrationDataPersonalPage} from '../pages/registration-data-personal/registration-data-personal'
import {RegistrationDataOperatingModePage} from '../pages/registration-data-operation-mode/registration-data-operation-mode'
import {RegistrationDataSpecializationPage} from '../pages/registration-data-specialization/registration-data-specialization'
import {RegistrationDataRolePage} from '../pages/registration-data-role/registration-data-role'
import {EmailConfirmationPage} from '../pages/email-confirmation/email-confirmation'
import {LicensePage} from '../pages/license/license'
import {PasswordRecovery} from '../pages/password-recovery/password-recovery';

import {RegistrationWaitingConfirmation} from '../pages/registration-waiting-confirmation/registration-waiting-confirmation'
import {RegistrationDataRolePageDescription} from '../pages/registration-data-role-description/registration-data-role-description'

import {PrivateGroupPage} from '../pages/private-group/private-group'
import {PrivateGroupSearchMemberPage} from '../pages/private-group-search-members/private-group-search-members'
import {PrivateGroupAddMemberPage} from '../pages/private-group-add-member/private-group-add-member'

import {CreditCalculatorPage} from '../pages/credit-calculator/credit-calculator'

import {WelcomePage} from '../pages/welcome/welcome';
import {ListMasterPage} from '../pages/list-master/list-master';
import {ItemCreatePage} from '../pages/item-create/item-create';
import {ItemDetailPage} from '../pages/item-detail/item-detail';
import {MenuPage} from '../pages/menu/menu';
import {SettingsPage} from '../pages/settings/settings';
import {ProfilePage} from '../pages/profile/profile';
import {SearchPage} from '../pages/search/search';
import {SupportPage} from '../pages/support/support';

import {LeadStatusPage} from '../pages/lead-status/lead-status';

import {User} from '../providers/user';
import {Api} from '../providers/api';
import {Settings} from '../providers/settings';
import {Customer} from '../providers/customer';
import {Notification} from '../providers/notification';
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
    PasswordRecovery,

    MainPage,
    MainPopoverPage,

    CreditsPage,
    CreditReplenishmentPage,
    CreditWithdrawalPage,
    CreditCardPaymentPage,

    AddLeadPage,

    ObtainPage,
    ObtainDetailPage,

    DepositedPage,
    DepositedDetailPage,

    OpenPage,
    OpenDetailPage,
    OpenLeadStatusesDealPage,
    DealPaymentWalletPage,
    DealPaymentCardPage,
    DealPaymentManuallyPage,

    CustomersPage,
    MasksPage,
    EditMaskPage,

    ProfilePage,

    MessagesPage,
    CorrespondencePage,
    MessagesFilterPage,

    CreditCalculatorPage,

    OpenLeadOrganizerEditPage,

    RegistrationDataPage,
    RegistrationDataSpheresPage,
    RegistrationDataPersonalPage,
    RegistrationDataRolePage,
    RegistrationDataOperatingModePage,
    RegistrationDataSpecializationPage,
    EmailConfirmationPage,
    LicensePage,
    RegistrationWaitingConfirmation,
    RegistrationDataRolePageDescription,

    PrivateGroupPage,
    PrivateGroupSearchMemberPage,
    PrivateGroupAddMemberPage,
    LeadStatusPage,

    OpenLeadStatusesPage,
    OpenLeadDealPage,
    OrganizerPage,
    SupportPage,
    AdvantagesPage,

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
        Push,
        Badge,
        Notification,
        File,
        FileTransfer,
        FileTransferObject,
        // FCM,

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
