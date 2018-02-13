import {Component} from '@angular/core';
import {NavController, NavParams, ViewController, AlertController, ModalController} from 'ionic-angular';
import {TranslateService} from 'ng2-translate/ng2-translate';
import {OpenLeadStatusesPage} from "../open-lead-statuses/open-lead-statuses";
import {OpenDetailPage} from '../open-detail/open-detail'


import {Obtain} from '../../providers/obtain';

/*
 Generated class for the ObtainDetail page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'page-obtain-detail',
    templateUrl: 'obtain-detail.html'
})
export class ObtainDetailPage {


    /**
     * Данные итема
     *
     */
    public item: any = false;


    /**
     * id итема аукциона
     *
     */
    public itemId: any = false;


    /**
     * Нормальный/не нормальных id итема
     *
     */
    public isItemIdValid: boolean = false;


    /**
     * Области с данными на странице
     *
     */
    public area: any = {
        // область со спинером загрузки
        spinnerLoading: true,
        // область основных данных
        mainData: false,
        // область открытия лида
        openLead: false,
        // область ошибки по открытию лида
        errorOpenLead: false,
        // область подтверждения овердрафта
        overdraftConfirmation: false,
        // вывод ошибки
        error: false
    };


    /**
     * Доступность кнопки открытия лида
     *
     */
    public openButtonRights: boolean = true;


    /**
     * Прятать/показывать кнопку открытия лида
     * (футер в целом)
     *
     */
    public openButtonShow: boolean = true;


    /**
     * Возможность открытия лида
     * (относится только к лидбайеру)
     *
     * у лидбайера есть возможность
     * открыть лида двумя способами
     * (полностью или только один раз)
     * от сюда следует три варианта:
     *
     *     selective
     *         выборочно, когда лидбайер может выбирать
     *         как именно он хочет открыть лид
     *
     *     single
     *         только один раз, в случае если это лид
     *         уже был открыт другим агентом
     *
     *     exclusively
     *         эксклюзивно, полностью выкупить лид
     *         в случае когда агент у агента уже открыт
     *         этот лид, а другие агенты еще его не
     *         открыли, у агента еще есть возможность
     *         выкупить этот лид эксклюзивно
     *
     */
    public possibilityOpening: any = {
        selective: false,
        single: false,
        exclusively: false
    };


    /**
     * Вариант открытия лида лидбайером
     *
     */
    public openVariant: any = {
        single: true,
        exclusively: false
    };


    /**
     * Выбранный вариант открытия лида
     *
     */
    public openVariantSelected: string = 'One';


    /**
     * Овердрафт
     *
     * параметр, открывать лид с овердрафтом
     * или выдать уточнения по нему
     */
    public overdraft: boolean = false;


    /**
     * Данные по ошибке по открытию лида
     *
     * в эту переменную записывается
     * ошибка по открытию лида
     *
     */
    public openErrorData: string = '';

    /**
     * Роли пользователя
     *
     */
    public roles: any = {
        role: 'any',
        subRole: 'any',
    };

    constructor(public navCtrl: NavController,
                public view: ViewController,
                public obtain: Obtain,
                public navParams: NavParams,
                public modalCtrl: ModalController,
                public alertCtrl: AlertController,
                public translate: TranslateService) {

        // получение id итема
        this.itemId = navParams.get('itemId');

        // проверка id итема на правильность
        this.itemIdValidate();

        // получение данных по аукциону
        this.getDetail();


        // this.item = navParams.get('item');

        // this.roles = navParams.get('roles');

        // console.log(this.itemId);
        // console.log(this.item);
    }

    ionViewDidLoad() {
        // console.log('ionViewDidLoad ObtainDetailPage');
    }


    /**
     * Переключение областей на странице
     *
     * три области на странице:
     *     loading - область со спинером загрузки, показывается во время загрузки
     *     data - область с данными, показывается когда данные успешно загруженны
     *     openLead - меню/подтверждение на открытие лида
     *     errorOpen - область с ошибкой по открытию лиди
     *     overdraftConfirmation - область подтверждение овердрафта
     *     error - область с ошибками, появляется во время ошибки загрузки
     */
    areaSwitch(areaName: any = false) {

        // закрываются все разделы
        this.closeAllAreas();

        // показываем кнопку открытия лида в футере
        this.openButtonShow = true;

        switch (areaName) {

            case 'loading':
                // область со спинером загрузки
                this.area.spinnerLoading = true;
                break;

            case 'data':
                // область основных данных
                this.area.mainData = true;
                // кнопка открытия
                this.openButtonRights = true;
                break;

            case 'openLead':
                // область основных данных
                this.area.openLead = true;
                // прячем кнопку открытия лида в футере
                this.openButtonShow = false;
                break;

            case 'errorOpen':
                // область ошибки по открытию лида
                this.area.errorOpenLead = true;
                // прячем кнопку открытия лида в футере
                this.openButtonShow = false;
                break;

            case 'overdraftConfirmation':
                // область ошибки по открытию лида
                this.area.overdraftConfirmation = true;
                // прячем кнопку открытия лида в футере
                this.openButtonShow = false;
                break;


            case 'error':
                // вывод ошибки
                this.area.error = true;
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
    closeAllAreas() {
        // выключаем кнопку открытия
        this.openButtonRights = false;
        // закрытие всех областей
        for (let area in this.area) {
            // перебираем все области
            // закрываем их
            this.area[area] = false;
        }
    }


    /**
     * Отключение/включение индикатора загрузки
     *
     */
    load(switcher = 'on') {
        // алгоритм по заданному параметру
        switch (switcher) {
            // перебираются возможные данные switch
            case 'on':
                // если 'on'
                // закрываются все разделы
                this.closeAllAreas();
                // открывается спинер
                this.area.spinnerLoading = true;
                break;

            case 'off':
                this.area.spinnerLoading = false;
                break;

            default:
                this.area.spinnerLoading = false;
                break;

        }

    }


    /**
     * Установка возможности открытия лида
     * лидбайером
     *
     * сколько раз он может его открыть
     *
     */
    setPossibilityOpening() {

        if(this.roles.subRole != 'leadbayer') return false;

        // если итема нет
        if(!this.item) return false;

        // заводим все в исходное состояние (на всякий случа)
        this.possibilityOpening.selective = false;
        this.possibilityOpening.single = false;
        this.possibilityOpening.exclusively = false;

        // выбор способа открытия лида лидбайером
        if(this.item.openLead == 'false' &&  this.item.openLeadOther == 'false') {
            // агент может выбирать любой из способов открытия
            this.possibilityOpening.selective = true;

        } else if(this.item.openLead == 'false' &&  this.item.openLeadOther == 'true') {
            // может открыть только один раз
            this.possibilityOpening.single = true;
            // выставляем варианты
            this.openVariant.exclusively = false;
            this.openVariant.single = true;


        } else if(this.item.openLead == 'true' &&  this.item.openLeadOther == 'false') {
            // может открыть только эксклюзивно
            this.possibilityOpening.exclusively = true;
            // выставляем варианты
            this.openVariant.exclusively = true;
            this.openVariant.single = false;

        } else {


        }

        // в зависимости от выбранного варианта выставляем выборную переменную
        this.openVariantSelected = this.openVariant.single ? 'One' : 'All';
    }


    /**
     * Проверка id итема
     *
     */
    itemIdValidate() {

        // итема нет
        if (!this.itemId) {
            this.isItemIdValid = false;
        }

        // итем равняется нулю или итем меньше нуля
        if (this.itemId == 0 || this.itemId < 0) {
            this.isItemIdValid = false;
        }

        this.isItemIdValid = true;
    }


    /**
     * Переключение варианта открытия
     *
     */
    switchOpenVariant() {
        // меняет местами варианты
        this.openVariant.exclusively = !this.openVariant.exclusively;
        this.openVariant.single = !this.openVariant.single;

        // в зависимости от выбранного варианта выставляем выборную переменную
        this.openVariantSelected = this.openVariant.single ? 'One' : 'All';
    }


    /**
     * Получение подробностей по полученным лидам
     *
     */
    getDetail() {

        // если id итема не валидный
        if (!this.isItemIdValid) {
            this.areaSwitch('error');
        }

        this.areaSwitch('loading');

        // помечаем итем что он уже просмотрен
        this.obtain.getItemDetail(this.itemId)
        // обработка ответа
            .subscribe(result => {
                // при получении ответа

                // переводим ответ в json
                let data = result.json();

                console.log('данные по итему аукциона');
                console.log(data);

                if (data.status == 'success') {

                    this.item = data.item;

                    this.roles.role = data.roles.role;
                    this.roles.subRole = data.roles.subRole;

                    // выставляем возможности лидбайера
                    this.setPossibilityOpening();

                    this.areaSwitch('data');

                } else {

                    this.areaSwitch('error');
                }

            }, err => {
                // в случае ошибки

                this.areaSwitch('error');

                console.log('ERROR: ' + err);
            });

    }


    /**
     * Кнопка оновления страницы
     *
     */
    refresh() {
        this.getDetail();
    }


    /**
     * Информация о дате
     *
     */
    dateInfo() {
        let alert = this.alertCtrl.create({

            subTitle: `
                    <div class="alert_title">added to system</div>
                    <div class="alert_content">When the Lead was processed and added to the system</div>
                
                    <div class="alert_title">added to you auction</div>
                    <div class="alert_content">When the Lead was added to you auction</div>
                `,
            buttons: ['OK']
        });
        alert.present();
    }


    /**
     * Закрыть область открытия данных лида
     */
    closeOpenArea() {
        this.areaSwitch('data');
    }


    /**
     * Открыть область с данными
     */
    openDataArea() {
        this.areaSwitch('data');
    }


    /**
     * Подтверждение открытия лида
     *
     */
    confirmOpen(item) {

        // открывает область открытия лида
        this.areaSwitch('openLead');

        // todo проверить что все работает и удалить все от сюда
        let switchPull = true;
        if (switchPull) return false;

        let text = {
            "title": "Open Lead",
            "open_all": "Open All",
            "open_one": "Open One",
            "cancel_button": "Cancel",
            "ok_button": "OK"
        };

        this.translate.get('incoming_detail.open_lead_confirmation', {}).subscribe((res: any) => {

            console.log('перевод');
            console.log(res);

            text['title'] = res['title'];
            text['open_all'] = res['open_all'];
            text['open_one'] = res['open_one'];
            text['cancel_button'] = res['button_cancel'];
            text['ok_button'] = res['button_confirmation'];
        });


        if (item.openLead == "true" && item.openLeadOther == "true") {
            this.close();
        }

        console.log(this.roles);

        let alert = this.alertCtrl.create();
        alert.setTitle(text['title']);

        if (item.openLead == "false" && this.roles.subRole == 'leadbayer') {
            alert.addInput({
                type: 'radio',
                label: text['open_one'],
                value: 'One',
                checked: true
            });
        }

        if (item.openLeadOther == "false" && this.roles.subRole == 'leadbayer') {
            alert.addInput({
                type: 'radio',
                label: text['open_all'],
                value: 'All',
                checked: item.openLead == "true"
            });
        }


        alert.setCssClass('obtain_detail_alert_confirm');

        alert.addButton(text['cancel_button'],);
        alert.addButton({
            text: text['ok_button'],
            handler: data => {

                // console.log(data);

                this.openLead(item.id, item.mask.maskId, data);
            }
        });
        alert.present();
    }


    /**
     * Открытие лида
     *
     */
    makeLeadOpen() {

        // показываем индикатор загрузки
        this.areaSwitch('loading');

        // открываем лид
        this.obtain.openLead({lead_id: this.item.id, mask_id: this.item.mask.maskId, amount: this.openVariantSelected, overdraft: this.overdraft})
            .subscribe(result => {
                // обработка результата открытия лида

                // переводим ответ в json
                let data = result.json();

                console.log(data);

                // обработка результата
                if (data.status == 'true') {
                    // если лид нормлаьно открылся

                    // открытие модального окна с данными по открытому лиду
                    this.openLeadData(data.openLead.id);

                } else {
                    // если лид не открылся

                    // проверка причин
                    if(data.info == 'overdraftConfirmation') {
                        // запрос на подтерждение овердрафта

                        // открываем область с подтверждением овердрафта
                        this.areaSwitch('overdraftConfirmation');

                    } else {
                        // другая ошибка

                        // сохраняем ошибку в моделе
                        this.openErrorData = data.data;
                        // показываем область с ошибкой
                        this.areaSwitch('errorOpen');
                    }



                }

            }, err => {
                // в случае ошибки

                console.log('ERROR: ' + err);

                // показываем страницу с ошибкой
                this.areaSwitch('error');
            });

    }


    /**
     * Подтвердить овердрафт и открыть лид
     *
     */
    confirmOverdraftAndMakeLeadOpen() {

        // подтверждаем овердрафт
        this.overdraft = true;

        // показываем индикатор загрузки
        this.areaSwitch('loading');

        // открываем лид
        this.obtain.openLead({lead_id: this.item.id, mask_id: this.item.mask.maskId, amount: this.openVariantSelected, overdraft: this.overdraft})
            .subscribe(result => {
                // обработка результата открытия лида

                // переводим ответ в json
                let data = result.json();

                console.log(data);

                // обработка результата
                if (data.status == 'true') {
                    // если лид нормлаьно открылся

                    // открытие модального окна с данными по открытому лиду
                    this.openLeadData(data.openLead.id);

                } else {
                    // если лид не открылся

                    // проверка причин
                    if(data.info == 'overdraftConfirmation') {
                        // запрос на подтерждение овердрафта

                        // открываем область с подтверждением овердрафта
                        this.areaSwitch('overdraftConfirmation');

                    } else {
                        // другая ошибка

                        // сохраняем ошибку в моделе
                        this.openErrorData = data.data;
                        // показываем область с ошибкой
                        this.areaSwitch('errorOpen');
                    }

                }

            }, err => {
                // в случае ошибки

                console.log('ERROR: ' + err);

                // показываем страницу с ошибкой
                this.areaSwitch('error');

                // отключаем окно индикатора загрузки
                // infiniteScroll.complete();
            });
    }


    /**
     * Открытие лида
     *
     */
    openLead(lead_id, mask_id, amount, overdraft = false) {

        this.obtain.openLead({lead_id: lead_id, mask_id: mask_id, amount: amount, overdraft: overdraft})
            .subscribe(result => {
                // обработка результата открытия лида

                // переводим ответ в json
                let data = result.json();

                console.log(data);

                // обработка результата
                if (data.status == 'true') {
                    // если лид нормлаьно открылся

                    // открытие модального окна с данными по открытому лиду
                    this.openLeadData(data.openLead.id);

                } else {
                    // ошибка в открытии лида

                    if (data.info == 'open_leads_with_no_status') {
                        // у диалмэйкера присутствует открытый лид без статуса


                        let text = {
                            "title": "Cannot open the Lead",
                            "sub_title": `
                                You have a Lead with no status. To open the next one, put the status already open.
                                    `,
                            "button_ok": "OK"
                        };

                        this.translate.get('incoming_detail.dealmaker_no_status', {}).subscribe((res: string) => {

                            text['title'] = res['title'];
                            text['sub_title'] = res['sub_title'];
                            text['button_ok'] = res['button_ok'];
                        });


                        let alert = this.alertCtrl.create({
                            title: text['title'],
                            subTitle: text['sub_title'],
                            buttons: [text['button_ok']]
                        });
                        alert.present();

                    } else if (data.info == 'low_balance') {

                        let text = {
                            "title": "Cannot open the Lead",
                            "sub_title": `
                                Not enough money in your account to open the lead. Replenish your cash account to open the lead
                                    `,
                            "button_ok": "OK"
                        };

                        this.translate.get('incoming_detail.not_enough_money', {}).subscribe((res: string) => {

                            text['title'] = res['title'];
                            text['sub_title'] = res['sub_title'];
                            text['button_ok'] = res['button_ok'];
                        });

                        let alert = this.alertCtrl.create({
                            title: text['title'],
                            subTitle: text['sub_title'],
                            buttons: [text['button_ok']]
                        });
                        alert.present();

                    } else if (data.info == 'already_open') {

                        let text = {
                            "title": "Lead already open",
                            "sub_title": "You already open this lead. Close the lead details window and refresh the list of incoming leads",
                            "button_ok": "OK"
                        };

                        this.translate.get('incoming_detail.lead_already_open', {}).subscribe((res: string) => {

                            text['title'] = res['title'];
                            text['sub_title'] = res['sub_title'];
                            text['button_ok'] = res['button_ok'];
                        });


                        let alert = this.alertCtrl.create({
                            title: text['title'],
                            subTitle: text['sub_title'],
                            buttons: [text['button_ok']]
                        });
                        alert.present();

                    } else if (data.info == 'banned') {

                        let text = {
                            "title": "באג",
                            "sub_title": data.data,
                            "button_ok": "הבנתי"
                        };

                        // this.translate.get('incoming_detail.lead_withdrawn_from_auction', {}).subscribe((res: string) => {
                        //
                        //     text['title'] = res['title'];
                        //     text['sub_title'] = res['sub_title'];
                        //     text['button_ok'] = res['button_ok'];
                        // });

                        let alert = this.alertCtrl.create({
                            title: text['title'],
                            subTitle: text['sub_title'],
                            buttons: [text['button_ok']]
                        });
                        alert.present();

                    } else if (data.info == 'lead_withdrawn_from_auction') {

                        let text = {
                            "title": "Lead withdrawn from auction",
                            "sub_title": "This lead withdrawn from auction. Close the lead details window and refresh the list of incoming leads",
                            "button_ok": "OK"
                        };

                        this.translate.get('incoming_detail.lead_withdrawn_from_auction', {}).subscribe((res: string) => {

                            text['title'] = res['title'];
                            text['sub_title'] = res['sub_title'];
                            text['button_ok'] = res['button_ok'];
                        });

                        let alert = this.alertCtrl.create({
                            title: text['title'],
                            subTitle: text['sub_title'],
                            buttons: [text['button_ok']]
                        });
                        alert.present();

                    } else if (data.info == 'overdraftConfirmation') {

                        let text = {
                            "title": "overdraft title",
                            "sub_title": "overdraft confirmation",
                            "button_cancel": "OK",
                            "button_confirmation": "OK"
                        };

                        this.translate.get('incoming_detail.overdraft_confirmation', {}).subscribe((res: string) => {
                            text['title'] = res['title'];
                            text['sub_title'] = res['sub_title'];
                            text['button_cancel'] = res['button_cancel'];
                            text['button_confirmation'] = res['button_confirmation'];
                        });

                        let alert = this.alertCtrl.create({
                            title: text['title'],
                            subTitle: text['sub_title'],
                            buttons: [
                                {
                                    text: text['button_cancel'],
                                    handler: data => {
                                        // console.log('Cancel clicked');
                                    }
                                },
                                {
                                    text: text['button_confirmation'],
                                    handler: data => {

                                        // console.log(lead_id);
                                        // console.log(mask_id);
                                        // console.log(amount);

                                        this.openLead(lead_id, mask_id, amount, true);
                                        // console.log('Saved clicked');
                                    }
                                }
                            ]
                        });
                        alert.present();

                    }
                }

            }, err => {
                // в случае ошибки

                console.log('ERROR: ' + err);

                // todo выводится сообщение об ошибке (нету связи и т.д.)

                // отключаем окно индикатора загрузки
                // infiniteScroll.complete();
            });

    }


    /**
     * Окно с данными по открытому лиду
     *
     */
    openLeadData(openLeadId: number) {

        // модальное окно со статусами
        let modal = this.modalCtrl.create(OpenDetailPage, {openLeadId: openLeadId, roles: this.roles});

        // modal.onDidDismiss(data => {
        //
        //     console.log(data);
        //
        //     this.loadNotifications();
        // });

        modal.present();

        this.close();

        console.log('открытие данных по лиду при открытии лида');
    }


    /**
     * Закрытие страницы
     *
     */
    close() {
        this.view.dismiss();
    }


    popPage() {

        this.navCtrl.pop();
    }

}
