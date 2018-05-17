import {Component} from '@angular/core';
import {
    NavController,
    NavParams,
    ViewController,
    ModalController,
    AlertController,
    ToastController,
    LoadingController,
    ActionSheetController
} from 'ionic-angular';
import {SafeResourceUrl, DomSanitizer} from '@angular/platform-browser';
import {TranslateService} from 'ng2-translate/ng2-translate';

import {CorrespondencePage} from '../correspondence/correspondence'

import {Open} from '../../providers/open';


/*
 Generated class for the OpenLeadStatuses page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'deal-payment-card',
    templateUrl: 'deal-payment-card.html'
})
export class DealPaymentCardPage {

    /**
     * Данные итема
     *
     */
    public item: any = false;


    /**
     * id открытого лида
     *
     */
    public openLeadId: any = false;


    /**
     * Блок с данными
     *
     */
    public dataBlock: boolean = false;


    /**
     * Состояние оплаты (прошл, не прошла)
     *
     */
    public paymentState = false;


    /**
     * Статус платежа, успешно или не успешно
     *
     */
    public paymentStatus = '';


    /**
     * Ссылка на получение данных по инвойсу
     *
     */
    public invoiceUrl: any = false;


    /**
     * Блок с данными с сайта кредитов
     *
     */
    public creditBlock: boolean = false;


    /**
     * Данные по вводу денег
     *
     */
    public data: any = {
        name: '',
        surname: '',
        email: '',
        phone: '',
        amount: 0,
    };


    /**
     * Данные по ошибкам ввода
     *
     */
    public errors: any = {
        name: false,
        surname: false,
        email: false,
        phone: false,
        bank: false,
        branch_number: false,
        company: false,
        invoice_number: false,
    };


    /**
     * Вывод спинера загрузки
     *
     */
    public isLoading: boolean = false;

    /**
     * Переменная областей на странице
     *
     */
    public sections: any = {
        // загрузка
        loading: true,
        // область с данными
        data: false,
        // область с фреймом
        frame: false,
        // положительный результат
        resultSuccess: false,
        // отрицательный результат
        resultFail: false,
        // при возникновении какой то ошибки
        error: false
    };

    /**
     * Линк фрейма
     *
     */
    private url:SafeResourceUrl;

    /**
     * Показывать/прятать спинер фрейма
     *
     */
    private frameSpinnerShow: boolean = false;


    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public open: Open,
                private alertCtrl: AlertController,
                private domSanitizer: DomSanitizer,
                public modalCtrl: ModalController,
                public toastCtrl: ToastController,
                public loadingCtrl: LoadingController,
                public actionSheetCtrl: ActionSheetController,
                public view: ViewController,
                public translate: TranslateService) {

        // создаем слушатель на сообщения из iFrame
        window.addEventListener('message', (data) => {
            // преобразовываем сообщение в json
            let message = JSON.parse(data.data);
            // метод обработки ответа
            this.frameMessageProcessing(message);
        });

        // получение id итема
        this.openLeadId = this.navParams.get('openLeadId');

        // получение данных по выводу денег
        this.getCreditCardData();

    }


    ionViewDidLoad() {
        // console.log('ionViewDidLoad OpenLeadStatusesPage');
    }


    /**
     * Переключение областей на странице
     *
     * области на странице:
     *     loading - область со спинером загрузки, показывается во время загрузки
     *     data - область с данными, показывается когда данные успешно загруженны
     *     frame - меню/подтверждение на открытие лида
     *     success - область с ошибкой по открытию лиди
     *     fail - область подтверждение овердрафта
     *     error - область с ошибками, появляется во время ошибки загрузки
     */
    section(areaName: any = false) {

        // закрываются все разделы
        this.closeAllSections();

        switch (areaName) {

            case 'loading':
                // область со спинером загрузки
                this.sections.loading = true;
                break;

            case 'data':
                // область основных данных
                // (ввод данных для проплаты)
                this.sections.data = true;
                break;

            case 'frame':
                // фрейм сервиса проплаты
                this.sections.frame = true;
                break;

            case 'success':
                // область оповещения об успехе
                this.sections.resultSuccess = true;
                break;

            case 'fail':
                // область оповещения о неудаче
                this.sections.resultFail = true;
                break;


            case 'error':
                // непонятная ошибка
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
     * Получить данные по кредитной карте
     *
     */
    getCreditCardData() {

        // включение спинера загрузки
        this.section('loading');

        // загружаем данные с сервера
        this.open.getDataForCreditCardTransaction({openLeadId: this.openLeadId})
            .subscribe(result => {
                // при получении данных

                // переводим ответ в json
                let data = result.json();

                // проверка статуса ответа
                if (data.status == 'success') {
                    // если все нормально

                    // заполняем данные в блоке
                    this.data = {
                        name: data.dealData.name,
                        surname: data.dealData.surname,
                        email: data.dealData.email,
                        phone: data.dealData.phone,
                        amount: data.dealData.amount,
                    };

                    // вывод блока с данными
                    this.section('data');

                } else {

                    // вывод блока с ошибками
                    this.section('error');

                    // console.log('error');
                }

            }, err => {
                // в случае ошибки

                // вывод блока с ошибками
                this.section('error');
            });
    }

    /**
     * При фокусе на телефоне
     *
     */
    phoneFocus() {
        this.errors.phone = false;
    }


    /**
     * Валидация телефона
     *
     */
    phoneValidate() {
        // Проверка на пустое поле
        if (this.data.phone == '') {
            this.errors.phone = true;
            return false;
        }

        // Проверка по регулярке
        let reg = /^\+?(972|0)(\-)?0?(([23489]{1}\d{7})|[5]{1}\d{8})$/;
        if (!reg.test(this.data.phone)) {
            this.errors.phone = true;
            return false;
        }

        this.errors.phone = false;
        return true;
    }

    /**
     * Проверка поля с телефонным номером при вводе нового символа
     *
     */
    phoneChange(event) {

        setTimeout(() => {
                this.data.phone = event.replace(/\D+/g, "");
            }
            , 0);

    }

    /**
     * Подтверждение данных по оплате
     *
     */
    confirmPayment() {

        // обнуляем все ошибки
        this.errors.name = false;
        this.errors.surname = false;
        this.errors.email = false;
        this.errors.phone = false;
        this.errors.amount = false;


        if (this.data.name.trim() == '') {
            this.errors.name = true;
            return false
        }

        if (this.data.surname.trim() == '') {
            this.errors.surname = true;
            return false
        }

        if (this.data.email.trim() == '') {
            this.errors.email = true;
            return false
        }

        if (this.data.phone.trim() == '') {
            this.errors.phone = true;
            return false
        }

        if (this.data.amount <= 0) {
            this.errors.amount = true;
            return false
        }

        if (!this.phoneValidate()) {
            return false;
        }

        // вывод спинера загрузки
        this.section('loading');

        let request = {
            openLeadId: this.openLeadId,
            name: this.data.name,
            email: this.data.email,
            phone: this.data.phone,
            amount: this.data.amount,
        };

        this.open.makeCreditCardTransaction(request)
            .subscribe(result => {
                // при получении итемов

                // переводим ответ в json
                let data = result.json();

                console.log(data);

                if (data.status == 'success') {


                    // this.invoiceUrl = data.info.ClearingRedirectUrl;
                    this.invoiceUrl = data.info;

                    // вовод блока с данными
                    // this.section('frame');

                    // показываем блок с данными
                    this.loadIFrame();

                } else {

                    // вовод блока с ошибками
                    this.section('error');
                }

                // loading.dismiss();

                // this.dataBlock = false;
                // this.creditBlock = true;

            }, err => {
                // в случае ошибки

                // console.log('ERROR: ' + err);

                // вовод блока с ошибками
                this.section('error');

                // loading.dismiss();

                // this.dataBlock = false;
                // this.creditBlock = false;
            });
    }


    /**
     * Старт загрузки фрейма
     *
     */
    loadIFrame() {
        this.section('frame');
        this.url = this.domSanitizer.bypassSecurityTrustResourceUrl(this.invoiceUrl);
        this.frameSpinnerShow = true;
    }


    /**
     * Событие по загрузке фрейма
     *
     */
    frameOnLoad() {
        this.frameSpinnerShow = false;
    }


    /**
     * Формирование контента iFrame по ссылке
     *
     */
    // webPage() {
    //     return this.domSanitizer.bypassSecurityTrustResourceUrl(this.invoiceUrl);
    // }


    /**
     * Обработка сообщения с фрейма
     *
     */
    frameMessageProcessing(message) {

        console.log('получил данные с iFrame');
        console.log(message);

        // обработка полученного сообщения
        if (message.status === 'success') {
            // если успех - показываем раздел оповещения об успехе

            // сохраняем данные об операции
            this.paymentState = true;
            this.paymentStatus = 'success';

            this.section('success');

        } else {
            // если ошибка - показываем раздел с ошибкой

            // сохраняем данные об операции
            this.paymentState = true;
            this.paymentStatus = 'fail';

            this.section('fail');
        }

    };


    /**
     * Закрытие страницы
     *
     */
    close() {

        this.view.dismiss();
    }

}