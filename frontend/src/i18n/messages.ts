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
    registration_button: "Create",
    sent_activation_link:
      "We’ve sent an activation link to {email}. Check your inbox!",
    registration_creator_title: "Join Crypto Donutz!",
    registration_backer_title: "Type in your username",
    registration_have_account: "Already have account? ",
    registration_link: "Log in",

    // login
    login_title: "Log in your account",
    login_button: "Log in",
    login_no_account: "No account? ",
    login_link: "Create one",
    login_forgot: "Forgot the password",

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
    export_button: "EXPORT",
    filter_button: "FILTER",
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
    dashboard_widgets_stats_label: "Donation sum",
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
    donation_default_banners: "Default {bannerType} banners",

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
    badge_holders: "Badge holders",

    // settings
    settings_avatar: "Avatar:",
    settings_username: "Username:",
    settings_wallet: "Wallet:",
    settings_spam_filter: "Spam filter:",
    settings_change_button: "Change",
    settings_copy_button: "Copy",
    settings_delete_account: "Delete account",

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
    alerts_sounds: "Donation sounds",
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
    stats_widget_settings_сontent_alignment_left: "Left",
    stats_widget_settings_сontent_alignment_center: "Center",
    stats_widget_settings_сontent_alignment_right: "Right",
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
    upload_sound_label: "Upload custom sound +",

    // switch
    switch_abled: "Abled",
    switch_disabled: "Disabled",

    // notifications
    notifications_no: "No notifications",
    notifications_title: "Notifications",
    notifications_clear: "Clear all",
    notifications_donat_title: "New donut",
    notifications_badge_title: "New badge",
    notifications_donat_creator: "{user} sent you {sum} {blockchain}!",
    notifications_donat_supporter: "You sent {sum} {blockchain} to {user}!",
    notifications_add_badge_creator: "You sent {title} to {user}",
    notifications_add_badge_supporter: "You received {title} from {user}",

    // notification component
    notification_successfully_created: "Data created successfully",
    notification_successfully_saved: "Data saved successfully",
    notification_successfully_deleted: "Deleted successfully",
    notification_successfully_title: "Success",
    notification_user_not_found: "User with this username not found!",
    notification_file_limit_exceeded:
      "File size limit exceeded (max - {maxFileSize}MB)",
    notification_not_filled: "Not all fields are filled",

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

    // copy
    copy_message_successfully: "{formatCopyObject} is successfully copied",
    copy_message_error: "An error occurred while copying the {copyObject}",
    copy_message_wallet: "Wallet address",
    copy_message_link: "Link",

    // dates picker
    dates_picker_placeholder_start: "Start date",
    dates_picker_placeholder_end: "End date",
  },
  [LOCALES.RU]: {
    // reset
    reset_title: "Восстановить пароль",
    reset_input_title:
      "Введите ваш email. На него мы вышлем ссылку для восстановления пароля",
    reset_button: "Отправить",
    reset_send:
      "Инструкции по сбросу пароля отправлены на вашу электронную почту. Проверьте свою почту!",

    // change
    change_title: "Измените свой пароль",
    change_button: "Изменить",
    change_success: "Успешно!",

    // registration
    registration_button: "Создать",
    sent_activation_link:
      "Мы отправили вам ссылку активации на {email}. Проверьте входящие сообщения!",
    registration_creator_title: "Присоединяйтесь к Crypto Donutz!",
    registration_backer_title: "Введите ваше имя пользователя",
    registration_have_account: "Уже есть аккаунт? ",
    registration_link: "Войти",

    // login
    login_title: "Войти в Crypto Donutz",
    login_button: "Вход",
    login_no_account: "Нет аккаунта? ",
    login_link: "Создать",
    login_forgot: "Забыли пароль?",

    // roles
    roles_title: "Кто вы?",
    roles_creator: "Создатель контента",
    roles_supporter: "Донатер",
    roles_button: "Продолжить",

    // wallets modal
    wallets_connect_title: "Подключить кошелек",

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
    export_button: "Выгрузить",
    filter_button: "Сортировать",
    save_changes_button: "Сохранить",
    reset_changes_button: "Сбросить",
    form_cancel_button: "Отменить",
    form_save_widget_button: "Сохранить",
    form_save_goal_button: "Сохранить",
    create_badge_form_button: "Создать",
    sign_out_button: "Выйти",

    // not found
    not_found_title: "К сожалению, запрашиваемая вами страница не существует.",
    not_found_button: "Вернуться на главную страницу",

    // landing
    landing_main_button: "Зарегистрироваться",
    landing_main_button_logged: "Перейти в профиль",
    landing_connect_button: "Зарегистрироваться",
    landing_launch_button: "Перейти в профиль",
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
      "Зарегистрируйтесь с помощью вашей электронной почты, выберите имя пользователя и зарегистрируйте аккаунт.",
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

    // page names
    title_reset_page: "Сброс пароля",
    title_change_password_page: "Изменить пароль",
    title_resend_page: "Повторная отправка письма с подтверждением",
    title_donat_page: "Страница донатов",
    title_alert_page: "Страница оповещений донатов",
    title_goal_page: "Страница целей донатов",
    title_stat_page: "Страница статистики донатов",

    // dashboard
    dashboard_widgets_stats: "Статистика",
    dashboard_widgets_stats_label: "Сумма пожертвований",
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
      "Через эту ссылку ваша аудитория может отправить вам крипто донаты",
    donation_generate_button: "Создать QR код",
    donation_download_button: "Скачать PNG",
    donation_header_banner: "Изображение над формой:",
    donation_background_banner: "Изображение фона страницы:",
    donation_welcome_text: "Приветственный текст:",
    donation_button_text: "Текст кнопки:",
    donation_main_color: "Основной цвет:",
    donation_background_color: "Цвет фона страницы:",
    donation_default_banners: "Баннеры по умолчанию {bannerType}",

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

    // badge page
    badge_image: "Изображение бейджа",
    badge_information_title: "Информация о бейдже",
    badge_information_name: "Имя",
    badge_information_description: "Описание",
    badge_information_assigned: "Назначено",
    badge_information_quantity: "Количество",
    badge_information_blockchain: "Блокчейн",
    badge_assign_label: "Назначить бейдж",
    badge_assign_placeholder: "Выберите донора",
    badge_assign_loading:
      "Подождите, пока бейдж будет создан на адресе {username}",
    badge_assign_success:
      "Поздравляем! Вы успешно назначили бейдж пользователю {username}",
    badge_assign_button: "Назначить",
    badge_holders: "Держатели бейджей",

    // settings
    settings_avatar: "Аватар:",
    settings_username: "Имя пользователя:",
    settings_wallet: "Кошелек:",
    settings_spam_filter: "Фильтр спама:",
    settings_change_button: "Изменить",
    settings_copy_button: "Копировать",
    settings_delete_account: "Удалить аккаунт",

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
    alerts_sounds: "Звуки пожертвований",
    alerts_duration: "Длительность оповещения:",
    alerts_duration_value: "{duration} секунд",
    alerts_voice: "Голосовые оповещения:",
    alerts_voice_male: "Мужской",
    alerts_voice_female: "Женский",
    alerts_banners_model: "Баннеры оповещения донатов по умолчанию",
    alerts_preview_message: "Спасибо за ваш стрим!",

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
    stats_widget_settings_сontent_alignment_left: "Слева",
    stats_widget_settings_сontent_alignment_center: "По центру",
    stats_widget_settings_сontent_alignment_right: "Справа",
    stats_widget_preview_message: "Привет! Это тестовое сообщение",
    stats_widget_preview_message_2: "Как дела?",

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

    // donat page
    donat_form_username: "Ваше имя пользователя",
    donat_form_switch_label: "Включите анонимность",
    donat_form_message: "Сообщение для {username}",
    donat_form_amount: "Сумма пожертвования",
    donat_form_equal_usd: "Эквивалент {convertedUsdSum} USD",
    donat_form_goal_title: "Цели пожертвований",
    donat_form_goal_description: "Помогите {username} достичь его донат целей",
    donat_form_goal_dont_participate: "Не участвовать",
    donat_loading_message:
      "Пожалуйста, не закрывайте это окно до подтверждения пожертвования",
    donat_success_message:
      "Вы успешно отправили {sum} {selectedBlockchain} пользователю {name}",
    donat_success_message_description:
      "Проверьте историю своих пожертвований в разделе «Пожертвования»",
    donat_warning_message_username_description:
      "К сожалению, это имя пользователя уже занято. Введите другое",
    donat_warning_message_balance_title: "Недостаточно средств",
    donat_warning_message_balance_description:
      "К сожалению, на вашем счете недостаточно средств для выполнения операции",
    donat_warning_message_himself_title: "Серьезно?",
    donat_warning_message_himself_description:
      "Вы пытаетесь отправить пожертвование самому себе",

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
    upload_sound_label: "Загрузить свой звук +",

    // switch
    switch_abled: "Включено",
    switch_disabled: "Выключено",

    // notifications
    notifications_no: "Нет уведомлений",
    notifications_title: "Уведомления",
    notifications_clear: "Очистить все",
    notifications_donat_title: "Новое пожертвование",
    notifications_badge_title: "Новый значок",
    notifications_donat_creator: "{user} отправил вам {sum} {blockchain}!",
    notifications_donat_supporter: "Вы отправили {sum} {blockchain} {user}!",
    notifications_add_badge_creator: "Вы отправили {title} {user}",
    notifications_add_badge_supporter: "Вы получили {title} от {user}",

    // notification component
    notification_successfully_created: "Данные успешно созданы",
    notification_successfully_saved: "Данные успешно сохранены",
    notification_successfully_deleted: "Успешно удалено",
    notification_successfully_title: "Успех",
    notification_user_not_found:
      "Пользователь с таким именем пользователя не найден!",
    notification_file_limit_exceeded:
      "Превышен лимит размера файла (макс. - {maxFileSize}МБ)",
    notification_not_filled: "Не все поля заполнены",

    // empty
    empty_data: "Нет данных",

    // inputs
    input_placeholder_email: "Email",
    input_placeholder_username: "Имя пользователя",
    input_placeholder_password: "Пароль",
    input_placeholder_confirm_password: "Подтвердить пароль",

    // filters
    filter_today: "Сегодня",
    filter_7days: "Последние 7 дней",
    filter_month: "Последние 30 дней",
    filter_year: "В этом году",
    filter_current_year: "Текущий год",
    filter_yesterday: "Вчера",
    filter_all_time: "Все время",
    filter_custom: "Выбрать даты",
    filter_top_donations: "Лучшие пожертвования",
    filter_recent_donations: "Последние пожертвования",
    filter_top_supporters: "Топ спонсоров",

    // confirm popup
    confirm_sure: "Вы уверены?",
    confirm_reset: "Вы уверены, что хотите сбросить настройки?",
    confirm_cancel: "Отмена",
    confirm_ok: "Ок",

    // copy
    copy_message_successfully: "{formatCopyObject} успешно скопировано",
    copy_message_error: "При копировании {copyObject} произошла ошибка",
    copy_message_wallet: "Адрес кошелька",
    copy_message_link: "Ссылка",

    // dates picker
    dates_picker_placeholder_start: "Дата начала",
    dates_picker_placeholder_end: "Дата окончания",
  },
  [LOCALES.ES]: {
    // reset
    reset_title: "Restablecer la contraseña",
    reset_input_title:
      "Ingrese la dirección de correo electrónico de su cuenta para recibir instrucciones.",
    reset_button: "Enviar",
    reset_send:
      "Las instrucciones para restablecer la contraseña se han enviado a su correo electrónico. ¡Compruebe su bandeja de entrada!",

    // change
    change_title: "Cambiar contraseña",
    change_button: "Cambiar",
    change_success: "¡Éxito!",

    // registration
    registration_button: "Crear",
    sent_activation_link:
      "Hemos enviado un enlace de activación a {email}. ¡Revisa tu bandeja de entrada!",
    registration_creator_title: "¡Únete a Crypto Donutz!",
    registration_backer_title: "Escribe tu nombre de usuario",
    registration_have_account: "¿Ya tienes cuenta? ",
    registration_link: "Iniciar sesión",

    // login
    login_title: "Iniciar sesión en Crypto Donutz",
    login_button: "Iniciar sesión",
    login_no_account: "¿No tienes una cuenta?",
    login_link: "Crea una",
    login_forgot: "¿Olvidaste tu contraseña?",

    // roles
    roles_title: "¿Quién eres?",
    roles_creator: "Creador de contenido",
    roles_supporter: "Patrocinador",
    roles_button: "Continuar",

    // wallets modal
    wallets_connect_title: "Conectar billetera",

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
    export_button: "Exportar",
    filter_button: "Filtrar",
    save_changes_button: "Guardar cambios",
    reset_changes_button: "Restablecer",
    form_cancel_button: "Cancelar",
    form_save_widget_button: "Guardar widget",
    form_save_goal_button: "Guardar objetivo",
    create_badge_form_button: "Crear insignia",
    sign_out_button: "Cerrar sesión",

    // not found
    not_found_title: "Lo siento, la página que visitó no existe.",
    not_found_button: "Volver a la página principal",

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
      "Regístrate con tu correo electrónico, elige el nombre de usuario y registra la cuenta.",
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

    // page names
    title_reset_page: "Restablecer contraseña",
    title_change_password_page: "Cambiar contraseña",
    title_resend_page: "Reenviar correo de confirmación",
    title_donat_page: "Página de donación",
    title_alert_page: "Página de alerta de donación",
    title_goal_page: "Página de metas de donación",
    title_stat_page: "Página de estadísticas de donación",

    // dashboard
    dashboard_widgets_stats: "Estadísticas",
    dashboard_widgets_stats_label: "Suma de donaciones",
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
    donation_default_banners: "Banners {bannerType} por defecto",

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

    // badge page
    badge_image: "Imagen de insignia",
    badge_information_title: "Información de la insignia",
    badge_information_name: "Nombre",
    badge_information_description: "Descripción",
    badge_information_assigned: "Asignado",
    badge_information_quantity: "Cantidad",
    badge_information_blockchain: "Blockchain",
    badge_assign_label: "Asignar insignia",
    badge_assign_placeholder: "Elegir patrocinador",
    badge_assign_loading:
      "Espere a que se acuñe la insignia en la dirección de {username}",
    badge_assign_success:
      "¡Felicidades! Ha asignado con éxito la insignia a {username}",
    badge_assign_button: "Asignar",
    badge_holders: "Titulares de insignias",

    // settings
    settings_avatar: "Avatar:",
    settings_username: "Nombre de usuario:",
    settings_wallet: "Cartera:",
    settings_spam_filter: "Filtro de spam:",
    settings_change_button: "Cambiar",
    settings_copy_button: "Copiar",
    settings_delete_account: "Eliminar cuenta",

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
    alerts_sounds: "Sonidos de donaciones",
    alerts_duration: "Duración de la alerta:",
    alerts_duration_value: "{duration} seg",
    alerts_voice: "Alertas de voz:",
    alerts_voice_male: "Masculino",
    alerts_voice_female: "Femenino",
    alerts_banners_model: "Banners predeterminados para alertas de donaciones",
    alerts_preview_message: "¡Gracias por tu transmisión!",

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
    stats_widget_settings_сontent_alignment_left: "Izquierda",
    stats_widget_settings_сontent_alignment_center: "Centro",
    stats_widget_settings_сontent_alignment_right: "Derecha",
    stats_widget_preview_message: "¡Hola! Este es un mensaje de prueba",
    stats_widget_preview_message_2: "¿Cómo estás?",

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

    // donat page
    donat_form_username: "Tu nombre de usuario",
    donat_form_switch_label: "Activa para ser anónimo",
    donat_form_message: "Mensaje para {username}",
    donat_form_amount: "Cantidad de la donación",
    donat_form_equal_usd: "Equivalente a {convertedUsdSum} USD",
    donat_form_goal_title: "Metas de donación",
    donat_form_goal_description:
      "Ayuda a {username} a alcanzar sus metas de donación",
    donat_form_goal_dont_participate: "No participar",
    donat_loading_message:
      "No cierre esta ventana hasta la confirmación de la donación",
    donat_success_message:
      "Has enviado con éxito {sum} {selectedBlockchain} a {name}",
    donat_success_message_description:
      "Verifica tu historial de donaciones en la sección «Donaciones»",
    donat_warning_message_username_description:
      "Desafortunadamente, este nombre de usuario ya está ocupado. Introduce otro",
    donat_warning_message_balance_title: "Saldo insuficiente",
    donat_warning_message_balance_description:
      "Desafortunadamente, no hay suficientes fondos en tu saldo para llevar a cabo la operación",
    donat_warning_message_himself_title: "¿En serio? ;)",
    donat_warning_message_himself_description:
      "Estás intentando enviarte una donación a ti mismo",

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
    upload_sound_label: "Subir sonido personalizado +",

    // switch
    switch_abled: "Habilitado",
    switch_disabled: "Deshabilitado",

    // notifications
    notifications_no: "No hay notificaciones",
    notifications_title: "Notificaciones",
    notifications_clear: "Borrar todo",
    notifications_donat_title: "Nueva donación",
    notifications_badge_title: "Nuevo distintivo",
    notifications_donat_creator: "¡{user} te ha enviado {sum} {blockchain}!",
    notifications_donat_supporter: "¡Has enviado {sum} {blockchain} a {user}!",
    notifications_add_badge_creator: "Has enviado {title} a {user}",
    notifications_add_badge_supporter: "Has recibido {title} de {user}",

    // notification component
    notification_successfully_created: "Datos creados exitosamente",
    notification_successfully_saved: "Datos guardados exitosamente",
    notification_successfully_deleted: "Eliminado exitosamente",
    notification_successfully_title: "Éxito",
    notification_user_not_found:
      "¡No se encontró usuario con este nombre de usuario!",
    notification_file_limit_exceeded:
      "Se superó el límite de tamaño de archivo (máx. - {maxFileSize}MB)",
    notification_not_filled: "No se han completado todos los campos",

    // empty
    empty_data: "No hay datos",

    // inputs
    input_placeholder_email: "Correo electrónico",
    input_placeholder_username: "Nombre de usuario",
    input_placeholder_password: "Contraseña",
    input_placeholder_confirm_password: "Confirmar contraseña",

    // filters
    filter_today: "Hoy",
    filter_7days: "Últimos 7 días",
    filter_month: "Últimos 30 días",
    filter_year: "Este año",
    filter_current_year: "Año actual",
    filter_yesterday: "Ayer",
    filter_all_time: "Todo el tiempo",
    filter_custom: "Fecha personalizada",
    filter_top_donations: "Donaciones más altas",
    filter_recent_donations: "Donaciones recientes",
    filter_top_supporters: "Mejores patrocinadores",

    // confirm popup
    confirm_sure: "¿Estás seguro?",
    confirm_reset:
      "¿Estás seguro de que quieres restablecer la configuración predeterminada?",
    confirm_cancel: "Cancelar",
    confirm_ok: "Ok",

    // copy
    copy_message_successfully: "{formatCopyObject} se copió correctamente",
    copy_message_error: "Se produjo un error al copiar {copyObject}",
    copy_message_wallet: "Dirección de la cartera",
    copy_message_link: "Enlace",

    // dates picker
    dates_picker_placeholder_start: "Fecha de inicio",
    dates_picker_placeholder_end: "Fecha de finalización",
  },
  [LOCALES.TH]: {
    // reset
    reset_title: "ตั้งรหัสผ่านใหม่",
    reset_input_title: "กรอกที่อยู่อีเมล์ของบัญชีเพื่อขอคำแนะนำ",
    reset_button: "ส่ง",
    reset_send:
      "คำแนะนำการรีเซ็ตรหัสผ่านถูกส่งไปยังอีเมลของคุณ โปรดตรวจสอบกล่องขาเข้าของคุณ!",

    // change
    change_title: "เปลี่ยนรหัสผ่านของคุณ",
    change_button: "เปลี่ยน",
    change_success: "สำเร็จ!",

    // registration
    registration_button: "สร้าง",
    sent_activation_link:
      "เราได้ส่งลิงก์เปิดใช้งานไปยัง {email} ตรวจสอบกล่องขาเข้าของคุณ!",
    registration_creator_title: "เข้าร่วม Crypto Donutz!",
    registration_backer_title: "พิมพ์ชื่อผู้ใช้ของคุณ",
    registration_have_account: "มีบัญชีอยู่แล้วหรือไม่? ",
    registration_link: "เข้าสู่ระบบ",

    // login
    login_title: "เข้าสู่ระบบ Crypto Donutz",
    login_button: "เข้าสู่ระบบ",
    login_no_account: "ไม่มีบัญชี? ",
    login_link: "สร้างบัญชี",
    login_forgot: "ลืมรหัสผ่าน",

    // roles
    roles_title: "คุณคือใคร?",
    roles_creator: "ผู้สร้างเนื้อหา",
    roles_supporter: "ผู้สนับสนุน",
    roles_button: "ต่อไป",

    // wallets modal
    wallets_connect_title: "เชื่อมต่อกระเป๋าเงิน",

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
    export_button: "ส่งออก",
    filter_button: "กรอง",
    save_changes_button: "บันทึกการเปลี่ยนแปลง",
    reset_changes_button: "รีเซ็ต",
    form_cancel_button: "ยกเลิก",
    form_save_widget_button: "บันทึกวิดเจ็ต",
    form_save_goal_button: "บันทึกเป้าหมาย",
    create_badge_form_button: "สร้างแบดจ์",
    sign_out_button: "ออกจากระบบ",

    // not found
    not_found_title: "ขออภัย หน้าที่คุณเข้าชมไม่มีอยู่จริง",
    not_found_button: "กลับสู่หน้าหลัก",

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
      "ลงทะเบียนด้วยอีเมลของคุณ เลือกชื่อผู้ใช้และลงทะเบียนบัญชี",
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

    // page names
    title_reset_page: "รีเซ็ตรหัสผ่าน",
    title_change_password_page: "เปลี่ยนรหัสผ่าน",
    title_resend_page: "ส่งอีเมลยืนยันอีกครั้ง",
    title_donat_page: "หน้าบริจาค",
    title_alert_page: "หน้าแจ้งเตือนบริจาค",
    title_goal_page: "หน้าเป้าหมายของบริจาค",
    title_stat_page: "หน้าสถิติบริจาค",

    // dashboard
    dashboard_widgets_stats: "สถิติ",
    dashboard_widgets_stats_label: "รวมยอดการบริจาค",
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
    donation_default_banners: "แบนเนอร์ประเภท {bannerType} เริ่มต้น",

    // badges page
    badges_new_title: "ปั้นและจัดการแบดจ์ให้กับผู้สนับสนุนของคุณ",
    badges_create_information_title: "ข้อมูลแบดจ์",
    badges_create_information_description: "กรุณากรอกข้อมูลที่ต้องการ",
    badges_create_information_blockhain: "บล็อกเชน",
    badges_create_information_input_name: "ชื่อแบดจ์",
    badges_create_information_input_description: "คำอธิบายแบดจ์",
    badges_success_modal_title: "ยินดีด้วย! คุณได้สร้างแบดจ์ใหม่แล้ว!",
    badges_success_modal_description: "คลิกที่นี่และกำหนดให้ผู้สนับสนุนของคุณ",

    // badge page
    badge_image: "รูปภาพเหรียญตรา",
    badge_information_title: "ข้อมูลเหรียญตรา",
    badge_information_name: "ชื่อ",
    badge_information_description: "คำอธิบาย",
    badge_information_assigned: "กำหนด",
    badge_information_quantity: "จำนวน",
    badge_information_blockchain: "บล็อกเชน",
    badge_assign_label: "กำหนดเหรียญตรา",
    badge_assign_placeholder: "เลือกผู้สนับสนุน",
    badge_assign_loading: "รอให้ตราที่กำหนดบนที่อยู่ {username} ถูกตั้งต้น",
    badge_assign_success:
      "ขอแสดงความยินดี! คุณได้กำหนดตราเรียบร้อยแล้วสำหรับ {username}",
    badge_assign_button: "กำหนด",
    badge_holders: "ผู้ถือเหรียญตรา",

    // settings
    settings_avatar: "อวาตาร์:",
    settings_username: "ชื่อผู้ใช้:",
    settings_wallet: "กระเป๋าเงิน:",
    settings_spam_filter: "กรองสแปม:",
    settings_change_button: "เปลี่ยน",
    settings_copy_button: "คัดลอก",
    settings_delete_account: "ลบบัญชีผู้ใช้งาน",

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
    alerts_sounds: "เสียงการบริจาค",
    alerts_duration: "ระยะเวลาเตือน:",
    alerts_duration_value: "{duration} วินาที",
    alerts_voice: "การแจ้งเตือนด้วยเสียง:",
    alerts_voice_male: "ชาย",
    alerts_voice_female: "หญิง",
    alerts_banners_model: "แบนเนอร์เตือนการบริจาคเริ่มต้น",
    alerts_preview_message: "ขอบคุณสำหรับการสตรีมของคุณ!",

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
    stats_widget_settings_сontent_alignment_left: "ชิดซ้าย",
    stats_widget_settings_сontent_alignment_center: "กึ่งกลาง",
    stats_widget_settings_сontent_alignment_right: "ชิดขวา",
    stats_widget_preview_message: "สวัสดี! นี่เป็นข้อความทดสอบ",
    stats_widget_preview_message_2: "สบายดีไหม?",

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

    // donat page
    donat_form_username: "ชื่อผู้ใช้ของคุณ",
    donat_form_switch_label: "เปิดใช้งานเพื่อเป็นนิรนาม",
    donat_form_message: "ข้อความถึง {username}",
    donat_form_amount: "จำนวนเงินบริจาค",
    donat_form_equal_usd: "เท่ากับ {convertedUsdSum} ดอลลาร์สหรัฐ",
    donat_form_goal_title: "เป้าหมายการบริจาค",
    donat_form_goal_description:
      "ช่วยให้ {username} บรรลุเป้าหมายการบริจาคของตนเอง",
    donat_form_goal_dont_participate: "ไม่ต้องการเข้าร่วม",
    donat_loading_message:
      "กรุณาอย่าปิดหน้าต่างนี้จนกว่าการยืนยันการบริจาคจะเสร็จสมบูรณ์",
    donat_success_message:
      "คุณได้ส่งเงินบริจาค {sum} {selectedBlockchain} ไปยัง {name} สำเร็จแล้ว",
    donat_success_message_description:
      "ตรวจสอบประวัติการบริจาคของคุณในส่วน «การบริจาค»",
    donat_warning_message_username_description:
      "ขออภัย ชื่อผู้ใช้นี้ถูกใช้ไปแล้ว โปรดป้อนชื่อผู้ใช้อื่น",
    donat_warning_message_balance_title: "ยอดเงินไม่เพียงพอ",
    donat_warning_message_balance_description:
      "ขออภัย ยอดเงินในบัญชีของคุณไม่เพียงพอที่จะดำเนินการนี้ได้",
    donat_warning_message_himself_title: "จริงหรือเปล่า?  ",
    donat_warning_message_himself_description:
      "คุณกำลังพยายามส่งเงินบริจาคให้ตัวเอง",

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
    upload_sound_label: "อัปโหลดเสียงที่กำหนดเอง +",

    // switch
    switch_abled: "เปิดใช้งาน",
    switch_disabled: "พิการ",

    // notifications
    notifications_no: "ไม่มีการแจ้งเตือน",
    notifications_title: "การแจ้งเตือน",
    notifications_clear: "ล้างทั้งหมด",
    notifications_donat_title: "ขนมโดนัทใหม่",
    notifications_badge_title: "เหรียญตราใหม่",
    notifications_donat_creator: "{user} ส่ง {sum} {blockchain} ถึงคุณ!",
    notifications_donat_supporter: "คุณส่ง {sum} {blockchain} ไปยัง {user}!",
    notifications_add_badge_creator: "คุณส่ง {title} ถึง {user}",
    notifications_add_badge_supporter: "คุณได้รับ {title} จาก {user}",

    // notification component
    notification_successfully_created: "สร้างข้อมูลสำเร็จแล้ว",
    notification_successfully_saved: "บันทึกข้อมูลสำเร็จแล้ว",
    notification_successfully_deleted: "ลบสำเร็จแล้ว",
    notification_successfully_title: "สำเร็จ",
    notification_user_not_found: "ไม่พบผู้ใช้ที่มีชื่อผู้ใช้นี้!",
    notification_file_limit_exceeded:
      "เกินขนาดไฟล์ที่กำหนด (สูงสุด - {maxFileSize}MB)",
    notification_not_filled: "ไม่ได้กรอกทุกช่อง",

    // empty
    empty_data: "ไม่มีข้อมูล",

    // inputs
    input_placeholder_email: "อีเมล",
    input_placeholder_username: "ชื่อผู้ใช้",
    input_placeholder_password: "รหัสผ่าน",
    input_placeholder_confirm_password: "ยืนยันรหัสผ่าน",

    // filters
    filter_today: "วันนี้",
    filter_7days: "7 วันที่ผ่านมา",
    filter_month: "เดือนที่ผ่านมา",
    filter_year: "ปีนี้",
    filter_current_year: "ปีปัจจุบัน",
    filter_yesterday: "เมื่อวานนี้",
    filter_all_time: "ตลอดเวลา",
    filter_custom: "วันที่กำหนดเอง",
    filter_top_donations: "การบริจาคยอดนิยม",
    filter_recent_donations: "การบริจาคล่าสุด",
    filter_top_supporters: "ผู้สนับสนุนยอดนิยม",

    // confirm popup
    confirm_sure: "คุณแน่ใจหรือไม่?",
    confirm_reset: "คุณแน่ใจหรือไม่ว่าต้องการรีเซ็ตเป็นการตั้งค่าเริ่มต้น?",
    confirm_cancel: "ยกเลิก",
    confirm_ok: "ตกลง",

    // copy
    copy_message_successfully: "{formatCopyObject} ถูกคัดลอกเรียบร้อยแล้ว",
    copy_message_error: "เกิดข้อผิดพลาดขณะคัดลอก {copyObject}",
    copy_message_wallet: "ที่อยู่กระเป๋าเงิน",
    copy_message_link: "ลิงก์",

    // dates picker
    dates_picker_placeholder_start: "วันที่เริ่มต้น",
    dates_picker_placeholder_end: "วันที่สิ้นสุด",
  },
  [LOCALES.PT]: {
    // reset
    reset_title: "Redefinir senha",
    reset_input_title:
      "Digite o endereço de email da sua conta para obter instruções.",
    reset_button: "Enviar",
    reset_send:
      "As instruções de redefinição de senha foram enviadas para o seu e-mail. Verifique sua caixa de entrada!",

    // change
    change_title: "Alterar sua senha",
    change_button: "Alterar",
    change_success: "Sucesso!",

    // registration
    registration_button: "Criar",
    sent_activation_link:
      "Enviamos um link de ativação para {email}. Verifique sua caixa de entrada!",
    registration_creator_title: "Junte-se ao Crypto Donutz!",
    registration_backer_title: "Digite seu nome de usuário",
    registration_have_account: "Já tem uma conta? ",
    registration_link: "Entrar",

    // login
    login_title: "Entrar no Crypto Donutz",
    login_button: "Entrar",
    login_no_account: "Não tem conta? ",
    login_link: "Criar uma",
    login_forgot: "Esqueceu a senha",

    // roles
    roles_title: "Quem é você?",
    roles_creator: "Criador de conteúdo",
    roles_supporter: "Apoiador",
    roles_button: "Continuar",

    // wallets modal
    wallets_connect_title: "Conectar carteira",

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
    export_button: "Exportar",
    filter_button: "Filtrar",
    save_changes_button: "Salvar alterações",
    reset_changes_button: "Redefinir",
    form_cancel_button: "Cancelar",
    form_save_widget_button: "Salvar widget",
    form_save_goal_button: "Salvar meta",
    create_badge_form_button: "Criar distintivo",
    sign_out_button: "Sair",

    // not found
    not_found_title: "Desculpe, a página que você visitou não existe.",
    not_found_button: "Voltar para a página principal",

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
      "Cadastre-se com seu e-mail, escolha um nome de usuário e registre sua conta.",
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

    // sidebar menu
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

    // page names
    title_reset_page: "Reset password",
    title_change_password_page: "Change password",
    title_resend_page: "Resend confirm email",
    title_donat_page: "Donat page",
    title_alert_page: "Donat alert page",
    title_goal_page: "Donat goal page",
    title_stat_page: "Donat stat page",

    // painel
    dashboard_widgets_stats: "Estatísticas",
    dashboard_widgets_stats_label: "Soma das doações",
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
    donation_default_banners: "Banners padrão {bannerType}",

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

    // badge page
    badge_image: "Imagem do crachá",
    badge_information_title: "Informações do crachá",
    badge_information_name: "Nome",
    badge_information_description: "Descrição",
    badge_information_assigned: "Atribuído",
    badge_information_quantity: "Quantidade",
    badge_information_blockchain: "Blockchain",
    badge_assign_label: "Atribuir crachá",
    badge_assign_placeholder: "Escolha um apoiador",
    badge_assign_loading:
      "Aguarde o crachá ser criado no endereço de {username}",
    badge_assign_success:
      "Parabéns! Você atribuiu o crachá a {username} com sucesso",
    badge_assign_button: "Atribuir",
    badge_holders: "Detentores de crachá",

    // settings
    settings_avatar: "Avatar:",
    settings_username: "Nome de usuário:",
    settings_wallet: "Carteira:",
    settings_spam_filter: "Filtro de spam:",
    settings_change_button: "Alterar",
    settings_copy_button: "Copiar",
    settings_delete_account: "Excluir conta",

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
    alerts_sounds: "Sons de doação",
    alerts_duration: "Duração do alerta:",
    alerts_duration_value: "{duration} seg",
    alerts_voice: "Alertas de voz:",
    alerts_voice_male: "Masculino",
    alerts_voice_female: "Feminino",
    alerts_banners_model: "Banners padrão de alerta de doação",
    alerts_preview_message: "Obrigado pela transmissão!",

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
    stats_widget_settings_сontent_alignment_left: "Esquerda",
    stats_widget_settings_сontent_alignment_center: "Centro",
    stats_widget_settings_сontent_alignment_right: "Direita",
    stats_widget_preview_message: "Olá! Esta é uma mensagem de teste",
    stats_widget_preview_message_2: "Como você está?",

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

    // donat page
    donat_form_username: "Seu nome de usuário",
    donat_form_switch_label: "Ativar para ser anônimo",
    donat_form_message: "Mensagem para {username}",
    donat_form_amount: "Valor da doação",
    donat_form_equal_usd: "Equivalente a {convertedUsdSum} USD",
    donat_form_goal_title: "Metas de doação",
    donat_form_goal_description:
      "Ajude {username} a alcançar suas metas de doação",
    donat_form_goal_dont_participate: "Não participar",
    donat_loading_message:
      "Por favor, não feche esta janela até a confirmação da doação",
    donat_success_message:
      "Você enviou com sucesso {sum} {selectedBlockchain} para {name}",
    donat_success_message_description:
      "Verifique seu histórico de doações na seção «Doações»",
    donat_warning_message_username_description:
      "Infelizmente, este nome de usuário já está em uso. Insira outro nome",
    donat_warning_message_balance_title: "Saldo insuficiente",
    donat_warning_message_balance_description:
      "Infelizmente, não há fundos suficientes em seu saldo para realizar esta operação",
    donat_warning_message_himself_title: "Sério? :)",
    donat_warning_message_himself_description:
      "Você está tentando enviar uma doação para si mesmo",

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
    upload_sound_label: "Carregar som personalizado +",

    // switch
    switch_abled: "Ativado",
    switch_disabled: "Desativado",

    // notifications
    notifications_no: "Sem notificações",
    notifications_title: "Notificações",
    notifications_clear: "Limpar tudo",
    notifications_donat_title: "Novo donut",
    notifications_badge_title: "Novo distintivo",
    notifications_donat_creator: "{user} enviou {sum} {blockchain} para você!",
    notifications_donat_supporter:
      "Você enviou {sum} {blockchain} para {user}!",
    notifications_add_badge_creator: "Você enviou {title} para {user}",
    notifications_add_badge_supporter: "Você recebeu {title} de {user}",

    // notification component
    notification_successfully_created: "Dados criados com sucesso",
    notification_successfully_saved: "Dados salvos com sucesso",
    notification_successfully_deleted: "Excluído com sucesso",
    notification_successfully_title: "Sucesso",
    notification_user_not_found:
      "Usuário com esse nome de usuário não encontrado!",
    notification_file_limit_exceeded:
      "Limite de tamanho do arquivo excedido (máx. - {maxFileSize}MB)",
    notification_not_filled: "Nem todos os campos foram preenchidos",

    // empty
    empty_data: "Sem dados",

    // inputs
    input_placeholder_email: "Email",
    input_placeholder_username: "Nome de usuário",
    input_placeholder_password: "Senha",
    input_placeholder_confirm_password: "Confirme a senha",

    // filters
    filter_today: "Hoje",
    filter_7days: "Últimos 7 dias",
    filter_month: "Últimos 30 dias",
    filter_year: "Este ano",
    filter_current_year: "Ano atual",
    filter_yesterday: "Ontem",
    filter_all_time: "Todos os tempos",
    filter_custom: "Data personalizada",
    filter_top_donations: "Maiores doações",
    filter_recent_donations: "Doações recentes",
    filter_top_supporters: "Principais apoiadores",

    // confirm popup
    confirm_sure: "Tem certeza?",
    confirm_reset:
      "Tem certeza de que deseja redefinir as configurações padrão?",
    confirm_cancel: "Cancelar",
    confirm_ok: "Ok",

    // copy
    copy_message_successfully: "{formatCopyObject} foi copiado com sucesso",
    copy_message_error: "Ocorreu um erro ao copiar {copyObject}",
    copy_message_wallet: "Endereço da carteira",
    copy_message_link: "Link",

    // dates picker
    dates_picker_placeholder_start: "Data de início",
    dates_picker_placeholder_end: "Data final",
  },

  [LOCALES.KR]: {
    // reset
    reset_title: "비밀번호 초기화",
    reset_input_title: "안내 메일을 받을 이메일 주소를 입력하세요.",
    reset_button: "보내기",
    reset_send:
      "비밀번호 재설정 안내가 이메일로 발송되었습니다. 받은 편지함을 확인해주세요!",

    // change
    change_title: "비밀번호 변경",
    change_button: "변경",
    change_success: "성공!",

    // registration
    registration_button: "생성",
    sent_activation_link:
      "{email}로 활성화 링크를 보냈습니다. 받은 편지함을 확인하세요!",
    registration_creator_title: "크립토 도넛즈 가입하기!",
    registration_backer_title: "사용자 이름 입력",
    registration_have_account: "이미 계정이 있으신가요? ",
    registration_link: "로그인",

    // login
    login_title: "크립토 도넛 로그인",
    login_button: "로그인",
    login_no_account: "계정이 없으신가요? ",
    login_link: "회원가입",
    login_forgot: "비밀번호를 잊으셨나요",

    // roles
    roles_title: "당신은 누구신가요?",
    roles_creator: "콘텐츠 크리에이터",
    roles_supporter: "서포터",
    roles_button: "계속하기",

    // wallets modal
    wallets_connect_title: "지갑 연결하기",

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
    export_button: "내보내기",
    filter_button: "필터",
    save_changes_button: "변경 사항 저장",
    reset_changes_button: "초기화",
    form_cancel_button: "취소",
    form_save_widget_button: "위젯 저장",
    form_save_goal_button: "목표 저장",
    create_badge_form_button: "배지 생성",
    sign_out_button: "로그아웃",

    // not found
    not_found_title: "죄송합니다, 방문하신 페이지는 존재하지 않습니다.",
    not_found_button: "메인 페이지로 돌아가기",

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
      "이메일로 가입하고 사용자 이름을 선택하여 계정을 등록하세요.",
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

    // page names
    title_reset_page: "비밀번호 재설정",
    title_change_password_page: "비밀번호 변경",
    title_resend_page: "확인 이메일 재발송",
    title_donat_page: "기부 페이지",
    title_alert_page: "기부 알림 페이지",
    title_goal_page: "기부 목표 페이지",
    title_stat_page: "기부 통계 페이지",

    // 대시보드
    dashboard_widgets_stats: "통계",
    dashboard_widgets_stats_label: "기부금액",
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
    donation_default_banners: "기본 {bannerType} 배너",

    // badges page
    badges_new_title: "지지자들을 위한 배지를 만들고 관리하십시오",
    badges_create_information_title: "배지 정보",
    badges_create_information_description: "필요한 정보를 입력하십시오",
    badges_create_information_blockhain: "블록체인",
    badges_create_information_input_name: "배지 이름",
    badges_create_information_input_description: "배지 설명",
    badges_success_modal_title: "축하합니다! 새로운 배지를 만들었습니다!",
    badges_success_modal_description:
      "그것을 클릭하고 지지자들에게 할당하세요.",

    // badge page
    badge_image: "배지 이미지",
    badge_information_title: "배지 정보",
    badge_information_name: "이름",
    badge_information_description: "설명",
    badge_information_assigned: "할당된",
    badge_information_quantity: "수량",
    badge_information_blockchain: "블록체인",
    badge_assign_label: "배지 할당",
    badge_assign_placeholder: "서포터 선택",
    badge_assign_loading:
      "배지가 {username} 주소에 성공적으로 민트될 때까지 기다려주세요.",
    badge_assign_success:
      "축하합니다! {username} 님에게 배지가 성공적으로 할당되었습니다.",
    badge_assign_button: "할당하기",
    badge_holders: "뱃지 소유자",

    // 설정
    settings_avatar: "아바타:",
    settings_username: "사용자 이름:",
    settings_wallet: "지갑:",
    settings_spam_filter: "스팸 필터:",
    settings_change_button: "변경",
    settings_copy_button: "복사",
    settings_delete_account: "계정 삭제하기",

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
    alerts_sounds: "기부금 소리",
    alerts_duration: "알림 지속 시간:",
    alerts_duration_value: "{duration} 초",
    alerts_voice: "음성 알림:",
    alerts_voice_male: "남성",
    alerts_voice_female: "여성",
    alerts_banners_model: "기본 기부 알림 배너",
    alerts_preview_message: "스트림을 시청해주셔서 감사합니다!",

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
    stats_widget_settings_сontent_alignment_left: "왼쪽",
    stats_widget_settings_сontent_alignment_center: "중앙",
    stats_widget_settings_сontent_alignment_right: "오른쪽",
    stats_widget_preview_message: "안녕하세요! 이것은 테스트 메시지입니다.",
    stats_widget_preview_message_2: "어떻게 지내시나요?",

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

    // donat page
    donat_form_username: "사용자 이름",
    donat_form_switch_label: "익명으로 기부하기",
    donat_form_message: "{username} 님에게 메시지 보내기",
    donat_form_amount: "기부 금액",
    donat_form_equal_usd: "{convertedUsdSum} USD와 동일",
    donat_form_goal_title: "기부 목표",
    donat_form_goal_description:
      "{username}님이 기부 목표를 달성할 수 있도록 도와주세요",
    donat_form_goal_dont_participate: "참여하지 않음",
    donat_loading_message: "기부가 확인될 때까지 이 창을 닫지 마세요",
    donat_success_message:
      "{name}님에게 {sum} {selectedBlockchain} 기부를 성공적으로 보냈습니다",
    donat_success_message_description: "«기부» 섹션에서 기부 기록을 확인하세요",
    donat_warning_message_username_description:
      "죄송합니다. 이 사용자 이름은 이미 사용 중입니다. 다른 이름을 입력하세요",
    donat_warning_message_balance_title: "잔액 부족",
    donat_warning_message_balance_description:
      "죄송합니다. 계정에 충분한 자금이 없어 이 작업을 수행할 수 없습니다",
    donat_warning_message_himself_title: "정말요?)",
    donat_warning_message_himself_description:
      "본인에게 기부를 보내려고 합니다",

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
    upload_sound_label: "사용자 정의 소리 업로드 +",

    // switch
    switch_abled: "활성화됨",
    switch_disabled: "비활성화됨",

    // notifications
    notifications_no: "알림 없음",
    notifications_title: "알림",
    notifications_clear: "모두 지우기",
    notifications_donat_title: "새로운 기부",
    notifications_badge_title: "새로운 배지",
    notifications_donat_creator: "{user}님이 {sum} {blockchain}을 보냈습니다!",
    notifications_donat_supporter:
      "{user}님에게 {sum} {blockchain}을 보냈습니다!",
    notifications_add_badge_creator: "{user}님께 {title} 배지를 보냈습니다",
    notifications_add_badge_supporter: "{user}님이 {title} 배지를 선물했습니다",

    // notification component
    notification_successfully_created: "데이터가 성공적으로 생성되었습니다",
    notification_successfully_saved: "데이터가 성공적으로 저장되었습니다",
    notification_successfully_deleted: "삭제되었습니다",
    notification_successfully_title: "성공",
    notification_user_not_found: "해당 사용자를 찾을 수 없습니다!",
    notification_file_limit_exceeded:
      "파일 크기 제한 초과 (최대 - {maxFileSize}MB)",
    notification_not_filled: "모든 필드를 채우지 않았습니다",

    // empty
    empty_data: "데이터 없음",

    // inputs
    input_placeholder_email: "이메일",
    input_placeholder_username: "사용자 이름",
    input_placeholder_password: "비밀번호",
    input_placeholder_confirm_password: "비밀번호 확인",

    // filters
    filter_today: "오늘",
    filter_7days: "지난 7일",
    filter_month: "지난 30일",
    filter_year: "올해",
    filter_current_year: "올해",
    filter_yesterday: "어제",
    filter_all_time: "모든 기간",
    filter_custom: "사용자 설정",
    filter_top_donations: "최고 기부",
    filter_recent_donations: "최근 기부",
    filter_top_supporters: "최고 후원자",

    // confirm popup
    confirm_sure: "확인하시겠습니까?",
    confirm_reset: "기본 설정으로 재설정하시겠습니까?",
    confirm_cancel: "취소",
    confirm_ok: "확인",

    // copy
    copy_message_successfully:
      "{formatCopyObject}이(가) 성공적으로 복사되었습니다",
    copy_message_error: "{copyObject} 복사 중 오류가 발생했습니다",
    copy_message_wallet: "지갑 주소",
    copy_message_link: "링크",

    // dates picker
    dates_picker_placeholder_start: "시작 날짜",
    dates_picker_placeholder_end: "종료 날짜",
  },
};

export default messages;
