// credit-replenishment
import {Component} from "@angular/core";
import {NavController, ViewController, NavParams, AlertController, LoadingController} from "ionic-angular";
// главная страница
import {Credits} from "../../providers/credits";


/*
 Generated class for the Credits page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'credit-replenishment',
    providers: [Credits],
    templateUrl: 'credit-replenishment.html'
})
export class CreditReplenishmentPage {

    /**
     * Сегмент страницы
     *
     */
    public items = [];


    /**
     * Вывод спинера загрузки
     *
     */
    public isLoading: boolean = false;


    /**
     * Выбранная величина пополнения
     *
     */
    public selectedAmount: number = 0;


    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public view: ViewController,
                public credits: Credits,
                public loadingCtrl: LoadingController,
                public alertCtrl: AlertController) {

        // получение данных по вводу денег
        this.getReplenishmentData();
    }


    ionViewDidLoad() {
        console.log('ionViewDidLoad CreditsPage');
    }


    /**
     * Получить данные по выводу средств из системы
     *
     */
    getReplenishmentData() {

        this.isLoading = true;

        this.credits.getReplenishmentData()
            .subscribe(result => {
                // при получении итемов

                // переводим ответ в json
                let data = result.json();

                console.log(data);

                if (data.status == 'success') {

                    for (let payment of data.payments) {

                        payment.state = false;

                    }

                    this.items = data.payments;

                } else {

                    console.log('error');
                }

                this.isLoading = false;

            }, err => {
                // в случае ошибки

                console.log('ERROR: ' + err);

                this.isLoading = false;
            });
    }


    /**
     * Выбор итема
     *
     */
    selectItem(currentItem) {

        for (let item of this.items) {

            if (item.value == currentItem.value) {

                item.state = true;

                this.selectedAmount = currentItem.value;

            } else {

                item.state = false;
            }
        }
    }


    /**
     * Показать кредиты по всем маскам
     *
     */
    showCreditsByAllMasks(item) {

        // item.value

        let supTitle = "<span class='replenishment_credits_alert_title_amount'>For <span class='amount'>&#8362; " + item.value + "</span> you can get:</span>";

        let message = '<div class="replenishment_credits_alert">';


        for (let mask of item.masks) {

            message +=
                `            
   
                <div class="replenishment_row">
                    <div class="mask">` + mask.name + `</div>
                    <div class="credits">` + mask.credits + ` <span class="text">credits</span></div>
                </div>
            `;
        }

        message += '</div>';

        let alert = this.alertCtrl.create({
            subTitle: supTitle,
            message: message,
            buttons: ['Ok']
        });
        alert.present();

    }


    /**
     * Подтверждение заявки на ввод денег
     *
     */
    confirmReplenishment() {

        if (this.selectedAmount == 0) {

            return false;
        }


        let alert = this.alertCtrl.create({
            title: 'Confirmation',
            message: 'Will be created a statement for input <b>&#8362; ' + this.selectedAmount + '</b> on yor wallet in the system.',
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Ok',
                    handler: () => {
                        this.makeReplenishment();
                        console.log('Ok clicked');
                    }
                }
            ]
        });
        alert.present();

    }


    /**
     * Сохранить заявку на ввод денег
     *
     */
    makeReplenishment() {


        if (this.selectedAmount == 0) {

            return false;
        }


        // показывает окно загрузки
        let loading = this.loadingCtrl.create({
            content: 'Make replenishment, please wait...'
        });
        loading.present();

        this.credits.createReplenishment({amount: this.selectedAmount})
            .subscribe(result => {
                // при получении итемов

                // переводим ответ в json
                let resData = result.json();

                console.log(resData);

                // отключаем окно индикатора загрузки
                loading.dismiss();

                if (resData.status == 'success') {

                    this.goBack({status: 'success', info: 'makeReplenishment', data: resData.result})

                } else {

                    this.goBack({status: 'success', info: 'errorReplenishment'})
                }


            }, err => {
                // в случае ошибки

                console.log('ERROR: ' + err);

                // todo выводится сообщение об ошибке (нету связи и т.д.)

                // отключаем окно индикатора загрузки
                loading.dismiss();

                this.goBack({status: 'success', info: 'errorReplenishment'})
            });


    }


    /**
     * Возврат назад
     *
     */
    goBack(data: any = {status: 'success', info: false}) {
        this.view.dismiss(data);
    }
}
