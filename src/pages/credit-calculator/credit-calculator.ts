import {Component} from '@angular/core';
import {
    NavController,
    NavParams,
    ViewController,
    ModalController
} from 'ionic-angular';

import {User} from '../../providers/user';


/*
 Generated class for the OpenLeadStatuses page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'credit-calculator',
    templateUrl: 'credit-calculator.html'
})
export class CreditCalculatorPage {


    /**
     * Направление конвертации
     *
     * 1 - shekel to credit
     * 2 - credit to shekel
     */
    public direction: number = 2;

    /**
     * Направление которое было при коныертации
     *
     * 1 - shekel to credit
     * 2 - credit to shekel
     */
    public currentDirection: number = 2;


    /**
     * Индикатор загрузки данных
     *
     */
    public isLoading: boolean = true;


    /**
     * Показывать контент или нет
     *
     */
    public showContent: boolean = false;


    /**
     * Данные по сферам самого агента
     *
     */
    public spheres: any = [];


    /**
     * Данные по всем маскам всех салесманов
     *
     */
    public salesmenSpheres: any = [];


    /**
     * Расчетная величина
     *
     */
    public calculatedValue: any = false;


    /**
     * Значение инпута
     *
     *
     */
    public inputAmount: number = 0;


    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public user: User,
                public modalCtrl: ModalController,
                public view: ViewController) {


        // this.status = this.navParams.get('status');


        // console.log('калькулятор');

        // получение данных по кредитам агента
        this.getAgentCreditsData();
    }

    ionViewDidLoad() {
        // console.log('ionViewDidLoad OpenLeadStatusesPage');
    }


    /**
     * Переключить направление
     *
     */
    switchDirection(direction) {

        this.direction = direction;

        console.log(this.direction);
    }


    /**
     * Получение данных агента по кредитам
     *
     */
    getAgentCreditsData() {

        this.isLoading = true;
        this.showContent = false;

        this.user.getAgentCreditsData()

            .subscribe(result => {
                // при получении итемов

                // переводим ответ в json
                let data = result.json();

                console.log(data);

                this.spheres = data.sphereMasks.user;


                console.log(this.spheres);

                this.isLoading = false;
                this.showContent = true;

            }, err => {
                // в случае ошибки

                console.log('ERROR: ' + err);

                // todo выводится сообщение об ошибке (нету связи и т.д.)

                this.isLoading = false;
                this.showContent = true;

                // отключаем окно индикатора загрузки
                // loading.dismiss();
            });

    }


    /**
     * Расчитать величину по всем маскам
     *
     */
    calculate() {

        if (this.inputAmount == 0) {

            return false;
        }

        this.currentDirection = this.direction;

        this.calculatedValue = false;

        // проверка направления конвертации
        if (this.direction == 1) {
            // shekel to credit

            for (let sphere of this.spheres) {

                for (let mask of sphere.masks) {


                    let amount = this.inputAmount / mask.price

                    if(amount < 1){

                        mask.calculated = 0;

                    } else {
                        mask.calculated = Math.ceil(amount);
                    }


                    // mask.calculated = this.inputAmount / mask.price;
                    // console.log(mask.calculated)

                }

            }

            this.calculatedValue = this.inputAmount;

        } else {
            // credit to shekel

            // todo перебрать все маски и добавить расчетную величину с вычислениями
            // шекели по маске умножить на количество

            for (let sphere of this.spheres) {

                for (let mask of sphere.masks) {

                    mask.calculated = this.inputAmount * mask.price;
                }

            }

            this.calculatedValue = this.inputAmount;
        }


        /**
         * Направление конвертации
         *
         * 1 - shekel to credit
         * 2 - credit to shekel
         */
        // public direction: number = 2;


        console.log(this.inputAmount);

    }


    /**
     * Закрытие страницы
     *
     */
    close() {

        this.view.dismiss();
    }


}
