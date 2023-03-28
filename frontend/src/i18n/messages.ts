import { LOCALES } from "appTypes";

const messages = {
  [LOCALES.EN]: {
    // reset
    reset_title: "Reset password",
    reset_input_title: "Enter your account email address for instructions.",
    reset_button: "Send",
    reset_send:
      "Reset password instructions have been sent to your email. Check you inbox!",

    // change
    change_title: "Change your password",
    change_button: "Change",
    change_success: "Success!",

    // registration
    registration_creator_title: "Join Crypto Donutz!",
    registration_backer_title: "Type in your username",
    registration_button: "Create",
    registration_have_account: "Already have account? ",
    registration_link: "Log in",
    sent_activation_link:
      "We’ve sent an activation link to {email}. Check your inbox!",

    // login
    login_title: "Log in your account",
    login_button: "Log in",
    login_no_account: "No account? ",
    login_link: "Create one",

    // roles
    roles_title: "Who are you?",
    roles_creator: "Content creator",
    roles_supporter: "Supporter",
    roles_button: "Continue",

    // wallets modal
    wallets_connect_title: "Connect wallet",

    // resend
    resend_title: "Resend confirm email",
    resend_button_title: "Click click click - send send send confirm email",
    resend_button: "Send",

    // pages
    page_title_dashboard: "Dashboard",
    page_title_donations: "Donations",
    page_title_donation_page: "Donation page",
    page_title_design: "Design",
    page_title_badges: "Badges",
    page_title_settings: "Settings",
    page_title_alerts: "Alerts",
    page_title_stream_stats: "In-stream statistics",
    page_title_donation_goals: "Donation goals",
    page_title_donation_history: "Donation history",

    // buttons
    create_new_form_button: "Create new",
    create_export_button: "Export",
    create_filter_button: "Filter",
    save_changes_button: "Save changes",
    reset_changes_button: "Reset",
    form_cancel_button: "Cancel",
    form_save_widget_button: "Save widget",
    form_save_goal_button: "Save goal",
    create_badge_form_button: "Create badge",
    sign_out_button: "Sign-out",

    // not found
    not_found_title: "Sorry, the page you visited does not exist.",
    not_found_button: "Back to main page",

    // landing
    landing_main_button: "Sign up",
    landing_main_button_logged: "Go to profile",
    landing_connect_button: "Connect wallet",
    landing_launch_button: "Launch app",
    landing_create_account_button: "Create account",

    landing_banner_title: "Let's revolutionize the way crypto donations work",
    landing_banner_subtitle:
      "It's time to display crypto donations on a stream, mint NFTs for your supporters and have fun!",

    landing_whatIs_subtitle: "What is Crypto Donutz?",
    landing_whatIs_title: "Crypto donation platform for streamers",
    landing_whatIs_description:
      "Our product is aimed to increase streamer’s revenue and interaction with crypto supporters. It’s also extremely easy to set up.",

    landing_features_subtitle: "What's so special about us?",
    landing_features_title: "Our features",

    // landing - features blocks
    landing_features_widgets_title: "In-stream widgets",
    landing_features_widgets_description:
      "Display every crypto donation on the stream, highlight you most active supporters, create donation goals and let your audience be involved.",
    landing_features_badges_title: "Badges as NFTs",
    landing_features_badges_description:
      "Why not grant your valuable supporters with unique badge? Especially with NFT one. Your crypto supporters will definitely love it.",
    landing_features_link_title: "One link integration",
    landing_features_link_description:
      "One link is all it takes. Just copy and paste your widget link to OBS or any other broadcast software you use. Start displaying your incoming donations on a stream.",
    landing_features_donations_title: "Donation page link",
    landing_features_donations_description:
      "Copy your unique donation page link and give it to your supporters. Increase your conversion rate and therefore your revenue.",
    landing_features_customizable_title: "Everything is customizable",
    landing_features_customizable_description:
      "Use your own distinctive colors, texts and images. Customize widgets and donation page. Your imagination is the only limit.",
    landing_features_reports_title: "Donation reports",
    landing_features_reports_description:
      "Our visual graphs and summary reports will get the most out of your donation breakdown. Use time filters to see the donations for any time period.",
    landing_features_fiat_title: "Compatible with fiat services",
    landing_features_fiat_description:
      "Crypto Donutz is designed to make the best use of blockchain technology. Use both fiat and crypto services to maximize your profit.",
    landing_features_nopending_title: "No pending balances",
    landing_features_nopending_description:
      "Every transaction is processed via smart contract and donation goes directly to your wallet address. We have no control over your money.",

    landing_commission_title: "0% commission",
    landing_commission_description:
      "Right now the service is completely free to use for everyone",

    landing_howWork_subtitle: "How it all works?",
    landing_howWork_title: "Three steps process",

    // landing - howWork steps
    landing_howWork_connection_title: "Metamask wallet connection",
    landing_howWork_connection_description:
      "Sign-up with your email, choose the user name and register account.",
    landing_howWork_widget_title: "Widget and donation page set up",
    landing_howWork_widget_description:
      "Go to Widgets section, copy widget link and paste it to your broadcast software. Get your donation page link in Donation page section and give it to your supporters.",
    landing_howWork_actions_title: "Get your tasty Crypto Donutz",
    landing_howWork_actions_description:
      "Mint NFT badges to your most active supporters, analyze your donation reports and have fun!",

    landing_blockchains_subtitle: "Integrations",
    landing_blockchains_title: "Supported crypto",

    landing_help_title: "Need help?",

    // landing - help blocks
    landing_help_discord_title: "Ask in discord",
    landing_help_discord_description:
      "Create ticket on our discord server and talk to our support team",

    landing_help_center_title: "Check help center",
    landing_help_center_description:
      "We've collected all the FAQ in Help center. Check it out!",

    landing_footer_title: "Are you ready to grab your Crypto donutz?",

    // sidebar menu
    sidebar_dashboard: "Dashboard",
    sidebar_donation_page: "Donation page",
    sidebar_widgets: "Widgets",
    sidebar_widgets_alerts: "Alerts",
    sidebar_widgets_stats: "In-stream stats",
    sidebar_widgets_goals: "Donation goals",
    sidebar_donations: "Donations",
    sidebar_badges: "Badges",
    sidebar_settings: "Settings",
    sidebar_help: "Help center",

    // page names
    title_reset_page: "Reset password",
    title_change_password_page: "Change password",
    title_resend_page: "Resend confirm email",
    title_donat_page: "Donat page",
    title_alert_page: "Donat alert page",
    title_goal_page: "Donat goal page",
    title_stat_page: "Donat stat page",

    // dashboard
    dashboard_widgets_stats: "Stats",
    dashboard_widgets_recent: "Recent donations",
    dashboard_widgets_supporters: "Top supporters",
    dashboard_widgets_donations: "Top donations",

    // donations page
    donations_select_dates: "Choose the exact time period",
    donations_group_checkbox: "Group donations with the same sender name",

    donations_search_placeholder: "Search by name",
    donations_found_txt: "Found {num} result for the amount of {amount} USD",

    // donation page
    donation_subtitle:
      "Via the link below your supporters can send you donations",
    donation_generate_button: "Generate QR code",
    donation_download_button: "Download PNG",
    donation_header_banner: "Header banner:",
    donation_background_banner: "Background banner:",
    donation_welcome_text: "Welcome text:",
    donation_button_text: "Button text:",
    donation_main_color: "Main color:",
    donation_background_color: "Background color:",

    // badges page
    badges_new_title: "Mint and manage the Badges for your supporters",
    badges_create_information_title: "Badge information",
    badges_create_information_description:
      "Please fill in the required information",
    badges_create_information_blockhain: "Blockhain",
    badges_create_information_input_name: "Badge name",
    badges_create_information_input_description: "Badge description",

    badges_success_modal_title: "Congratulations! You've created new badge!",
    badges_success_modal_description:
      "Click on it and assign to your supporters",

    // badge page
    badge_image: "Badge Image",
    badge_information_title: "Badge information",
    badge_information_name: "Name",
    badge_information_description: "Description",
    badge_information_assigned: "Assigned",
    badge_information_quantity: "Quantity",
    badge_information_blockchain: "Blockchain",

    badge_assign_label: "Assign badge",
    badge_assign_placeholder: "Choose supporter",
    badge_assign_loading:
      "Wait for the badge to be minted on {username} address",
    badge_assign_success:
      "Congratulations! You've successfully assigned the badge to {username}",
    badge_assign_button: "Assign",

    // settings
    settings_avatar: "Avatar:",
    settings_username: "Username:",
    settings_wallet: "Wallet:",
    settings_change_button: "Change",
    settings_copy_button: "Copy",

    // alerts
    alerts_subtitle:
      "Paste this link into broadcasting software you use and display your incoming donations",
    alerts_banner: "Banner:",
    alerts_message_color: "Message color:",
    alerts_name_color: "Donor name color:",
    alerts_sum_color: "Donation sum color:",
    alerts_message_font: "Message font:",
    alerts_supporter_font: "Supporter font:",
    alerts_donation_font: "Donation sum font:",
    alerts_sound: "Alert sound:",
    alerts_duration: "Alert duration:",
    alerts_duration_value: "{duration} sec",
    alerts_voice: "Voice alerts:",
    alerts_voice_male: "Male",
    alerts_voice_female: "Female",
    alerts_banners_model: "Default donation alert banners",
    alerts_preview_message: "Thank you for your stream!",

    // stats
    stats_subtitle: "Create your custom widgets to display on your streams",
    stats_modal_title: "New widget creation",
    stats_modal_form_title: "Widget title:",
    stats_modal_form_description: "Widget description:",
    stats_modal_form_type: "Data type:",
    stats_modal_form_time: "Time period:",
    stats_modal_form_template: "Template:",
    stats_widget_card_period: "Date period: {timePeriodName}",
    stats_widget_card_type: "Date type: {typeStatData}",
    stats_widget_settings_title: "Goal title color:",
    stats_widget_card_template: "Template: {template}",
    stats_widget_settings_bar_color: "Goal bar color:",
    stats_widget_settings_сontent_color: "Content color:",
    stats_widget_settings_title_font: "Goal title font:",
    stats_widget_settings_сontent_font: "Content font:",
    stats_widget_settings_сontent_alignment: "Content alignment:",
    stats_widget_preview_message: "Hello! This is test message",
    stats_widget_preview_message_2: "How are you ?",

    // goals
    goals_subtitle: "Start fundraising for a specific purchase or goal.",
    goals_modal_title: "New donation goal",
    goals_modal_form_description: "Goal description:",
    goals_modal_form_amount: "Amount to raise:",
    goals_widget_card_raised: "Raised: {amountRaised}/{amountGoal} USD",
    goals_widget_settings_title: "Goal title color:",
    goals_widget_settings_bar_color: "Progress bar color:",
    goals_widget_settings_background_color: "Background color:",
    goals_widget_settings_title_font: "Goal title font:",
    goals_widget_settings_progress_font: "Goal progress font:",

    // donat page
    donat_form_username: "Your username",
    donat_form_switch_label: "Turn on to be anonymous",
    donat_form_message: "Message to {username}",
    donat_form_amount: "Donation amount",
    donat_form_equal_usd: "Equal to {convertedUsdSum} USD",
    donat_form_goal_title: "Donation goals",
    donat_form_goal_description: "Help {username} achieve his donation goals",
    donat_form_goal_dont_participate: "Don't participate",
    donat_loading_message:
      "Please don't close this window untill donation confirmation",
    donat_success_message:
      "You've successfully sent {sum} {selectedBlockchain} to {name}",
    donat_success_message_description:
      "Check your donation history in «Donations» section",
    donat_warning_message_username_description:
      "Unfortunately, this username is already busy. Enter another one",
    donat_warning_message_balance_title: "Insufficient balance",
    donat_warning_message_balance_description:
      "Unfortunately, there are not enough funds on your balance to carry out the operation",
    donat_warning_message_himself_title: "Seriously ?)",
    donat_warning_message_himself_description:
      "You are trying to send a donation to yourself",

    // mobile widget tabs
    widget_tab_settings: "Settings",
    widget_tab_preview: "Preview",

    // table
    table_col_username: "Username",
    table_col_donation_token: "Donation, Token",
    table_col_donation_usd: "Donation, USD",
    table_col_message: "Message",
    table_col_date: "Date and Time, UTM",

    // upload input
    upload_formats: "You can use formats: {formats}",
    upload_recommended_size: "Recommended size: {size} px",
    upload_max_size: ". Max size: {maxFileSize} MB",
    upload_default_banners: "default banners",
    upload_choose_banners: "You can also choose",
    upload_choose_or_banners: "Or choose",
    upload_label_image: "Upload Image",

    // switch
    switch_abled: "Abled",
    switch_disabled: "Disabled",

    // notifications
    notifications_no: "No notifications",

    // empty
    empty_data: "No data",

    // inputs
    input_placeholder_email: "Email",
    input_placeholder_username: "Username",
    input_placeholder_password: "Password",
    input_placeholder_confirm_password: "Confirm password",

    // filters
    filter_today: "Today",
    filter_7days: "Last 7 days",
    filter_month: "Last 30 days",
    filter_year: "This year",
    filter_current_year: "Current year",
    filter_yesterday: "Yesterday",
    filter_all_time: "All time",
    filter_custom: "Custom date",
    filter_top_donations: "Top donations",
    filter_recent_donations: "Recent donations",
    filter_top_supporters: "Top supporters",

    // confirm popup
    confirm_sure: "Are you sure?",
    confirm_reset: "Are you sure you want to reset to default settings?",
    confirm_cancel: "Cancel",
    confirm_ok: "Ok",
  },
  [LOCALES.RU]: {
    // reset
    reset_title: "Восстановить пароль",
    reset_input_title:
      "Введите ваш email. На него мы вышлем ссылку для восстановления пароля",
    reset_button: "Отправить",

    // change
    change_title: "Change your password",
    change_button: "Поменять",
    change_success: "Успешно!",

    // registration
    registration_title: "Зарегистрироваться в Crypto Donutz",
    registration_button: "Создать",
    sent_activation_link:
      "Мы отправили вам ссылку активации на {email}. Проверьте входящие сообщения!",

    // login
    login_title: "Войти в Crypto Donutz",
    login_button: "Вход",

    // resend
    resend_title: "Отправить заново",
    resend_button_title: "Click click click - send send send confirm email",
    resend_button: "Отправить",

    // pages
    page_title_dashboard: "Панель управления",
    page_title_donations: "Донаты",
    page_title_donation_page: "Страница донатов",
    page_title_design: "Дизайн",
    page_title_badges: "Бейджи",
    page_title_settings: "Настройки",
    page_title_alerts: "Оповещения",
    page_title_stream_stats: "Внутристримовая статистика",
    page_title_donation_goals: "Сбор средств",
    page_title_donation_history: "История донатов",

    // buttons
    create_new_form_button: "Создать",
    create_export_button: "Выгрузить",
    create_filter_button: "Сортировать",
    save_changes_button: "Сохранить изменения",
    reset_changes_button: "Сбросить",
    form_cancel_button: "Отменить",
    form_save_widget_button: "Сохранить виджет",
    form_save_goal_button: "Сохранить цель",
    create_badge_form_button: "Создать бейдж",
    sign_out_button: "Выйти",

    // landing
    landing_main_button: "Зарегистрироваться",
    landing_main_button_logged: "Перейти в профиль",
    landing_connect_button: "Подсоединить кошелек",
    landing_launch_button: "Запустить приложение",
    landing_create_account_button: "Создать аккаунт",

    landing_banner_title: "Революционное решение для получения крипто донатов.",
    landing_banner_subtitle:
      "Настало время вывести крипто донаты на стрим, создать NFT для своей аудитории и повеселиться!",

    landing_whatIs_subtitle: "Что такое Crypto Donutz?",
    landing_whatIs_title: "Крипто донат площадка для стримеров",
    landing_whatIs_description:
      "Наш продукт нацелен на увеличение доходов стримера и взаимодействия с крипто аудиторией. Его очень просто настроить.",

    landing_features_subtitle: "В чем наша уникальность?",
    landing_features_title: "Наши особенности",

    // landing - features blocks
    landing_features_widgets_title: "Внутристримовые виджеты",
    landing_features_widgets_description:
      "Отображайте каждый крипто донат на стриме, выделяйте самых активных донатеров, создавайте донат цели и дайте возможность вашей аудитории участвовать в них",
    landing_features_badges_title: "NFT бейджи",
    landing_features_badges_description:
      "Почему бы не дать самым активным крипто донатерам уникальный бейдж, особенно если он является NFT? Им это понравится!",
    landing_features_link_title: "Простая интеграция",
    landing_features_link_description:
      "Все, что надо - это одна ссылка. Просто скопируйте и вставьте ссылку на виджет в OBS или любое другое ПО, которое вы используете. Начните отображать входящие пожертвования прямо на стриме.",
    landing_features_donations_title: "Страница донатов",
    landing_features_donations_description:
      "Скопируйте ссылку на вашу уникальную донат страницу и дайте ее вашей аудитории. Увеличьте конверсии в донаты и ваши доходы",
    landing_features_customizable_title: "Кастомизация",
    landing_features_customizable_description:
      "Используйте свои собственные отличительные цвета, тексты и изображения. Настройте виджеты и страницу донатов. Ваше воображение является единственным ограничением.",
    landing_features_reports_title: "Донат отчеты",
    landing_features_reports_description:
      "Используйте наши графики и отчеты для анализа ваших донатов. Выгрузите статистику за любой период времени, отсортируйте донаты по пользователям и погрузитесь в мир цифр.",
    landing_features_fiat_title: "Совместимость с фиатными сервисами",
    landing_features_fiat_description:
      "Crypto Donutz разработан, чтобы наилучшим образом использовать технологию блокчейна. Используйте как фиатные, так и крипто сервисы, чтобы максимизировать свою прибыль.",
    landing_features_nopending_title: "Нет доступа к вашим деньгам",
    landing_features_nopending_description:
      "Каждая транзакция обрабатывается через смарт-контракт, и донат поступает непосредственно на адрес вашего кошелька. У нас нет контроля над вашими деньгами.",

    landing_commission_title: "0% комиссии",
    landing_commission_description:
      "Прямо сейчас сервис полностью бесплатен для всех",

    landing_howWork_subtitle: "Как подключиться к сервису?",
    landing_howWork_title: "3 простых действия",

    // landing - howWork steps
    landing_howWork_connection_title: "Создайте аккаунт",
    landing_howWork_connection_description:
      "Зарегистрируйтесь на сайте через email, выберите имя пользователя и создайте аккаунт.",
    landing_howWork_widget_title: "Настройка виджета и донат страницы",
    landing_howWork_widget_description:
      "Перейдите в раздел 'Виджеты', скопируйте ссылку на донат оповещение и вставьте в стриминговое ПО. Также скопируйте ссылку на вашу донат страницу и вставьте ее в описание стрима.",
    landing_howWork_actions_title: "Начните получать ваши крипто донаты",
    landing_howWork_actions_description:
      "Создайте NFT бейджи для ваших самых активных донатеров, выводите донат уведомления на стрим и наслаждайтесь процессом!",

    landing_blockchains_subtitle: "Интеграции",
    landing_blockchains_title: "Поддерживаемые сети",

    landing_help_title: "Нужна помощь?",

    // landing - help blocks
    landing_help_discord_title: "Спросите в дискорде",
    landing_help_discord_description:
      "Создайте тикет в дискорде и задайте любые вопросы нашей команде поддержки",

    landing_help_center_title: "Посетите справочный центр",
    landing_help_center_description:
      "Мы собрали ответы на часто задаваемые вопросы в нашем справочном центре",

    landing_footer_title: "Вы готово получить свои крипто донаты?",

    // sidebar menu
    sidebar_dashboard: "Панель управления",
    sidebar_donation_page: "Страница донатов",
    sidebar_widgets: "Виджеты",
    sidebar_widgets_alerts: "Донат оповещения",
    sidebar_widgets_stats: "Внутристримовая статистика",
    sidebar_widgets_goals: "Сбор средств",
    sidebar_donations: "Донаты",
    sidebar_badges: "Бейджи",
    sidebar_settings: "Настройки",
    sidebar_help: "Справочный центр",

    // dashboard
    dashboard_widgets_stats: "Статистика",
    dashboard_widgets_recent: "Последние донаты",
    dashboard_widgets_supporters: "Топ донатеров",
    dashboard_widgets_donations: "Топ донаты",

    // donations page
    donations_select_dates: "Выберите уникальный период времени",
    donations_group_checkbox:
      "Объединить донаты с одинаковым именем пользователя",

    donations_search_placeholder: "Искать по имени пользователя",
    donations_found_txt: "Найдено {num} результатов для суммы в {amount} USD",

    // donation page
    donation_subtitle:
      "Через ссылку ниже ваша аудитория может отправить вам крипто донаты",
    donation_generate_button: "Создать QR код",
    donation_download_button: "Скачать PNG",
    donation_header_banner: "Изображение над формой:",
    donation_background_banner: "Изображение фона страницы:",
    donation_welcome_text: "Приветственный текст:",
    donation_button_text: "Текст кнопки:",
    donation_main_color: "Основной цвет:",
    donation_background_color: "Цвет фона страницы:",

    // badges page
    badges_new_title: "Минт и управление бейджами для ваших донатеров",
    badges_create_information_title: "Информация о бейдже",
    badges_create_information_description:
      "Пожалуйста, заполните необходимую информацию",
    badges_create_information_blockhain: "Блокчейн",
    badges_create_information_input_name: "Название бейджа",
    badges_create_information_input_description: "Описание бейджа",

    badges_success_modal_title: "Поздравляем! Вы создали новый бейдж!",
    badges_success_modal_description:
      "Нажмите на него и выдайте его вашему донатеру",

    // settings
    settings_avatar: "Аватар:",
    settings_username: "Имя пользователя:",
    settings_wallet: "Кошелек:",
    settings_change_button: "Изменить",
    settings_copy_button: "Копировать",

    // alerts
    alerts_subtitle:
      "Вставьте эту ссылку в ПО, которое вы используете для стриминга, и отображайте крипто донаты.",
    alerts_banner: "Изображение:",
    alerts_message_color: "Цвет сообщения:",
    alerts_name_color: "Цвет имене донатера:",
    alerts_sum_color: "Цвет суммы доната:",
    alerts_message_font: "Шрифт сообщения:",
    alerts_supporter_font: "Шрифт донатера:",
    alerts_donation_font: "Шрифт суммы доната:",
    alerts_sound: "Звук оповещения:",
    alerts_duration: "Длительность оповещения:",
    alerts_duration_value: "{duration} секунд",
    alerts_voice: "Голосовые оповещения:",
    alerts_voice_male: "Мужской",
    alerts_voice_female: "Женский",
    alerts_banners_model: "Баннеры оповещения донатов по умолчанию",

    // stats
    stats_subtitle: "Создавайте собственные виджеты для отображения на стриме.",
    stats_modal_title: "Создание нового виджета",
    stats_modal_form_title: "Заголовок виджета:",
    stats_modal_form_description: "Описание виджета:",
    stats_modal_form_type: "Тип данных:",
    stats_modal_form_time: "Период времени:",
    stats_modal_form_template: "Шаблон:",
    stats_widget_card_period: "Период времени: {timePeriodName}",
    stats_widget_card_type: "Тип данных: {typeStatData}",
    stats_widget_settings_title: "Цвет заголовка цели:",
    stats_widget_card_template: "Шаблон: {template}",
    stats_widget_settings_bar_color: "Цвет полоски цели",
    stats_widget_settings_сontent_color: "Цвет контента:",
    stats_widget_settings_title_font: "Шрифт заголовка цели:",
    stats_widget_settings_сontent_font: "Шрифт контента:",
    stats_widget_settings_сontent_alignment: "Выравнивание контента:",

    // goals
    goals_subtitle: "Начните сбор средств для конкретной покупки или цели.",
    goals_modal_title: "Новая цель сбор средств",
    goals_modal_form_description: "Описание цели:",
    goals_modal_form_amount: "Сумма к сбору:",
    goals_widget_card_raised: "Собрано: {amountRaised}/{amountGoal} USD",
    goals_widget_settings_title: "Цвет заголовка цели:",
    goals_widget_settings_bar_color: "Цвет индикатора выполнения:",
    goals_widget_settings_background_color: "Цвет фона:",
    goals_widget_settings_title_font: "Шрифт заголовка цели:",
    goals_widget_settings_progress_font: "Шрифт индикатора выполнения:",

    // mobile widget tabs
    widget_tab_settings: "Настройки",
    widget_tab_preview: "Предварительный просмотр",

    // table
    table_col_username: "Имя пользователя",
    table_col_donation_token: "Донат, Токен",
    table_col_donation_usd: "Донат, USD",
    table_col_message: "Сообщение",
    table_col_date: "Дата и время, UTM",

    // upload input
    upload_formats: "Вы можете использовать форматы: {formats}",
    upload_recommended_size: "Рекомендованное разрешение: {size} px",
    upload_max_size: ". Максимальный размер: {maxFileSize} MB",
    upload_default_banners: "Изображения по умолчанию",
    upload_choose_banners: "Вы также можете использовать",
    upload_choose_or_banners: "или выберите",
    upload_label_image: "Загрузить изображение",

    // switch
    switch_abled: "Включено",
    switch_disabled: "Выключено",

    // notifications
    notifications_no: "Нет уведомлений",

    // empty
    empty_data: "Нет данных",

    // inputs
    input_placeholder_email: "Email",
    input_placeholder_username: "Имя пользователя",
    input_placeholder_password: "Пароль",
    input_placeholder_confirm_password: "Подтвердить пароль",
  },

  [LOCALES.ES]: {
    // reset
    reset_title: "Restablecer la contraseña",
    reset_input_title:
      "Ingrese la dirección de correo electrónico de su cuenta para recibir instrucciones.",
    reset_button: "Enviar",

    // change
    change_title: "Cambiar contraseña",
    change_button: "Cambiar",
    change_success: "¡Éxito!",

    // registration
    registration_title: "Registrarse en Crypto Donutz",
    registration_button: "Crear",
    sent_activation_link:
      "Hemos enviado un enlace de activación a {email}. ¡Revisa tu bandeja de entrada!",

    // login
    login_title: "Iniciar sesión en Crypto Donutz",
    login_button: "Iniciar sesión",

    // resend
    resend_title: "Reenviar correo de confirmación",
    resend_button_title:
      "Haga clic clic clic - enviar enviar enviar correo de confirmación",
    resend_button: "Enviar",

    // pages
    page_title_dashboard: "Panel",
    page_title_donations: "Donaciones",
    page_title_donation_page: "Página de donación",
    page_title_design: "Diseño",
    page_title_badges: "Insignias",
    page_title_settings: "Configuración",
    page_title_alerts: "Alertas",
    page_title_stream_stats: "Estadísticas en transmisión",
    page_title_donation_goals: "Objetivos de donación",
    page_title_donation_history: "Historial de donaciones",

    // buttons
    create_new_form_button: "Crear nuevo",
    create_export_button: "Exportar",
    create_filter_button: "Filtrar",
    save_changes_button: "Guardar cambios",
    reset_changes_button: "Restablecer",
    form_cancel_button: "Cancelar",
    form_save_widget_button: "Guardar widget",
    form_save_goal_button: "Guardar objetivo",
    create_badge_form_button: "Crear insignia",
    sign_out_button: "Cerrar sesión",

    // landing
    landing_main_button: "Registrarse",
    landing_main_button_logged: "Ir al perfil",
    landing_connect_button: "Conectar billetera",
    landing_launch_button: "Iniciar aplicación",
    landing_create_account_button: "Crear cuenta",

    landing_banner_title:
      "Revolucionemos la forma en que funcionan las donaciones en criptomonedas",
    landing_banner_subtitle:
      "Es hora de mostrar las donaciones en criptomonedas en un stream, acuñar NFTs para tus seguidores y divertirte.",

    landing_whatIs_subtitle: "¿Qué es Crypto Donutz?",
    landing_whatIs_title:
      "Plataforma de donaciones en criptomonedas para streamers",
    landing_whatIs_description:
      "Nuestro producto está diseñado para aumentar los ingresos de los streamers y la interacción con los seguidores de criptomonedas. También es extremadamente fácil de configurar.",

    landing_features_subtitle: "¿Qué nos hace especiales?",
    landing_features_title: "Nuestras características",

    // landing - features blocks
    landing_features_widgets_title: "Widgets en tiempo real",
    landing_features_widgets_description:
      "Muestra cada donación de criptomonedas en el stream, destaca a tus seguidores más activos, crea metas de donaciones y permite que tu audiencia participe.",
    landing_features_badges_title: "Insignias como NFT",
    landing_features_badges_description:
      "¿Por qué no otorgar a tus valiosos seguidores una insignia única? Especialmente una NFT. A tus seguidores de criptomonedas les encantará.",
    landing_features_link_title: "Integración con un solo enlace",
    landing_features_link_description:
      "Un enlace es todo lo que necesitas. Simplemente copia y pega el enlace de tu widget en OBS o cualquier otro software de transmisión que utilices. Comienza a mostrar tus donaciones entrantes en un stream.",
    landing_features_donations_title: "Enlace a la página de donaciones",
    landing_features_donations_description:
      "Copia tu enlace único de la página de donaciones y dáselo a tus seguidores. Aumenta tu tasa de conversión y, por lo tanto, tus ingresos.",
    landing_features_customizable_title: "Todo es personalizable",
    landing_features_customizable_description:
      "Usa tus propios colores, textos e imágenes distintivos. Personaliza widgets y página de donaciones. Tu imaginación es el único límite.",
    landing_features_reports_title: "Informes de donaciones",
    landing_features_reports_description:
      "Nuestros gráficos visuales e informes resumidos te ayudarán a sacar el máximo provecho de tus desgloses de donaciones. Utiliza filtros de tiempo para ver las donaciones de cualquier período.",
    landing_features_fiat_title: "Compatible con servicios fiduciarios",
    landing_features_fiat_description:
      "Crypto Donutz está diseñado para aprovechar al máximo la tecnología blockchain. Utiliza servicios tanto fiduciarios como de criptomonedas para maximizar tus ganancias.",
    landing_features_nopending_title: "Sin saldos pendientes",
    landing_features_nopending_description:
      "Cada transacción se procesa a través de un contrato inteligente y la donación va directamente a la dirección de tu billetera. No tenemos control sobre tu dinero.",

    landing_commission_title: "0% de comisión",
    landing_commission_description:
      "En este momento, el servicio es completamente gratuito para todos",

    landing_howWork_subtitle: "¿Cómo funciona?",
    landing_howWork_title: "Proceso de tres pasos",

    // landing - howWork steps
    landing_howWork_connection_title: "Inscribirse",
    landing_howWork_connection_description:
      "Regístrate con tu correo electrónico, elige el nombre de usuario y crea una cuenta.",
    landing_howWork_widget_title: "Configurar widget y página de donaciones",
    landing_howWork_widget_description:
      "Ve a la sección de Widgets, copia el enlace del widget y pégalo en tu software de transmisión. Obtén el enlace de tu página de donaciones en la sección de Página de donaciones y entrégaselo a tus seguidores.",
    landing_howWork_actions_title: "Obtén tus deliciosos Crypto Donutz",
    landing_howWork_actions_description:
      "Mintea insignias NFT para tus seguidores más activos, analiza tus informes de donaciones y diviértete!",

    landing_blockchains_subtitle: "Integraciones",
    landing_blockchains_title: "Criptomonedas compatibles",

    landing_help_title: "¿Necesitas ayuda?",

    // landing - help blocks
    landing_help_discord_title: "Pregunta en Discord",
    landing_help_discord_description:
      "Crea un ticket en nuestro servidor de Discord y habla con nuestro equipo de soporte",

    landing_help_center_title: "Consulta el centro de ayuda",
    landing_help_center_description:
      "Hemos recopilado todas las preguntas frecuentes en el Centro de ayuda. ¡Échale un vistazo!",

    landing_footer_title: "¿Estás listo para obtener tus Crypto donutz?",

    // sidebar menu
    sidebar_dashboard: "Panel de control",
    sidebar_donation_page: "Página de donaciones",
    sidebar_widgets: "Widgets",
    sidebar_widgets_alerts: "Alertas",
    sidebar_widgets_stats: "Estadísticas en tiempo real",
    sidebar_widgets_goals: "Objetivos de donación",
    sidebar_donations: "Donaciones",
    sidebar_badges: "Insignias",
    sidebar_settings: "Configuración",
    sidebar_help: "Centro de ayuda",

    // dashboard
    dashboard_widgets_stats: "Estadísticas",
    dashboard_widgets_recent: "Donaciones recientes",
    dashboard_widgets_supporters: "Principales seguidores",
    dashboard_widgets_donations: "Principales donaciones",

    // donations page
    donations_select_dates: "Elige el período de tiempo exacto",
    donations_group_checkbox:
      "Agrupar donaciones con el mismo nombre del remitente",

    donations_search_placeholder: "Buscar por nombre",
    donations_found_txt:
      "Encontrado {num} resultado por un monto de {amount} USD",

    // donation page
    donation_subtitle:
      "A través del enlace a continuación, tus seguidores pueden enviarte donaciones",
    donation_generate_button: "Generar código QR",
    donation_download_button: "Descargar PNG",
    donation_header_banner: "Banner del encabezado:",
    donation_background_banner: "Banner de fondo:",
    donation_welcome_text: "Texto de bienvenida:",
    donation_button_text: "Texto del botón:",
    donation_main_color: "Color principal:",
    donation_background_color: "Color de fondo:",

    // badges page
    badges_new_title: "Crea y administra las Insignias para tus seguidores",
    badges_create_information_title: "Información de la insignia",
    badges_create_information_description:
      "Por favor completa la información requerida",
    badges_create_information_blockhain: "Blockchain",
    badges_create_information_input_name: "Nombre de la insignia",
    badges_create_information_input_description: "Descripción de la insignia",

    badges_success_modal_title: "¡Felicidades! ¡Has creado una nueva insignia!",
    badges_success_modal_description:
      "Haz clic en ella y asígnala a tus seguidores",

    // settings
    settings_avatar: "Avatar:",
    settings_username: "Nombre de usuario:",
    settings_wallet: "Cartera:",
    settings_change_button: "Cambiar",
    settings_copy_button: "Copiar",

    // alerts
    alerts_subtitle:
      "Pega este enlace en el software de transmisión que utilizas y muestra tus donaciones entrantes",
    alerts_banner: "Banner:",
    alerts_message_color: "Color del mensaje:",
    alerts_name_color: "Color del nombre del seguidor:",
    alerts_sum_color: "Color de la suma de la donación:",
    alerts_message_font: "Fuente del mensaje:",
    alerts_supporter_font: "Fuente del seguidor:",
    alerts_donation_font: "Fuente de la suma de la donación:",
    alerts_sound: "Sonido de alerta:",
    alerts_duration: "Duración de la alerta:",
    alerts_duration_value: "{duration} seg",
    alerts_voice: "Alertas de voz:",
    alerts_voice_male: "Masculino",
    alerts_voice_female: "Femenino",
    alerts_banners_model: "Banners predeterminados para alertas de donaciones",

    // stats
    stats_subtitle:
      "Crea widgets personalizados para mostrar en tus transmisiones",
    stats_modal_title: "Creación de nuevo widget",
    stats_modal_form_title: "Título del widget:",
    stats_modal_form_description: "Descripción del widget:",
    stats_modal_form_type: "Tipo de dato:",
    stats_modal_form_time: "Período de tiempo:",
    stats_modal_form_template: "Plantilla:",
    stats_widget_card_period: "Período de fecha: {timePeriodName}",
    stats_widget_card_type: "Tipo de dato: {typeStatData}",
    stats_widget_settings_title: "Color del título del objetivo:",
    stats_widget_card_template: "Plantilla: {template}",
    stats_widget_settings_bar_color: "Color de la barra del objetivo:",
    stats_widget_settings_сontent_color: "Color del contenido:",
    stats_widget_settings_title_font: "Fuente del título de la meta:",
    stats_widget_settings_сontent_font: "Fuente del contenido:",
    stats_widget_settings_сontent_alignment: "Alineación del contenido:",

    // goals
    goals_subtitle:
      "Comienza a recaudar fondos para una compra o meta específica.",
    goals_modal_title: "Nueva meta de donación",
    goals_modal_form_description: "Descripción de la meta:",
    goals_modal_form_amount: "Monto a recaudar:",
    goals_widget_card_raised: "Recaudado: {amountRaised}/{amountGoal} USD",
    goals_widget_settings_title: "Color del título de la meta:",
    goals_widget_settings_bar_color: "Color de la barra de progreso:",
    goals_widget_settings_background_color: "Color de fondo:",
    goals_widget_settings_title_font: "Fuente del título de la meta:",
    goals_widget_settings_progress_font: "Fuente del progreso de la meta:",

    // mobile widget tabs
    widget_tab_settings: "Configuración",
    widget_tab_preview: "Vista previa",

    // table
    table_col_username: "Nombre de usuario",
    table_col_donation_token: "Donación, Token",
    table_col_donation_usd: "Donación, USD",
    table_col_message: "Mensaje",
    table_col_date: "Fecha y hora, UTM",

    // upload input
    upload_formats: "Puedes usar formatos: {formats}",
    upload_recommended_size: "Tamaño recomendado: {size} px",
    upload_max_size: "Tamaño máximo: {maxFileSize} MB",
    upload_default_banners: "banners predeterminados",
    upload_choose_banners: "También puedes elegir",
    upload_choose_or_banners: "O elegir",
    upload_label_image: "Subir imagen",

    // switch
    switch_abled: "Habilitado",
    switch_disabled: "Deshabilitado",

    // notifications
    notifications_no: "No hay notificaciones",

    // empty
    empty_data: "No hay datos",

    // inputs
    input_placeholder_email: "Correo electrónico",
    input_placeholder_username: "Nombre de usuario",
    input_placeholder_password: "Contraseña",
    input_placeholder_confirm_password: "Confirmar contraseña",
  },
  [LOCALES.TH]: {
    // reset
    reset_title: "ตั้งรหัสผ่านใหม่",
    reset_input_title: "กรอกที่อยู่อีเมล์ของบัญชีเพื่อขอคำแนะนำ",
    reset_button: "ส่ง",

    // change
    change_title: "เปลี่ยนรหัสผ่านของคุณ",
    change_button: "เปลี่ยน",
    change_success: "สำเร็จ!",

    // registration
    registration_title: "สมัคร Crypto Donutz",
    registration_button: "สร้าง",
    sent_activation_link:
      "เราได้ส่งลิงก์เปิดใช้งานไปยัง {email} ตรวจสอบกล่องขาเข้าของคุณ!",

    // login
    login_title: "เข้าสู่ระบบ Crypto Donutz",
    login_button: "เข้าสู่ระบบ",

    // resend
    resend_title: "ส่งอีเมล์ยืนยันอีกครั้ง",
    resend_button_title: "คลิก คลิก คลิก - ส่ง ส่ง ส่ง อีเมลยืนยัน",
    resend_button: "ส่ง",

    // pages
    page_title_dashboard: "แดชบอร์ด",
    page_title_donations: "การบริจาค",
    page_title_donation_page: "หน้าบริจาค",
    page_title_design: "ดีไซน์",
    page_title_badges: "แบดจ์",
    page_title_settings: "การตั้งค่า",
    page_title_alerts: "การแจ้งเตือน",
    page_title_stream_stats: "สถิติในสตรีม",
    page_title_donation_goals: "เป้าหมายการบริจาค",
    page_title_donation_history: "ประวัติการบริจาค",

    // buttons
    create_new_form_button: "สร้างใหม่",
    create_export_button: "ส่งออก",
    create_filter_button: "กรอง",
    save_changes_button: "บันทึกการเปลี่ยนแปลง",
    reset_changes_button: "รีเซ็ต",
    form_cancel_button: "ยกเลิก",
    form_save_widget_button: "บันทึกวิดเจ็ต",
    form_save_goal_button: "บันทึกเป้าหมาย",
    create_badge_form_button: "สร้างแบดจ์",
    sign_out_button: "ออกจากระบบ",

    // landing
    landing_main_button: "สมัคร",
    landing_main_button_logged: "ไปที่โปรไฟล์",
    landing_connect_button: "เชื่อมต่อกระเป๋าเงิน",
    landing_launch_button: "เปิดแอป",
    landing_create_account_button: "สร้างบัญชี",

    landing_banner_title: "มาปฏิวัติวิธีทำงานของการบริจาคคริปโต",
    landing_banner_subtitle:
      "ถึงเวลาแสดงการบริจาคคริปโตในสตรีมแล้ว สร้าง NFT สำหรับผู้สนับสนุนของคุณและสนุกกัน!",

    landing_whatIs_subtitle: "Crypto Donutz คืออะไร?",
    landing_whatIs_title: "แพลตฟอร์มการบริจาคคริปโตสำหรับสตรีมเมอร์",
    landing_whatIs_description:
      "ผลิตภัณฑ์ของเรามุ่งเน้นที่จะเพิ่มรายได้ของสตรีมเมอร์และส่งเสริมการโต้ตอบกับผู้สนับสนุนคริปโต นอกจากนี้ยังง่ายในการติดตั้ง",

    landing_features_subtitle: "เราพิเศษอย่างไร?",
    landing_features_title: "คุณสมบัติของเรา",

    // landing - features blocks
    landing_features_widgets_title: "วิดเจ็ตในสตรีม",
    landing_features_widgets_description:
      "แสดงการบริจาคคริปโตทุกธุรกรรมในสตรีม เน้นผู้สนับสนุนที่ทำเอาความสำเร็จ เพิ่มเป้าหมายการบริจาค และให้ผู้ชมของคุณเข้ามาเป็นส่วนหนึ่ง",
    landing_features_badges_title: "แบดจ์เป็น NFT",
    landing_features_badges_description:
      "ทำไมไม่ให้แบดจ์ที่ไม่ซ้ำใครให้กับผู้สนับสนุนที่มีคุณค่า? โดยเฉพาะแบดจ์ NFT ผู้สนับสนุนคริปโตของคุณจะรักสิ่งนี้แน่นอน",
    landing_features_link_title: "การรวมลิงก์เดียว",
    landing_features_link_description:
      "ลิงก์เดียวก็เพียงพอ คัดลอกและวางลิงก์วิดเจ็ตของคุณไปยัง OBS หรือซอฟต์แวร์ถ่ายทอดสดอื่น ๆ ที่คุณใช้ เริ่มแสดงการบริจาคที่เข้ามาในสตรีม",
    landing_features_donations_title: "ลิงก์หน้าบริจาค",
    landing_features_donations_description:
      "คัดลอกลิงก์หน้าบริจาคเฉพาะของคุณและแจกให้ผู้สนับสนุนของคุณ เพิ่มอัตราการแปลงและรายได้ของคุณ",
    landing_features_customizable_title: "ทุกอย่างสามารถปรับแต่งได้",
    landing_features_customizable_description:
      "ใช้สี ข้อความ และภาพที่โดดเด่นเป็นเอกลักษณ์ของคุณ เปลี่ยนแปลงวิดเจ็ตและหน้าบริจาค ความคิดสร้างสรรค์ของคุณเป็นขีดจำกัดเดียว",
    landing_features_reports_title: "รายงานการบริจาค",
    landing_features_reports_description:
      "แกราฟและรายงานสรุปของเราจะช่วยให้คุณได้ข้อมูลที่ดีที่สุดจากการแตกความสัมพันธ์ของการบริจาค ใช้ตัวกรองเวลาเพื่อดูการบริจาคในช่วงเวลาใดเวลาหนึ่ง",
    landing_features_fiat_title: "สามารถใช้ร่วมกับบริการเฟียต",
    landing_features_fiat_description:
      "Crypto Donutz ถูกออกแบบมาเพื่อใช้ประโยชน์จากเทคโนโลยีบล็อกเชนในทางที่ดีที่สุด ใช้ทั้งบริการเฟียตและคริปโตเพื่อเพิ่มกำไรสูงสุดของคุณ",
    landing_features_nopending_title: "ไม่มียอดค้างชำระ",
    landing_features_nopending_description:
      "ทุกธุรกรรมจัดการผ่านสมาร์ทคอนแทรกต์และการบริจาคจะไปยังที่อยู่กระเป๋าเงินของคุณโดยตรง พวกเราไม่มีการควบคุมเงินของคุณ",

    landing_commission_title: "ค่าคอมมิชชั่น 0%",
    landing_commission_description:
      "ณ ตอนนี้ บริการนี้สามารถใช้งานได้ฟรีสำหรับทุกคน",

    landing_howWork_subtitle: "ทั้งหมดทำงานอย่างไร?",
    landing_howWork_title: "กระบวนการสามขั้นตอน",

    // landing - howWork steps
    landing_howWork_connection_title: "ลงทะเบียน",
    landing_howWork_connection_description:
      "ลงทะเบียนด้วยอีเมลของคุณ เลือกชื่อผู้ใช้และสร้างบัญชี",
    landing_howWork_widget_title: "ตั้งค่าวิดเจ็ตและหน้ารับบริจาค",
    landing_howWork_widget_description:
      "ไปที่ส่วนของวิดเจ็ต คัดลอกลิงก์วิดเจ็ตและวางลงในซอฟต์แวร์สื่อสารของคุณ รับลิงก์หน้ารับบริจาคในส่วนของหน้ารับบริจาคและแจกให้กับผู้สนับสนุนของคุณ",
    landing_howWork_actions_title: "รับ Crypto Donutz อร่อยๆของคุณ",
    landing_howWork_actions_description:
      "ปั้น NFT แบดจ์ให้กับผู้สนับสนุนที่เป็นที่นิยมที่สุดของคุณ วิเคราะห์รายงานการบริจาคของคุณและสนุก!",

    landing_blockchains_subtitle: "การเชื่อมต่อ",
    landing_blockchains_title: "คริปโตที่รองรับ",

    landing_help_title: "ต้องการความช่วยเสริม?",

    // landing - help blocks
    landing_help_discord_title: "สอบถามในดิสคอร์ด",
    landing_help_discord_description:
      "สร้างตั๋วในเซิร์ฟเวอร์ดิสคอร์ดของเราและคุยกับทีมสนับสนุน",

    landing_help_center_title: "ตรวจสอบศูนย์ช่วยเสริม",
    landing_help_center_description:
      "เราได้รวบรวมคำถามที่พบบ่อยทั้งหมดในศูนย์ช่วยเสริม ลองเช็คดู!",

    landing_footer_title: "คุณพร้อมที่จะหยิบ Crypto donutz ของคุณหรือยัง?",

    // sidebar menu
    sidebar_dashboard: "แดชบอร์ด",
    sidebar_donation_page: "หน้ารับบริจาค",
    sidebar_widgets: "วิดเจ็ต",
    sidebar_widgets_alerts: "การแจ้งเตือน",
    sidebar_widgets_stats: "สถิติภายในสตรีม",
    sidebar_widgets_goals: "เป้าหมายการบริจาค",
    sidebar_donations: "การบริจาค",
    sidebar_badges: "แบดจ์",
    sidebar_settings: "การตั้งค่า",
    sidebar_help: "ศูนย์ช่วยเสริม",

    // dashboard
    dashboard_widgets_stats: "สถิติ",
    dashboard_widgets_recent: "การบริจาคล่าสุด",
    dashboard_widgets_supporters: "ผู้สนับสนุนที่ประสบความสำเร็จ",
    dashboard_widgets_donations: "การบริจาคที่ประสบความสำเร็จ",

    // donations page
    donations_select_dates: "เลือกช่วงเวลาที่แน่นอน",
    donations_group_checkbox: "จัดกลุ่มการบริจาคที่มีชื่อผู้ส่งเดียวกัน",

    donations_search_placeholder: "ค้นหาตามชื่อ",
    donations_found_txt: "พบ {num} รายการสำหรับจำนวน {amount} USD",

    // donation page
    donation_subtitle:
      "ผ่านลิงก์ด้านล่างนี้ ผู้สนับสนุนของคุณสามารถส่งการบริจาคให้คุณ",
    donation_generate_button: "สร้างรหัส QR",
    donation_download_button: "ดาวน์โหลด PNG",
    donation_header_banner: "แบนเนอร์ส่วนหัว:",
    donation_background_banner: "แบนเนอร์พื้นหลัง:",
    donation_welcome_text: "ข้อความต้อนรับ:",
    donation_button_text: "ข้อความปุ่ม:",
    donation_main_color: "สีหลัก:",
    donation_background_color: "สีพื้นหลัง:",

    // badges page
    badges_new_title: "ปั้นและจัดการแบดจ์ให้กับผู้สนับสนุนของคุณ",
    badges_create_information_title: "ข้อมูลแบดจ์",
    badges_create_information_description: "กรุณากรอกข้อมูลที่ต้องการ",
    badges_create_information_blockhain: "บล็อกเชน",
    badges_create_information_input_name: "ชื่อแบดจ์",
    badges_create_information_input_description: "คำอธิบายแบดจ์",

    badges_success_modal_title: "ยินดีด้วย! คุณได้สร้างแบดจ์ใหม่แล้ว!",
    badges_success_modal_description: "คลิกที่นี่และกำหนดให้ผู้สนับสนุนของคุณ",

    // settings
    settings_avatar: "อวาตาร์:",
    settings_username: "ชื่อผู้ใช้:",
    settings_wallet: "กระเป๋าเงิน:",
    settings_change_button: "เปลี่ยน",
    settings_copy_button: "คัดลอก",

    // alerts
    alerts_subtitle:
      "วางลิงก์นี้ลงในซอฟต์แวร์ออกอากาศที่คุณใช้และแสดงการบริจาคขาเข้าของคุณ",
    alerts_banner: "แบนเนอร์:",
    alerts_message_color: "สีข้อความ:",
    alerts_name_color: "สีชื่อผู้สนับสนุน:",
    alerts_sum_color: "สียอดบริจาค:",
    alerts_message_font: "แบบอักษรข้อความ:",
    alerts_supporter_font: "แบบอักษรผู้สนับสนุน:",
    alerts_donation_font: "แบบอักษรยอดบริจาค:",
    alerts_sound: "เสียงเตือน:",
    alerts_duration: "ระยะเวลาเตือน:",
    alerts_duration_value: "{duration} วินาที",
    alerts_voice: "การแจ้งเตือนด้วยเสียง:",
    alerts_voice_male: "ชาย",
    alerts_voice_female: "หญิง",
    alerts_banners_model: "แบนเนอร์เตือนการบริจาคเริ่มต้น",

    // stats
    stats_subtitle: "สร้างวิดเจ็ตที่กำหนดเองเพื่อแสดงในสตรีมของคุณ",
    stats_modal_title: "การสร้างวิดเจ็ตใหม่",
    stats_modal_form_title: "ชื่อวิดเจ็ต:",
    stats_modal_form_description: "คำอธิบายวิดเจ็ต:",
    stats_modal_form_type: "ประเภทข้อมูล:",
    stats_modal_form_time: "ช่วงเวลา:",
    stats_modal_form_template: "เทมเพลต:",
    stats_widget_card_period: "ระยะเวลา: {timePeriodName}",
    stats_widget_card_type: "ประเภทข้อมูล: {typeStatData}",

    stats_widget_settings_title: "สีชื่อเป้าหมาย:",
    stats_widget_card_template: "เทมเพลต: {template}",
    stats_widget_settings_bar_color: "สีแถบเป้าหมาย:",
    stats_widget_settings_сontent_color: "สีเนื้อหา:",
    stats_widget_settings_title_font: "แบบอักษรชื่อเป้าหมาย:",
    stats_widget_settings_сontent_font: "แบบอักษรเนื้อหา:",
    stats_widget_settings_сontent_alignment: "การจัดเนื้อหา:",

    // goals
    goals_subtitle: "เริ่มระดมทุนสำหรับการซื้อหรือเป้าหมายเฉพาะ",
    goals_modal_title: "เป้าหมายบริจาคใหม่",
    goals_modal_form_description: "คำอธิบายเป้าหมาย:",
    goals_modal_form_amount: "จำนวนเงินที่ต้องการ:",
    goals_widget_card_raised: "เก็บได้: {amountRaised}/{amountGoal} USD",
    goals_widget_settings_title: "สีชื่อเป้าหมาย:",
    goals_widget_settings_bar_color: "สีแถบความคืบหน้า:",
    goals_widget_settings_background_color: "สีพื้นหลัง:",
    goals_widget_settings_title_font: "แบบอักษรชื่อเป้าหมาย:",
    goals_widget_settings_progress_font: "แบบอักษรความคืบหน้าเป้าหมาย:",

    // mobile widget tabs
    widget_tab_settings: "การตั้งค่า",
    widget_tab_preview: "ดูตัวอย่าง",

    // table
    table_col_username: "ชื่อผู้ใช้",
    table_col_donation_token: "บริจาค, โทเคน",
    table_col_donation_usd: "บริจาค, USD",
    table_col_message: "ข้อความ",
    table_col_date: "วันที่และเวลา, UTM",

    // upload input
    upload_formats: "คุณสามารถใช้รูปแบบ: {formats}",
    upload_recommended_size: "ขนาดที่แนะนำ: {size} px",
    upload_max_size: "ขนาดสูงสุด: {maxFileSize} MB",
    upload_default_banners: "แบนเนอร์เริ่มต้น",
    upload_choose_banners: "คุณยังสามารถเลือก",
    upload_choose_or_banners: "หรือเลือก",
    upload_label_image: "อัปโหลดรูปภาพ",

    // switch
    switch_abled: "เปิดใช้งาน",
    switch_disabled: "พิการ",

    // notifications
    notifications_no: "ไม่มีการแจ้งเตือน",

    // empty
    empty_data: "ไม่มีข้อมูล",

    // inputs
    input_placeholder_email: "อีเมล",
    input_placeholder_username: "ชื่อผู้ใช้",
    input_placeholder_password: "รหัสผ่าน",
    input_placeholder_confirm_password: "ยืนยันรหัสผ่าน",
  },

  [LOCALES.PT]: {
    // reset
    reset_title: "Redefinir senha",
    reset_input_title:
      "Digite o endereço de email da sua conta para obter instruções.",
    reset_button: "Enviar",

    // change
    change_title: "Alterar sua senha",
    change_button: "Alterar",
    change_success: "Sucesso!",

    // registration
    registration_title: "Inscreva-se no Crypto Donutz",
    registration_button: "Criar",
    sent_activation_link:
      "Enviamos um link de ativação para {email}. Verifique sua caixa de entrada!",

    // login
    login_title: "Entrar no Crypto Donutz",
    login_button: "Entrar",

    // resend
    resend_title: "Reenviar email de confirmação",
    resend_button_title:
      "Clique clique clique - envie envie envie email de confirmação",
    resend_button: "Enviar",

    // pages
    page_title_dashboard: "Painel de controle",
    page_title_donations: "Doações",
    page_title_donation_page: "Página de doação",
    page_title_design: "Design",
    page_title_badges: "Distintivos",
    page_title_settings: "Configurações",
    page_title_alerts: "Alertas",
    page_title_stream_stats: "Estatísticas no stream",
    page_title_donation_goals: "Metas de doação",
    page_title_donation_history: "Histórico de doações",

    // buttons
    create_new_form_button: "Criar novo",
    create_export_button: "Exportar",
    create_filter_button: "Filtrar",
    save_changes_button: "Salvar alterações",
    reset_changes_button: "Redefinir",
    form_cancel_button: "Cancelar",
    form_save_widget_button: "Salvar widget",
    form_save_goal_button: "Salvar meta",
    create_badge_form_button: "Criar distintivo",
    sign_out_button: "Sair",

    // landing
    landing_main_button: "Inscrever-se",
    landing_main_button_logged: "Ir para o perfil",
    landing_connect_button: "Conectar carteira",
    landing_launch_button: "Iniciar aplicativo",
    landing_create_account_button: "Criar conta",

    landing_banner_title:
      "Vamos revolucionar a maneira como as doações de criptomoedas funcionam",
    landing_banner_subtitle:
      "É hora de exibir doações em criptomoedas no stream, criar NFTs para seus apoiadores e se divertir!",

    landing_whatIs_subtitle: "O que é Crypto Donutz?",
    landing_whatIs_title:
      "Plataforma de doações em criptomoedas para streamers",
    landing_whatIs_description:
      "Nosso produto tem como objetivo aumentar a receita dos streamers e a interação com os apoiadores de criptomoedas. Também é extremamente fácil de configurar.",

    landing_features_subtitle: "O que há de tão especial em nós?",
    landing_features_title: "Nossos recursos",

    // landing - features blocks
    landing_features_widgets_title: "Widgets no stream",
    landing_features_widgets_description:
      "Exiba todas as doações em criptomoedas no stream, destaque seus apoiadores mais ativos, crie metas de doação e envolva seu público.",
    landing_features_badges_title: "Distintivos como NFTs",
    landing_features_badges_description:
      "Por que não conceder aos seus valiosos apoiadores um distintivo único? Especialmente um NFT. Seus apoiadores em criptomoedas com certeza vão adorar.",
    landing_features_link_title: "Integração com um único link",
    landing_features_link_description:
      "Apenas um link é necessário. Basta copiar e colar o link do seu widget no OBS ou em qualquer outro software de transmissão que você use. Comece a exibir suas doações recebidas no stream.",
    landing_features_donations_title: "Link da página de doações",
    landing_features_donations_description:
      "Copie seu link exclusivo da página de doações e compartilhe com seus apoiadores. Aumente sua taxa de conversão e, consequentemente, sua receita.",
    landing_features_customizable_title: "Tudo é personalizável",
    landing_features_customizable_description:
      "Use suas próprias cores, textos e imagens distintas. Personalize os widgets e a página de doações. Sua imaginação é o único limite.",
    landing_features_reports_title: "Relatórios de doações",
    landing_features_reports_description:
      "Nossos gráficos visuais e relatórios resumidos ajudarão você a tirar o máximo proveito das informações sobre as doações. Use filtros de tempo para ver as doações em qualquer período.",
    landing_features_fiat_title: "Compatível com serviços fiduciários",
    landing_features_fiat_description:
      "Crypto Donutz foi projetado para aproveitar ao máximo a tecnologia blockchain. Use serviços fiduciários e de criptomoedas para maximizar seu lucro.",
    landing_features_nopending_title: "Sem saldos pendentes",
    landing_features_nopending_description:
      "Todas as transações são processadas por meio de contratos inteligentes, e a doação vai diretamente para o endereço da sua carteira. Não temos controle sobre seu dinheiro.",

    landing_commission_title: "0% de comissão",
    landing_commission_description:
      "No momento, o serviço é totalmente gratuito para todos",

    landing_howWork_subtitle: "Como funciona?",
    landing_howWork_title: "Processo em três etapas",

    // landing - howWork steps
    landing_howWork_connection_title: "Inscrever-se",
    landing_howWork_connection_description:
      "Inscreva-se com seu e-mail, escolha um nome de usuário e crie uma conta.",
    landing_howWork_widget_title: "Configuração do widget e página de doação",
    landing_howWork_widget_description:
      "Vá para a seção Widgets, copie o link do widget e cole-o no seu software de transmissão. Obtenha o link da sua página de doação na seção Página de doação e compartilhe com seus apoiadores.",
    landing_howWork_actions_title: "Receba seus deliciosos Crypto Donutz",
    landing_howWork_actions_description:
      "Crie distintivos NFT para seus apoiadores mais ativos, analise seus relatórios de doação e divirta-se!",

    landing_blockchains_subtitle: "Integrações",
    landing_blockchains_title: "Criptomoedas suportadas",

    landing_help_title: "Precisa de ajuda?",

    // landing - help blocks
    landing_help_discord_title: "Pergunte no Discord",
    landing_help_discord_description:
      "Crie um ticket no nosso servidor do Discord e fale com nossa equipe de suporte",

    landing_help_center_title: "Consulte o centro de ajuda",
    landing_help_center_description:
      "Reunimos todas as perguntas frequentes no centro de ajuda. Confira!",

    landing_footer_title: "Está pronto para agarrar seus Crypto Donutz?",

    // menu lateral
    sidebar_dashboard: "Painel",
    sidebar_donation_page: "Página de doação",
    sidebar_widgets: "Widgets",
    sidebar_widgets_alerts: "Alertas",
    sidebar_widgets_stats: "Estatísticas no stream",
    sidebar_widgets_goals: "Metas de doação",
    sidebar_donations: "Doações",
    sidebar_badges: "Distintivos",
    sidebar_settings: "Configurações",
    sidebar_help: "Centro de ajuda",

    // painel
    dashboard_widgets_stats: "Estatísticas",
    dashboard_widgets_recent: "Doações recentes",
    dashboard_widgets_supporters: "Principais apoiadores",
    dashboard_widgets_donations: "Maiores doações",

    // página de doações
    donations_select_dates: "Escolha o período exato",
    donations_group_checkbox: "Agrupe doações com o mesmo nome de remetente",

    donations_search_placeholder: "Pesquisar por nome",
    donations_found_txt: "Encontrado {num} resultado no valor de {amount} USD",

    // donation page
    donation_subtitle:
      "Através do link abaixo, seus apoiadores podem enviar doações",
    donation_generate_button: "Gerar código QR",
    donation_download_button: "Baixar PNG",
    donation_header_banner: "Banner do cabeçalho:",
    donation_background_banner: "Banner de fundo:",
    donation_welcome_text: "Texto de boas-vindas:",
    donation_button_text: "Texto do botão:",
    donation_main_color: "Cor principal:",
    donation_background_color: "Cor de fundo:",

    // badges page
    badges_new_title: "Crie e gerencie os distintivos para seus apoiadores",
    badges_create_information_title: "Informação do distintivo",
    badges_create_information_description:
      "Por favor, preencha as informações necessárias",
    badges_create_information_blockhain: "Blockchain",
    badges_create_information_input_name: "Nome do distintivo",
    badges_create_information_input_description: "Descrição do distintivo",

    badges_success_modal_title: "Parabéns! Você criou um novo distintivo!",
    badges_success_modal_description:
      "Clique nele e atribua aos seus apoiadores",

    // settings
    settings_avatar: "Avatar:",
    settings_username: "Nome de usuário:",
    settings_wallet: "Carteira:",
    settings_change_button: "Alterar",
    settings_copy_button: "Copiar",

    // alerts
    alerts_subtitle:
      "Cole este link no software de transmissão que você usa e exiba suas doações recebidas",
    alerts_banner: "Banner:",
    alerts_message_color: "Cor da mensagem:",
    alerts_name_color: "Cor do nome do apoiador:",
    alerts_sum_color: "Cor do valor da doação:",
    alerts_message_font: "Fonte da mensagem:",
    alerts_supporter_font: "Fonte do apoiador:",
    alerts_donation_font: "Fonte do valor da doação:",
    alerts_sound: "Som de alerta:",
    alerts_duration: "Duração do alerta:",
    alerts_duration_value: "{duration} seg",
    alerts_voice: "Alertas de voz:",
    alerts_voice_male: "Masculino",
    alerts_voice_female: "Feminino",
    alerts_banners_model: "Banners padrão de alerta de doação",

    // stats
    stats_subtitle:
      "Crie seus widgets personalizados para exibir em suas transmissões",
    stats_modal_title: "Criação de novo widget",
    stats_modal_form_title: "Título do widget:",
    stats_modal_form_description: "Descrição do widget:",
    stats_modal_form_type: "Tipo de dado:",
    stats_modal_form_time: "Período de tempo:",
    stats_modal_form_template: "Modelo:",
    stats_widget_card_period: "Período de data: {timePeriodName}",
    stats_widget_card_type: "Tipo de data: {typeStatData}",
    stats_widget_settings_title: "Cor do título do objetivo:",
    stats_widget_card_template: "Modelo: {template}",
    stats_widget_settings_bar_color: "Cor da barra do objetivo:",
    stats_widget_settings_сontent_color: "Cor do conteúdo:",
    stats_widget_settings_title_font: "Fonte do título do objetivo:",
    stats_widget_settings_сontent_font: "Fonte do conteúdo:",
    stats_widget_settings_сontent_alignment: "Alinhamento do conteúdo:",

    // goals
    goals_subtitle:
      "Comece a arrecadar fundos para uma compra específica ou objetivo.",
    goals_modal_title: "Nova meta de doação",
    goals_modal_form_description: "Descrição do objetivo:",
    goals_modal_form_amount: "Valor a ser arrecadado:",
    goals_widget_card_raised: "Arrecadado: {amountRaised}/{amountGoal} USD",
    goals_widget_settings_title: "Cor do título do objetivo:",
    goals_widget_settings_bar_color: "Cor da barra de progresso:",
    goals_widget_settings_background_color: "Cor de fundo:",
    goals_widget_settings_title_font: "Fonte do título do objetivo:",
    goals_widget_settings_progress_font: "Fonte do progresso do objetivo:",

    // mobile widget tabs
    widget_tab_settings: "Configurações",
    widget_tab_preview: "Visualizar",

    // table
    table_col_username: "Nome de usuário",
    table_col_donation_token: "Doação, Token",
    table_col_donation_usd: "Doação, USD",
    table_col_message: "Mensagem",
    table_col_date: "Data e hora, UTM",

    // upload input
    upload_formats: "Você pode usar formatos: {formats}",
    upload_recommended_size: "Tamanho recomendado: {size} px",
    upload_max_size: "Tamanho máximo: {maxFileSize} MB",
    upload_default_banners: "banners padrão",
    upload_choose_banners: "Você também pode escolher",
    upload_choose_or_banners: "Ou escolha",
    upload_label_image: "Enviar imagem",

    // switch
    switch_abled: "Ativado",
    switch_disabled: "Desativado",

    // notifications
    notifications_no: "Sem notificações",

    // empty
    empty_data: "Sem dados",

    // inputs
    input_placeholder_email: "Email",
    input_placeholder_username: "Nome de usuário",
    input_placeholder_password: "Senha",
    input_placeholder_confirm_password: "Confirme a senha",
  },

  [LOCALES.KR]: {
    // reset
    reset_title: "비밀번호 초기화",
    reset_input_title: "안내 메일을 받을 이메일 주소를 입력하세요.",
    reset_button: "보내기",

    // change
    change_title: "비밀번호 변경",
    change_button: "변경",
    change_success: "성공!",

    // registration
    registration_title: "크립토 도넛 가입",
    registration_button: "생성",
    sent_activation_link:
      "{email}로 활성화 링크를 보냈습니다. 받은 편지함을 확인하세요!",

    // login
    login_title: "크립토 도넛 로그인",
    login_button: "로그인",

    // resend
    resend_title: "인증 이메일 재전송",
    resend_button_title: "클릭 클릭 클릭 - 전송 전송 전송 인증 이메일",
    resend_button: "보내기",

    // pages
    page_title_dashboard: "대시보드",
    page_title_donations: "기부",
    page_title_donation_page: "기부 페이지",
    page_title_design: "디자인",
    page_title_badges: "배지",
    page_title_settings: "설정",
    page_title_alerts: "알림",
    page_title_stream_stats: "스트림 통계",
    page_title_donation_goals: "기부 목표",
    page_title_donation_history: "기부 내역",

    // buttons
    create_new_form_button: "새로 만들기",
    create_export_button: "내보내기",
    create_filter_button: "필터",
    save_changes_button: "변경 사항 저장",
    reset_changes_button: "초기화",
    form_cancel_button: "취소",
    form_save_widget_button: "위젯 저장",
    form_save_goal_button: "목표 저장",
    create_badge_form_button: "배지 생성",
    sign_out_button: "로그아웃",

    // landing
    landing_main_button: "가입하기",
    landing_main_button_logged: "프로필로 이동",
    landing_connect_button: "지갑 연결",
    landing_launch_button: "앱 시작",
    landing_create_account_button: "계정 생성",

    landing_banner_title: "암호화폐 기부 방식을 혁신합시다",
    landing_banner_subtitle:
      "스트림에서 암호화폐 기부를 표시하고, 지지자를 위해 NFT를 발행하고 재미있게 지내보세요!",

    landing_whatIs_subtitle: "크립토 도넛이란 무엇인가요?",
    landing_whatIs_title: "스트리머를 위한 암호화폐 기부 플랫폼",
    landing_whatIs_description:
      "저희 제품은 스트리머의 수익 증대와 암호화폐 지지자와의 상호작용을 높이기 위해 개발되었습니다. 또한 설정이 매우 쉽습니다.",
    landing_features_subtitle: "우리를 특별하게 만드는 것은 무엇인가요?",
    landing_features_title: "우리의 특징",

    // landing - features blocks
    landing_features_widgets_title: "스트림 위젯",
    landing_features_widgets_description:
      "스트림에서 모든 암호화폐 기부를 표시하고, 가장 활발한 지지자를 강조하며, 기부 목표를 생성하고 관객이 참여하도록 합시다.",
    landing_features_badges_title: "뱃지를 NFT로",
    landing_features_badges_description:
      "왜 소중한 지지자들에게 독특한 뱃지를 주지 않을까요? 특히 NFT로. 귀하의 암호화폐 지지자들은 분명히 그것을 좋아할 것입니다.",
    landing_features_link_title: "원클릭 통합",
    landing_features_link_description:
      "필요한 것은 단 하나의 링크 뿐입니다. OBS 또는 다른 방송 소프트웨어에 위젯 링크를 복사하고 붙여넣기만 하면 됩니다. 스트림에서 들어오는 기부를 표시하세요.",
    landing_features_donations_title: "기부 페이지 링크",
    landing_features_donations_description:
      "고유한 기부 페이지 링크를 복사하여 지지자에게 제공하세요. 전환율과 수익을 높이세요.",
    landing_features_customizable_title: "모든 것이 사용자 정의 가능",
    landing_features_customizable_description:
      "고유한 색상, 텍스트 및 이미지를 사용하세요. 위젯 및 기부 페이지를 사용자 정의하세요. 상상력만이 한계입니다.",
    landing_features_reports_title: "기부 보고서",
    landing_features_reports_description:
      "시각적 그래프와 요약 보고서를 통해 기부 내역을 최대한 활용하세요. 기간별 필터를 사용하여 특정 기간 동안의 기부를 확인하세요.",
    landing_features_fiat_title: "피아트 서비스와 호환",
    landing_features_fiat_description:
      "Crypto Donutz는 블록체인 기술을 최대한 활용하기 위해 설계되었습니다. 피아트와 암호화폐 서비스를 모두 사용하여 이익을 극대화하세요.",
    landing_features_nopending_title: "보류 중인 잔액 없음",
    landing_features_nopending_description:
      "모든 거래는 스마트 계약을 통해 처리되며, 기부금은 직접 지갑 주소로 이동합니다. 우리는 귀하의 돈을 통제할 수 없습니다.",
    landing_commission_title: "0% 수수료",
    landing_commission_description:
      "지금은 모두에게 완전히 무료로 사용할 수 있는 서비스입니다",

    landing_howWork_subtitle: "이 모든 것이 어떻게 작동하나요?",
    landing_howWork_title: "세 단계 프로세스",

    // landing - howWork steps
    landing_howWork_connection_title: "가입",
    landing_howWork_connection_description:
      "이메일로 가입하고, 사용자 이름을 선택하고 계정을 등록하세요.",
    landing_howWork_widget_title: "위젯 및 기부 페이지 설정",
    landing_howWork_widget_description:
      "위젯 섹션으로 이동하여 위젯 링크를 복사하고 방송 소프트웨어에 붙여넣습니다. 기부 페이지 섹션에서 기부 페이지 링크를 가져와서 지지자들에게 제공하세요.",
    landing_howWork_actions_title: "맛있는 크립토 도넛 받기",
    landing_howWork_actions_description:
      "가장 활발한 지지자들에게 NFT 배지를 발행하고, 기부 보고서를 분석하고 즐기세요!",

    landing_blockchains_subtitle: "통합",
    landing_blockchains_title: "지원되는 크립토",

    landing_help_title: "도움이 필요하세요?",

    // landing - help blocks
    landing_help_discord_title: "디스코드에서 물어보세요",
    landing_help_discord_description:
      "디스코드 서버에서 티켓을 생성하고 우리 지원 팀과 대화하세요",

    landing_help_center_title: "도움말 센터 확인",
    landing_help_center_description:
      "도움말 센터에서 모든 자주 묻는 질문을 수집했습니다. 확인해 보세요!",

    landing_footer_title: "크립토 도넛을 준비하셨나요?",

    // sidebar menu
    sidebar_dashboard: "대시보드",
    sidebar_donation_page: "기부 페이지",
    sidebar_widgets: "위젯",
    sidebar_widgets_alerts: "알림",
    sidebar_widgets_stats: "방송 중 통계",
    sidebar_widgets_goals: "기부 목표",
    sidebar_donations: "기부",
    sidebar_badges: "배지",
    sidebar_settings: "설정",
    sidebar_help: "도움말 센터",

    // 대시보드
    dashboard_widgets_stats: "통계",
    dashboard_widgets_recent: "최근 기부",
    dashboard_widgets_supporters: "상위 후원자",
    dashboard_widgets_donations: "상위 기부",

    // donations 페이지
    donations_select_dates: "정확한 기간 선택",
    donations_group_checkbox: "동일한 발신자 이름으로 기부 그룹화",

    donations_search_placeholder: "이름으로 검색",
    donations_found_txt:
      "{amount} USD의 금액에 대해 {num} 개의 결과를 찾았습니다.",

    // donation 페이지
    donation_subtitle: "아래 링크를 통해 지지자들이 기부를 보낼 수 있습니다.",
    donation_generate_button: "QR 코드 생성",
    donation_download_button: "PNG 다운로드",
    donation_header_banner: "헤더 배너:",
    donation_background_banner: "배경 배너:",
    donation_welcome_text: "환영 텍스트:",
    donation_button_text: "버튼 텍스트:",
    donation_main_color: "주요 색상:",
    donation_background_color: "배경색:",

    // badges 페이지
    badges_new_title: "지지자들을 위한 배지를 만들고 관리하십시오",
    badges_create_information_title: "배지 정보",
    badges_create_information_description: "필요한 정보를 입력하십시오",
    badges_create_information_blockhain: "블록체인",
    badges_create_information_input_name: "배지 이름",
    badges_create_information_input_description: "배지 설명",

    badges_success_modal_title: "축하합니다! 새로운 배지를 만들었습니다!",
    badges_success_modal_description:
      "그것을 클릭하고 지지자들에게 할당하세요.",
    // 설정
    settings_avatar: "아바타:",
    settings_username: "사용자 이름:",
    settings_wallet: "지갑:",
    settings_change_button: "변경",
    settings_copy_button: "복사",

    // 알림
    alerts_subtitle:
      "사용 중인 방송 소프트웨어에 이 링크를 붙여넣고 수신한 기부를 표시하세요",
    alerts_banner: "배너:",
    alerts_message_color: "메시지 색상:",
    alerts_name_color: "지지자 이름 색상:",
    alerts_sum_color: "기부금액 색상:",
    alerts_message_font: "메시지 글꼴:",
    alerts_supporter_font: "지지자 글꼴:",
    alerts_donation_font: "기부 금액 글꼴:",
    alerts_sound: "알림 소리:",
    alerts_duration: "알림 지속 시간:",
    alerts_duration_value: "{duration} 초",
    alerts_voice: "음성 알림:",
    alerts_voice_male: "남성",
    alerts_voice_female: "여성",
    alerts_banners_model: "기본 기부 알림 배너",

    // 통계
    stats_subtitle: "스트림에 표시할 사용자 정의 위젯을 만드십시오",
    stats_modal_title: "새 위젯 생성",
    stats_modal_form_title: "위젯 제목:",
    stats_modal_form_description: "위젯 설명:",
    stats_modal_form_type: "데이터 유형:",
    stats_modal_form_time: "기간:",
    stats_modal_form_template: "템플릿:",
    stats_widget_card_period: "날짜 기간: {timePeriodName}",
    stats_widget_card_type: "날짜 유형: {typeStatData}",
    stats_widget_settings_title: "목표 제목 색상:",
    stats_widget_card_template: "템플릿: {template}",
    stats_widget_settings_bar_color: "목표 막대 색상:",
    stats_widget_settings_сontent_color: "콘텐츠 색상:",
    stats_widget_settings_title_font: "목표 제목 글꼴:",
    stats_widget_settings_сontent_font: "콘텐츠 글꼴:",
    stats_widget_settings_сontent_alignment: "콘텐츠 정렬:",

    // 목표
    goals_subtitle: "특정 구매 또는 목표에 대한 모금을 시작하세요.",
    goals_modal_title: "새 기부 목표",
    goals_modal_form_description: "목표 설명:",
    goals_modal_form_amount: "모금할 금액:",
    goals_widget_card_raised: "모금: {amountRaised}/{amountGoal} USD",
    goals_widget_settings_title: "목표 제목 색상:",
    goals_widget_settings_bar_color: "진행 바 색상:",
    goals_widget_settings_background_color: "배경 색상:",
    goals_widget_settings_title_font: "목표 제목 글꼴:",
    goals_widget_settings_progress_font: "목표 진행률 글꼴:",

    // mobile widget tabs
    widget_tab_settings: "설정",
    widget_tab_preview: "미리보기",

    // table
    table_col_username: "사용자 이름",
    table_col_donation_token: "기부, 토큰",
    table_col_donation_usd: "기부, USD",
    table_col_message: "메시지",
    table_col_date: "날짜 및 시간, UTM",

    // upload input
    upload_formats: "사용 가능한 형식: {formats}",
    upload_recommended_size: "권장 크기: {size} px",
    upload_max_size: "최대 크기: {maxFileSize} MB",
    upload_default_banners: "기본 배너",
    upload_choose_banners: "또한 선택할 수 있습니다",
    upload_choose_or_banners: "또는 선택",
    upload_label_image: "이미지 업로드",

    // switch
    switch_abled: "활성화됨",
    switch_disabled: "비활성화됨",

    // notifications
    notifications_no: "알림 없음",

    // empty
    empty_data: "데이터 없음",

    // inputs
    input_placeholder_email: "이메일",
    input_placeholder_username: "사용자 이름",
    input_placeholder_password: "비밀번호",
    input_placeholder_confirm_password: "비밀번호 확인",
  },
};

export default messages;
