import {Component} from '@angular/core';
import {
    NavController,
    NavParams,
    ViewController,
    LoadingController,
    AlertController,
    ToastController,
} from 'ionic-angular';


import {User} from '../../providers/user';


/*
 Generated class for the OpenLeadOrganizer page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'profile_edit_phones_page',
    templateUrl: 'profile_edit_phones.html',
    providers: [User]
})
export class ProfileEditPhonesPage {

    /**
     * Данные пользователя
     *
     */
    public profileData: any = false;


    /**
     * Данные
     */
    public data: any = false;


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
                private alertCtrl: AlertController,
                public toastController: ToastController,
                public user: User) {

        // получаем данные с родительской страницы
        let data = navParams.get('data');
        // проверка данных
        if (data) {
            // если данные есть

            console.log('ProfileEditPhonesPage');
            console.log(data);

            // заводим нужные данные
            this.data = data.phones;


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
     * Подтверждение на удаление телефона
     *
     */
    phoneDeleteConfirmation(phone) {

        if(phone.phone.length < 4) {
            this.deletePhone(phone);
            return true;
        }

        let alert = this.alertCtrl.create({
            // title: 'Confirmation of removal',
            message: 'Do you really want to delete phone ' + phone.phone +'?',
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => {
                    }
                },
                {
                    text: 'Delete',
                    handler: () => {
                        this.deletePhone(phone);
                    }
                }
            ]
        });
        alert.present();

    }


    /**
     * Валидация телефона когда убирается фокус с поля
     *
     */
    phoneValidate(phone) {

        // Проверка на пустое поле
        if (phone.phone == '') {
            phone.empty = true;
            phone.notEnough = false;
            phone.notValid = false;
            return false;
        }

        // Проверка длины должно быть не меньше 9 и не больше 10
        // if (this.lead.phone.length < 9 || this.lead.phone.length > 10) {
        //     this.errors.phone.empty = false;
        //     this.errors.phone.notEnough = true;
        //     this.errors.phone.notValid = false;
        //     return false;
        // }

        // Проверка по регулярке
        let reg = /^\+?(972|0)(\-)?0?(([23489]{1}\d{7})|[57]{1}\d{8})$/;
        if(!reg.test(phone.phone)) {
            phone.empty = false;
            phone.notEnough = false;
            phone.notValid = true;
            return false;
        }

        // если телефон успешно прошел все проверки
        phone.empty = false;
        phone.notEnough = false;
        phone.notValid = false;
        return true;
    }


    /**
     * Фокус на поле с телефоном
     *
     */
    phoneFocus(phone) {
        // очищаем поля с обищками
        phone.empty = false;
        phone.notEnough = false;
        phone.notValid = false;

        phone.errors = false;
    }


    /**
     * Проверка поля с телефонным номером при вводе нового символа
     *
     */
    phoneChange(event, phone) {

        setTimeout(() => {
                phone.phone = event.replace(/\D+/g, "");
            }
            , 0);
    }


    /**
     * Удаление телефона
     *
     */
    deletePhone(phone) {
        // помечаем телефон к удалению
        phone.delete = true;

        if(phone.main == 1) {
            phone.main = 0;
            this.setMainFirstPhone();
        }

        if(phone.id == 0) {
            // выбираем индекс телефона в массиве
            let index = this.data.indexOf(phone);
            this.data.splice(index, 1);
        }
    }


    /**
     * Устанавливает номер телефона как основной
     *
     */
    setPhoneAsMain(phone) {

        // если телефон уже главный
        // - выходим из метода
        if(phone.main == 1) {
            return false;
        }

        // выбираем индекс телефона в массиве
        let index = this.data.indexOf(phone);

        // перебираем все телефоны в массиве
        for(let phoneIndex in this.data) {

            // если индекс телефона совпадает с выбранным в массиве
            if(phoneIndex == index) {
                // помечаем его главным
                this.data[phoneIndex].main = 1;

            } else {
                // если не совпадает помечаем не главным
                this.data[phoneIndex].main = 0;
            }

        }
    }


    /**
     * Устанавливает главным первый попавшийся телефонный номер
     *
     */
    setMainFirstPhone() {

        // перебираем все телефоны в массиве
        for(let phoneIndex in this.data) {

            // если индекс телефона совпадает с выбранным в массиве
            if(!this.data[phoneIndex].delete) {
                // помечаем его главным
                this.data[phoneIndex].main = 1;
                break;
            }
        }
    }


    /**
     * Добавление нового телефона
     *
     */
    addPhone() {

        // добавляем новый элемент в массив
        this.data.push({
            id: 0,
            main: 0,
            phone: '',
            comment: '',
        });
    }


    /**
     * Сохранение телефонов
     *
     */
    saveData() {

        // валидация данных

        let validate = true;
        for(let phone of this.data) {
            if(!phone.delete) {
                if(!this.phoneValidate(phone)) {
                    validate = false;
                }
            }
        }

        if(!validate) {
            return false;
        }


        // отметка главного телефона
        let isMainPhone = false;
        // перебираем все телефоны
        // ищем главный телефон
        for(let phone of this.data) {
            // если телефон выделен как главный
            if(phone.main = 1) {
                // проверка на наличие главного телефона
                if(isMainPhone) {
                    // если главный телефон уже есть
                    // помечаем этот как не главный
                    phone.main = 0;

                } else {
                    // если главного телефона еще нет
                    // помечаем что главный телефон уже выбран
                    isMainPhone = true;
                }
            }
        }

        // если его нет - назначаем первый
        if(!isMainPhone) {
            if(this.data && this.data.length > 0) {
                this.data[0].main = 1;
            }
        }


        let loading = this.loadingCtrl.create({
        });

        loading.present();

        this.user.savePhones({phones: this.data})
            .subscribe(result => {
                    // при получении итемов

                    // переводим ответ в json
                    let data = result.json();

                    console.log(data);

                    // обработка ответа
                    if (data.status == 'success') {
                        // ответ получе нормально

                        // закрытие модального окна
                        // с передачей данных родительскому
                        // this.close('data_saved');

                        this.profileData.phones = data.phones;
                        this.data = data.phones;

                        const toast = this.toastController.create({
                            message: 'phones successfully saved',
                            duration: 3000
                        });
                        toast.present();

                    } else {
                        // ошибка в ответе

                        // обработка ошибки
                        if(data.info ==  'phone_errors_while_processing') {
                            // ошибка по валидации данных

                            this.profileData.phones = data.phones;

                            // перебираем массив телефонов на апликации
                            for(let phoneIndex in this.data) {

                                // под каждый итем телефона ищется ошибка
                                // либо по номеру телефона, либо по id
                                // в зависимости от того, сохранен итем или нет
                                for(let error of data.errors) {

                                    // если итем еще не сохранен
                                    if(this.data[phoneIndex].id == 0) {
                                        // ищем ошибки по номеру телефона

                                        // если есть совпадения по телефону
                                        if(this.data[phoneIndex].phone == error.phone) {
                                            // присваиваем ошибку этому итему
                                            this.data[phoneIndex].errors = error.errors.phone;
                                        }
                                    }

                                    // если итем уже был сохранен
                                    if(this.data[phoneIndex].id > 0) {
                                        // ищем ошибки по id итема
                                        if(this.data[phoneIndex].id == error.id) {
                                            // присваиваем ошибку этому итему
                                            this.data[phoneIndex].errors = error.errors.phone;
                                        }
                                    }
                                }
                            }

                            const toast = this.toastController.create({
                                message: 'error while saving phones',
                                duration: 3000
                            });
                            toast.present();

                        } else {
                            // непонятная ошибка
                            // вывод блока с ошибкой
                            this.section('error');
                        }

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