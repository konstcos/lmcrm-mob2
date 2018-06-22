import {Component} from '@angular/core';
import {
    NavController,
    NavParams,
    ViewController,
    LoadingController,
} from 'ionic-angular';


import {User} from '../../providers/user';


/*
 Generated class for the OpenLeadOrganizer page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'profile_edit_main_data_page',
    templateUrl: 'profile_edit_main_data.html',
    providers: [User]
})
export class ProfileEditMainDataPage {

    /**
     * Данные пользователя
     *
     */
    public profileData: any = false;


    /**
     * Данные
     *
     */
    public data: any = {
        first_name: false,
        last_name: false,
        company: false,
    };

    /**
     * Состояние полей (ошибки, либо нормально)
     *
     *     1
     *     2 ошибок нет
     *     3 пустое поле
     *     4
     *
     */
    private state = {
        firstName: 2,
        lastName: 2,
        company: 2,
    };


    /**
     * Области с данными на странице
     *
     */
    public sections: any = {
        // область со спинером загрузки
        loading: true,
        // область с данными
        data: false,
        // вывод ошибки
        error: false
    };

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public view: ViewController,
                public loadingCtrl: LoadingController,
                public user: User) {

        // получаем данные с родительской страницы
        let data = navParams.get('data');
        // проверка данных
        if (data) {
            // если данные есть

            // заводим нужные данные
            this.data.first_name = data.main.first_name;
            this.data.last_name = data.main.last_name;
            this.data.company = data.main.company;

            // выводим секцию с данными
            this.section('data');
            // заносим в модель основные данные
            this.profileData = data;

        } else {
            // если данных нет
            // включаем раздел с ошибкой
            this.section('error');
        }
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
     * Сохранение основных данных о агенте
     *
     */
    saveData() {

        // todo валидация данных

        let loading = this.loadingCtrl.create({
       });

        loading.present();

        this.user.saveProfileMainData(this.data)
            .subscribe(result => {
                    // при получении итемов

                    // переводим ответ в json
                    let data = result.json();

                    // обработка ответа
                    if (data.status == 'success') {
                        // ответ получе нормально

                        // закрытие модального окна
                        // с передачей данных родительскому
                        this.close('data_saved');

                    } else {
                        // ошибка в ответе

                        // вывод блока с ошибкой
                        this.section('error');
                    }

                    loading.dismiss();

                }, err => {
                    // в случае ошибки

                    loading.dismiss();

                    // вывод блока с ошибкой
                    this.section('error');

                    console.log('ERROR: ' + err);
                }
            );
    }


    /**
     * Включение/отключение кнопки Save
     *
     */
    isSaveDisabled(): boolean {

        // при включенной страние ошибки
        // OFF (выключаем кнопку)
        if (this.sections.error)
            return true;

        // при изменении в имени
        // ON (включаем кнопку)
        if (this.profileData.main.first_name !== this.data.first_name)
            return false;

        // при изменении в фамилии
        // ON (включаем кнопку)
        if (this.profileData.main.last_name !== this.data.last_name)
            return false;

        // при изменении в названии компании
        // ON (включаем кнопку)
        if(this.profileData.main.company !== this.data.company)
            return false;

        // если до этого кнопка небыла включана
        // OFF (выключаем кнопку)
        return true;
    }


    /**
     * Закрытие окна
     *
     * по умолчанию - только закрытие
     * может быть еще передача данных
     */
    close(state: string = 'only_close') {

        // возвращаемый параметр
        let returnedData = {
            state: state,
            data: false,
        };

        // добавление других параметров
        // (если нужно)
        switch (state) {

            case 'data_saved':
                returnedData.data = this.data;
                break;
        }

        // закрытие модального окна
        this.view.dismiss(returnedData);
    }

}