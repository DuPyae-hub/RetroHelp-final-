export type Lang = 'en' | 'my'

export const translations = {
  en: {
    brand: 'RetroHelp',
    nav: {
      home: 'Home',
      findClinic: 'Find Clinic',
      library: 'Library',
      profile: 'Profile',
      staff: 'Staff desk',
      openMenu: 'Open menu',
      closeMenu: 'Close menu',
    },
    home: {
      eyebrow: 'Care that meets you where you are',
      title: 'You Are Not Alone',
      titleMy: 'သင်တစ်ယောက်တည်းမဟုတ်ပါ',
      subtitle:
        'Warm, confidential support for community members navigating care, clinics, and everyday questions.',
      cta: 'Find ART Center',
      ctaSupport: 'Quick Support Chat',
      confidenceTitle: 'Why you can trust RetroHelp',
      confidence1Title: '100% confidential',
      confidence1Body:
        'Community members use nicknames and internal IDs only—never legal names in the app—so your identity stays protected.',
      confidence2Title: 'Verified care',
      confidence2Body:
        'ART centres in our directory are verified with international partners such as AHF and The Union before they are listed.',
      confidence3Title: 'Community first',
      confidence3Body:
        'We use neutral, non-judgmental language throughout so you feel respected, not labelled.',
      topClinicsTitle: 'Top-ranked clinics',
      topClinicsSub:
        'Sorted using pill handout success (Given and Received) together with star ratings from community feedback.',
      viewDirections: 'View directions',
      clinicsLoading: 'Loading clinics…',
      clinicsEmpty: 'No clinics to show yet.',
      reviewsLabel: 'reviews',
      homeLibraryTitle: 'Mental support library',
      homeLibrarySub:
        'Short, welcoming reads on treatment routines and coping—education only, not a substitute for your care team.',
      readArticle: 'Read',
      closeArticle: 'Close',
      modalFootnote:
        'This information supports health literacy. Always follow your clinician for personal medical decisions.',
    },
    findClinic: {
      title: 'Find a clinic',
      description:
        'Search by township and area. Listings are ranked by completed visits from community members—without exposing personal details.',
      township: 'Township',
      area: 'Area',
      townshipPh: 'e.g. Yangon',
      areaPh: 'e.g. Downtown',
      submit: 'Search clinics',
      loading: 'Searching…',
      empty: 'No clinics match those filters yet. Try another township or area.',
      verified: 'Verified',
      visitsLabel: 'Completed visits',
      viewMap: 'Map & visit',
      mapSignInHint:
        'Sign in on your Profile with your nickname to open the map and optionally save this visit to your private history.',
      mapTitle: 'Center location',
      noCoords:
        'This listing has no map coordinates yet. You can still record your visit for your records.',
      recordVisit: 'Save visit to my records',
      recording: 'Saving…',
      visitSaved: 'Visit saved privately.',
      recordError: 'Could not save. Please try again.',
      selectHint: 'Choose a center after searching to view the map.',
    },
    library: {
      title: 'Resource library',
      description:
        'Trusted basics and care tips. Content is for education only—always follow your care team’s guidance.',
      basics: 'Basics',
      care: 'Care',
      loading: 'Loading articles…',
      emptyBasics: 'No basics articles yet.',
      emptyCare: 'No care articles yet.',
      readTime: 'Read',
    },
    profile: {
      title: 'Your profile',
      description:
        'This space is for community members. You deserve dignity, privacy, and support—never labels that define you.',
      cardTitle: 'Community Member',
      cardBody:
        'Account tools and history will appear here as we connect this area to the RetroHelp API.',
      privacyNote:
        'In production, traffic uses HTTPS. Your access credential stays in this browser only until you sign out. Community members are identified by nickname only—not legal names.',
      tabSignIn: 'Sign in',
      tabRegister: 'Create account',
      tabStaff: 'Staff',
      registerIntro:
        'Create a confidential account with a unique nickname and a strong password (at least 8 characters).',
      passwordConfirm: 'Confirm password',
      registerSubmit: 'Create account',
      nicknameLabel: 'Nickname (confidential)',
      nicknameHelp: 'Use a nickname only you recognize. It must be unique.',
      passwordLabel: 'Password',
      loginCommunity: 'Sign in',
      loginStaff: 'Sign in as staff',
      fullNameLabel: 'Full name (as registered)',
      saveNickname: 'Save nickname',
      saving: 'Saving…',
      loggedInAs: 'Signed in',
      logout: 'Sign out',
      staffHint: 'Staff sign-in uses your registered full name.',
      nicknameSaved: 'Nickname updated.',
    },
    staff: {
      title: 'Pending medication handouts',
      description:
        'Community members are shown by nickname only. Mark as Given when you physically hand over medication.',
      empty: 'No pending handouts right now.',
      markGiven: 'Mark as Given',
      working: 'Updating…',
      at: 'Center',
      member: 'Community member',
    },
    receipt: {
      title: 'Confirm receipt',
      subtitle:
        'Your clinic marked medication as given. Confirm here when you have received it.',
      at: 'Location',
      when: 'Handed out',
      confirm: 'Confirm receipt',
      busy: 'Confirming…',
      done: 'Thank you—your record is updated.',
      none: 'Nothing waiting for confirmation.',
    },
    footer: {
      quickLinks: 'Quick links',
      faq: 'FAQ',
      customerSupport: 'Customer support',
      aboutUs: 'About us',
      faqLead:
        'Answers about privacy, nicknames, how clinic search works, and what RetroHelp can and cannot do.',
      supportLead:
        'For technical problems or ideas to improve the platform, reach out through your usual project contact.',
      aboutLead:
        'RetroHelp links people to verified ART information with dignity-first language and confidential sign-in.',
      emergencyTitle: 'Need help right now?',
      emergencyBody:
        'If you or someone else is in immediate danger or severe distress, use trusted local emergency or psychosocial services. Hotlines differ by region—keep the numbers you already rely on nearby.',
      hotline1Label: 'Psychosocial / crisis line (add your local number)',
      hotline1Number: '—',
      hotline2Label: 'Medical / general emergency (example)',
      hotline2Number: '999',
      languageHeading: 'Language',
      rights: '© RetroHelp. All rights reserved.',
    },
    support: {
      open: 'Support',
      title: 'How can we help?',
      aiTab: 'AI Support',
      liveTab: 'Live Chat',
      comingSoon: 'Coming Soon',
      liveHint:
        'A human teammate will be available here soon. For emergencies, contact your clinic or local services.',
      aiHint:
        'This assistant gives general information only—not medical advice. For clinical questions, talk to your care team.',
      aiPlaceholder: 'Type your question…',
      send: 'Send',
      botName: 'RetroHelp Assistant',
      botWelcome:
        'Hello. I am here to listen and point you to general information. What would you like to know?',
      botReply:
        'Thank you for sharing that. I am a demo assistant and cannot give medical guidance. Please reach out to your clinic or trusted professional for personal care decisions. You can also browse the Library for educational articles.',
    },
    lang: {
      english: 'English',
      burmese: 'မြန်မာဘာသာ',
      toggle: 'ဘာသာစကား',
    },
  },
  my: {
    brand: 'RetroHelp',
    nav: {
      home: 'ပင်မစာမျက်နှာ',
      findClinic: 'ဆေးခန်းရှာရန်',
      library: 'လေ့လာရေးစာကြည့်တိုက်',
      profile: 'ကိုယ်ရေးအချက်အလက်',
      staff: 'စာရေးမှူးကွက်',
      openMenu: 'မီနူးဖွင့်ရန်',
      closeMenu: 'မီနူးပိတ်ရန်',
    },
    home: {
      eyebrow: 'သင့်နေရာမှ စတင်သည့် စောင့်ရှောက်မှု',
      title: 'You Are Not Alone',
      titleMy: 'သင်တစ်ယောက်တည်းမဟုတ်ပါ',
      subtitle:
        'စောင့်ရှောက်မှု၊ ဆေးခန်းများနှင့် နေ့စဉ်မေးခွန်းများအတွက် လျှို့ဝှက်စွာ၊ နွေးထွေးသော အကူအညီ။',
      cta: 'ART စင်တာရှာရန်',
      ctaSupport: 'အမြန်စကားပြောအကူအညီ',
      confidenceTitle: 'RetroHelp ကို ယုံကြည်ရခြင်း',
      confidence1Title: '၁၀၀% လျှို့ဝှက်',
      confidence1Body:
        'အဖွဲ့ဝင်များသည် အမည်ပြောင်နှင့် အတွင်းကုဒ်သာသုံးပြီး ဥပဒေအမည်ကို အက်ပ်တွင် မပြပါ။',
      confidence2Title: 'အတည်ပြုထားသော စောင့်ရှောက်မှု',
      confidence2Body:
        'စာရင်းတွင်ပါသော ART စင်တာများကို AHF နှင့် The Union ကဲ့သို့ နိုင်ငံတကာအဖွဲ့များနှင့် အတည်ပြုပြီးမှ ဖော်ပြပါသည်။',
      confidence3Title: 'အသိုင်းအဝိုင်း အရင်ထား',
      confidence3Body:
        'ဝက်ဘ်ဆိုက်တစ်လျှောက်လုံးတွင် လေးစားမှု၊ အပြစ်မတင်သော ဘာသာစကားများကိုသာ သုံးပါသည်။',
      topClinicsTitle: 'အဆင့်အမြင့်ဆုံး ဆေးခန်းများ',
      topClinicsSub:
        'ဆေးပေးမှုအောင်မြင်မှု (ပေးပြီး/လက်ခံမှု) နှင့် ကြယ်ပွင့်အကြံပြုချက်များဖြင့် စီပါသည်။',
      viewDirections: 'လမ်းညွှန်ကြည့်ရန်',
      clinicsLoading: 'ဆေးခန်းများ ဖတ်နေသည်…',
      clinicsEmpty: 'ပြသရန် ဆေးခန်းမရှိသေးပါ။',
      reviewsLabel: 'သုံးသပ်ချက်များ',
      homeLibraryTitle: 'စိတ်ပိုင်းဆိုင်ရာ ပံ့ပိုးမှု စာကြည့်တိုက်',
      homeLibrarySub:
        'ဆေးပုံစံနှင့် ခံစားချက်စီမံခန့်ခွဲမှု အကြောင်း ဖတ်ရှုရလွယ်ကူပြီး နွေးထွေးသော စာများ—ပညာရေးသာ၊ ဆရာဝန်ညွှန်ကြားချက်မဟုတ်ပါ။',
      readArticle: 'ဖတ်ရန်',
      closeArticle: 'ပိတ်ရန်',
      modalFootnote:
        'ဤအချက်အလက်များသည် ကျန်းမာရေးဗဟုသုတကို ပံ့ပိုးပါသည်။ ကိုယ်ရေးကိုယ်တာ ဆေးပညာဆုံးဖြတ်ချက်များအတွက် ဆရာဝန်ကို လိုက်နာပါ။',
    },
    findClinic: {
      title: 'ဆေးခန်းရှာရန်',
      description:
        'မြို့နယ်နှင့် နယ်မြေအလိုက် ရှာဖွေပါ။ အဖွဲ့ဝင်များ၏ ပြီးမြောက်သော လည်ပတ်မှုအရေအတွက်အရ စာရင်းပြုလုပ်ထားပြီး ကိုယ်ရေးကိုယ်တာအချက်အလက်များကို ထုတ်ဖော်ခြင်းမရှိပါ။',
      township: 'မြို့နယ်',
      area: 'နယ်မြေ',
      townshipPh: 'ဥပမာ ရန်ကုန်',
      areaPh: 'ဥပမာ လမ်းမတော်',
      submit: 'ဆေးခန်းရှာရန်',
      loading: 'ရှာဖွေနေသည်…',
      empty:
        'ရွေးချယ်ထားသော စစ်ထုတ်ချက်များနှင့် ကိုက်ညီသော ဆေးခန်းမရှိသေးပါ။ အခြားမြို့နယ် သို့မဟုတ် နယ်မြေဖြင့် စမ်းကြည့်ပါ။',
      verified: 'အတည်ပြုပြီး',
      visitsLabel: 'ပြီးမြောက်သော လည်ပတ်မှုများ',
      viewMap: 'မြေပုံနှင့် လည်ပတ်မှု',
      mapSignInHint:
        'မြေပုံကိုဖွင့်ပြီး မှတ်တမ်းတင်ရန် ကိုယ်ရေးအချက်အလက်တွင် အမည်ပြောင်ဖြင့် ဝင်ရောက်ပါ။',
      mapTitle: 'စင်တာနေရာ',
      noCoords:
        'ဤစာရင်းတွင် မြေပုံကိုဩဒိနိတ်မရှိသေးပါ။ မှတ်တမ်းတင်ခြင်းကို ဆက်လုပ်နိုင်ပါသည်။',
      recordVisit: 'ကျွန်ုပ်၏ မှတ်တမ်းသို့ သိမ်းရန်',
      recording: 'သိမ်းနေသည်…',
      visitSaved: 'လျှို့ဝှက်စွာ သိမ်းပြီးပါပြီ။',
      recordError: 'သိမ်းမရပါ။ ထပ်စမ်းပါ။',
      selectHint: 'ရှာပြီးနောက် စင်တာတစ်ခုကို ရွေးချယ်ပါ။',
    },
    library: {
      title: 'လေ့လာရေးစာကြည့်တိုက်',
      description:
        'ယုံကြည်စိတ်ချရသော အခြေခံဗဟုသုတနှင့် စောင့်ရှောက်မှု အကြံပြုချက်များ။ ပညာရေးအတွက်သာ—သင့်စောင့်ရှောက်ရေးအဖွဲ့၏ လမ်းညွှန်ချက်များကို အမြဲလိုက်နာပါ။',
      basics: 'အခြေခံဗဟုသုတ',
      care: 'စောင့်ရှောက်မှု',
      loading: 'ဆောင်းပါးများ ဖတ်နေသည်…',
      emptyBasics: 'အခြေခံဗဟုသုတ ဆောင်းပါးများ မရှိသေးပါ။',
      emptyCare: 'စောင့်ရှောက်မှု ဆောင်းပါးများ မရှိသေးပါ။',
      readTime: 'ဖတ်ရှု',
    },
    profile: {
      title: 'သင့်ကိုယ်ရေးအချက်အလက်',
      description:
        'ဤနေရာသည် အသိုင်းအဝိုင်း အဖွဲ့ဝင်များအတွက် ဖြစ်သည်။ လေးစားမှု၊ လျှို့ဝှက်မှုနှင့် အကူအညီကို သင်အရည်အချင်းရှိသည်ဟု သတ်မှတ်သော စကားလုံးများဖြင့် မဟုတ်ဘဲ ရရှိစေမည်။',
      cardTitle: 'အသိုင်းအဝိုင်း အဖွဲ့ဝင်',
      cardBody:
        'အကောင့်ကိရိယာများနှင့် မှတ်တမ်းများကို RetroHelp API နှင့် ချိတ်ဆက်သည့်အခါ ဤနေရာတွင်မည်ဖြစ်သည်။',
      privacyNote:
        'ထုတ်သုံးမှုတွင် HTTPS သုံးပါသည်။ ဝင်ရောက်ခွင့်လက်မှတ်ကို ဤဘရောက်ဇာတွင်သာ သိမ်းထားပြီး ထွက်သည့်အထိ သုံးပါသည်။ အဖွဲ့ဝင်များကို ဥပဒမည်မဟုတ်ဘဲ သင်ရွေးသော အမည်ပြောင်ဖြင့်သာ ခွဲခြားပါသည်။',
      tabSignIn: 'ဝင်ရောက်ရန်',
      tabRegister: 'အကောင့်ဖွင့်ရန်',
      tabStaff: 'ဝန်ထမ်း',
      registerIntro:
        'ထူးခြားသော အမည်ပြောင်နှင့် စကားဝှက် အနည်းဆင်း ၈ လုံးဖြင့် လျှို့ဝှက်အကောင့်ဖွင့်ပါ။',
      passwordConfirm: 'စကားဝှက်အတည်ပြုရန်',
      registerSubmit: 'အကောင့်ဖွင့်ရန်',
      nicknameLabel: 'အမည်ပြောင် (လျှို့ဝှက်)',
      nicknameHelp: 'သင်သိသော အမည်ပြောင်ကိုသာ သုံးပါ။ ထူးခြားမှုရှိရမည်။',
      passwordLabel: 'စကားဝှက်',
      loginCommunity: 'ဝင်ရောက်ရန်',
      loginStaff: 'ဝန်ထမ်းအနေဖြင့် ဝင်ရောက်ရန်',
      fullNameLabel: 'မှတ်ပုံတင်ထားသော အပြည့်အစုံ အမည်',
      saveNickname: 'အမည်ပြောင်သိမ်းရန်',
      saving: 'သိမ်းနေသည်…',
      loggedInAs: 'ဝင်ရောက်ထား',
      logout: 'ထွက်ရန်',
      staffHint: 'ဝန်ထမ်းဝင်ရောက်မှုတွင် မှတ်ပုံတည်အပြည့်အစုံကို သုံးပါ။',
      nicknameSaved: 'အမည်ပြောင် ပြင်ဆင်ပြီးပါပြီ။',
    },
    staff: {
      title: 'ဆေးပေးရန် စောင့်ဆိုင်းမှုများ',
      description:
        'အဖွဲ့ဝင်များကို အမည်ပြောင်ဖြင့်သာ ပြပါသည်။ ဆေးကို လက်တွေ့ပေးသည့်အခါ ပေးပြီးကြောင်း မှတ်သားပါ။',
      empty: 'စောင့်ဆိုင်းမှု မရှိပါ။',
      markGiven: 'ပေးပြီးအဖြစ် မှတ်ရန်',
      working: 'ပြင်ဆင်နေသည်…',
      at: 'စင်တာ',
      member: 'အဖွဲ့ဝင်',
    },
    receipt: {
      title: 'လက်ခံမှုအတည်ပြုရန်',
      subtitle:
        'ဆေးခန်းက ဆေးပေးပြီးကြောင်း မှတ်သားထားပါသည်။ လက်ခံပြီးပါက ဤနေရာတွင် အတည်ပြုပါ။',
      at: 'နေရာ',
      when: 'ပေးသည့်အချိန်',
      confirm: 'လက်ခံမှုအတည်ပြုရန်',
      busy: 'အတည်ပြုနေသည်…',
      done: 'ကျေးဇူးတင်ပါသည်—မှတ်တမ်းပြင်ဆင်ပြီးပါပြီ။',
      none: 'အတည်ပြုရန် စောင့်ဆိုင်းမှု မရှိပါ။',
    },
    footer: {
      quickLinks: 'လင့်ခ်များ',
      faq: 'မေးခွန်းများ',
      customerSupport: 'ဖောက်သည်ပံ့ပိုးမှု',
      aboutUs: 'ကျွန်ုပ်တို့အကြောင်း',
      faqLead:
        'လျှို့ဝှက်မှု၊ အမည်ပြောင်၊ ဆေးခန်းရှာဖွေမှု၊ RetroHelp လုပ်နိုင်သည်နှင့် မလုပ်နိုင်သည်များ။',
      supportLead:
        'နည်းပညာပြဿနာများ သို့မဟုတ် ပလက်ဖောင်းတိုးတက်ရေးအတွက် ပရောဂျက်ဆက်သွယ်ရမည့်သူကို ဆက်သွယ်ပါ။',
      aboutLead:
        'RetroHelp သည် လေးမြတ်မှုအရင်ထားသော ဘာသာစကားနှင့် လျှို့ဝှက်ဝင်ရောက်မှုဖြင့် ART အချက်အလက်များကို ချိတ်ဆက်ပေးသည်။',
      emergencyTitle: 'အရေးပေါ်အကူအညီ လိုအပ်ပါသလား။',
      emergencyBody:
        'သင်ဒါမှမဟုတ် တစ်စုံတစ်ယောက်က အန္တရာယ် သို့မဟုတ် စိတ်ကျပ်တည်းမှုပြင်းထန်ပါက ယုံကြည်ရသော ဒေသတွင်း အရေးပေါ် သို့မဟုတ် စိတ်ပိုင်းဆိုင်ရာ ဝန်ဆောင်မှုများကို သုံးပါ။ ဖုန်းနံပါတ်များသည် ဒေသအလိုက် ကွဲပြားပါသည်။',
      hotline1Label: 'စိတ်ပိုင်းဆိုင်ရာ / အရေးပေါ် (ဒေသနံပါတ် ထည့်ပါ)',
      hotline1Number: '—',
      hotline2Label: 'ဆေးပညာ အရေးပေါ် (ဥပမာ)',
      hotline2Number: '999',
      languageHeading: 'ဘာသာစကား',
      rights: '© RetroHelp။ မူပိုင်ခွင့်ရှိပါသည်။',
    },
    support: {
      open: 'အကူအညီ',
      title: 'ဘယ်လိုကူညီရမလဲ။',
      aiTab: 'AI အကူအညီ',
      liveTab: 'တိုက်ရိုက်စကားပြော',
      comingSoon: 'မကြာမီ ဖွင့်ပါမည်',
      liveHint:
        'လူသားအဖွဲ့ဝင်ကို ဤနေရာတွင် မကြာမီ ဆက်သွယ်နိုင်မည်ဖြစ်သည်။ အရေးကြီးသော အခြေအနေများတွင် ဆေးခန်းကို ဆက်သွယ်ပါ။',
      aiHint:
        'ဤအကူအညီပေးသူသည် အထွေထွေအချက်အလက်များကိုသာ ပေးပါသည်—ဆေးပညာဆိုင်ရာ အကြံပြုချက် မဟုတ်ပါ။ ဆေးပညာဆိုင်ရာ မေးခွန်းများအတွက် သင့်စောင့်ရှောက်ရေးအဖွဲ့နှင့် တိုင်ပင်ပါ။',
      aiPlaceholder: 'မေးခွန်းရိုက်ထည့်ပါ…',
      send: 'ပို့ရန်',
      botName: 'RetroHelp အကူအညီပေးသူ',
      botWelcome:
        'မင်္ဂလာပါ။ အထွေထွေအချက်အလက်များသို့ ညွှန်ပြရန် ဤနေရာတွင် ရှိပါသည်။ ဘာသိလိုပါသလဲ။',
      botReply:
        'မျှဝေပေးသည့်အတွက် ကျေးဇူးတင်ပါသည်။ ကျွန်ုပ်သည် စမ်းသပ်အကူအညီပေးသူဖြစ်ပြီး ဆေးပညာဆိုင်ရာ လမ်းညွှန်ချက်ပေးနိုင်ခြင်းမရှိပါ။ ကိုယ်ရေးကိုယ်တာ စောင့်ရှောက်မှု ဆုံးဖြတ်ချက်များအတွက် ဆေးခန်းကို ဆက်သွယ်ပါ။ ပညာရေးဆောင်းပါးများအတွက် စာကြည့်တိုက်ကို လည်းကြည့်ရှုနိုင်ပါသည်။',
    },
    lang: {
      english: 'English',
      burmese: 'မြန်မာဘာသာ',
      toggle: 'Language',
    },
  },
} as const

export type TranslationTree = (typeof translations)[Lang]
