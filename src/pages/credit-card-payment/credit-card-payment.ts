import {Component} from '@angular/core';
import {NavController, ViewController, NavParams, AlertController, LoadingController} from 'ionic-angular';

// главная страница
import {MainPage} from '../main/main'

import {Credits} from '../../providers/credits'
import {SafeResourceUrl, DomSanitizer} from '@angular/platform-browser';


/*
 Generated class for the Credits page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'credit-card-payment',
    providers: [Credits],
    templateUrl: 'credit-card-payment.html'
})
export class CreditCardPaymentPage {


    /**
     * Данные итема
     *
     */
    public item: any = false;


    /**
     * Блок с данными
     *
     */
    public dataBlock: boolean = false;


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
     * Состояние проплаты
     *
     * дает понять была проплата или не было
     * для того чтобы понят в основном окне
     * менять статус итема, или нет
     */
    public paymentState: boolean = false;


    /**
     * Статус проплаты
     *
     * проплата была сделана успешно
     * или прошла какая то ошибка
     */
    public paymentStatus: string = '';


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
        phone: false,
        email: false,
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
        loading: false,
        // область с данными
        data: true,
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
                public view: ViewController,
                public credits: Credits,
                private domSanitizer: DomSanitizer,
                public loadingCtrl: LoadingController,
                public alertCtrl: AlertController) {

        // создаем слушатель на сообщения из iFrame
        window.addEventListener('message', (data) => {
            // преобразовываем сообщение в json
            let message = JSON.parse(data.data);
            // метод обработки ответа
            this.frameMessageProcessing(message);
        });

        // получение id итема
        this.item = this.navParams.get('item');

        // получение данных по выводу денег
        this.getCreditCardData();
    }


    /**
     * Сценарий при полной загрузке компонента
     *
     */
    ionViewDidLoad() {
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

        // this.credits.creditCardPayment({item_id: item.id})
        // this.credits.getDetailCreditCardPayment({item_id: item.id})

        this.isLoading = true;

        this.dataBlock = false;

        this.credits.getDetailCreditCardPayment({item_id: this.item.id})
            .subscribe(result => {
                // при получении итемов

                // переводим ответ в json
                let data = result.json();

                console.log(data);

                if (data.status == 'success') {

                    // todo данные пользователя по карте

                    this.data = {
                        name: data.info.user.first_name,
                        surname: data.info.user.last_name,
                        email: data.info.user.email,
                        phone: data.info.requestPayment.initiator.phone,
                        amount: data.info.requestPayment.amount,
                    };

                    console.log(this.data);

                } else {

                    console.log('error');
                }

                this.isLoading = false;
                this.dataBlock = true;


            }, err => {
                // в случае ошибки

                console.log('ERROR: ' + err);

                this.isLoading = false;
                this.dataBlock = true;
            });
    }


    /**
     *
     *
     */
    phoneFocus() {

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

        console.log('сработал чендж телефона');
        console.log(event);

        setTimeout(() => {
                this.data.phone = event.replace(/\D+/g, "");
            }
            , 0);


        console.log(this.data.phone);

    }

    /**
     * Подтверждение данных на вывод
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
            return false;
        }

        if (this.data.surname.trim() == '') {
            this.errors.surname = true;
            return false;
        }

        if (this.data.email.trim() == '') {
            this.errors.mail = true;
            return false;
        }

        if (this.data.phone.trim() == '') {
            this.errors.phone = true;
            return false;
        }

        if (this.data.amount <= 0) {
            this.errors.amount = true;
            return false;
        }

        if (!this.phoneValidate()) {
            return false;
        }

        // показывает окно загрузки
        // let loading = this.loadingCtrl.create({
        //     content: 'Please wait...'
        // });
        //
        // loading.present();

        // показываем спинер загрузки
        this.section('loading');

        // подготовка данных для отправки на сервер
        let request = {
            item_id: this.item.id,
            name: this.data.name,
            surname: this.data.surname,
            email: this.data.email,
            phone: this.data.phone,
            amount: this.data.amount,
        };

        // запрос на получение данных по кредитке
        this.credits.creditCardPayment(request)
            .subscribe(result => {
                // при получении итемов

                // переводим ответ в json
                let data = result.json();

                // console.log(data);

                // обработка результата запроса
                if (data.status == 'success') {
                    // при успешном ответе

                    // сохраняем ссылку для получени данных проплаты
                    // для iFrame
                    this.invoiceUrl = data.info;

                    // показываем блок с данными
                    this.loadIFrame();

                } else {
                    // при неудаче

                    // показываем блок с ошибкой
                    this.section('error');
                }

                // loading.dismiss();
                // this.dataBlock = false;
                // this.creditBlock = true;

            }, err => {
                // в случае ошибки

                console.log('ERROR: ' + err);

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
     * Обработка данных для iFrame
     *
     */
    // webPage() {
    //
    //     let url = this.domSanitizer.bypassSecurityTrustResourceUrl(this.invoiceUrl);
    //
    //     console.log('загрузился фрэйм');
    //     this.section('frame');
    //
    //     return url;
    // }


    /**
     * Обработка сообщения с фрейма
     *
     */
    frameMessageProcessing(message) {

        console.log('получил данные с iFrame');

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
     * Возврат назад
     *
     */
    goBack() {

        // формирование данных для основного компонента
        let data = {
            state: this.paymentState,
            status: this.paymentStatus
        };

        // закрытие окна с передачей данных в основной компонент
        this.view.dismiss(data);
    }
}
