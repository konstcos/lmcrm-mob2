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
    selector: 'profile_edit_region_page',
    templateUrl: 'profile_edit_region.html',
    providers: [User]
})
export class ProfileEditRegionPage {

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
        street: false,
        region: false,
    };


    /**
     * Выбранные регионы
     *
     */
    public selectRegions = [];


    /**
     *  id выбранного региона
     *
     */
    public selectedRegionId = 0;


    /**
     * Дочерние регионы
     * для вариантов выбора подрегионов
     *
     */
    public regions = [];


    public regionsLoading = false;

    public noChildRegions = false;

    public regionsBlock = false;


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
        street: 2,
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
            this.data.street = data.street;
            this.data.region = data.region;

            this.preparationOfTheRegion();

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
     * Подготовка региона
     *
     */
    public preparationOfTheRegion() {

        // todo добавлять путь только если он есть

        this.selectRegions = JSON.parse(JSON.stringify(this.data.region.path));
        this.selectRegions.push(this.data.region.region);

        this.selectedRegionId = this.data.region.region.id;

        console.log('this.data.region.region.id');
        console.log(this.data.region.region.id);
        console.log(this.data.region.region);
        console.log(this.selectRegions);

        this.getRegions(this.selectedRegionId);

    }


    /**
     * Переключить регион
     *
     */
    switchRegion(region) {

        let regionId;

        if (region != 1) {

            this.selectRegions.push(region);

            regionId = region.id;

            this.selectedRegionId = regionId;

        } else {

            regionId = 1;

            this.selectedRegionId = regionId;
        }


        console.log(this.selectRegions);

        this.getRegions(regionId);

        // this.regionsLoading = true;
        // this.noChildRegions = false;
        // this.regionsBlock = false;
        //
        // this.user.getRegions(regionId)
        // // подписываемся на получение результата
        //     .subscribe(resp => {
        //         // обработка результата
        //
        //         // преобразование результата в json
        //         let res = resp.json();
        //
        //         console.log(res);
        //
        //
        //         this.regions = res.regions;
        //
        //         if(this.regions.length > 0) {
        //
        //             this.regionsLoading = false;
        //             this.noChildRegions = false;
        //             this.regionsBlock = true;
        //
        //         } else {
        //
        //             this.regionsLoading = false;
        //             this.noChildRegions = true;
        //             this.regionsBlock = false;
        //         }
        //
        //
        //
        //     }, (err) => {
        //
        //         this.regionsLoading = false;
        //         this.noChildRegions = false;
        //         this.regionsBlock = false;
        //
        //         this.section('error')
        //
        //         // loading.dismiss();
        //     });

        console.log('region');
    }


    getRegions(regionId) {

        this.regionsLoading = true;
        this.noChildRegions = false;
        this.regionsBlock = false;

        this.user.getRegions(regionId)
        // подписываемся на получение результата
            .subscribe(resp => {
                // обработка результата

                // преобразование результата в json
                let res = resp.json();

                console.log(res);


                this.regions = res.regions;

                if (this.regions.length > 0) {

                    this.regionsLoading = false;
                    this.noChildRegions = false;
                    this.regionsBlock = true;

                } else {

                    this.regionsLoading = false;
                    this.noChildRegions = true;
                    this.regionsBlock = false;
                }


            }, (err) => {

                this.regionsLoading = false;
                this.noChildRegions = false;
                this.regionsBlock = false;

                this.section('error')

                // loading.dismiss();
            });
    }


    /**
     * Очистка регионов
     *
     */
    clearRegions() {
        this.selectRegions = [];
        this.selectedRegionId = 1;
        // this.switchRegion(1);
    }


    /**
     * Удаление региона
     *
     */
    dellRegion(region) {

        if (region.parent_id == 0) {
            return false;
        }

        let newRegions = [];

        let regionIndex: any;

        for (regionIndex in this.selectRegions) {

            if (region.id == this.selectRegions[regionIndex].id) {

                if (regionIndex == '0') {

                    this.selectedRegionId = 1;

                    this.selectRegions = [];
                    this.switchRegion(1);
                    break;

                } else {

                    console.log('конец');

                    // console.log(newRegions);
                    // console.log(this.selectRegions[regionIndex]);
                    // console.log(this.selectRegions[regionIndex-1]);

                    this.selectedRegionId = this.selectRegions[regionIndex - 1].id;

                    this.switchRegion(this.selectRegions[regionIndex - 1]);
                    this.selectRegions = newRegions;
                    break;

                }

            } else {

                newRegions.push(this.selectRegions[regionIndex]);
            }

            // console.log(this.selectRegions[regionIndex]);
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

        let loading = this.loadingCtrl.create({});

        loading.present();

        this.user.saveProfileRegion({street: this.data.street, regionId: this.selectedRegionId})
            .subscribe(result => {
                    // при получении итемов

                    // переводим ответ в json
                    let data = result.json();

                    console.log('region save: ');
                    console.log(data);

                    // обработка ответа
                    if (data.status == 'success') {
                        // ответ получе нормально

                        this.data.street = data.street;
                        this.data.region = data.region;

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
        if (this.profileData.main.company !== this.data.company)
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

        this.clearRegions();

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