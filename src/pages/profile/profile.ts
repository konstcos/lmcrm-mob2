import {Component} from '@angular/core';
import {
    NavController,
    NavParams,
    ViewController,
    ModalController,
    ToastController,
} from 'ionic-angular';


import {User} from '../../providers/user';
import {MainPage} from '../main/main'
import {ProfileEditMainDataPage} from "../profile_edit_main_data/profile_edit_main_data";
import {ProfileEditSpecializationsPage} from "../profile_edit_specializations/profile_edit_specializations";
import {ProfileEditLeadBuyerOperatingModePage} from "../profile_edit_lead_buyer_operating_mode/profile_edit_lead_buyer_operating_mode";
import {ProfileEditAboutPage} from "../profile_edit_about/profile_edit_about";
import {ProfileEditPasswordPage} from "../profile_edit_password/profile_edit_password";
import {ProfileEditPhonesPage} from "../profile_edit_phones/profile_edit_phones";
import {ProfileEditBankDataPage} from "../profile_edit_bank_data/profile_edit_bank_data";
import {ProfileEditRegionPage} from "../profile_edit_region/profile_edit_region";


/*
 Generated class for the OpenLeadOrganizer page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'profile-page',
    templateUrl: 'profile.html',
    providers: [User]
})
export class ProfilePage {

    /**
     * Переменная с данными пользователя
     *
     */
    public profileData = false;


    /**
     * Показывает загрузился контент, или нет
     *
     * нужно чтобы не всплывали лишние тосты по
     * onchange некоторых обций
     */
    public contentLoading = false;


    /**
     * Области с данными на странице
     *
     */
    public sections: any = {
        // область со спинером загрузки
        loading: true,
        // область с данными
        data: false,


        // подтверждение отправки лида на аукцион
        auction: false,
        // вывод ошибки
        error: false
    };


    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public view: ViewController,
                public modalController: ModalController,
                public toastController: ToastController,
                public user: User) {

        // загрузка основных данных профиля пользователя
        this.loadData();
    }


    ionViewDidLoad() {
        // console.log('ionViewDidLoad UstomersPage');
    }


    /**
     * Переключение областей на странице
     *
     * три области на странице:
     *     loading - область со спинером загрузки, показывается во время загрузки
     *     data - область с данными, показывается когда данные успешно загруженны
     */
    section(sectionName: any = false) {

        // закрываются все разделы
        this.closeAllSections();

        switch (sectionName) {

            case 'loading':
                // область со спинером загрузки
                this.sections.loading = true;
                break;

            case 'data':
                // область основных данных
                this.sections.data = true;
                break;

            case 'auction':
                // вывод ошибки
                this.sections.auction = true;
                break;

            case 'error':
                // вывод ошибки
                this.sections.error = true;
                break;

            default:
                // alert('wrong area name');
                break;
        }
    }


    /**
     * Закрывает все области
     *
     */
    closeAllSections() {
        // закрытие всех областей
        for (let section in this.sections) {
            // перебираем все области
            // закрываем их
            this.sections[section] = false;
        }
    }

    /**
     * Загрузка данных по профилю агента
     *
     */
    loadData(refresher: any = false) {

        // включаем секцию со спинером
        // (индикатором загрузки)
        if (!refresher) {
            this.section('loading');
        }

        // выставляем загрузку контента в false
        this.contentLoading = false;

        this.user.getAgentProfile()
            .subscribe(result => {
                    // при получении итемов

                    // переводим ответ в json
                    let data = result.json();

                    // обработка ответа
                    if (data.status == 'success') {
                        // ответ получе нормально

                        // добавляем переменную пароля
                        // (в данных с сервера он не приходит)
                        data.password = '';
                        data.password_confirmation = '';

                        // выравниваем массив с регионами
                        // (он, почему то, перевернутым приходит)
                        data.data.region.path.reverse();

                        this.profileData = data.data;

                        // выставляем загрузку контента в true
                        // по таймеру, для того, чтобы данные
                        // успели загрузится и прорисоваться
                        // ...иначе будет реакция на onchange
                        let self = this;
                        setTimeout(function () {
                            self.contentLoading = true;
                        }, 500);

                        // (индикатором загрузки)
                        this.section('data');

                        console.log(data.data);

                    } else {
                        // ошибка в ответе

                        // todo добавить блок с выводом ошибки

                    }

                    if (refresher) {
                        refresher.complete();
                    }

                }, err => {
                    // в случае ошибки

                    if (refresher) {
                        refresher.complete();
                    }

                    console.log('ERROR: ' + err);

                    // this.isLoading = false;

                    // todo выводится сообщение об ошибке (нету связи и т.д.)

                    // отключаем окно индикатора загрузки
                    // loading.dismiss();
                }
            );
    }


    /**
     * обновление контента
     *
     */
    refresh(refresher) {

        if (this.sections.loading) {
            return false;
        }

        this.loadData(refresher);
    }


    /**
     * Сохранение данных
     *
     */
    saveData() {

        // console.log(this.profileData);

        this.user.saveAgentProfile(this.profileData)
            .subscribe(result => {
                    // при получении итемов

                    // переводим ответ в json
                    let data = result.json();

                    // data.password = '';
                    // data.password_confirmation = '';

                    // this.profileData = data;

                    console.log(data);

                }, err => {
                    // в случае ошибки

                    console.log('ERROR: ' + err);

                    // this.isLoading = false;

                    // todo выводится сообщение об ошибке (нету связи и т.д.)

                    // отключаем окно индикатора загрузки
                    // loading.dismiss();
                }
            );
    }


    /**
     * Нажатие по полю названия переключателя
     * (переключается сам переключатель
     * соответствующий этому полю)
     *
     */
    toggleLabelClick(item) {

        // настройки хранятся в параметре settings (и в соответствующей таблице)
        // но, могут хранятися в разных местах
        // для этого и сделан такой выбор
        switch (item) {
            // доступ к профилю (хранится в agent_info)
            case 'allow_access_to_profile':
                this.profileData['allow_access_to_profile'] = !this.profileData['allow_access_to_profile'];
                break;

            // доступ в сеттингах
            default:
                this.profileData['settings'][item] = !this.profileData['settings'][item];
        }
    }


    /**
     * Сохранение настроек итема сеттингов
     *
     */
    saveSettingOption(settingOptionName, value) {


        this.user.saveSettingOption({setting_option_name: settingOptionName, value: value})
            .subscribe(result => {
                    // при получении итемов

                    // переводим ответ в json
                    let data = result.json();

                    // data.password = '';
                    // data.password_confirmation = '';

                    // this.profileData = data;

                    if (data.status === 'success') {

                        const toast = this.toastController.create({
                            message: 'option switched successfully',
                            duration: 3000
                        });
                        toast.present();

                    } else {

                        // todo вернуть переключатель на место

                        const toast = this.toastController.create({
                            message: 'option switched error',
                            duration: 3000
                        });
                        toast.present();
                    }


                    console.log(data);

                    return result;

                }, err => {
                    // в случае ошибки

                    // todo вернуть переключатель на место

                    const toast = this.toastController.create({
                        message: 'option switched error',
                        duration: 3000
                    });
                    toast.present();

                    console.log('ERROR: ' + err);

                    // this.isLoading = false;

                    // todo выводится сообщение об ошибке (нету связи и т.д.)

                    // отключаем окно индикатора загрузки
                    // loading.dismiss();
                }
            );

    }


    /**
     * Событие смены итема настройки
     *
     */
    settingsToggleChange(item) {

        if (!this.contentLoading) {
            return false;
        }

        // настройки хранятся в параметре settings (и в соответствующей таблице)
        // но, могут хранятися в разных местах
        // для этого и сделан такой выбор
        switch (item) {
            // доступ к профилю (хранится в agent_info)
            case 'allow_access_to_profile':
                this.saveSettingOption('allow_access_to_profile', this.profileData['allow_access_to_profile']);
                break;

            // доступ в сеттингах
            default:
                this.saveSettingOption(item, this.profileData['settings'][item]);
        }


    }


    /**
     * Редактирование основных данных агента
     * todo
     */
    editMainData() {
        // console.log(statuses);
        let modal = this.modalController.create(ProfileEditMainDataPage, {data: this.profileData});

        // события по закрытию модального окна
        modal.onDidDismiss(data => {

            // данные были сохраненны успешно
            if(data.state === 'data_saved') {
                this.profileData['main'].first_name = data.data.first_name;
                this.profileData['main'].last_name = data.data.last_name;
                this.profileData['main'].company = data.data.company;
                this.profileData['main'].passport = data.data.passport;
            }

            // обновление данных на родительской странице
            if(data.state === 'refresh') {
                this.loadData();
            }

            console.log('данные по редактированию главных данных');
            console.log(data);

        });

        modal.present();
    }


    /**
     * Редактирование специализаций
     * todo
     */
    editSpecializations() {
        // console.log(statuses);
        let modal = this.modalController.create(ProfileEditSpecializationsPage, {item: 1});


        modal.onDidDismiss(data => {

            console.log('данные по статусу');
            console.log(data);

        });

        modal.present();
    }


    /**
     * Редактирование специализаций
     * todo
     */
    editLeadBuyerOperatingMode() {
        // console.log(statuses);
        let modal = this.modalController.create(ProfileEditLeadBuyerOperatingModePage, {item: 1});


        modal.onDidDismiss(data => {

            console.log('данные по статусу');
            console.log(data);

        });

        modal.present();
    }


    /**
     * Редактирование данных о пользователе (о себе)
     * todo
     */
    editAbout() {
        // console.log(statuses);
        let modal = this.modalController.create(ProfileEditAboutPage, {item: 1});


        modal.onDidDismiss(data => {

            console.log('данные по статусу');
            console.log(data);

        });

        modal.present();
    }


    /**
     * Смена пароля
     * todo
     */
    editPassword() {
        // console.log(statuses);
        let modal = this.modalController.create(ProfileEditPasswordPage, {item: 1});


        modal.onDidDismiss(data => {

            console.log('данные по статусу');
            console.log(data);

        });

        modal.present();
    }


    /**
     * Редактирование телефона
     * todo
     */
    editPhones() {
        // console.log(statuses);
        let modal = this.modalController.create(ProfileEditPhonesPage, {item: 1});


        modal.onDidDismiss(data => {

            console.log('данные по статусу');
            console.log(data);

        });

        modal.present();
    }


    /**
     * Редактирование банковских данных
     * todo
     */
    editBankData() {
        // console.log(statuses);
        let modal = this.modalController.create(ProfileEditBankDataPage, {item: 1});


        modal.onDidDismiss(data => {

            console.log('данные по статусу');
            console.log(data);

        });

        modal.present();
    }


    /**
     * Редактирование региона
     * todo
     */
    editRegion() {
        // console.log(statuses);
        let modal = this.modalController.create(ProfileEditRegionPage, {item: 1});


        modal.onDidDismiss(data => {

            console.log('данные по статусу');
            console.log(data);

        });

        modal.present();
    }


    /**
     * Возврат на главную страницу
     *
     */
    goToMainPage() {

        this.navCtrl.setRoot(MainPage);
    }


}