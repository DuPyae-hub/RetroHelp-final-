export type Lang = 'en' | 'my'

export const translations = {
  en: {
    brand: 'RetroHelp',
    nav: {
      home: 'Home',
      findClinic: 'Find Clinic',
      library: 'Library',
      profile: 'Profile',
      search: 'Search',
      staff: 'Staff desk',
      openMenu: 'Open menu',
      closeMenu: 'Close menu',
    },
    home: {
      eyebrow: 'Care that meets you where you are',
      title: 'You Are Not Alone',
      subtitle:
        'Warm, confidential support for community members navigating care, clinics, and everyday questions.',
      cta: 'Find ART Center',
      trust: 'Private · Respectful · Here for you',
      trust1: 'Private',
      trust2: 'Respectful',
      trust3: 'Here for you',
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
    search: {
      title: 'Search',
      description: 'Look up ART centers the same way—township and area only, privacy-first.',
      hint: 'Tip: start broad, then narrow by area.',
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
      signIn: 'Sign in (coming soon)',
      privacyNote:
        'Sessions use HTTPS in production. Tokens stay in your browser session only. We never show legal names for community members—only nicknames you choose.',
      nicknameLabel: 'Nickname (confidential)',
      nicknameHelp: 'Use a nickname only you recognize. It must be unique.',
      passwordLabel: 'Password',
      loginCommunity: 'Sign in as community member',
      loginStaff: 'Sign in as clinic staff',
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
      search: 'ရှာဖွေရန်',
      staff: 'စာရေးမှူးကွက်',
      openMenu: 'မီနူးဖွင့်ရန်',
      closeMenu: 'မီနူးပိတ်ရန်',
    },
    home: {
      eyebrow: 'သင့်နေရာမှ စတင်သည့် စောင့်ရှောက်မှု',
      title: 'သင်တစ်ဦးတည်းမဟုတ်ပါ',
      subtitle:
        'စောင့်ရှောက်မှု၊ ဆေးခန်းများနှင့် နေ့စဉ်မေးခွန်းများအတွက် လျှို့ဝှက်စွာ၊ နွေးထွေးသော အကူအညီ။',
      cta: 'ART စင်တာရှာရန်',
      trust: 'လျှို့ဝှက် · လေးစားမှု · သင့်ဘေးတွင်',
      trust1: 'လျှို့ဝှက်',
      trust2: 'လေးစားမှု',
      trust3: 'သင့်ဘေးတွင်',
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
    search: {
      title: 'ရှာဖွေရန်',
      description:
        'တူညီစွာ—မြို့နယ်နှင့် နယ်မြေသာလျှင်၊ ကိုယ်ရေးလျှို့ဝှက်မှုကို အလေးထားပါ။',
      hint: 'အကြံပြုချက်—အကျယ်အပြန့်မှ စတင်ပြီး နယ်မြေဖြင့် ကျဉ်းပါ။',
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
      signIn: 'ဝင်ရောက်ရန် (မကြာမီ)',
      privacyNote:
        'ထုတ်သုံးမှုတွင် HTTPS သုံးပါသည်။ လက်မှတ်ကို ဘရောက်ဇာဆက်ရှင်တွင်သာ သိမ်းပါသည်။ အဖွဲ့ဝင်များအတွက် ဥပဒမည်မဟုတ်ဘဲ သင်ရွေးသော အမည်ပြောင်ကိုသာ ပြပါသည်။',
      nicknameLabel: 'အမည်ပြောင် (လျှို့ဝှက်)',
      nicknameHelp: 'သင်သိသော အမည်ပြောင်ကိုသာ သုံးပါ။ ထူးခြားမှုရှိရမည်။',
      passwordLabel: 'စကားဝှက်',
      loginCommunity: 'အဖွဲ့ဝင်အနေဖြင့် ဝင်ရောက်ရန်',
      loginStaff: 'ဆေးခန်းဝန်ထမ်းအနေဖြင့် ဝင်ရောက်ရန်',
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
