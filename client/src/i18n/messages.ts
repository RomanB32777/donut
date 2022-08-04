import { LOCALES } from "./locales";

const messages = {
    [LOCALES.ENGLISH]: {

        // reg modal
            registration_modal_title: 'Are you creator or supporter?',
            registration_modal_card_creator_title: 'Creator',
            registration_modal_card_backer_title: 'Supporter',
            registration_modal_input_title: 'Please enter your username (you cannot change it in future):',
            registration_modal_input_placeholder: '@username',
            registration_modal_input_button: 'Register',
            registration_modal_input_username_error: 'Unfortunately, this username is already busy. Enter another one',
        // mainpage
            mainpage_main_title: 'Grab your Donutz!',
            mainpage_main_button: 'Sign up with Tron link',
            mainpage_main_button_logged: 'Go to profile',

            mainpage_crypto_steps_title: 'Crypto donations in 3 steps',
            mainpage_crypto_steps_step_one_title: 'Sign-up with Tron link',
            mainpage_crypto_steps_step_one_subtitle: 'Connect your wallet and create account',
            mainpage_crypto_steps_step_two_title: 'Create donation link',
            mainpage_crypto_steps_step_two_subtitle: 'Just a couple of clicks and you’re good to go',
            mainpage_crypto_steps_step_three_title: 'Let your audience know',
            mainpage_crypto_steps_step_three_subtitle: 'Give this link to your audience and enjoy your Donutz',

            mainpage_submocup_title: '300+ mln people have crypto wallets',

            mainpage_features_title: 'Features',
            mainpage_feature_one_title: 'Donation reports',
            mainpage_feature_one_subtitle: 'Check stats for any period of time and see who are your top supporters',
            mainpage_feature_two_title: 'Audience interaction',
            mainpage_feature_two_subtitle: 'Mark your supporters with special badge you’ve created  to make them feel special',
            mainpage_feature_three_title: 'NFT profile',
            mainpage_feature_three_subtitle: 'Share NFT collections you’ve created. Just load them to your profile',

            mainpage_donut_mocup_title: '1% bite is all it takes',
            mainpage_donut_mocup_subtitle: 'It’s the lowest commission on the market',

            mainpage_bottom_panel_title: 'Let your audience support you and  enjoy your Donutz',
            mainpage_bottom_panel_button: 'Sign-up now',

        //navbar
            navbar_search_placeholder: 'Search creators',


        // create badge page
            create_badge_title: 'CREATE NEW BADGE',
            create_badge_subtitle: 'What is badge? Badge is some sort of role that you can assign to your supporter. Badge can give access to some private materials or access to limited chat or server',
            create_badge_form_icon_title: 'Choose the badge icon',
            create_badge_form_name_title: 'Name',
            create_badge_form_name_placeholder: 'What’s the name of your badge?',
            create_badge_form_desc_title: 'Description',
            create_badge_form_desc_placeholder: 'Please describe your badge allows to your supporters',
            create_badge_form_link_title: 'Link',
            create_badge_form_link_subtitle: 'In case you have an external link with additional information about this badge, you can paste it down here',
            create_badge_form_link_placeholder: 'Link',
            create_badge_form_quantity_title: 'Quantity',
            create_badge_form_quantity_placeholder: 'How many badges of this kind you want to create?',
            create_badge_form_button: 'Create badge',

        // page titles
            page_title_my_profile: 'MY PROFILE',
            page_title_badges: 'BADGES',
            page_title_creators: 'CREATORS',
            page_title_followers: 'FOLLOWERS',
            page_title_following: 'FOLLOWING',
            page_title_transactions: 'TRANSACTIONS',

        // badges page
            new_badge_page_file_load_title: 'Upload badge',
            new_badge_page_file_load_subtitle: 'Please use 32x32px image',
            badges_page_new_title: 'Create and manage the Badges for your supporters',
            badges_page_new_button: 'Create a badge',
            badges_page_table_header_icon: 'Icon',
            badges_page_table_header_badge: 'Badge Name',
            badges_page_table_header_qnt: 'QNT',
            badges_page_table_header_info: 'Info',

        // profile form 
            //titles
                profile_form_title_name: 'Name',
                profile_form_title_username: 'Username',
                profile_form_title_wallet: 'Wallet',
                profile_form_title_socials: 'Socials',
            profile_form_save_button: 'Save',
            profile_form_file_title: 'Load avatar image',
            profile_form_file_subtitle: 'Please use 600x600px image',
        
        // profile info
            profile_info_support_button: 'Support',
            profile_info_follow_button: 'Follow',
            profile_info_following: 'Followed',
            profile_info_background_title: 'Please use 1140x192px image',
            
            profile_info_navigating_supporters: 'SUPPORTERS',
            profile_info_navigating_nft: 'NFT',

        // nft
            nft_page_title: 'Check out  NFT collections created by ',
            nft_page_title_none: 'Creator hasn’t shared any NFT collections yet',
        
        // supporters
            supporters_toggle_list_first_title: 'TOP 5 SUPPORTERS ALL TIME',
            supporters_toggle_list_second_title: 'LATEST DONATIONS',

        // nft page
            nft_page_header_title: 'Upload the NFT collections you’ve created',
            nft_page_header_button: 'Share  collection',
        // new nft page
            new_nft_page_title: 'SHARE NFT COLLECTION',

            new_nft_page_file_load_title: 'Upload NFT image',
            new_nft_page_file_load_subtitle: 'File types supported: JPG, PNG, SVG. Size <= 5MB',

            new_nft_page_form_input_title_name: 'Name',
            new_nft_page_form_input_placeholder_name: 'What’s the name of your item?',
            new_nft_page_form_input_title_desc: 'Description',
            new_nft_page_form_input_placeholder_desc: 'Please describe your item here',
            new_nft_page_form_input_title_link: 'Link',
            new_nft_page_form_input_subtitle_link: 'In case you have an external link with additional information about this item, you can paste it down here',
            new_nft_page_form_input_placeholder_link: 'Link',

            new_nft_page_under_text: 'Your NFT will be minted on Tron Blockchain',
            new_nft_page_button: 'Share item',

        // supporters page
            supporters_page_title: 'SUPPORTERS',
            supporters_aud_info_title: 'Let your audience support you. Give the link below to your audience and start getting donations!',
            supporters_aud_info_subtitle: 'Link for you supporters',
            supporters_popup_title: 'Add badge',
            
            supporters_calendar_title: 'Set up the time period you want to see your donations for',
            supporters_calendar_button: 'Choose the period',
        
        // backers page
            backers_page_sum_title: 'TOTAL DONATIONS SENT',
            backers_page_top_donations_title: 'TOP DONATIONS',

        // followers page
            followers_page_message_title: 'You don’t have any followers',
            followers_page_message_subtitle: 'You can get them if you create more NFT',
            followers_page_button: 'Create NFT',
        // followers page
            follows_page_message_title: 'Now you don`t have any follows',
            follows_page_button: 'Find creators',
        
        // transactions page 
            transactions_page_no_transactions: 'You haven’t sent any donations yet',

        // footer
            footer: 'Copyright © 2022 Crypto Donutz. All rights reserved.',

    }
}

export default messages